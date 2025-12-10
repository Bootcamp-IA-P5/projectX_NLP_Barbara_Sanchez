# ⚠️ Limitaciones del Modelo

## Problema Identificado

El modelo fue entrenado con un dataset en **inglés** y tiene un vocabulario limitado de 1000 palabras.

### ¿Qué significa esto?

- ✅ **Textos en inglés**: Funcionan correctamente y dan resultados diferentes
- ❌ **Textos en español**: Palabras desconocidas producen vectores de ceros
- ❌ **Palabras fuera del vocabulario**: Todas dan el mismo resultado

### Ejemplo

```
Texto: "guapa" (español)
→ No está en vocabulario
→ Vector: [0, 0, 0, ..., 0] (todos ceros)
→ Predicción: Siempre la misma

Texto: "feo" (español)  
→ No está en vocabulario
→ Vector: [0, 0, 0, ..., 0] (todos ceros)
→ Predicción: Misma que "guapa" (vectores idénticos)

Texto: "I hate you" (inglés)
→ Palabras en vocabulario
→ Vector: [0.5, 0.3, ..., 0.2] (valores reales)
→ Predicción: Diferente y correcta
```

## Soluciones

### Opción 1: Usar Textos en Inglés (Recomendado)

Para obtener resultados diferentes y correctos, usa textos en inglés:

✅ **Ejemplos que funcionan:**
- "I love this video"
- "I hate you"
- "This is amazing"
- "You are stupid"

❌ **Ejemplos que dan el mismo resultado:**
- "guapa" (español)
- "feo" (español)
- "hermoso" (español)

### Opción 2: Entrenar Modelo Multilingüe

Para soportar español, necesitarías:
1. Dataset en español o multilingüe
2. Re-entrenar el vectorizador con más palabras
3. Re-entrenar el modelo

### Opción 3: Añadir Mensaje de Advertencia

El frontend podría mostrar un mensaje cuando detecte que el texto está en español o contiene palabras desconocidas.

## Verificación

Para verificar si una palabra está en el vocabulario:

```python
from src.api.predict import load_predictor
p = load_predictor()
vocab = p.vectorizer.get_feature_names()
print("guapa" in vocab)  # False
print("hate" in vocab)   # True
```

## Conclusión

**Esto NO es un bug del código**, es una limitación del modelo entrenado. El código funciona correctamente, pero el modelo solo puede predecir textos en inglés.

