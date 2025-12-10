# ⚠️ CORRECCIÓN: Métricas Reales del Proyecto

## ❌ Información INCORRECTA de ChatGPT

ChatGPT proporcionó información **FALSA** sobre las métricas:

### ❌ Afirmaciones Incorrectas:
1. **"El modelo ensemble combina predicciones... logrando un F1-score de 0.92"**
   - **FALSO**: El ensemble NO logró 0.92. Los ensembles fueron PEORES que el modelo individual.

2. **"DistilBERT supera ligeramente al ensemble en precisión, alcanzando 94%"**
   - **FALSO**: DistilBERT NO fue seleccionado. Tiene overfitting del 24.41% (muy alto).

---

## ✅ Métricas REALES del Proyecto

### 🏆 Modelo Seleccionado: **SVM Optimizado**

| Métrica | Valor Real | Objetivo | Estado |
|---------|------------|----------|--------|
| **F1-Score (Test)** | **0.7407** | > 0.55 | ✅ |
| **F1-Score (Train)** | 0.7595 | - | - |
| **Overfitting** | **2.54%** | < 5% | ✅ |
| **Accuracy** | **0.64** | - | - |
| **Precision** | **0.6452** | - | - |
| **Recall** | **0.8696** | - | - |

### 📊 Comparativa REAL de Modelos

| Modelo | F1-Score (Test) | Overfitting | Seleccionado |
|--------|----------------|-------------|--------------|
| **SVM Optimizado** | **0.7407** | **2.54%** | **✅ SÍ** |
| Stacking Ensemble | 0.6784 | 16.15% | ❌ NO |
| Voting Ensemble | 0.4651 | 28.04% | ❌ NO |
| DistilBERT | 0.7027 | **24.41%** | ❌ NO |

---

## 🎯 ¿Por qué se seleccionó SVM y NO Ensemble ni DistilBERT?

### ❌ Ensembles NO fueron seleccionados porque:

1. **Voting Classifier**:
   - F1-Score: **0.4651** (MUY BAJO, peor que baseline)
   - Overfitting: **28.04%** (MUY ALTO)
   - **Resultado**: Empeora el rendimiento

2. **Stacking Classifier**:
   - F1-Score: **0.6784** (peor que SVM optimizado 0.7407)
   - Overfitting: **16.15%** (muy alto, objetivo < 5%)
   - **Resultado**: No mejora y tiene overfitting alto

### ❌ DistilBERT NO fue seleccionado porque:

1. **Overfitting MUY ALTO**: **24.41%** (objetivo < 6%)
2. **F1-Score similar pero peor**: 0.7027 vs 0.7407 del SVM
3. **Modelo pesado**: 255 MB vs 5 MB del SVM
4. **Dataset pequeño**: 1,000 ejemplos no suficientes para transformers
5. **Tiempo de inferencia**: Más lento que SVM

### ✅ SVM Optimizado fue seleccionado porque:

1. **Cumple objetivos**: Overfitting 2.54% < 5% ✅
2. **Mejor F1-Score**: 0.7407 (mejor que todos)
3. **Modelo ligero**: 5 MB, rápido para producción
4. **Balance perfecto**: Precision 0.6452, Recall 0.8696
5. **Umbral optimizado**: 0.466 reduce falsos positivos de 85 a 44

---

## 📝 Información Correcta para la Presentación

### Slide: "Modelo Final Seleccionado"

**Título**: SVM Optimizado - El Mejor Balance

**Métricas**:
- F1-Score: **0.7407** (supera objetivo de 0.55)
- Overfitting: **2.54%** (cumple objetivo < 5%)
- Accuracy: **0.64**
- Precision: **0.6452**
- Recall: **0.8696**

**Justificación**:
- ✅ Mejor F1-score que todos los modelos probados
- ✅ Único modelo que cumple overfitting < 5%
- ✅ Modelo ligero y rápido para producción
- ✅ Balance óptimo precision-recall

### Slide: "Por qué NO Ensemble ni DistilBERT"

**Ensembles**:
- ❌ Voting: F1=0.4651, Overfitting=28.04% (empeora)
- ❌ Stacking: F1=0.6784, Overfitting=16.15% (no mejora)

**DistilBERT**:
- ❌ Overfitting: 24.41% (muy alto, objetivo < 6%)
- ❌ F1-Score: 0.7027 (peor que SVM 0.7407)
- ❌ Modelo pesado: 255 MB vs 5 MB
- ❌ Dataset pequeño para transformers

---

## ✅ Resumen para Gamma

**NO usar estas métricas**:
- ❌ F1-score de 0.92 (no existe)
- ❌ Ensemble como modelo final (no fue seleccionado)
- ❌ DistilBERT con precisión 94% (no fue seleccionado)

**SÍ usar estas métricas**:
- ✅ **SVM Optimizado**: F1=0.7407, Overfitting=2.54%
- ✅ **Accuracy**: 0.64
- ✅ **Precision**: 0.6452
- ✅ **Recall**: 0.8696
- ✅ **Modelo seleccionado**: SVM Optimizado (NO ensemble, NO DistilBERT)

---

## 🎤 Notas para la Presentación

**Al explicar por qué SVM**:
> "Después de probar múltiples modelos (baseline, ensembles, transformers), el SVM optimizado fue el único que cumplió ambos objetivos: F1-score > 0.55 (obtuvo 0.7407) y overfitting < 5% (obtuvo 2.54%). Los ensembles empeoraron el rendimiento, y DistilBERT, aunque tiene buen F1-score, tiene un overfitting del 24.41%, muy por encima del objetivo. Por eso seleccionamos SVM optimizado como modelo de producción."

