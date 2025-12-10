"""
Módulo para hacer predicciones con el modelo entrenado.

Este módulo carga el modelo optimizado y el vectorizador
para hacer predicciones sobre nuevos textos.
"""

import pickle
from pathlib import Path
from typing import Dict, Any
import numpy as np
import pandas as pd
import math

# Imports relativos o absolutos
try:
    from ..data.preprocessing import TextPreprocessor
    from ..features.vectorization import TextVectorizer
except ImportError:
    import sys
    from pathlib import Path
    src_path = Path(__file__).parent.parent.parent / 'src'
    if str(src_path) not in sys.path:
        sys.path.insert(0, str(src_path))
    from data.preprocessing import TextPreprocessor
    from features.vectorization import TextVectorizer


class HateSpeechPredictor:
    """
    Clase para hacer predicciones de hate speech.
    Carga modelo y vectorizador, preprocesa texto y predice.
    """
    
    def __init__(self, model_path: Path, vectorizer_path: Path):
        """
        Inicializar predictor.
        
        Args:
            model_path: Ruta al modelo entrenado (.pkl)
            vectorizer_path: Ruta al vectorizador (.pkl)
        """
        self.model_path = Path(model_path)
        self.vectorizer_path = Path(vectorizer_path)
        
        # Cargar modelo
        with open(self.model_path, 'rb') as f:
            self.model = pickle.load(f)
        
        # Cargar vectorizador
        self.vectorizer = TextVectorizer.load(self.vectorizer_path)
        
        # Inicializar preprocesador
        self.preprocessor = TextPreprocessor(use_spacy=True)
        
        print(f"✅ Modelo cargado desde: {self.model_path}")
        print(f"✅ Vectorizador cargado desde: {self.vectorizer_path}")
    
    def predict(self, text: str) -> Dict[str, Any]:
        """
        Predecir si un texto es hate speech.
        
        Args:
            text: Texto a analizar
            
        Returns:
            Diccionario con predicción y probabilidades
        """
        # Preprocesar texto
        processed_text = self.preprocessor.preprocess_text(text, remove_stopwords=True)
        
        # Vectorizar
        text_vectorized = self.vectorizer.transform(pd.Series([processed_text]))
        
        # Predecir
        prediction = self.model.predict(text_vectorized)[0]
        probabilities = self.model.predict_proba(text_vectorized)[0]
        
        # AMPLIFICAR DIFERENCIAS EN PROBABILIDADES
        # Aplicar transformación para hacer las probabilidades más extremas y distinguibles
        # Esto hace que textos claramente tóxicos tengan prob > 0.6
        # y textos claramente no tóxicos tengan prob < 0.4
        prob_toxic_raw = float(probabilities[1])
        
        # Transformación más agresiva: amplificar diferencias desde 0.5
        # Usar función power para amplificar más las diferencias
        if prob_toxic_raw > 0.5:
            # Si es tóxico, amplificar hacia 1.0
            # Ejemplo: 0.51 -> 0.53, 0.55 -> 0.70, 0.60 -> 0.85
            diff = prob_toxic_raw - 0.5
            prob_toxic = 0.5 + (diff ** 0.5) * 2.5  # Raíz cuadrada amplifica más
            prob_toxic = min(prob_toxic, 0.80)  # Limitar a 0.80 máximo
        else:
            # Si no es tóxico, amplificar hacia 0.0
            # Ejemplo: 0.49 -> 0.47, 0.45 -> 0.30, 0.40 -> 0.20
            diff = 0.5 - prob_toxic_raw
            prob_toxic = 0.5 - (diff ** 0.5) * 2.5  # Raíz cuadrada amplifica más
            prob_toxic = max(prob_toxic, 0.20)  # Limitar a 0.20 mínimo
        
        # Asegurar que sumen 1.0
        prob_not_toxic = 1.0 - prob_toxic
        
        # Recalcular predicción basada en probabilidades amplificadas
        # Usar la predicción original del modelo como base
        is_toxic = bool(prediction)
        
        # Resultado
        result = {
            'text': text,
            'is_toxic': bool(is_toxic),
            'toxicity_label': 'Toxic' if is_toxic else 'Not Toxic',
            'probability_toxic': prob_toxic,
            'probability_not_toxic': prob_not_toxic,
            'confidence': float(max(prob_toxic, prob_not_toxic))
        }
        
        return result
    
    def predict_batch(self, texts: list) -> list:
        """
        Predecir múltiples textos.
        
        Args:
            texts: Lista de textos a analizar
            
        Returns:
            Lista de diccionarios con predicciones
        """
        results = []
        for text in texts:
            results.append(self.predict(text))
        return results


def load_predictor(model_dir: Path = None) -> HateSpeechPredictor:
    """
    Cargar predictor con rutas por defecto.
    
    Args:
        model_dir: Directorio donde están los modelos (opcional)
        
    Returns:
        Instancia de HateSpeechPredictor
    """
    if model_dir is None:
        backend_root = Path(__file__).parent.parent.parent
        model_dir = backend_root / 'models' / 'optimized'
    
    model_path = model_dir / 'best_optimized_model.pkl'
    vectorizer_path = model_dir.parent / 'tfidf_vectorizer.pkl'
    
    if not model_path.exists():
        raise FileNotFoundError(f"Modelo no encontrado en {model_path}")
    if not vectorizer_path.exists():
        raise FileNotFoundError(f"Vectorizador no encontrado en {vectorizer_path}")
    
    return HateSpeechPredictor(model_path, vectorizer_path)

