# 🎨 Plan de Desarrollo del Frontend

## 📋 Objetivo
Crear una interfaz web moderna con React para interactuar con la API de detección de hate speech.

## 🗺️ Plan Paso a Paso

### Fase 1: Configuración Inicial ✅
- [x] Crear estructura básica del proyecto
- [ ] Configurar package.json con dependencias
- [ ] Configurar Vite (o Create React App)
- [ ] Configurar Tailwind CSS
- [ ] Estructura de carpetas básica

### Fase 2: Servicio API
- [ ] Crear servicio para llamadas a la API
- [ ] Configurar URL base de la API
- [ ] Funciones para cada endpoint
- [ ] Manejo de errores

### Fase 3: Componentes Base
- [ ] Layout principal (Header, Footer)
- [ ] Componente de navegación
- [ ] Componentes de UI básicos (Botones, Cards, etc.)

### Fase 4: Página de Análisis Individual
- [ ] Textarea para ingresar texto
- [ ] Botón de análisis
- [ ] Mostrar resultados (Toxic/Not Toxic)
- [ ] Mostrar probabilidades y confianza

### Fase 5: Página de Análisis por Lotes
- [ ] Input para múltiples textos
- [ ] Tabla de resultados
- [ ] Estadísticas del lote

### Fase 6: Página de Análisis de YouTube
- [ ] Input para URL de YouTube
- [ ] Lista de comentarios analizados
- [ ] Filtros y estadísticas

### Fase 7: Mejoras y Pulido
- [ ] Loading states
- [ ] Manejo de errores visual
- [ ] Responsive design
- [ ] Animaciones

## 🛠️ Stack Tecnológico

- **React 18+**: Framework principal
- **Vite**: Build tool (rápido y moderno)
- **Tailwind CSS**: Estilos
- **Axios**: Para llamadas HTTP
- **React Router**: Navegación (si es necesario)

## 📁 Estructura de Carpetas Propuesta

```
frontend/
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── pages/           # Páginas principales
│   ├── services/        # Servicios API
│   ├── utils/           # Utilidades
│   ├── App.jsx          # Componente principal
│   └── main.jsx         # Entry point
├── public/              # Archivos estáticos
├── package.json
└── vite.config.js
```

