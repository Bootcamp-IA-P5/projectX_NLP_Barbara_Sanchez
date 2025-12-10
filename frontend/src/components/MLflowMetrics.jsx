import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Database, TrendingUp, Activity, Zap, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { getMLflowExperiments } from '../services/api';

/**
 * Componente MLflowMetrics - Muestra experimentos y métricas de MLflow
 */
export function MLflowMetrics() {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExperiments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMLflowExperiments();
      setExperiments(data.experiments || []);
    } catch (err) {
      setError(err.message || 'Error al cargar experimentos de MLflow');
      console.error('Error fetching MLflow experiments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiments();
  }, []);

  // Preparar datos para gráficos
  const allRuns = experiments.flatMap(exp => 
    exp.runs.map(run => ({
      name: run.run_name || run.run_id.substring(0, 8),
      experiment: exp.name,
      f1_test: run.metrics?.f1_test || 0,
      f1_train: run.metrics?.f1_train || 0,
      accuracy: run.metrics?.accuracy_test || 0,
      precision: run.metrics?.precision_test || 0,
      recall: run.metrics?.recall_test || 0,
      overfitting: run.metrics?.overfitting || 0,
      status: run.status,
    }))
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Cargando experimentos de MLflow...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <h3 className="text-xl font-bold text-slate-900">Error al cargar MLflow</h3>
        </div>
        <p className="text-slate-600 mb-4">{error}</p>
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-sm text-slate-700 mb-2">Para ver los experimentos de MLflow:</p>
          <code className="text-sm text-slate-800 block bg-white p-2 rounded">
            cd backend && mlflow ui
          </code>
          <p className="text-sm text-slate-500 mt-2">
            Luego accede a <a href="http://localhost:5000" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">http://localhost:5000</a>
          </p>
        </div>
      </motion.div>
    );
  }

  if (experiments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-slate-900">No hay experimentos de MLflow</h3>
        </div>
        <p className="text-slate-600 mb-4">
          No se encontraron experimentos de MLflow. Ejecuta algunos entrenamientos primero.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            Los experimentos se guardan automáticamente cuando entrenas modelos usando el módulo de MLflow tracking.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-8 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white"
      >
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Database className="w-10 h-10" />
            </motion.div>
            <div>
              <h2 className="text-4xl font-bold mb-2">MLflow Experiments</h2>
              <p className="text-blue-100 text-lg">
                {experiments.length} experimento{experiments.length !== 1 ? 's' : ''} • {allRuns.length} run{allRuns.length !== 1 ? 's' : ''} total{allRuns.length !== 1 ? 'es' : ''}
              </p>
            </div>
          </div>
          <motion.button
            onClick={fetchExperiments}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-white/20 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            <RefreshCw className="w-6 h-6" />
          </motion.button>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
      </motion.div>

      {/* Gráfico de F1-Score de todos los runs */}
      {allRuns.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Comparativa F1-Score (Test vs Train)</h3>
              <p className="text-sm text-slate-600">Todos los runs de MLflow</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={allRuns.slice(0, 20)} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                tick={{ fill: '#64748b', fontSize: 11 }}
              />
              <YAxis 
                domain={[0, 1]}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                formatter={(value) => value.toFixed(4)}
              />
              <Legend />
              <Bar dataKey="f1_test" fill="#3B82F6" name="F1 Test" radius={[8, 8, 0, 0]} />
              <Bar dataKey="f1_train" fill="#EF4444" name="F1 Train" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Lista de experimentos */}
      {experiments.map((exp, expIdx) => (
        <motion.div
          key={exp.experiment_id}
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Activity className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{exp.name}</h3>
                <p className="text-sm text-slate-600">{exp.runs_count} run{exp.runs_count !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
              ID: {exp.experiment_id}
            </span>
          </div>

          {exp.runs.length > 0 ? (
            <div className="space-y-4">
              {exp.runs.map((run, runIdx) => (
                <motion.div
                  key={run.run_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: expIdx * 0.1 + runIdx * 0.05 }}
                  className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900">{run.run_name || run.run_id.substring(0, 12)}</h4>
                      <p className="text-xs text-slate-500">Run ID: {run.run_id.substring(0, 8)}...</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {run.status === 'FINISHED' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        run.status === 'FINISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {run.status}
                      </span>
                    </div>
                  </div>
                  
                  {run.metrics && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {Object.entries(run.metrics).map(([key, value]) => (
                        value !== null && (
                          <div key={key} className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="text-xs text-slate-500 mb-1 capitalize">{key.replace('_', ' ')}</div>
                            <div className="text-lg font-bold text-slate-900">
                              {typeof value === 'number' ? value.toFixed(4) : value}
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  )}

                  {Object.keys(run.params || {}).length > 0 && (
                    <details className="mt-4">
                      <summary className="text-sm font-semibold text-slate-700 cursor-pointer hover:text-slate-900">
                        Ver parámetros ({Object.keys(run.params).length})
                      </summary>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(run.params).map(([key, value]) => (
                          <div key={key} className="bg-white rounded p-2 text-xs">
                            <span className="font-semibold text-slate-600">{key}:</span>{' '}
                            <span className="text-slate-900">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              No hay runs en este experimento
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

export default MLflowMetrics;
