import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hero } from './components/Hero';
import { AnalysisForm } from './components/AnalysisForm';
import { Results } from './components/Results';
import { ModelInfo } from './components/ModelInfo';
import { ModelComparison } from './components/ModelComparison';
import { Statistics } from './components/Statistics';
import { MLflowMetrics } from './components/MLflowMetrics';

/**
 * Formato de resultado del análisis
 * @typedef {Object} AnalysisResult
 * @property {string} text - Texto analizado
 * @property {boolean} isHateful - Si es contenido de odio
 * @property {number} confidence - Confianza de la predicción (0-1)
 * @property {Object} categories - Categorías de odio detectadas
 * @property {number} categories.toxic - Probabilidad de ser tóxico
 * @property {number} categories.severe_toxic - Probabilidad de ser severamente tóxico
 * @property {number} categories.obscene - Probabilidad de ser obsceno
 * @property {number} categories.threat - Probabilidad de ser amenaza
 * @property {number} categories.insult - Probabilidad de ser insulto
 * @property {number} categories.identity_hate - Probabilidad de odio por identidad
 */

function App() {
  const [results, setResults] = useState([]);
  const [activeSection, setActiveSection] = useState('analyzer'); // 'analyzer' | 'model' | 'comparison' | 'stats' | 'mlflow'

  const handleAnalysis = (newResults) => {
    setResults(newResults);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Hero />
      
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-8 border-b border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveSection('analyzer')}
            className={`px-6 py-3 transition-all whitespace-nowrap ${
              activeSection === 'analyzer'
                ? 'border-b-2 border-red-500 text-red-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Analizador
          </button>
          <button
            onClick={() => setActiveSection('comparison')}
            className={`px-6 py-3 transition-all whitespace-nowrap ${
              activeSection === 'comparison'
                ? 'border-b-2 border-red-500 text-red-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            EDA
          </button>
          <button
            onClick={() => setActiveSection('model')}
            className={`px-6 py-3 transition-all whitespace-nowrap ${
              activeSection === 'model'
                ? 'border-b-2 border-red-500 text-red-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Modelo
          </button>
          <button
            onClick={() => setActiveSection('stats')}
            className={`px-6 py-3 transition-all whitespace-nowrap ${
              activeSection === 'stats'
                ? 'border-b-2 border-red-500 text-red-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Estadísticas
          </button>
          <button
            onClick={() => setActiveSection('mlflow')}
            className={`px-6 py-3 transition-all whitespace-nowrap ${
              activeSection === 'mlflow'
                ? 'border-b-2 border-red-500 text-red-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            MLflow
          </button>
        </div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          {activeSection === 'analyzer' && (
            <motion.div
              key="analyzer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <AnalysisForm onAnalyze={handleAnalysis} />
              <Results results={results} />
            </motion.div>
          )}

          {activeSection === 'model' && (
            <motion.div
              key="model"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ModelComparison />
            </motion.div>
          )}

          {activeSection === 'comparison' && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ModelInfo />
            </motion.div>
          )}
          
          {activeSection === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Statistics results={results} />
            </motion.div>
          )}

          {activeSection === 'mlflow' && (
            <motion.div
              key="mlflow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MLflowMetrics />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;

