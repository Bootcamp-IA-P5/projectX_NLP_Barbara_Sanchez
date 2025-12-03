# Estrategias para Reducir Overfitting

## Estado Actual
- **Diferencia F1 (train-test)**: 23.32%
- **Objetivo**: <5%
- **Modelo actual**: SVM + TF-IDF (C=0.8168, kernel='linear')

## Estrategias Implementadas

### 1. **Reducir Complejidad del Vectorizador** ✅

**Cambios:**
- `max_features`: 5000 → **1000** (menos features)
- `ngram_range`: (1,2) → **(1,1)** (solo unigramas, sin bigramas)
- `min_df`: 2 → **3** (filtrar más palabras raras)
- `max_df`: 0.95 → **0.90** (filtrar más palabras comunes)

**Razón**: Menos features = menos complejidad = menos overfitting

---

### 2. **Regularización Más Fuerte** ✅

**Cambios en hiperparámetros:**
- `C`: Rango 0.1-10.0 → **0.01-1.0** (más regularización)
- C más bajo = modelo más simple = menos overfitting

**Razón**: La regularización penaliza modelos complejos que memorizan los datos

---

### 3. **Función Objetivo Anti-Overfitting** ✅

**Nueva estrategia en Optuna:**
- **PRIORIDAD 1**: Bonus grande si overfitting < 5%
- **PRIORIDAD 2**: Penalización fuerte si overfitting > 5%
- **PRIORIDAD 3**: F1-score en test (menos importante que overfitting)
- **PRIORIDAD 4**: Penalizar recall muy bajo (<0.3)

**Razón**: Forzar a Optuna a encontrar modelos con bajo overfitting

---

### 4. **Feature Selection** (Si es necesario) ✅

**Si el modelo anterior aún tiene overfitting:**
- Seleccionar solo las **500 features más importantes**
- Usar `SelectKBest` con `f_classif`

**Razón**: Reducir aún más la dimensionalidad

---

### 5. **Validación Cruzada** ✅

**Confirmar resultados:**
- 5-fold stratified cross-validation
- Verificar que el modelo generaliza bien

**Razón**: Validar que el modelo no está sobreajustado al test set

---

## Cómo Ejecutar

1. **Abrir el notebook**: `notebooks/anti_overfitting.ipynb`
2. **Ejecutar todas las celdas** en orden
3. **Revisar resultados** en cada sección

## Resultados Esperados

### Si funciona bien:
- ✅ Diferencia F1 < 5%
- ✅ F1-score test > 0.60 (mantener rendimiento)
- ✅ Modelo guardado en `models/final_model_anti_overfitting.pkl`

### Si aún hay overfitting:
- Probar **Estrategia 3** (Feature Selection)
- Considerar **data augmentation**
- Probar modelos más simples (Logistic Regression)

---

## Técnicas Adicionales (Si las anteriores no funcionan)

### A. Data Augmentation
- Traducción y retraducción
- Reemplazo por sinónimos
- Parafraseo

### B. Modelos Más Simples
- Logistic Regression (más simple que SVM)
- Naive Bayes (muy simple, menos overfitting)

### C. Ensemble con Regularización
- Voting Classifier con modelos regularizados
- Bagging con modelos simples

### D. Aceptar Overfitting pero Documentarlo
- Si después de todo sigue >5%, documentar:
  - Por qué ocurre (dataset pequeño)
  - Qué se intentó
  - Cómo mitigarlo en producción

---

## Notas Importantes

⚠️ **Trade-off**: Reducir overfitting puede reducir el F1-score
- Objetivo: Encontrar balance entre rendimiento y generalización

⚠️ **Dataset pequeño**: Con 800 muestras de entrenamiento, es difícil evitar overfitting completamente

✅ **Prioridad**: Control de overfitting <5% es más importante que F1-score alto

---

## Archivos Generados

Después de ejecutar el notebook:
- `models/final_model_anti_overfitting.pkl` - Modelo final
- `models/final_tfidf_vectorizer.pkl` - Vectorizador
- `models/final_model_info.pkl` - Información del modelo


