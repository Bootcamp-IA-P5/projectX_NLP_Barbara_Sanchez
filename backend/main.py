"""
API REST para detección de hate speech en comentarios de YouTube.

Esta API permite a un frontend (en otro repo) consultar si un mensaje
es o no de odio usando el modelo optimizado entrenado.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import sys
from pathlib import Path

# Añadir src al path para imports
backend_root = Path(__file__).parent
src_path = backend_root / 'src'
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

# Importar módulo de predicción (desde src/api/predict.py)
try:
    from api.predict import load_predictor, HateSpeechPredictor
except ImportError as e:
    # Si falla, intentar import directo
    import importlib.util
    spec = importlib.util.spec_from_file_location(
        "api.predict", 
        src_path / "api" / "predict.py"
    )
    predict_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(predict_module)
    load_predictor = predict_module.load_predictor
    HateSpeechPredictor = predict_module.HateSpeechPredictor

# Importar módulo de YouTube
try:
    from utils.youtube import analyze_video_comments, extract_video_id
    YOUTUBE_AVAILABLE = True
except ImportError:
    YOUTUBE_AVAILABLE = False
    print("⚠️  Módulo de YouTube no disponible")

# Importar módulos de BD y MLFlow
try:
    from utils.database import get_db_manager
    from utils.mlflow_tracking import get_tracker
    DB_AVAILABLE = True
except ImportError as e:
    DB_AVAILABLE = False
    print(f"⚠️  Módulos de BD/MLFlow no disponibles: {e}")

# Inicializar gestores de BD y MLFlow
if DB_AVAILABLE:
    db_manager = get_db_manager()
    mlflow_tracker = get_tracker()
else:
    db_manager = None
    mlflow_tracker = None

# Inicializar FastAPI
app = FastAPI(
    title="Hate Speech Detection API",
    description="API REST para detectar mensajes de odio en comentarios de YouTube",
    version="1.0.0"
)

# Configurar CORS para permitir requests desde frontend
# En producción, usar variable de entorno FRONTEND_URL o permitir todos
import os
frontend_url = os.getenv("FRONTEND_URL", "*")
allowed_origins = [frontend_url] if frontend_url != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar modelo al iniciar
try:
    predictor = load_predictor()
    print("✅ API iniciada correctamente")
except Exception as e:
    print(f"❌ Error al cargar modelo: {e}")
    predictor = None


# Modelos Pydantic para request/response
class TextRequest(BaseModel):
    """Request para predecir un texto"""
    text: str = Field(..., description="Texto a analizar", min_length=1, max_length=5000)
    
    class Config:
        json_schema_extra = {
            "example": {
                "text": "This video is amazing! Great content!"
            }
        }


class BatchTextRequest(BaseModel):
    """Request para predecir múltiples textos"""
    texts: List[str] = Field(..., description="Lista de textos a analizar", min_items=1, max_items=100)
    
    class Config:
        json_schema_extra = {
            "example": {
                "texts": [
                    "This video is amazing!",
                    "You are stupid and should die"
                ]
            }
        }


class PredictionResponse(BaseModel):
    """Response con predicción"""
    text: str
    is_toxic: bool
    toxicity_label: str
    probability_toxic: float
    probability_not_toxic: float
    confidence: float
    
    class Config:
        json_schema_extra = {
            "example": {
                "text": "This video is amazing!",
                "is_toxic": False,
                "toxicity_label": "Not Toxic",
                "probability_toxic": 0.15,
                "probability_not_toxic": 0.85,
                "confidence": 0.85
            }
        }


class HealthResponse(BaseModel):
    """Response de health check"""
    status: str
    model_loaded: bool


class YouTubeVideoRequest(BaseModel):
    """Request para analizar comentarios de un video de YouTube"""
    video_url: str = Field(..., description="URL del video de YouTube")
    max_comments: int = Field(100, description="Número máximo de comentarios a analizar", ge=1, le=500)
    sort_by: str = Field("top", description="Orden de comentarios: 'top', 'time', 'relevance'")
    
    class Config:
        json_schema_extra = {
            "example": {
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "max_comments": 100,
                "sort_by": "top"
            }
        }


class CommentAnalysis(BaseModel):
    """Análisis de un comentario individual"""
    comment_id: str
    text: str
    author: str
    likes: int
    time: str
    reply_count: int
    is_toxic: bool
    toxicity_label: str
    probability_toxic: float
    confidence: float


class VideoAnalysisResponse(BaseModel):
    """Response con análisis completo del video"""
    video_id: str
    video_url: str
    total_comments: int
    toxic_count: int
    non_toxic_count: int
    toxic_percentage: float
    comments: List[CommentAnalysis]
    
    class Config:
        json_schema_extra = {
            "example": {
                "video_id": "dQw4w9WgXcQ",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "total_comments": 100,
                "toxic_count": 15,
                "non_toxic_count": 85,
                "toxic_percentage": 15.0,
                "comments": []
            }
        }


# Endpoints
@app.get("/", tags=["General"])
async def root():
    """Endpoint raíz con información de la API"""
    return {
        "message": "Hate Speech Detection API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health", response_model=HealthResponse, tags=["General"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy" if predictor is not None else "unhealthy",
        "model_loaded": predictor is not None
    }


@app.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
async def predict_text(request: TextRequest):
    """
    Predecir si un texto es hate speech.
    
    - **text**: Texto a analizar (máximo 5000 caracteres)
    
    Returns:
    - **is_toxic**: True si es tóxico, False si no
    - **toxicity_label**: "Toxic" o "Not Toxic"
    - **probability_toxic**: Probabilidad de ser tóxico (0-1)
    - **probability_not_toxic**: Probabilidad de no ser tóxico (0-1)
    - **confidence**: Confianza de la predicción (0-1)
    """
    if predictor is None:
        raise HTTPException(status_code=503, detail="Modelo no cargado")
    
    try:
        result = predictor.predict(request.text)
        
        # Guardar en BD si está disponible
        if db_manager:
            try:
                db_manager.save_prediction(
                    text=result['text'],
                    is_toxic=result['is_toxic'],
                    toxicity_label=result['toxicity_label'],
                    probability_toxic=result['probability_toxic'],
                    probability_not_toxic=result['probability_not_toxic'],
                    confidence=result['confidence'],
                    source='api'
                )
            except Exception as e:
                print(f"⚠️  Error al guardar en BD: {e}")
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar texto: {str(e)}")


@app.post("/predict/batch", response_model=List[PredictionResponse], tags=["Prediction"])
async def predict_batch(request: BatchTextRequest):
    """
    Predecir múltiples textos en batch.
    
    - **texts**: Lista de textos a analizar (máximo 100 textos)
    
    Returns:
    - Lista de predicciones para cada texto
    """
    if predictor is None:
        raise HTTPException(status_code=503, detail="Modelo no cargado")
    
    if len(request.texts) > 100:
        raise HTTPException(status_code=400, detail="Máximo 100 textos por request")
    
    try:
        results = predictor.predict_batch(request.texts)
        
        # Guardar en BD si está disponible
        if db_manager:
            try:
                db_manager.save_batch_predictions(
                    predictions=results,
                    source='batch'
                )
                
                # Logear estadísticas en MLFlow
                if mlflow_tracker:
                    toxic_count = sum(1 for r in results if r['is_toxic'])
                    avg_confidence = sum(r['confidence'] for r in results) / len(results) if results else 0
                    mlflow_tracker.log_prediction_batch(
                        predictions_count=len(results),
                        toxic_count=toxic_count,
                        avg_confidence=avg_confidence,
                        source='batch'
                    )
            except Exception as e:
                print(f"⚠️  Error al guardar en BD/MLFlow: {e}")
        
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar textos: {str(e)}")


@app.post("/analyze/youtube", response_model=VideoAnalysisResponse, tags=["YouTube"])
async def analyze_youtube_video(request: YouTubeVideoRequest):
    """
    Analizar comentarios de un video de YouTube.
    
    Extrae comentarios de un video y aplica el modelo de detección de hate speech.
    
    - **video_url**: URL del video de YouTube
    - **max_comments**: Número máximo de comentarios a analizar (1-500)
    - **sort_by**: Orden de comentarios ('top', 'time', 'relevance')
    
    Returns:
    - Análisis completo con estadísticas y predicciones para cada comentario
    """
    if predictor is None:
        raise HTTPException(status_code=503, detail="Modelo no cargado")
    
    if not YOUTUBE_AVAILABLE:
        raise HTTPException(
            status_code=503, 
            detail="Módulo de YouTube no disponible. Instala: pip install youtube-comment-downloader"
        )
    
    try:
        # Extraer ID del video
        video_id = extract_video_id(request.video_url)
        if not video_id:
            raise HTTPException(status_code=400, detail="No se pudo extraer el ID del video de la URL")
        
        # Analizar comentarios
        # Siempre usar 'top' como sort_by para evitar bugs de la librería
        try:
            df = analyze_video_comments(
                request.video_url,
                predictor,
                max_comments=min(request.max_comments, 50),  # Limitar a 50 máximo
                sort_by='top'  # Siempre usar 'top' para estabilidad
            )
        except RuntimeError as e:
            # Error específico de extracción de comentarios
            error_msg = str(e)
            print(f"❌ Error al analizar video: {error_msg}")
            raise HTTPException(status_code=400, detail=error_msg)
        except Exception as e:
            # Otro tipo de error
            error_msg = str(e)
            print(f"❌ Error inesperado al analizar video: {error_msg}")
            import traceback
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Error al analizar video: {error_msg}")
        
        if df.empty:
            raise HTTPException(status_code=404, detail="No se encontraron comentarios en el video")
        
        # Convertir a formato de respuesta
        comments = []
        for _, row in df.iterrows():
            comments.append(CommentAnalysis(
                comment_id=str(row.get('comment_id', '')),
                text=str(row.get('text', '')),
                author=str(row.get('author', '')),
                likes=int(row.get('likes', 0)),
                time=str(row.get('time', '')),
                reply_count=int(row.get('reply_count', 0)),
                is_toxic=bool(row.get('is_toxic', False)),
                toxicity_label=str(row.get('toxicity_label', 'Not Toxic')),
                probability_toxic=float(row.get('probability_toxic', 0.0)),
                confidence=float(row.get('confidence', 0.0))
            ))
        
        toxic_count = df['is_toxic'].sum()
        toxic_percentage = (toxic_count / len(df)) * 100 if len(df) > 0 else 0
        
        # Guardar predicciones en BD si está disponible
        if db_manager:
            try:
                predictions_to_save = []
                for _, row in df.iterrows():
                    predictions_to_save.append({
                        'text': str(row.get('text', '')),
                        'is_toxic': bool(row.get('is_toxic', False)),
                        'toxicity_label': str(row.get('toxicity_label', 'Not Toxic')),
                        'probability_toxic': float(row.get('probability_toxic', 0.0)),
                        'probability_not_toxic': float(row.get('probability_not_toxic', 0.0)),
                        'confidence': float(row.get('confidence', 0.0))
                    })
                
                db_manager.save_batch_predictions(
                    predictions=predictions_to_save,
                    source='youtube',
                    video_id=video_id
                )
                
                # Logear estadísticas en MLFlow
                if mlflow_tracker:
                    avg_confidence = df['confidence'].mean() if not df.empty else 0
                    mlflow_tracker.log_prediction_batch(
                        predictions_count=len(df),
                        toxic_count=int(toxic_count),
                        avg_confidence=float(avg_confidence),
                        source='youtube'
                    )
            except Exception as e:
                print(f"⚠️  Error al guardar predicciones de YouTube en BD: {e}")
        
        return VideoAnalysisResponse(
            video_id=video_id,
            video_url=request.video_url,
            total_comments=len(df),
            toxic_count=int(toxic_count),
            non_toxic_count=int(len(df) - toxic_count),
            toxic_percentage=round(toxic_percentage, 2),
            comments=comments
        )
        
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al analizar video: {str(e)}")


@app.get("/predictions", tags=["Database"])
async def get_predictions(
    limit: int = 100,
    offset: int = 0,
    is_toxic: Optional[bool] = None,
    source: Optional[str] = None,
    video_id: Optional[str] = None
):
    """
    Obtener predicciones guardadas en la base de datos.
    
    - **limit**: Número máximo de resultados (default: 100)
    - **offset**: Offset para paginación (default: 0)
    - **is_toxic**: Filtrar por toxicidad (true/false)
    - **source**: Filtrar por origen ('api', 'batch', 'youtube')
    - **video_id**: Filtrar por ID de video de YouTube
    
    Returns:
    - Lista de predicciones guardadas
    """
    if not db_manager:
        raise HTTPException(status_code=503, detail="Base de datos no disponible")
    
    try:
        predictions = db_manager.get_predictions(
            limit=limit,
            offset=offset,
            is_toxic=is_toxic,
            source=source,
            video_id=video_id
        )
        return {"predictions": predictions, "count": len(predictions)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener predicciones: {str(e)}")


@app.get("/predictions/stats", tags=["Database"])
async def get_prediction_stats():
    """
    Obtener estadísticas de las predicciones guardadas.
    
    Returns:
    - Estadísticas agregadas de las predicciones
    """
    if not db_manager:
        raise HTTPException(status_code=503, detail="Base de datos no disponible")
    
    try:
        stats = db_manager.get_statistics()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener estadísticas: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

