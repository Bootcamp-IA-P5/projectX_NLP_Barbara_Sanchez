# Resultados del Análisis Exploratorio de Datos (EDA)
## Dataset: YouToxic English 1000

Este documento resume los hallazgos principales del análisis exploratorio realizado sobre el dataset de comentarios tóxicos de YouTube.

---

## 1. Información General del Dataset

### Dimensiones
- **Total de comentarios**: 1,000
- **Total de videos**: 13
- **Total de columnas**: 15 (originales) + 4 (calculadas durante el EDA)

### Calidad de Datos
- ✅ **Sin valores nulos**: El dataset está completo, no hay valores faltantes
- ✅ **Sin duplicados**: No hay filas duplicadas en el dataset

### Estructura
- **Columnas de identificación**: `CommentId`, `VideoId`
- **Columna de texto**: `Text`
- **Etiquetas de toxicidad**: 12 columnas booleanas (IsToxic, IsAbusive, IsThreat, etc.)

---

## 2. Distribución de Toxicidad

### Distribución General
- **Comentarios tóxicos**: 462 (46.20%)
- **Comentarios no tóxicos**: 538 (53.80%)

### Análisis
- El dataset está **relativamente balanceado**, con una ligera mayoría de comentarios no tóxicos
- La diferencia es de aproximadamente 7.6 puntos porcentuales
- **No hay desbalance extremo**, lo cual es favorable para el entrenamiento de modelos

---

## 3. Tipos de Toxicidad Más Comunes

| Tipo de Toxicidad | Cantidad | Porcentaje |
|-------------------|----------|------------|
| **IsAbusive** | 353 | 35.30% |
| **IsProvocative** | 161 | 16.10% |
| **IsHatespeech** | 138 | 13.80% |
| **IsRacist** | 125 | 12.50% |
| **IsObscene** | 100 | 10.00% |
| **IsThreat** | 18 | 1.80% |
| **IsNationalist** | 15 | 1.50% |
| **IsSexist** | 12 | 1.20% |
| **IsHomophobic** | 10 | 1.00% |
| **IsReligiousHate** | 6 | 0.60% |
| **IsRadicalism** | 4 | 0.40% |

### Observaciones
- **IsAbusive** es el tipo más común, presente en más de un tercio de los comentarios tóxicos
- Los tipos de odio específicos (racista, sexista, homofóbico) son menos frecuentes pero igualmente importantes
- Muchos comentarios tienen **múltiples etiquetas** simultáneamente

---

## 4. Análisis de Multi-Etiquetado

### Estadísticas
- **Comentarios con múltiples etiquetas**: 462
- **Promedio de etiquetas por comentario tóxico**: 2.99 etiquetas

### Implicaciones
- Los comentarios tóxicos suelen tener **múltiples características** de toxicidad simultáneamente
- Esto sugiere que las diferentes formas de toxicidad están correlacionadas
- El modelo deberá ser capaz de manejar **clasificación multi-etiqueta**

---

## 5. Características del Texto

### Estadísticas Generales
- **Longitud promedio**: 185.6 caracteres
- **Palabras promedio**: 33.8 palabras
- **Oraciones promedio**: ~2.4 oraciones

### Comparación: Tóxicos vs No Tóxicos

| Característica | Tóxicos | No Tóxicos | Diferencia |
|----------------|---------|------------|------------|
| **Longitud promedio** | 189.4 caracteres | 182.3 caracteres | +7.1 caracteres |
| **Palabras promedio** | 34.6 palabras | 33.1 palabras | +1.5 palabras |
| **Oraciones promedio** | 2.5 oraciones | 2.4 oraciones | +0.1 oraciones |

### Observaciones
- **Diferencias mínimas** en longitud entre comentarios tóxicos y no tóxicos
- La longitud del texto **no es un indicador fuerte** de toxicidad
- Se necesitará analizar el **contenido semántico** más que características superficiales

---

## 6. Análisis por Video

### Distribución de Comentarios
- **Promedio de comentarios por video**: ~77 comentarios
- **Videos con más comentarios**: 
  - Video `9pr1oE34bIM`: 274 comentarios
  - Video `04kJtp6pVXI`: 172 comentarios
  - Video `cT14IbTDW2c`: 146 comentarios

### Tasa de Toxicidad por Video

| VideoId | Total Comentarios | Comentarios Tóxicos | Tasa de Toxicidad |
|---------|-------------------|---------------------|-------------------|
| `cT14IbTDW2c` | 146 | 108 | **74.0%** |
| `04kJtp6pVXI` | 172 | 111 | **64.5%** |
| `8HB18hZrhXc` | 38 | 23 | **60.5%** |

### Observaciones
- Hay **variación significativa** en la tasa de toxicidad entre videos
- Algunos videos tienen tasas de toxicidad superiores al 70%
- Esto sugiere que el **contexto del video** puede influir en la toxicidad de los comentarios

---

## 7. Correlaciones entre Etiquetas

### Hallazgos Principales
- Las etiquetas de toxicidad están **correlacionadas** entre sí
- Comentarios con una etiqueta de toxicidad suelen tener otras etiquetas también
- **IsAbusive** tiene alta correlación con otras formas de toxicidad
- Las etiquetas de odio específico (racista, sexista, homofóbico) también están correlacionadas

### Implicaciones para el Modelado
- Considerar **clasificación multi-etiqueta** en lugar de binaria simple
- Las etiquetas no son independientes, lo cual puede aprovecharse en el modelo

---

## 8. Conclusiones Principales

### ✅ Puntos Positivos
1. **Dataset balanceado**: 46% tóxicos vs 54% no tóxicos
2. **Sin valores faltantes**: Datos completos y limpios
3. **Diversidad de tipos**: Múltiples categorías de toxicidad para análisis detallado

### ⚠️ Desafíos Identificados
1. **Multi-etiquetado**: Los comentarios tóxicos suelen tener múltiples etiquetas
2. **Variabilidad entre videos**: Diferentes videos tienen diferentes tasas de toxicidad
3. **Características superficiales similares**: La longitud del texto no diferencia bien entre tóxicos y no tóxicos

### 🎯 Recomendaciones para el Modelado
1. **Preprocesamiento robusto**: Limpieza y normalización del texto será crucial
2. **Feature engineering**: Necesitaremos características semánticas, no solo superficiales
3. **Modelo multi-etiqueta**: Considerar modelos que puedan predecir múltiples etiquetas simultáneamente
4. **Validación estratificada**: Considerar estratificar por VideoId para evitar data leakage
5. **Métricas apropiadas**: Usar métricas que consideren el desbalance (F1-score, precision, recall)

---

## 9. Próximos Pasos

1. ✅ **EDA completado**
2. ⏳ **Preprocesamiento de texto** (en progreso)
3. ⏳ **Feature Engineering** (vectorización TF-IDF, Count Vectorizer)
4. ⏳ **Modelado** (Naive Bayes, Logistic Regression, SVM, Random Forest)
5. ⏳ **Optimización de hiperparámetros**
6. ⏳ **Evaluación y selección del mejor modelo**
7. ⏳ **Productivización** (interfaz Streamlit)

---



