# 🔧 Troubleshooting - Análisis de YouTube

## Error: "'>=' not supported between instances of 'str' and 'int'"

Este error puede ocurrir por varias razones:

### Solución 1: Reiniciar el Backend

**IMPORTANTE**: Después de cualquier cambio en el código, debes reiniciar el servidor:

```bash
# Detener el servidor (Ctrl+C)
# Luego reiniciar:
cd backend
python3 run_api.py
```

### Solución 2: Verificar la URL

Asegúrate de usar una URL válida de YouTube:

✅ **URLs válidas:**
- `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- `https://youtu.be/dQw4w9WgXcQ`
- `https://youtube.com/watch?v=dQw4w9WgXcQ`

❌ **URLs inválidas:**
- Solo el ID sin URL completa
- URLs de listas de reproducción
- URLs de canales

### Solución 3: Reducir el número de comentarios

Intenta con menos comentarios:

- En el frontend, cambia "Máximo de Comentarios" a 10 o 20
- Algunos videos pueden tener problemas con muchos comentarios

### Solución 4: Verificar la librería

Asegúrate de que `youtube-comment-downloader` esté instalada:

```bash
cd backend
pip install youtube-comment-downloader
```

### Solución 5: Probar con un video diferente

Algunos videos pueden tener restricciones o problemas. Prueba con:
- Videos públicos
- Videos con comentarios habilitados
- Videos recientes

## Ejemplo de URL para probar

```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

Este es un video de prueba común que suele funcionar.

## Si el error persiste

1. Verifica los logs del backend en la terminal
2. Asegúrate de que el backend esté corriendo en el puerto 8000
3. Verifica que `youtube-comment-downloader` esté instalada
4. Intenta con un video diferente

