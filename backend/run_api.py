#!/usr/bin/env python3
"""
Script para ejecutar la API de forma más robusta.
"""
import sys
from pathlib import Path

# Obtener el directorio backend
backend_dir = Path(__file__).parent.resolve()

# Añadir backend y src al PYTHONPATH
sys.path.insert(0, str(backend_dir))
sys.path.insert(0, str(backend_dir / 'src'))

# Verificar que los modelos existen
model_path = backend_dir / 'models' / 'optimized' / 'best_optimized_model.pkl'
vectorizer_path = backend_dir / 'models' / 'tfidf_vectorizer.pkl'

if not model_path.exists():
    print("❌ Error: Modelo no encontrado en models/optimized/best_optimized_model.pkl")
    print("   Por favor, ejecuta primero el notebook 05_Hyperparameter_Tuning.ipynb")
    sys.exit(1)

if not vectorizer_path.exists():
    print("❌ Error: Vectorizador no encontrado en models/tfidf_vectorizer.pkl")
    print("   Por favor, ejecuta primero el notebook 03_Feature_Engineering.ipynb")
    sys.exit(1)

print("✅ Modelos encontrados")
print("")
print("📡 Iniciando servidor en http://localhost:8000")
print("📚 Documentación disponible en http://localhost:8000/docs")
print("")

# Cambiar al directorio backend
import os
os.chdir(backend_dir)

# Importar la app directamente desde main.py en la raíz
import main
app = main.app

# Ejecutar uvicorn
import uvicorn
uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
