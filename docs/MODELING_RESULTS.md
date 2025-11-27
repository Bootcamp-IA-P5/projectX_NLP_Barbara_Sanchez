# Resultados del Modelado
## Dataset: YouToxic English 1000 - Modelos Baseline

Este documento resume los resultados y conclusiones del entrenamiento de modelos baseline de Machine Learning para la clasificación de comentarios tóxicos.

---

### 1. Objetivo del Modelado

El objetivo principal fue entrenar y evaluar múltiples modelos de clasificación para detectar comentarios tóxicos, comparar su rendimiento, y seleccionar el mejor modelo baseline considerando tanto el F1-score como el control de overfitting.

### 2. Modelos Entrenados

Se entrenaron **8 combinaciones de modelos y vectorizadores**:

1. **Naive Bayes + TF-IDF**
2. **Naive Bayes + Count Vectorizer**
3. **Logistic Regression + TF-IDF**
4. **Logistic Regression + Count Vectorizer**
5. **SVM + TF-IDF**
6. **SVM + Count Vectorizer**
7. **Random Forest + TF-IDF**
8. **Random Forest + Count Vectorizer**

### 3. Resultados por Modelo

| Modelo | Vectorizador | Accuracy Train | Accuracy Test | F1 Train | F1 Test | Diff Accuracy (%) | Diff F1 (%) | Precision Test | Recall Test |
| :----- | :----------- | :------------- | :------------- | :------- | :------ | :---------------- | :---------- | :------------- | :---------- |
| Naive Bayes | TF-IDF | 0.9313 | 0.6900 | 0.9241 | 0.6265 | 24.13 | 29.76 | 0.7027 | 0.5652 |
| Naive Bayes | Count Vectorizer | 0.8888 | 0.6500 | 0.8843 | 0.6237 | 23.88 | 26.06 | 0.6170 | 0.6304 |
| Logistic Regression | TF-IDF | 0.9225 | 0.7100 | 0.9122 | 0.6375 | 21.25 | 27.47 | 0.7500 | 0.5543 |
| Logistic Regression | Count Vectorizer | 0.9712 | 0.7200 | 0.9682 | 0.6456 | 25.12 | 32.26 | 0.7727 | 0.5543 |
| SVM | TF-IDF | 0.9537 | 0.7300 | 0.9495 | **0.6897** | 22.38 | 25.99 | 0.7317 | 0.6522 |
| SVM | Count Vectorizer | 0.9888 | 0.7000 | 0.9878 | 0.6429 | 28.88 | 34.49 | 0.7105 | 0.5870 |
| Random Forest | TF-IDF | 0.9962 | 0.7300 | 0.9959 | 0.6707 | 26.62 | 32.52 | 0.7639 | 0.5978 |
| Random Forest | Count Vectorizer | 0.9962 | 0.7200 | 0.9959 | 0.6543 | 27.62 | 34.16 | 0.7571 | 0.5761 |

### 4. Mejor Modelo Seleccionado

**Modelo: SVM + TF-IDF**

#### Métricas del Mejor Modelo:

- **F1-score (test)**: 0.6897
- **Accuracy (test)**: 0.7300
- **Precision (test)**: 0.7317
- **Recall (test)**: 0.6522
- **Diferencia F1 (train-test)**: 25.99%

#### Matriz de Confusión:

| | Predicción: No Tóxico | Predicción: Tóxico |
| :--- | :--- | :--- |
| **Real: No Tóxico** | 86 (TN) | 22 (FP) |
| **Real: Tóxico** | 32 (FN) | 60 (TP) |

- **Verdaderos Negativos (TN)**: 86
- **Falsos Positivos (FP)**: 22
- **Falsos Negativos (FN)**: 32
- **Verdaderos Positivos (TP)**: 60

#### Reporte de Clasificación Detallado:

| Clase | Precision | Recall | F1-score | Support |
| :---- | :-------- | :----- | :------- | :------ |
| No Tóxico | 0.73 | 0.80 | 0.76 | 108 |
| Tóxico | 0.73 | 0.65 | 0.69 | 92 |
| **Accuracy** | | | **0.73** | 200 |
| **Macro Avg** | 0.73 | 0.72 | 0.73 | 200 |

### 5. Control de Overfitting

**⚠️ Advertencia**: Todos los modelos entrenados presentan overfitting (diferencia entre F1-score de entrenamiento y prueba >= 5%).

