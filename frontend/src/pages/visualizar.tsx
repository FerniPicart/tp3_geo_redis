import { useState, useEffect } from "react";
import Link from "next/link";

// Interfaces
interface Lugar {
  nombre: string;
  lat: number;
  lon: number;
}

interface DataBD {
  grupos: Record<string, Lugar[]>;
  total: number;
}

export default function Visualizar() {
  const [data, setData] = useState<DataBD | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [grupoExpandido, setGrupoExpandido] = useState<Record<string, boolean>>({});

  // Mapeo de iconos por categoría
  const iconosPorGrupo: Record<string, string> = {
    cervecerias: "🍺",
    universidades: "🎓",
    farmacias: "💊",
    emergencias: "🚨",
    supermercados: "🛒",
  };

  // Mapeo de nombres amigables
  const nombresPorGrupo: Record<string, string> = {
    cervecerias: "Cervecerías",
    universidades: "Universidades",
    farmacias: "Farmacias",
    emergencias: "Emergencias",
    supermercados: "Supermercados",
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("http://localhost:8000/lugares/todos");
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      setData(result);
      
      // Expandir todos los grupos por defecto
      const expanded: Record<string, boolean> = {};
      Object.keys(result.grupos).forEach(grupo => {
        expanded[grupo] = true;
      });
      setGrupoExpandido(expanded);
    } catch (err: any) {
      setError(err.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const toggleGrupo = (grupo: string) => {
    setGrupoExpandido(prev => ({
      ...prev,
      [grupo]: !prev[grupo]
    }));
  };

  // Calcular estadísticas
  const cantidadGrupos = data ? Object.keys(data.grupos).length : 0;
  const grupoMasPoblado = data && cantidadGrupos > 0 
    ? Object.entries(data.grupos).reduce((max, [nombre, lugares]) => 
        lugares.length > max.count ? { nombre, count: lugares.length } : max,
        { nombre: "", count: 0 }
      )
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Volver al inicio
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            🗄️ Base de Datos de Lugares
          </h1>
          <p className="text-gray-600 text-lg">
            Visualiza todos los lugares almacenados en Redis GEO
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Cargando datos desde Redis...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-red-500">
            <div className="flex items-start">
              <span className="text-3xl mr-4">❌</span>
              <div>
                <h3 className="text-xl font-bold text-red-700 mb-2">
                  Error al cargar los datos
                </h3>
                <p className="text-gray-700 mb-4">{error}</p>
                <button
                  onClick={cargarDatos}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && data && data.total === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-yellow-500">
            <div className="flex items-start">
              <span className="text-3xl mr-4">📭</span>
              <div>
                <h3 className="text-xl font-bold text-yellow-700 mb-2">
                  Base de datos vacía
                </h3>
                <p className="text-gray-700 mb-4">
                  No hay lugares almacenados en Redis. ¡Agrega el primero!
                </p>
                <Link href="/agregar">
                  <span className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer">
                    Agregar primer lugar
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Data Display */}
        {!loading && !error && data && data.total > 0 && (
          <div>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Places */}
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                <div className="text-3xl mb-2">📍</div>
                <div className="text-3xl font-bold text-blue-600">{data.total}</div>
                <div className="text-gray-600 font-medium">Total de lugares</div>
              </div>

              {/* Total Groups */}
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                <div className="text-3xl mb-2">📂</div>
                <div className="text-3xl font-bold text-green-600">{cantidadGrupos}</div>
                <div className="text-gray-600 font-medium">Grupos con datos</div>
              </div>

              {/* Most Populated Group */}
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-xl font-bold text-purple-600">
                  {grupoMasPoblado ? nombresPorGrupo[grupoMasPoblado.nombre] : "N/A"}
                </div>
                <div className="text-gray-600 font-medium">
                  Grupo más poblado ({grupoMasPoblado?.count || 0})
                </div>
              </div>

              {/* Technology */}
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
                <div className="text-3xl mb-2">🔴</div>
                <div className="text-xl font-bold text-orange-600">Redis GEO</div>
                <div className="text-gray-600 font-medium">Tecnología geoespacial</div>
              </div>
            </div>

            {/* Reload Button */}
            <div className="mb-6 flex justify-end">
              <button
                onClick={cargarDatos}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                <span>🔄</span>
                Recargar datos
              </button>
            </div>

            {/* Groups List */}
            <div className="space-y-6">
              {Object.entries(data.grupos).map(([nombreGrupo, lugares]) => (
                <div key={nombreGrupo} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGrupo(nombreGrupo)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{iconosPorGrupo[nombreGrupo] || "📍"}</span>
                      <span className="text-xl font-bold">
                        {nombresPorGrupo[nombreGrupo] || nombreGrupo}
                      </span>
                      <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                        {lugares.length} {lugares.length === 1 ? "lugar" : "lugares"}
                      </span>
                    </div>
                    <span className="text-2xl">
                      {grupoExpandido[nombreGrupo] ? "▼" : "▶"}
                    </span>
                  </button>

                  {/* Group Content */}
                  {grupoExpandido[nombreGrupo] && (
                    <div className="p-6">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b-2 border-gray-200">
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">#</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Latitud</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Longitud</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Google Maps</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lugares.map((lugar, index) => (
                              <tr
                                key={index}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                              >
                                <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                                <td className="py-3 px-4 font-medium text-gray-800">{lugar.nombre}</td>
                                <td className="py-3 px-4 text-gray-600">{lugar.lat.toFixed(6)}</td>
                                <td className="py-3 px-4 text-gray-600">{lugar.lon.toFixed(6)}</td>
                                <td className="py-3 px-4">
                                  <a
                                    href={`https://www.google.com/maps?q=${lugar.lat},${lugar.lon}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                  >
                                    <span>🗺️</span>
                                    Ver en mapa
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
