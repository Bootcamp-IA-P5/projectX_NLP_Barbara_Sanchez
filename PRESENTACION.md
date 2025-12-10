# 🎤 Presentación: Detección de Hate Speech en YouTube

## 📊 SLIDE 1: Introducción del Proyecto

### Objetivo
Desarrollar un sistema automatizado de detección de hate speech en comentarios de YouTube utilizando técnicas de Machine Learning y Deep Learning.

### Problema a Resolver
- YouTube recibe millones de comentarios diarios
- Necesidad de moderación automática de contenido tóxico
- Detección temprana de mensajes de odio

---

## 📊 SLIDE 2: Dataset Utilizado

### Características del Dataset
- **Total de comentarios**: 1,000
- **Idioma**: Inglés
- **Fuente**: YouTube
- **Distribución de clases**:
  - ✅ **No tóxicos**: 538 comentarios (53.8%)
  - ⚠️ **Tóxicos**: 462 comentarios (46.2%)
  - **Ratio de balance**: 0.86 (relativamente balanceado)

### Estadísticas del Texto
- **Longitud promedio**: 98.4 caracteres
- **Palabras promedio**: 16.1 palabras
- **Longitud mediana**: 53.0 caracteres
- **Longitud máxima**: 2,184 caracteres
- **Desviación estándar**: 142.5 caracteres

### Comparación Tóxicos vs No Tóxicos
- **Longitud promedio (tóxicos)**: 102.0 caracteres
- **Longitud promedio (no tóxicos)**: 95.2 caracteres
- **Palabras promedio (tóxicos)**: 16.9 palabras
- **Palabras promedio (no tóxicos)**: 15.4 palabras

**Insight**: Los comentarios tóxicos tienden a ser ligeramente más largos.

---

## 📊 SLIDE 3: Pipeline de Procesamiento

### 1. Preprocesamiento de Texto
- ✅ Tokenización con spaCy
- ✅ Conversión a minúsculas
- ✅ Eliminación de stop words
- ✅ Lematización
- ✅ Expansión de contracciones
- ✅ Eliminación de repeticiones

### 2. Feature Engineering
- ✅ **TF-IDF Vectorizer**: 5,000 features máximas
- ✅ **Count Vectorizer**: Alternativa probada
- ✅ N-grams: Unigramas y bigramas

### 3. División de Datos
- **Train**: 800 comentarios (80%)
- **Test**: 200 comentarios (20%)
- **Estratificación**: Mantiene proporción de clases

---

## 📊 SLIDE 4: Modelos Baseline Evaluados

| Modelo | F1-Score (Test) | Accuracy | Precision | Recall | Overfitting |
|--------|----------------|----------|-----------|--------|-------------|
| **Naive Bayes** | 0.6310 | 0.60 | 0.55 | 0.73 | 23.81% ❌ |
| **Logistic Regression** | 0.7200 | 0.64 | 0.62 | 0.84 | 16.80% ❌ |
| **SVM** | **0.7263** | **0.65** | **0.63** | **0.85** | **18.50%** ❌ |
| **Random Forest** | 0.6275 | 0.59 | 0.54 | 0.73 | 21.25% ❌ |

### Conclusión Baseline
- **Mejor modelo**: SVM con TF-IDF
- **Problema principal**: Overfitting alto (> 15%)
- **Objetivo**: Reducir overfitting a < 5%

---

## 📊 SLIDE 5: Optimización de Hiperparámetros

### Técnica Utilizada
- **Optuna**: Framework de optimización bayesiana
- **Objetivo**: Maximizar F1-score y minimizar overfitting
- **Trials**: 50 iteraciones

### Parámetros Optimizados (SVM)
- **C**: 0.056 (regularización)
- **Kernel**: linear
- **Umbral de decisión**: 0.466 (optimizado para balance precision-recall)

### Resultados de Optimización

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| **F1-Score (Test)** | 0.7263 | **0.7407** | +1.98% ✅ |
| **Overfitting** | 18.50% | **2.54%** | -86.3% ✅✅ |
| **Falsos Positivos** | 85 | **44** | -48.2% ✅ |

