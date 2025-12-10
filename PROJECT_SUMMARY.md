# 📊 Resumen Completo del Proyecto - Detección de Hate Speech en YouTube

## 🎯 Objetivo del Proyecto

Sistema completo de detección de hate speech en comentarios de YouTube utilizando técnicas de Machine Learning y Deep Learning, con una API REST y una interfaz web moderna.

---

## ✅ Niveles Completados

### 🟢 Nivel Esencial
- ✅ Modelo de ML que reconoce mensajes de odio (SVM optimizado)
- ✅ Control de overfitting < 5% (2.54%)
- ✅ API REST con FastAPI para consultar predicciones
- ✅ Repositorio Git con ramas organizadas (main, develop, feat/*)
- ✅ Documentación completa del código y README

### 🟡 Nivel Medio
- ✅ Modelos de ensemble (Voting y Stacking)
- ✅ Integración con YouTube para analizar comentarios de videos
- ✅ Tests unitarios (pytest)
- ✅ Optimización de hiperparámetros con Optuna

### 🟠 Nivel Avanzado
- ✅ Modelo con redes neuronales (DistilBERT - Transformer)
- ✅ Análisis de comentarios de YouTube en tiempo real
- ✅ Dockerización completa (backend y frontend)
- ✅ Configuración para despliegue en Render

### 🔴 Nivel Experto
- ✅ Modelo basado en Transformers (DistilBERT)
- ✅ Base de datos SQLite para guardar predicciones
- ✅ Tracking de experimentos con MLFlow
- ✅ Frontend completo con React y visualizaciones modernas

---

## 🏗️ Arquitectura del Proyecto

```
projectX_NLP_B-rbara_S-nchez/
├── backend/              # API REST (FastAPI)
│   ├── src/              # Código fuente Python
│   │   ├── api/          # Módulo de predicción
│   │   ├── data/         # Preprocesamiento
│   │   ├── features/     # Feature engineering (TF-IDF, Count)
│   │   ├── models/       # Modelos ML (SVM, NB, LR, RF, Ensemble, Transformers)
│   │   └── utils/         # BD, MLFlow, YouTube
│   ├── models/           # Modelos entrenados
│   ├── data/             # Datos procesados
│   ├── notebooks/        # Jupyter notebooks (EDA, entrenamiento, evaluación)
│   ├── main.py           # API FastAPI
│   ├── Dockerfile        # Docker para backend
│   └── render.yaml       # Configuración Render
│
├── frontend/             # Interfaz web (React + Vite)
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── pages/         # Páginas (Individual, Batch, YouTube)
│   │   └── services/      # Cliente API
│   ├── Dockerfile        # Docker para frontend
│   └── render.yaml       # Configuración Render
│
└── docs/                 # Documentación
```

---

## 🤖 Modelos Implementados

### 1. Modelos Baseline (TF-IDF)
- **Naive Bayes**: F1=0.6310, Overfitting=23.81%
- **Logistic Regression**: F1=0.7200, Overfitting=16.80%
- **SVM**: F1=0.7263, Overfitting=18.50%
- **Random Forest**: F1=0.6275, Overfitting=21.25%

### 2. Modelo Optimizado (Seleccionado)
- **SVM Optimizado con Optuna**:
  - F1-Score (test): 0.7407
  - Accuracy: 0.64
  - Precision: 0.6452
  - Recall: 0.8696
  - **Overfitting: 2.54%** ✅ (cumple objetivo < 5%)
  - Parámetros: C=0.056, kernel=linear
  - Umbral optimizado: 0.466 (reduce falsos positivos de 85 a 44)

### 3. Modelos Ensemble
- **Voting Classifier**: F1=0.4651, Overfitting=28.04% (no mejora)
- **Stacking Classifier**: F1=0.6784, Overfitting=16.15% (mejora pero overfitting alto)

### 4. Transformers
- **DistilBERT**: F1=0.7027, Overfitting=24.41% (no cumple objetivo < 6%)
  - **No seleccionado** por: overfitting alto, modelo pesado (255MB), dataset pequeño

---

## 📊 Dataset

- **Total de comentarios**: 1,000
- **Tóxicos**: 462 (46.2%)
- **No tóxicos**: 538 (53.8%)
- **Balance**: Relativamente balanceado
- **Longitud promedio**: 98.4 caracteres
- **Palabras promedio**: 16.1 palabras
- **Fuente**: YouTube (inglés)

---

## 🔧 Tecnologías Utilizadas

### Backend
- **Python 3.11**
- **FastAPI**: API REST
- **scikit-learn**: Modelos ML clásicos
- **Optuna**: Optimización de hiperparámetros
- **Transformers (Hugging Face)**: DistilBERT
- **SQLAlchemy**: Base de datos
- **MLFlow**: Tracking de experimentos
- **spaCy**: Preprocesamiento NLP
- **youtube-comment-downloader**: Extracción de comentarios

### Frontend
- **React 18**: Framework UI
- **Vite**: Build tool
- **Tailwind CSS**: Estilos
- **Recharts**: Gráficos y visualizaciones
- **Framer Motion**: Animaciones
- **Axios**: Cliente HTTP
- **React Router**: Navegación

### DevOps
- **Docker**: Containerización
- **Render**: Plataforma de despliegue
- **Git/GitHub**: Control de versiones

---

## 🎨 Funcionalidades del Frontend

1. **Analizador Individual**: Analizar un texto individual
2. **Análisis por Lotes**: Analizar múltiples textos a la vez
3. **Análisis de YouTube**: Analizar comentarios de un video de YouTube
4. **EDA (Análisis Exploratorio)**: Visualizaciones del dataset
5. **Comparativa de Modelos**: Comparación de todos los modelos entrenados
6. **Estadísticas**: Estadísticas de análisis realizados
7. **MLflow Metrics**: Métricas de experimentos

---

## 📡 API Endpoints

- `POST /predict` - Analizar un texto
- `POST /predict/batch` - Analizar múltiples textos
- `POST /analyze/youtube` - Analizar comentarios de YouTube
- `GET /predictions` - Consultar predicciones guardadas
- `GET /predictions/stats` - Estadísticas de predicciones
- `GET /health` - Health check

---

## 🐳 Dockerización

- **Backend**: Dockerfile multi-stage con Python 3.11
- **Frontend**: Dockerfile multi-stage con Node.js + Nginx
- **docker-compose.yml**: Orquestación local
- **render.yaml**: Configuración para despliegue en Render

---

## 📈 Métricas del Modelo Final

### Con Umbral Optimizado (0.466)
- **F1-Score**: 0.7407
- **Accuracy**: 0.64
- **Precision**: 0.6452
- **Recall**: 0.8696
- **Overfitting**: 2.54% ✅

### Matriz de Confusión
- **Verdaderos Negativos**: 64
- **Falsos Positivos**: 44 (reducidos de 85)
- **Falsos Negativos**: 12
- **Verdaderos Positivos**: 80

---

## 🚀 Despliegue

- **Backend**: Render (Docker) - `https://hate-speech-api.onrender.com`
- **Frontend**: Render (Docker o Static Site) - `https://hate-speech-frontend.onrender.com`
- **Configuración**: Blueprint con `render.yaml` en la raíz

---

## 📚 Documentación

- `README.md`: Documentación principal
- `docs/DOCKER.md`: Guía de Docker
- `docs/DEPLOYMENT.md`: Guía de despliegue
- `docs/DATABASE_GUIDE.md`: Guía de base de datos
- `docs/MLFLOW_GUIDE.md`: Guía de MLFlow
- `backend/README.md`: Documentación del backend
- `frontend/README.md`: Documentación del frontend

---

## 🧪 Testing

- Tests unitarios con pytest
- Cobertura de código
- Tests para preprocesamiento, vectorización, entrenamiento, evaluación y API

---

## 🎯 Logros Principales

1. ✅ Modelo con overfitting < 5% (2.54%)
2. ✅ F1-score > 0.55 (0.7407)
3. ✅ API REST funcional y documentada
4. ✅ Frontend moderno y completo
5. ✅ Integración con YouTube
6. ✅ Base de datos y MLFlow implementados
7. ✅ Dockerización completa
8. ✅ Listo para despliegue en producción

---

## 🔮 Próximos Pasos (Opcionales)

- [ ] Mejorar el modelo con más datos
- [ ] Implementar seguimiento en tiempo real con WebSockets
- [ ] Añadir soporte multiidioma
- [ ] Mejorar calibración de probabilidades
- [ ] Añadir más visualizaciones en el frontend

---

**Estado del Proyecto**: ✅ **COMPLETO** - Todos los niveles (Esencial, Medio, Avanzado, Experto) implementados y funcionando.

