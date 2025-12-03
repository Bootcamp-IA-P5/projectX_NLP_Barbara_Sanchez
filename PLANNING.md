# 📅 PLANNING PROYECTO - Detección de Mensajes de Odio en YouTube
## Entrega: 8 días (hasta 23:59)

---

## ✅ LO QUE YA ESTÁ HECHO

### 1. Análisis Exploratorio de Datos (EDA)
- ✅ Análisis completo del dataset YouToxic English 1000
- ✅ Documentación en `docs/EDA_RESULTS.md`
- ✅ Identificación de distribución de toxicidad (46% tóxicos, 54% no tóxicos)
- ✅ Análisis de características del texto

### 2. Preprocesamiento
- ✅ Limpieza de texto
- ✅ Normalización
- ✅ Datos guardados en `data/processed/`

### 3. Feature Engineering
- ✅ Vectorización TF-IDF
- ✅ Vectorización Count Vectorizer
- ✅ Documentación en `docs/FEATURES_RESULTS.md`
- ✅ Vectorizadores guardados

### 4. Modelado Baseline
- ✅ 8 modelos entrenados (Naive Bayes, Logistic Regression, SVM, Random Forest)
- ✅ Comparación TF-IDF vs Count Vectorizer
- ✅ Modelo seleccionado: **SVM + TF-IDF** (F1: 0.6897, Accuracy: 0.73)
- ✅ Documentación en `docs/MODELING_RESULTS.md`

### 5. Optimización de Hiperparámetros
- ✅ Optimización con Optuna
- ✅ Modelo optimizado guardado
- ⚠️ **PROBLEMA**: Overfitting aún presente (23.32% diferencia F1)

---

## ❌ LO QUE FALTA POR HACER

### 🔴 CRÍTICO (Nivel Esencial - OBLIGATORIO)

1. **Resolver Overfitting** ⚠️
   - Estado actual: 23.32% diferencia F1 (objetivo: <5%)
   - Acciones: Regularización, más datos, técnicas anti-overfitting

2. **Código Modularizado**
   - Estructurar código en `src/` (data, features, models)
   - Convertir notebooks a scripts Python reutilizables

3. **Interfaz de Productivización**
   - Streamlit app para consultar si un mensaje es de odio
   - Interfaz simple y funcional

4. **README Completo**
   - Documentación del proyecto
   - Instrucciones de instalación y uso
   - Estructura del proyecto

5. **Repositorio Git**
   - Commits limpios y descriptivos
   - Ramas bien organizadas
   - Documentación del código

---

### 🟡 IMPORTANTE (Nivel Medio)

6. **Tests Unitarios**
   - Tests para funciones de preprocesamiento
   - Tests para funciones de modelado
   - Tests para la interfaz

7. **Integración con YouTube API**
   - Función para analizar comentarios de un video dado su URL
   - Extracción de comentarios de YouTube

8. **Mejora del Modelo**
   - Técnicas de ensemble (si es necesario)
   - Validación cruzada

---

### 🟠 AVANZADO (Opcional - Bonus)

9. **Dockerización**
   - Dockerfile
   - docker-compose.yml
   - Documentación de despliegue

10. **Despliegue Público**
    - Deploy en servidor (Heroku, AWS, etc.)
    - URL accesible públicamente

---

### 🔴 EXPERTO (Opcional - Bonus)

11. **Base de Datos**
    - Guardar resultados de predicciones
    - SQLite o PostgreSQL

12. **MLFlow**
    - Tracking de experimentos
    - Comparación de modelos

---

### 📊 GESTIÓN Y DOCUMENTACIÓN

13. **Presentación Técnica**
    - Slides explicando objetivos, desarrollo y tecnologías
    - Demo en vivo del funcionamiento

14. **Tablero Kanban**
    - Trello, Jira o GitHub Projects
    - Gestión del proyecto visible

---

## 📅 PLAN DE TRABAJO - 8 DÍAS

### **DÍA 1 (Hoy) - FUNDACIÓN Y OVERFITTING**
**Objetivo**: Resolver el problema crítico del overfitting y estructurar el proyecto

**Tareas**:
- [ ] **Mañana (2-3h)**: Resolver overfitting
  - Probar técnicas de regularización más agresivas
  - Validación cruzada para confirmar resultados
  - Ajustar hiperparámetros con enfoque anti-overfitting
  - **Meta**: Reducir diferencia F1 a <5%

