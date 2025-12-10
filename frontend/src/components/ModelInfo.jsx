/**
 * Componente ModelInfo - Información sobre el modelo
 */
export function ModelInfo() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-slate-900 mb-6">Información del Modelo</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-slate-700 font-semibold mb-2">Modelo: SVM Optimizado</h3>
          <p className="text-slate-600">
            Support Vector Machine (SVM) optimizado con Optuna para detección de hate speech.
          </p>
        </div>
        <div>
          <h3 className="text-slate-700 font-semibold mb-2">Métricas</h3>
          <ul className="list-disc list-inside text-slate-600 space-y-1">
            <li>F1-score: 0.6866</li>
            <li>Overfitting: 2.54%</li>
            <li>Accuracy: 0.58</li>
          </ul>
        </div>
        <div>
          <h3 className="text-slate-700 font-semibold mb-2">Vectorizador</h3>
          <p className="text-slate-600">TF-IDF con vocabulario de 1000 palabras</p>
        </div>
        <div>
          <h3 className="text-slate-700 font-semibold mb-2">Limitaciones</h3>
          <p className="text-slate-600">
            El modelo está entrenado con datos en inglés. Los resultados pueden ser menos precisos para otros idiomas.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ModelInfo;

