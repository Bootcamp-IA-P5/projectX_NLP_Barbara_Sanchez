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
├── data/                    # Datos del proyecto
│   ├── raw/                 # Datos originales
│   └── processed/           # Datos preprocesados
├── notebooks/               # Notebooks de análisis y experimentación
│   ├── 01_EDA.ipynb
│   ├── 02_Preprocessing.ipynb
│   ├── 03_Feature_Engineering.ipynb
│   ├── 04_Modeling_Baseline.ipynb
│   ├── 05_Hyperparameter_Tuning.ipynb
│   ├── 06_Anti_Overfitting.ipynb
│   └── 07_Transformers.ipynb
├── src/                     # Código fuente modularizado
│   ├── data/                # Carga y preprocesamiento
│   ├── features/            # Feature engineering
│   ├── models/              # Modelos ML
│   └── utils/               # Utilidades
├── app/                     # Aplicación Streamlit
├── models/                  # Modelos entrenados guardados
├── tests/                   # Tests unitarios
└── docs/                    # Documentación

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

2. **Crear entorno virtual**
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. **Instalar dependencias**
```bash
pip install -r requirements.txt
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

### Entrenar modelo
```bash
python src/models/train.py
```

### Ejecutar aplicación Streamlit
```bash
streamlit run app/app.py
```

### Ejecutar tests
```bash
pytest tests/
```

### Ejecutar con Docker
```bash
# Usando Docker Compose (recomendado)
docker-compose up --build

# O usando Docker directamente
docker build -t hate-speech-api .
docker run -p 8000:8000 -v $(pwd)/models:/app/models:ro hate-speech-api
```

Ver `docs/DOCKER.md` para más detalles sobre Docker.

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
