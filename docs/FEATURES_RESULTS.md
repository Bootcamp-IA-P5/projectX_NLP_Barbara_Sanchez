# Resultados del Feature Engineering / Vectorización
## Dataset: YouToxic English 1000 - Preprocesado

Este documento resume los resultados y configuraciones del proceso de vectorización aplicado al texto preprocesado para preparar los datos para el modelado de Machine Learning.

---

## 1. Objetivo

Convertir el texto preprocesado en representaciones numéricas (vectores) que los modelos de Machine Learning puedan procesar. Se comparan dos métodos de vectorización: **TF-IDF** y **Count Vectorizer (Bag of Words)**.

---

## 2. División de Datos

### Estrategia
- **Método**: `train_test_split` con estratificación
- **Proporción**: 80% entrenamiento / 20% prueba
- **Random State**: 42 (para reproducibilidad)
- **Stratify**: Sí (mantiene la proporción de clases)

### Resultados Esperados
- **Conjunto de entrenamiento**: ~800 comentarios (80%)
- **Conjunto de prueba**: ~200 comentarios (20%)
- **Balance de clases**: Mantiene la proporción original (~46% tóxicos, ~54% no tóxicos)

### Importancia
- La estratificación asegura que ambos conjuntos tengan la misma distribución de clases
- Esto es crucial para evaluar correctamente el rendimiento del modelo

---

## 3. Vectorización con TF-IDF

### ¿Qué es TF-IDF?
**Term Frequency-Inverse Document Frequency** mide la importancia de cada palabra en cada documento:
- **TF (Term Frequency)**: Frecuencia de la palabra en el documento
- **IDF (Inverse Document Frequency)**: Penaliza palabras muy comunes en todo el corpus
- **Resultado**: Palabras únicas e importantes tienen mayor peso

### Configuración Aplicada

| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| `max_features` | 5000 | Top 5000 palabras más importantes |
| `ngram_range` | (1, 2) | Unigramas y bigramas (palabras individuales y pares) |
| `min_df` | 2 | Palabra debe aparecer en al menos 2 documentos |
| `max_df` | 0.95 | Ignora palabras en más del 95% de documentos |
| `stop_words` | 'english' | Elimina stopwords (aunque ya fueron eliminadas en preprocesamiento) |

### Características
- **Tipo de matriz**: Sparse matrix (matriz dispersa)
- **Forma**: (n_comentarios, 5000 características)
- **Ventaja**: Da más peso a palabras únicas y relevantes
- **Uso**: Ideal cuando queremos destacar palabras distintivas

### Ejemplo de Características
Las características incluyen:
- **Unigramas**: Palabras individuales (ej: "toxic", "hate", "comment")
- **Bigramas**: Pares de palabras (ej: "toxic comment", "hate speech")

---

## 4. Vectorización con Count Vectorizer

### ¿Qué es Count Vectorizer?
**Bag of Words** cuenta simplemente cuántas veces aparece cada palabra en cada documento:
- No penaliza palabras comunes
- Todas las palabras tienen el mismo peso inicial
- Más simple que TF-IDF

### Configuración Aplicada

| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| `max_features` | 5000 | Top 5000 palabras más frecuentes |
| `ngram_range` | (1, 2) | Unigramas y bigramas |
| `min_df` | 2 | Palabra debe aparecer en al menos 2 documentos |
| `max_df` | 0.95 | Ignora palabras en más del 95% de documentos |
| `stop_words` | 'english' | Elimina stopwords |

### Características
- **Tipo de matriz**: Sparse matrix (matriz dispersa)
- **Forma**: (n_comentarios, 5000 características)
- **Ventaja**: Más simple, captura frecuencia directa
- **Uso**: Útil cuando la frecuencia simple es importante

---

## 5. Comparación: TF-IDF vs Count Vectorizer

### Diferencias Principales

| Aspecto | TF-IDF | Count Vectorizer |
|---------|--------|------------------|
| **Peso de palabras** | Penaliza palabras comunes | Todas tienen peso igual |
| **Valores** | Normalizados (0-1) | Frecuencias enteras |
| **Complejidad** | Mayor | Menor |
| **Mejor para** | Palabras distintivas | Frecuencia directa |

### Densidad de Matrices
Ambas matrices son **dispersas** (sparse):
- Contienen muchos ceros (palabras que no aparecen en cada documento)
- Eficientes en memoria
- Scikit-learn las maneja automáticamente

