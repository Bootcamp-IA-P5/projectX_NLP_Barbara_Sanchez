"""
Módulo para gestión de base de datos de predicciones.
"""

from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Text, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, List
import os

Base = declarative_base()


class Prediction(Base):
    """Modelo de tabla para almacenar predicciones."""
    __tablename__ = 'predictions'
    
    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False, index=True)
    is_toxic = Column(Boolean, nullable=False, index=True)
    toxicity_label = Column(String(50), nullable=False)
    probability_toxic = Column(Float, nullable=False)
    probability_not_toxic = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    source = Column(String(100), nullable=True)  # 'api', 'youtube', 'batch', etc.
    video_id = Column(String(50), nullable=True, index=True)  # Si viene de YouTube


class DatabaseManager:
    """Gestor de base de datos para predicciones."""
    
    def __init__(self, db_path: Optional[Path] = None):
        """
        Inicializar gestor de base de datos.
        
        Args:
            db_path: Ruta al archivo de base de datos SQLite. 
                    Si None, usa 'data/predictions.db' en el proyecto.
        """
        if db_path is None:
            backend_root = Path(__file__).parent.parent.parent
            db_path = backend_root / 'data' / 'predictions.db'
        
        # Crear directorio si no existe
        db_path.parent.mkdir(parents=True, exist_ok=True)
        
        self.db_path = db_path
        self.engine = create_engine(
            f'sqlite:///{db_path}',
            connect_args={'check_same_thread': False}  # Para SQLite
        )
        
        # Crear tablas
        Base.metadata.create_all(bind=self.engine)
        
        # Crear sessionmaker
        self.SessionLocal = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=self.engine
        )
        
        print(f"✅ Base de datos inicializada: {db_path}")
    
    def get_session(self) -> Session:
        """Obtener sesión de base de datos."""
        return self.SessionLocal()
    
    def save_prediction(
        self,
        text: str,
        is_toxic: bool,
        toxicity_label: str,
        probability_toxic: float,
        probability_not_toxic: float,
        confidence: float,
        source: Optional[str] = None,
        video_id: Optional[str] = None
    ) -> int:
        """
        Guardar una predicción en la base de datos.
        
        Args:
            text: Texto analizado
            is_toxic: Si es tóxico o no
            toxicity_label: Etiqueta ("Toxic" o "Not Toxic")
            probability_toxic: Probabilidad de ser tóxico
            probability_not_toxic: Probabilidad de no ser tóxico
            confidence: Confianza de la predicción
            source: Origen de la predicción ('api', 'youtube', etc.)
            video_id: ID del video si viene de YouTube
            
        Returns:
            ID de la predicción guardada
        """
        session = self.get_session()
        try:
            prediction = Prediction(
                text=text,
                is_toxic=is_toxic,
                toxicity_label=toxicity_label,
                probability_toxic=probability_toxic,
                probability_not_toxic=probability_not_toxic,
                confidence=confidence,
                source=source,
                video_id=video_id,
                created_at=datetime.utcnow()
            )
            session.add(prediction)
            session.commit()
            session.refresh(prediction)
            return prediction.id
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()
    
    def save_batch_predictions(
        self,
        predictions: List[Dict],
        source: Optional[str] = None,
        video_id: Optional[str] = None
    ) -> List[int]:
        """
        Guardar múltiples predicciones en batch.
        
        Args:
            predictions: Lista de diccionarios con predicciones
            source: Origen de las predicciones
            video_id: ID del video si viene de YouTube
            
        Returns:
            Lista de IDs de predicciones guardadas
        """
        session = self.get_session()
        ids = []
        try:
            for pred in predictions:
                prediction = Prediction(
                    text=pred['text'],
                    is_toxic=pred['is_toxic'],
                    toxicity_label=pred['toxicity_label'],
                    probability_toxic=pred['probability_toxic'],
                    probability_not_toxic=pred['probability_not_toxic'],
                    confidence=pred['confidence'],
                    source=source,
                    video_id=video_id,
                    created_at=datetime.utcnow()
                )
                session.add(prediction)
                ids.append(prediction.id)
            session.commit()
            # Refrescar para obtener IDs
            for i, pred in enumerate(session.query(Prediction).filter(
                Prediction.id.in_(ids)
            ).all()):
                ids[i] = pred.id
            return ids
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()
    
    def get_predictions(
        self,
        limit: int = 100,
        offset: int = 0,
        is_toxic: Optional[bool] = None,
        source: Optional[str] = None,
        video_id: Optional[str] = None
    ) -> List[Dict]:
        """
        Obtener predicciones de la base de datos.
        
        Args:
            limit: Número máximo de resultados
            offset: Offset para paginación
            is_toxic: Filtrar por toxicidad
            source: Filtrar por origen
            video_id: Filtrar por video ID
            
        Returns:
            Lista de predicciones como diccionarios
        """
        session = self.get_session()
        try:
            query = session.query(Prediction)
            
            if is_toxic is not None:
                query = query.filter(Prediction.is_toxic == is_toxic)
            if source:
                query = query.filter(Prediction.source == source)
            if video_id:
                query = query.filter(Prediction.video_id == video_id)
            
            predictions = query.order_by(
                Prediction.created_at.desc()
            ).offset(offset).limit(limit).all()
            
            return [
                {
                    'id': p.id,
                    'text': p.text,
                    'is_toxic': p.is_toxic,
                    'toxicity_label': p.toxicity_label,
                    'probability_toxic': p.probability_toxic,
                    'probability_not_toxic': p.probability_not_toxic,
                    'confidence': p.confidence,
                    'source': p.source,
                    'video_id': p.video_id,
                    'created_at': p.created_at.isoformat()
                }
                for p in predictions
            ]
        finally:
            session.close()
    
    def get_statistics(self) -> Dict:
        """
        Obtener estadísticas de las predicciones.
        
        Returns:
            Diccionario con estadísticas
        """
        session = self.get_session()
        try:
            total = session.query(Prediction).count()
            toxic = session.query(Prediction).filter(
                Prediction.is_toxic == True
            ).count()
            not_toxic = total - toxic
            
            avg_confidence = session.query(
                func.avg(Prediction.confidence)
            ).scalar() or 0.0
            
            return {
                'total_predictions': total,
                'toxic_count': toxic,
                'not_toxic_count': not_toxic,
                'toxic_percentage': (toxic / total * 100) if total > 0 else 0,
                'not_toxic_percentage': (not_toxic / total * 100) if total > 0 else 0,
                'average_confidence': float(avg_confidence)
            }
        finally:
            session.close()
    
    def get_recent_statistics(self, limit: int = 100) -> Dict:
        """
        Obtener estadísticas de las predicciones más recientes.
        
        Args:
            limit: Número de predicciones recientes a considerar
            
        Returns:
            Diccionario con estadísticas recientes
        """
        session = self.get_session()
        try:
            # Obtener predicciones más recientes
            recent_predictions = session.query(Prediction).order_by(
                Prediction.created_at.desc()
            ).limit(limit).all()
            
            if not recent_predictions:
                return {
                    'total_predictions': 0,
                    'toxic_count': 0,
                    'not_toxic_count': 0,
                    'toxic_percentage': 0,
                    'not_toxic_percentage': 0,
                    'average_confidence': 0.0
                }
            
            total = len(recent_predictions)
            toxic = sum(1 for p in recent_predictions if p.is_toxic)
            not_toxic = total - toxic
            
            avg_confidence = sum(p.confidence for p in recent_predictions) / total if total > 0 else 0.0
            
            return {
                'total_predictions': total,
                'toxic_count': toxic,
                'not_toxic_count': not_toxic,
                'toxic_percentage': (toxic / total * 100) if total > 0 else 0,
                'not_toxic_percentage': (not_toxic / total * 100) if total > 0 else 0,
                'average_confidence': float(avg_confidence)
            }
        finally:
            session.close()


# Instancia global del gestor de BD
_db_manager: Optional[DatabaseManager] = None


def get_db_manager(db_path: Optional[Path] = None) -> DatabaseManager:
    """
    Obtener instancia global del gestor de BD.
    
    Args:
        db_path: Ruta al archivo de BD (solo se usa en primera llamada)
        
    Returns:
        Instancia de DatabaseManager
    """
    global _db_manager
    if _db_manager is None:
        _db_manager = DatabaseManager(db_path)
    return _db_manager