---

## 📊 SLIDE 6: Modelo Final Seleccionado

### SVM Optimizado - Métricas Finales

| Métrica | Valor | Objetivo | Estado |
|---------|-------|----------|--------|
| **F1-Score (Test)** | **0.7407** | > 0.55 | ✅ Cumple |
| **F1-Score (Train)** | 0.7595 | - | - |
| **Accuracy** | **0.64** | - | - |
| **Precision** | **0.6452** | - | - |
| **Recall** | **0.8696** | - | - |
| **Overfitting** | **2.54%** | < 5% | ✅ Cumple |

### Matriz de Confusión

```
                Predicción
              No Tóxico  Tóxico
Real
No Tóxico        64       44
Tóxico           12       80
```

- **Verdaderos Negativos (TN)**: 64
- **Falsos Positivos (FP)**: 44 (reducidos de 85)
- **Falsos Negativos (FN)**: 12
- **Verdaderos Positivos (TP)**: 80

---

## 📊 SLIDE 7: Modelos Ensemble Evaluados

### Voting Classifier (Soft Voting)
- **F1-Score (Test)**: 0.4651
- **Overfitting**: 28.04% ❌
- **Resultado**: No mejora vs modelo individual

### Stacking Classifier
- **F1-Score (Test)**: 0.6784
- **Overfitting**: 16.15% ❌
- **Resultado**: Mejora F1 pero overfitting alto

### Conclusión
- ❌ Los ensembles **no mejoran** el modelo individual optimizado
- ✅ El SVM optimizado sigue siendo el mejor

---

## 📊 SLIDE 8: Modelo Transformer (DistilBERT)

### Configuración
- **Modelo base**: distilbert-base-uncased
- **Épocas**: 5
- **Batch size**: 16
- **Learning rate**: 2e-05
- **Tamaño del modelo**: 255 MB

### Resultados

| Métrica | Valor | Objetivo | Estado |
|---------|-------|----------|--------|
| **F1-Score (Test)** | 0.7027 | > 0.55 | ✅ Cumple |
| **Accuracy** | 0.70 | - | - |
| **Overfitting** | **24.41%** | < 6% | ❌ No cumple |

### ¿Por qué NO se seleccionó DistilBERT?
1. ❌ **Overfitting alto** (24.41% > 6%)
2. ❌ **Modelo pesado** (255 MB vs 5 MB del SVM)
3. ❌ **Dataset pequeño** (1,000 ejemplos no suficientes para transformers)
4. ❌ **F1-score similar** (0.7027 vs 0.7407 del SVM)
5. ❌ **Tiempo de inferencia** más lento

---

## 📊 SLIDE 9: Comparativa Final de Modelos

| Modelo | F1-Score | Overfitting | Tamaño | Velocidad | Seleccionado |
|--------|----------|-------------|--------|-----------|--------------|
| Naive Bayes | 0.6310 | 23.81% | 2 MB | ⚡⚡⚡ | ❌ |
| Logistic Regression | 0.7200 | 16.80% | 3 MB | ⚡⚡⚡ | ❌ |
| **SVM Optimizado** | **0.7407** | **2.54%** | **5 MB** | **⚡⚡** | **✅** |
| Random Forest | 0.6275 | 21.25% | 15 MB | ⚡⚡ | ❌ |
| Voting Ensemble | 0.4651 | 28.04% | 25 MB | ⚡ | ❌ |
| Stacking Ensemble | 0.6784 | 16.15% | 30 MB | ⚡ | ❌ |
| DistilBERT | 0.7027 | 24.41% | 255 MB | 🐌 | ❌ |

### Justificación de Selección
✅ **SVM Optimizado** ofrece:
- Mejor balance F1-score / Overfitting
- Modelo ligero y rápido
- Cumple todos los objetivos (< 5% overfitting, F1 > 0.55)
- Ideal para producción

---

## 📊 SLIDE 10: Productivización - API REST

