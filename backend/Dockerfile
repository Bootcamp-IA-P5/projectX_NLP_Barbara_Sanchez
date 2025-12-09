# Dockerfile para Hate Speech Detection API
FROM python:3.11-slim

# Metadatos
LABEL maintainer="Bárbara Sánchez"
LABEL description="API REST para detección de hate speech en comentarios de YouTube"

# Variables de entorno
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements y instalar dependencias Python
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Descargar modelos de spaCy y NLTK
RUN python -m spacy download en_core_web_sm && \
    python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet'); nltk.download('omw-1.4')"

# Copiar código de la aplicación
COPY src/ ./src/
COPY main.py ./main.py
COPY models/ ./models/

# Crear directorio para datos si es necesario
RUN mkdir -p data/processed

# Exponer puerto (Render usa variable PORT, por defecto 8000)
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

# Comando para ejecutar la API
# Render proporciona variable PORT, usar 8000 como fallback
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}

