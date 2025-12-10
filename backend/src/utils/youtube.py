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
    # Asegurar que max_comments sea int y limitarlo
    try:
        max_comments = int(max_comments)
        # Limitar a un máximo razonable para evitar problemas con la librería
        max_comments = min(max_comments, 50)  # Reducir límite a 50
    except (ValueError, TypeError):
        max_comments = 20  # Default más conservador
    
    if not YOUTUBE_DOWNLOADER_AVAILABLE:
        raise ImportError(
            "youtube-comment-downloader no está instalado. "
            "Instala con: pip install youtube-comment-downloader"
        )
    
    # Extraer ID del video
    video_id = extract_video_id(video_url)
    if not video_id:
        raise ValueError(f"No se pudo extraer el ID del video de la URL: {video_url}")
    
    # Validar sort_by - SIEMPRE usar 'top' por defecto para evitar bugs
    # La librería tiene problemas con 'time' y 'relevance'
    valid_sort_options = ['top', 'time', 'relevance']
    if sort_by not in valid_sort_options:
        sort_by = 'top'
    sort_by = str(sort_by).lower()
    
    # Inicializar downloader
    downloader = YoutubeCommentDownloader()
    
    # Extraer comentarios
    comments = []
    comment_count = 0  # Contador explícito para evitar problemas de tipo
    
    try:
        # Construir URL completa
        full_url = f"https://www.youtube.com/watch?v={video_id}"
        
        # Intentar obtener comentarios - SIEMPRE empezar sin sort_by para evitar bugs
        # Si el usuario quiere otro orden, lo intentamos después
        comment_generator = None
        try:
            # Primero intentar sin sort_by (más estable)
            comment_generator = downloader.get_comments_from_url(full_url)
        except (TypeError, ValueError) as e:
            error_msg = str(e)
            if "'>=' not supported" in error_msg or "'<=' not supported" in error_msg:
                # Si falla sin sort_by, intentar con 'top' explícitamente
                try:
                    comment_generator = downloader.get_comments_from_url(full_url, sort_by='top')
                except:
                    raise RuntimeError(f"Error al extraer comentarios: {error_msg}")
            else:
                raise
        
        # Iterar sobre los comentarios con manejo de errores
        for comment in comment_generator:
            try:
                # Usar contador explícito en lugar de len() para evitar problemas
                if comment_count >= max_comments:
                    break
            
                # IMPORTANTE: La librería devuelve campos diferentes:
                # - 'cid' (no 'comment_id')
                # - 'votes' es STRING (no int)
                # - 'replies' es STRING (no 'reply_count')
                # - 'reply' es BOOLEAN (indica si es respuesta, no contador)
                
                # Extraer comment_id (usar 'cid')
                comment_id = comment.get('cid', '') or comment.get('comment_id', '')
                
                # Extraer texto
                text = comment.get('text', '').strip()
                if not text:
                    continue  # Saltar comentarios vacíos
                
                # Extraer votes (es STRING, puede tener comas/puntos)
                votes = comment.get('votes', '0')
                try:
                    if isinstance(votes, str):
                        # Limpiar formato: "1,234" -> 1234
                        votes_clean = votes.replace(',', '').replace('.', '').strip()
                        likes = int(votes_clean) if votes_clean else 0
                    elif votes is None:
                        likes = 0
                    else:
                        likes = int(votes)
                except (ValueError, TypeError, AttributeError):
                    likes = 0
                
                # Extraer replies (es STRING, puede tener comas/puntos)
                replies = comment.get('replies', '0') or comment.get('reply_count', '0')
                try:
                    if isinstance(replies, str):
                        # Limpiar formato: "1,234" -> 1234
                        replies_clean = replies.replace(',', '').replace('.', '').strip()
                        reply_count_int = int(replies_clean) if replies_clean else 0
                    elif replies is None:
                        reply_count_int = 0
                    else:
                        reply_count_int = int(replies)
                except (ValueError, TypeError, AttributeError):
                    reply_count_int = 0
                
                comments.append({
                    'comment_id': str(comment_id),
                    'text': str(text),
                    'author': str(comment.get('author', 'Unknown')),
                    'likes': likes,
                    'time': str(comment.get('time', '')),
                    'reply_count': reply_count_int
                })
                
                comment_count += 1
                
            except (TypeError, ValueError) as e:
                # Error al procesar un comentario individual - continuar con el siguiente
                error_msg = str(e)
                if "'>=' not supported" in error_msg or "'<=' not supported" in error_msg:
                    # Si es un error de tipo, puede ser un problema con este comentario específico
                    print(f"⚠️  Error procesando comentario {comment_count + 1}, saltando...")
                    continue
                else:
                    # Otro tipo de error - re-lanzar
                    raise
            
    except TypeError as e:
        # Error específico de comparación de tipos - puede ser un bug de la librería
        error_msg = str(e)
        if "'>=' not supported" in error_msg or "'<=' not supported" in error_msg or "'>' not supported" in error_msg or "'<' not supported" in error_msg:
            # Intentar sin sort_by primero
            if sort_by != 'top':
                print(f"⚠️  Error con sort_by='{sort_by}', intentando sin sort_by...")
                try:
                    return extract_comments(video_url, max_comments=max_comments, sort_by='top')
                except:
                    pass
            # Si eso no funciona, intentar con menos comentarios
            if max_comments > 10:
                print(f"⚠️  Error con {max_comments} comentarios, intentando con 10...")
                return extract_comments(video_url, max_comments=10, sort_by='top')
            raise RuntimeError(
                f"Error de tipo en la librería de YouTube. "
                f"Intenta con menos comentarios (máximo 10) o verifica la URL. Error: {error_msg}"
            )
        raise RuntimeError(f"Error al extraer comentarios: {e}")
    except Exception as e:
        error_msg = str(e).lower()
        
        # Mensajes de error más específicos y útiles
        if "disabled" in error_msg or "turned off" in error_msg:
            raise RuntimeError(
                "Los comentarios están deshabilitados en este video. "
                "Por favor, prueba con otro video de YouTube."
            )
        elif "private" in error_msg:
            raise RuntimeError(
                "El video es privado. Por favor, usa un video público."
            )
        elif "unavailable" in error_msg or "not found" in error_msg:
            raise RuntimeError(
                "El video no está disponible o no existe. "
                "Verifica la URL e intenta de nuevo."
            )
        elif "age-restricted" in error_msg:
            raise RuntimeError(
                "El video tiene restricción de edad. "
                "Prueba con otro video sin restricciones."
            )
        elif "'>=' not supported" in error_msg or "'<=' not supported" in error_msg or "'>' not supported" in error_msg or "'<' not supported" in error_msg:
            # Error de tipos - intentar con menos comentarios
            if max_comments > 10:
                print(f"⚠️  Error con {max_comments} comentarios, intentando con 10...")
                try:
                    return extract_comments(video_url, max_comments=10, sort_by='top')
                except:
                    pass
            raise RuntimeError(
                f"Error de tipo en la librería de YouTube. "
                f"Intenta con menos comentarios (máximo 10) o verifica la URL."
            )
        else:
            raise RuntimeError(
                f"Error al extraer comentarios. "
                f"Verifica que la URL sea correcta y el video tenga comentarios habilitados. "
                f"Detalles: {str(e)}"
            )
    
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
        
    Raises:
        RuntimeError: Si hay error al extraer comentarios
    """
    # Asegurar que max_comments sea int
    try:
        max_comments = int(max_comments)
    except (ValueError, TypeError):
        max_comments = 20  # Default más conservador
    
    print(f"📥 Extrayendo comentarios de: {video_url}")
    try:
    comments = extract_comments(video_url, max_comments=max_comments, sort_by=sort_by)
    except RuntimeError as e:
        # Re-lanzar RuntimeError para que el endpoint lo capture
        raise
    except Exception as e:
        # Cualquier otro error se convierte en RuntimeError
        error_msg = str(e)
        print(f"❌ Error inesperado al extraer comentarios: {error_msg}")
        raise RuntimeError(f"Error al extraer comentarios: {error_msg}")
    
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

