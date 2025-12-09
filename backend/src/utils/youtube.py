"""
Módulo para extraer y analizar comentarios de YouTube.

Este módulo permite extraer comentarios de videos de YouTube
y aplicar el modelo de detección de hate speech.
"""

import re
from typing import List, Dict, Optional, Any
from pathlib import Path
import pandas as pd
from tqdm import tqdm

try:
    from youtube_comment_downloader import YoutubeCommentDownloader
    YOUTUBE_DOWNLOADER_AVAILABLE = True
except ImportError:
    YOUTUBE_DOWNLOADER_AVAILABLE = False
    print("⚠️  youtube-comment-downloader no disponible. Instala con: pip install youtube-comment-downloader")


def extract_video_id(url: str) -> Optional[str]:
    """
    Extraer el ID del video de una URL de YouTube.
    
    Args:
        url: URL del video de YouTube
        
    Returns:
        ID del video o None si no se puede extraer
        
    Examples:
        >>> extract_video_id("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
        'dQw4w9WgXcQ'
        >>> extract_video_id("https://youtu.be/dQw4w9WgXcQ")
        'dQw4w9WgXcQ'
    """
    if not url:
        return None
    
    # Patrones comunes de URLs de YouTube
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})',
        r'youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    # Si la URL es solo el ID
    if re.match(r'^[a-zA-Z0-9_-]{11}$', url):
        return url
    
    return None


def extract_comments(video_url: str, max_comments: int = 100, sort_by: str = 'top') -> List[Dict[str, Any]]:
    """
    Extraer comentarios de un video de YouTube.
    
    Args:
        video_url: URL del video de YouTube o ID del video
        max_comments: Número máximo de comentarios a extraer (default: 100)
        sort_by: Orden de comentarios ('top', 'time', 'relevance')
        
    Returns:
        Lista de diccionarios con información de los comentarios
        
    Raises:
        ImportError: Si youtube-comment-downloader no está instalado
        ValueError: Si no se puede extraer el ID del video
    """
    # Asegurar que max_comments sea int
    try:
        max_comments = int(max_comments)
    except (ValueError, TypeError):
        max_comments = 100
    if not YOUTUBE_DOWNLOADER_AVAILABLE:
        raise ImportError(
            "youtube-comment-downloader no está instalado. "
            "Instala con: pip install youtube-comment-downloader"
        )
    
    # Extraer ID del video
    video_id = extract_video_id(video_url)
    if not video_id:
        raise ValueError(f"No se pudo extraer el ID del video de la URL: {video_url}")
    
    # Inicializar downloader
    downloader = YoutubeCommentDownloader()
    
    # Extraer comentarios
    comments = []
    try:
        for comment in downloader.get_comments_from_url(
            f"https://www.youtube.com/watch?v={video_id}",
            sort_by=sort_by
        ):
            if len(comments) >= max_comments:
                break
            
            # Convertir valores numéricos a int de forma segura
            votes = comment.get('votes', 0)
            reply_count = comment.get('reply_count', 0)
            
            # Convertir a int si es string o mantener como int
            try:
                likes = int(votes) if votes else 0
            except (ValueError, TypeError):
                likes = 0
            
            try:
                reply_count_int = int(reply_count) if reply_count else 0
            except (ValueError, TypeError):
                reply_count_int = 0
            
            comments.append({
                'comment_id': str(comment.get('comment_id', '')),
                'text': str(comment.get('text', '')),
                'author': str(comment.get('author', '')),
                'likes': likes,
                'time': str(comment.get('time', '')),
                'reply_count': reply_count_int
            })
    except Exception as e:
        raise RuntimeError(f"Error al extraer comentarios: {e}")
    
    return comments


def comments_to_dataframe(comments: List[Dict[str, Any]]) -> pd.DataFrame:
    """
    Convertir lista de comentarios a DataFrame.
    
    Args:
        comments: Lista de diccionarios con comentarios
        
    Returns:
        DataFrame con los comentarios
    """
    if not comments:
        return pd.DataFrame(columns=['comment_id', 'text', 'author', 'likes', 'time', 'reply_count'])
    
    return pd.DataFrame(comments)


def analyze_video_comments(
    video_url: str,
    predictor,
    max_comments: int = 100,
    sort_by: str = 'top'
) -> pd.DataFrame:
    """
    Extraer y analizar comentarios de un video de YouTube.
    
    Args:
        video_url: URL del video de YouTube
        predictor: Instancia de HateSpeechPredictor
        max_comments: Número máximo de comentarios a analizar
        sort_by: Orden de comentarios ('top', 'time', 'relevance')
        
    Returns:
        DataFrame con comentarios y predicciones
    """
    print(f"📥 Extrayendo comentarios de: {video_url}")
    comments = extract_comments(video_url, max_comments=max_comments, sort_by=sort_by)
    
    if not comments:
        print("⚠️  No se encontraron comentarios")
        return pd.DataFrame()
    
    print(f"✅ {len(comments)} comentarios extraídos")
    print("🔍 Analizando comentarios con el modelo...")
    
    # Convertir a DataFrame
    df = comments_to_dataframe(comments)
    
    # Aplicar predicciones
    predictions = []
    for text in tqdm(df['text'], desc="Prediciendo"):
        try:
            result = predictor.predict(text)
            predictions.append({
                'is_toxic': result['is_toxic'],
                'toxicity_label': result['toxicity_label'],
                'probability_toxic': result['probability_toxic'],
                'probability_not_toxic': result.get('probability_not_toxic', 1.0 - result['probability_toxic']),
                'confidence': result['confidence']
            })
        except Exception as e:
            print(f"⚠️  Error al predecir: {e}")
            predictions.append({
                'is_toxic': False,
                'toxicity_label': 'Not Toxic',
                'probability_toxic': 0.0,
                'confidence': 0.0
            })
    
    # Añadir predicciones al DataFrame
    predictions_df = pd.DataFrame(predictions)
    df = pd.concat([df, predictions_df], axis=1)
    
    # Estadísticas
    toxic_count = df['is_toxic'].sum()
    toxic_percentage = (toxic_count / len(df)) * 100 if len(df) > 0 else 0
    
    print(f"\n📊 Resultados del análisis:")
    print(f"   Total comentarios: {len(df)}")
    print(f"   Comentarios tóxicos: {toxic_count} ({toxic_percentage:.2f}%)")
    print(f"   Comentarios no tóxicos: {len(df) - toxic_count} ({100 - toxic_percentage:.2f}%)")
    
    return df


def save_analysis_results(df: pd.DataFrame, output_path: Path, video_id: str = None):
    """
    Guardar resultados del análisis en CSV.
    
    Args:
        df: DataFrame con comentarios y predicciones
        output_path: Ruta donde guardar el archivo
        video_id: ID del video (opcional, para el nombre del archivo)
    """
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    df.to_csv(output_path, index=False, encoding='utf-8')
    print(f"✅ Resultados guardados en: {output_path}")


if __name__ == "__main__":
    # Ejemplo de uso
    print("Ejemplo de uso del módulo de YouTube")
    print("=" * 50)
    
    # URL de ejemplo (reemplazar con una URL real)
    example_url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    
    try:
        video_id = extract_video_id(example_url)
        print(f"ID del video extraído: {video_id}")
    except Exception as e:
        print(f"Error: {e}")

