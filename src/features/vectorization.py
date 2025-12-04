"""
Módulo de vectorización de texto para Machine Learning.

Este módulo contiene funciones para convertir texto preprocesado
en vectores numéricos usando técnicas clásicas de NLP.
"""

import pickle
from pathlib import Path
from typing import Tuple, Optional
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.model_selection import train_test_split


class TextVectorizer:
    """
    Clase para vectorización de texto con TF-IDF y Count Vectorizer.
    """
    
    def __init__(self, method: str = 'tfidf', **kwargs):
        """
        Inicializar vectorizador.
        
        Args:
            method: Método de vectorización ('tfidf' o 'count')
            **kwargs: Parámetros adicionales para el vectorizador
        """
        self.method = method.lower()
        
        # Parámetros por defecto
        default_params = {
            'max_features': 1000,
            'ngram_range': (1, 2),  # Unigramas y bigramas
            'min_df': 2,  # Mínimo 2 documentos
            'max_df': 0.95,  # Máximo 95% de documentos
            'stop_words': 'english',
            'lowercase': True
        }
        
        # Actualizar con parámetros proporcionados
        default_params.update(kwargs)
        
        # Crear vectorizador
        if self.method == 'tfidf':
            self.vectorizer = TfidfVectorizer(**default_params)
        elif self.method == 'count':
            self.vectorizer = CountVectorizer(**default_params)
        else:
            raise ValueError(f"Método '{method}' no soportado. Usa 'tfidf' o 'count'")
    
    def fit_transform(self, texts: pd.Series) -> np.ndarray:
        """
        Ajustar vectorizador y transformar textos.
        
        Args:
            texts: Serie de pandas con textos preprocesados
            
        Returns:
            Matriz de características
        """
        return self.vectorizer.fit_transform(texts).toarray()
    
    def transform(self, texts: pd.Series) -> np.ndarray:
        """
        Transformar textos usando vectorizador ya ajustado.
        
        Args:
            texts: Serie de pandas con textos preprocesados
            
        Returns:
            Matriz de características
        """
        return self.vectorizer.transform(texts).toarray()
    
    def get_feature_names(self) -> list:
        """
        Obtener nombres de las características (palabras).
        
        Returns:
            Lista de nombres de características
        """
        return self.vectorizer.get_feature_names_out().tolist()
    
    def save(self, filepath: Path):
        """
        Guardar vectorizador en archivo.
        
        Args:
            filepath: Ruta donde guardar el vectorizador
        """
        filepath = Path(filepath)
        filepath.parent.mkdir(parents=True, exist_ok=True)
        
        with open(filepath, 'wb') as f:
            pickle.dump(self.vectorizer, f)
        
        print(f"✅ Vectorizador guardado en: {filepath}")
    
    @classmethod
    def load(cls, filepath: Path):
        """
        Cargar vectorizador desde archivo.
        
        Args:
            filepath: Ruta del archivo
            
        Returns:
            Instancia de TextVectorizer
        """
        filepath = Path(filepath)
        
        with open(filepath, 'rb') as f:
            vectorizer = pickle.load(f)
        
        # Determinar método
        method = 'tfidf' if isinstance(vectorizer, TfidfVectorizer) else 'count'
        
        instance = cls(method=method)
        instance.vectorizer = vectorizer
        
        print(f"✅ Vectorizador cargado desde: {filepath}")
        return instance


def split_train_test(
    df: pd.DataFrame,
    text_column: str,
    label_column: str,
    test_size: float = 0.2,
    random_state: int = 42,
    stratify: bool = True
) -> Tuple[pd.Series, pd.Series, pd.Series, pd.Series]:
    """
    Dividir dataset en train y test de forma estratificada.
    
    Args:
        df: DataFrame con los datos
        text_column: Nombre de la columna con el texto
        label_column: Nombre de la columna con las etiquetas
        test_size: Proporción del test set (default: 0.2)
        random_state: Semilla para reproducibilidad
        stratify: Si True, mantiene proporción de clases
        
    Returns:
        Tupla (X_train, X_test, y_train, y_test)
    """
    X = df[text_column]
    y = df[label_column]
    
    # Convertir etiquetas booleanas a numéricas si es necesario
    if y.dtype == bool:
        y = y.astype(int)
    elif y.dtype == object:
        # Si son strings como 'TRUE'/'FALSE'
        y = y.map({'TRUE': 1, 'FALSE': 0, True: 1, False: 0})
    
    stratify_param = y if stratify else None
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=test_size,
        random_state=random_state,
        stratify=stratify_param
    )
    
    print(f"✅ División train/test completada:")
    print(f"   Train: {len(X_train)} ejemplos ({len(X_train)/len(df)*100:.1f}%)")
    print(f"   Test: {len(X_test)} ejemplos ({len(X_test)/len(df)*100:.1f}%)")
    print(f"   Distribución train: {y_train.value_counts().to_dict()}")
    print(f"   Distribución test: {y_test.value_counts().to_dict()}")
    
    return X_train, X_test, y_train, y_test


