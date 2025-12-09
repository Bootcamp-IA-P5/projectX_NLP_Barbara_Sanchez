# 🎯 Proyecto: Detección de Hate Speech en YouTube

Sistema de detección automática de mensajes de odio en comentarios de YouTube utilizando técnicas de Procesamiento del Lenguaje Natural (NLP) y Machine Learning.

## 📋 Descripción del Proyecto

YouTube necesita una solución automatizada para detectar y moderar comentarios de odio en su plataforma. Este proyecto implementa un sistema completo de clasificación de texto que identifica mensajes tóxicos y de odio en comentarios de YouTube.

## 🎯 Objetivos

### 🟢 Nivel Esencial (Obligatorio)
- ✅ Modelo ML que reconozca mensajes de odio
- ✅ Overfitting < 5% (diferencia F1 train-test)
- ✅ Productivización (interfaz Streamlit)
- ✅ Repositorio Git organizado
- ✅ Documentación completa

### 🟡 Nivel Medio
- ✅ Ensemble de modelos
- ✅ Integración con YouTube API
- ✅ Tests unitarios
- ✅ Optimización de hiperparámetros (Optuna)

### 🟠 Nivel Avanzado
- ✅ Redes neuronales (RNN/LSTM)
- ✅ Seguimiento en tiempo real
- ✅ Despliegue público
- ✅ Dockerización

### 🔴 Nivel Experto
- ✅ Transformers (DistilBERT)
- ✅ Base de datos para predicciones
- ✅ MLFlow para tracking

## 🏗️ Estructura del Proyecto

```
projectX_NLP_B-rbara_S-nchez/
├── backend/                 # Backend (API, modelos, notebooks)
│   ├── src/                 # Código fuente Python
│   │   ├── api/             # Módulo de predicción
│   │   ├── data/            # Preprocesamiento
│   │   ├── features/        # Feature engineering
│   │   ├── models/          # Modelos ML
│   │   └── utils/           # Utilidades (BD, MLFlow, YouTube)
│   ├── api/                 # API REST (FastAPI)
│   ├── data/                # Datos (raw y processed)
│   ├── models/              # Modelos entrenados
│   ├── notebooks/           # Jupyter notebooks
│   ├── tests/               # Tests unitarios
│   ├── scripts/             # Scripts de utilidad
│   └── requirements.txt      # Dependencias Python
├── frontend/                # Frontend (a implementar)
├── docs/                    # Documentación general
└── README.md                # Este archivo

```

## 🚀 Instalación

### Requisitos previos
- Python 3.11+
- Git

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd projectX_NLP_B-rbara_S-nchez
```

2. **Instalar backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Instalar frontend** (cuando esté disponible)
```bash
cd frontend
npm install  # o yarn install
```

4. **Descargar modelos de spaCy**
```bash
python -m spacy download en_core_web_sm
```

5. **Descargar datos de NLTK**
```python
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"
```

## 📊 Dataset

- **Fuente**: YouTube Comments Dataset
- **Tamaño**: 1000 comentarios en inglés
- **Etiquetas**: Tóxico / No tóxico
- **Ubicación**: `data/raw/youtoxic_english_1000.csv`

## 🔧 Uso

### Backend

#### Ejecutar la API
```bash
cd backend
bash api/run.sh
# O directamente:
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

#### Ejecutar tests
```bash
cd backend
pytest tests/
```

#### Ejecutar con Docker
```bash
cd backend
docker-compose up --build
```

Ver `docs/DOCKER.md` para más detalles sobre Docker.

### Frontend

El frontend estará disponible en `frontend/` una vez implementado.

## 📡 API

La API REST está disponible en `http://localhost:8000` cuando el backend está ejecutándose.

- **Documentación interactiva**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

Ver `backend/api/README.md` para documentación completa de la API.

## 🌿 Estrategia de Ramas Git

- **`main`**: Código estable y funcional
- **`develop`**: Rama de desarrollo principal
- **`feat/*`**: Ramas de features individuales

## 📝 Tecnologías Utilizadas

- **Python 3.11+**
- **NLP**: spaCy, NLTK
- **ML**: scikit-learn, Optuna
- **Transformers**: Hugging Face Transformers, PyTorch
- **API**: FastAPI, Uvicorn
- **Containerización**: Docker, Docker Compose
- **Visualización**: Streamlit, Matplotlib, Seaborn
- **Testing**: pytest

## 👥 Autora

Bárbara Sánchez

## 📄 Licencia

Este proyecto es parte de un bootcamp de IA.

## 📚 Documentación Adicional

- Ver `PLAN_PROYECTO_COMPLETO.md` para el plan detallado del proyecto
- Ver `docs/` para documentación técnica específica
