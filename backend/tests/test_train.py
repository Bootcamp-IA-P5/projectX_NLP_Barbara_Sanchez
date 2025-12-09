"""
Tests para el módulo de entrenamiento de modelos.
"""
import pytest
import numpy as np
import pandas as pd
from pathlib import Path
import tempfile
import os
from src.models.train import (
    train_naive_bayes,
    train_logistic_regression,
    train_svm,
    train_random_forest,
    train_model,
    save_model,
    load_model
)


class TestTrainFunctions:
    """Tests para funciones de entrenamiento."""
    
    def test_train_naive_bayes(self, sample_vectorized_data):
        """Test entrenamiento de Naive Bayes."""
        X_train, _, y_train, _ = sample_vectorized_data
        model = train_naive_bayes(X_train, y_train, alpha=1.0)
        assert model is not None
        assert hasattr(model, 'predict')
        # Verificar que puede predecir
        predictions = model.predict(X_train[:5])
        assert len(predictions) == 5
    
    def test_train_logistic_regression(self, sample_vectorized_data):
        """Test entrenamiento de Regresión Logística."""
        X_train, _, y_train, _ = sample_vectorized_data
        model = train_logistic_regression(
            X_train, y_train, C=1.0, penalty='l2'
        )
        assert model is not None
        assert hasattr(model, 'predict')
        predictions = model.predict(X_train[:5])
        assert len(predictions) == 5
    
    def test_train_svm(self, sample_vectorized_data):
        """Test entrenamiento de SVM."""
        X_train, _, y_train, _ = sample_vectorized_data
        model = train_svm(X_train, y_train, C=1.0, kernel='linear')
        assert model is not None
        assert hasattr(model, 'predict')
        predictions = model.predict(X_train[:5])
        assert len(predictions) == 5
    
    def test_train_random_forest(self, sample_vectorized_data):
        """Test entrenamiento de Random Forest."""
        X_train, _, y_train, _ = sample_vectorized_data
        model = train_random_forest(
            X_train, y_train, n_estimators=10, max_depth=5
        )
        assert model is not None
        assert hasattr(model, 'predict')
        predictions = model.predict(X_train[:5])
        assert len(predictions) == 5
    
    def test_train_model_naive_bayes(self, sample_vectorized_data):
        """Test función genérica train_model con Naive Bayes."""
        X_train, _, y_train, _ = sample_vectorized_data
        model = train_model(
            'naive_bayes', X_train, y_train, alpha=1.0
        )
        assert model is not None
        assert hasattr(model, 'predict')
    
    def test_train_model_logistic(self, sample_vectorized_data):
        """Test función genérica train_model con Logistic Regression."""
        X_train, _, y_train, _ = sample_vectorized_data
        model = train_model(
            'logistic', X_train, y_train, C=1.0
        )
        assert model is not None
        assert hasattr(model, 'predict')
    
    def test_train_model_svm(self, sample_vectorized_data):
        """Test función genérica train_model con SVM."""
        X_train, _, y_train, _ = sample_vectorized_data
        model = train_model(
            'svm', X_train, y_train, C=1.0, kernel='linear'
        )
        assert model is not None
        assert hasattr(model, 'predict')
    
    def test_train_model_random_forest(self, sample_vectorized_data):
        """Test función genérica train_model con Random Forest."""
        X_train, _, y_train, _ = sample_vectorized_data
        model = train_model(
            'random_forest', X_train, y_train, n_estimators=10
        )
        assert model is not None
        assert hasattr(model, 'predict')
    
    def test_train_model_invalid_type(self, sample_vectorized_data):
        """Test que tipo de modelo inválido lanza error."""
        X_train, _, y_train, _ = sample_vectorized_data
        with pytest.raises(ValueError):
            train_model('invalid', X_train, y_train)
    
    def test_save_and_load_model(self, sample_vectorized_data):
        """Test guardar y cargar modelo."""
        X_train, _, y_train, _ = sample_vectorized_data
        model = train_naive_bayes(X_train, y_train)
        
        # Guardar
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pkl') as tmp:
            tmp_path = Path(tmp.name)
        
        try:
            save_model(model, tmp_path, {'test': 'info'})
            assert tmp_path.exists()
            
            # Cargar
            loaded_model = load_model(tmp_path)
            assert loaded_model is not None
            
            # Verificar que funciona igual
            predictions_original = model.predict(X_train[:5])
            predictions_loaded = loaded_model.predict(X_train[:5])
            np.testing.assert_array_equal(predictions_original, predictions_loaded)
        finally:
            if tmp_path.exists():
                os.unlink(tmp_path)

