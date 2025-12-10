import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Database, BarChart3, FileText, TrendingUp, AlertCircle, Info, Network, Layers, Target, Zap } from 'lucide-react';

/**
 * Componente ModelInfo - Enfocado en EDA (Análisis Exploratorio de Datos)
 * Muestra análisis del dataset, distribuciones, características del texto, etc.
 */
export function ModelInfo() {
  // Datos del dataset (EDA) - Valores reales
  const datasetInfo = {
    totalComments: 1000,
    toxicCount: 462,
    notToxicCount: 538,
    avgLength: 98.4,
    medianLength: 53.0,
    minLength: 3,
    maxLength: 2184,
    stdLength: 142.5,
    avgWords: 16.1,
    medianWords: 9.0,
    minWords: 1,
    maxWords: 338,
    toxicAvgLength: 102.0,
    notToxicAvgLength: 95.2,
    toxicAvgWords: 16.9,
    notToxicAvgWords: 15.4,
  };

  // Distribución de clases
  const classDistribution = [
    { name: 'No Tóxicos', value: datasetInfo.notToxicCount, color: '#10B981', percentage: (datasetInfo.notToxicCount / datasetInfo.totalComments * 100).toFixed(1) },
    { name: 'Tóxicos', value: datasetInfo.toxicCount, color: '#EF4444', percentage: (datasetInfo.toxicCount / datasetInfo.totalComments * 100).toFixed(1) },
  ];

  // Datos para histograma simulado de longitud (distribución aproximada)
  const lengthDistribution = [
    { range: '0-50', toxic: 120, notToxic: 180 },
    { range: '50-100', toxic: 150, notToxic: 200 },
    { range: '100-150', toxic: 100, notToxic: 100 },
    { range: '150-200', toxic: 60, notToxic: 40 },
    { range: '200-300', toxic: 25, notToxic: 15 },
    { range: '300+', toxic: 7, notToxic: 3 },
  ];

  // Datos para comparación tóxicos vs no tóxicos
  const comparisonData = [
    { metric: 'Longitud Promedio', toxic: datasetInfo.toxicAvgLength, notToxic: datasetInfo.notToxicAvgLength, unit: 'caracteres' },
    { metric: 'Palabras Promedio', toxic: datasetInfo.toxicAvgWords, notToxic: datasetInfo.notToxicAvgWords, unit: 'palabras' },
  ];

  // Estadísticas descriptivas
  const descriptiveStats = [
    { stat: 'Media', length: datasetInfo.avgLength, words: datasetInfo.avgWords },
    { stat: 'Mediana', length: datasetInfo.medianLength, words: datasetInfo.medianWords },
    { stat: 'Mínimo', length: datasetInfo.minLength, words: datasetInfo.minWords },
    { stat: 'Máximo', length: datasetInfo.maxLength, words: datasetInfo.maxWords },
    { stat: 'Desv. Estándar', length: datasetInfo.stdLength.toFixed(1), words: '-' },
  ];

  // Percentiles de longitud
  const percentiles = [
    { percentile: 'P25', value: 28 },
    { percentile: 'P50 (Mediana)', value: 53 },
    { percentile: 'P75', value: 120 },
    { percentile: 'P90', value: 220 },
    { percentile: 'P95', value: 350 },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Header con gradiente */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Database className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Análisis Exploratorio de Datos (EDA)</h2>
              <p className="text-blue-100 mt-1">Insights del dataset de comentarios de YouTube</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
      </motion.div>

      {/* Resumen del dataset */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Comentarios', value: datasetInfo.totalComments, icon: FileText, color: 'blue' },
          { label: 'Tóxicos', value: datasetInfo.toxicCount, icon: AlertCircle, color: 'red' },
          { label: 'No Tóxicos', value: datasetInfo.notToxicCount, icon: Info, color: 'green' },
          { label: 'Balance', value: `${((datasetInfo.notToxicCount / datasetInfo.totalComments) * 100).toFixed(1)}%`, icon: TrendingUp, color: 'purple' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + idx * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 bg-${item.color}-100 rounded-lg`}>
                  <Icon className={`w-5 h-5 text-${item.color}-600`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{item.value}</div>
              <div className="text-sm text-slate-600">{item.label}</div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Distribución de clases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Distribución de Clases
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={classDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {classDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {classDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                <div>
                  <div className="font-semibold text-slate-900">{item.name}</div>
                  <div className="text-sm text-slate-600">{item.value} comentarios ({item.percentage}%)</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Estadísticas descriptivas */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-6">Estadísticas Descriptivas</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Longitud de Texto (caracteres)</h4>
              <div className="space-y-2">
                {descriptiveStats.map((stat, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">{stat.stat}</span>
                    <span className="font-semibold text-slate-900">{stat.length}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Número de Palabras</h4>
              <div className="space-y-2">
                {descriptiveStats.filter(s => s.words !== '-').map((stat, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">{stat.stat}</span>
                    <span className="font-semibold text-slate-900">{stat.words}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Comparación Tóxicos vs No Tóxicos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200"
      >
        <h3 className="text-xl font-bold text-slate-900 mb-6">Comparación: Tóxicos vs No Tóxicos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
              formatter={(value, name) => [`${value.toFixed(1)} ${name === 'toxic' ? 'caracteres' : name === 'notToxic' ? 'caracteres' : ''}`, name === 'toxic' ? 'Tóxicos' : 'No Tóxicos']}
            />
            <Legend />
            <Bar dataKey="toxic" fill="#EF4444" name="Tóxicos" radius={[8, 8, 0, 0]} />
            <Bar dataKey="notToxic" fill="#10B981" name="No Tóxicos" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {comparisonData.map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-lg">
              <div className="text-sm font-semibold text-slate-700 mb-3">{item.metric}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-slate-600">Tóxicos</span>
                  <span className="font-bold text-slate-900">{item.toxic.toFixed(1)} {item.unit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-slate-600">No Tóxicos</span>
                  <span className="font-bold text-slate-900">{item.notToxic.toFixed(1)} {item.unit}</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Diferencia: {Math.abs(item.toxic - item.notToxic).toFixed(1)} {item.unit}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Distribución de longitud */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200"
      >
        <h3 className="text-xl font-bold text-slate-900 mb-6">Distribución de Longitud de Texto</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={lengthDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="toxic" stackId="a" fill="#EF4444" name="Tóxicos" />
            <Bar dataKey="notToxic" stackId="a" fill="#10B981" name="No Tóxicos" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Análisis de Clustering */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Network className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Análisis de Clustering</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* KMeans Results */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
            <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              KMeans (k=2)
            </h4>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-slate-600 mb-2">Métricas de Calidad</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-slate-500">Silhouette Score</div>
                    <div className="text-lg font-bold text-indigo-600">0.1516</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Adjusted Rand Index</div>
                    <div className="text-lg font-bold text-indigo-600">0.0082</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700">Cluster 0</span>
                    <span className="text-xs text-slate-500">2.6% del dataset</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600 mb-1">26 ejemplos</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-sm text-slate-600">88.5% tóxicos (23/26)</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500 italic">Cluster pequeño pero muy tóxico</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700">Cluster 1</span>
                    <span className="text-xs text-slate-500">97.4% del dataset</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">974 ejemplos</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-slate-600">45.1% tóxicos (439/974)</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500 italic">Cluster principal con distribución similar al dataset</div>
                </div>
              </div>
            </div>
          </div>

          {/* DBSCAN Results */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
            <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-600" />
              DBSCAN
            </h4>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-slate-600 mb-2">Outliers Detectados</div>
                <div className="text-3xl font-bold text-cyan-600 mb-1">81</div>
                <div className="text-sm text-slate-500">8.1% del dataset</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-slate-600 mb-2">Toxicidad en Outliers</div>
                <div className="text-2xl font-bold text-orange-600 mb-1">55.6%</div>
                <div className="text-sm text-slate-500">vs 46.2% promedio general</div>
                <div className="mt-2 text-xs text-slate-500 italic">Mayor proporción de tóxicos que el promedio</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm font-semibold text-slate-700 mb-2">Insight</div>
                <div className="text-xs text-slate-600">
                  Los outliers pueden representar casos extremos de toxicidad o comentarios con características únicas.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clustering Insights */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">💡 Insights del Clustering</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm font-semibold text-slate-700 mb-2">1. Patrón Específico Detectado</div>
              <div className="text-xs text-slate-600">
                Cluster 0 identifica un tipo específico de hate speech muy tóxico (88.5%), útil para crear features específicas.
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm font-semibold text-slate-700 mb-2">2. Separabilidad Limitada</div>
              <div className="text-xs text-slate-600">
                Los clusters no se alinean perfectamente con las etiquetas (ARI bajo), sugiriendo subcategorías dentro de tóxicos/no tóxicos.
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Data Augmentation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Zap className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Data Augmentation</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Dataset Stats */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Expansión del Dataset</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-slate-500 mb-1">Original</div>
                  <div className="text-2xl font-bold text-slate-900">1,000</div>
                  <div className="text-xs text-slate-500">ejemplos</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-slate-500 mb-1">Aumentado</div>
                  <div className="text-2xl font-bold text-green-600">1,925</div>
                  <div className="text-xs text-slate-500">ejemplos</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-slate-600 mb-2">Incremento</div>
                <div className="text-3xl font-bold text-green-600 mb-1">+92.5%</div>
                <div className="text-sm text-slate-500">925 ejemplos nuevos</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm font-semibold text-slate-700 mb-3">Distribución Aumentada</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Tóxicos</span>
                    <span className="font-bold text-red-600">910</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">No Tóxicos</span>
                    <span className="font-bold text-green-600">1,015</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm font-semibold text-slate-700 mb-2">Método Utilizado</div>
                <div className="text-sm text-slate-600">Reemplazo de sinónimos (synonyms)</div>
              </div>
            </div>
          </div>

          {/* Model Improvements */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Mejoras del Modelo</h4>
            <div className="space-y-3">
              {[
                { metric: 'F1-Score', original: '0.6866', augmented: '0.7749', improvement: '+12.87%', color: 'green' },
                { metric: 'Accuracy', original: '0.5800', augmented: '0.7948', improvement: '+37.04%', color: 'green' },
                { metric: 'Precision', original: '0.5227', augmented: '0.8047', improvement: '+53.95%', color: 'green' },
                { metric: 'Recall', original: '1.0000', augmented: '0.7473', improvement: '-25.27%', color: 'orange' },
                { metric: 'Overfitting', original: '2.54%', augmented: '12.19%', improvement: '+9.65%', color: 'orange' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700">{item.metric}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      item.color === 'green' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {item.improvement}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="text-xs text-slate-500">Original</div>
                      <div className="text-sm font-semibold text-slate-600">{item.original}</div>
                    </div>
                    <div className="text-slate-400">→</div>
                    <div className="flex-1">
                      <div className="text-xs text-slate-500">Aumentado</div>
                      <div className={`text-sm font-bold ${
                        item.color === 'green' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {item.augmented}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conclusions */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">✅ Conclusiones</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm font-semibold text-green-700 mb-2">✓ Mejora Significativa</div>
              <div className="text-xs text-slate-600">
                F1-Score mejoró en 12.87% y Precision en 53.95%, reduciendo falsos positivos.
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm font-semibold text-green-700 mb-2">✓ Balance Mejorado</div>
              <div className="text-xs text-slate-600">
                Aunque el recall disminuyó (-25.27%), el balance general del modelo mejoró notablemente.
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm font-semibold text-orange-700 mb-2">⚠ Overfitting Aumentado</div>
              <div className="text-xs text-slate-600">
                El overfitting aumentó de 2.54% a 12.19%, pero el modelo general es mejor.
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm font-semibold text-blue-700 mb-2">🚀 En Producción</div>
              <div className="text-xs text-slate-600">
                El modelo aumentado se usa en producción con umbral 0.65 para mejor separación de clases.
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Percentiles y rangos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-xl p-6 border border-purple-200"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4">Percentiles de Longitud</h3>
          <div className="space-y-3">
            {percentiles.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className="text-sm font-medium text-slate-700">{p.percentile}</span>
                <span className="text-lg font-bold text-purple-600">{p.value} caracteres</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-xl p-6 border border-blue-200"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4">Insights Clave</h3>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm font-semibold text-slate-700 mb-2">Balance del Dataset</div>
              <div className="text-slate-600 text-sm">
                El dataset está relativamente balanceado ({classDistribution[0].percentage}% vs {classDistribution[1].percentage}%), 
                lo que facilita el entrenamiento del modelo.
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm font-semibold text-slate-700 mb-2">Diferencia en Longitud</div>
              <div className="text-slate-600 text-sm">
                Los comentarios tóxicos son ligeramente más largos ({datasetInfo.toxicAvgLength.toFixed(1)} vs {datasetInfo.notToxicAvgLength.toFixed(1)} caracteres), 
                pero la diferencia es mínima.
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm font-semibold text-slate-700 mb-2">Variabilidad</div>
              <div className="text-slate-600 text-sm">
                Alta variabilidad en longitud (desv. estándar: {datasetInfo.stdLength.toFixed(1)}), 
                desde {datasetInfo.minLength} hasta {datasetInfo.maxLength} caracteres.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ModelInfo;
