"""
Módulo para ensemble de modelos.

Este módulo contiene funciones para combinar múltiples modelos
usando técnicas de ensemble (Voting, Stacking).
"""

from typing import List, Dict, Any, Optional
import numpy as np
import pandas as pd
from sklearn.ensemble import VotingClassifier, StackingClassifier
from sklearn.linear_model import LogisticRegression

# Imports relativos o absolutos
try:
    from .train import train_model
    from .evaluate import evaluate_model
except ImportError:
    import sys
    from pathlib import Path
    src_path = Path(__file__).parent.parent
    if str(src_path) not in sys.path:
        sys.path.insert(0, str(src_path))
    from models.train import train_model
    from models.evaluate import evaluate_model


def create_voting_classifier(
    models_config: List[Dict[str, Any]],
    X_train: np.ndarray,
    y_train: pd.Series,
    voting: str = 'soft',
    weights: Optional[List[float]] = None,
    use_optimized_params: bool = True
) -> VotingClassifier:
    """
    Crear ensemble con Voting Classifier.
    
    Args:
        models_config: Lista de diccionarios con configuración de modelos
                      [{'name': 'svm', 'type': 'svm', 'params': {...}}, ...]
        X_train: Matriz de características de entrenamiento
        y_train: Etiquetas de entrenamiento
        voting: Tipo de votación ('hard' o 'soft', default: 'soft')
        weights: Pesos para cada modelo (opcional)
        use_optimized_params: Si True, usa parámetros optimizados para reducir overfitting
        
    Returns:
        VotingClassifier entrenado
    """
    estimators = []
    
    # Parámetros optimizados para reducir overfitting
    optimized_params = {
        'svm': {'C': 0.056, 'kernel': 'linear', 'class_weight': 'balanced'},
        'logistic': {'C': 0.1, 'penalty': 'l2', 'class_weight': 'balanced', 'max_iter': 1000},
        'naive_bayes': {'alpha': 10.0},  # Mayor regularización
        'random_forest': {'n_estimators': 50, 'max_depth': 5, 'min_samples_split': 10, 
                         'min_samples_leaf': 5, 'class_weight': 'balanced'}
    }
    
    for config in models_config:
        model_type = config['type']
        model_params = config.get('params', {})
        model_name = config.get('name', model_type)
        
        # Usar parámetros optimizados si está habilitado
        if use_optimized_params and model_type in optimized_params:
            # Combinar parámetros: los del config tienen prioridad
            final_params = {**optimized_params[model_type], **model_params}
        else:
            final_params = model_params
        
        # Entrenar modelo individual
        model = train_model(model_type, X_train, y_train, **final_params)
        estimators.append((model_name, model))
    
    # Crear Voting Classifier
    voting_clf = VotingClassifier(
        estimators=estimators,
        voting=voting,
        weights=weights
    )
    
    # Entrenar ensemble
    voting_clf.fit(X_train, y_train)
    
    print(f"✅ Voting Classifier creado con {len(estimators)} modelos")
    print(f"   Tipo de votación: {voting}")
    if weights:
        print(f"   Pesos: {weights}")
    
    return voting_clf


def create_stacking_classifier(
    models_config: List[Dict[str, Any]],
    X_train: np.ndarray,
    y_train: pd.Series,
    final_estimator: Any = None,
    cv: int = 5,
    use_optimized_params: bool = True
) -> StackingClassifier:
    """
    Crear ensemble con Stacking Classifier.
    
    Args:
        models_config: Lista de diccionarios con configuración de modelos
        X_train: Matriz de características de entrenamiento
        y_train: Etiquetas de entrenamiento
        final_estimator: Estimador final (default: LogisticRegression)
        cv: Número de folds para cross-validation (default: 5)
        use_optimized_params: Si True, usa parámetros optimizados para reducir overfitting
        
    Returns:
        StackingClassifier entrenado
    """
    estimators = []
    
    # Parámetros optimizados para reducir overfitting
    optimized_params = {
        'svm': {'C': 0.056, 'kernel': 'linear', 'class_weight': 'balanced'},
        'logistic': {'C': 0.1, 'penalty': 'l2', 'class_weight': 'balanced', 'max_iter': 1000},
        'naive_bayes': {'alpha': 10.0},  # Mayor regularización
        'random_forest': {'n_estimators': 50, 'max_depth': 5, 'min_samples_split': 10, 
                         'min_samples_leaf': 5, 'class_weight': 'balanced'}
    }
    
    for config in models_config:
        model_type = config['type']
        model_params = config.get('params', {})
        model_name = config.get('name', model_type)
        
        # Usar parámetros optimizados si está habilitado
        if use_optimized_params and model_type in optimized_params:
            # Combinar parámetros: los del config tienen prioridad
            final_params = {**optimized_params[model_type], **model_params}
        else:
            final_params = model_params
        
        # Entrenar modelo individual
        model = train_model(model_type, X_train, y_train, **final_params)
        estimators.append((model_name, model))
    
    # Estimador final por defecto (con regularización)
    if final_estimator is None:
        final_estimator = LogisticRegression(
            C=0.1,  # Mayor regularización
            max_iter=1000,
            class_weight='balanced',
            random_state=42
        )
    
    # Crear Stacking Classifier
    stacking_clf = StackingClassifier(
        estimators=estimators,
        final_estimator=final_estimator,
        cv=cv,
        n_jobs=-1
    )
    
    # Entrenar ensemble
    stacking_clf.fit(X_train, y_train)
    
    print(f"✅ Stacking Classifier creado con {len(estimators)} modelos")
    print(f"   Cross-validation: {cv} folds")
    print(f"   Estimador final: {type(final_estimator).__name__}")
    
    return stacking_clf


def compare_ensemble_vs_individual(
    ensemble_model: Any,
    individual_models: Dict[str, Any],
    X_train: np.ndarray,
    X_test: np.ndarray,
    y_train: pd.Series,
    y_test: pd.Series
) -> pd.DataFrame:
    """
    Comparar ensemble con modelos individuales.
    
    Args:
        ensemble_model: Modelo ensemble entrenado
        individual_models: Diccionario con modelos individuales {name: model}
        X_train: Matriz de características de entrenamiento
        X_test: Matriz de características de prueba
        y_train: Etiquetas de entrenamiento
        y_test: Etiquetas de prueba
        
    Returns:
        DataFrame con comparación
    """
    results = {}
    
    # Evaluar ensemble
    ensemble_results = evaluate_model(
        ensemble_model, X_train, X_test, y_train, y_test, verbose=False
    )
    results['Ensemble'] = ensemble_results
    
    # Evaluar modelos individuales
    for name, model in individual_models.items():
        model_results = evaluate_model(
            model, X_train, X_test, y_train, y_test, verbose=False
        )
        results[name] = model_results
    
    # Crear DataFrame comparativo
    comparison_data = []
    for name, res in results.items():
        comparison_data.append({
            'Modelo': name,
            'F1 (test)': res['test_f1'],
            'F1 (train)': res['train_f1'],
            'Overfitting (%)': res['diff_f1'],
            'Accuracy (test)': res['test_accuracy'],
            'Precision (test)': res['test_precision'],
            'Recall (test)': res['test_recall']
        })
    
    df = pd.DataFrame(comparison_data)
    df = df.sort_values(by='F1 (test)', ascending=False)
    
    return df

