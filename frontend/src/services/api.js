import axios from 'axios';

// URL base de la API (backend)
const API_BASE_URL = 'http://localhost:8000';

// Crear instancia de axios con configuración por defecto
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Analizar un texto individual para detectar hate speech
 * @param {string} text - Texto a analizar
 * @returns {Promise<Object>} Resultado del análisis
 */
export const analyzeText = async (text) => {
  try {
    // Asegurar que el texto se envía correctamente
    const textToSend = String(text).trim();
    
    if (!textToSend) {
      throw new Error('El texto no puede estar vacío');
    }
    
    console.log('Enviando a API:', { text: textToSend });
    
    const response = await apiClient.post('/predict', { 
      text: textToSend 
    });
    
    console.log('Respuesta de API:', response.data);
    
    // Verificar que la respuesta tiene el formato correcto
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Respuesta inválida del servidor');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error en analyzeText:', error);
    throw new Error(error.response?.data?.detail || error.message || 'Error al analizar el texto');
  }
};

/**
 * Analizar múltiples textos en batch
 * @param {string[]} texts - Array de textos a analizar
 * @returns {Promise<Array>} Array de resultados
 */
export const analyzeBatch = async (texts) => {
  try {
    const response = await apiClient.post('/predict/batch', { texts });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Error al analizar los textos');
  }
};

/**
 * Analizar comentarios de un video de YouTube
 * @param {string} videoUrl - URL del video de YouTube
 * @param {number} maxComments - Número máximo de comentarios (opcional, default: 100)
 * @param {string} sortBy - Orden de comentarios: 'top', 'time', 'relevance' (opcional)
 * @returns {Promise<Object>} Resultado del análisis del video
 */
export const analyzeYouTube = async (videoUrl, maxComments = 100, sortBy = 'top') => {
  try {
    const response = await apiClient.post('/analyze/youtube', {
      video_url: videoUrl,
      max_comments: maxComments,
      sort_by: sortBy,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Error al analizar el video de YouTube');
  }
};

/**
 * Obtener estadísticas de predicciones guardadas
 * @returns {Promise<Object>} Estadísticas
 */
export const getStats = async () => {
  try {
    const response = await apiClient.get('/predictions/stats');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Error al obtener estadísticas');
  }
};

/**
 * Obtener predicciones guardadas
 * @param {Object} filters - Filtros opcionales (limit, offset, is_toxic, source, video_id)
 * @returns {Promise<Object>} Predicciones
 */
export const getPredictions = async (filters = {}) => {
  try {
    const response = await apiClient.get('/predictions', { params: filters });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Error al obtener predicciones');
  }
};

/**
 * Verificar el estado de salud de la API
 * @returns {Promise<Object>} Estado de la API
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('La API no está disponible');
  }
};

