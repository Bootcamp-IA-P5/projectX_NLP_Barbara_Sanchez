# 🚀 Guía de Despliegue en Render

## 📋 Resumen

En Render, **debes desplegar frontend y backend por separado** como dos servicios independientes. Cada uno tiene su propia URL y se comunican entre sí.

## 🏗️ Estructura de Despliegue

```
Render Dashboard:
├── hate-speech-api (Backend)
│   ├── Tipo: Web Service (Docker)
│   ├── URL: https://hate-speech-api.onrender.com
│   └── Rama: develop
│
└── hate-speech-frontend (Frontend)
    ├── Tipo: Static Site O Web Service (Docker)
    ├── URL: https://hate-speech-frontend.onrender.com
    └── Rama: develop
```

## 🔧 Paso 1: Desplegar Backend

### Opción A: Usando render.yaml (Recomendado)

1. **En Render Dashboard:**
   - Click en "New +" → "Blueprint"
   - Conecta tu repositorio GitHub
   - Render detectará automáticamente `backend/render.yaml`
   - O manualmente: "New +" → "Web Service" → Selecciona repositorio

2. **Configuración:**
   - **Name:** `hate-speech-api`
   - **Environment:** `Docker`
   - **Dockerfile Path:** `backend/Dockerfile`
   - **Docker Context:** `backend/`
   - **Branch:** `develop`
   - **Plan:** Free

3. **Environment Variables:**
   - `PYTHONUNBUFFERED`: `1`
   - `FRONTEND_URL`: `https://hate-speech-frontend.onrender.com` (configurar después de desplegar frontend)

4. **Health Check Path:** `/health`

5. **Click "Create Web Service"**

### Opción B: Manual (sin render.yaml)

1. **New +** → **Web Service**
2. Conecta tu repositorio
3. Configura:
   - **Name:** `hate-speech-api`
   - **Environment:** `Docker`
   - **Dockerfile Path:** `backend/Dockerfile`
   - **Docker Context:** `backend/`
   - **Branch:** `develop`
   - **Root Directory:** `backend/` (opcional)

---

## 🎨 Paso 2: Desplegar Frontend

Tienes **DOS opciones**:

### Opción 1: Static Site (Recomendado - Más Simple)

1. **En Render Dashboard:**
   - Click en "New +" → "Static Site"
   - Conecta tu repositorio GitHub

2. **Configuración:**
   - **Name:** `hate-speech-frontend`
   - **Branch:** `develop`
   - **Root Directory:** `frontend/`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

3. **Environment Variables:**
   - `VITE_API_URL`: `https://hate-speech-api.onrender.com` (URL de tu backend)

4. **Click "Create Static Site"**

**Ventajas:**
- ✅ Más simple
- ✅ Más rápido
- ✅ Gratis
- ✅ No necesita Docker

---

### Opción 2: Web Service con Docker

1. **En Render Dashboard:**
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio GitHub

2. **Configuración:**
   - **Name:** `hate-speech-frontend`
   - **Environment:** `Docker`
   - **Dockerfile Path:** `frontend/Dockerfile`
   - **Docker Context:** `frontend/`
   - **Branch:** `develop`
   - **Plan:** Free

3. **Environment Variables:**
   - `VITE_API_URL`: `https://hate-speech-api.onrender.com`

4. **Health Check Path:** `/`

5. **Click "Create Web Service"**

---

## 🔗 Paso 3: Conectar Frontend con Backend

Una vez que ambos servicios estén desplegados:

1. **Obtén las URLs:**
   - Backend: `https://hate-speech-api.onrender.com`
   - Frontend: `https://hate-speech-frontend.onrender.com`

2. **Actualiza Environment Variables:**

   **En el servicio de Backend:**
   - Ve a Environment → Add Environment Variable
   - Key: `FRONTEND_URL`
   - Value: `https://hate-speech-frontend.onrender.com`
   - Click "Save Changes" (esto reiniciará el servicio)

   **En el servicio de Frontend:**
   - Ve a Environment → Add Environment Variable
   - Key: `VITE_API_URL`
   - Value: `https://hate-speech-api.onrender.com`
   - Click "Save Changes" (esto reconstruirá el frontend)

