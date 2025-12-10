# 📋 Issues para Crear en GitHub

## 🎯 Issues Recomendadas (5-7 issues)

### Issue 1: Mejorar Calibración de Probabilidades del Modelo

**Título**: `feat: Improve model probability calibration for better user experience`

**Descripción**:
```markdown
## 🎯 Objetivo
Mejorar la calibración de probabilidades del modelo SVM para que las predicciones sean más distinguibles y confiables para el usuario.

## 📊 Contexto Actual
El modelo actual tiene probabilidades muy similares (rango 0.44-0.48) que requieren amplificación manual. Aunque funciona, sería mejor tener un modelo con mejor calibración intrínseca.

## ✅ Tareas
- [ ] Investigar técnicas de calibración (Platt scaling, Isotonic regression)
- [ ] Implementar calibración post-entrenamiento
- [ ] Evaluar mejora en métricas
- [ ] Actualizar documentación

## 🔗 Relacionado
- Modelo actual: `backend/models/optimized/best_optimized_model.pkl`
- Código relevante: `backend/src/api/predict.py`

## 📝 Notas
Prioridad: Media
Estimación: 4-6 horas
```

**Labels**: `enhancement`, `model`, `priority-medium`

---

### Issue 2: Implementar Data Augmentation para Mejorar Dataset

**Título**: `feat: Add data augmentation techniques to expand training dataset`

**Descripción**:
```markdown
## 🎯 Objetivo
Implementar técnicas de data augmentation para aumentar el tamaño del dataset y mejorar el rendimiento del modelo.

## 📊 Contexto
El dataset actual tiene 1,000 comentarios. Con data augmentation podríamos expandirlo y mejorar la generalización del modelo.

## ✅ Tareas
- [ ] Implementar reemplazo por sinónimos (usar WordNet o spaCy)
- [ ] Implementar traducción y back-translation
- [ ] Implementar parafrasis
- [ ] Aplicar augmentation al dataset
- [ ] Evaluar mejora en métricas del modelo
- [ ] Crear notebook `12_Data_Augmentation.ipynb`

## 🔗 Relacionado
- Dataset: `backend/data/raw/youtoxic_english_1000.csv`
- Código: Crear `backend/src/data/augmentation.py`

## 📝 Notas
Prioridad: Alta (requisito de rúbrica)
Estimación: 6-8 horas
```

**Labels**: `enhancement`, `data`, `priority-high`, `rubric-requirement`

---

### Issue 3: Añadir Análisis de Clustering para EDA

**Título**: `feat: Add clustering analysis for exploratory data analysis`

**Descripción**:
```markdown
## 🎯 Objetivo
Implementar análisis de clustering (KMeans, DBSCAN) para descubrir patrones ocultos en los comentarios y mejorar el EDA.

## 📊 Contexto
El clustering puede revelar grupos naturales de comentarios que no están relacionados directamente con la etiqueta tóxico/no tóxico.

## ✅ Tareas
- [ ] Crear notebook `11_Clustering_Analysis.ipynb`
- [ ] Aplicar KMeans con diferentes k (2, 3, 4, 5)
- [ ] Aplicar DBSCAN para encontrar outliers
- [ ] Visualizar clusters con PCA/t-SNE
- [ ] Analizar características de cada cluster
- [ ] Integrar visualizaciones en frontend (opcional)

## 🔗 Relacionado
- Datos vectorizados: `backend/data/processed/tfidf_X_train.pkl`
- EDA actual: `backend/notebooks/01_EDA.ipynb`

## 📝 Notas
Prioridad: Alta (requisito de rúbrica)
Estimación: 4-6 horas
```

**Labels**: `enhancement`, `eda`, `clustering`, `priority-high`, `rubric-requirement`

---

### Issue 4: Añadir Soporte Multiidioma

**Título**: `feat: Add multi-language support for hate speech detection`

**Descripción**:
```markdown
## 🎯 Objetivo
Extender el sistema para soportar detección de hate speech en múltiples idiomas (español, francés, etc.).

## 📊 Contexto Actual
El modelo actual está entrenado solo en inglés. Para ser más útil, debería soportar otros idiomas.

## ✅ Tareas
- [ ] Investigar modelos multilingües (mBERT, XLM-RoBERTa)
- [ ] Recopilar dataset en otros idiomas
- [ ] Entrenar modelo multilingüe o modelos por idioma
- [ ] Actualizar API para detectar idioma automáticamente
- [ ] Actualizar frontend con selector de idioma
- [ ] Documentar limitaciones

## 🔗 Relacionado
- Modelo actual: SVM optimizado (inglés)
- API: `backend/main.py`

## 📝 Notas
Prioridad: Baja (futuro)
Estimación: 20-30 horas
```

**Labels**: `enhancement`, `feature`, `priority-low`, `future`

---

### Issue 5: Mejorar Manejo de Errores en API

**Título**: `fix: Improve error handling and user feedback in API endpoints`

