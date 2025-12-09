"""
Tests para el módulo de vectorización de texto.
"""
import pytest
import pandas as pd
import numpy as np
from pathlib import Path
import tempfile
import os
from src.features.vectorization import TextVectorizer, vectorize_data, split_train_test


class TestTextVectorizer:
    """Tests para la clase TextVectorizer."""
    
    def test_init_tfidf(self):
        """Test inicialización con TF-IDF."""
        vectorizer = TextVectorizer(method='tfidf')
        assert vectorizer.method == 'tfidf'
        assert vectorizer.vectorizer is not None
    
    def test_init_count(self):
        """Test inicialización con Count Vectorizer."""
        vectorizer = TextVectorizer(method='count')
        assert vectorizer.method == 'count'
        assert vectorizer.vectorizer is not None
    
    def test_init_invalid_method(self):
        """Test que método inválido lanza error."""
        with pytest.raises(ValueError):
            TextVectorizer(method='invalid')
    
    def test_fit_transform_tfidf(self, sample_texts):
        """Test fit_transform con TF-IDF."""
        # Usar min_df=1 para que funcione con pocos textos
        vectorizer = TextVectorizer(method='tfidf', max_features=100, min_df=1)
        texts = pd.Series(sample_texts)
        X = vectorizer.fit_transform(texts)
        assert isinstance(X, np.ndarray)
        assert X.shape[0] == len(sample_texts)
        assert X.shape[1] <= 100  # max_features
    
    def test_fit_transform_count(self, sample_texts):
        """Test fit_transform con Count Vectorizer."""
        # Usar min_df=1 para que funcione con pocos textos
        vectorizer = TextVectorizer(method='count', max_features=100, min_df=1)
        texts = pd.Series(sample_texts)
        X = vectorizer.fit_transform(texts)
        assert isinstance(X, np.ndarray)
        assert X.shape[0] == len(sample_texts)
        assert X.shape[1] <= 100
    
    def test_transform_after_fit(self, sample_texts):
        """Test transform después de fit."""
        vectorizer = TextVectorizer(method='tfidf', max_features=100, min_df=1)
        texts_train = pd.Series(sample_texts[:4])
        texts_test = pd.Series(sample_texts[4:])
        
        # Fit con train
        X_train = vectorizer.fit_transform(texts_train)
        
        # Transform con test
        X_test = vectorizer.transform(texts_test)
        
        assert X_test.shape[0] == len(texts_test)
        assert X_test.shape[1] == X_train.shape[1]  # Mismo número de features
    
    def test_get_feature_names(self, sample_texts):
        """Test obtener nombres de features."""
        vectorizer = TextVectorizer(method='tfidf', max_features=100, min_df=1)
        texts = pd.Series(sample_texts)
        vectorizer.fit_transform(texts)
        features = vectorizer.get_feature_names()
        assert isinstance(features, list)
        assert len(features) > 0
    
    def test_save_and_load(self, sample_texts):
        """Test guardar y cargar vectorizador."""
        vectorizer = TextVectorizer(method='tfidf', max_features=100, min_df=1)
        texts = pd.Series(sample_texts)
        vectorizer.fit_transform(texts)
        
        # Guardar
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pkl') as tmp:
            tmp_path = Path(tmp.name)
        
        try:
            vectorizer.save(tmp_path)
            assert tmp_path.exists()
            
            # Cargar
            loaded_vectorizer = TextVectorizer.load(tmp_path)
            assert loaded_vectorizer.method == 'tfidf'
            
            # Verificar que funciona igual
            X_original = vectorizer.transform(texts)
            X_loaded = loaded_vectorizer.transform(texts)
            np.testing.assert_array_almost_equal(X_original, X_loaded)
        finally:
            if tmp_path.exists():
                os.unlink(tmp_path)
    
    def test_handles_empty_strings(self):
        """Test que maneja strings vacíos."""
        vectorizer = TextVectorizer(method='tfidf', max_features=100)
        texts = pd.Series(["", "hello", "world", ""])
        X = vectorizer.fit_transform(texts)
        assert X.shape[0] == 4
    
    def test_handles_nan_values(self):
        """Test que maneja valores NaN."""
        vectorizer = TextVectorizer(method='tfidf', max_features=100)
        texts = pd.Series(["hello", np.nan, "world", None])
        X = vectorizer.fit_transform(texts)
        assert X.shape[0] == 4


class TestVectorizationFunctions:
    """Tests para funciones de vectorización."""
    
    def test_split_train_test(self, sample_dataframe):
        """Test división de datos."""
        # Necesitamos más datos para que funcione el split estratificado
        # Crear un dataframe más grande
        large_df = pd.concat([sample_dataframe] * 3, ignore_index=True)
        X_train, X_test, y_train, y_test = split_train_test(
            large_df,
            text_column='Text',
            label_column='Label',
            test_size=0.2,
            random_state=42
        )
        assert len(X_train) + len(X_test) == len(large_df)
        assert len(y_train) == len(X_train)
        assert len(y_test) == len(X_test)
        assert isinstance(X_train, pd.Series)
        assert isinstance(y_train, pd.Series)
    
    def test_vectorize_data_tfidf(self, sample_dataframe):
        """Test vectorize_data con TF-IDF."""
        # Crear un dataframe más grande
        large_df = pd.concat([sample_dataframe] * 3, ignore_index=True)
        X_train, X_test, y_train, y_test = split_train_test(
            large_df,
            text_column='Text',
            label_column='Label',
            test_size=0.2,
            random_state=42
        )
        
        with tempfile.TemporaryDirectory() as tmpdir:
            save_path = Path(tmpdir) / 'vectorizer.pkl'
            
            X_train_vec, X_test_vec, vectorizer = vectorize_data(
                X_train,
                X_test,
                method='tfidf',
                save_path=save_path,
                max_features=100,
                min_df=1  # Reducir min_df para que funcione con pocos datos
            )
            
            assert isinstance(X_train_vec, np.ndarray)
            assert isinstance(X_test_vec, np.ndarray)
            assert X_train_vec.shape[0] == len(X_train)
            assert X_test_vec.shape[0] == len(X_test)
            assert save_path.exists()

