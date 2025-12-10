# 🔍 Análisis: Por qué el Modelo Predice Todo como Tóxico

## 📊 Estado Actual del Modelo

### Métricas del Modelo:
- **F1-score**: 0.6866
- **Accuracy**: 0.58 (muy bajo)
- **Precision**: 0.5227 (muy bajo)
- **Recall**: 1.0000 ⚠️ **PROBLEMA**: Predice todo como tóxico en el dataset de test

### Pruebas Directas:
```
Texto positivo (inglés) → is_toxic = False ✅
Texto negativo (inglés) → is_toxic = True ✅
Texto español → is_toxic = True (falso positivo) ⚠️
```

## 🔴 Problema Identificado

El modelo tiene **Recall = 1.0**, lo que significa que en el dataset de test predice **TODO como tóxico**. Esto sugiere:

1. **Sesgo hacia la clase positiva (tóxico)**
2. **Umbral de decisión muy bajo**
3. **Problema en el entrenamiento o evaluación**

## 🔍 Dónde Revisar

### 1. **Notebook de Optimización** (PRINCIPAL)
**Archivo**: `backend/notebooks/05_Hyperparameter_Tuning.ipynb`

**Qué buscar:**
- Línea ~250-260: Métricas de evaluación en test
- Verificar si `test_recall = 1.0`
- Verificar matriz de confusión
- Verificar distribución de clases en test

**Comandos para verificar:**
```python
# En el notebook, después de evaluar:
from sklearn.metrics import confusion_matrix, classification_report

y_test_pred = best_model.predict(X_test)
print(confusion_matrix(y_test, y_test_pred))
print(classification_report(y_test, y_test_pred))
```

### 2. **Dataset de Test**
**Archivo**: `backend/data/processed/youtoxic_english_1000_processed.csv`

**Verificar:**
- Distribución de clases en test
- Si hay desbalance extremo
- Si las etiquetas son correctas

### 3. **Umbral de Decisión del Modelo**

El modelo SVM usa `predict()` que devuelve la clase basada en:
- `decision_function()` > 0 → Clase 1 (Tóxico)
- `decision_function()` <= 0 → Clase 0 (No Tóxico)

**Problema potencial**: Si el modelo está sesgado, el hiperplano puede estar muy desplazado hacia una clase.

## 🎯 Soluciones Posibles

### Solución 1: Ajustar Umbral de Decisión
En lugar de usar `predict()` (umbral 0.5), usar un umbral personalizado:

```python
# En predict.py
decision = model.decision_function(text_vectorized)[0]
prob_toxic = probabilities[1]

# Usar umbral más alto para reducir falsos positivos
threshold = 0.6  # En lugar de 0.5
is_toxic = prob_toxic > threshold
```

### Solución 2: Re-entrenar con Mejor Balanceo
```python
# En optimization.py o train.py
model = SVC(
    C=0.056,
    kernel='linear',
    class_weight={0: 1.0, 1: 0.8},  # Reducir peso de clase tóxica
    probability=True
)
```

### Solución 3: Verificar Dataset
```python
# Verificar distribución
import pandas as pd
df = pd.read_csv('data/processed/youtoxic_english_1000_processed.csv')
print(df['IsToxic'].value_counts())
print(df['IsToxic'].value_counts(normalize=True))
```

## 📝 Pasos para Diagnosticar

1. **Abrir**: `backend/notebooks/05_Hyperparameter_Tuning.ipynb`
2. **Buscar**: Celda donde se evalúa el modelo final
3. **Verificar**: Matriz de confusión y recall
4. **Si recall = 1.0**: El modelo predice todo como tóxico en test
5. **Revisar**: Distribución de clases en test

## 💡 Nota Importante

El modelo puede funcionar bien con textos en inglés pero fallar con:
- Textos en otros idiomas (español, etc.)
- Textos muy cortos
- Textos con vocabulario fuera del entrenamiento

Esto es **normal** porque el modelo está entrenado solo con datos en inglés.

