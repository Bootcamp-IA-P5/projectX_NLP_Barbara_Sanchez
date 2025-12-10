import { TrendingUp } from 'lucide-react';

/**
 * Componente Results - Muestra los resultados del análisis
 * @param {Array} results - Array de resultados del análisis
 */
export function Results({ results = [] }) {
  if (results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">Los resultados aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-slate-900 mb-4">Resultados del Análisis</h2>
      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              result.isHateful
                ? 'bg-red-50 border-red-200'
                : 'bg-green-50 border-green-200'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-slate-700 flex-1">{result.text}</p>
              <span
                className={`ml-4 px-3 py-1 rounded-full text-sm font-semibold ${
                  result.isHateful
                    ? 'bg-red-600 text-white'
                    : 'bg-green-600 text-white'
                }`}
              >
                {result.isHateful ? 'Tóxico' : 'No Tóxico'}
              </span>
            </div>
            <div className="mt-2">
              <p className="text-sm text-slate-600">
                Confianza: {(result.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Results;

