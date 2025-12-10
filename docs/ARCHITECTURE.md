# 🏗️ Arquitectura del Sistema

## Diagrama de Arquitectura Completo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React + Vite)                            │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        Componentes UI                               │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │   │
│  │  │     Hero      │  │ AnalysisForm │  │   Results    │             │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │   │
│  │                                                                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │   │
│  │  │  ModelInfo   │  │ModelComparison│  │ Statistics  │             │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │   │
│  │                                                                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │   │
│  │  │  HomePage    │  │  BatchPage   │  │ YouTubePage  │             │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│                          ┌──────────────────┐                                │
│                          │  API Service     │                                │
│                          │  (api.js)        │                                │
│                          └────────┬─────────┘                                │
└────────────────────────────────────┼─────────────────────────────────────────┘
                                     │ HTTP/REST (Axios)
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BACKEND (FastAPI + Python)                            │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         API Layer                                   │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │                    FastAPI Router                             │  │   │
│  │  │  • POST /predict          → Análisis individual              │  │   │
│  │  │  • POST /predict/batch    → Análisis por lotes               │  │   │
│  │  │  • POST /analyze/youtube   → Análisis YouTube                 │  │   │
│  │  │  • GET  /predictions      → Historial                        │  │   │
│  │  │  • GET  /predictions/stats → Estadísticas                    │  │   │
│  │  │  • GET  /health           → Health check                     │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Business Logic Layer                             │   │
│  │                                                                       │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │              HateSpeechPredictor                            │   │   │
│  │  │                                                              │   │   │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │   │
│  │  │  │TextPreprocessor│ │TextVectorizer│ │  SVM Model   │    │   │   │
│  │  │  │                │ │              │ │              │    │   │   │
│  │  │  │ • Tokenización │ │ • TF-IDF     │ │ • Carga .pkl │    │   │   │
│  │  │  │ • Lematización │ │ • 5K features│ │ • Predicción │    │   │   │
│  │  │  │ • Stop words   │ │ • Transform  │ │ • Probabilid.│    │   │   │
│  │  │  └──────┬─────────┘ └──────┬───────┘ └──────┬───────┘    │   │   │
│  │  │         │                  │                │             │   │   │
│  │  │         └──────────────────┴────────────────┘             │   │   │
│  │  │                            │                               │   │   │
│  │  │                            ▼                               │   │   │
│  │  │                  ┌──────────────────┐                      │   │   │
│  │  │                  │  Result Processor│                      │   │   │
│  │  │                  │  • Umbral 0.466  │                      │   │   │
│  │  │                  │  • Amplificación │                      │   │   │
│  │  │                  │  • Clasificación│                      │   │   │
│  │  │                  └──────────────────┘                      │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │                                                                       │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │              Servicios Auxiliares                            │   │   │
│  │  │                                                              │   │   │
│  │  │  • YouTubeExtractor  → Extrae comentarios de YouTube       │   │   │
│  │  │  • DatabaseManager   → Guarda predicciones en SQLite        │   │   │
│  │  │  • MLFlowTracker     → Registra experimentos                │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Persistencia y Storage                             │
│                                                                               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐        │
│  │   SQLite DB      │  │   MLFlow UI      │  │   Model Files    │        │
│  │                  │  │                  │  │                  │        │
│  │  • Predictions   │  │  • Experiments   │  │  • SVM Model     │        │
│  │  • Statistics     │  │  • Metrics       │  │  • Vectorizer    │        │
│  │  • History        │  │  • Parameters    │  │  • Configs       │        │
│  │                   │  │  • Artifacts     │  │                  │        │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Flujo de Datos Detallado

### 1. Análisis Individual

```
Usuario (Frontend)
    │
    │ Escribe texto
    ▼
AnalysisForm Component
    │
    │ onSubmit()
    ▼
API Service (api.js)
    │
    │ POST /predict
    │ { "text": "..." }
    ▼
FastAPI Endpoint (/predict)
    │
    │ Carga predictor
    ▼
HateSpeechPredictor
    │
    │ 1. Preprocesamiento
    │    TextPreprocessor.preprocess_text()
    │    • Tokenización (spaCy)
    │    • Lematización
    │    • Stop words removal
    │
    │ 2. Vectorización
    │    TextVectorizer.transform()
    │    • TF-IDF transformation
    │    • 5,000 features
    │
    │ 3. Predicción
    │    model.predict_proba()
    │    • Probabilidades raw
    │
    │ 4. Procesamiento
    │    • Aplicar umbral (0.466)
    │    • Amplificar probabilidades
    │    • Clasificar
    ▼
Resultado
    │
    │ { is_toxic, probability, confidence }
    ▼
DatabaseManager (opcional)
    │
    │ Guarda en SQLite
    ▼
Response JSON
    │
    │ HTTP 200
    ▼
API Service
    │
    │ Actualiza estado
    ▼
Results Component
    │
    │ Muestra resultado
    ▼
Usuario ve resultado
```

