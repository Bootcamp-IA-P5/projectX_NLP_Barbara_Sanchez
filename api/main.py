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
project_root = Path(__file__).parent.parent
src_path = project_root / 'src'
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

# Inicializar FastAPI
app = FastAPI(
    title="Hate Speech Detection API",
    description="API REST para detectar mensajes de odio en comentarios de YouTube",
    version="1.0.0"
)

# Configurar CORS para permitir requests desde frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios específicos
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
        schema_extra = {
            "example": {
                "text": "This video is amazing! Great content!"
            }
        }


class BatchTextRequest(BaseModel):
    """Request para predecir múltiples textos"""
    texts: List[str] = Field(..., description="Lista de textos a analizar", min_items=1, max_items=100)
    
    class Config:
        schema_extra = {
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
        schema_extra = {
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
        schema_extra = {
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
        schema_extra = {
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
        df = analyze_video_comments(
            request.video_url,
            predictor,
            max_comments=request.max_comments,
            sort_by=request.sort_by
        )
        
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

