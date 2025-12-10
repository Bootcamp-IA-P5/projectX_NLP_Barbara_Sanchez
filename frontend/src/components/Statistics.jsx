import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, Shield } from 'lucide-react';

/**
 * Componente Statistics - Muestra estadísticas de los análisis
 * @param {Array} results - Array de resultados del análisis
 */
export function Statistics({ results = [] }) {
  if (results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">Realiza algunos análisis para ver estadísticas</p>
      </div>
    );
  }

  const hatefulCount = results.filter(r => r.isHateful).length;
  const safeCount = results.length - hatefulCount;
  const hatefulPercentage = (hatefulCount / results.length) * 100;

  const categoryData = [
    { name: 'Tóxico', value: 0 },
    { name: 'Sev. Tóxico', value: 0 },
    { name: 'Obsceno', value: 0 },
    { name: 'Amenaza', value: 0 },
    { name: 'Insulto', value: 0 },
    { name: 'Odio Ident.', value: 0 },
  ];

  results.forEach(result => {
    if (result.isHateful && result.categories) {
      categoryData[0].value += result.categories.toxic || 0;
      categoryData[1].value += result.categories.severe_toxic || 0;
      categoryData[2].value += result.categories.obscene || 0;
      categoryData[3].value += result.categories.threat || 0;
      categoryData[4].value += result.categories.insult || 0;
      categoryData[5].value += result.categories.identity_hate || 0;
    }
  });

  const pieData = [
    { name: 'Odio Detectado', value: hatefulCount },
    { name: 'Comentarios Seguros', value: safeCount },
  ];

  const COLORS = ['#dc2626', '#16a34a'];

  const avgConfidence = results.reduce((acc, r) => acc + (r.confidence || 0), 0) / results.length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: TrendingUp, color: 'blue', title: 'Total Analizado', value: results.length, subtitle: 'comentarios procesados' },
          { icon: AlertCircle, color: 'red', title: 'Odio Detectado', value: hatefulCount, subtitle: `${hatefulPercentage.toFixed(1)}% del total` },
          { icon: Shield, color: 'green', title: 'Confianza Promedio', value: `${(avgConfidence * 100).toFixed(1)}%`, subtitle: 'del modelo' },
        ].map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <card.icon className={`w-8 h-8 text-${card.color}-600`} />
              <h3 className="text-slate-900">{card.title}</h3>
            </div>
            <p className="text-slate-900">{card.value}</p>
            <p className="text-slate-600 text-sm">{card.subtitle}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-slate-900 mb-4">Distribución de Comentarios</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-slate-900 mb-4">Categorías de Odio Detectadas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#dc2626" name="Nivel de detección" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Hateful Comments */}
      {hatefulCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-slate-900 mb-4">Comentarios con Mayor Nivel de Odio</h3>
          <div className="space-y-3">
            {results
              .filter(r => r.isHateful)
              .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
              .slice(0, 5)
              .map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="p-4 bg-red-50 rounded-lg border border-red-200"
                >
                  <p className="text-slate-700 mb-2">{result.text}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-red-600">
                      Confianza: {((result.confidence || 0) * 100).toFixed(1)}%
                    </span>
                    {result.categories && (
                      <span className="text-slate-600">
                        Categoría principal: {
                          Object.entries(result.categories)
                            .sort(([_, a], [__, b]) => (b || 0) - (a || 0))[0]?.[0] || 'N/A'
                        }
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Statistics;

