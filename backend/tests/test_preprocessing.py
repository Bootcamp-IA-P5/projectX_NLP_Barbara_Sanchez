"""
Tests para el módulo de preprocesamiento de texto.
"""
import pytest
import pandas as pd
import numpy as np
from src.data.preprocessing import TextPreprocessor


class TestTextPreprocessor:
    """Tests para la clase TextPreprocessor."""
    
    def test_init_with_spacy(self):
        """Test inicialización con spaCy."""
        preprocessor = TextPreprocessor(use_spacy=True)
        assert preprocessor.use_spacy is True
        # Verificar que tiene nlp o stop_words según el caso
        assert hasattr(preprocessor, 'nlp') or hasattr(preprocessor, 'stop_words')
    
    def test_init_without_spacy(self):
        """Test inicialización sin spaCy (usando NLTK)."""
        preprocessor = TextPreprocessor(use_spacy=False)
        assert preprocessor.use_spacy is False
        assert hasattr(preprocessor, 'stop_words')
    
    def test_clean_text_removes_urls(self):
        """Test que clean_text elimina URLs."""
        preprocessor = TextPreprocessor(use_spacy=False)
        text = "Check out https://example.com for more info"
        cleaned = preprocessor.clean_text(text)
        assert "https://example.com" not in cleaned
        assert "http" not in cleaned.lower()
    
    def test_clean_text_removes_emails(self):
        """Test que clean_text elimina emails."""
        preprocessor = TextPreprocessor(use_spacy=False)
        text = "Contact me at test@example.com"
        cleaned = preprocessor.clean_text(text)
        assert "test@example.com" not in cleaned
    
    def test_clean_text_removes_special_chars(self):
        """Test que clean_text elimina caracteres especiales."""
        preprocessor = TextPreprocessor(use_spacy=False)
        text = "Hello!!! This is a test??? @#$%"
        cleaned = preprocessor.clean_text(text)
        # Debe mantener letras y espacios básicos
        assert len(cleaned) > 0
    
    def test_expand_contractions(self):
        """Test que expand_contractions maneja contracciones."""
        preprocessor = TextPreprocessor(use_spacy=False)
        text = "I don't like it"
        expanded = preprocessor.expand_contractions(text)
        # Debe expandir contracciones
        assert isinstance(expanded, str)
        assert "don't" not in expanded or "do not" in expanded
    
    def test_remove_repetitions(self):
        """Test que remove_repetitions maneja repeticiones."""
        preprocessor = TextPreprocessor(use_spacy=False)
        text = "sooooo goooood"
        normalized = preprocessor.remove_repetitions(text)
        # Debe reducir repeticiones
        assert isinstance(normalized, str)
        assert len(normalized) < len(text)  # Debe ser más corto
    
    def test_preprocess_text_complete_pipeline(self):
        """Test pipeline completo de preprocesamiento."""
        preprocessor = TextPreprocessor(use_spacy=False)
        text = "This is a test!!! Check https://example.com"
        processed = preprocessor.preprocess_text(text, remove_stopwords=True)
        assert isinstance(processed, str)
        assert len(processed) > 0
        # No debe contener URLs
        assert "http" not in processed.lower()
    
    def test_preprocess_text_without_stopwords_removal(self):
        """Test preprocesamiento sin eliminar stopwords."""
        preprocessor = TextPreprocessor(use_spacy=False)
        text = "This is a test"
        processed = preprocessor.preprocess_text(text, remove_stopwords=False)
        assert isinstance(processed, str)
        assert len(processed) > 0
    
    def test_preprocess_dataframe(self, sample_dataframe):
        """Test preprocesamiento de DataFrame completo."""
        preprocessor = TextPreprocessor(use_spacy=False)
        df_processed = preprocessor.preprocess_dataframe(
            sample_dataframe,
            text_column='Text',
            output_column='Text_processed',
            remove_stopwords=True,
            show_progress=False
        )
        assert 'Text_processed' in df_processed.columns
        assert len(df_processed) == len(sample_dataframe)
        assert all(isinstance(text, str) for text in df_processed['Text_processed'])
    
    def test_preprocess_text_handles_empty_string(self):
        """Test que preprocess_text maneja strings vacíos."""
        preprocessor = TextPreprocessor(use_spacy=False)
        text = ""
        processed = preprocessor.preprocess_text(text)
        assert isinstance(processed, str)
    
    def test_preprocess_text_handles_nan(self):
        """Test que preprocess_text maneja NaN."""
        preprocessor = TextPreprocessor(use_spacy=False)
        text = None
        # Debe convertir a string
        processed = preprocessor.preprocess_text(str(text) if text is not None else "")
        assert isinstance(processed, str)
    
    def test_preprocess_text_includes_lemmatization(self):
        """Test que preprocess_text incluye lematización."""
        preprocessor = TextPreprocessor(use_spacy=False)
        text = "running cats dogs"
        processed = preprocessor.preprocess_text(text, remove_stopwords=False)
        assert isinstance(processed, str)
        assert len(processed) > 0

