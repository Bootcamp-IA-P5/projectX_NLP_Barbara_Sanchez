"""
Módulo para entrenar modelos de Machine Learning.

Este módulo contiene funciones para entrenar diferentes modelos
de clasificación de texto.
"""

import pickle
from pathlib import Path
from typing import Dict, Any, Optional
import numpy as np
import pandas as pd
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier


def train_naive_bayes(
    X_train: np.ndarray,
    y_train: pd.Series,
    alpha: float = 1.0,
    fit_prior: bool = True
) -> MultinomialNB:
    """
    Entrenar modelo Naive Bayes.
    
    Args:
        X_train: Matriz de características de entrenamiento
        y_train: Etiquetas de entrenamiento
        alpha: Parámetro de suavizado (default: 1.0)
        fit_prior: Si True, aprende probabilidades a priori (default: True)
        
    Returns:
        Modelo entrenado
    """
    model = MultinomialNB(alpha=alpha, fit_prior=fit_prior)
    model.fit(X_train, y_train)
    return model


def train_logistic_regression(
    X_train: np.ndarray,
    y_train: pd.Series,
    C: float = 1.0,
    penalty: str = 'l2',
    max_iter: int = 1000,
    class_weight: Optional[str] = 'balanced'
) -> LogisticRegression:
    """
    Entrenar modelo de Regresión Logística.
    
    Args:
        X_train: Matriz de características de entrenamiento
        y_train: Etiquetas de entrenamiento
        C: Parámetro de regularización inversa (default: 1.0)
        penalty: Tipo de regularización ('l1' o 'l2', default: 'l2')
        max_iter: Máximo número de iteraciones (default: 1000)
        class_weight: Peso de clases ('balanced' o None, default: 'balanced')
        
    Returns:
        Modelo entrenado
    """
    solver = 'liblinear' if penalty == 'l1' else 'lbfgs'
    model = LogisticRegression(
        C=C,
        penalty=penalty,
        solver=solver,
        max_iter=max_iter,
        class_weight=class_weight,
        random_state=42
    )
    model.fit(X_train, y_train)
    return model


def train_svm(
    X_train: np.ndarray,
    y_train: pd.Series,
    C: float = 1.0,
    kernel: str = 'linear',
    class_weight: Optional[str] = 'balanced'
) -> SVC:
    """
    Entrenar modelo SVM (Support Vector Machine).
    
    Args:
        X_train: Matriz de características de entrenamiento
        y_train: Etiquetas de entrenamiento
        C: Parámetro de regularización (default: 1.0)
        kernel: Tipo de kernel ('linear', 'rbf', 'poly', default: 'linear')
        class_weight: Peso de clases ('balanced' o None, default: 'balanced')
        
    Returns:
        Modelo entrenado
    """
    model = SVC(
        C=C,
        kernel=kernel,
        class_weight=class_weight,
        random_state=42,
        probability=True  # Para poder obtener probabilidades
    )
    model.fit(X_train, y_train)
    return model


def train_random_forest(
    X_train: np.ndarray,
    y_train: pd.Series,
    n_estimators: int = 100,
    max_depth: Optional[int] = None,
    min_samples_split: int = 2,
    min_samples_leaf: int = 1,
    class_weight: Optional[str] = 'balanced'
) -> RandomForestClassifier:
    """
    Entrenar modelo Random Forest.
    
    Args:
        X_train: Matriz de características de entrenamiento
        y_train: Etiquetas de entrenamiento
        n_estimators: Número de árboles (default: 100)
        max_depth: Profundidad máxima de los árboles (default: None)
        min_samples_split: Mínimo de muestras para dividir (default: 2)
        min_samples_leaf: Mínimo de muestras en hoja (default: 1)
        class_weight: Peso de clases ('balanced' o None, default: 'balanced')
        
    Returns:
        Modelo entrenado
    """
    model = RandomForestClassifier(
        n_estimators=n_estimators,
        max_depth=max_depth,
        min_samples_split=min_samples_split,
        min_samples_leaf=min_samples_leaf,
        class_weight=class_weight,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)
    return model


def train_model(
    model_type: str,
    X_train: np.ndarray,
    y_train: pd.Series,
    **kwargs
):
    """
    Función genérica para entrenar modelos.
    
    Args:
        model_type: Tipo de modelo ('naive_bayes', 'logistic', 'svm', 'random_forest')
        X_train: Matriz de características de entrenamiento
        y_train: Etiquetas de entrenamiento
        **kwargs: Parámetros específicos del modelo
        
    Returns:
        Modelo entrenado
    """
    model_type = model_type.lower()
    
    if model_type == 'naive_bayes':
        return train_naive_bayes(X_train, y_train, **kwargs)
    elif model_type == 'logistic':
        return train_logistic_regression(X_train, y_train, **kwargs)
    elif model_type == 'svm':
        return train_svm(X_train, y_train, **kwargs)
    elif model_type == 'random_forest':
        return train_random_forest(X_train, y_train, **kwargs)
    else:
        raise ValueError(f"Tipo de modelo '{model_type}' no soportado. "
                        f"Usa: 'naive_bayes', 'logistic', 'svm', 'random_forest'")


def save_model(model: Any, filepath: Path, model_info: Optional[Dict] = None):
    """
    Guardar modelo entrenado.
    
    Args:
        model: Modelo entrenado
        filepath: Ruta donde guardar el modelo
        model_info: Información adicional del modelo (opcional)
    """
    filepath = Path(filepath)
    filepath.parent.mkdir(parents=True, exist_ok=True)
    
    # Guardar modelo
    with open(filepath, 'wb') as f:
        pickle.dump(model, f)
    
    # Guardar información si se proporciona
    if model_info:
        info_path = filepath.parent / f"{filepath.stem}_info.pkl"
        with open(info_path, 'wb') as f:
            pickle.dump(model_info, f)
    
    print(f"✅ Modelo guardado en: {filepath}")


def load_model(filepath: Path) -> Any:
    """
    Cargar modelo entrenado.
    
    Args:
        filepath: Ruta del archivo del modelo
        
    Returns:
        Modelo cargado
    """
    filepath = Path(filepath)
    
    with open(filepath, 'rb') as f:
        model = pickle.load(f)
    
    print(f"✅ Modelo cargado desde: {filepath}")
    return model

