# 📊 Resumen: Problema de Probabilidades Similares

## ✅ Lo que SÍ funciona

1. **El modelo predice correctamente**:
   - Textos positivos → `is_toxic=False`
   - Textos negativos → `is_toxic=True`

2. **Los vectores son diferentes**:
   - Diferentes textos producen diferentes vectores
   - El modelo recibe información diferente

3. **El código está correcto**:
   - `class_weight='balanced'` está configurado
   - `probability=True` está configurado
   - El preprocesamiento funciona

## 🔴 El Problema Real

**Las probabilidades están mal calibradas** - todas muy cerca de 0.5:

```
Texto positivo:  probability_toxic = 0.45
Texto negativo:  probability_toxic = 0.47
Diferencia: solo 0.02 (2%)
```

### ¿Por qué pasa esto?

1. **SVM no produce probabilidades naturales**
   - SVM usa `predict_proba` que no está bien calibrado
   - Las probabilidades de SVM tienden a estar cerca de 0.5

2. **Vocabulario limitado (1000 palabras)**
   - Muchos textos se vectorizan de forma similar
   - El modelo no puede diferenciar bien

3. **Modelo débil**
   - F1-score: 0.6866 (no es muy alto)
   - Accuracy: 0.58 (muy bajo, casi al azar)
   - El modelo no está aprendiendo bien

## 📍 Dónde Revisar

### 1. **Notebook de Entrenamiento** (PRINCIPAL)
**Archivo**: `backend/notebooks/05_Hyperparameter_Tuning.ipynb`

**Qué buscar:**
- Métricas de evaluación (línea ~250-260)
- Cómo se guarda el modelo (línea ~340-473)
- Si se usó calibración de probabilidades

**Comandos útiles:**
```python
# Ver métricas del modelo guardado
import pickle
info = pickle.load(open('models/optimized/best_optimized_model_info.pkl', 'rb'))
print(info)
```

### 2. **Dataset de Entrenamiento**
**Archivo**: `data/processed/youtoxic_english_1000_processed.csv`

**Verificar:**
- Tamaño del dataset (1000 ejemplos es muy poco)
- Calidad de las etiquetas
- Balance de clases

### 3. **Módulo de Optimización**
**Archivo**: `backend/src/models/optimization.py`

**Línea 341**: Verificar que se pasan todos los parámetros al guardar

### 4. **Módulo de Entrenamiento**
**Archivo**: `backend/src/models/train.py`

**Línea 97-103**: Verificar creación del modelo SVC

## 🔧 Soluciones Posibles

### Solución 1: Calibrar Probabilidades (Recomendado)
```python
from sklearn.calibration import CalibratedClassifierCV

# Calibrar el modelo
calibrated_model = CalibratedClassifierCV(
    model, 
    cv=5, 
    method='sigmoid'  # o 'isotonic'
)
calibrated_model.fit(X_train, y_train)
```

### Solución 2: Usar Modelo Diferente
- **Logistic Regression**: Mejores probabilidades calibradas
- **Random Forest**: Probabilidades más confiables
- **Naive Bayes**: Probabilidades naturales

### Solución 3: Aumentar Vocabulario
```python
# En vectorización, aumentar max_features
vectorizer = TfidfVectorizer(max_features=5000)  # En lugar de 1000
```

### Solución 4: Más Datos de Entrenamiento
- 1000 ejemplos es muy poco
- Necesitas al menos 5000-10000 ejemplos

## 🎯 Acción Inmediata

1. **Abrir**: `backend/notebooks/05_Hyperparameter_Tuning.ipynb`
2. **Buscar**: Celda donde se evalúa el modelo final
3. **Verificar**: Métricas de test (especialmente Recall)
4. **Revisar**: Si se usó calibración de probabilidades
5. **Si no**: Añadir calibración y re-entrenar

## 📝 Nota Final

**El problema NO es del código**, es del modelo:
- El modelo está prediciendo correctamente (clases)
- Pero las probabilidades no están bien calibradas
- Esto es normal en SVM sin calibración

**La solución es calibrar las probabilidades o usar un modelo diferente.**

