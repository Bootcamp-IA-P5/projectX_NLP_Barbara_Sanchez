import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Brain, Database, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

/**
 * Componente ModelInfo - Información completa del modelo
 * Muestra métricas, matriz de confusión, datos del EDA, etc.
 */
export function ModelInfo() {
  // Datos del modelo (con umbral óptimo 0.466)
  const modelMetrics = {
    name: 'SVM (Optimized)',
    vectorizer: 'TF-IDF',
    vocabulary: 1000,
    f1Score: 0.7407,
    accuracy: 0.64,
    precision: 0.6452,
    recall: 0.8696,
    overfitting: 2.54,
    trainF1: 0.7119,
    threshold: 0.466,
  };

  // Datos del dataset (EDA) - Valores reales
  const datasetInfo = {
    totalComments: 1000,
    toxicCount: 462,
    notToxicCount: 538,
    avgLength: 98.4,
    avgWords: 16.1,
  };

  // Matriz de confusión (con umbral óptimo 0.466)
  const confusionMatrix = [
    { name: 'Verdaderos Negativos', value: 64, color: '#10B981' },
    { name: 'Falsos Positivos', value: 44, color: '#F59E0B' },
    { name: 'Falsos Negativos', value: 12, color: '#EF4444' },
    { name: 'Verdaderos Positivos', value: 80, color: '#3B82F6' },
  ];

  // Métricas de entrenamiento vs test
  const metricsComparison = [
    { metric: 'F1-Score', train: modelMetrics.trainF1, test: modelMetrics.f1Score },
    { metric: 'Accuracy', train: 0.6288, test: modelMetrics.accuracy },
    { metric: 'Precision', train: 0.5552, test: modelMetrics.precision },
    { metric: 'Recall', train: 0.9919, test: modelMetrics.recall },
  ];

  // Parámetros del modelo
  const modelParams = {
    C: 0.056,
    kernel: 'linear',
    classWeight: 'balanced',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-red-600" />
          <h2 className="text-2xl font-bold text-slate-900">Información del Modelo</h2>
        </div>
        <p className="text-slate-600">
          Modelo SVM optimizado con Optuna para detección de hate speech en comentarios de YouTube.
        </p>
      </motion.div>

      {/* Grid de información principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Métricas principales */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Métricas del Modelo
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">F1-Score (Test)</span>
              <span className="font-semibold text-slate-900">{modelMetrics.f1Score.toFixed(4)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Accuracy</span>
              <span className="font-semibold text-slate-900">{modelMetrics.accuracy.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Precision</span>
              <span className="font-semibold text-slate-900">{modelMetrics.precision.toFixed(4)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Recall</span>
              <span className="font-semibold text-slate-900">
                {modelMetrics.recall.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Overfitting</span>
              <span className={`font-semibold ${modelMetrics.overfitting < 5 ? 'text-green-600' : 'text-red-600'}`}>
                {modelMetrics.overfitting.toFixed(2)}%
                {modelMetrics.overfitting < 5 && (
                  <CheckCircle className="w-4 h-4 inline ml-1 text-green-600" />
                )}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Información del dataset */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-green-600" />
            Datos del Dataset (EDA)
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Total Comentarios</span>
              <span className="font-semibold text-slate-900">{datasetInfo.totalComments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Tóxicos</span>
              <span className="font-semibold text-red-600">
                {datasetInfo.toxicCount} ({(datasetInfo.toxicCount / datasetInfo.totalComments * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">No Tóxicos</span>
              <span className="font-semibold text-green-600">
                {datasetInfo.notToxicCount} ({(datasetInfo.notToxicCount / datasetInfo.totalComments * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Longitud Promedio</span>
              <span className="font-semibold text-slate-900">{datasetInfo.avgLength} caracteres</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Palabras Promedio</span>
              <span className="font-semibold text-slate-900">{datasetInfo.avgWords} palabras</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Matriz de confusión */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Matriz de Confusión (Test)</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-sm text-slate-600 mb-1">Verdaderos Negativos</div>
            <div className="text-2xl font-bold text-green-600">{confusionMatrix[0].value}</div>
            <div className="text-xs text-slate-500 mt-1">Correctamente predichos como No Tóxicos</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="text-sm text-slate-600 mb-1">Falsos Positivos</div>
            <div className="text-2xl font-bold text-yellow-600">{confusionMatrix[1].value}</div>
            <div className="text-xs text-slate-500 mt-1">Incorrectamente predichos como Tóxicos</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="text-sm text-slate-600 mb-1">Falsos Negativos</div>
            <div className="text-2xl font-bold text-red-600">{confusionMatrix[2].value}</div>
            <div className="text-xs text-slate-500 mt-1">Incorrectamente predichos como No Tóxicos</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-sm text-slate-600 mb-1">Verdaderos Positivos</div>
            <div className="text-2xl font-bold text-blue-600">{confusionMatrix[3].value}</div>
            <div className="text-xs text-slate-500 mt-1">Correctamente predichos como Tóxicos</div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Umbral Optimizado</p>
              <p className="text-sm text-blue-700 mt-1">
                El modelo usa un umbral de decisión de {modelMetrics.threshold} (en lugar de 0.5) para balancear 
                precision y recall. Esto reduce los falsos positivos de 85 a 44, manteniendo un recall de 87%.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Comparación Train vs Test */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Comparación Train vs Test</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={metricsComparison}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="metric" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="train" fill="#3B82F6" name="Train" />
            <Bar dataKey="test" fill="#EF4444" name="Test" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Parámetros del modelo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Parámetros del Modelo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-600 mb-1">C (Regularización)</div>
            <div className="text-lg font-semibold text-slate-900">{modelParams.C}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-600 mb-1">Kernel</div>
            <div className="text-lg font-semibold text-slate-900">{modelParams.kernel}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-600 mb-1">Class Weight</div>
            <div className="text-lg font-semibold text-slate-900">{modelParams.classWeight}</div>
          </div>
        </div>
      </motion.div>

      {/* Información técnica */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Información Técnica</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Vectorizador</span>
            <span className="font-semibold text-slate-900">{modelMetrics.vectorizer}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Tamaño del Vocabulario</span>
            <span className="font-semibold text-slate-900">{modelMetrics.vocabulary} palabras</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Preprocesamiento</span>
            <span className="font-semibold text-slate-900">spaCy (en_core_web_sm)</span>
          </div>
        </div>
      </motion.div>

      {/* Limitaciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-yellow-50 border border-yellow-200 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Limitaciones del Modelo
        </h3>
        <ul className="space-y-2 text-sm text-yellow-800">
          <li className="flex items-start gap-2">
            <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>El modelo está entrenado solo con datos en inglés. Los resultados pueden ser menos precisos para otros idiomas.</span>
          </li>
          <li className="flex items-start gap-2">
            <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>El modelo usa un umbral de decisión optimizado ({modelMetrics.threshold}) para balancear precision y recall.</span>
          </li>
          <li className="flex items-start gap-2">
            <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Vocabulario limitado (1000 palabras) puede afectar la precisión con textos fuera del vocabulario.</span>
          </li>
          <li className="flex items-start gap-2">
            <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>El umbral de decisión se ha ajustado a 0.6 para reducir falsos positivos.</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}

export default ModelInfo;
