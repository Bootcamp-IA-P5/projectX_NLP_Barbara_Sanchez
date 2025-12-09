"""
Módulo para entrenar y usar modelos Transformer (DistilBERT) para detección de hate speech.

Este módulo implementa DistilBERT como modelo de nivel experto que puede
capturar mejor el contexto y semántica del texto comparado con modelos clásicos.
"""

import pickle
import warnings
from pathlib import Path
from typing import Dict, Any, Optional, Tuple, List
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from torch.optim import AdamW
from transformers import (
    DistilBertTokenizer,
    DistilBertForSequenceClassification,
    get_linear_schedule_with_warmup
)
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix
)

warnings.filterwarnings('ignore')


class HateSpeechDataset(Dataset):
    """Dataset personalizado para clasificación de hate speech con Transformers."""
    
    def __init__(self, texts: List[str], labels: List[int], tokenizer, max_length: int = 128):
        """
        Inicializar dataset.
        
        Args:
            texts: Lista de textos
            labels: Lista de etiquetas (0 o 1)
            tokenizer: Tokenizador de Transformers
            max_length: Longitud máxima de secuencia
        """
        # Convertir a listas para evitar problemas con índices de pandas
        self.texts = [str(text) for text in texts]
        self.labels = [int(label) for label in labels]
        self.tokenizer = tokenizer
        self.max_length = max_length
    
    def __len__(self):
        return len(self.texts)
    
    def __getitem__(self, idx):
        text = self.texts[idx]
        label = self.labels[idx]
        
        # Tokenizar texto
        encoding = self.tokenizer(
            text,
            truncation=True,
            padding='max_length',
            max_length=self.max_length,
            return_tensors='pt'
        )
        
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(label, dtype=torch.long)
        }


def train_distilbert(
    X_train: pd.Series,
    y_train: pd.Series,
    X_test: pd.Series,
    y_test: pd.Series,
    model_name: str = 'distilbert-base-uncased',
    num_epochs: int = 5,
    batch_size: int = 16,
    learning_rate: float = 2e-5,
    weight_decay: float = 0.01,
    warmup_steps: int = 100,
    max_length: int = 128,
    device: Optional[torch.device] = None,
    save_path: Optional[Path] = None,
    verbose: bool = True
) -> Tuple[DistilBertForSequenceClassification, Dict[str, float]]:
    """
    Entrenar modelo DistilBERT para detección de hate speech.
    
    Args:
        X_train: Textos de entrenamiento
        y_train: Etiquetas de entrenamiento
        X_test: Textos de prueba
        y_test: Etiquetas de prueba
        model_name: Nombre del modelo pre-entrenado
        num_epochs: Número de épocas
        batch_size: Tamaño del batch
        learning_rate: Learning rate
        weight_decay: Weight decay para regularización L2
        warmup_steps: Pasos de warmup
        max_length: Longitud máxima de secuencia
        device: Dispositivo (CPU o CUDA)
        save_path: Ruta donde guardar el modelo
        verbose: Si True, muestra progreso
        
    Returns:
        Tupla (modelo entrenado, métricas de evaluación)
    """
    # Configurar dispositivo
    if device is None:
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    if verbose:
        print(f"🔧 Entrenando DistilBERT")
        print(f"   Dispositivo: {device}")
        print(f"   Modelo: {model_name}")
        print(f"   Épocas: {num_epochs}")
        print(f"   Batch size: {batch_size}")
        print(f"   Learning rate: {learning_rate}")
    
    # Cargar tokenizador y modelo
    tokenizer = DistilBertTokenizer.from_pretrained(model_name)
    model = DistilBertForSequenceClassification.from_pretrained(
        model_name,
        num_labels=2,
        problem_type="single_label_classification"
    )
    model = model.to(device)
    
    # Crear datasets
    train_dataset = HateSpeechDataset(X_train.tolist(), y_train.tolist(), tokenizer, max_length)
    test_dataset = HateSpeechDataset(X_test.tolist(), y_test.tolist(), tokenizer, max_length)
    
    # Crear DataLoaders
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)
    
    # Configurar optimizador y scheduler
    optimizer = AdamW(model.parameters(), lr=learning_rate, weight_decay=weight_decay)
    total_steps = len(train_loader) * num_epochs
    scheduler = get_linear_schedule_with_warmup(
        optimizer,
        num_warmup_steps=warmup_steps,
        num_training_steps=total_steps
    )
    
    # Entrenar con early stopping
    best_f1 = 0
    patience_counter = 0
    patience = 2
    best_model_state = None
    
    for epoch in range(num_epochs):
        # Entrenamiento
        model.train()
        total_loss = 0
        
        for batch in train_loader:
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            labels = batch['labels'].to(device)
            
            optimizer.zero_grad()
            outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
            loss = outputs.loss
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)  # Gradient clipping
            optimizer.step()
            scheduler.step()
            
            total_loss += loss.item()
        
        # Evaluación
        metrics = evaluate_distilbert(model, test_loader, device)
        test_f1 = metrics['f1']
        
        if verbose:
            print(f"\nÉpoca {epoch+1}/{num_epochs}:")
            print(f"   Loss: {total_loss/len(train_loader):.4f}")
            print(f"   Test F1: {test_f1:.4f}")
            print(f"   Test Accuracy: {metrics['accuracy']:.4f}")
        
        # Early stopping
        if test_f1 > best_f1:
            best_f1 = test_f1
            patience_counter = 0
            best_model_state = model.state_dict().copy()
        else:
            patience_counter += 1
            if patience_counter >= patience:
                if verbose:
                    print(f"\n⏹️  Early stopping en época {epoch+1}")
                break
    
    # Cargar mejor modelo
    if best_model_state:
        model.load_state_dict(best_model_state)
    
    # Evaluación final
    final_metrics = evaluate_distilbert(model, test_loader, device)
    
    # Guardar modelo si se especifica
    if save_path:
        save_distilbert_model(model, tokenizer, save_path)
        if verbose:
            print(f"\n✅ Modelo guardado en: {save_path}")
    
    return model, final_metrics


