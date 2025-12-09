# 🚀 Cómo Levantar el Servidor del Backend

## ✅ Solución Simple (3 pasos)

### 1. Abre una terminal y ve al directorio backend:
```bash
cd backend
```

### 2. Ejecuta el script Python:
```bash
python3 run_api.py
```

### 3. Espera a ver este mensaje:
```
✅ Modelos encontrados
📡 Iniciando servidor en http://localhost:8000
📚 Documentación disponible en http://localhost:8000/docs
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## 🌐 Acceder a la API

Una vez que veas el mensaje "Uvicorn running", abre en tu navegador:

- **Documentación interactiva**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **API Base**: http://localhost:8000

## 🛑 Detener el Servidor

Presiona `Ctrl+C` en la terminal donde está corriendo.

## ⚠️ Si el Puerto 8000 está Ocupado

Si ves el error "Address already in use":

```bash
# Opción 1: Usar el script que lo libera automáticamente
./start_api.sh

# Opción 2: Liberar manualmente
lsof -ti:8000 | xargs kill -9
```

## 📝 Estructura Actual

Ahora `main.py` está en la raíz de `backend/`, lo que hace más fácil ejecutar:

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

O simplemente:
```bash
cd backend
python3 run_api.py
```

