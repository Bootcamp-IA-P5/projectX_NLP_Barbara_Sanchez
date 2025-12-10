import { useState } from 'react';
import { Search, Youtube, FileText, Upload } from 'lucide-react';
import { analyzeText, analyzeBatch, analyzeYouTube } from '../services/api';

/**
 * Componente AnalysisForm - Formulario para analizar comentarios
 * @param {Function} onAnalyze - Callback que recibe los resultados del análisis
 */
export function AnalysisForm({ onAnalyze }) {
  const [inputType, setInputType] = useState('text'); // 'url' | 'text' | 'batch'
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [batchComments, setBatchComments] = useState([]);
  const [error, setError] = useState(null);

  /**
   * Convertir respuesta de API a formato AnalysisResult
   */
  const convertApiResponseToResult = (apiResponse) => {
    return {
      text: apiResponse.text || '',
      isHateful: apiResponse.is_toxic || false,
      confidence: apiResponse.confidence || apiResponse.probability_toxic || 0,
      categories: {
        toxic: apiResponse.probability_toxic || 0,
        severe_toxic: 0, // No disponible en la API actual
        obscene: 0, // No disponible en la API actual
        threat: 0, // No disponible en la API actual
        insult: 0, // No disponible en la API actual
        identity_hate: 0, // No disponible en la API actual
      },
    };
  };

  /**
   * Manejar carga de archivo para análisis por lotes
   */
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      // Dividir por líneas o por algún delimitador
      const comments = text.split('\n').filter(line => line.trim());
      setBatchComments(comments);
      setError(null);
    };
    reader.readAsText(file);
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (inputType !== 'batch' && !input.trim()) return;
    if (inputType === 'batch' && batchComments.length === 0) return;

    setIsAnalyzing(true);

    try {
      if (inputType === 'url') {
        // Analizar video de YouTube
        const response = await analyzeYouTube(input, 20, 'top');
        
        // Convertir comentarios de la respuesta
        const results = response.comments?.map(comment => ({
          text: comment.text || '',
          isHateful: comment.is_toxic || false,
          confidence: comment.confidence || comment.probability_toxic || 0,
          categories: {
            toxic: comment.probability_toxic || 0,
            severe_toxic: 0,
            obscene: 0,
            threat: 0,
            insult: 0,
            identity_hate: 0,
          },
        })) || [];
        
        onAnalyze(results);
      } else if (inputType === 'batch') {
        // Analizar múltiples comentarios
        const response = await analyzeBatch(batchComments);
        
        // Convertir respuestas de la API
        const results = Array.isArray(response) 
          ? response.map(convertApiResponseToResult)
          : [];
        
        onAnalyze(results);
      } else {
        // Analizar texto individual
        const response = await analyzeText(input);
        const result = convertApiResponseToResult(response);
        onAnalyze([result]);
      }
    } catch (err) {
      console.error('Error al analizar:', err);
      setError(err.message || 'Error al analizar. Por favor, intenta de nuevo.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-slate-900 mb-6">Analizar Comentarios</h2>

      {/* Botones de selección de tipo */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <button
          onClick={() => {
            setInputType('text');
            setError(null);
          }}
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
            inputType === 'text'
              ? 'bg-red-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <FileText className="w-5 h-5" />
          Texto
        </button>
        <button
          onClick={() => {
            setInputType('url');
            setError(null);
          }}
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
            inputType === 'url'
              ? 'bg-red-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Youtube className="w-5 h-5" />
          URL de YouTube
        </button>
        <button
          onClick={() => {
            setInputType('batch');
            setError(null);
          }}
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
            inputType === 'batch'
              ? 'bg-red-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Upload className="w-5 h-5" />
          Por Bloques
        </button>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {inputType === 'url' ? (
          <div className="mb-4">
            <label htmlFor="youtube-url" className="block text-slate-700 mb-2">
              URL del video de YouTube
            </label>
            <input
              id="youtube-url"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        ) : inputType === 'batch' ? (
          <div className="mb-4">
            <label htmlFor="batch-file" className="block text-slate-700 mb-2">
              Cargar archivo de comentarios (.txt, .csv)
            </label>
            <input
              id="batch-file"
              type="file"
              accept=".txt,.csv"
              onChange={handleFileUpload}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {batchComments.length > 0 && (
              <p className="mt-2 text-sm text-green-600">
                {batchComments.length} comentarios cargados
              </p>
            )}
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <p className="text-slate-600 text-sm mb-2">
                <strong>Formato esperado:</strong>
              </p>
              <p className="text-slate-600 text-sm">
                Un comentario por línea en archivo .txt o CSV
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <label htmlFor="comment-text" className="block text-slate-700 mb-2">
              Comentario a analizar
            </label>
            <textarea
              id="comment-text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe el comentario que deseas analizar..."
              rows={6}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={
            isAnalyzing || 
            (inputType !== 'batch' && !input.trim()) || 
            (inputType === 'batch' && batchComments.length === 0)
          }
          className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analizando...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              {inputType === 'batch' 
                ? `Analizar ${batchComments.length} Comentarios` 
                : 'Analizar'}
            </>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-slate-600 text-sm">
          <strong>Nota:</strong> El modelo está entrenado con datos en inglés. 
          Los resultados pueden ser menos precisos para otros idiomas.
        </p>
      </div>
    </div>
  );
}

export default AnalysisForm;

