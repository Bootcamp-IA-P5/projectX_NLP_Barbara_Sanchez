#!/bin/bash
# Script para ejecutar la API

echo "🚀 Iniciando API de Detección de Hate Speech..."
echo ""

# Verificar que el modelo existe
if [ ! -f "models/optimized/best_optimized_model.pkl" ]; then
    echo "❌ Error: Modelo no encontrado en models/optimized/best_optimized_model.pkl"
    echo "   Por favor, ejecuta primero el notebook 05_Hyperparameter_Tuning.ipynb"
    exit 1
fi

if [ ! -f "models/tfidf_vectorizer.pkl" ]; then
    echo "❌ Error: Vectorizador no encontrado en models/tfidf_vectorizer.pkl"
    echo "   Por favor, ejecuta primero el notebook 03_Feature_Engineering.ipynb"
    exit 1
fi

echo "✅ Modelos encontrados"
echo ""
echo "📡 Iniciando servidor en http://localhost:8000"
echo "📚 Documentación disponible en http://localhost:8000/docs"
echo ""

# Ejecutar API
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000

