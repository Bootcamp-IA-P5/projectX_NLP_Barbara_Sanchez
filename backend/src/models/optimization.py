"""
Módulo para optimización de hiperparámetros con Optuna.

Este módulo contiene funciones para optimizar modelos de ML
con el objetivo de reducir overfitting y mejorar F1-score.
"""

import optuna
from typing import Dict, Any, Tuple, Optional
import numpy as np
import pandas as pd
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import f1_score, make_scorer

# Imports relativos o absolutos según el contexto
try:
    from .train import train_model
    from .evaluate import evaluate_model
except ImportError:
    # Si falla, intentar import absoluto
    import sys
    from pathlib import Path
    # Añadir src al path si no está
    src_path = Path(__file__).parent.parent
    if str(src_path) not in sys.path:
        sys.path.insert(0, str(src_path))
    from models.train import train_model
    from models.evaluate import evaluate_model


def objective_svm(
    trial,
    X_train: np.ndarray,
    X_test: np.ndarray,
    y_train: pd.Series,
    y_test: pd.Series,
    vectorizer_type: str = 'tfidf'
) -> float:
    """
    Función objetivo para optimizar SVM con Optuna.
    Prioriza overfitting < 5% y F1-score > 0.55.
    
    Args:
        trial: Trial de Optuna
        X_train: Matriz de características de entrenamiento
        X_test: Matriz de características de prueba
        y_train: Etiquetas de entrenamiento
        y_test: Etiquetas de prueba
        vectorizer_type: Tipo de vectorizador ('tfidf' o 'count')
        
    Returns:
        Score a maximizar (penaliza overfitting alto)
    """
    # Hiperparámetros a optimizar
    C = trial.suggest_float('C', 0.001, 10.0, log=True)
    kernel = trial.suggest_categorical('kernel', ['linear', 'rbf'])
    
    # Entrenar modelo
    model = train_model(
        'svm',
        X_train,
        y_train,
        C=C,
        kernel=kernel,
        class_weight='balanced'
    )
    
    # Evaluar
    results = evaluate_model(
        model, X_train, X_test, y_train, y_test, verbose=False
    )
    
    test_f1 = results['test_f1']
    diff_f1 = results['diff_f1']
    
    # Penalizar si overfitting es muy alto
    if diff_f1 > 6.0:
        return -20.0  # Penalización fuerte
    
    # Score: F1-score menos penalización por overfitting
    # Prioriza modelos con overfitting < 5%
    if diff_f1 < 5.0:
        score = test_f1 - (diff_f1 / 100) * 0.1  # Penalización mínima
    else:
        score = test_f1 - (diff_f1 / 100) * 0.5  # Penalización mayor
    
    # Penalizar si F1 es muy bajo
    if test_f1 < 0.50:
        score -= 0.2
    
    return score


def objective_naive_bayes(
    trial,
    X_train: np.ndarray,
    X_test: np.ndarray,
    y_train: pd.Series,
    y_test: pd.Series,
    vectorizer_type: str = 'tfidf'
) -> float:
    """
    Función objetivo para optimizar Naive Bayes con Optuna.
    
    Args:
        trial: Trial de Optuna
        X_train: Matriz de características de entrenamiento
        X_test: Matriz de características de prueba
        y_train: Etiquetas de entrenamiento
        y_test: Etiquetas de prueba
        vectorizer_type: Tipo de vectorizador ('tfidf' o 'count')
        
    Returns:
        Score a maximizar
    """
    # Hiperparámetros a optimizar
    alpha = trial.suggest_float('alpha', 0.1, 10.0, log=True)
    fit_prior = trial.suggest_categorical('fit_prior', [True, False])
    
    # Entrenar modelo
    model = train_model(
        'naive_bayes',
        X_train,
        y_train,
        alpha=alpha,
        fit_prior=fit_prior
    )
    
    # Evaluar
    results = evaluate_model(
        model, X_train, X_test, y_train, y_test, verbose=False
    )
    
    test_f1 = results['test_f1']
    diff_f1 = results['diff_f1']
    
    # Penalizar si overfitting es muy alto
    if diff_f1 > 6.0:
        return -20.0
    
    # Score
    if diff_f1 < 5.0:
        score = test_f1 - (diff_f1 / 100) * 0.1
    else:
        score = test_f1 - (diff_f1 / 100) * 0.5
    
    if test_f1 < 0.50:
        score -= 0.2
    
    return score


