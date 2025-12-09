# 🚀 Backend - Hate Speech Detection API

Backend del proyecto de detección de hate speech en comentarios de YouTube.

## 📁 Estructura

```
backend/
├── src/              # Código fuente Python
│   ├── api/          # Módulo de predicción
│   ├── data/         # Preprocesamiento
│   ├── features/     # Feature engineering
│   ├── models/       # Modelos ML
│   └── utils/        # Utilidades (BD, MLFlow, YouTube)
├── api/              # API REST (FastAPI)
├── data/             # Datos (raw y processed)
├── models/           # Modelos entrenados
├── notebooks/        # Jupyter notebooks
├── tests/            # Tests unitarios
├── scripts/          # Scripts de utilidad
├── requirements.txt   # Dependencias Python
├── Dockerfile        # Imagen Docker
└── docker-compose.yml # Orquestación Docker
```

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
cd backend
pip install -r requirements.txt
```

### 2. Ejecutar la API

```bash
# Opción 1: Script simple (recomendado - detiene procesos anteriores)
cd backend
./start_api.sh

# Opción 2: Script Python
cd backend
python3 run_api.py

# Opción 3: Script bash original
cd backend
bash api/run.sh
```

**Nota**: Si el puerto 8000 está en uso, el script `start_api.sh` lo libera automáticamente.

### 3. Acceder a la documentación

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 📡 Endpoints

Ver documentación completa en `api/README.md` o en http://localhost:8000/docs

### Principales:
- `POST /predict` - Analizar un texto
- `POST /predict/batch` - Analizar múltiples textos
- `POST /analyze/youtube` - Analizar comentarios de un video
- `GET /predictions` - Consultar predicciones guardadas
- `GET /predictions/stats` - Estadísticas de predicciones

## 🐳 Docker

```bash
# Construir imagen
docker build -t hate-speech-api backend/

# Ejecutar con Docker Compose
cd backend
docker-compose up --build
```

## 🧪 Tests

```bash
cd backend
pytest tests/
```

## 📊 MLFlow

Para ver experimentos en MLFlow UI:

```bash
cd backend
bash scripts/start_mlflow_ui.sh
```

Luego abre: http://localhost:5000

## 📚 Más Información

- Documentación de la API: `api/README.md`
- Guía de Docker: `../docs/DOCKER.md`
- Guía de Base de Datos: `../docs/DATABASE_GUIDE.md`
- Guía de MLFlow: `../docs/MLFLOW_GUIDE.md`

