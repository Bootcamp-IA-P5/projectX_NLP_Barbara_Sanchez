#!/bin/bash

# Script para iniciar MLFlow UI
# Uso: bash scripts/start_mlflow_ui.sh [puerto]

PORT=${1:-5000}

echo "🚀 Iniciando MLFlow UI..."
echo "📁 Directorio de tracking: mlruns/"
echo "🌐 URL: http://localhost:${PORT}"
echo ""
echo "Presiona Ctrl+C para detener el servidor"
echo ""

mlflow ui --port $PORT --host 0.0.0.0

