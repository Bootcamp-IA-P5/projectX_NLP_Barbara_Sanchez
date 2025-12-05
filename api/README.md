# 🚀 API REST - Detección de Hate Speech

API REST para detectar mensajes de odio en comentarios de YouTube usando el modelo optimizado entrenado.

## 📋 Descripción

Esta API permite a un frontend (en otro repositorio) consultar si un mensaje es o no de odio. La API carga el modelo optimizado y el vectorizador TF-IDF para hacer predicciones en tiempo real.

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 2. Verificar que el modelo existe

Asegúrate de que existen los siguientes archivos:
- `models/optimized/best_optimized_model.pkl`
- `models/tfidf_vectorizer.pkl`

### 3. Ejecutar la API

```bash
# Desde la raíz del proyecto
python api/main.py
```

O con uvicorn directamente:

```bash
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Acceder a la documentación

Una vez ejecutada, accede a:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 📡 Endpoints

### `GET /`
Información básica de la API.

### `GET /health`
Health check. Verifica que el modelo esté cargado.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### `POST /predict`
Predice si un texto es hate speech.

**Request:**
```json
{
  "text": "This video is amazing!"
}
```

**Response:**
```json
{
  "text": "This video is amazing!",
  "is_toxic": false,
  "toxicity_label": "Not Toxic",
  "probability_toxic": 0.15,
  "probability_not_toxic": 0.85,
  "confidence": 0.85
}
```

### `POST /predict/batch`
Predice múltiples textos en batch (máximo 100).

**Request:**
```json
{
  "texts": [
    "This video is amazing!",
    "You are stupid and should die"
  ]
}
```

**Response:**
```json
[
  {
    "text": "This video is amazing!",
    "is_toxic": false,
    "toxicity_label": "Not Toxic",
    "probability_toxic": 0.15,
    "probability_not_toxic": 0.85,
    "confidence": 0.85
  },
  {
    "text": "You are stupid and should die",
    "is_toxic": true,
    "toxicity_label": "Toxic",
    "probability_toxic": 0.92,
    "probability_not_toxic": 0.08,
    "confidence": 0.92
  }
]
```

## 🔧 Uso desde Frontend

### Ejemplo con JavaScript/Fetch

```javascript
// Predecir un texto
const response = await fetch('http://localhost:8000/predict', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: 'This is a comment to analyze'
  })
});

const result = await response.json();
console.log(result);
```

### Ejemplo con Python/Requests

```python
import requests

response = requests.post(
    'http://localhost:8000/predict',
    json={'text': 'This is a comment to analyze'}
)

result = response.json()
print(result)
```

## 🐳 Docker (Opcional)

Para dockerizar la API, crear un `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📝 Notas

- La API carga el modelo al iniciar (puede tardar unos segundos)
- CORS está configurado para permitir requests desde cualquier origen (cambiar en producción)
- El modelo usa el preprocesador y vectorizador entrenados
- Máximo 5000 caracteres por texto
- Máximo 100 textos por batch request

