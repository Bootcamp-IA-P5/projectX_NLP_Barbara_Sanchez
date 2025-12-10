"""
Módulo para data augmentation de texto.

Implementa técnicas de aumento de datos para expandir el dataset:
- Reemplazo por sinónimos (WordNet)
- Traducción y back-translation
- Paráfrasis
"""

import random
from typing import List, Optional
import pandas as pd
import numpy as np

try:
    from nltk.corpus import wordnet as wn
    from nltk.tokenize import word_tokenize
    NLTK_AVAILABLE = True
except ImportError:
    NLTK_AVAILABLE = False
    print("⚠️  NLTK no disponible. Algunas funciones de augmentation no funcionarán.")

try:
    from googletrans import Translator
    GOOGLETRANS_AVAILABLE = True
except ImportError:
    GOOGLETRANS_AVAILABLE = False
    print("⚠️  googletrans no disponible. Traducción no funcionará.")


class TextAugmenter:
    """
    Clase para aplicar técnicas de data augmentation a texto.
    """
    
    def __init__(self, use_translation: bool = True, use_synonyms: bool = True):
        """
        Inicializar augmenter.
        
        Args:
            use_translation: Si True, permite traducción (requiere googletrans)
            use_synonyms: Si True, permite reemplazo por sinónimos (requiere NLTK)
        """
        self.use_translation = use_translation and GOOGLETRANS_AVAILABLE
        self.use_synonyms = use_synonyms and NLTK_AVAILABLE
        
        if self.use_translation:
            try:
                self.translator = Translator()
            except Exception as e:
                print(f"⚠️  Error inicializando translator: {e}")
                self.use_translation = False
        
        if not NLTK_AVAILABLE:
            print("⚠️  NLTK no disponible. Descarga con: python -c \"import nltk; nltk.download('wordnet'); nltk.download('omw-1.4')\"")
    
    def get_synonyms(self, word: str, max_synonyms: int = 3) -> List[str]:
        """
        Obtener sinónimos de una palabra usando WordNet.
        
        Args:
            word: Palabra a buscar sinónimos
            max_synonyms: Máximo número de sinónimos a retornar
            
        Returns:
            Lista de sinónimos
        """
        if not self.use_synonyms:
            return []
        
        synonyms = set()
        for syn in wn.synsets(word):
            for lemma in syn.lemmas():
                synonym = lemma.name().replace('_', ' ').lower()
                if synonym != word.lower() and len(synonym.split()) == 1:
                    synonyms.add(synonym)
        
        return list(synonyms)[:max_synonyms]
    
    def replace_with_synonyms(self, text: str, replacement_ratio: float = 0.3) -> str:
        """
        Reemplazar palabras por sinónimos aleatoriamente.
        
        Args:
            text: Texto original
            replacement_ratio: Proporción de palabras a reemplazar (0.0-1.0)
            
        Returns:
            Texto con palabras reemplazadas por sinónimos
        """
        if not self.use_synonyms:
            return text
        
        words = word_tokenize(text.lower())
        num_replacements = max(1, int(len(words) * replacement_ratio))
        
        # Seleccionar palabras aleatorias para reemplazar
        words_to_replace = random.sample(
            [i for i, w in enumerate(words) if w.isalpha() and len(w) > 3],
            min(num_replacements, len([w for w in words if w.isalpha() and len(w) > 3]))
        )
        
        augmented_words = words.copy()
        for idx in words_to_replace:
            word = words[idx]
            synonyms = self.get_synonyms(word, max_synonyms=1)
            if synonyms:
                augmented_words[idx] = random.choice(synonyms)
        
        return ' '.join(augmented_words)
    
    def translate_and_back(self, text: str, intermediate_lang: str = 'es') -> Optional[str]:
        """
        Traducir texto a otro idioma y volver (back-translation).
        
        Args:
            text: Texto original en inglés
            intermediate_lang: Idioma intermedio ('es', 'fr', 'de', etc.)
            
        Returns:
            Texto traducido y vuelto, o None si falla
        """
        if not self.use_translation:
            return None
        
        try:
            # Traducir a idioma intermedio
            translated = self.translator.translate(text, src='en', dest=intermediate_lang)
            if not translated or not translated.text:
                return None
            
            # Traducir de vuelta a inglés
            back_translated = self.translator.translate(translated.text, src=intermediate_lang, dest='en')
            if not back_translated or not back_translated.text:
                return None
            
            return back_translated.text
        except Exception as e:
            print(f"⚠️  Error en traducción: {e}")
            return None
    
    def augment_text(self, text: str, method: str = 'synonyms') -> Optional[str]:
        """
        Aplicar una técnica de augmentation a un texto.
        
        Args:
            text: Texto original
            method: Método a usar ('synonyms', 'translation', 'both')
            
        Returns:
            Texto aumentado o None si falla
        """
        if method == 'synonyms':
            return self.replace_with_synonyms(text)
        elif method == 'translation':
            # Usar español como idioma intermedio
            return self.translate_and_back(text, intermediate_lang='es')
        elif method == 'both':
            # Primero sinónimos, luego traducción
            augmented = self.replace_with_synonyms(text)
            if augmented:
                return self.translate_and_back(augmented, intermediate_lang='es')
            return None
        else:
            return None
    
    def augment_dataframe(self, df: pd.DataFrame, text_column: str, label_column: str,
                         augmentation_factor: float = 1.0, methods: List[str] = None) -> pd.DataFrame:
        """
        Aumentar un DataFrame completo.
        
        Args:
            df: DataFrame original
            text_column: Nombre de la columna con texto
            label_column: Nombre de la columna con etiquetas
            augmentation_factor: Factor de aumento (1.0 = duplicar, 2.0 = triplicar)
            methods: Lista de métodos a usar ['synonyms', 'translation', 'both']
            
        Returns:
            DataFrame aumentado
        """
        if methods is None:
            methods = ['synonyms'] if self.use_synonyms else []
            if self.use_translation:
                methods.append('translation')
        
        if not methods:
            print("⚠️  No hay métodos de augmentation disponibles")
            return df.copy()
        
        augmented_rows = []
        num_augmentations = int(len(df) * augmentation_factor)
        
        print(f"🔄 Aumentando dataset: {len(df)} → {len(df) + num_augmentations} ejemplos")
        print(f"   Métodos: {methods}")
        
        for _ in range(num_augmentations):
            # Seleccionar fila aleatoria
            idx = random.randint(0, len(df) - 1)
            row = df.iloc[idx]
            
            # Seleccionar método aleatorio
            method = random.choice(methods)
            
            # Aumentar texto
            augmented_text = self.augment_text(row[text_column], method=method)
            
            if augmented_text and augmented_text != row[text_column]:
                new_row = row.copy()
                new_row[text_column] = augmented_text
                # Marcar como aumentado
                new_row['_augmented'] = True
                new_row['_augmentation_method'] = method
                augmented_rows.append(new_row)
        
        # Combinar original con aumentado
        original_df = df.copy()
        original_df['_augmented'] = False
        original_df['_augmentation_method'] = None
        
        if augmented_rows:
            augmented_df = pd.DataFrame(augmented_rows)
            result = pd.concat([original_df, augmented_df], ignore_index=True)
        else:
            result = original_df
        
        print(f"✅ Dataset aumentado: {len(result)} ejemplos totales")
        print(f"   Originales: {len(original_df)}")
        print(f"   Aumentados: {len(result) - len(original_df)}")
        
        return result

