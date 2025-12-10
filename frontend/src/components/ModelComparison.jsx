import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, PieChart, Pie } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, XCircle, Brain, Zap, Layers, Award, Target, Activity, Gauge } from 'lucide-react';

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
      f1Test: 0.7407,
      f1Train: 0.7119,
      accuracy: 0.64,
      precision: 0.6452,
      recall: 0.8696,
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
    name: model.name.length > 12 ? model.name.substring(0, 12) + '...' : model.name,
    fullName: model.name,
    'F1 Test': model.f1Test,
    'F1 Train': model.f1Train,
    Overfitting: model.overfitting / 100,
  }));

  // Datos para gráfico radar (métricas del modelo seleccionado)
  const selectedModelRadar = [
    { metric: 'F1-Score', value: optimizedModels[0].f1Test * 100, fullMark: 100 },
    { metric: 'Accuracy', value: optimizedModels[0].accuracy * 100, fullMark: 100 },
    { metric: 'Precision', value: optimizedModels[0].precision * 100, fullMark: 100 },
    { metric: 'Recall', value: optimizedModels[0].recall * 100, fullMark: 100 },
    { metric: 'Balance', value: (100 - optimizedModels[0].overfitting), fullMark: 100 },
  ];

  // Datos para pie chart de distribución de modelos
  const modelDistribution = [
    { name: 'Baseline', value: baselineModels.length, color: '#3B82F6' },
    { name: 'Optimized', value: optimizedModels.length, color: '#10B981' },
    { name: 'Ensemble', value: ensembleModels.length, color: '#F59E0B' },
    { name: 'Transformer', value: 1, color: '#EF4444' },
  ];

  // Datos para línea de evolución F1
  const evolutionData = [
    { stage: 'Baseline', f1: 0.7263, model: 'SVM' },
    { stage: 'Optimized', f1: 0.7407, model: 'SVM (Opt)' },
    { stage: 'Ensemble', f1: 0.6784, model: 'Stacking' },
    { stage: 'Transformer', f1: 0.7027, model: 'DistilBERT' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal':
        return 'from-green-500 to-emerald-600';
      case 'high_overfitting':
        return 'from-red-500 to-rose-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'optimal':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      case 'high_overfitting':
        return 'bg-gradient-to-r from-red-500 to-rose-600 text-white';
      default:
        return 'bg-gradient-to-r from-slate-500 to-slate-600 text-white';
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header con gradiente */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-pink-600 rounded-2xl shadow-2xl p-8 text-white"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Comparativa de Modelos</h2>
              <p className="text-red-100 mt-1">Análisis completo del proceso de desarrollo</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
      </motion.div>

      {/* Proceso de desarrollo - Cards modernos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          { step: 1, title: 'Baseline', desc: '4 modelos clásicos', gradient: 'from-blue-500 to-blue-600', icon: Zap },
          { step: 2, title: 'Optimización', desc: 'Optuna tuning', gradient: 'from-purple-500 to-purple-600', icon: Target },
          { step: 3, title: 'Ensemble', desc: 'Voting & Stacking', gradient: 'from-orange-500 to-orange-600', icon: Layers },
          { step: 4, title: 'Transformers', desc: 'DistilBERT', gradient: 'from-pink-500 to-pink-600', icon: Brain },
        ].map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + idx * 0.1 }}
              className={`relative overflow-hidden bg-gradient-to-br ${stage.gradient} rounded-xl shadow-lg p-6 text-white group hover:scale-105 transition-transform duration-300`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-bold opacity-50">0{stage.step}</span>
                </div>
                <h3 className="text-lg font-bold mb-1">{stage.title}</h3>
                <p className="text-sm opacity-90">{stage.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Gráfico principal: F1-Score comparativo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Comparativa F1-Score</h3>
              <p className="text-sm text-slate-600">Test vs Train por modelo</p>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={f1Data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 1]}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              formatter={(value) => value.toFixed(4)}
            />
            <Legend />
            <Bar dataKey="F1 Test" fill="#3B82F6" radius={[8, 8, 0, 0]} name="F1 Test" />
            <Bar dataKey="F1 Train" fill="#EF4444" radius={[8, 8, 0, 0]} name="F1 Train" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Grid de métricas principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico Radar del modelo seleccionado */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-6 border border-green-200"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-500 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Modelo Seleccionado</h3>
              <p className="text-sm text-slate-600">SVM Optimizado - Métricas completas</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={selectedModelRadar}>
              <PolarGrid stroke="#cbd5e1" />
              <PolarAngleAxis 
                dataKey="metric" 
                tick={{ fill: '#475569', fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]}
                tick={{ fill: '#94a3b8', fontSize: 10 }}
              />
              <Radar
                name="Métricas"
                dataKey="value"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Gráfico de evolución */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Evolución F1-Score</h3>
              <p className="text-sm text-slate-600">Progreso a través de las etapas</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="stage" 
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                domain={[0.4, 0.8]}
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
              <Line 
                type="monotone" 
                dataKey="f1" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Cards de modelos con diseño moderno */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-6"
      >
        <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Gauge className="w-7 h-7 text-red-600" />
          Análisis Detallado por Modelo
        </h3>

        {/* Baseline Models */}
        <div>
          <h4 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Modelos Baseline
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {baselineModels.map((model, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-5 border border-slate-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-bold text-slate-900">{model.name}</h5>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(model.status)}`}>
                    {model.overfitting.toFixed(1)}%
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">F1 Test</span>
                    <span className="font-semibold text-slate-900">{model.f1Test.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Accuracy</span>
                    <span className="font-semibold text-slate-900">{model.accuracy.toFixed(3)}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                      style={{ width: `${model.f1Test * 100}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Optimized Model - Destacado */}
        <div>
          <h4 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-green-600" />
            Modelo Optimizado
          </h4>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-2xl p-6 text-white"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h5 className="text-2xl font-bold mb-1">{optimizedModels[0].name}</h5>
                  <p className="text-green-100 text-sm">{optimizedModels[0].note}</p>
                </div>
                <div className="px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <CheckCircle className="w-8 h-8" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-xs text-green-100 mb-1">F1-Score</div>
                  <div className="text-2xl font-bold">{optimizedModels[0].f1Test.toFixed(4)}</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-xs text-green-100 mb-1">Accuracy</div>
                  <div className="text-2xl font-bold">{optimizedModels[0].accuracy.toFixed(2)}</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-xs text-green-100 mb-1">Precision</div>
                  <div className="text-2xl font-bold">{optimizedModels[0].precision.toFixed(3)}</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-xs text-green-100 mb-1">Overfitting</div>
                  <div className="text-2xl font-bold">{optimizedModels[0].overfitting.toFixed(2)}%</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Ensemble Models */}
        <div>
          <h4 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-600" />
            Modelos Ensemble
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ensembleModels.map((model, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-5 border border-slate-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-bold text-slate-900">{model.name}</h5>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                    {model.overfitting.toFixed(1)}% overfitting
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">F1 Test</span>
                    <span className="font-semibold">{model.f1Test.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Accuracy</span>
                    <span className="font-semibold">{model.accuracy.toFixed(3)}</span>
                  </div>
                  <p className="text-sm text-slate-500 italic mt-3">{model.note}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* DistilBERT - Card especial */}
        <div>
          <h4 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-pink-600" />
            DistilBERT (Transformer)
          </h4>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl shadow-xl p-6 border-2 border-pink-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-pink-500 rounded-xl">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-slate-900">{transformerModel.name}</h5>
                    <p className="text-sm text-slate-600">Modelo Transformer</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-xs text-slate-600 mb-1">F1-Score</div>
                    <div className="text-lg font-bold text-slate-900">{transformerModel.f1Test.toFixed(4)}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-xs text-slate-600 mb-1">Overfitting</div>
                    <div className="text-lg font-bold text-red-600">{transformerModel.overfitting.toFixed(2)}%</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-xs text-slate-600 mb-1">Accuracy</div>
                    <div className="text-lg font-bold text-slate-900">{transformerModel.accuracy.toFixed(3)}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-xs text-slate-600 mb-1">Tamaño</div>
                    <div className="text-lg font-bold text-slate-900">255 MB</div>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-2 mb-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <h6 className="font-semibold text-red-900">Por qué NO se usa:</h6>
                </div>
                <ul className="space-y-2 text-sm text-red-800">
                  {transformerModel.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Conclusión final */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl shadow-2xl p-8 text-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Conclusión: Modelo Seleccionado</h3>
              <p className="text-green-100">SVM Optimizado cumple todos los objetivos</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {[
              { icon: CheckCircle, text: 'Overfitting bajo (2.54% < 5%)' },
              { icon: CheckCircle, text: 'F1-score aceptable (0.7407 > 0.55)' },
              { icon: CheckCircle, text: 'Modelo ligero y rápido' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-3 bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                  <Icon className="w-6 h-6 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ModelComparison;