def evaluate_distilbert(
    model: DistilBertForSequenceClassification,
    dataloader: DataLoader,
    device: torch.device
) -> Dict[str, float]:
    """
    Evaluar modelo DistilBERT.
    
    Args:
        model: Modelo entrenado
        dataloader: DataLoader con datos de prueba
        device: Dispositivo
        
    Returns:
        Diccionario con métricas
    """
    model.eval()
    predictions = []
    true_labels = []
    
    with torch.no_grad():
        for batch in dataloader:
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            labels = batch['labels'].to(device)
            
            outputs = model(input_ids=input_ids, attention_mask=attention_mask)
            logits = outputs.logits
            preds = torch.argmax(logits, dim=1)
            
            predictions.extend(preds.cpu().numpy())
            true_labels.extend(labels.cpu().numpy())
    
    predictions = np.array(predictions)
    true_labels = np.array(true_labels)
    
    accuracy = accuracy_score(true_labels, predictions)
    precision = precision_score(true_labels, predictions, zero_division=0)
    recall = recall_score(true_labels, predictions, zero_division=0)
    f1 = f1_score(true_labels, predictions, zero_division=0)
    
    return {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1': f1
    }


def save_distilbert_model(
    model: DistilBertForSequenceClassification,
    tokenizer: DistilBertTokenizer,
    save_path: Path
):
    """
    Guardar modelo y tokenizador.
    
    Args:
        model: Modelo entrenado
        tokenizer: Tokenizador
        save_path: Ruta donde guardar
    """
    save_path = Path(save_path)
    save_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Guardar modelo y tokenizador
    model.save_pretrained(str(save_path))
    tokenizer.save_pretrained(str(save_path))
    
    print(f"✅ Modelo y tokenizador guardados en: {save_path}")


def load_distilbert_model(
    load_path: Path,
    device: Optional[torch.device] = None
) -> Tuple[DistilBertForSequenceClassification, DistilBertTokenizer]:
    """
    Cargar modelo y tokenizador.
    
    Args:
        load_path: Ruta del modelo guardado
        device: Dispositivo
        
    Returns:
        Tupla (modelo, tokenizador)
    """
    if device is None:
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    load_path = Path(load_path)
    
    model = DistilBertForSequenceClassification.from_pretrained(str(load_path))
    tokenizer = DistilBertTokenizer.from_pretrained(str(load_path))
    
    model = model.to(device)
    model.eval()
    
    print(f"✅ Modelo y tokenizador cargados desde: {load_path}")
    return model, tokenizer


def predict_distilbert(
    model: DistilBertForSequenceClassification,
    tokenizer: DistilBertTokenizer,
    texts: List[str],
    device: Optional[torch.device] = None,
    max_length: int = 128,
    batch_size: int = 32
) -> List[Dict[str, Any]]:
    """
    Hacer predicciones con modelo DistilBERT.
    
    Args:
        model: Modelo entrenado
        tokenizer: Tokenizador
        texts: Lista de textos a predecir
        device: Dispositivo
        max_length: Longitud máxima de secuencia
        batch_size: Tamaño del batch
        
    Returns:
        Lista de diccionarios con predicciones
    """
    if device is None:
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    model.eval()
    results = []
    
    # Procesar en batches
    for i in range(0, len(texts), batch_size):
        batch_texts = texts[i:i+batch_size]
        
        # Tokenizar
        encodings = tokenizer(
            batch_texts,
            truncation=True,
            padding='max_length',
            max_length=max_length,
            return_tensors='pt'
        )
        
        input_ids = encodings['input_ids'].to(device)
        attention_mask = encodings['attention_mask'].to(device)
        
        # Predecir
        with torch.no_grad():
            outputs = model(input_ids=input_ids, attention_mask=attention_mask)
            logits = outputs.logits
            probabilities = torch.softmax(logits, dim=1)
            predictions = torch.argmax(logits, dim=1)
        
        # Procesar resultados
        for j, text in enumerate(batch_texts):
            pred = predictions[j].item()
            prob = probabilities[j].cpu().numpy()
            
            results.append({
                'text': text,
                'is_toxic': bool(pred),
                'toxicity_label': 'Toxic' if pred == 1 else 'Not Toxic',
                'probability_toxic': float(prob[1]),
                'probability_not_toxic': float(prob[0]),
                'confidence': float(max(prob))
            })
    
    return results

