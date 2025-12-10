import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, XCircle, Brain, Zap, Layers } from 'lucide-react';

/**
 * Componente ModelComparison - Comparativa de todos los modelos entrenados
 * Muestra el proceso completo: baseline -> optimización -> ensemble -> transformers
 */
export function ModelComparison() {
  // Modelos Baseline (TF-IDF)
  const baselineModels = [
    {
      name: 'Naive Bayes',
      type: 'Baseline',
      vectorizer: 'TF-IDF',
      f1Test: 0.6310,
      f1Train: 0.8691,
      accuracy: 0.6900,
      precision: 0.6974,
      recall: 0.5761,
      overfitting: 23.81,
      status: 'high_overfitting',
    },
    {
      name: 'Logistic Regression',
      type: 'Baseline',
      vectorizer: 'TF-IDF',
      f1Test: 0.7200,
      f1Train: 0.8880,
      accuracy: 0.7550,
      precision: 0.7590,
      recall: 0.6848,
      overfitting: 16.80,
      status: 'high_overfitting',
    },
    {
      name: 'SVM',
      type: 'Baseline',
      vectorizer: 'TF-IDF',
      f1Test: 0.7263,
      f1Train: 0.9113,
      accuracy: 0.7550,
      precision: 0.7471,
      recall: 0.7065,
      overfitting: 18.50,
      status: 'high_overfitting',
    },
    {
      name: 'Random Forest',
      type: 'Baseline',
      vectorizer: 'TF-IDF',
      f1Test: 0.6275,
      f1Train: 0.8400,
      accuracy: 0.7150,
      precision: 0.7869,
      recall: 0.5217,
      overfitting: 21.25,
      status: 'high_overfitting',
    },
  ];

  // Modelos Optimizados
  const optimizedModels = [
    {
      name: 'SVM (Optimized)',
      type: 'Optimized',
      vectorizer: 'TF-IDF',
      f1Test: 0.6866,
      f1Train: 0.7119,
      accuracy: 0.58,
      precision: 0.5227,
      recall: 1.0,
      overfitting: 2.54,
      status: 'optimal',
      params: { C: 0.056, kernel: 'linear' },
      note: 'Seleccionado para producción (umbral optimizado: 0.466)',
    },
  ];

  // Ensemble Models
  const ensembleModels = [
    {
      name: 'Voting Classifier',
      type: 'Ensemble',
      vectorizer: 'TF-IDF',
      f1Test: 0.4651,
      f1Train: 0.7455,
      accuracy: 0.6550,
      precision: 0.8108,
      recall: 0.3261,
      overfitting: 28.04,
      status: 'high_overfitting',
      note: 'No mejora vs modelo individual',
    },
    {
      name: 'Stacking Classifier',
      type: 'Ensemble',
      vectorizer: 'TF-IDF',
      f1Test: 0.6784,
      f1Train: 0.8399,
      accuracy: 0.7250,
      precision: 0.7342,
      recall: 0.6304,
      overfitting: 16.15,
      status: 'high_overfitting',
      note: 'Mejora pero overfitting alto',
    },
  ];

  // DistilBERT
  const transformerModel = {
    name: 'DistilBERT',
    type: 'Transformer',
    vectorizer: 'BERT Tokenizer',
    f1Test: 0.7027,
    f1Train: 0.9468,
    accuracy: 0.7350,
    precision: 0.7027,
    recall: 0.7027,
    overfitting: 24.41,
    status: 'high_overfitting',
    note: 'No cumple objetivo de overfitting < 6%',
    reasons: [
      'Overfitting muy alto (24.41% > 6%)',
      'Dataset pequeño (1000 ejemplos) para transformers',
      'Tiempo de entrenamiento mucho mayor',
      'Modelo muy pesado (255MB)',
      'SVM optimizado es más eficiente y cumple objetivos',
    ],
  };

  // Combinar todos los modelos para gráficos
  const allModels = [
    ...baselineModels,
    ...optimizedModels,
    ...ensembleModels,
    transformerModel,
  ];

  // Datos para gráfico de F1-score
  const f1Data = allModels.map(model => ({
    name: model.name,
    'F1 Test': model.f1Test,
    'F1 Train': model.f1Train,
    Overfitting: model.overfitting / 100,
  }));

  // Datos para gráfico de overfitting
  const overfittingData = allModels.map(model => ({
    name: model.name.length > 15 ? model.name.substring(0, 15) + '...' : model.name,
    'Overfitting (%)': model.overfitting,
  }));

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'high_overfitting':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-slate-100 border-slate-300 text-slate-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'optimal':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'high_overfitting':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
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
          <Layers className="w-8 h-8 text-red-600" />
          <h2 className="text-2xl font-bold text-slate-900">Comparativa de Modelos</h2>
        </div>
        <p className="text-slate-600">
          Proceso completo de desarrollo: desde modelos baseline hasta transformers, 
          mostrando por qué se seleccionó SVM optimizado para producción.
        </p>
      </motion.div>

      {/* Proceso de desarrollo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Proceso de Desarrollo</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm font-semibold text-blue-900 mb-2">1. Baseline</div>
            <div className="text-xs text-blue-700">4 modelos clásicos con TF-IDF</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-sm font-semibold text-purple-900 mb-2">2. Optimización</div>
            <div className="text-xs text-purple-700">Optuna para reducir overfitting</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-sm font-semibold text-orange-900 mb-2">3. Ensemble</div>
            <div className="text-xs text-orange-700">Voting y Stacking</div>
          </div>
          <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
            <div className="text-sm font-semibold text-pink-900 mb-2">4. Transformers</div>
            <div className="text-xs text-pink-700">DistilBERT evaluado</div>
          </div>
        </div>
      </motion.div>

      {/* Gráfico F1-Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Comparativa F1-Score (Test vs Train)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={f1Data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="F1 Test" fill="#3B82F6" name="F1 Test" />
            <Bar dataKey="F1 Train" fill="#EF4444" name="F1 Train" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Gráfico Overfitting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Overfitting por Modelo</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={overfittingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Overfitting (%)" fill="#F59E0B">
              {overfittingData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry['Overfitting (%)'] < 5 ? '#10B981' : entry['Overfitting (%)'] < 10 ? '#F59E0B' : '#EF4444'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Overfitting &lt; 5% (Óptimo)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Overfitting 5-10% (Aceptable)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Overfitting &gt; 10% (Alto)</span>
          </div>
        </div>
      </motion.div>

      {/* Tabla comparativa detallada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto"
      >
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Tabla Comparativa Detallada</h3>
        <div className="space-y-4">
          {/* Baseline Models */}
          <div>
            <h4 className="text-md font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Modelos Baseline (TF-IDF)
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Modelo</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">F1 Test</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Accuracy</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Precision</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Recall</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Overfitting</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Estado</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {baselineModels.map((model, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{model.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{model.f1Test.toFixed(4)}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{model.accuracy.toFixed(4)}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{model.precision.toFixed(4)}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{model.recall.toFixed(4)}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{model.overfitting.toFixed(2)}%</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(model.status)}`}>
                          Alto Overfitting
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Optimized Models */}
          <div>
            <h4 className="text-md font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Modelos Optimizados (Optuna)
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Modelo</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">F1 Test</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Accuracy</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Overfitting</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Parámetros</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Estado</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {optimizedModels.map((model, idx) => (
                    <tr key={idx} className="hover:bg-green-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{model.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{model.f1Test.toFixed(4)}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{model.accuracy.toFixed(4)}</td>
                      <td className="px-4 py-3 text-sm text-green-600 font-semibold">{model.overfitting.toFixed(2)}%</td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        C={model.params.C}, kernel={model.params.kernel}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-300">
                          ✅ Seleccionado
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-sm text-slate-600 italic">{optimizedModels[0].note}</p>
            </div>
          </div>

          {/* Ensemble Models */}
          <div>
            <h4 className="text-md font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Modelos Ensemble
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Modelo</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">F1 Test</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Overfitting</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Nota</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {ensembleModels.map((model, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{model.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{model.f1Test.toFixed(4)}</td>
                      <td className="px-4 py-3 text-sm text-red-600">{model.overfitting.toFixed(2)}%</td>
                      <td className="px-4 py-3 text-sm text-slate-600 italic">{model.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* DistilBERT */}
          <div>
            <h4 className="text-md font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Brain className="w-4 h-4 text-pink-600" />
              DistilBERT (Transformer)
            </h4>
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-xs text-slate-600 mb-1">F1 Test</div>
                  <div className="text-lg font-semibold text-slate-900">{transformerModel.f1Test.toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-600 mb-1">Accuracy</div>
                  <div className="text-lg font-semibold text-slate-900">{transformerModel.accuracy.toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-600 mb-1">Overfitting</div>
                  <div className="text-lg font-semibold text-red-600">{transformerModel.overfitting.toFixed(2)}%</div>
                </div>
                <div>
                  <div className="text-xs text-slate-600 mb-1">Tamaño</div>
                  <div className="text-lg font-semibold text-slate-900">255 MB</div>
                </div>
              </div>
              <div className="mb-3">
                <div className="text-sm font-semibold text-pink-900 mb-2">❌ Por qué NO se usa DistilBERT:</div>
                <ul className="space-y-1 text-sm text-pink-800">
                  {transformerModel.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-sm text-slate-600 italic">{transformerModel.note}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Conclusión */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-green-50 border border-green-200 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Conclusión: Modelo Seleccionado
        </h3>
        <div className="space-y-3 text-sm text-green-800">
          <p>
            <strong>SVM Optimizado</strong> fue seleccionado para producción porque:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>✅ Overfitting bajo (2.54% &lt; 5%) - cumple objetivo</li>
            <li>✅ F1-score aceptable (0.6866 &gt; 0.55) - cumple objetivo</li>
            <li>✅ Modelo ligero y rápido para producción</li>
            <li>✅ Umbral optimizado (0.466) mejora balance precision-recall</li>
            <li>✅ Mejor que ensembles (no mejoran significativamente)</li>
            <li>✅ Mejor que DistilBERT (overfitting muy alto, modelo pesado)</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

export default ModelComparison;

