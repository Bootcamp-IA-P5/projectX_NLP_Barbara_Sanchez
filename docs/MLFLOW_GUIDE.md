# 📊 Guía de Uso de MLFlow

Esta guía explica cómo usar MLFlow para trackear experimentos de machine learning en este proyecto.

## 🎯 ¿Qué es MLFlow?

MLFlow es una plataforma open-source para gestionar el ciclo de vida de machine learning, incluyendo:
- **Tracking**: Registrar métricas, parámetros y modelos
- **Projects**: Empaquetar código reutilizable
- **Models**: Gestionar y desplegar modelos
- **Model Registry**: Centralizar el almacenamiento de modelos

## 📍 Ubicación de los Datos

Por defecto, MLFlow guarda todos los datos en:
```
project_root/mlruns/
```

Este directorio contiene:
- Experimentos organizados por ID
- Métricas y parámetros de cada run
- Modelos guardados
- Artefactos adicionales

## 🚀 Cómo Usar MLFlow

### Paso 1: Ejecutar el Notebook de Tracking

1. Abre el notebook `notebooks/09_MLFlow_Tracking.ipynb`
2. **IMPORTANTE**: Reinicia el kernel antes de ejecutar (Kernel → Restart Kernel)
3. Ejecuta todas las celdas desde el principio
4. Esto entrenará modelos y los registrará en MLFlow

### Paso 2: Iniciar el Servidor UI de MLFlow

Una vez que hayas ejecutado el notebook y tengas datos en `mlruns/`, inicia el servidor UI:

```bash
# Desde la raíz del proyecto
mlflow ui
```

O si quieres especificar el puerto:

```bash
mlflow ui --port 5000
```

### Paso 3: Abrir la Interfaz Web

1. Abre tu navegador
2. Ve a: `http://localhost:5000`
3. Verás la interfaz de MLFlow con:
   - Lista de experimentos
   - Runs (ejecuciones) de cada experimento
   - Métricas y parámetros
   - Modelos guardados

## 📊 Qué Verás en MLFlow UI

### Vista de Experimentos
- Lista de todos los experimentos
- Nombre: `hate_speech_detection` (por defecto)
- Número de runs

### Vista de Runs
Para cada run verás:

**Métricas:**
- `train_accuracy`: Precisión en entrenamiento
- `test_accuracy`: Precisión en test
- `train_f1`: F1-score en entrenamiento
- `test_f1`: F1-score en test
- `train_precision`: Precisión en entrenamiento
- `test_precision`: Precisión en test
- `train_recall`: Recall en entrenamiento
- `test_recall`: Recall en test
- `overfitting`: Diferencia entre train y test

**Parámetros:**
- `model_type`: Tipo de modelo (svm, logistic, etc.)
- `vectorizer_type`: Tipo de vectorizador (tfidf, count)
- Parámetros específicos del modelo (C, kernel, etc.)

**Modelos:**
- Modelos guardados que puedes descargar
- Versiones de los modelos

**Artefactos:**
- Archivos adicionales guardados con el run

## 🔍 Ejemplo de Uso Completo

### 1. Ejecutar Tracking

```python
# En el notebook 09_MLFlow_Tracking.ipynb
from utils.mlflow_tracking import get_tracker

tracker = get_tracker(experiment_name="hate_speech_detection")

# Entrenar y registrar modelo
tracker.log_model_training(
    model=model,
    model_name="svm",
    metrics={
        'train_f1': 0.75,
        'test_f1': 0.68,
        'overfitting': 2.54
    },
    params={'C': 0.056, 'kernel': 'linear'},
    vectorizer_type='tfidf'
)
```

### 2. Iniciar UI

```bash
mlflow ui
```

### 3. Comparar Modelos

En la UI puedes:
- Comparar múltiples runs lado a lado
- Filtrar por métricas
- Ordenar por F1-score, overfitting, etc.
- Ver qué parámetros funcionan mejor

## 📝 Logging desde la API

La API también registra predicciones en MLFlow automáticamente cuando:
- Se hacen predicciones en batch (`POST /predict/batch`)
- Se analiza un video de YouTube (`POST /analyze/youtube`)

Esto se hace a través de `log_prediction_batch()` que registra:
- Número de predicciones
- Cantidad de tóxicas
- Confianza promedio

## 🛠️ Comandos Útiles

### Ver experimentos desde terminal

```bash
mlflow experiments list
```

### Ver runs de un experimento

```bash
mlflow runs list --experiment-id 0
```

### Descargar un modelo

Desde la UI, ve a un run específico y descarga el modelo desde la sección "Artifacts".

## ⚠️ Troubleshooting

### No veo nada en MLFlow UI

1. **Verifica que hayas ejecutado el notebook**: Debe haber datos en `mlruns/`
2. **Verifica la ruta**: MLFlow UI debe apuntar a `mlruns/` (por defecto lo hace)
3. **Reinicia el servidor**: Detén `mlflow ui` (Ctrl+C) y vuelve a iniciarlo

### Error: "No module named 'mlflow'"

```bash
pip install mlflow
```

### El notebook no registra nada

- Asegúrate de haber reiniciado el kernel después de modificar `mlflow_tracking.py`
- Verifica que no haya errores en la ejecución del notebook
- Revisa que `mlruns/` se esté creando en la raíz del proyecto

## 📚 Recursos Adicionales

- [Documentación oficial de MLFlow](https://mlflow.org/docs/latest/index.html)
- [MLFlow Tracking Guide](https://mlflow.org/docs/latest/tracking.html)
- [MLFlow UI Guide](https://mlflow.org/docs/latest/tracking.html#tracking-ui)

