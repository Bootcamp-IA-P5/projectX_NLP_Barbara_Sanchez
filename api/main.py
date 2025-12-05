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

# Añadir src al path
sys.path.append(str(Path(__file__).parent.parent / 'src'))

from api.predict import load_predictor, HateSpeechPredictor

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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

