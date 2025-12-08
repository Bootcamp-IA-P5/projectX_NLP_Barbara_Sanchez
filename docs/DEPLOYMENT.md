# 🚀 Despliegue en Render

Esta guía explica cómo desplegar la API de detección de hate speech en Render.

## 📋 Requisitos Previos

1. Cuenta en [Render](https://render.com)
2. Repositorio en GitHub con la rama `develop` actualizada
3. Modelos entrenados en el repositorio (en `models/`)

## 🔧 Configuración en Render

### Opción 1: Usando render.yaml (Recomendado)

1. **Conectar repositorio en Render:**
   - Ve a [Render Dashboard](https://dashboard.render.com)
   - Click en "New +" > "Web Service"
   - Conecta tu repositorio de GitHub
   - Selecciona la rama `develop`

2. **Render detectará automáticamente el `render.yaml`** y configurará el servicio.

3. **Verificar configuración:**
   - Tipo: Web Service
   - Environment: Docker
   - Dockerfile Path: `./Dockerfile`
   - Health Check Path: `/health`

### Opción 2: Configuración Manual

Si prefieres configurar manualmente:

1. **Crear nuevo Web Service:**
   - Name: `hate-speech-api`
   - Environment: `Docker`
   - Region: `Oregon` (o el más cercano)
   - Branch: `develop`

2. **Build & Deploy:**
   - Build Command: (dejar vacío, Render usa Dockerfile)
   - Start Command: (dejar vacío, está en Dockerfile)

3. **Environment Variables:**
   - `PYTHONUNBUFFERED=1`

4. **Health Check:**
   - Path: `/health`

## ⚠️ Consideraciones Importantes

### Modelos en el Repositorio

Los modelos deben estar en el repositorio para que Render pueda acceder a ellos:
- `models/optimized/best_optimized_model.pkl`
- `models/tfidf_vectorizer.pkl`

Si los modelos son muy grandes (>100MB), considera:
- Usar Git LFS
- O subirlos a un servicio de almacenamiento (S3, etc.) y descargarlos en el build

### Límites del Plan Free

- **Build time**: ~20 minutos máximo
- **Sleep después de inactividad**: 15 minutos
- **Memoria**: 512 MB

Si necesitas más recursos, considera el plan Starter ($7/mes).

## 🔍 Verificar Despliegue

Una vez desplegado:

```bash
# Health check
curl https://tu-app.onrender.com/health

# Documentación de la API
# Abre en navegador: https://tu-app.onrender.com/docs
```

## 🐛 Troubleshooting

### El build falla por tiempo

- Reduce dependencias innecesarias en `requirements.txt`
- Usa un plan con más tiempo de build

### El servicio se duerme

- El plan free duerme después de 15 min de inactividad
- La primera petición después de dormir puede tardar ~30 segundos
- Considera usar un servicio de "ping" para mantenerlo activo

### Error al cargar modelos

- Verifica que los archivos `.pkl` estén en el repositorio
- Revisa los logs en Render Dashboard
- Asegúrate de que las rutas en el código sean relativas

## 📝 URLs Importantes

Una vez desplegado, tendrás:
- **API**: `https://tu-app.onrender.com`
- **Health Check**: `https://tu-app.onrender.com/health`
- **Documentación**: `https://tu-app.onrender.com/docs`
- **OpenAPI Schema**: `https://tu-app.onrender.com/openapi.json`

