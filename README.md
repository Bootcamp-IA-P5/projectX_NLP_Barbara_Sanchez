# 🎯 Detección de Hate Speech en YouTube

Sistema completo de detección automática de mensajes de odio en comentarios de YouTube utilizando técnicas de Machine Learning y Deep Learning, con API REST y interfaz web moderna.

[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [API Documentation](#-api-documentation)
- [Modelos](#-modelos)
- [Despliegue](#-despliegue)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tecnologías](#-tecnologías)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## 🎯 Descripción

Este proyecto implementa un sistema end-to-end para la detección automática de hate speech en comentarios de YouTube. El sistema utiliza técnicas de Procesamiento del Lenguaje Natural (NLP) y Machine Learning para clasificar comentarios como tóxicos o no tóxicos.

### Objetivos del Proyecto

- ✅ **Modelo ML funcional**: F1-score > 0.55 (obtenido: 0.7407)
- ✅ **Control de overfitting**: < 5% (obtenido: 2.54%)
- ✅ **Sistema productivo**: API REST + Frontend completo
- ✅ **Integración YouTube**: Análisis automático de comentarios
- ✅ **Tracking y persistencia**: MLFlow + Base de datos

---

## ✨ Características

### Backend
- 🚀 API REST con FastAPI
- 🤖 Modelo SVM optimizado con Optuna
- 📊 Tracking de experimentos con MLFlow
- 💾 Base de datos SQLite para predicciones
- 🎬 Integración con YouTube (extracción de comentarios)
- 🐳 Containerización con Docker

### Frontend
- ⚛️ Interfaz moderna con React 18
- 🎨 Diseño responsive con Tailwind CSS
- 📈 Visualizaciones interactivas con Recharts
- 🔍 Análisis individual, por lotes y YouTube
- 📊 Dashboard de estadísticas y EDA
- 🎭 Animaciones con Framer Motion

### Modelos ML
- 📊 4 modelos baseline evaluados
- 🔧 Optimización de hiperparámetros con Optuna
- 🎯 Ensembles probados (Voting, Stacking)
- 🧠 Transformers evaluados (DistilBERT)
- 🏆 Modelo final: SVM Optimizado

---

## 🏗️ Arquitectura

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Análisis   │  │   YouTube    │  │ Estadísticas│          │
│  │  Individual  │  │   Analysis   │  │   & EDA     │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                  │                  │
│         └─────────────────┴──────────────────┘                  │
│                            │                                     │
│                            ▼                                     │
│                    ┌──────────────┐                             │
│                    │  Axios Client│                             │
│                    └──────┬───────┘                             │
└───────────────────────────┼─────────────────────────────────────┘
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    API Endpoints                         │  │
│  │  • POST /predict          (análisis individual)         │  │
│  │  • POST /predict/batch    (análisis por lotes)           │  │
│  │  • POST /analyze/youtube  (análisis YouTube)             │  │
│  │  • GET  /predictions     (historial)                    │  │
│  │  • GET  /predictions/stats (estadísticas)               │  │
│  │  • GET  /health           (health check)                 │  │
│  └────────────────────┬───────────────────────────────────┘  │
│                        │                                        │
│                        ▼                                        │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              HateSpeechPredictor                          │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │ │
│  │  │Preprocesador │  │ Vectorizador │  │   Modelo     │   │ │
│  │  │   (spaCy)    │→ │   (TF-IDF)   │→ │  (SVM Opt.)  │   │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                        │                                        │
│                        ▼                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Servicios Auxiliares                        │  │
│  │  • YouTube Extractor (youtube-comment-downloader)        │  │
│  │  • Database Manager (SQLite)                             │  │
│  │  • MLFlow Tracker (experiment tracking)                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Persistencia                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   SQLite     │  │   MLFlow     │  │   Modelos    │          │
│  │  (Predicciones│  │  (Experiments│  │   (.pkl)     │          │
│  │   & Stats)   │  │   & Metrics) │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

```
1. ENTRADA
   ├── Texto individual → POST /predict
   ├── Múltiples textos → POST /predict/batch
   └── URL YouTube → POST /analyze/youtube

2. PREPROCESAMIENTO
   ├── Tokenización (spaCy)
   ├── Normalización (minúsculas, stop words)
   ├── Lematización
   └── Vectorización (TF-IDF, 5,000 features)

3. PREDICCIÓN
   ├── Carga modelo SVM optimizado
   ├── Predicción con probabilidades
   ├── Aplicación de umbral (0.466)
   └── Amplificación de probabilidades

4. RESULTADO
   ├── Clasificación: Tóxico / No tóxico
   ├── Probabilidades y confianza
   └── Guardado en BD (opcional)

5. RESPUESTA
   ├── JSON con resultados
   ├── Visualización en frontend
   └── Estadísticas actualizadas
```

---

## 🚀 Instalación

### Requisitos Previos

- Python 3.11+
- Node.js 18+
- Docker (opcional, para containerización)
- Git

### Backend

1. **Clonar el repositorio**
```bash
git clone https://github.com/Bootcamp-IA-P5/projectX_NLP_Barbara_Sanchez.git
cd projectX_NLP_Barbara_Sanchez
```

2. **Instalar dependencias**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Descargar modelos de spaCy**
```bash
python -m spacy download en_core_web_sm
```

4. **Descargar datos de NLTK**
```python
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"
```

5. **Verificar que los modelos están presentes**
```bash
# Los modelos deben estar en:
# backend/models/optimized/best_optimized_model.pkl
# backend/models/tfidf_vectorizer.pkl
```

### Frontend

```bash
cd frontend
npm install
```

---

## 💻 Uso

### Backend

#### Opción 1: Ejecutar directamente
```bash
cd backend
python run_api.py
# O
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Opción 2: Usar script de inicio
```bash
cd backend
bash start_api.sh
```

#### Opción 3: Docker
```bash
cd backend
docker-compose up --build
```

La API estará disponible en: `http://localhost:8000`

- **Documentación interactiva**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

### Frontend

```bash
cd frontend
npm run dev
```

El frontend estará disponible en: `http://localhost:3000`

### MLFlow UI

Para ver los experimentos de MLFlow:

```bash
cd backend
bash scripts/start_mlflow_ui.sh
```

O manualmente:
```bash
cd backend
mlflow ui --port 5000
```

Accede a: `http://localhost:5000`

---

## 📡 API Documentation

### Endpoints Principales

#### 1. Análisis Individual
```http
POST /predict
Content-Type: application/json

{
  "text": "Este es un comentario a analizar"
}
```

**Respuesta**:
```json
{
  "text": "Este es un comentario a analizar",
  "is_toxic": false,
  "toxicity_label": "Not Toxic",
  "probability_toxic": 0.35,
  "probability_not_toxic": 0.65,
  "confidence": 0.65
}
```

#### 2. Análisis por Lotes
```http
POST /predict/batch
Content-Type: application/json

{
  "texts": [
    "Comentario 1",
    "Comentario 2",
    "Comentario 3"
  ]
}
```

#### 3. Análisis de YouTube
```http
POST /analyze/youtube
Content-Type: application/json

{
  "video_url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "max_comments": 20,
  "sort_by": "top"
}
```

#### 4. Historial de Predicciones
```http
GET /predictions?limit=10&offset=0
```

#### 5. Estadísticas
```http
GET /predictions/stats
```

**Respuesta**:
```json
{
  "total_predictions": 150,
  "toxic_count": 65,
  "not_toxic_count": 85,
  "toxic_percentage": 43.33,
  "average_confidence": 0.72
}
```

#### 6. Health Check
```http
GET /health
```

**Respuesta**:
```json
{
  "status": "ok",
  "model_loaded": true,
  "timestamp": "2024-01-15T10:30:00"
}
```

### Documentación Completa

Accede a la documentación interactiva en: `http://localhost:8000/docs`

---

## 🤖 Modelos

### Modelo Final: SVM Optimizado

**Métricas**:
- **F1-Score (Test)**: 0.7407 ✅
- **Overfitting**: 2.54% ✅
- **Accuracy**: 0.64
- **Precision**: 0.6452
- **Recall**: 0.8696

**Parámetros**:
- C: 0.056
- Kernel: linear
- Umbral de decisión: 0.466

**Ubicación**: `backend/models/optimized/best_optimized_model.pkl`

### Modelos Evaluados

| Modelo | F1-Score | Overfitting | Estado |
|--------|----------|------------|--------|
| Naive Bayes | 0.6310 | 23.81% | ❌ |
| Logistic Regression | 0.7200 | 16.80% | ❌ |
| **SVM Optimizado** | **0.7407** | **2.54%** | ✅ |
| Random Forest | 0.6275 | 21.25% | ❌ |
| Voting Ensemble | 0.4651 | 28.04% | ❌ |
| Stacking Ensemble | 0.6784 | 16.15% | ❌ |
| DistilBERT | 0.7027 | 24.41% | ❌ |

### Entrenar Nuevos Modelos

Ver notebooks en `backend/notebooks/`:
- `04_Modeling_Baseline.ipynb` - Modelos baseline
- `05_Hyperparameter_Tuning.ipynb` - Optimización
- `06_Ensemble_Models.ipynb` - Ensembles
- `08_Transformers_DistilBERT.ipynb` - Transformers

---

## 🚢 Despliegue

### Docker

#### Backend
```bash
cd backend
docker build -t hate-speech-api .
docker run -p 8000:8000 hate-speech-api
```

#### Frontend
```bash
cd frontend
docker build -t hate-speech-frontend .
docker run -p 3000:80 hate-speech-frontend
```

#### Docker Compose
```bash
cd backend
docker-compose up --build
```

### Render

El proyecto está configurado para desplegarse en Render usando un Blueprint.

1. **Conectar repositorio** en Render
2. **Seleccionar Blueprint** desde `render.yaml`
3. **Configurar variables de entorno**:
   - Backend: `FRONTEND_URL` (URL del frontend)
   - Frontend: `VITE_API_URL` (URL del backend)
4. **Desplegar**

Ver `docs/DEPLOYMENT.md` para más detalles.

---

## 📁 Estructura del Proyecto

```
projectX_NLP_B-rbara_S-nchez/
├── backend/                    # Backend (API + Modelos)
│   ├── src/
│   │   ├── api/                # Módulo de predicción
│   │   │   └── predict.py      # HateSpeechPredictor
│   │   ├── data/               # Preprocesamiento
│   │   │   └── preprocessing.py
│   │   ├── features/           # Feature engineering
│   │   │   └── vectorization.py
│   │   ├── models/             # Modelos ML
│   │   │   ├── train.py
│   │   │   ├── evaluate.py
│   │   │   ├── optimization.py
│   │   │   ├── ensemble.py
│   │   │   └── transformers.py
│   │   └── utils/              # Utilidades
│   │       ├── database.py     # SQLite
│   │       ├── mlflow_tracking.py
│   │       └── youtube.py      # Extracción YouTube
│   ├── models/                 # Modelos entrenados
│   │   ├── optimized/
│   │   │   └── best_optimized_model.pkl
│   │   └── tfidf_vectorizer.pkl
│   ├── data/                   # Datos
│   │   ├── raw/
│   │   └── processed/
│   ├── notebooks/              # Jupyter notebooks
│   │   ├── 01_EDA.ipynb
│   │   ├── 04_Modeling_Baseline.ipynb
│   │   ├── 05_Hyperparameter_Tuning.ipynb
│   │   └── ...
│   ├── tests/                  # Tests unitarios
│   ├── main.py                 # API FastAPI
│   ├── Dockerfile
│   ├── requirements.txt
│   └── render.yaml
│
├── frontend/                    # Frontend React
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   │   ├── Hero.jsx
│   │   │   ├── AnalysisForm.jsx
│   │   │   ├── Results.jsx
│   │   │   ├── ModelInfo.jsx
│   │   │   └── ModelComparison.jsx
│   │   ├── pages/              # Páginas
│   │   │   ├── HomePage.jsx
│   │   │   ├── BatchPage.jsx
│   │   │   └── YouTubePage.jsx
│   │   ├── services/           # Cliente API
│   │   │   └── api.js
│   │   └── App.jsx
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
│
├── docs/                        # Documentación
│   ├── DOCKER.md
│   ├── DEPLOYMENT.md
│   ├── DATABASE_GUIDE.md
│   └── MLFLOW_GUIDE.md
│
├── render.yaml                  # Render Blueprint
├── README.md                    # Este archivo
└── PROJECT_SUMMARY.md           # Resumen del proyecto
```

---

## 🛠️ Tecnologías

### Backend
- **Python 3.11**
- **FastAPI**: Framework web moderno
- **scikit-learn**: Modelos ML clásicos
- **Optuna**: Optimización de hiperparámetros
- **Transformers**: Hugging Face (DistilBERT)
- **SQLAlchemy**: ORM para base de datos
- **MLFlow**: Tracking de experimentos
- **spaCy**: Preprocesamiento NLP
- **youtube-comment-downloader**: Extracción de comentarios

### Frontend
- **React 18**: Framework UI
- **Vite**: Build tool
- **Tailwind CSS**: Estilos
- **Recharts**: Visualizaciones
- **Framer Motion**: Animaciones
- **Axios**: Cliente HTTP

### DevOps
- **Docker**: Containerización
- **Docker Compose**: Orquestación
- **Render**: Plataforma de despliegue
- **Git/GitHub**: Control de versiones

---

## 🧪 Testing

### Ejecutar Tests

```bash
cd backend
pytest tests/
```

### Con cobertura

```bash
pytest tests/ --cov=src --cov-report=html
```

### Tests disponibles

- `test_preprocessing.py` - Preprocesamiento
- `test_vectorization.py` - Vectorización
- `test_train.py` - Entrenamiento
- `test_evaluate.py` - Evaluación
- `test_api.py` - API endpoints

---

## 📊 Dataset

- **Fuente**: YouTube Comments Dataset
- **Tamaño**: 1,000 comentarios en inglés
- **Distribución**:
  - No tóxicos: 538 (53.8%)
  - Tóxicos: 462 (46.2%)
- **Ubicación**: `backend/data/raw/youtoxic_english_1000.csv`

---

## 🎯 Niveles Completados

### 🟢 Nivel Esencial
- ✅ Modelo ML funcional (F1=0.7407, Overfitting=2.54%)
- ✅ Control de overfitting < 5%
- ✅ API REST productiva
- ✅ Repositorio Git organizado
- ✅ Documentación completa

### 🟡 Nivel Medio
- ✅ Ensemble de modelos
- ✅ Integración YouTube
- ✅ Tests unitarios
- ✅ Optimización con Optuna

### 🟠 Nivel Avanzado
- ✅ Redes neuronales (DistilBERT)
- ✅ Análisis tiempo real
- ✅ Despliegue público (Render)
- ✅ Dockerización completa

### 🔴 Nivel Experto
- ✅ Transformers (DistilBERT)
- ✅ Base de datos (SQLite)
- ✅ MLFlow tracking

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feat/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push a la rama (`git push origin feat/AmazingFeature`)
5. Abre un Pull Request

### Convenciones

- **Commits**: Usar prefijos (feat, fix, docs, style, refactor, test, chore)
- **Ramas**: `feat/*`, `fix/*`, `docs/*`
- **Código**: Seguir PEP 8 (Python) y ESLint (JavaScript)

---

## 📝 Licencia

Este proyecto es parte de un bootcamp de IA.

---

## 👥 Autora

**Bárbara Sánchez**

- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Proyecto: [Bootcamp-IA-P5/projectX_NLP_Barbara_Sanchez](https://github.com/Bootcamp-IA-P5/projectX_NLP_Barbara_Sanchez)

---

## 📚 Documentación Adicional

- [Guía de Docker](docs/DOCKER.md)
- [Guía de Despliegue](docs/DEPLOYMENT.md)
- [Guía de Base de Datos](docs/DATABASE_GUIDE.md)
- [Guía de MLFlow](docs/MLFLOW_GUIDE.md)



---

## 🙏 Agradecimientos

- Bootcamp de IA por el proyecto
- Comunidad de código abierto por las librerías utilizadas
- YouTube por proporcionar la plataforma de análisis

---

## 📞 Soporte

Si tienes preguntas o problemas:

1. Revisa la [documentación](docs/)
2. Abre un [issue](https://github.com/Bootcamp-IA-P5/projectX_NLP_Barbara_Sanchez/issues)
3. Consulta los [notebooks](backend/notebooks/) para ejemplos

---

**⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub**