def objective_logistic_regression(
    trial,
    X_train: np.ndarray,
    X_test: np.ndarray,
    y_train: pd.Series,
    y_test: pd.Series,
    vectorizer_type: str = 'tfidf'
) -> float:
    """
    Función objetivo para optimizar Logistic Regression con Optuna.
    
    Args:
        trial: Trial de Optuna
        X_train: Matriz de características de entrenamiento
        X_test: Matriz de características de prueba
        y_train: Etiquetas de entrenamiento
        y_test: Etiquetas de prueba
        vectorizer_type: Tipo de vectorizador ('tfidf' o 'count')
        
    Returns:
        Score a maximizar
    """
    # Hiperparámetros a optimizar
    C = trial.suggest_float('C', 0.001, 10.0, log=True)
    penalty = trial.suggest_categorical('penalty', ['l1', 'l2'])
    
    # Entrenar modelo
    model = train_model(
        'logistic',
        X_train,
        y_train,
        C=C,
        penalty=penalty,
        class_weight='balanced'
    )
    
    # Evaluar
    results = evaluate_model(
        model, X_train, X_test, y_train, y_test, verbose=False
    )
    
    test_f1 = results['test_f1']
    diff_f1 = results['diff_f1']
    
    # Penalizar si overfitting es muy alto
    if diff_f1 > 6.0:
        return -20.0
    
    # Score
    if diff_f1 < 5.0:
        score = test_f1 - (diff_f1 / 100) * 0.1
    else:
        score = test_f1 - (diff_f1 / 100) * 0.5
    
    if test_f1 < 0.50:
        score -= 0.2
    
    return score


def objective_random_forest(
    trial,
    X_train: np.ndarray,
    X_test: np.ndarray,
    y_train: pd.Series,
    y_test: pd.Series,
    vectorizer_type: str = 'tfidf'
) -> float:
    """
    Función objetivo para optimizar Random Forest con Optuna.
    
    Args:
        trial: Trial de Optuna
        X_train: Matriz de características de entrenamiento
        X_test: Matriz de características de prueba
        y_train: Etiquetas de entrenamiento
        y_test: Etiquetas de prueba
        vectorizer_type: Tipo de vectorizador ('tfidf' o 'count')
        
    Returns:
        Score a maximizar
    """
    # Hiperparámetros a optimizar
    n_estimators = trial.suggest_int('n_estimators', 50, 300)
    max_depth = trial.suggest_int('max_depth', 3, 20)
    min_samples_split = trial.suggest_int('min_samples_split', 2, 20)
    min_samples_leaf = trial.suggest_int('min_samples_leaf', 1, 10)
    
    # Entrenar modelo
    model = train_model(
        'random_forest',
        X_train,
        y_train,
        n_estimators=n_estimators,
        max_depth=max_depth,
        min_samples_split=min_samples_split,
        min_samples_leaf=min_samples_leaf,
        class_weight='balanced'
    )
    
    # Evaluar
    results = evaluate_model(
        model, X_train, X_test, y_train, y_test, verbose=False
    )
    
    test_f1 = results['test_f1']
    diff_f1 = results['diff_f1']
    
    # Penalizar si overfitting es muy alto
    if diff_f1 > 6.0:
        return -20.0
    
    # Score
    if diff_f1 < 5.0:
        score = test_f1 - (diff_f1 / 100) * 0.1
    else:
        score = test_f1 - (diff_f1 / 100) * 0.5
    
    if test_f1 < 0.50:
        score -= 0.2
    
    return score


def optimize_model(
    model_type: str,
    X_train: np.ndarray,
    X_test: np.ndarray,
    y_train: pd.Series,
    y_test: pd.Series,
    n_trials: int = 100,
    vectorizer_type: str = 'tfidf',
    study_name: Optional[str] = None
) -> Tuple[Any, Dict[str, Any], optuna.Study]:
    """
    Optimizar modelo con Optuna.
    
    Args:
        model_type: Tipo de modelo ('svm', 'naive_bayes', 'logistic', 'random_forest')
        X_train: Matriz de características de entrenamiento
        X_test: Matriz de características de prueba
        y_train: Etiquetas de entrenamiento
        y_test: Etiquetas de prueba
        n_trials: Número de trials de Optuna (default: 100)
        vectorizer_type: Tipo de vectorizador ('tfidf' o 'count')
        study_name: Nombre del estudio de Optuna (opcional)
        
    Returns:
        Tupla (mejor_modelo, mejores_parámetros, estudio)
    """
    model_type = model_type.lower()
    
    # Seleccionar función objetivo
    if model_type == 'svm':
        objective_func = objective_svm
    elif model_type == 'naive_bayes':
        objective_func = objective_naive_bayes
    elif model_type == 'logistic':
        objective_func = objective_logistic_regression
    elif model_type == 'random_forest':
        objective_func = objective_random_forest
    else:
        raise ValueError(f"Tipo de modelo '{model_type}' no soportado")
    
    # Crear estudio de Optuna
    if study_name is None:
        study_name = f"{model_type}_{vectorizer_type}_optimization"
    
    study = optuna.create_study(
        direction='maximize',
        study_name=study_name
    )
    
    # Crear función objetivo con parámetros fijos
    def objective(trial):
        return objective_func(trial, X_train, X_test, y_train, y_test, vectorizer_type)
    
    # Optimizar
    print(f"🔍 Optimizando {model_type.upper()} con {n_trials} trials...")
    study.optimize(objective, n_trials=n_trials, show_progress_bar=True)
    
    # Obtener mejores parámetros
    best_params = study.best_params
    print(f"\n✅ Mejores parámetros encontrados:")
    for param, value in best_params.items():
        print(f"   {param}: {value}")
    
    # Entrenar mejor modelo
    best_model = train_model(model_type, X_train, y_train, **best_params)
    
    # Evaluar mejor modelo
    best_results = evaluate_model(
        best_model, X_train, X_test, y_train, y_test, verbose=True
    )
    
    return best_model, best_params, study

