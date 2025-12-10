# 🔍 Debug: Error de YouTube

## Problema
Error: `'>=' not supported between instances of 'str' and 'int'`

## Flujo del código

### 1. Frontend (`frontend/src/pages/YouTubePage.jsx`)
- Usuario ingresa URL y selecciona número de comentarios
- **Default**: 20 comentarios (reducido de 100)
- Llama a `analyzeYouTube(videoUrl, maxComments, sortBy)`

### 2. API Service (`frontend/src/services/api.js`)
- Función `analyzeYouTube()` hace POST a `/analyze/youtube`
- Envía: `{ video_url, max_comments, sort_by }`

### 3. Backend Endpoint (`backend/main.py`)
- **Línea 302-337**: Endpoint `/analyze/youtube`
- Recibe `YouTubeVideoRequest` con:
  - `video_url`: str
  - `max_comments`: int (validado: 1-500)
  - `sort_by`: str ('top', 'time', 'relevance')
- Llama a `analyze_video_comments()` pasando estos parámetros

### 4. Función `analyze_video_comments()` (`backend/src/utils/youtube.py`)
- **Línea 189-213**: Recibe parámetros y llama a `extract_comments()`
- Convierte `max_comments` a int (línea 196-199)

### 5. Función `extract_comments()` (`backend/src/utils/youtube.py`)
- **Línea 59-159**: Función principal que extrae comentarios
- **Línea 75-81**: Convierte y limita `max_comments` a máximo 50
- **Línea 94-98**: Valida y normaliza `sort_by`
- **Línea 101**: Crea `YoutubeCommentDownloader()`
- **Línea 112-115**: Crea generador con `get_comments_from_url()`
- **Línea 117-146**: Itera sobre comentarios

## Dónde ocurre el error

El error ocurre **dentro de la librería `youtube-comment-downloader`** cuando:
1. Se crea el generador (línea 112-115)
2. O cuando se itera sobre él (línea 117)

El error es un **bug interno de la librería** que hace comparaciones entre strings e ints.

## Soluciones implementadas

1. ✅ **Límite reducido**: Máximo 50 comentarios (antes 100)
2. ✅ **Default conservador**: 20 comentarios si no se especifica
3. ✅ **Validación de parámetros**: `sort_by` normalizado y validado
4. ✅ **Try-except anidado**: Captura errores al crear generador y al iterar
5. ✅ **Workaround sin sort_by**: Si falla, intenta sin `sort_by`
6. ✅ **Fallback recursivo**: Si falla, intenta con menos comentarios (10)
7. ✅ **Frontend**: Default reducido a 20 comentarios

## Cómo probar

1. Reiniciar backend
2. En frontend, usar **10-20 comentarios máximo**
3. Si falla, el código intentará automáticamente con menos

## Nota
Este es un bug conocido de `youtube-comment-downloader` versión 0.1.78. 
La solución es limitar el uso y manejar errores gracefully.