### Tecnología
- **FastAPI**: Framework moderno y rápido
- **Uvicorn**: Servidor ASGI
- **Endpoints implementados**:
  - `POST /predict` - Análisis individual
  - `POST /predict/batch` - Análisis por lotes
  - `POST /analyze/youtube` - Análisis de video YouTube
  - `GET /predictions` - Historial de predicciones
  - `GET /predictions/stats` - Estadísticas
  - `GET /health` - Health check

### Características
- ✅ Documentación automática (Swagger UI)
- ✅ Validación de datos con Pydantic
- ✅ CORS configurado
- ✅ Manejo de errores robusto

---

## 📊 SLIDE 11: Frontend - Interfaz Web

### Tecnologías
- **React 18**: Framework UI
- **Vite**: Build tool rápido
- **Tailwind CSS**: Estilos modernos
- **Recharts**: Visualizaciones
- **Framer Motion**: Animaciones

### Funcionalidades Implementadas
1. ✅ **Analizador Individual**: Análisis de texto en tiempo real
2. ✅ **Análisis por Lotes**: Múltiples textos simultáneos
3. ✅ **Análisis de YouTube**: Extracción y análisis de comentarios
4. ✅ **EDA (Análisis Exploratorio)**: Visualizaciones del dataset
5. ✅ **Comparativa de Modelos**: Gráficos de rendimiento
6. ✅ **Estadísticas**: Dashboard de análisis realizados
7. ✅ **MLflow Metrics**: Tracking de experimentos

---

## 📊 SLIDE 12: Integración con YouTube

### Funcionalidad
- Extracción automática de comentarios de videos de YouTube
- Análisis en tiempo real de cada comentario
- Estadísticas agregadas del video

### Características
- ✅ Sin necesidad de API Key (usa `youtube-comment-downloader`)
- ✅ Filtrado por popularidad (top, newest)
- ✅ Límite configurable de comentarios
- ✅ Análisis individual y agregado

### Ejemplo de Uso
```
URL: https://www.youtube.com/watch?v=VIDEO_ID
Max comentarios: 20
Resultado: % tóxicos, lista de comentarios tóxicos, estadísticas
```

---

## 📊 SLIDE 13: Base de Datos y MLFlow

### Base de Datos (SQLite)
- ✅ Guardado automático de todas las predicciones
- ✅ Campos: texto, predicción, probabilidades, timestamp
- ✅ Consulta de historial y estadísticas

### MLFlow Tracking
- ✅ Registro de todos los experimentos
- ✅ Métricas: F1, Accuracy, Precision, Recall
- ✅ Parámetros: hiperparámetros optimizados
- ✅ Modelos: versionado de modelos entrenados
- ✅ UI disponible en `http://localhost:5000`

---

## 📊 SLIDE 14: Dockerización y Despliegue

### Docker
- ✅ **Backend**: Dockerfile multi-stage (Python 3.11)
- ✅ **Frontend**: Dockerfile multi-stage (Node.js + Nginx)
- ✅ **docker-compose.yml**: Orquestación local

### Despliegue en Render
- ✅ **Backend**: Web Service (Docker)
- ✅ **Frontend**: Web Service (Docker + Nginx)
- ✅ **Blueprint**: Despliegue conjunto desde `render.yaml`
- ✅ **Auto-deploy**: Activado desde rama `develop`

---

## 📊 SLIDE 15: Logros por Nivel

### 🟢 Nivel Esencial
- ✅ Modelo ML funcional (SVM, F1=0.7407)
- ✅ Overfitting < 5% (2.54%)
- ✅ API REST productiva
- ✅ Repositorio Git organizado
- ✅ Documentación completa

### 🟡 Nivel Medio
- ✅ Ensemble de modelos (Voting, Stacking)
- ✅ Integración YouTube
- ✅ Tests unitarios (pytest)
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

## 📊 SLIDE 16: Resultados Finales

### Objetivos Cumplidos ✅