### Distribución de Valores

**TF-IDF:**
- Valores normalizados entre 0 y 1
- Distribución más uniforme
- Valores más pequeños en promedio

**Count Vectorizer:**
- Valores enteros (frecuencias)
- Puede tener valores más altos
- Distribución más sesgada hacia valores bajos

---

## 6. Archivos Generados

### Matrices Vectorizadas
- `X_train_tfidf.pkl` - Matriz TF-IDF de entrenamiento
- `X_test_tfidf.pkl` - Matriz TF-IDF de prueba
- `X_train_count.pkl` - Matriz Count Vectorizer de entrenamiento
- `X_test_count.pkl` - Matriz Count Vectorizer de prueba

### Vectorizadores Entrenados
- `tfidf_vectorizer.pkl` - Vectorizador TF-IDF entrenado (para usar en producción)
- `count_vectorizer.pkl` - Vectorizador Count Vectorizer entrenado

### Variables Objetivo
- `y_train.pkl` - Etiquetas de entrenamiento (IsToxic: 0 o 1)
- `y_test.pkl` - Etiquetas de prueba (IsToxic: 0 o 1)

### Ubicación
- **Matrices y variables objetivo**: `data/processed/`
- **Vectorizadores**: `models/`

---

## 7. Decisiones de Diseño

### ¿Por qué 5000 características?
- Balance entre información y eficiencia computacional
- Captura las palabras más importantes sin sobrecargar el modelo
- Puede ajustarse según resultados del modelado

### ¿Por qué unigramas y bigramas?
- **Unigramas**: Capturan palabras individuales importantes
- **Bigramas**: Capturan frases y contextos (ej: "hate speech", "toxic comment")
- Combinación mejora la capacidad de capturar significado

### ¿Por qué min_df=2 y max_df=0.95?
- **min_df=2**: Elimina palabras muy raras (posibles errores de tipeo)
- **max_df=0.95**: Elimina palabras demasiado comunes (no informativas)
- Ayuda a reducir ruido y mejorar la calidad de las características

---

## 8. Próximos Pasos

### Modelado
1. **Probar ambos métodos** con diferentes modelos de ML:
   - Naive Bayes
   - Logistic Regression
   - SVM (Support Vector Machine)
   - Random Forest

2. **Comparar rendimiento**:
   - ¿TF-IDF o Count Vectorizer funciona mejor?
   - ¿Qué modelo se adapta mejor a cada método?

3. **Seleccionar el mejor**:
   - Combinación de método de vectorización + modelo
   - Basado en métricas: Accuracy, Precision, Recall, F1-score

### Optimización
- Ajustar hiperparámetros del mejor modelo
- Probar diferentes configuraciones de vectorización si es necesario
- Validar que no hay overfitting (diferencia < 5% entre train y test)

---

## 9. Consideraciones Importantes

### ✅ Ventajas de la Estrategia
1. **Dos métodos comparables**: Misma configuración permite comparación justa
2. **Matrices guardadas**: No necesitamos re-vectorizar en cada experimento
3. **Vectorizadores guardados**: Listos para usar en producción
4. **División estratificada**: Mantiene balance de clases

### ⚠️ Limitaciones
1. **Bag of Words**: No captura orden de palabras ni contexto largo
2. **5000 características**: Puede no capturar todas las palabras importantes
3. **Unigramas y bigramas**: No captura relaciones más complejas

### 💡 Mejoras Futuras (Nivel Avanzado)
- **Word Embeddings**: Word2Vec, GloVe, FastText
- **Transformers**: BERT, DistilBERT (requiere más recursos)
- **N-gramas más largos**: Trigramas, etc.

---

## 10. Resumen Ejecutivo

### Lo que hemos logrado:
✅ Texto preprocesado convertido en representaciones numéricas  
✅ Dos métodos de vectorización implementados y comparados  
✅ Datos divididos en train/test de forma estratificada  
✅ Matrices y vectorizadores guardados para reutilización  
✅ 5000 características por comentario (unigramas + bigramas)  

### Estado actual:
- **Listo para modelado**: Las matrices están preparadas
- **Comparación pendiente**: Necesitamos probar con modelos para ver cuál funciona mejor
- **Siguiente paso**: Entrenar modelos con ambas representaciones

---


