import { useState } from 'react';
import { analyzeText } from '../services/api';

function HomePage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    const textToAnalyze = text.trim();
    
    if (!textToAnalyze) {
      setError('Por favor, ingresa un texto para analizar');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null); // Limpiar resultado anterior

    try {
      // Asegurar que enviamos el texto actual, no el del estado anterior
      console.log('Analizando texto:', textToAnalyze);
      const analysisResult = await analyzeText(textToAnalyze);
      console.log('Resultado recibido:', analysisResult);
      
      // Verificar que el resultado corresponde al texto enviado
      if (analysisResult.text !== textToAnalyze) {
        console.warn('⚠️ El texto del resultado no coincide con el enviado');
      }
      
      setResult(analysisResult);
    } catch (err) {
      console.error('Error al analizar:', err);
      setError(err.message || 'Error al analizar el texto');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Análisis Individual</h1>
      <p className="text-gray-600 mb-6">
        Analiza un texto individual para detectar si contiene hate speech.
      </p>

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
          Ingresa el texto a analizar:
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe aquí el texto que quieres analizar..."
          className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          disabled={loading}
        />
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Analizando...' : 'Analizar'}
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
          {text.length} / 5000 caracteres
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Resultado */}
      {result && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Resultado del Análisis</h2>
          
          {/* Badge de resultado */}
          <div className="mb-6">
            <span
              className={`inline-block px-4 py-2 rounded-full text-white font-semibold text-lg ${
                result.is_toxic ? 'bg-toxic' : 'bg-not-toxic'
              }`}
            >
              {result.toxicity_label}
            </span>
          </div>

          {/* Probabilidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Probabilidad de ser Tóxico</p>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-toxic h-4 rounded-full transition-all"
                  style={{ width: `${result.probability_toxic * 100}%` }}
                />
              </div>
              <p className="text-sm font-semibold mt-1">
                {(result.probability_toxic * 100).toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Probabilidad de NO ser Tóxico</p>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-not-toxic h-4 rounded-full transition-all"
                  style={{ width: `${result.probability_not_toxic * 100}%` }}
                />
              </div>
              <p className="text-sm font-semibold mt-1">
                {(result.probability_not_toxic * 100).toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Confianza */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Confianza de la Predicción</p>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className="bg-primary h-4 rounded-full transition-all"
                style={{ width: `${result.confidence * 100}%` }}
              />
            </div>
            <p className="text-sm font-semibold">
              {(result.confidence * 100).toFixed(2)}%
            </p>
          </div>

          {/* Texto analizado */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Texto Analizado:</p>
            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
              {text || result.text}
            </p>
            
            {/* Advertencia sobre limitaciones del modelo */}
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                <strong>⚠️ Nota importante:</strong> Este modelo fue entrenado con datos en <strong>inglés</strong>. 
                Los textos en español o con palabras desconocidas pueden dar resultados idénticos. 
                Para obtener predicciones precisas, usa textos en inglés.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
