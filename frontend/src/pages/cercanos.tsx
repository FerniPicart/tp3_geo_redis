import { useState } from "react";
import Link from "next/link";

type Lugar = {
  nombre: string;
  distancia: number;
  lat: number;
  lon: number;
};

export default function Cercanos() {
  const [grupo, setGrupo] = useState("cervecerias");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState<Lugar[]>([]);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  const buscar = async () => {
    setError("");
    setResultados([]);
    setBusquedaRealizada(false);
    setLoading(true);

    try {
      // Validar que las coordenadas no estén vacías
      if (lat.trim() === "" || lon.trim() === "") {
        setError(`❌ Coordenadas geográficas incompletas

🌍 Debe proporcionar tanto latitud como longitud para realizar la búsqueda

Valores actuales:
   • Latitud: ${lat.trim() === "" ? "vacía ❌" : lat + " ✓"}
   • Longitud: ${lon.trim() === "" ? "vacía ❌" : lon + " ✓"}

💡 Ejemplo: Para buscar desde Buenos Aires usa: -34.603722, -58.381592`);
        setLoading(false);
        return;
      }

      // Validar que sean números válidos
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);
      
      if (isNaN(latNum) || isNaN(lonNum)) {
        setError(`❌ Las coordenadas deben ser números válidos

🌍 Latitud y longitud deben ser valores numéricos decimales

Valores ingresados:
   • Latitud: "${lat}" ${isNaN(latNum) ? "❌ No es un número válido" : "✓"}
   • Longitud: "${lon}" ${isNaN(lonNum) ? "❌ No es un número válido" : "✓"}

💡 Ejemplos de coordenadas válidas:
   • -34.603722, -58.381592 (Buenos Aires)
   • 40.7128, -74.0060 (Nueva York)
   • -33.4489, -70.6693 (Santiago de Chile)`);
        setLoading(false);
        return;
      }

      // Validar rangos geográficos
      if (latNum < -90 || latNum > 90) {
        setError(`❌ Latitud fuera del rango válido

🌍 La latitud debe estar entre -90° (Polo Sur) y +90° (Polo Norte)

Valor ingresado: ${latNum}°
${latNum < -90 ? "❌ Es menor que -90° (más al sur que el Polo Sur)" : "❌ Es mayor que 90° (más al norte que el Polo Norte)"}

💡 Verifica tus coordenadas. Latitudes comunes:
   • Ushuaia (sur de Argentina): -54.8°
   • Buenos Aires: -34.6°
   • Ecuador: 0°
   • Nueva York: 40.7°`);
        setLoading(false);
        return;
      }

      if (lonNum < -180 || lonNum > 180) {
        setError(`❌ Longitud fuera del rango válido

🌍 La longitud debe estar entre -180° y +180°

Valor ingresado: ${lonNum}°
${lonNum < -180 ? "❌ Es menor que -180°" : "❌ Es mayor que 180°"}

💡 Verifica tus coordenadas. Longitudes comunes:
   • Buenos Aires: -58.4°
   • Madrid: -3.7°
   • Tokio: 139.7°
   • Rango válido: -180° a +180°`);
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:8000/lugares/cercanos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grupo, lat: latNum, lon: lonNum })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(`❌ Error del servidor

⚠️ El servidor respondió con un error al procesar tu búsqueda

Código de estado: ${res.status}
Mensaje: ${JSON.stringify(data)}

💡 Posibles soluciones:
   • Verifica que el backend esté ejecutándose
   • Intenta con coordenadas diferentes
   • Revisa tu conexión a internet`);
      } else {
        setBusquedaRealizada(true);
        setResultados(data.lugares || []);
      }
    } catch (err) {
      setError(`❌ Error de conexión

⚠️ No se pudo conectar con el servidor

Detalles del error: ${err instanceof Error ? err.message : "Error desconocido"}

💡 Posibles soluciones:
   • Verifica que el backend esté ejecutándose en http://localhost:8000
   • Revisa tu conexión a internet
   • Intenta nuevamente en unos momentos`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Link href="/" className="text-green-600 hover:text-green-800 font-medium">
            ← Volver al inicio
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-green-600 mb-2">🔍 Buscar Lugares Cercanos</h1>
          <p className="text-gray-600">Encuentra puntos de interés en un radio de 5 km desde tu ubicación</p>
        </div>

        {/* Info Box */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">
          <h3 className="font-bold text-green-800 mb-2">💡 Cómo funciona</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Selecciona el tipo de lugares que deseas buscar</li>
            <li>• Ingresa las coordenadas de tu ubicación actual</li>
            <li>• El sistema buscará todos los lugares del tipo seleccionado en un radio de 5 km</li>
            <li>• Los resultados se mostrarán ordenados por distancia</li>
          </ul>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="mb-4">
            <label className="block font-semibold text-gray-700 mb-2">Tipo de Lugar</label>
            <select
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              value={grupo}
              onChange={(e) => setGrupo(e.target.value)}
            >
              <option value="cervecerias">🍺 Cervecerías</option>
              <option value="universidades">🎓 Universidades</option>
              <option value="farmacias">💊 Farmacias</option>
              <option value="emergencias">🚑 Emergencias</option>
              <option value="supermercados">🛒 Supermercados</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Tu Latitud <span className="text-sm text-gray-500">(-90 a 90)</span>
              </label>
              <input
                type="number"
                step="any"
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="Ej: -34.603722"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Tu Longitud <span className="text-sm text-gray-500">(-180 a 180)</span>
              </label>
              <input
                type="number"
                step="any"
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                placeholder="Ej: -58.381592"
              />
            </div>
          </div>

          <button
            onClick={buscar}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Buscando lugares cercanos...
              </>
            ) : (
              "Buscar Lugares Cercanos"
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
            <pre className="text-red-800 whitespace-pre-wrap font-sans text-sm">{error}</pre>
          </div>
        )}

        {/* Results */}
        {busquedaRealizada && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-green-600">Resultados</h2>
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                {resultados.length} {resultados.length === 1 ? "lugar encontrado" : "lugares encontrados"}
              </span>
            </div>

            {resultados.length === 0 ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <p className="text-yellow-800 font-semibold mb-2">🔍 No se encontraron lugares cercanos</p>
                <p className="text-yellow-700 text-sm">
                  No hay {grupo} registrados en un radio de 5 km desde tu ubicación.
                </p>
                <p className="text-yellow-700 text-sm mt-2">
                  💡 Sugerencias:
                </p>
                <ul className="text-yellow-700 text-sm ml-4 mt-1">
                  <li>• Intenta con otro tipo de lugar</li>
                  <li>• Verifica que las coordenadas sean correctas</li>
                  <li>• Puede que no haya lugares registrados en esta zona</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-4">
                {resultados.map((lugar, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {index + 1}. {lugar.nombre}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="flex items-center">
                            <span className="font-semibold mr-2">📏 Distancia:</span>
                            <span className="text-green-600 font-bold">
                              {lugar.distancia.toFixed(2)} km
                            </span>
                          </p>
                          <p className="flex items-center">
                            <span className="font-semibold mr-2">📍 Coordenadas:</span>
                            <span className="font-mono">
                              {lugar.lat.toFixed(6)}, {lugar.lon.toFixed(6)}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {lugar.distancia < 1 ? "Muy cerca" : lugar.distancia < 3 ? "Cerca" : "A 5 km"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
