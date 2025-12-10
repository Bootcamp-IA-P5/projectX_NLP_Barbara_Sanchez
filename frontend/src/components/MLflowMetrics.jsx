/**
 * Componente MLflowMetrics - Métricas de MLflow
 */
export function MLflowMetrics() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-slate-900 mb-6">Métricas de MLflow</h2>
      <div className="space-y-4">
        <p className="text-slate-600">
          Para ver las métricas de MLflow, ejecuta:
        </p>
        <div className="bg-slate-50 p-4 rounded-lg">
          <code className="text-sm text-slate-800">
            cd backend && mlflow ui
          </code>
        </div>
        <p className="text-slate-600 text-sm">
          Luego accede a <a href="http://localhost:5000" className="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer">http://localhost:5000</a>
        </p>
      </div>
    </div>
  );
}

export default MLflowMetrics;

