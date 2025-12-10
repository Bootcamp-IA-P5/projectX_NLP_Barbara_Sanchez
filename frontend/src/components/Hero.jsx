import { Shield, AlertTriangle } from 'lucide-react';


export function Hero() {
  return (
    <div className="bg-red-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Título con icono */}
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-white" />
          <h1 className="text-3xl sm:text-4xl font-bold">
            Detector de Odio en Comentarios de YouTube
          </h1>
        </div>

        {/* Descripción */}
        <p className="text-white text-base sm:text-lg mb-6 max-w-4xl">
          Sistema de detección automática de comentarios de odio utilizando técnicas de 
          Procesamiento de Lenguaje Natural (NLP). Analiza comentarios de YouTube para 
          identificar contenido tóxico, insultos, amenazas y otros tipos de discurso de odio.
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-white" />
            <span className="text-white text-sm sm:text-base">Detección en tiempo real</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-white" />
            <span className="text-white text-sm sm:text-base">Modelo NLP avanzado</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;