def vectorize_data(
    X_train: pd.Series,
    X_test: pd.Series,
    method: str = 'tfidf',
    save_path: Optional[Path] = None,
    **vectorizer_params
) -> Tuple[np.ndarray, np.ndarray, TextVectorizer]:
    """
    Vectorizar datos de entrenamiento y prueba.
    
    Args:
        X_train: Textos de entrenamiento
        X_test: Textos de prueba
        method: Método de vectorización ('tfidf' o 'count')
        save_path: Ruta para guardar el vectorizador (opcional)
        **vectorizer_params: Parámetros adicionales para el vectorizador
        
    Returns:
        Tupla (X_train_vectorized, X_test_vectorized, vectorizer)
    """
    print(f"🔧 Vectorizando con método: {method.upper()}")
    
    # Crear vectorizador
    vectorizer = TextVectorizer(method=method, **vectorizer_params)
    
    # Ajustar y transformar train
    print("   Ajustando vectorizador con datos de entrenamiento...")
    X_train_vec = vectorizer.fit_transform(X_train)
    
    # Transformar test
    print("   Transformando datos de prueba...")
    X_test_vec = vectorizer.transform(X_test)
    
    print(f"✅ Vectorización completada:")
    print(f"   Train shape: {X_train_vec.shape}")
    print(f"   Test shape: {X_test_vec.shape}")
    print(f"   Vocabulario: {len(vectorizer.get_feature_names())} features")
    
    # Guardar si se especifica ruta
    if save_path:
        vectorizer.save(save_path)
    
    return X_train_vec, X_test_vec, vectorizer


def save_vectorized_data(
    X_train: np.ndarray,
    X_test: np.ndarray,
    y_train: pd.Series,
    y_test: pd.Series,
    output_dir: Path,
    prefix: str = 'vectorized'
):
    """
    Guardar datos vectorizados en archivos pickle.
    
    Args:
        X_train: Matriz de características de entrenamiento
        X_test: Matriz de características de prueba
        y_train: Etiquetas de entrenamiento
        y_test: Etiquetas de prueba
        output_dir: Directorio donde guardar
        prefix: Prefijo para los archivos
    """
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Guardar matrices
    with open(output_dir / f'{prefix}_X_train.pkl', 'wb') as f:
        pickle.dump(X_train, f)
    
    with open(output_dir / f'{prefix}_X_test.pkl', 'wb') as f:
        pickle.dump(X_test, f)
    
    # Guardar etiquetas
    with open(output_dir / 'y_train.pkl', 'wb') as f:
        pickle.dump(y_train, f)
    
    with open(output_dir / 'y_test.pkl', 'wb') as f:
        pickle.dump(y_test, f)
    
    print(f"✅ Datos vectorizados guardados en: {output_dir}")
    print(f"   - {prefix}_X_train.pkl")
    print(f"   - {prefix}_X_test.pkl")
    print(f"   - y_train.pkl")
    print(f"   - y_test.pkl")


def load_vectorized_data(
    input_dir: Path,
    prefix: str = 'vectorized'
) -> Tuple[np.ndarray, np.ndarray, pd.Series, pd.Series]:
    """
    Cargar datos vectorizados desde archivos pickle.
    
    Args:
        input_dir: Directorio donde están los archivos
        prefix: Prefijo de los archivos
        
    Returns:
        Tupla (X_train, X_test, y_train, y_test)
    """
    input_dir = Path(input_dir)
    
    with open(input_dir / f'{prefix}_X_train.pkl', 'rb') as f:
        X_train = pickle.load(f)
    
    with open(input_dir / f'{prefix}_X_test.pkl', 'rb') as f:
        X_test = pickle.load(f)
    
    with open(input_dir / 'y_train.pkl', 'rb') as f:
        y_train = pickle.load(f)
    
    with open(input_dir / 'y_test.pkl', 'rb') as f:
        y_test = pickle.load(f)
    
    print(f"✅ Datos vectorizados cargados desde: {input_dir}")
    return X_train, X_test, y_train, y_test


if __name__ == "__main__":
    # Ejemplo de uso
    print("Ejemplo de uso del módulo de vectorización:")
    print("="*60)
    
    # Crear datos de ejemplo
    sample_texts = pd.Series([
        "this is a sample text",
        "another example text here",
        "sample text for testing"
    ])
    
    # Vectorizar con TF-IDF
    vectorizer = TextVectorizer(method='tfidf', max_features=100)
    X = vectorizer.fit_transform(sample_texts)
    
    print(f"\nMatriz resultante shape: {X.shape}")
    print(f"Features: {len(vectorizer.get_feature_names())}")

