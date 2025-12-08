# 🐳 Dockerización de la API

Esta guía explica cómo ejecutar la API de detección de hate speech usando Docker.

## 📋 Requisitos Previos

- Docker instalado ([Instalar Docker](https://docs.docker.com/get-docker/))
- Docker Compose instalado (viene con Docker Desktop)

## 🚀 Uso Rápido

### Opción 1: Docker Compose (Recomendado)

```bash
# Construir y ejecutar
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

### Opción 2: Docker directamente

```bash
# Construir imagen
docker build -t hate-speech-api .

# Ejecutar contenedor
docker run -d \
  --name hate-speech-api \
  -p 8000:8000 \
  -v $(pwd)/models:/app/models:ro \
  hate-speech-api

# Ver logs
docker logs -f hate-speech-api

# Detener
docker stop hate-speech-api
docker rm hate-speech-api
```

## 📝 Verificar que Funciona

Una vez ejecutando, puedes verificar:

```bash
# Health check
curl http://localhost:8000/health

# Documentación de la API
# Abre en navegador: http://localhost:8000/docs
```

## 🔧 Configuración

### Variables de Entorno

Puedes modificar `docker-compose.yml` para añadir variables de entorno:

```yaml
environment:
  - PYTHONUNBUFFERED=1
  - LOG_LEVEL=INFO
```

### Volúmenes

Los volúmenes montados permiten:
- **Modelos**: Acceso a los modelos entrenados sin copiarlos a la imagen
- **Datos**: Acceso a datos procesados si es necesario

## 🐛 Troubleshooting

### El contenedor no inicia

```bash
# Ver logs
docker-compose logs api

# Verificar que los modelos existen
ls -la models/optimized/
```

### Error al cargar el modelo

Asegúrate de que los modelos están en:
- `models/optimized/best_optimized_model.pkl`
- `models/tfidf_vectorizer.pkl`

### Puerto ya en uso

Cambia el puerto en `docker-compose.yml`:
```yaml
ports:
  - "8001:8000"  # Usa 8001 en lugar de 8000
```

## 📦 Estructura de la Imagen

```
/app
├── src/          # Código fuente
├── api/          # API FastAPI
├── models/       # Modelos entrenados (montado como volumen)
└── data/         # Datos (montado como volumen)
```

## 🔒 Producción

Para producción, considera:

1. **Usar variables de entorno** para configuración sensible
2. **Limitar recursos** del contenedor
3. **Usar un reverse proxy** (nginx, traefik)
4. **Implementar logging** centralizado
5. **Usar secrets** para información sensible

Ejemplo con límites de recursos:

```yaml
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 2G
    reservations:
      cpus: '0.5'
      memory: 1G
```

