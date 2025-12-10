import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Database, BarChart3, FileText, TrendingUp, AlertCircle, Info, Network, Layers, Target, Zap, Sparkles, Activity } from 'lucide-react';

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

  return (
    <motion.div 
      className="space-y-8 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header con gradiente mejorado */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 md:p-10 text-white"
      >
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-2">
            <motion.div 
              className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Database className="w-10 h-10" />
            </motion.div>
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                Análisis Exploratorio de Datos
              </h2>
              <p className="text-blue-100 text-lg">Insights del dataset de comentarios de YouTube</p>
            </div>
          </div>
        </div>
        {/* Elementos decorativos mejorados */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -ml-36 -mb-36 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      </motion.div>

      {/* Resumen del dataset mejorado */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {[
          { label: 'Total Comentarios', value: datasetInfo.totalComments, icon: FileText, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
          { label: 'Tóxicos', value: datasetInfo.toxicCount, icon: AlertCircle, color: 'red', gradient: 'from-red-500 to-pink-500' },
          { label: 'No Tóxicos', value: datasetInfo.notToxicCount, icon: Info, color: 'green', gradient: 'from-green-500 to-emerald-500' },
          { label: 'Balance', value: `${((datasetInfo.notToxicCount / datasetInfo.totalComments) * 100).toFixed(1)}%`, icon: TrendingUp, color: 'purple', gradient: 'from-purple-500 to-indigo-500' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-2xl transition-all duration-300"
            >
              {/* Gradiente de fondo en hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    className={`p-3 bg-gradient-to-br ${item.gradient} rounded-xl shadow-lg`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <Sparkles className="w-5 h-5 text-slate-300 group-hover:text-blue-400 transition-colors" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                  {item.value.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-slate-600">{item.label}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Distribución de clases mejorada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-200 hover:shadow-2xl transition-shadow"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Distribución de Clases</h3>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={classDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {classDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {classDistribution.map((item, idx) => (
              <motion.div 
                key={idx} 
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-5 h-5 rounded-full shadow-md" style={{ backgroundColor: item.color }}></div>
                <div>
                  <div className="font-bold text-slate-900">{item.name}</div>
                  <div className="text-sm text-slate-600">{item.value} ({item.percentage}%)</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Estadísticas descriptivas mejoradas */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-200 hover:shadow-2xl transition-shadow"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Estadísticas Descriptivas</h3>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Longitud de Texto (caracteres)</h4>
              <div className="space-y-2">
                {descriptiveStats.map((stat, idx) => (
                  <motion.div 
                    key={idx} 
                    className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl hover:shadow-md transition-all"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-sm font-medium text-slate-700">{stat.stat}</span>
                    <span className="font-bold text-slate-900 text-lg">{stat.length}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Número de Palabras</h4>
              <div className="space-y-2">
                {descriptiveStats.filter(s => s.words !== '-').map((stat, idx) => (
                  <motion.div 
                    key={idx} 
                    className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl hover:shadow-md transition-all"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-sm font-medium text-slate-700">{stat.stat}</span>
                    <span className="font-bold text-slate-900 text-lg">{stat.words}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Comparación Tóxicos vs No Tóxicos mejorada */}
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-200 hover:shadow-2xl transition-shadow"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Comparación: Tóxicos vs No Tóxicos</h3>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="metric" 
              tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} 
              tickLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 13 }} 
              tickLine={{ stroke: '#cbd5e1' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                padding: '12px'
              }}
              formatter={(value, name) => [`${value.toFixed(1)} ${name === 'toxic' ? 'caracteres' : name === 'notToxic' ? 'caracteres' : ''}`, name === 'toxic' ? 'Tóxicos' : 'No Tóxicos']}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar dataKey="toxic" fill="#EF4444" name="Tóxicos" radius={[12, 12, 0, 0]} />
            <Bar dataKey="notToxic" fill="#10B981" name="No Tóxicos" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {comparisonData.map((item, idx) => (
            <motion.div 
              key={idx} 
              className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl hover:shadow-lg transition-all"
              whileHover={{ scale: 1.03 }}
            >
              <div className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">{item.metric}</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-red-500 shadow-md"></div>
                    <span className="text-sm font-medium text-slate-600">Tóxicos</span>
                  </div>
                  <span className="font-bold text-slate-900 text-lg">{item.toxic.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-green-500 shadow-md"></div>
                    <span className="text-sm font-medium text-slate-600">No Tóxicos</span>
                  </div>
                  <span className="font-bold text-slate-900 text-lg">{item.notToxic.toFixed(1)}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200 text-xs font-semibold text-slate-500">
                Diferencia: {Math.abs(item.toxic - item.notToxic).toFixed(1)} {item.unit}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Distribución de longitud mejorada */}
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-200 hover:shadow-2xl transition-shadow"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Distribución de Longitud de Texto</h3>
        </div>
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={lengthDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="range" 
              tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} 
              tickLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 13 }} 
              tickLine={{ stroke: '#cbd5e1' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                padding: '12px'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar dataKey="toxic" stackId="a" fill="#EF4444" name="Tóxicos" radius={[8, 8, 0, 0]} />
            <Bar dataKey="notToxic" stackId="a" fill="#10B981" name="No Tóxicos" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Análisis de Clustering mejorado */}
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-200 hover:shadow-2xl transition-shadow"
      >
        <div className="flex items-center gap-3 mb-8">
          <motion.div 
            className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Network className="w-6 h-6 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold text-slate-900">Análisis de Clustering</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* KMeans Results */}
          <motion.div 
            className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-indigo-200 hover:border-indigo-400 transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-indigo-500 rounded-lg">
                <Layers className="w-5 h-5 text-white" />
              </div>
              KMeans (k=2)
            </h4>
            <div className="space-y-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-indigo-100">
                <div className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Métricas de Calidad</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                    <div className="text-xs text-slate-600 mb-1">Silhouette</div>
                    <div className="text-2xl font-bold text-indigo-600">0.1516</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                    <div className="text-xs text-slate-600 mb-1">ARI</div>
                    <div className="text-2xl font-bold text-purple-600">0.0082</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border-2 border-red-200 hover:border-red-400 transition-all"
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-slate-700">Cluster 0</span>
                    <span className="text-xs font-semibold text-slate-500 bg-red-100 px-2 py-1 rounded-full">2.6%</span>
                  </div>
                  <div className="text-3xl font-bold text-red-600 mb-2">26</div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-md"></div>
                    <span className="text-sm font-medium text-slate-700">88.5% tóxicos (23/26)</span>
                  </div>
                  <div className="text-xs text-slate-500 italic bg-red-50 p-2 rounded-lg">Cluster pequeño pero muy tóxico</div>
                </motion.div>
                
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border-2 border-blue-200 hover:border-blue-400 transition-all"
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-slate-700">Cluster 1</span>
                    <span className="text-xs font-semibold text-slate-500 bg-blue-100 px-2 py-1 rounded-full">97.4%</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">974</div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-md"></div>
                    <span className="text-sm font-medium text-slate-700">45.1% tóxicos (439/974)</span>
                  </div>
                  <div className="text-xs text-slate-500 italic bg-blue-50 p-2 rounded-lg">Cluster principal con distribución similar</div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* DBSCAN Results */}
          <motion.div 
            className="bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 rounded-2xl p-6 border-2 border-cyan-200 hover:border-cyan-400 transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-cyan-500 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              DBSCAN
            </h4>
            <div className="space-y-4">
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-cyan-100"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Outliers Detectados</div>
                <div className="text-4xl font-bold text-cyan-600 mb-1">81</div>
                <div className="text-sm text-slate-500">8.1% del dataset</div>
              </motion.div>
              
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-orange-100"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Toxicidad en Outliers</div>
                <div className="text-3xl font-bold text-orange-600 mb-1">55.6%</div>
                <div className="text-sm text-slate-500">vs 46.2% promedio general</div>
                <div className="mt-2 text-xs text-slate-500 italic bg-orange-50 p-2 rounded-lg">Mayor proporción de tóxicos</div>
              </motion.div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-cyan-100">
                <div className="text-sm font-bold text-slate-700 mb-2">💡 Insight</div>
                <div className="text-xs text-slate-600 leading-relaxed">
                  Los outliers pueden representar casos extremos de toxicidad o comentarios con características únicas.
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Clustering Insights mejorado */}
        <motion.div 
          className="bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-200"
          whileHover={{ scale: 1.01 }}
        >
          <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Insights del Clustering
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { 
                title: '1. Patrón Específico Detectado', 
                content: 'Cluster 0 identifica un tipo específico de hate speech muy tóxico (88.5%), útil para crear features específicas.',
                color: 'purple'
              },
              { 
                title: '2. Separabilidad Limitada', 
                content: 'Los clusters no se alinean perfectamente con las etiquetas (ARI bajo), sugiriendo subcategorías dentro de tóxicos/no tóxicos.',
                color: 'pink'
              }
            ].map((insight, idx) => (
              <motion.div 
                key={idx}
                className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-purple-100 hover:shadow-xl transition-all"
                whileHover={{ scale: 1.03, y: -3 }}
              >
                <div className={`text-sm font-bold text-${insight.color}-700 mb-2`}>{insight.title}</div>
                <div className="text-xs text-slate-600 leading-relaxed">{insight.content}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Data Augmentation mejorado */}
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-200 hover:shadow-2xl transition-shadow"
      >
        <div className="flex items-center gap-3 mb-8">
          <motion.div 
            className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Zap className="w-6 h-6 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold text-slate-900">Data Augmentation</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Dataset Stats */}
          <motion.div 
            className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-green-200 hover:border-green-400 transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-green-600" />
              Expansión del Dataset
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-slate-200"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Original</div>
                  <div className="text-3xl font-bold text-slate-900">1,000</div>
                  <div className="text-xs text-slate-500">ejemplos</div>
                </motion.div>
                <motion.div 
                  className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-lg border-2 border-green-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Aumentado</div>
                  <div className="text-3xl font-bold text-green-600">1,925</div>
                  <div className="text-xs text-slate-500">ejemplos</div>
                </motion.div>
              </div>
              
              <motion.div 
                className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-5 shadow-lg border-2 border-green-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Incremento</div>
                <div className="text-4xl font-bold text-green-600 mb-1">+92.5%</div>
                <div className="text-sm text-slate-600">925 ejemplos nuevos</div>
              </motion.div>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-slate-200">
                <div className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Distribución Aumentada</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <span className="text-sm font-medium text-slate-700">Tóxicos</span>
                    <span className="font-bold text-red-600 text-lg">910</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-sm font-medium text-slate-700">No Tóxicos</span>
                    <span className="font-bold text-green-600 text-lg">1,015</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-slate-200">
                <div className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Método Utilizado</div>
                <div className="text-sm text-slate-600 font-medium">Reemplazo de sinónimos (synonyms)</div>
              </div>
            </div>
          </motion.div>

          {/* Model Improvements mejorado */}
          <motion.div 
            className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Mejoras del Modelo
            </h4>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {[
                { metric: 'F1-Score', original: '0.6866', augmented: '0.7749', improvement: '+12.87%', color: 'green', bg: 'from-green-100 to-emerald-100' },
                { metric: 'Accuracy', original: '0.5800', augmented: '0.7948', improvement: '+37.04%', color: 'green', bg: 'from-green-100 to-emerald-100' },
                { metric: 'Precision', original: '0.5227', augmented: '0.8047', improvement: '+53.95%', color: 'green', bg: 'from-green-100 to-emerald-100' },
                { metric: 'Recall', original: '1.0000', augmented: '0.7473', improvement: '-25.27%', color: 'orange', bg: 'from-orange-100 to-amber-100' },
                { metric: 'Overfitting', original: '2.54%', augmented: '12.19%', improvement: '+9.65%', color: 'orange', bg: 'from-orange-100 to-amber-100' },
              ].map((item, idx) => (
                <motion.div 
                  key={idx} 
                  className={`bg-gradient-to-br ${item.bg} rounded-xl p-4 shadow-md border border-${item.color}-200 hover:shadow-lg transition-all`}
                  whileHover={{ scale: 1.03, x: 5 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-slate-700">{item.metric}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-md ${
                      item.color === 'green' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                    }`}>
                      {item.improvement}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-white/80 rounded-lg p-3">
                      <div className="text-xs text-slate-500 mb-1">Original</div>
                      <div className="text-sm font-bold text-slate-700">{item.original}</div>
                    </div>
                    <div className="text-2xl text-slate-400">→</div>
                    <div className="flex-1 bg-white/80 rounded-lg p-3">
                      <div className="text-xs text-slate-500 mb-1">Aumentado</div>
                      <div className={`text-sm font-bold ${
                        item.color === 'green' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {item.augmented}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Conclusions mejorado */}
        <motion.div 
          className="bg-gradient-to-r from-green-50 via-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-green-200"
          whileHover={{ scale: 1.01 }}
        >
          <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Activity className="w-6 h-6 text-green-600" />
            Conclusiones
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { 
                icon: '✓', 
                title: 'Mejora Significativa', 
                content: 'F1-Score mejoró en 12.87% y Precision en 53.95%, reduciendo falsos positivos.',
                color: 'green',
                bg: 'from-green-100 to-emerald-100'
              },
              { 
                icon: '✓', 
                title: 'Balance Mejorado', 
                content: 'Aunque el recall disminuyó (-25.27%), el balance general del modelo mejoró notablemente.',
                color: 'green',
                bg: 'from-green-100 to-emerald-100'
              },
              { 
                icon: '⚠', 
                title: 'Overfitting Aumentado', 
                content: 'El overfitting aumentó de 2.54% a 12.19%, pero el modelo general es mejor.',
                color: 'orange',
                bg: 'from-orange-100 to-amber-100'
              },
              { 
                icon: '🚀', 
                title: 'En Producción', 
                content: 'El modelo aumentado se usa en producción con umbral 0.65 para mejor separación de clases.',
                color: 'blue',
                bg: 'from-blue-100 to-indigo-100'
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                className={`bg-gradient-to-br ${item.bg} rounded-xl p-5 shadow-lg border border-${item.color}-200 hover:shadow-xl transition-all`}
                whileHover={{ scale: 1.03, y: -3 }}
              >
                <div className={`text-lg mb-2`}>{item.icon}</div>
                <div className={`text-sm font-bold text-${item.color}-700 mb-2`}>{item.title}</div>
                <div className="text-xs text-slate-600 leading-relaxed">{item.content}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Percentiles y rangos mejorados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-3xl shadow-xl p-6 md:p-8 border-2 border-purple-200 hover:shadow-2xl transition-all"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Percentiles de Longitud</h3>
          </div>
          <div className="space-y-3">
            {percentiles.map((p, idx) => (
              <motion.div 
                key={idx} 
                className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05, x: 5 }}
              >
                <span className="text-sm font-bold text-slate-700">{p.percentile}</span>
                <span className="text-xl font-bold text-purple-600">{p.value} <span className="text-sm text-slate-500">caracteres</span></span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-3xl shadow-xl p-6 md:p-8 border-2 border-blue-200 hover:shadow-2xl transition-all"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
              <Info className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Insights Clave</h3>
          </div>
          <div className="space-y-4">
            {[
              { 
                title: 'Balance del Dataset', 
                content: `El dataset está relativamente balanceado (${classDistribution[0].percentage}% vs ${classDistribution[1].percentage}%), lo que facilita el entrenamiento del modelo.`,
                color: 'blue'
              },
              { 
                title: 'Diferencia en Longitud', 
                content: `Los comentarios tóxicos son ligeramente más largos (${datasetInfo.toxicAvgLength.toFixed(1)} vs ${datasetInfo.notToxicAvgLength.toFixed(1)} caracteres), pero la diferencia es mínima.`,
                color: 'cyan'
              },
              { 
                title: 'Variabilidad', 
                content: `Alta variabilidad en longitud (desv. estándar: ${datasetInfo.stdLength.toFixed(1)}), desde ${datasetInfo.minLength} hasta ${datasetInfo.maxLength} caracteres.`,
                color: 'teal'
              }
            ].map((insight, idx) => (
              <motion.div 
                key={idx}
                className="p-5 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all"
                whileHover={{ scale: 1.03, y: -3 }}
              >
                <div className="text-sm font-bold text-slate-700 mb-2">{insight.title}</div>
                <div className="text-slate-600 text-sm leading-relaxed">{insight.content}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ModelInfo;
