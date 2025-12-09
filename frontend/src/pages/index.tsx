import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent mb-4">
            🌍 API Turismo Geoespacial
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gestiona lugares turísticos con búsquedas geográficas avanzadas usando Redis
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl w-full">
          {/* Agregar Lugar Card */}
          <Link href="/agregar">
            <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border-t-4 border-blue-500 cursor-pointer">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                📍
              </div>
              <h2 className="text-2xl font-bold text-blue-600 mb-3">
                Agregar Lugar
              </h2>
              <p className="text-gray-600 mb-4">
                Registra nuevos puntos de interés con sus coordenadas geográficas
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                Comenzar
                <span className="ml-2 group-hover:translate-x-2 transition-transform duration-300">→</span>
              </div>
            </div>
          </Link>

          {/* Lugares Cercanos Card */}
          <Link href="/cercanos">
            <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border-t-4 border-green-500 cursor-pointer">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🔍
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-3">
                Lugares Cercanos
              </h2>
              <p className="text-gray-600 mb-4">
                Encuentra puntos de interés en un radio de 5 km desde tu ubicación
              </p>
              <div className="flex items-center text-green-600 font-semibold">
                Buscar ahora
                <span className="ml-2 group-hover:translate-x-2 transition-transform duration-300">→</span>
              </div>
            </div>
          </Link>

          {/* Calcular Distancia Card */}
          <Link href="/distancia">
            <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border-t-4 border-purple-500 cursor-pointer">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                📏
              </div>
              <h2 className="text-2xl font-bold text-purple-600 mb-3">
                Calcular Distancia
              </h2>
              <p className="text-gray-600 mb-4">
                Calcula la distancia exacta entre tu ubicación y un lugar específico
              </p>
              <div className="flex items-center text-purple-600 font-semibold">
                Calcular
                <span className="ml-2 group-hover:translate-x-2 transition-transform duration-300">→</span>
              </div>
            </div>
          </Link>

          {/* Ver Base de Datos Card */}
          <Link href="/visualizar">
            <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border-t-4 border-orange-500 cursor-pointer">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🗄️
              </div>
              <h2 className="text-2xl font-bold text-orange-600 mb-3">
                Ver Base de Datos
              </h2>
              <p className="text-gray-600 mb-4">
                Visualiza todos los lugares guardados
              </p>
              <div className="flex items-center text-orange-600 font-semibold">
                Explorar
                <span className="ml-2 group-hover:translate-x-2 transition-transform duration-300">→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Technologies Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm mb-3">Construido con tecnologías modernas</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="px-4 py-2 bg-white rounded-full shadow text-gray-700 font-medium">
              ⚛️ React + Next.js
            </span>
            <span className="px-4 py-2 bg-white rounded-full shadow text-gray-700 font-medium">
              🎨 Tailwind CSS
            </span>
            <span className="px-4 py-2 bg-white rounded-full shadow text-gray-700 font-medium">
              🔴 Redis GeoSpatial
            </span>
            <span className="px-4 py-2 bg-white rounded-full shadow text-gray-700 font-medium">
              🐍 FastAPI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
