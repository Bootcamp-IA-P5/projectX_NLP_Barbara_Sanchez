# 📋 PLAN COMPLETO DEL PROYECTO - Detección de Hate Speech en YouTube
## Empezar desde cero con control total

---

## 🔍 ANÁLISIS DE LA SITUACIÓN ACTUAL

### Lo que tienes:
- ✅ Dataset: `youtoxic_english_1000.csv` (1000 comentarios)
- ✅ Datos preprocesados guardados
- ✅ Modelos entrenados guardados
- ✅ Estructura `src/` creada (pero vacía)
- ✅ Múltiples notebooks de experimentación
- ✅ Múltiples ramas de Git (desorganizadas)

### Problemas identificados:
- ⚠️ Ramas de Git desorganizadas (develop, feat/EDA, feat/models, etc.)
- ⚠️ Notebooks dispersos sin organización clara
- ⚠️ Código no modularizado (todo en notebooks)
- ⚠️ Falta estructura clara del proyecto
- ⚠️ No hay control de qué está en cada rama

---

## 🎯 OBJETIVOS DEL PROYECTO (Según el Briefing)

### 🟢 Nivel Esencial (OBLIGATORIO):
1. ✅ Modelo ML que reconozca mensajes de odio
2. ✅ Overfitting < 5% (diferencia train-test)
3. ✅ Productivización (interfaz/API)
4. ✅ Repositorio Git organizado (ramas + commits limpios)
5. ✅ Documentación (README + código documentado)

### 🟡 Nivel Medio (RECOMENDADO):
6. ✅ Ensemble de modelos
7. ✅ Integración con YouTube (URL de video)
8. ✅ Tests unitarios
9. ✅ Optimización de hiperparámetros (Optuna)

### 🟠 Nivel Avanzado (BONUS):
10. ✅ Redes neuronales (RNN/LSTM)
11. ✅ Seguimiento en tiempo real
12. ✅ Despliegue público
13. ✅ Dockerización

### 🔴 Nivel Experto (BONUS EXTRA):
14. ✅ Transformers (BERT/DistilBERT)
15. ✅ Base de datos para predicciones
16. ✅ MLFlow para tracking

---

## 📐 ESTRUCTURA DEL PROYECTO (Propuesta)

```
projectX_NLP_B-rbara_S-nchez/
│
├── data/
│   ├── raw/                    # Datos originales (NO tocar)
│   │   └── youtoxic_english_1000.csv
│   ├── processed/              # Datos preprocesados
│   │   ├── train/
│   │   └── test/
│   └── README.md               # Descripción del dataset
│
├── notebooks/
│   ├── 01_EDA.ipynb            # Análisis exploratorio
│   ├── 02_Preprocessing.ipynb  # Preprocesamiento
│   ├── 03_Feature_Engineering.ipynb  # Vectorización
│   ├── 04_Modeling_Baseline.ipynb     # Modelos baseline
│   ├── 05_Hyperparameter_Tuning.ipynb # Optimización
│   ├── 06_Anti_Overfitting.ipynb      # Reducción overfitting
│   └── 07_Transformers.ipynb          # DistilBERT (nivel experto)
│
├── src/
│   ├── __init__.py
│   ├── data/
│   │   ├── __init__.py
│   │   ├── load_data.py        # Cargar datos
│   │   └── preprocessing.py    # Funciones de preprocesamiento
│   ├── features/
│   │   ├── __init__.py
│   │   └── vectorization.py    # TF-IDF, Count Vectorizer
│   ├── models/
│   │   ├── __init__.py
│   │   ├── train.py            # Entrenar modelos
│   │   ├── predict.py          # Hacer predicciones
│   │   └── evaluate.py         # Evaluar modelos
│   └── utils/
│       ├── __init__.py
│       └── helpers.py          # Funciones auxiliares
│
├── models/                      # Modelos guardados
│   ├── baseline/
│   ├── optimized/
│   └── transformers/
│
├── app/                         # Aplicación Streamlit
│   ├── app.py
│   └── requirements.txt
│
├── tests/                       # Tests unitarios
│   ├── __init__.py
│   ├── test_preprocessing.py
│   ├── test_vectorization.py
│   └── test_models.py
│
├── docs/                        # Documentación
│   ├── EDA_RESULTS.md
│   ├── PREPROCESSING.md
│   ├── MODELING_RESULTS.md
│   └── API_DOCUMENTATION.md
│
├── .gitignore
├── requirements.txt
├── README.md
└── PLAN_PROYECTO_COMPLETO.md    # Este archivo
```

