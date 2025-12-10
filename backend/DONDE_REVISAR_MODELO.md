# 📍 Dónde Revisar el Modelo - Guía Completa

## 🔴 PROBLEMA IDENTIFICADO

El modelo tiene **Recall = 1.0**, lo que significa que **predice TODO como tóxico**. Esto causa que las probabilidades sean siempre similares.

### Métricas del Modelo:
- **F1-score**: 0.6866
- **Accuracy**: 0.58 (muy bajo)
- **Precision**: 0.5227 (muy bajo)
- **Recall**: 1.0000 ⚠️ **PROBLEMA**: Predice todo como tóxico

## 📁 ARCHIVOS A REVISAR (en orden de prioridad)

### 1. **Notebook de Optimización** ⭐ PRINCIPAL
**Archivo**: `backend/notebooks/05_Hyperparameter_Tuning.ipynb`

**Qué revisar:**
- **Línea ~65**: Verificar que `class_weight='balanced'` se está pasando
- **Línea ~340**: Ver cómo se guarda el modelo final
- **Línea ~250-260**: Ver métricas de evaluación (especialmente Recall)
- Buscar: `best_svm_params` - Ver qué parámetros se guardaron
- Buscar: `save_model` - Ver si se guarda con todos los parámetros

**Comando para verificar:**
```python
# Abrir el notebook y ejecutar:
print(best_svm_params)
print(best_svm.get_params())
```

### 2. **Módulo de Optimización**
**Archivo**: `backend/src/models/optimization.py`

**Líneas clave:**
- **Línea 65**: `class_weight='balanced'` en `objective_svm`
- **Línea 341**: `train_model(model_type, X_train, y_train, **best_params)`
  - ⚠️ **PROBLEMA POTENCIAL**: Si `best_params` no incluye `class_weight`, no se usará

**Qué verificar:**
```python
# Ver si best_params incluye class_weight
print(best_params)  # Debe incluir 'class_weight': 'balanced'
```

### 3. **Módulo de Entrenamiento**
**Archivo**: `backend/src/models/train.py`

**Líneas clave:**
- **Línea 82**: `class_weight: Optional[str] = 'balanced'` (tiene default)
- **Línea 97-103**: Creación del modelo SVC

**Qué verificar:**
- El default es `'balanced'`, pero si se pasa `None` explícitamente, se ignora

### 4. **Modelo Guardado**
**Archivo**: `backend/models/optimized/best_optimized_model.pkl`

**Cómo verificar:**
```python
import pickle
model = pickle.load(open('models/optimized/best_optimized_model.pkl', 'rb'))
print(model.get_params())
# Verificar: class_weight debe ser 'balanced' o un dict
```

### 5. **Dataset de Entrenamiento**
**Archivo**: `data/processed/youtoxic_english_1000_processed.csv` (si existe)

**Qué verificar:**
```python
import pandas as pd
df = pd.read_csv('data/processed/youtoxic_english_1000_processed.csv')
print(df['IsToxic'].value_counts())
# Debe estar relativamente balanceado
```

## 🔍 DIAGNÓSTICO PASO A PASO

### Paso 1: Verificar Modelo Guardado
```bash
cd backend
python3 -c "
import pickle
model = pickle.load(open('models/optimized/best_optimized_model.pkl', 'rb'))
params = model.get_params()
print('class_weight:', params.get('class_weight'))
print('probability:', params.get('probability'))
"
```

### Paso 2: Verificar Parámetros de Optimización
Abrir `backend/notebooks/05_Hyperparameter_Tuning.ipynb` y buscar:
- `best_svm_params` - Ver si incluye `class_weight`
- Cómo se guarda el modelo final

### Paso 3: Probar Re-entrenamiento
```python
# En el notebook, verificar que al guardar se incluyen todos los parámetros
best_params = {'C': 0.056, 'kernel': 'linear', 'class_weight': 'balanced'}
model = train_model('svm', X_train, y_train, **best_params)
# Verificar que el modelo tiene class_weight
print(model.get_params()['class_weight'])
```

## 🎯 SOLUCIÓN PROBABLE

El problema es que cuando se guarda el modelo final, **no se está incluyendo `class_weight` en los parámetros**.

### Solución 1: Re-entrenar con class_weight explícito
```python
# En el notebook 05_Hyperparameter_Tuning.ipynb
# Asegurar que best_params incluye class_weight:
if 'class_weight' not in best_svm_params:
    best_svm_params['class_weight'] = 'balanced'

# Re-entrenar
best_model = train_model('svm', X_train, y_train, **best_svm_params)

# Verificar
print(best_model.get_params()['class_weight'])  # Debe ser 'balanced'
```

### Solución 2: Verificar Notebook de Entrenamiento
Abrir `backend/notebooks/05_Hyperparameter_Tuning.ipynb` y buscar la celda donde se guarda el modelo. Verificar que se están pasando todos los parámetros.

## 📊 CÓMO VERIFICAR SI EL MODELO ESTÁ BIEN

### Test 1: Probar con Textos Extremos
```python
from src.api.predict import load_predictor
p = load_predictor()

# Textos claramente diferentes
texts = [
    'I absolutely love this amazing wonderful fantastic video',
    'I hate you you are stupid idiot moron terrible person'
]

for text in texts:
    result = p.predict(text)
    print(f'{text[:30]}... -> Toxic: {result["is_toxic"]}, Prob: {result["probability_toxic"]:.4f}')
```

**Resultado esperado:**
- Texto positivo: `is_toxic=False`, `probability_toxic < 0.3`
- Texto negativo: `is_toxic=True`, `probability_toxic > 0.7`

**Si ambos dan probabilidades similares (0.46-0.47) → Modelo mal entrenado**

### Test 2: Verificar Recall
```python
from sklearn.metrics import classification_report
# En el notebook, después de entrenar:
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))
```

**Si Recall de clase 0 (Not Toxic) es 0.0 → Modelo predice todo como tóxico**

## 🔧 ACCIÓN INMEDIATA

1. **Abrir**: `backend/notebooks/05_Hyperparameter_Tuning.ipynb`
2. **Buscar**: Celda donde se guarda `best_optimized_model`
3. **Verificar**: Que `best_params` incluye `class_weight='balanced'`
4. **Si no está**: Añadirlo y re-entrenar
5. **Guardar**: Modelo con todos los parámetros correctos

## 💡 NOTA IMPORTANTE

El código en `optimization.py` y `train.py` **SÍ usa `class_weight='balanced'`**, pero el modelo guardado puede no tenerlo si:
- Se guardó antes de añadir ese parámetro
- Se guardó con parámetros diferentes
- Hay un bug en cómo se pasan los parámetros al guardar

**La solución es re-entrenar el modelo asegurando que `class_weight='balanced'` esté incluido.**

