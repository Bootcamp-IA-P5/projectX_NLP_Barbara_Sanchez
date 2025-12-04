"""
Módulo para evaluar modelos de Machine Learning.

Este módulo contiene funciones para evaluar el rendimiento
de modelos de clasificación de texto.
"""

from typing import Dict, Tuple
import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)


def evaluate_model(
    model: Any,
    X_train: np.ndarray,
    X_test: np.ndarray,
    y_train: pd.Series,
    y_test: pd.Series,
    verbose: bool = True
) -> Dict[str, float]:
    """
    Evaluar modelo en train y test.
    
    Args:
        model: Modelo entrenado
        X_train: Matriz de características de entrenamiento
        X_test: Matriz de características de prueba
        y_train: Etiquetas de entrenamiento
        y_test: Etiquetas de prueba
        verbose: Si True, imprime resultados (default: True)
        
    Returns:
        Diccionario con métricas
    """
    # Predicciones en train
    y_train_pred = model.predict(X_train)
    
    # Predicciones en test
    y_test_pred = model.predict(X_test)
    
    # Calcular métricas en train
    train_accuracy = accuracy_score(y_train, y_train_pred)
    train_precision = precision_score(y_train, y_train_pred, zero_division=0)
    train_recall = recall_score(y_train, y_train_pred, zero_division=0)
    train_f1 = f1_score(y_train, y_train_pred, zero_division=0)
    
    # Calcular métricas en test
    test_accuracy = accuracy_score(y_test, y_test_pred)
    test_precision = precision_score(y_test, y_test_pred, zero_division=0)
    test_recall = recall_score(y_test, y_test_pred, zero_division=0)
    test_f1 = f1_score(y_test, y_test_pred, zero_division=0)
    
    # Calcular overfitting (diferencia F1)
    diff_f1 = abs(train_f1 - test_f1) * 100
    
    # Matriz de confusión
    cm_test = confusion_matrix(y_test, y_test_pred)
    
    results = {
        'train_accuracy': train_accuracy,
        'train_precision': train_precision,
        'train_recall': train_recall,
        'train_f1': train_f1,
        'test_accuracy': test_accuracy,
        'test_precision': test_precision,
        'test_recall': test_recall,
        'test_f1': test_f1,
        'diff_f1': diff_f1,
        'confusion_matrix': cm_test
    }
    
    if verbose:
        print("="*80)
        print("RESULTADOS DE EVALUACIÓN")
        print("="*80)
        print(f"\n📊 MÉTRICAS EN TRAIN:")
        print(f"   Accuracy:  {train_accuracy:.4f}")
        print(f"   Precision: {train_precision:.4f}")
        print(f"   Recall:    {train_recall:.4f}")
        print(f"   F1-score:  {train_f1:.4f}")
        
        print(f"\n📊 MÉTRICAS EN TEST:")
        print(f"   Accuracy:  {test_accuracy:.4f}")
        print(f"   Precision: {test_precision:.4f}")
        print(f"   Recall:    {test_recall:.4f}")
        print(f"   F1-score:  {test_f1:.4f}")
        
        print(f"\n⚠️  OVERFITTING:")
        print(f"   Diferencia F1 (train-test): {diff_f1:.2f}%")
        if diff_f1 < 5.0:
            print(f"   ✅ Overfitting controlado (<5%)")
        elif diff_f1 < 10.0:
            print(f"   ⚠️  Overfitting moderado (5-10%)")
        else:
            print(f"   ❌ Overfitting alto (>10%)")
        
        print(f"\n📋 Matriz de confusión (test):")
        print(cm_test)
    
    return results


def compare_models(
    results_dict: Dict[str, Dict[str, float]],
    metric: str = 'test_f1'
) -> pd.DataFrame:
    """
    Comparar resultados de múltiples modelos.
    
    Args:
        results_dict: Diccionario con resultados de modelos
                     {model_name: {metrics_dict}}
        metric: Métrica principal para comparar (default: 'test_f1')
        
    Returns:
        DataFrame con comparación
    """
    comparison_data = []
    
    for model_name, results in results_dict.items():
        comparison_data.append({
            'Modelo': model_name,
            'F1 (test)': results['test_f1'],
            'F1 (train)': results['train_f1'],
            'Overfitting (%)': results['diff_f1'],
            'Accuracy (test)': results['test_accuracy'],
            'Precision (test)': results['test_precision'],
            'Recall (test)': results['test_recall']
        })
    
    df = pd.DataFrame(comparison_data)
    df = df.sort_values(by=metric, ascending=False)
    
    return df


def print_classification_report(
    model: Any,
    X_test: np.ndarray,
    y_test: pd.Series
):
    """
    Imprimir reporte de clasificación detallado.
    
    Args:
        model: Modelo entrenado
        X_test: Matriz de características de prueba
        y_test: Etiquetas de prueba
    """
    y_pred = model.predict(X_test)
    report = classification_report(y_test, y_pred, zero_division=0)
    print("="*80)
    print("REPORTE DE CLASIFICACIÓN")
    print("="*80)
    print(report)

