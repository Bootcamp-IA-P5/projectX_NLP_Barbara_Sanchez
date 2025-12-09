#!/bin/bash
# Script para ejecutar la API

#!/bin/bash
# Script para ejecutar la API

# Obtener el directorio backend
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🚀 Iniciando API de Detección de Hate Speech..."
echo "📁 Directorio: $BACKEND_DIR"
echo ""

# Usar el script Python que maneja mejor los paths
cd "$BACKEND_DIR" || exit 1
python3 run_api.py

