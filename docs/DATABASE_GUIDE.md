# 🗄️ Guía de Base de Datos

Esta guía explica cómo funciona la base de datos de predicciones y cómo consultarla.

## 📍 Ubicación

La base de datos SQLite se crea automáticamente en:
```
data/predictions.db
```

Se crea la primera vez que se inicializa `DatabaseManager`.

## 🏗️ Estructura de la Base de Datos

### Tabla: `predictions`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | Integer | ID único (clave primaria) |
| `text` | Text | Texto analizado |
| `is_toxic` | Boolean | True si es tóxico, False si no |
| `toxicity_label` | String | "Toxic" o "Not Toxic" |
| `probability_toxic` | Float | Probabilidad de ser tóxico (0-1) |
| `probability_not_toxic` | Float | Probabilidad de no ser tóxico (0-1) |
| `confidence` | Float | Confianza de la predicción (0-1) |
| `created_at` | DateTime | Fecha y hora de creación |
| `source` | String | Origen: 'api', 'batch', 'youtube' |
| `video_id` | String | ID del video (si viene de YouTube) |

## 🔍 Cómo Verificar que la BD Existe

### Opción 1: Usar el Notebook

1. Abre `notebooks/10_Database_Verification.ipynb`
2. Ejecuta todas las celdas
3. Verás estadísticas y predicciones almacenadas

### Opción 2: Verificar Archivo

```bash
# Desde la raíz del proyecto
ls -lh data/predictions.db
```

Si el archivo existe, la BD está creada.

### Opción 3: Usar la API

```bash
# Obtener estadísticas
curl http://localhost:8000/predictions/stats

# Obtener predicciones
curl http://localhost:8000/predictions?limit=10
```

## 📊 Consultar la Base de Datos

### Desde Python

```python
from pathlib import Path
import sys
sys.path.append(str(Path('src')))

from utils.database import get_db_manager

# Inicializar
db_manager = get_db_manager()

# Obtener estadísticas
stats = db_manager.get_statistics()
print(stats)

# Obtener predicciones
predictions = db_manager.get_predictions(limit=10)
for pred in predictions:
    print(pred)
```

### Desde la API

#### Obtener Estadísticas

```bash
GET /predictions/stats
```

Respuesta:
```json
{
  "total_predictions": 150,
  "toxic_count": 45,
  "not_toxic_count": 105,
  "toxic_percentage": 30.0,
  "not_toxic_percentage": 70.0,
  "average_confidence": 0.8234
}
```

#### Obtener Predicciones

```bash
GET /predictions?limit=10&offset=0&is_toxic=true&source=api
```

Parámetros:
- `limit`: Número máximo de resultados (default: 100)
- `offset`: Offset para paginación (default: 0)
- `is_toxic`: Filtrar por toxicidad (true/false)
- `source`: Filtrar por origen ('api', 'batch', 'youtube')
- `video_id`: Filtrar por ID de video

## 💾 Cuándo se Guardan Predicciones

Las predicciones se guardan automáticamente cuando:

1. **API - Predicción Individual** (`POST /predict`):
   - Cada vez que se hace una predicción
   - `source = 'api'`

2. **API - Predicción en Batch** (`POST /predict/batch`):
   - Todas las predicciones del batch
   - `source = 'batch'`

3. **API - Análisis de YouTube** (`POST /analyze/youtube`):
   - Todos los comentarios analizados
   - `source = 'youtube'`
   - `video_id` = ID del video

## 🔧 Consultas Útiles

### Ver todas las predicciones tóxicas

```python
toxic = db_manager.get_predictions(limit=100, is_toxic=True)
```

### Ver predicciones de un video específico

```python
video_preds = db_manager.get_predictions(video_id='dQw4w9WgXcQ')
```

### Ver predicciones por origen

```python
api_preds = db_manager.get_predictions(source='api')
youtube_preds = db_manager.get_predictions(source='youtube')
```

### Exportar a CSV

```python
import pandas as pd

predictions = db_manager.get_predictions(limit=1000)
df = pd.DataFrame(predictions)
df.to_csv('predictions_export.csv', index=False)
```

## 🛠️ Usar SQLite Directamente

Si prefieres usar SQLite directamente:

```bash
# Abrir base de datos
sqlite3 data/predictions.db

# Ver tablas
.tables

# Ver estructura
.schema predictions

# Consultar
SELECT * FROM predictions LIMIT 10;

# Estadísticas
SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN is_toxic = 1 THEN 1 ELSE 0 END) as toxic,
    AVG(confidence) as avg_confidence
FROM predictions;
```

## ⚠️ Troubleshooting

### La BD no se crea

- Verifica que el directorio `data/` existe
- Verifica permisos de escritura
- Revisa los logs de la API para errores

### No hay predicciones

- Asegúrate de que la API esté ejecutándose
- Haz algunas predicciones a través de la API
- Verifica que `db_manager` esté inicializado en `api/main.py`

### Error de conexión

- SQLite es local, no requiere servidor
- Verifica que el archivo `predictions.db` no esté bloqueado
- Si la API está corriendo, puede estar usando la BD

## 📚 Recursos

- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

