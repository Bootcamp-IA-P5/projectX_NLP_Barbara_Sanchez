"""
Pipeline de preprocesamiento de texto para detección de hate speech.

Este módulo contiene funciones para limpiar, normalizar y procesar texto
usando técnicas clásicas de NLP (spaCy, NLTK).
"""

import re
import string
from typing import List, Optional
import pandas as pd
import numpy as np

try:
    import spacy
    from spacy.lang.en.stop_words import STOP_WORDS
    SPACY_AVAILABLE = True
except ImportError:
    SPACY_AVAILABLE = False
    print("⚠️  spaCy no disponible. Usando NLTK como alternativa.")

try:
    import nltk
    from nltk.corpus import stopwords
    from nltk.tokenize import word_tokenize
    from nltk.stem import WordNetLemmatizer
    NLTK_AVAILABLE = True
except ImportError:
    NLTK_AVAILABLE = False
    print("⚠️  NLTK no disponible. Algunas funciones pueden no funcionar.")


class TextPreprocessor:
    """
    Clase para preprocesamiento de texto con pipeline completo.
    
    Pipeline:
    1. Limpieza básica (URLs, emails, caracteres especiales)
    2. Normalización (contracciones, repeticiones)
    3. Tokenización
    4. Eliminación de stopwords
    5. Lematización
    """
    
    def __init__(self, use_spacy: bool = True, language: str = 'en'):
        """
        Inicializar preprocesador.
        
        Args:
            use_spacy: Si True, usa spaCy (más rápido y preciso). Si False, usa NLTK.
            language: Idioma del texto ('en' para inglés).
        """
        self.use_spacy = use_spacy and SPACY_AVAILABLE
        self.language = language
        
        if self.use_spacy:
            try:
                self.nlp = spacy.load('en_core_web_sm')
                print("✅ spaCy cargado: en_core_web_sm")
            except OSError:
                print("⚠️  Modelo spaCy no encontrado. Descarga con: python -m spacy download en_core_web_sm")
                print("   Usando NLTK como alternativa.")
                self.use_spacy = False
                self._init_nltk()
        else:
            self._init_nltk()
        
        # Diccionario de contracciones comunes
        self.contractions = {
            "don't": "do not",
            "won't": "will not",
            "can't": "cannot",
            "n't": " not",
            "'re": " are",
            "'ve": " have",
            "'ll": " will",
            "'d": " would",
            "'m": " am",
            "it's": "it is",
            "that's": "that is",
            "what's": "what is",
            "who's": "who is",
            "where's": "where is",
            "there's": "there is",
            "here's": "here is",
            "let's": "let us",
            "i'm": "i am",
            "you're": "you are",
            "he's": "he is",
            "she's": "she is",
            "we're": "we are",
            "they're": "they are",
            "i've": "i have",
            "you've": "you have",
            "we've": "we have",
            "they've": "they have",
            "i'll": "i will",
            "you'll": "you will",
            "he'll": "he will",
            "she'll": "she will",
            "we'll": "we will",
            "they'll": "they will"
        }
    
    def _init_nltk(self):
        """Inicializar componentes de NLTK."""
        if not NLTK_AVAILABLE:
            raise ImportError("NLTK no está disponible. Instala con: pip install nltk")
        
        try:
            self.stop_words = set(stopwords.words('english'))
            self.lemmatizer = WordNetLemmatizer()
            print("✅ NLTK inicializado")
        except LookupError:
            print("⚠️  Descargando datos de NLTK...")
            nltk.download('punkt', quiet=True)
            nltk.download('stopwords', quiet=True)
            nltk.download('wordnet', quiet=True)
            nltk.download('omw-1.4', quiet=True)
            self.stop_words = set(stopwords.words('english'))
            self.lemmatizer = WordNetLemmatizer()
            print("✅ NLTK inicializado")
    
    def clean_text(self, text: str) -> str:
        """
        Limpieza básica del texto.
        
        - Elimina URLs
        - Elimina emails
        - Elimina caracteres especiales innecesarios
        - Normaliza espacios en blanco
        """
        if pd.isna(text) or not isinstance(text, str):
            return ""
        
        text = str(text).lower().strip()
        
        # Eliminar URLs
        text = re.sub(r'http\S+|www\.\S+', '', text)
        
        # Eliminar emails
        text = re.sub(r'\S+@\S+', '', text)
        
        # Eliminar menciones de usuario (ej: @username)
        text = re.sub(r'@\w+', '', text)
        
        # Eliminar hashtags pero mantener el texto
        text = re.sub(r'#(\w+)', r'\1', text)
        
        # Eliminar caracteres especiales excepto letras, números y espacios
        text = re.sub(r'[^a-z0-9\s]', ' ', text)
        
        # Normalizar espacios en blanco múltiples
        text = re.sub(r'\s+', ' ', text)
        
        return text.strip()
    
    def expand_contractions(self, text: str) -> str:
        """
        Expandir contracciones comunes.
        
        Ejemplo: "don't" -> "do not"
        """
        for contraction, expansion in self.contractions.items():
            text = text.replace(contraction, expansion)
        return text
    
    def remove_repetitions(self, text: str) -> str:
        """
        Eliminar repeticiones excesivas de caracteres.
        
        Ejemplo: "sooo goood" -> "so good"
        """
        # Eliminar repeticiones de más de 2 caracteres consecutivos
        text = re.sub(r'(.)\1{2,}', r'\1\1', text)
        return text
    
    def preprocess_text(self, text: str, remove_stopwords: bool = True) -> str:
        """
        Pipeline completo de preprocesamiento para un texto.
        
        Args:
            text: Texto a preprocesar
            remove_stopwords: Si True, elimina stopwords
            
        Returns:
            Texto preprocesado
        """
        # 1. Limpieza básica
        text = self.clean_text(text)
        
        if not text:
            return ""
        
        # 2. Expandir contracciones
        text = self.expand_contractions(text)
        
        # 3. Eliminar repeticiones
        text = self.remove_repetitions(text)
        
        # 4. Tokenización, eliminación de stopwords y lematización
        if self.use_spacy:
            doc = self.nlp(text)
            tokens = []
            for token in doc:
                # Filtrar stopwords, puntuación y espacios
                if remove_stopwords and token.is_stop:
                    continue
                if token.is_punct or token.is_space:
                    continue
                # Lematizar
                lemma = token.lemma_.lower().strip()
                if lemma:
                    tokens.append(lemma)
            return ' '.join(tokens)
        else:
            # Usar NLTK
            tokens = word_tokenize(text)
            tokens = [
                self.lemmatizer.lemmatize(token.lower())
                for token in tokens
                if token.lower() not in self.stop_words or not remove_stopwords
                if token.isalnum()  # Solo letras y números
            ]
            return ' '.join(tokens)
    
    def preprocess_dataframe(self, df: pd.DataFrame, text_column: str, 
                           output_column: str = 'Text_processed',
                           remove_stopwords: bool = True,
                           show_progress: bool = True) -> pd.DataFrame:
        """
        Preprocesar una columna de texto en un DataFrame.
        
        Args:
            df: DataFrame con los datos
            text_column: Nombre de la columna con el texto
            output_column: Nombre de la columna de salida
            remove_stopwords: Si True, elimina stopwords
            show_progress: Si True, muestra barra de progreso
            
        Returns:
            DataFrame con columna adicional preprocesada
        """
        df = df.copy()
        
        if show_progress:
            from tqdm import tqdm
            tqdm.pandas(desc="Preprocesando texto")
            df[output_column] = df[text_column].progress_apply(
                lambda x: self.preprocess_text(x, remove_stopwords=remove_stopwords)
            )
        else:
            df[output_column] = df[text_column].apply(
                lambda x: self.preprocess_text(x, remove_stopwords=remove_stopwords)
            )
        
        return df


def preprocess_text_simple(text: str, remove_stopwords: bool = True) -> str:
    """
    Función simple de preprocesamiento (wrapper rápido).
    
    Args:
        text: Texto a preprocesar
        remove_stopwords: Si True, elimina stopwords
        
    Returns:
        Texto preprocesado
    """
    preprocessor = TextPreprocessor()
    return preprocessor.preprocess_text(text, remove_stopwords=remove_stopwords)


if __name__ == "__main__":
    # Ejemplo de uso
    preprocessor = TextPreprocessor()
    
    sample_texts = [
        "I don't like this video!!! It's sooo bad :(",
        "Check out https://example.com for more info!",
        "This is AMAZING!!! I love it so much!!!"
    ]
    
    print("Ejemplos de preprocesamiento:\n")
    for text in sample_texts:
        processed = preprocessor.preprocess_text(text)
        print(f"Original:  {text}")
        print(f"Procesado: {processed}\n")