---

## ⚠️ Importante: Modelos y Datos

El backend necesita los modelos entrenados. Tienes dos opciones:

### Opción A: Incluir modelos en el build (Recomendado para empezar)

1. **Asegúrate de que los modelos están en el repositorio:**
   ```bash
   # Verificar que existen
   ls backend/models/optimized/
   ls backend/models/tfidf_vectorizer.pkl
   ```

2. **El Dockerfile los copiará automáticamente**

### Opción B: Usar volúmenes persistentes (Avanzado)

1. En Render, puedes configurar volúmenes persistentes
2. Subir los modelos manualmente
3. Montarlos en el contenedor

**Nota:** Los modelos `.pkl` son pequeños y pueden ir en el repositorio. El modelo DistilBERT (255MB) está en `.gitignore` y no es necesario para producción.

---

## ✅ Verificación Post-Despliegue

1. **Backend:**
   ```bash
   # Health check
   curl https://hate-speech-api.onrender.com/health
   
   # Documentación
   # Abre: https://hate-speech-api.onrender.com/docs
   ```

2. **Frontend:**
   - Abre: `https://hate-speech-frontend.onrender.com`
   - Debe cargar la interfaz
   - Abre consola del navegador (F12)
   - Intenta hacer un análisis
   - Verifica que las peticiones van a la URL correcta del backend

3. **Verificar CORS:**
   - Si ves errores de CORS en la consola
   - Verifica que `FRONTEND_URL` está configurada en el backend
   - El backend debe reiniciarse después de cambiar variables de entorno

---

## 🔄 Actualizar Despliegues

Cada vez que hagas push a `develop`:

- **Backend:** Se actualiza automáticamente (si `autoDeploy: true` en render.yaml)
- **Frontend:** Se actualiza automáticamente (si auto-deploy está habilitado)

O manualmente:
- Ve a cada servicio en Render
- Click en "Manual Deploy" → "Deploy latest commit"

---

## 🐛 Troubleshooting

### Backend no inicia

1. **Ver logs:**
   - Ve al servicio en Render
   - Click en "Logs"
   - Busca errores

2. **Verificar modelos:**
   - Asegúrate de que `backend/models/optimized/best_optimized_model.pkl` existe
   - Asegúrate de que `backend/models/tfidf_vectorizer.pkl` existe

3. **Verificar dependencias:**
   - Revisa que `requirements.txt` tiene todas las dependencias

### Frontend no se conecta al backend

1. **Verificar variable de entorno:**
   - En el servicio de frontend, verifica que `VITE_API_URL` está configurada
   - Debe ser la URL completa del backend (con `https://`)

2. **Verificar CORS:**
   - En el servicio de backend, verifica que `FRONTEND_URL` está configurada
   - Debe ser la URL completa del frontend (con `https://`)

3. **Verificar en consola del navegador:**
   - Abre F12 → Console
   - Busca errores de CORS o "Failed to fetch"

### Build falla

1. **Backend:**
   - Verifica que `backend/Dockerfile` existe
   - Verifica que `backend/requirements.txt` tiene todas las dependencias

2. **Frontend:**
   - Verifica que `frontend/Dockerfile` existe (si usas Docker)
   - Verifica que `frontend/package.json` tiene todas las dependencias
   - Verifica que el build local funciona: `cd frontend && npm run build`

---

## 📝 Checklist de Despliegue

- [ ] Backend desplegado y funcionando
- [ ] Frontend desplegado y funcionando
- [ ] `FRONTEND_URL` configurada en backend
- [ ] `VITE_API_URL` configurada en frontend
- [ ] Health check del backend responde
- [ ] Frontend carga correctamente
- [ ] Análisis de texto funciona
- [ ] No hay errores de CORS en consola

---

## 💡 Tips

1. **Usa el plan Free** para empezar (tiene limitaciones pero es suficiente)
2. **Auto-deploy desde develop** para actualizaciones automáticas
3. **Guarda las URLs** de ambos servicios
4. **Revisa los logs** si algo no funciona
5. **Los servicios Free se "duermen"** después de 15 min de inactividad - la primera petición será lenta