| Objetivo | Valor Obtenido | Objetivo | Estado |
|----------|----------------|----------|--------|
| **F1-Score** | **0.7407** | > 0.55 | ✅ |
| **Overfitting** | **2.54%** | < 5% | ✅ |
| **Precision** | **0.6452** | - | ✅ |
| **Recall** | **0.8696** | - | ✅ |

### Mejoras Logradas
- ✅ **Reducción de overfitting**: 18.50% → 2.54% (-86.3%)
- ✅ **Mejora de F1-score**: 0.7263 → 0.7407 (+1.98%)
- ✅ **Reducción de falsos positivos**: 85 → 44 (-48.2%)

### Sistema Completo
- ✅ Backend API funcional
- ✅ Frontend moderno y completo
- ✅ Integración YouTube
- ✅ Base de datos y tracking
- ✅ Dockerizado y desplegado

---

## 📊 SLIDE 17: Conclusiones

### Logros Principales
1. ✅ Modelo con **overfitting < 5%** (2.54%)
2. ✅ **F1-score > 0.55** (0.7407)
3. ✅ Sistema completo y productivo
4. ✅ Todos los niveles implementados

### Aprendizajes
- Los modelos simples (SVM) pueden superar a modelos complejos (Transformers) con datasets pequeños
- La optimización de hiperparámetros es crucial para reducir overfitting
- El balance precision-recall requiere ajuste fino del umbral de decisión

### Próximos Pasos
- Ampliar el dataset para mejorar el modelo
- Probar con más datos para DistilBERT
- Implementar seguimiento en tiempo real con WebSockets
- Añadir soporte multiidioma

---

## 📊 SLIDE 18: Tecnologías Utilizadas

### Backend
- Python 3.11, FastAPI, scikit-learn, Optuna, Transformers, SQLAlchemy, MLFlow, spaCy

### Frontend
- React 18, Vite, Tailwind CSS, Recharts, Framer Motion, Axios

### DevOps
- Docker, Docker Compose, Render, Git/GitHub

### ML/NLP
- scikit-learn, Hugging Face Transformers, spaCy, NLTK, Optuna

---

## 📊 SLIDE 19: Métricas Técnicas del Proyecto

### Código
- **Líneas de código**: ~5,000+
- **Archivos Python**: 20+
- **Componentes React**: 10+
- **Tests unitarios**: 5 suites

### Modelos
- **Modelos entrenados**: 7 (4 baseline + 1 optimizado + 2 ensemble)
- **Experimentos MLFlow**: 10+
- **Tiempo de entrenamiento**: ~2 horas total

### Datos
- **Dataset**: 1,000 comentarios
- **Features**: 5,000 (TF-IDF)
- **Predicciones guardadas**: Variable (según uso)

---

## 📊 SLIDE 20: Demo / Q&A

### Demo en Vivo
- Mostrar la interfaz web
- Analizar un texto de ejemplo
- Analizar un video de YouTube
- Mostrar estadísticas y comparativas

### Preguntas Frecuentes
- ¿Por qué SVM y no DistilBERT?
- ¿Cómo se reduce el overfitting?
- ¿Qué pasa con otros idiomas?
- ¿Cómo escalar el sistema?

---

## 📧 Contacto

**Proyecto**: Detección de Hate Speech en YouTube  
**Autora**: Bárbara Sánchez  
**Repositorio**: Bootcamp-IA-P5/projectX_NLP_Barbara_Sanchez  
**Rama**: develop

---

## 📎 Notas para la Presentación

### Puntos Clave a Destacar
1. **Overfitting reducido de 18.50% a 2.54%** - Logro técnico importante
2. **F1-score de 0.7407** - Supera el objetivo de 0.55
3. **Sistema completo** - No solo un modelo, sino un producto funcional
4. **Todos los niveles completados** - Esencial, Medio, Avanzado, Experto

### Visualizaciones Recomendadas
- Gráfico de evolución del F1-score
- Comparativa de overfitting
- Matriz de confusión
- Screenshots del frontend
- Diagrama de arquitectura

### Tiempo Estimado
- **Presentación completa**: 15-20 minutos
- **Demo**: 5 minutos
- **Q&A**: 5-10 minutos

