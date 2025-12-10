import { useState } from 'react';
import { analyzeYouTube } from '../services/api';

function YouTubePage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [maxComments, setMaxComments] = useState(20); // Reducido a 20 para evitar errores
  const [sortBy, setSortBy] = useState('top');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'toxic', 'not-toxic'

  const handleAnalyze = async () => {
    if (!videoUrl.trim()) {
      setError('Por favor, ingresa una URL de YouTube');
      return;
    }

    // Validar que sea una URL de YouTube
    if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
      setError('Por favor, ingresa una URL válida de YouTube');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeYouTube(videoUrl, maxComments, sortBy);
      setResult(analysisResult);
    } catch (err) {
      setError(err.message || 'Error al analizar el video de YouTube');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setVideoUrl('');
    setResult(null);
    setError(null);
    setFilter('all');
  };

  // Filtrar comentarios según el filtro seleccionado
  const filteredComments = result?.comments
    ? result.comments.filter((comment) => {
        if (filter === 'toxic') return comment.is_toxic;
        if (filter === 'not-toxic') return !comment.is_toxic;
        return true;
      })
    : [];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Análisis de YouTube</h1>
      <p className="text-gray-600 mb-6">
        Analiza los comentarios de un video de YouTube para detectar hate speech.
      </p>

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="video-url" className="block text-sm font-medium text-gray-700 mb-2">
              URL del Video de YouTube:
            </label>
            <input
              id="video-url"
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="max-comments" className="block text-sm font-medium text-gray-700 mb-2">
                Máximo de Comentarios:
              </label>
              <input
                id="max-comments"
                type="number"
                value={maxComments}
                onChange={(e) => setMaxComments(parseInt(e.target.value) || 100)}
                min="1"
                max="500"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por:
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={loading}
              >
                <option value="top">Más populares</option>
                <option value="time">Más recientes</option>
                <option value="relevance">Más relevantes</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAnalyze}
              disabled={loading || !videoUrl.trim()}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Analizando...' : 'Analizar Video'}
            </button>
            <button
              onClick={handleClear}
              disabled={loading}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Estadísticas del Video */}
      {result && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Estadísticas del Video</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Comentarios</p>
              <p className="text-2xl font-bold">{result.total_comments}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Tóxicos</p>
              <p className="text-2xl font-bold text-toxic">{result.toxic_count}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">No Tóxicos</p>
              <p className="text-2xl font-bold text-not-toxic">{result.non_toxic_count}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">% Tóxicos</p>
              <p className="text-2xl font-bold text-primary">
                {result.toxic_percentage.toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <p><strong>Video ID:</strong> {result.video_id}</p>
            <p><strong>URL:</strong> <a href={result.video_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{result.video_url}</a></p>
          </div>
        </div>
      )}

      {/* Filtros y Lista de Comentarios */}
      {result && result.comments && result.comments.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Comentarios Analizados</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Todos ({result.comments.length})
              </button>
              <button
                onClick={() => setFilter('toxic')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'toxic'
                    ? 'bg-toxic text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Tóxicos ({result.toxic_count})
              </button>
              <button
                onClick={() => setFilter('not-toxic')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'not-toxic'
                    ? 'bg-not-toxic text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                No Tóxicos ({result.non_toxic_count})
              </button>
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredComments.map((comment, index) => (
              <div
                key={comment.comment_id || index}
                className={`border rounded-lg p-4 ${
                  comment.is_toxic ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        comment.is_toxic
                          ? 'bg-toxic text-white'
                          : 'bg-not-toxic text-white'
                      }`}
                    >
                      {comment.toxicity_label}
                    </span>
                    <span className="text-xs text-gray-500">
                      {comment.author && `@${comment.author}`}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {comment.likes > 0 && `👍 ${comment.likes}`}
                    {comment.reply_count > 0 && ` 💬 ${comment.reply_count}`}
                  </div>
                </div>
                <p className="text-gray-800 mb-2">{comment.text}</p>
                <div className="flex gap-4 text-xs text-gray-600">
                  <span>Probabilidad: {(comment.probability_toxic * 100).toFixed(1)}%</span>
                  <span>Confianza: {(comment.confidence * 100).toFixed(1)}%</span>
                  {comment.time && <span>⏰ {comment.time}</span>}
                </div>
              </div>
            ))}
          </div>

          {filteredComments.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No hay comentarios que coincidan con el filtro seleccionado.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default YouTubePage;
