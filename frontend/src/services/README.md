# 📡 Servicio API

Este módulo contiene todas las funciones para comunicarse con el backend.

## Funciones Disponibles

### `analyzeText(text)`
Analiza un texto individual.
- **Parámetro**: `text` (string) - Texto a analizar
- **Retorna**: Objeto con `is_toxic`, `toxicity_label`, `probability_toxic`, `confidence`, etc.

### `analyzeBatch(texts)`
Analiza múltiples textos en batch.
- **Parámetro**: `texts` (array de strings) - Textos a analizar
- **Retorna**: Array de objetos con resultados

### `analyzeYouTube(videoUrl, maxComments, sortBy)`
Analiza comentarios de un video de YouTube.
- **Parámetros**:
  - `videoUrl` (string) - URL del video
  - `maxComments` (number, opcional) - Máximo de comentarios (default: 100)
  - `sortBy` (string, opcional) - Orden: 'top', 'time', 'relevance' (default: 'top')
- **Retorna**: Objeto con estadísticas y lista de comentarios

### `getStats()`
Obtiene estadísticas de predicciones guardadas.
- **Retorna**: Objeto con `total_predictions`, `toxic_count`, `average_confidence`, etc.

### `getPredictions(filters)`
Obtiene predicciones guardadas con filtros opcionales.
- **Parámetro**: `filters` (objeto opcional) - `{limit, offset, is_toxic, source, video_id}`
- **Retorna**: Objeto con `predictions` y `count`

### `checkHealth()`
Verifica si la API está disponible.
- **Retorna**: Objeto con `status` y `model_loaded`

## Uso

```javascript
import { analyzeText, analyzeBatch, analyzeYouTube } from './services/api';

// Analizar un texto
const result = await analyzeText("This is a comment");
console.log(result.is_toxic); // true o false

// Analizar múltiples textos
const results = await analyzeBatch(["text1", "text2"]);

// Analizar video de YouTube
const videoAnalysis = await analyzeYouTube("https://youtube.com/watch?v=...");
```

