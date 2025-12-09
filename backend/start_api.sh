#!/bin/bash
# Script simple para iniciar la API

# Detener cualquier proceso en el puerto 8000
lsof -ti:8000 | xargs kill -9 2>/dev/null
pkill -f "uvicorn\|run_api" 2>/dev/null
sleep 1

# Cambiar al directorio backend
cd "$(dirname "$0")" || exit 1

echo "🚀 Iniciando API de Detección de Hate Speech..."
echo ""

# Ejecutar el script Python
python3 run_api.py

