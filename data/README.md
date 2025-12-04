# Datos del Proyecto

## Estructura

- `raw/`: Datos originales sin procesar (NO modificar)
  - `youtoxic_english_1000.csv`: Dataset original de comentarios de YouTube
  
- `processed/`: Datos preprocesados
  - `train/`: Datos de entrenamiento
  - `test/`: Datos de prueba

## Dataset

**Youtube Comments Dataset**
- 1000 comentarios en inglés
- Etiquetas: Tóxico / No tóxico
- Columnas adicionales: IsAbusive, IsHatespeech, etc.

## Notas

- Los datos originales (`raw/`) nunca deben modificarse
- Todos los datos procesados se guardan en `processed/`
- Los splits train/test se guardan por separado

