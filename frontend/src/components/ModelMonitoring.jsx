import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, TrendingDown, TrendingUp, Activity, RefreshCw } from 'lucide-react';
import { getModelMonitoring } from '../services/api';

export const ModelMonitoring = () => {
  const [monitoring, setMonitoring] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentLimit, setRecentLimit] = useState(100);

  const fetchMonitoring = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getModelMonitoring(recentLimit);
      setMonitoring(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitoring();
    // Auto-refresh cada 30 segundos
    const interval = setInterval(fetchMonitoring, 30000);
    return () => clearInterval(interval);
  }, [recentLimit]);

  if (loading && !monitoring) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-700 font-semibold mb-2">{error}</p>
        {error.includes('Not Found') && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-left">
            <p className="text-yellow-800 text-sm">
              <strong>⚠️ Solución:</strong> El endpoint de monitoreo no está disponible. 
              Por favor, reinicia el servidor backend para cargar el nuevo endpoint.
            </p>
            <p className="text-yellow-700 text-xs mt-2">
              En la terminal donde corre el backend, presiona Ctrl+C y vuelve a ejecutar:
              <code className="block bg-yellow-100 p-2 rounded mt-1">python main.py</code>
            </p>
          </div>
        )}
        <button
          onClick={fetchMonitoring}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!monitoring) return null;

  const { status, alert, historical, recent, comparison } = monitoring;

  // Determinar colores según el estado
  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
        return 'from-green-500 to-emerald-600';
      case 'warning':
        return 'from-yellow-500 to-amber-600';
      case 'degraded':
        return 'from-red-500 to-rose-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-6 h-6" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6" />;
      case 'degraded':
        return <AlertTriangle className="w-6 h-6" />;
      default:
        return <Activity className="w-6 h-6" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'healthy':
        return 'Modelo Saludable';
      case 'warning':
        return 'Atención Requerida';
      case 'degraded':
        return 'Degradación Detectada';
      case 'insufficient_data':
        return 'Datos Insuficientes';
      default:
        return 'Estado Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con estado */}
      <div className={`bg-gradient-to-r ${getStatusColor()} rounded-xl p-6 text-white shadow-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <h2 className="text-2xl font-bold">{getStatusText()}</h2>
              <p className="text-white/90 text-sm mt-1">
                Monitoreo en tiempo real del modelo
              </p>
            </div>
          </div>
          <button
            onClick={fetchMonitoring}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
            title="Actualizar"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-white/20 rounded-lg p-4 backdrop-blur-sm"
          >
            <p className="font-semibold">{alert}</p>
          </motion.div>
        )}
      </div>

      {/* Control de límite reciente */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Predicciones recientes a considerar:
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="50"
            max="500"
            step="50"
            value={recentLimit}
            onChange={(e) => setRecentLimit(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-lg font-semibold text-slate-700 min-w-[60px]">
            {recentLimit}
          </span>
        </div>
      </div>

      {/* Comparación de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estadísticas Históricas */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-md border border-slate-200"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-slate-500" />
            Estadísticas Históricas
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Total de predicciones:</span>
              <span className="font-bold text-slate-800">{historical.total_predictions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Confianza promedio:</span>
              <span className="font-bold text-slate-800">
                {(historical.average_confidence * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Tóxicos:</span>
              <span className="font-bold text-red-600">
                {historical.toxic_count} ({(historical.toxic_percentage).toFixed(1)}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">No tóxicos:</span>
              <span className="font-bold text-green-600">
                {historical.not_toxic_count} ({(historical.not_toxic_percentage).toFixed(1)}%)
              </span>
            </div>
          </div>
        </motion.div>

        {/* Estadísticas Recientes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-md border border-slate-200"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Estadísticas Recientes ({recentLimit} últimas)
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Total de predicciones:</span>
              <span className="font-bold text-slate-800">{recent.total_predictions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Confianza promedio:</span>
              <span className={`font-bold flex items-center gap-2 ${
                comparison.confidence_drop_percentage > 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {(recent.average_confidence * 100).toFixed(2)}%
                {comparison.confidence_drop_percentage > 0 ? (
                  <TrendingDown className="w-4 h-4" />
                ) : (
                  <TrendingUp className="w-4 h-4" />
                )}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Tóxicos:</span>
              <span className="font-bold text-red-600">
                {recent.toxic_count} ({(recent.toxic_percentage).toFixed(1)}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">No tóxicos:</span>
              <span className="font-bold text-green-600">
                {recent.not_toxic_count} ({(recent.not_toxic_percentage).toFixed(1)}%)
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Comparación de confianza */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 shadow-md border border-slate-200"
      >
        <h3 className="text-lg font-bold text-slate-800 mb-4">Análisis de Degradación</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-slate-600 mb-1">Diferencia de Confianza</div>
            <div className={`text-2xl font-bold ${
              comparison.confidence_drop > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {comparison.confidence_drop > 0 ? '-' : '+'}
              {Math.abs(comparison.confidence_drop * 100).toFixed(3)}%
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-slate-600 mb-1">Porcentaje de Cambio</div>
            <div className={`text-2xl font-bold ${
              comparison.confidence_drop_percentage > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {comparison.confidence_drop_percentage > 0 ? '-' : '+'}
              {Math.abs(comparison.confidence_drop_percentage).toFixed(2)}%
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-slate-600 mb-1">Umbral de Alerta</div>
            <div className="text-2xl font-bold text-slate-800">10%</div>
            <div className="text-xs text-slate-500 mt-1">
              {Math.abs(comparison.confidence_drop_percentage) > 10 
                ? '⚠️ Alerta activada' 
                : '✅ Dentro del rango'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> El monitoreo compara las últimas {recentLimit} predicciones 
          con el promedio histórico. Si la confianza promedio baja más del 10%, se activa una alerta.
          Los datos se actualizan automáticamente cada 30 segundos.
        </p>
      </div>
    </div>
  );
};

