# 🔍 Diagnóstico del Modelo

## Problema Reportado
Las probabilidades parecen siempre iguales, incluso con textos diferentes en inglés.

## Análisis Realizado

### 1. Pruebas del Modelo Directamente

El modelo **SÍ está dando resultados diferentes**, pero las diferencias son pequeñas:

```
"I love this"      -> Prob Toxic: 0.460312
"I hate you"       -> Prob Toxic: 0.467723
"This is good"     -> Prob Toxic: 0.456552
"You are bad"      -> Prob Toxic: 0.467729
```

### 2. Problema Identificado

**Las probabilidades son muy similares** (todas alrededor de 0.46-0.47), lo que sugiere:

1. **El modelo no es muy confiable** - Las probabilidades están muy cerca de 0.5 (50/50)
2. **El modelo puede estar sobre-entrenado o mal calibrado**
3. **El vocabulario es limitado** - Solo 1000 palabras
4. **El modelo SVM puede necesitar mejor calibración de probabilidades**

### 3. Información del Modelo

- **Tipo**: SVC (Support Vector Classifier)
- **Vocabulario**: 1000 palabras
- **Clases**: [0, 1] (Not Toxic, Toxic)

## Posibles Causas

### Causa 1: Modelo No Calibrado
SVM no produce probabilidades directamente. Scikit-learn usa `predict_proba` que puede no estar bien calibrado.

### Causa 2: Vocabulario Limitado
Con solo 1000 palabras, muchos textos se vectorizan de forma similar.

### Causa 3: Modelo Débil
El modelo puede no estar aprendiendo bien las diferencias entre textos tóxicos y no tóxicos.

## Lugares para Revisar

### 1. Entrenamiento del Modelo
**Archivo**: `notebooks/05_Hyperparameter_Tuning.ipynb` o similar
- Verificar cómo se entrenó el modelo
- Verificar métricas de entrenamiento (F1-score, accuracy)
- Verificar si se usó calibración de probabilidades

### 2. Modelo Guardado
**Archivo**: `backend/models/optimized/best_optimized_model.pkl`
- Verificar qué modelo se guardó
- Verificar si es el mejor modelo o uno intermedio

### 3. Vectorizador
**Archivo**: `backend/models/tfidf_vectorizer.pkl`
- Verificar tamaño del vocabulario
- Verificar parámetros (max_features=1000)

### 4. Datos de Entrenamiento
**Archivo**: `data/processed/` o similar
- Verificar calidad del dataset
- Verificar balance de clases
- Verificar tamaño del dataset

## Soluciones Posibles

### Solución 1: Re-entrenar con Calibración
```python
from sklearn.calibration import CalibratedClassifierCV

# Calibrar el modelo
calibrated_model = CalibratedClassifierCV(model, cv=5, method='sigmoid')
calibrated_model.fit(X_train, y_train)
```

### Solución 2: Aumentar Vocabulario
```python
# En vectorización, aumentar max_features
vectorizer = TfidfVectorizer(max_features=5000)  # En lugar de 1000
```

### Solución 3: Usar Modelo Diferente
- Logistic Regression (mejores probabilidades)
- Random Forest (mejores probabilidades)
- Naive Bayes (probabilidades naturales)

### Solución 4: Verificar Dataset
- Asegurar que el dataset es de buena calidad
- Asegurar que está balanceado
- Asegurar que tiene suficientes ejemplos

## Cómo Verificar el Modelo

### 1. Ver Métricas de Entrenamiento
```python
# Buscar en notebooks donde se entrenó
# Ver F1-score, accuracy, precision, recall
```

### 2. Probar con Textos Extremos
```python
# Textos claramente tóxicos deberían dar > 0.7
# Textos claramente no tóxicos deberían dar < 0.3
```

### 3. Verificar Calibración
```python
from sklearn.calibration import calibration_curve
# Ver si las probabilidades están bien calibradas
```