- [ ] **Tarde (2-3h)**: Estructura del proyecto
  - Crear estructura de carpetas `src/`
  - Planificar módulos (data, features, models, utils)
  - Crear `__init__.py` files
  - Documentar estructura

**Entregable**: Modelo sin overfitting + Estructura de proyecto definida

---

### **DÍA 2 - MODULARIZACIÓN**
**Objetivo**: Convertir notebooks a código Python modular y reutilizable

**Tareas**:
- [ ] **Mañana (3-4h)**: Módulo de datos
  - `src/data/load_data.py` - Carga de datos
  - `src/data/preprocessing.py` - Funciones de preprocesamiento
  - Tests básicos

- [ ] **Tarde (3-4h)**: Módulo de features y modelos
  - `src/features/vectorization.py` - Vectorización
  - `src/models/train.py` - Entrenamiento
  - `src/models/predict.py` - Predicción
  - Tests básicos

**Entregable**: Código modularizado y funcional

---

### **DÍA 3 - INTERFAZ STREAMLIT (Nivel Esencial)**
**Objetivo**: Crear interfaz básica para productivizar el modelo

**Tareas**:
- [ ] **Todo el día (6-8h)**: Streamlit App
  - `app.py` o `streamlit_app.py`
  - Interfaz simple: input de texto → predicción
  - Mostrar probabilidad y resultado
  - Diseño limpio y funcional
  - Integrar modelo optimizado

**Entregable**: App Streamlit funcional y desplegada localmente

---

### **DÍA 4 - INTEGRACIÓN YOUTUBE API (Nivel Medio)**
**Objetivo**: Permitir analizar comentarios de un video de YouTube

**Tareas**:
- [ ] **Mañana (3-4h)**: Integración YouTube API
  - Investigar YouTube Data API v3
  - Función para extraer comentarios de un video
  - Manejo de errores y límites de API

- [ ] **Tarde (3-4h)**: Extender Streamlit
  - Añadir opción: "Analizar video de YouTube"
  - Input de URL → extraer comentarios → analizar todos
  - Mostrar resultados en tabla
  - Exportar resultados

**Entregable**: App con funcionalidad de análisis de videos

---

### **DÍA 5 - TESTS Y DOCUMENTACIÓN**
**Objetivo**: Tests unitarios y documentación completa

**Tareas**:
- [ ] **Mañana (3-4h)**: Tests Unitarios
  - `tests/test_preprocessing.py`
  - `tests/test_vectorization.py`
  - `tests/test_model.py`
  - `tests/test_app.py` (opcional)
  - Configurar pytest

- [ ] **Tarde (3-4h)**: Documentación
  - README.md completo con:
    - Descripción del proyecto
    - Instrucciones de instalación
    - Uso de la aplicación
    - Estructura del proyecto
    - Tecnologías utilizadas
  - Docstrings en código Python
  - Comentarios donde sea necesario

**Entregable**: Tests funcionando + README completo

---

### **DÍA 6 - DOCKER Y GIT (Nivel Avanzado)**
**Objetivo**: Dockerizar aplicación y limpiar repositorio Git

**Tareas**:
- [ ] **Mañana (3-4h)**: Dockerización
  - Crear `Dockerfile`
  - Crear `docker-compose.yml`
  - Probar que funciona localmente
  - Actualizar README con instrucciones Docker

- [ ] **Tarde (3-4h)**: Git y Repositorio
  - Revisar commits y mensajes
  - Organizar ramas (main, develop, features)
  - Asegurar que todo está commiteado
  - Tags de versiones si es necesario
  - .gitignore actualizado

**Entregable**: App dockerizada + Repo Git limpio

---

### **DÍA 7 - PRESENTACIÓN Y KANBAN**
**Objetivo**: Preparar presentación y tablero Kanban

**Tareas**:
- [ ] **Mañana (3-4h)**: Presentación Técnica
  - Crear slides (PowerPoint, Google Slides, o similar)
  - Contenido:
    - Introducción y problema
    - Objetivos del proyecto
    - Metodología (EDA, preprocessing, modeling)
    - Resultados y métricas
    - Demo de la aplicación
    - Tecnologías utilizadas
    - Conclusiones y próximos pasos
  - Preparar demo en vivo

- [ ] **Tarde (2-3h)**: Tablero Kanban
  - Crear tablero en Trello/Jira/GitHub Projects
  - Organizar tareas por estados (To Do, In Progress, Done)
  - Documentar progreso del proyecto
  - Añadir screenshots si es posible