---

## 🌿 ESTRATEGIA DE RAMAS GIT

### Ramas principales:
- **`main`**: Código estable y funcional (solo merges de develop)
- **`develop`**: Rama de desarrollo principal (integración de features)

### Ramas de features (una por tarea):
- **`feat/01-eda`**: Análisis exploratorio
- **`feat/02-preprocessing`**: Preprocesamiento
- **`feat/03-features`**: Feature engineering
- **`feat/04-modeling-baseline`**: Modelos baseline
- **`feat/05-hyperparameter-tuning`**: Optimización
- **`feat/06-anti-overfitting`**: Reducción overfitting
- **`feat/07-transformers`**: DistilBERT (nivel experto)
- **`feat/08-modularization`**: Modularizar código
- **`feat/09-streamlit-app`**: Interfaz Streamlit
- **`feat/10-youtube-integration`**: Integración YouTube API
- **`feat/11-tests`**: Tests unitarios
- **`feat/12-docker`**: Dockerización (nivel avanzado)

### Flujo de trabajo:
1. Crear rama desde `develop`
2. Trabajar en la feature
3. Commit frecuente y descriptivo
4. Merge a `develop` cuando esté lista
5. Merge `develop` → `main` cuando esté estable

---

## 📅 PLAN PASO A PASO (8 días)

### **DÍA 1: LIMPIEZA Y ORGANIZACIÓN**

#### Objetivo: Empezar con proyecto limpio y organizado

**Tareas:**

1. **Limpieza de Git** (30 min)
   - Decidir qué mantener y qué eliminar
   - Crear rama `develop` limpia desde `main`
   - Eliminar ramas obsoletas o fusionarlas

2. **Estructura del proyecto** (1h)
   - Crear estructura de carpetas completa
   - Crear archivos `__init__.py` necesarios
   - Crear `.gitignore` apropiado
   - Crear `requirements.txt` inicial

3. **Documentación inicial** (30 min)
   - Actualizar `README.md` con estructura del proyecto
   - Crear `PLAN_PROYECTO_COMPLETO.md` (este archivo)
   - Documentar decisiones de diseño

4. **Revisión del dataset** (30 min)
   - Verificar que el dataset está completo
   - Entender la estructura de los datos
   - Documentar en `data/README.md`

**Entregable**: Proyecto limpio y organizado, README actualizado

---

### **DÍA 2: EDA (Análisis Exploratorio de Datos)**

#### Objetivo: Entender completamente el dataset

**Rama**: `feat/01-eda`

**Tareas:**

1. **Cargar y explorar datos** (1h)
   - Cargar `youtoxic_english_1000.csv`
   - Estadísticas básicas (filas, columnas, nulos)
   - Distribución de clases (tóxico vs no tóxico)
   - Análisis de balance de clases

2. **Análisis de texto** (2h)
   - Longitud promedio de comentarios
   - Palabras más frecuentes
   - Análisis de tipos de toxicidad (IsAbusive, IsHatespeech, etc.)
   - Visualizaciones (distribuciones, word clouds)

3. **Insights y documentación** (1h)
   - Documentar hallazgos en `docs/EDA_RESULTS.md`
   - Identificar problemas potenciales
   - Decidir estrategia de preprocesamiento

**Entregable**: Notebook `01_EDA.ipynb` completo + `docs/EDA_RESULTS.md`

---

### **DÍA 3: PREPROCESAMIENTO**

#### Objetivo: Limpiar y normalizar el texto

**Rama**: `feat/02-preprocessing`

**Tareas:**

1. **Implementar pipeline de preprocesamiento** (2h)
   - Limpieza básica (URLs, emails, caracteres especiales)
   - Normalización (contracciones, repeticiones)
   - Tokenización (NLTK o spaCy)
   - Eliminación de stopwords
   - Lematización (spaCy preferido sobre stemming)

