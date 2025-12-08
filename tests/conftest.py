"""
Configuración y fixtures compartidas para los tests.
"""
import pytest
import pandas as pd
import numpy as np
from pathlib import Path
import sys

# Añadir src al path para imports
project_root = Path(__file__).parent.parent
src_path = project_root / 'src'
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))


@pytest.fixture
def sample_texts():
    """Textos de ejemplo para testing."""
    return [
        "This is a normal comment",
        "I hate you so much!",
        "Check out https://example.com for more info",
        "Hello world!!!",
        "This is NOT toxic",
        ""
    ]


@pytest.fixture
def sample_dataframe():
    """DataFrame de ejemplo con textos y etiquetas."""
    return pd.DataFrame({
        'Text': [
            "This is a normal comment",
            "I hate you so much!",
            "Check out https://example.com",
            "Hello world!!!",
            "This is NOT toxic"
        ],
        'Label': [0, 1, 0, 0, 0]
    })


@pytest.fixture
def sample_vectorized_data():
    """Datos vectorizados de ejemplo."""
    # Crear datos sintéticos
    X_train = np.random.rand(100, 50)  # 100 muestras, 50 features
    X_test = np.random.rand(20, 50)    # 20 muestras, 50 features
    y_train = pd.Series([0, 1] * 50)   # Etiquetas balanceadas
    y_test = pd.Series([0, 1] * 10)    # Etiquetas balanceadas
    
    return X_train, X_test, y_train, y_test


@pytest.fixture
def project_root():
    """Ruta raíz del proyecto."""
    return Path(__file__).parent.parent