**Entregable**: Presentación lista + Tablero Kanban documentado

---

### **DÍA 8 - PULIDO FINAL Y DESPLIEGUE (Opcional)**
**Objetivo**: Últimos ajustes y despliegue público (si se alcanza nivel avanzado)

**Tareas**:
- [ ] **Mañana (2-3h)**: Testing Final
  - Probar toda la aplicación end-to-end
  - Verificar que todo funciona
  - Corregir bugs encontrados
  - Optimizar rendimiento si es necesario

- [ ] **Tarde (3-4h)**: Despliegue Público (Opcional - Nivel Avanzado)
  - Desplegar en Heroku/AWS/Railway/etc.
  - Configurar variables de entorno
  - Probar que funciona en producción
  - Obtener URL pública

- [ ] **Noche (1-2h)**: Últimos Ajustes
  - Revisar README una última vez
  - Asegurar que todos los archivos están en el repo
  - Verificar que la demo funciona
  - Preparar para entrega

**Entregable**: Proyecto completo y listo para entrega

---

## 🎯 PRIORIZACIÓN POR NIVELES

### 🟢 Nivel Esencial (OBLIGATORIO)
1. ✅ Resolver overfitting (<5% diferencia)
2. ✅ Interfaz Streamlit básica
3. ✅ README completo
4. ✅ Repositorio Git organizado
5. ✅ Código documentado

### 🟡 Nivel Medio (RECOMENDADO)
6. ✅ Tests unitarios
7. ✅ Integración YouTube API
8. ✅ Código modularizado

### 🟠 Nivel Avanzado (BONUS)
9. ✅ Dockerización
10. ✅ Despliegue público

### 🔴 Nivel Experto (BONUS EXTRA)
11. ✅ Base de datos
12. ✅ MLFlow tracking

---

## ⚠️ RIESGOS Y CONTINGENCIAS

### Riesgo 1: Overfitting no se resuelve
- **Mitigación**: Si después de Día 1 no se resuelve, considerar:
  - Data augmentation
  - Más regularización
  - Modelos más simples
  - Aceptar overfitting pero documentarlo bien

### Riesgo 2: YouTube API tiene límites
- **Mitigación**: 
  - Usar API key personal
  - Implementar rate limiting
  - Cache de resultados
  - Alternativa: usar librería `youtube-comment-downloader` (sin API)

### Riesgo 3: Tiempo insuficiente
- **Mitigación**: Priorizar Nivel Esencial
  - Si falta tiempo, dejar Docker/Despliegue para después
  - Enfocarse en que lo esencial funcione perfecto

---

## 📋 CHECKLIST FINAL DE ENTREGA

### Código
- [ ] Repositorio GitHub con código documentado
- [ ] Código modularizado en `src/`
- [ ] Tests unitarios funcionando
- [ ] README completo y claro

### Modelo
- [ ] Modelo entrenado y guardado
- [ ] Overfitting controlado (<5% diferencia)
- [ ] Métricas documentadas

### Aplicación
- [ ] Streamlit app funcional
- [ ] Interfaz intuitiva
- [ ] Integración YouTube (nivel medio)
- [ ] Dockerizado (nivel avanzado)

### Documentación
- [ ] README.md completo
- [ ] Presentación técnica lista
- [ ] Tablero Kanban documentado
- [ ] Docstrings en código

### Demo
- [ ] Demo preparada y probada
- [ ] Screenshots/videos si es necesario
- [ ] URL pública (si nivel avanzado)

---

## 💡 CONSEJOS FINALES

1. **Prioriza lo esencial**: Asegúrate de cumplir el Nivel Esencial antes de avanzar
2. **Commits frecuentes**: Haz commits pequeños y frecuentes
3. **Documenta mientras trabajas**: No dejes la documentación para el final
4. **Prueba la demo**: Asegúrate de que la demo funciona antes de presentar
5. **Mantén el README actualizado**: Es lo primero que verán los evaluadores

---

## 📞 RECURSOS ÚTILES

- **Streamlit**: https://docs.streamlit.io/
- **YouTube Data API**: https://developers.google.com/youtube/v3
- **Docker**: https://docs.docker.com/
- **Optuna**: https://optuna.org/
- **Git Best Practices**: https://www.atlassian.com/git/tutorials/comparing-workflows

---

**¡Mucho ánimo! Tienes 8 días para completar un proyecto sólido. Prioriza bien y trabaja de forma organizada. 💪**


