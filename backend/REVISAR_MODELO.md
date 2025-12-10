# 🔍 Guía: Dónde Revisar el Modelo

## Problema Identificado

El modelo tiene **Recall = 1.0**, lo que significa que predice **TODO como tóxico**. Esto explica por qué las probabilidades son siempre similares.

### Métricas del Modelo Actual:
- **F1-score**: 0.6866
- **Accuracy**: 0.58 (muy bajo, casi al azar)
- **Precision**: 0.5227 (muy bajo)
- **Recall**: 1.0000 ⚠️ **PROBLEMA**: Predice todo como tóxico

## 📁 Archivos a Revisar

### 1. **Notebook de Optimización** (PRINCIPAL)
**Archivo**: `backend/notebooks/05_Hyperparameter_Tuning.ipynb`

**Qué revisar:**
- Cómo se cargaron los datos
- Distribución de clases (¿está balanceado?)
- Parámetros del modelo optimizado
- Métricas de entrenamiento vs test
- Si hay problemas de balance de clases

**Líneas clave a buscar:**
- Carga de datos
- `y_train.value_counts()` - Ver distribución de clases
- `best_svm_params` - Ver parámetros finales
- Métricas de evaluación

### 2. **Dataset de Entrenamiento**
**Archivo**: `data/processed/youtoxic_english_1000_processed.csv` o similar

**Qué revisar:**
- ¿Cuántos ejemplos hay de cada clase?
- ¿Está balanceado el dataset?
- ¿Qué columnas tiene?
- ¿Cómo se etiquetaron los datos?

**Comando para verificar:**
```python
import pandas as pd
df = pd.read_csv('data/processed/youtoxic_english_1000_processed.csv')
print(df['IsToxic'].value_counts())  # Ver distribución
print(df['IsToxic'].value_counts(normalize=True))  # Ver porcentajes
```

### 3. **Módulo de Optimización**
**Archivo**: `backend/src/models/optimization.py`

**Qué revisar:**
- Cómo se optimizan los hiperparámetros
- Si hay validación cruzada
- Si se está usando estratificación
- Cómo se calcula el recall

### 4. **Módulo de Entrenamiento**
**Archivo**: `backend/src/models/train.py`

**Qué revisar:**
- Cómo se entrena el modelo
- Si se usa balanceo de clases
- Parámetros por defecto

### 5. **Módulo de Evaluación**
**Archivo**: `backend/src/models/evaluate.py`

**Qué revisar:**
- Cómo se calculan las métricas
- Si hay problemas en el cálculo de recall

## 🔧 Posibles Causas del Problema

### Causa 1: Dataset Desbalanceado
Si el dataset tiene muchos más ejemplos de una clase que de otra, el modelo puede aprender a predecir siempre la clase mayoritaria.

**Solución:**
```python
# Usar class_weight='balanced' en SVM
from sklearn.svm import SVC
model = SVC(class_weight='balanced', ...)
```

### Causa 2: Parámetros Incorrectos
El modelo puede tener parámetros que lo sesgan hacia una clase.

**Revisar:**
- `C` (regularización) - puede estar muy bajo
- `class_weight` - puede estar desbalanceado
- `kernel` - puede no ser el adecuado

### Causa 3: Problema en la Etiquetación
Los datos pueden estar mal etiquetados o tener un sesgo.

**Revisar:**
- Verificar que las etiquetas son correctas
- Verificar que 0 = Not Toxic, 1 = Toxic

## 🎯 Pasos para Diagnosticar

### Paso 1: Verificar Dataset
```python
import pandas as pd
df = pd.read_csv('data/processed/youtoxic_english_1000_processed.csv')
print("Distribución de clases:")
print(df['IsToxic'].value_counts())
print("\nPorcentajes:")
print(df['IsToxic'].value_counts(normalize=True))
```

### Paso 2: Verificar Modelo
```python
from src.api.predict import load_predictor
p = load_predictor()

# Probar con textos claramente diferentes
texts = [
    'I love this amazing video',
    'I hate you you are stupid'
]

for text in texts:
    result = p.predict(text)
    print(f'{text} -> {result["is_toxic"]} ({result["probability_toxic"]:.4f})')
```

### Paso 3: Revisar Notebook de Entrenamiento
Abrir `backend/notebooks/05_Hyperparameter_Tuning.ipynb` y revisar:
- Distribución de clases
- Métricas de entrenamiento
- Parámetros del mejor modelo

## 💡 Soluciones Posibles

### Solución 1: Re-entrenar con Balanceo
```python
from sklearn.svm import SVC

model = SVC(
    C=0.056,
    kernel='linear',
    class_weight='balanced',  # Añadir esto
    probability=True
)
```

### Solución 2: Usar Otro Modelo
- Logistic Regression (mejores probabilidades)
- Random Forest (mejor con datos desbalanceados)
- XGBoost (mejor manejo de desbalance)

### Solución 3: Re-balancear Dataset
- Oversampling de clase minoritaria
- Undersampling de clase mayoritaria
- SMOTE

## 📝 Comandos Útiles

```bash
# Ver información del modelo guardado
cd backend
python3 -c "import pickle; m = pickle.load(open('models/optimized/best_optimized_model.pkl', 'rb')); print(type(m)); print(m.get_params())"

# Ver información del dataset
python3 -c "import pandas as pd; df = pd.read_csv('data/processed/youtoxic_english_1000_processed.csv'); print(df['IsToxic'].value_counts())"
```

