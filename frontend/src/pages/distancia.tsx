import { useState } from "react";
import Link from "next/link";

type ResultadoDistancia = {
  lugar: string;
  lat_lugar: number;
  lon_lugar: number;
  distancia: number;
};

export default function Distancia() {
  const [grupo, setGrupo] = useState("cervecerias");
  const [nombre, setNombre] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ResultadoDistancia | null>(null);

  const calcular = async () => {
    setError("");
    setResultado(null);
    setLoading(true);

    try {
      // Validar que el nombre no esté vacío
      if (!nombre.trim()) {
        setError(`❌ El nombre del lugar es requerido

📍 Debe especificar el nombre del lugar del cual desea calcular la distancia

💡 Ejemplos válidos:
   • "Cervecería Antares"
   • "Universidad de Buenos Aires"
   • "Farmacia del Centro"`);
        setLoading(false);
        return;
      }

      // Validar que las coordenadas no estén vacías
      if (lat.trim() === "" || lon.trim() === "") {
        setError(`❌ Coordenadas de tu ubicación incompletas

🌍 Debe proporcionar tanto latitud como longitud de tu ubicación actual

Valores actuales:
   • Latitud: ${lat.trim() === "" ? "vacía ❌" : lat + " ✓"}
   • Longitud: ${lon.trim() === "" ? "vacía ❌" : lon + " ✓"}

💡 Ingresa tus coordenadas actuales para calcular la distancia`);
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

💡 Ejemplos de formatos válidos:
   • -34.603722, -58.381592 (Buenos Aires)
   • 40.7128, -74.0060 (Nueva York)`);
        setLoading(false);
        return;
      }

      // Validar rangos geográficos
      if (latNum < -90 || latNum > 90) {
        setError(`❌ Latitud fuera del rango válido

🌍 La latitud debe estar entre -90° (Polo Sur) y +90° (Polo Norte)

Valor ingresado: ${latNum}°
${latNum < -90 ? "❌ Es menor que -90°" : "❌ Es mayor que 90°"}

💡 Verifica tus coordenadas. La mayoría de las ciudades tienen latitudes entre -60° y +60°`);
        setLoading(false);
        return;
      }

      if (lonNum < -180 || lonNum > 180) {
        setError(`❌ Longitud fuera del rango válido

🌍 La longitud debe estar entre -180° y +180°

Valor ingresado: ${lonNum}°
${lonNum < -180 ? "❌ Es menor que -180°" : "❌ Es mayor que 180°"}

💡 Verifica tus coordenadas`);
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:8000/lugares/distancia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grupo,
          nombre,
          lat_usuario: latNum,
          lon_usuario: lonNum
        })
      });

      const data = await res.json();

      if (!res.ok) {
        // Manejo especial de error 404 (lugar no encontrado)
        if (res.status === 404) {
          setError(`❌ Lugar no encontrado

🔍 No se encontró ningún lugar llamado "${nombre}" en el grupo "${grupo}"

Posibles causas:
   • El nombre no coincide exactamente con el registrado
   • El lugar no existe en la base de datos
   • El lugar pertenece a otro grupo

💡 Sugerencias:
   1. Verifica que el nombre sea exacto (incluyendo mayúsculas y espacios)
   2. Intenta con otro grupo en el selector
   3. Ve a "Agregar Lugar" para registrar este lugar primero
   4. Usa "Lugares Cercanos" para ver qué lugares están disponibles

Datos de búsqueda:
   • Nombre buscado: "${nombre}"
   • Grupo seleccionado: ${grupo}`);
        } else {
          setError(`❌ Error del servidor

⚠️ El servidor respondió con un error al calcular la distancia

Código de estado: ${res.status}
Mensaje: ${JSON.stringify(data)}

💡 Posibles soluciones:
   • Verifica que el backend esté ejecutándose
   • Intenta nuevamente en unos momentos
   • Verifica que los datos sean correctos`);
        }
      } else {
        setResultado(data);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Link href="/" className="text-purple-600 hover:text-purple-800 font-medium">
            ← Volver al inicio
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-purple-600 mb-2">📏 Calcular Distancia</h1>
          <p className="text-gray-600">Calcula la distancia exacta entre tu ubicación y un lugar específico</p>
        </div>

        {/* Info Box */}
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6 rounded-r-lg">
          <h3 className="font-bold text-purple-800 mb-2">💡 Guía de uso</h3>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Selecciona el grupo al que pertenece el lugar</li>
            <li>• Ingresa el nombre exacto del lugar registrado</li>
            <li>• Proporciona las coordenadas de tu ubicación actual</li>
            <li>• El sistema calculará la distancia en kilómetros usando el método de Haversine</li>
          </ul>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="mb-4">
            <label className="block font-semibold text-gray-700 mb-2">Grupo</label>
            <select
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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

          <div className="mb-4">
            <label className="block font-semibold text-gray-700 mb-2">Nombre del Lugar</label>
            <input
              type="text"
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Cervecería Antares Puerto Madero"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Tu Latitud <span className="text-sm text-gray-500">(-90 a 90)</span>
              </label>
              <input
                type="number"
                step="any"
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                placeholder="Ej: -58.381592"
              />
            </div>
          </div>

          <button
            onClick={calcular}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Calculando distancia...
              </>
            ) : (
              "Calcular Distancia"
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
            <pre className="text-red-800 whitespace-pre-wrap font-sans text-sm">{error}</pre>
          </div>
        )}

        {/* Result */}
        {resultado && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
            <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center">
              <span className="mr-2">🎯</span>
              Resultado del Cálculo
            </h2>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 mb-4">
              <div className="text-center">
                <p className="text-gray-600 mb-2">Distancia hasta</p>
                <p className="text-2xl font-bold text-gray-800 mb-4">{resultado.lugar}</p>
                <div className="bg-white rounded-lg p-4 inline-block shadow-md">
                  <p className="text-5xl font-bold text-purple-600">
                    {resultado.distancia.toFixed(2)}
                  </p>
                  <p className="text-gray-600 font-semibold mt-1">kilómetros</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-700 mb-2">📍 Ubicación del lugar</h3>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Latitud:</span> {resultado.lat_lugar.toFixed(6)}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Longitud:</span> {resultado.lon_lugar.toFixed(6)}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-700 mb-2">📱 Tu ubicación</h3>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Latitud:</span> {parseFloat(lat).toFixed(6)}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Longitud:</span> {parseFloat(lon).toFixed(6)}
                </p>
              </div>
            </div>

            <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg">
              <p className="text-sm text-blue-800">
                💡 Distancia calculada usando el método de Haversine sobre la superficie esférica de la Tierra
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}