**Descripción**:
```markdown
## 🎯 Objetivo
Mejorar el manejo de errores en la API para proporcionar mensajes más claros y útiles al usuario.

## 📊 Contexto Actual
Algunos errores no tienen mensajes descriptivos o no se manejan correctamente.

## ✅ Tareas
- [ ] Revisar todos los endpoints y casos de error
- [ ] Añadir validación más robusta de inputs
- [ ] Mejorar mensajes de error (específicos y útiles)
- [ ] Añadir logging estructurado
- [ ] Crear códigos de error personalizados
- [ ] Actualizar documentación de API

## 🔗 Relacionado
- API: `backend/main.py`
- Tests: `backend/tests/test_api.py`

## 📝 Notas
Prioridad: Media
Estimación: 3-4 horas
```

**Labels**: `bug`, `api`, `priority-medium`

---

### Issue 6: Optimizar Tiempo de Respuesta de la API

**Título**: `perf: Optimize API response time and add caching`

**Descripción**:
```markdown
## 🎯 Objetivo
Optimizar el tiempo de respuesta de la API mediante caching y optimizaciones.

## 📊 Contexto
La API puede ser lenta con múltiples requests. El caching puede mejorar significativamente el rendimiento.

## ✅ Tareas
- [ ] Implementar caching de predicciones frecuentes (Redis o in-memory)
- [ ] Optimizar carga de modelo (lazy loading)
- [ ] Añadir rate limiting
- [ ] Medir tiempos de respuesta antes/después
- [ ] Documentar estrategia de caching

## 🔗 Relacionado
- API: `backend/main.py`
- Predictor: `backend/src/api/predict.py`

## 📝 Notas
Prioridad: Baja
Estimación: 6-8 horas
```

**Labels**: `performance`, `enhancement`, `priority-low`

---

### Issue 7: Añadir Tests de Integración

**Título**: `test: Add integration tests for complete user workflows`

**Descripción**:
```markdown
## 🎯 Objetivo
Añadir tests de integración que prueben flujos completos de usuario (end-to-end).

## 📊 Contexto Actual
Tenemos tests unitarios, pero faltan tests de integración que prueben el sistema completo.

## ✅ Tareas
- [ ] Crear tests de integración para flujo completo:
  - [ ] Análisis individual → guardado en BD → consulta
  - [ ] Análisis YouTube → predicciones → estadísticas
  - [ ] Batch analysis → resultados agregados
- [ ] Añadir fixtures para datos de prueba
- [ ] Configurar CI/CD para ejecutar tests
- [ ] Documentar cómo ejecutar tests

## 🔗 Relacionado
- Tests actuales: `backend/tests/`
- API: `backend/main.py`

## 📝 Notas
Prioridad: Media
Estimación: 4-6 horas
```

**Labels**: `testing`, `enhancement`, `priority-medium`

---

## 📝 Instrucciones para Crear las Issues

### Opción 1: Desde GitHub Web

1. Ve a: https://github.com/Bootcamp-IA-P5/projectX_NLP_Barbara_Sanchez/issues
2. Click en "New Issue"
3. Copia y pega el título y descripción de cada issue
4. Añade las labels correspondientes
5. Click en "Submit new issue"

### Opción 2: Desde GitHub CLI (si lo tienes instalado)

```bash
# Issue 1: Calibración
gh issue create --title "feat: Improve model probability calibration for better user experience" \
  --body-file issue1.md \
  --label "enhancement,model,priority-medium"

# Issue 2: Data Augmentation
gh issue create --title "feat: Add data augmentation techniques to expand training dataset" \
  --body-file issue2.md \
  --label "enhancement,data,priority-high,rubric-requirement"

# Issue 3: Clustering
gh issue create --title "feat: Add clustering analysis for exploratory data analysis" \
  --body-file issue3.md \
  --label "enhancement,eda,clustering,priority-high,rubric-requirement"

# Issue 4: Multiidioma
gh issue create --title "feat: Add multi-language support for hate speech detection" \
  --body-file issue4.md \
  --label "enhancement,feature,priority-low,future"

# Issue 5: Manejo de errores
gh issue create --title "fix: Improve error handling and user feedback in API endpoints" \
  --body-file issue5.md \
  --label "bug,api,priority-medium"

# Issue 6: Optimización
gh issue create --title "perf: Optimize API response time and add caching" \
  --body-file issue6.md \
  --label "performance,enhancement,priority-low"

# Issue 7: Tests de integración
gh issue create --title "test: Add integration tests for complete user workflows" \
  --body-file issue7.md \
  --label "testing,enhancement,priority-medium"
```

---

## 🎯 Issues Prioritarias para la Rúbrica

Si solo quieres crear las **mínimas necesarias** para la rúbrica, crea estas 3:

1. ✅ **Issue 2**: Data Augmentation (requisito NLP)
2. ✅ **Issue 3**: Clustering (requisito ML)
3. ✅ **Issue 1 o 5**: Cualquiera de mejora/optimización

---

## 📊 Resumen

- **Total issues**: 7
- **Prioridad Alta** (rúbrica): 2 (Data Augmentation, Clustering)
- **Prioridad Media**: 3 (Calibración, Errores, Tests)
- **Prioridad Baja**: 2 (Multiidioma, Optimización)

**Recomendación**: Crea al menos 5 issues para demostrar buen uso de la herramienta.

