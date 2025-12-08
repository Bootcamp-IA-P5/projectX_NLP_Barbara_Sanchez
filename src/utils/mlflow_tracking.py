"""
Módulo para tracking de experimentos con MLFlow.
"""

import mlflow
import mlflow.sklearn
from pathlib import Path
from typing import Dict, Optional, Any
import os


class MLFlowTracker:
    """Gestor de tracking con MLFlow."""
    
    def __init__(
        self,
        experiment_name: str = "hate_speech_detection",
        tracking_uri: Optional[str] = None
    ):
        """
        Inicializar tracker de MLFlow.
        
        Args:
            experiment_name: Nombre del experimento
            tracking_uri: URI del servidor de MLFlow (None = local)
        """
        if tracking_uri:
            mlflow.set_tracking_uri(tracking_uri)
        else:
            # Usar directorio local por defecto
            project_root = Path(__file__).parent.parent.parent
            mlruns_path = project_root / 'mlruns'
            mlruns_path.mkdir(parents=True, exist_ok=True)
            mlflow.set_tracking_uri(f"file://{mlruns_path.absolute()}")
        
        # Crear o obtener experimento
        try:
            experiment = mlflow.get_experiment_by_name(experiment_name)
            if experiment is None:
                experiment_id = mlflow.create_experiment(experiment_name)
            else:
                experiment_id = experiment.experiment_id
        except Exception:
            # Si falla, usar experimento por defecto
            experiment_id = "0"
        
        mlflow.set_experiment(experiment_name)
        self.experiment_name = experiment_name
        self.experiment_id = experiment_id
        
        print(f"✅ MLFlow tracker inicializado: {experiment_name}")
    
    def log_model_training(
        self,
        model,
        model_name: str,
        metrics: Dict[str, float],
        params: Dict[str, Any],
        vectorizer_type: str = "tfidf",
        tags: Optional[Dict[str, str]] = None
    ):
        """
        Registrar entrenamiento de modelo.
        
        Args:
            model: Modelo entrenado (sklearn)
            model_name: Nombre del modelo
            metrics: Diccionario con métricas (test_f1, train_f1, etc.)
            params: Diccionario con hiperparámetros
            vectorizer_type: Tipo de vectorizador usado
            tags: Tags adicionales
        """
        import numpy as np
        
        with mlflow.start_run(run_name=model_name):
            # Logear parámetros
            mlflow.log_params(params)
            mlflow.log_param("vectorizer_type", vectorizer_type)
            mlflow.log_param("model_type", model_name)
            
            # Convertir métricas a float (por si son arrays de numpy)
            metrics_float = {}
            for key, value in metrics.items():
                if isinstance(value, (np.ndarray, np.generic)):
                    # Si es array, tomar el primer elemento o convertir a float
                    if value.size == 1:
                        metrics_float[key] = float(value.item())
                    else:
                        # Si tiene múltiples elementos, tomar la media o el primero
                        metrics_float[key] = float(value[0]) if len(value) > 0 else 0.0
                else:
                    metrics_float[key] = float(value)
            
            # Logear métricas
            mlflow.log_metrics(metrics_float)
            
            # Logear modelo
            mlflow.sklearn.log_model(
                model,
                "model",
                registered_model_name=f"{model_name}_{vectorizer_type}"
            )
            
            # Logear tags
            if tags:
                mlflow.set_tags(tags)
            
            # Calcular overfitting si está disponible
            if 'test_f1' in metrics and 'train_f1' in metrics:
                overfitting = abs(metrics['train_f1'] - metrics['test_f1']) * 100
                mlflow.log_metric("overfitting_percentage", overfitting)
            
            print(f"✅ Modelo {model_name} registrado en MLFlow")
    
    def log_prediction_batch(
        self,
        predictions_count: int,
        toxic_count: int,
        avg_confidence: float,
        source: str = "api"
    ):
        """
        Registrar estadísticas de un batch de predicciones.
        
        Args:
            predictions_count: Número de predicciones
            toxic_count: Número de predicciones tóxicas
            avg_confidence: Confianza promedio
            source: Origen de las predicciones
        """
        with mlflow.start_run(run_name=f"predictions_{source}"):
            mlflow.log_metric("predictions_count", predictions_count)
            mlflow.log_metric("toxic_count", toxic_count)
            mlflow.log_metric("not_toxic_count", predictions_count - toxic_count)
            mlflow.log_metric("toxic_percentage", (toxic_count / predictions_count * 100) if predictions_count > 0 else 0)
            mlflow.log_metric("avg_confidence", avg_confidence)
            mlflow.log_param("source", source)
    
    def log_hyperparameter_optimization(
        self,
        study_name: str,
        best_params: Dict[str, Any],
        best_value: float,
        n_trials: int
    ):
        """
        Registrar resultados de optimización de hiperparámetros.
        
        Args:
            study_name: Nombre del estudio
            best_params: Mejores parámetros encontrados
            best_value: Mejor valor de la métrica
            n_trials: Número de trials ejecutados
        """
        with mlflow.start_run(run_name=f"optuna_{study_name}"):
            mlflow.log_params(best_params)
            mlflow.log_metric("best_f1_score", best_value)
            mlflow.log_param("n_trials", n_trials)
            mlflow.log_param("optimization_method", "optuna")
            mlflow.set_tag("study_name", study_name)
            
            print(f"✅ Optimización {study_name} registrada en MLFlow")


# Instancia global del tracker
_tracker: Optional[MLFlowTracker] = None


def get_tracker(
    experiment_name: str = "hate_speech_detection",
    tracking_uri: Optional[str] = None
) -> MLFlowTracker:
    """
    Obtener instancia global del tracker de MLFlow.
    
    Args:
        experiment_name: Nombre del experimento
        tracking_uri: URI del servidor de MLFlow
        
    Returns:
        Instancia de MLFlowTracker
    """
    global _tracker
    if _tracker is None:
        _tracker = MLFlowTracker(experiment_name, tracking_uri)
    return _tracker