2. **Aplicar preprocesamiento** (1h)
   - Aplicar pipeline a todo el dataset
   - Guardar datos preprocesados
   - Verificar calidad del preprocesamiento

3. **Modularizar código** (1h)
   - Crear `src/data/preprocessing.py`
   - Funciones reutilizables
   - Tests básicos

**Entregable**: 
- Notebook `02_Preprocessing.ipynb`
- `src/data/preprocessing.py` modularizado
- Datos preprocesados guardados

---

### **DÍA 4: FEATURE ENGINEERING**

#### Objetivo: Convertir texto en vectores numéricos

**Rama**: `feat/03-features`

**Tareas:**

1. **Implementar vectorización** (2h)
   - TF-IDF Vectorizer
   - Count Vectorizer (Bag of Words)
   - Probar diferentes configuraciones (ngram_range, max_features)
   - Comparar resultados

2. **División train/test** (30 min)
   - Estratificado (mantener proporción de clases)
   - Guardar splits

3. **Modularizar código** (1h)
   - Crear `src/features/vectorization.py`
   - Funciones reutilizables

**Entregable**:
- Notebook `03_Feature_Engineering.ipynb`
- `src/features/vectorization.py`
- Matrices vectorizadas guardadas

---

### **DÍA 5: MODELADO BASELINE**

#### Objetivo: Entrenar modelos clásicos y seleccionar baseline

**Rama**: `feat/04-modeling-baseline`

**Tareas:**

1. **Entrenar modelos clásicos** (2h)
   - Naive Bayes
   - Logistic Regression
   - SVM
   - Random Forest
   - Comparar TF-IDF vs Count Vectorizer

2. **Evaluación y selección** (1h)
   - Calcular métricas (F1, Accuracy, Precision, Recall)
   - Analizar overfitting (diferencia train-test)
   - Seleccionar mejor modelo baseline
   - Documentar resultados

3. **Modularizar código** (1h)
   - Crear `src/models/train.py`
   - Crear `src/models/evaluate.py`

**Entregable**:
- Notebook `04_Modeling_Baseline.ipynb`
- `src/models/train.py` y `evaluate.py`
- Modelo baseline guardado
- `docs/MODELING_RESULTS.md`

---

### **DÍA 6: OPTIMIZACIÓN Y ANTI-OVERFITTING**

#### Objetivo: Reducir overfitting a <5% y optimizar hiperparámetros

**Rama**: `feat/06-anti-overfitting`

**Tareas:**

1. **Optimización de hiperparámetros** (2h)
   - Usar Optuna para optimizar modelo seleccionado
   - Función objetivo que priorice overfitting <5%
   - Probar diferentes configuraciones

2. **Técnicas anti-overfitting** (2h)
   - Regularización más fuerte
   - Reducir complejidad del vectorizador
   - Probar modelos alternativos (Naive Bayes, Random Forest, XGBoost)
   - Si no funciona: probar Transformers (DistilBERT)

3. **Validación cruzada** (30 min)
   - 5-fold cross-validation
   - Confirmar que el modelo generaliza

**Entregable**:
- Notebook `06_Anti_Overfitting.ipynb`
- Modelo optimizado guardado
- Overfitting <5% (objetivo cumplido)

---

### **DÍA 7: MODULARIZACIÓN Y PRODUCTIVIZACIÓN**

#### Objetivo: Código modular y aplicación funcional

**Rama**: `feat/08-modularization` y `feat/09-streamlit-app`

**Tareas:**

1. **Modularización completa** (2h)
   - Revisar y completar módulos en `src/`
   - Asegurar que todo es reutilizable
   - Tests básicos

2. **Aplicación Streamlit** (3h)
   - Crear `app/app.py`
   - Interfaz simple: input de texto → predicción
   - Mostrar probabilidad y resultado
   - Diseño limpio y funcional

3. **Integración YouTube (Nivel Medio)** (1h)
   - Función para extraer comentarios de URL
   - Integrar en Streamlit
   - Mostrar resultados en tabla

**Entregable**:
- Código completamente modularizado
- App Streamlit funcional
- Integración YouTube (si nivel medio)

