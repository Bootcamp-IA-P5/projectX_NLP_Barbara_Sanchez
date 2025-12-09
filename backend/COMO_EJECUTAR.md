# 🚀 Cómo Ejecutar la API

## Opción 1: Script Simple (Recomendado) ⭐

```bash
cd backend
./start_api.sh
```

Este script:
- ✅ Detiene procesos anteriores en el puerto 8000
- ✅ Inicia la API automáticamente
- ✅ Muestra mensajes informativos

## Opción 2: Script Python

```bash
cd backend
python3 run_api.py
```

**⚠️ Importante**: El archivo se llama `run_api.py` (con guion bajo), NO `run api.py` (con espacio)

## Opción 3: Script Bash Original

```bash
cd backend
bash api/run.sh
```

## Verificar que Funciona

Una vez iniciada, abre en tu navegador:
- **Documentación**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## Detener la API

Presiona `Ctrl+C` en la terminal donde está corriendo.

O desde otra terminal:
```bash
pkill -f "run_api.py"
```

## Solución de Problemas

### Error: "Address already in use"
El puerto 8000 está ocupado. Usa el script `start_api.sh` que lo libera automáticamente, o:

```bash
lsof -ti:8000 | xargs kill -9
```

### Error: "No such file or directory"
Asegúrate de estar en el directorio `backend/`:
```bash
cd backend
pwd  # Debe mostrar: .../backend
```

### Error: "Module not found"
Asegúrate de haber instalado las dependencias:
```bash
cd backend
pip install -r requirements.txt
```

