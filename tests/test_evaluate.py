"""
Tests para el módulo de evaluación de modelos.
"""
import pytest
import numpy as np
import pandas as pd
from src.models.evaluate import (
    evaluate_model,
    compare_models,
    print_classification_report
)
from src.models.train import train_naive_bayes


class TestEvaluateModel:
    """Tests para evaluación de modelos."""
    
    def test_evaluate_model_returns_dict(self, sample_vectorized_data):
        """Test que evaluate_model retorna diccionario con métricas."""
        X_train, X_test, y_train, y_test = sample_vectorized_data
        model = train_naive_bayes(X_train, y_train)
        
        results = evaluate_model(
            model, X_train, X_test, y_train, y_test, verbose=False
        )
        
        assert isinstance(results, dict)
        assert 'test_accuracy' in results
        assert 'test_precision' in results
        assert 'test_recall' in results
        assert 'test_f1' in results
        assert 'train_f1' in results
        assert 'diff_f1' in results
    
    def test_evaluate_model_metrics_range(self, sample_vectorized_data):
        """Test que las métricas están en rango [0, 1]."""
        X_train, X_test, y_train, y_test = sample_vectorized_data
        model = train_naive_bayes(X_train, y_train)
        
        results = evaluate_model(
            model, X_train, X_test, y_train, y_test, verbose=False
        )
        
        assert 0 <= results['test_accuracy'] <= 1
        assert 0 <= results['test_precision'] <= 1
        assert 0 <= results['test_recall'] <= 1
        assert 0 <= results['test_f1'] <= 1
        assert 0 <= results['train_f1'] <= 1
    
    def test_evaluate_model_calculates_overfitting(self, sample_vectorized_data):
        """Test que calcula overfitting correctamente."""
        X_train, X_test, y_train, y_test = sample_vectorized_data
        model = train_naive_bayes(X_train, y_train)
        
        results = evaluate_model(
            model, X_train, X_test, y_train, y_test, verbose=False
        )
        
        # Overfitting = diferencia entre train_f1 y test_f1
        expected_overfitting = abs(results['train_f1'] - results['test_f1']) * 100
        assert abs(results['diff_f1'] - expected_overfitting) < 0.01


class TestCompareModels:
    """Tests para comparación de modelos."""
    
    def test_compare_models_returns_dataframe(self, sample_vectorized_data):
        """Test que compare_models retorna DataFrame."""
        X_train, X_test, y_train, y_test = sample_vectorized_data
        
        # Entrenar dos modelos
        model1 = train_naive_bayes(X_train, y_train)
        model2 = train_naive_bayes(X_train, y_train, alpha=0.5)
        
        results1 = evaluate_model(
            model1, X_train, X_test, y_train, y_test, verbose=False
        )
        results2 = evaluate_model(
            model2, X_train, X_test, y_train, y_test, verbose=False
        )
        
        results_dict = {
            'Naive Bayes (alpha=1.0)': results1,
            'Naive Bayes (alpha=0.5)': results2
        }
        
        comparison = compare_models(results_dict)
        
        assert isinstance(comparison, pd.DataFrame)
        assert len(comparison) == 2
        assert 'Modelo' in comparison.columns
        assert 'F1 (test)' in comparison.columns
    
    def test_compare_models_sorts_by_metric(self, sample_vectorized_data):
        """Test que compare_models ordena por métrica."""
        X_train, X_test, y_train, y_test = sample_vectorized_data
        
        model1 = train_naive_bayes(X_train, y_train)
        model2 = train_naive_bayes(X_train, y_train, alpha=0.5)
        
        results1 = evaluate_model(
            model1, X_train, X_test, y_train, y_test, verbose=False
        )
        results2 = evaluate_model(
            model2, X_train, X_test, y_train, y_test, verbose=False
        )
        
        results_dict = {
            'Model1': results1,
            'Model2': results2
        }
        
        comparison = compare_models(results_dict, metric='F1 (test)')
        
        # Debe estar ordenado descendente
        f1_scores = comparison['F1 (test)'].values
        assert all(f1_scores[i] >= f1_scores[i+1] for i in range(len(f1_scores)-1))


class TestPrintClassificationReport:
    """Tests para impresión de reportes."""
    
    def test_print_classification_report_runs(self, sample_vectorized_data):
        """Test que print_classification_report se ejecuta sin errores."""
        X_train, X_test, y_train, y_test = sample_vectorized_data
        model = train_naive_bayes(X_train, y_train)
        
        # No debe lanzar excepción
        print_classification_report(
            model, X_test, y_test
        )