---

### **DÍA 8: PULIDO FINAL Y DOCUMENTACIÓN**

#### Objetivo: Proyecto completo y listo para entrega

**Rama**: `feat/12-documentation`

**Tareas:**

1. **Tests unitarios** (2h)
   - Tests para preprocesamiento
   - Tests para vectorización
   - Tests para modelos
   - Configurar pytest

2. **Documentación completa** (2h)
   - README.md completo
   - Documentación de funciones (docstrings)
   - Guía de instalación y uso
   - Documentación de la API

3. **Git final** (1h)
   - Revisar todos los commits
   - Asegurar que todo está en las ramas correctas
   - Merge final a `main`
   - Tags de versión

4. **Preparación presentación** (1h)
   - Slides técnicos
   - Preparar demo
   - Tablero Kanban actualizado

**Entregable**: Proyecto completo, documentado y listo para entrega

---

## 🎯 DECISIONES TÉCNICAS IMPORTANTES

### Preprocesamiento:
- **Librería**: spaCy (más rápido y preciso que NLTK)
- **Lematización**: Sí (mejor que stemming)
- **Stopwords**: Sí (eliminar palabras comunes)
- **Normalización**: Sí (contracciones, repeticiones)

### Vectorización:
- **Principal**: TF-IDF (mejor que Count Vectorizer)
- **N-grams**: (1, 2) - unigramas y bigramas
- **Max features**: 500-1000 (balance entre información y overfitting)

### Modelos:
- **Baseline**: Probar Naive Bayes, Logistic Regression, SVM
- **Optimización**: Optuna
- **Si no funciona**: DistilBERT (Transformers)

### Overfitting:
- **Objetivo**: <5% diferencia F1 train-test
- **Estrategias**:
  1. Regularización más fuerte
  2. Reducir complejidad (menos features)
  3. Modelos más simples
  4. Si no funciona: Transformers

---

## 📝 CHECKLIST DE ENTREGA

### 🟢 Nivel Esencial:
- [ ] Modelo ML entrenado y guardado
- [ ] Overfitting <5% (diferencia F1 train-test)
- [ ] App Streamlit funcional
- [ ] Repositorio Git organizado (ramas + commits)
- [ ] README completo
- [ ] Código documentado

### 🟡 Nivel Medio:
- [ ] Ensemble de modelos
- [ ] Integración YouTube API
- [ ] Tests unitarios
- [ ] Optimización con Optuna

### 🟠 Nivel Avanzado:
- [ ] RNN/LSTM implementado
- [ ] Dockerización
- [ ] Despliegue público

### 🔴 Nivel Experto:
- [ ] DistilBERT implementado
- [ ] Base de datos para predicciones
- [ ] MLFlow tracking

---

## 🚀 PRÓXIMOS PASOS INMEDIATOS

1. **Decidir qué mantener del proyecto actual**
   - ¿Mantener datos preprocesados? → Sí, ahorra tiempo
   - ¿Mantener modelos entrenados? → Solo como referencia
   - ¿Mantener notebooks? → Reorganizarlos

2. **Crear estructura limpia**
   - Crear todas las carpetas
   - Crear archivos base
   - Configurar Git correctamente

3. **Empezar con DÍA 1**
   - Limpieza y organización
   - Estructura del proyecto
   - README inicial

---

## ❓ PREGUNTAS PARA DECIDIR ANTES DE EMPEZAR

1. **¿Qué nivel quieres alcanzar?**
   - Mínimo: Nivel Esencial (obligatorio)
   - Recomendado: Nivel Esencial + Nivel Medio
   - Ambicioso: Todos los niveles

2. **¿Qué mantener del proyecto actual?**
   - Datos preprocesados: ✅ Sí (ahorra tiempo)
   - Modelos entrenados: ⚠️ Solo como referencia
   - Notebooks: ⚠️ Reorganizarlos

3. **¿Estrategia de ramas?**
   - Propuesta: `main` (estable) + `develop` (desarrollo) + `feat/*` (features)
   - ¿Te parece bien?

---

**¿Estás listo para empezar? Cuando me digas, comenzamos con el DÍA 1: Limpieza y Organización.**

