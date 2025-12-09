import { useState } from 'react';
import { analyzeBatch } from '../services/api';

function BatchPage() {
  const [texts, setTexts] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    // Separar textos por líneas y filtrar vacíos
    const textArray = texts
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (textArray.length === 0) {
      setError('Por favor, ingresa al menos un texto para analizar');
      return;
    }

    if (textArray.length > 100) {
      setError('Máximo 100 textos por análisis');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const analysisResults = await analyzeBatch(textArray);
      setResults(analysisResults);
    } catch (err) {
      setError(err.message || 'Error al analizar los textos');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setTexts('');
    setResults(null);
    setError(null);
  };

  // Calcular estadísticas
  const stats = results ? {
    total: results.length,
    toxic: results.filter(r => r.is_toxic).length,
    notToxic: results.filter(r => !r.is_toxic).length,
    toxicPercentage: (results.filter(r => r.is_toxic).length / results.length) * 100,
    avgConfidence: results.reduce((sum, r) => sum + r.confidence, 0) / results.length,
  } : null;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Análisis por Lotes</h1>
      <p className="text-gray-600 mb-6">
        Analiza múltiples textos a la vez (máximo 100). Escribe un texto por línea.
      </p>

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <label htmlFor="texts-input" className="block text-sm font-medium text-gray-700 mb-2">
          Ingresa los textos a analizar (uno por línea):
        </label>
        <textarea
          id="texts-input"
          value={texts}
          onChange={(e) => setTexts(e.target.value)}
          placeholder="Texto 1&#10;Texto 2&#10;Texto 3&#10;..."
          className="w-full h-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
          disabled={loading}
        />
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleAnalyze}
            disabled={loading || !texts.trim()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Analizando...' : 'Analizar Lote'}
          </button>
          <button
            onClick={handleClear}
            disabled={loading}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
          >
            Limpiar
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {texts.split('\n').filter(t => t.trim().length > 0).length} textos ingresados
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Estadísticas */}
      {stats && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Estadísticas del Lote</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Tóxicos</p>
              <p className="text-2xl font-bold text-toxic">{stats.toxic}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">No Tóxicos</p>
              <p className="text-2xl font-bold text-not-toxic">{stats.notToxic}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">% Tóxicos</p>
              <p className="text-2xl font-bold text-primary">
                {stats.toxicPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">Confianza Promedio</p>
            <p className="text-lg font-semibold">
              {(stats.avgConfidence * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      )}

      {/* Tabla de Resultados */}
      {results && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Resultados Detallados</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Texto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resultado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Probabilidad
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confianza
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-md">
                      <p className="truncate" title={result.text}>
                        {result.text}
                      </p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          result.is_toxic
                            ? 'bg-toxic text-white'
                            : 'bg-not-toxic text-white'
                        }`}
                      >
                        {result.toxicity_label}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {(result.probability_toxic * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {(result.confidence * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default BatchPage;