### 2. Análisis de YouTube

```
Usuario (Frontend)
    │
    │ Ingresa URL YouTube
    ▼
YouTubePage Component
    │
    │ onSubmit()
    ▼
API Service
    │
    │ POST /analyze/youtube
    │ { video_url, max_comments, sort_by }
    ▼
FastAPI Endpoint (/analyze/youtube)
    │
    │ Extrae comentarios
    ▼
YouTubeExtractor
    │
    │ youtube-comment-downloader
    │ • Obtiene comentarios
    │ • Filtra por sort_by
    │ • Limita a max_comments
    ▼
Lista de comentarios
    │
    │ Para cada comentario:
    ▼
HateSpeechPredictor
    │
    │ (mismo flujo que análisis individual)
    ▼
Resultados agregados
    │
    │ • Total comentarios
    │ • % tóxicos
    │ • Lista detallada
    ▼
DatabaseManager
    │
    │ Guarda cada predicción
    ▼
Response JSON
    │
    │ HTTP 200
    ▼
YouTubePage Component
    │
    │ Muestra estadísticas y lista
    ▼
Usuario ve análisis completo
```

## Componentes Principales

### Backend

#### 1. API Layer (`main.py`)
- **FastAPI Application**: Configuración principal
- **CORS Middleware**: Permite requests del frontend
- **Endpoints**: Rutas REST definidas
- **Error Handling**: Manejo centralizado de errores

#### 2. Prediction Layer (`src/api/predict.py`)
- **HateSpeechPredictor**: Clase principal de predicción
  - Carga modelo y vectorizador
  - Preprocesa texto
  - Vectoriza
  - Predice
  - Procesa resultados

#### 3. Preprocessing Layer (`src/data/preprocessing.py`)
- **TextPreprocessor**: Preprocesamiento de texto
  - Tokenización con spaCy
  - Lematización
  - Eliminación de stop words
  - Normalización

#### 4. Feature Engineering (`src/features/vectorization.py`)
- **TextVectorizer**: Vectorización TF-IDF
  - Entrenamiento del vectorizador
  - Transformación de textos
  - Persistencia (.pkl)

#### 5. Services Layer
- **YouTubeExtractor** (`src/utils/youtube.py`): Extracción de comentarios
- **DatabaseManager** (`src/utils/database.py`): Gestión de SQLite
- **MLFlowTracker** (`src/utils/mlflow_tracking.py`): Tracking de experimentos

### Frontend

#### 1. Components
- **Hero**: Header principal
- **AnalysisForm**: Formulario de análisis
- **Results**: Visualización de resultados
- **ModelInfo**: Información del modelo y EDA
- **ModelComparison**: Comparativa de modelos
- **Statistics**: Estadísticas de análisis

#### 2. Pages
- **HomePage**: Análisis individual
- **BatchPage**: Análisis por lotes
- **YouTubePage**: Análisis de YouTube

#### 3. Services
- **API Service** (`services/api.js`): Cliente HTTP para backend

## Tecnologías por Capa

### Frontend
- **React 18**: Framework UI
- **Vite**: Build tool
- **Tailwind CSS**: Estilos
- **Recharts**: Visualizaciones
- **Framer Motion**: Animaciones
- **Axios**: Cliente HTTP

### Backend
- **FastAPI**: Framework web
- **Python 3.11**: Lenguaje
- **scikit-learn**: ML models
- **spaCy**: NLP preprocessing
- **SQLAlchemy**: ORM
- **MLFlow**: Experiment tracking

### Infrastructure
- **Docker**: Containerización
- **Nginx**: Servidor web (frontend)
- **SQLite**: Base de datos
- **Render**: Plataforma de despliegue

## Patrones de Diseño

### 1. Separation of Concerns
- Frontend y Backend separados
- Capas bien definidas (API, Business Logic, Data)

### 2. Dependency Injection
- Modelos y vectorizadores cargados una vez
- Servicios inyectados en endpoints

### 3. Repository Pattern
- DatabaseManager abstrae acceso a BD
- MLFlowTracker abstrae tracking

### 4. Service Layer
- Lógica de negocio separada de API
- Reutilizable entre endpoints

## Escalabilidad

### Horizontal
- Backend puede escalarse con múltiples instancias
- Frontend es estático (Nginx)
- Base de datos puede migrarse a PostgreSQL

### Vertical
- Modelos pueden cargarse en memoria compartida
- Caché de predicciones frecuentes
- Procesamiento asíncrono para lotes grandes

## Seguridad

- **CORS**: Configurado para dominios específicos
- **Input Validation**: Pydantic models
- **Error Handling**: No expone información sensible
- **Rate Limiting**: Puede añadirse fácilmente

## Monitoreo

- **Health Check**: Endpoint `/health`
- **MLFlow**: Tracking de experimentos
- **Database**: Historial de predicciones
- **Logs**: FastAPI logging