| Modelo | Diferencia F1 (%) |
| :----- | :---------------- |
| Naive Bayes + TF-IDF | 29.76% |
| Naive Bayes + Count Vectorizer | 26.06% |
| Logistic Regression + TF-IDF | 27.47% |
| Logistic Regression + Count Vectorizer | 32.26% |
| **SVM + TF-IDF** | **25.99%** |
| SVM + Count Vectorizer | 34.49% |
| Random Forest + TF-IDF | 32.52% |
| Random Forest + Count Vectorizer | 34.16% |

**Observaciones**:
- El modelo seleccionado (SVM + TF-IDF) tiene la menor diferencia entre train y test (25.99%), aunque aún está por encima del umbral recomendado de 5%.
- Los modelos más complejos (Random Forest) muestran el mayor overfitting, con diferencias superiores al 32%.
- El overfitting es un problema común en modelos baseline sin optimización de hiperparámetros.

### 6. Comparación TF-IDF vs Count Vectorizer

Para cada tipo de modelo, se comparó el rendimiento con ambos vectorizadores:

| Modelo | Mejor Vectorizador | F1-score |
| :----- | :----------------- | :------- |
| Naive Bayes | TF-IDF | 0.6265 vs 0.6237 |
| Logistic Regression | Count Vectorizer | 0.6456 vs 0.6375 |
| **SVM** | **TF-IDF** | **0.6897 vs 0.6429** |
| Random Forest | TF-IDF | 0.6707 vs 0.6543 |

**Conclusión**: TF-IDF funciona mejor en 3 de los 4 modelos, especialmente con SVM, donde la diferencia es más significativa (0.6897 vs 0.6429).

### 7. Análisis de Resultados

#### Fortalezas del Modelo Seleccionado:

1. **Mejor F1-score**: El modelo SVM + TF-IDF alcanza el mejor F1-score (0.6897) entre todos los modelos evaluados.
2. **Menor overfitting**: Aunque todos los modelos tienen overfitting, SVM + TF-IDF tiene la menor diferencia entre train y test.
3. **Balance Precision-Recall**: El modelo muestra un buen balance entre precision (0.73) y recall (0.65), aunque el recall podría mejorarse.
4. **TF-IDF efectivo**: La vectorización TF-IDF demuestra ser más efectiva que Count Vectorizer para este problema.

#### Áreas de Mejora:

1. **Overfitting**: Todos los modelos presentan overfitting significativo. Se requiere optimización de hiperparámetros para reducir esta diferencia.
2. **Recall de clase tóxica**: El recall de 0.65 para la clase tóxica indica que el modelo no detecta todos los comentarios tóxicos. Esto es crítico en un sistema de moderación.
3. **Falsos Negativos**: 32 falsos negativos (comentarios tóxicos clasificados como no tóxicos) es un número considerable que debe reducirse.

### 8. Archivos Generados

Se guardaron los siguientes archivos para uso posterior:

- **Modelo entrenado**: `../models/best_model_svm_tf-idf.pkl`
- **Información del modelo**: `../models/best_model_info.pkl`
- **Datos vectorizados**: Ya disponibles desde la fase de Feature Engineering

### 9. Conclusiones Principales

1. **Modelo Baseline Funcional**: El modelo SVM + TF-IDF alcanza un accuracy del 73% y un F1-score de 0.69, lo cual es un buen punto de partida para un modelo baseline.

2. **Overfitting Generalizado**: Todos los modelos presentan overfitting, lo que indica la necesidad de:
   - Optimización de hiperparámetros
   - Técnicas de regularización
   - Posible aumento del dataset o técnicas de data augmentation

3. **TF-IDF Superior**: La vectorización TF-IDF demuestra ser más efectiva que Count Vectorizer para la mayoría de los modelos, especialmente con SVM.

4. **SVM como Base Prometedora**: SVM con TF-IDF muestra el mejor rendimiento y el menor overfitting, convirtiéndolo en el mejor candidato para optimización.

5. **Necesidad de Mejora en Recall**: El recall de 0.65 para comentarios tóxicos es insuficiente para un sistema de producción. Se requiere mejorar la detección de comentarios tóxicos.



**Resumen Ejecutivo:**

Se entrenaron 8 modelos baseline de Machine Learning para la detección de comentarios tóxicos. El modelo **SVM + TF-IDF** fue seleccionado como el mejor, alcanzando un F1-score de 0.6897 y un accuracy del 73%. Aunque todos los modelos presentan overfitting, el modelo seleccionado muestra el mejor balance entre rendimiento y generalización. Se requiere optimización de hiperparámetros y técnicas de regularización para mejorar el modelo antes de su implementación en producción.

