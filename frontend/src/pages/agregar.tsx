import { useState } from "react";
import Link from "next/link";

export default function Agregar() {
  const [grupo, setGrupo] = useState("cervecerias");
  const [nombre, setNombre] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const enviar = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validar que el nombre no esté vacío
      if (!nombre.trim()) {
        setError(`❌ El nombre del lugar es requerido

📍 Debe proporcionar un nombre identificador para el lugar

💡 Ejemplos válidos:
   • "Cervecería Antares"
   • "Universidad de Buenos Aires"
   • "Farmacia del Pueblo"`);
        setLoading(false);
        return;
      }

      // Validar que lat y lon no estén vacíos
      if (lat.trim() === "" || lon.trim() === "") {
        setError(`❌ Coordenadas geográficas incompletas

🌍 Debe proporcionar tanto latitud como longitud

Valores actuales:
   • Latitud: ${lat.trim() === "" ? "vacía" : lat}
   • Longitud: ${lon.trim() === "" ? "vacía" : lon}

💡 Ejemplo: Buenos Aires está en -34.603722, -58.381592`);
        setLoading(false);
        return;
      }

      // Validar que lat y lon sean números válidos
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
   • 40.7128, -74.0060 (Nueva York)
   • -33.8688, 151.2093 (Sídney)`);
        setLoading(false);
        return;
      }

      // Validar rangos geográficos
      if (latNum < -90 || latNum > 90) {
        setError(`❌ Latitud fuera del rango válido

🌍 La latitud debe estar entre -90° (Polo Sur) y +90° (Polo Norte)

Valor ingresado: ${latNum}°
${latNum < -90 ? "❌ Es menor que -90°" : "❌ Es mayor que 90°"}

💡 Referencia de latitudes:
   • Ecuador: 0°
   • Buenos Aires: -34.6°
   • Ushuaia (punto más sur): -54.8°
   • Polo Sur: -90°
   • Polo Norte: +90°`);
        setLoading(false);
        return;
      }

      if (lonNum < -180 || lonNum > 180) {
        setError(`❌ Longitud fuera del rango válido

🌍 La longitud debe estar entre -180° y +180°

Valor ingresado: ${lonNum}°
${lonNum < -180 ? "❌ Es menor que -180°" : "❌ Es mayor que 180°"}

💡 Referencia de longitudes:
   • Meridiano de Greenwich: 0°
   • Buenos Aires: -58.4°
   • Nueva York: -74.0°
   • Tokio: 139.7°
   • Rango válido: -180° a +180°`);
        setLoading(false);
        return;
      }

      // Validación especial para polos
      if ((latNum === 90 || latNum === -90) && lonNum !== 0) {
        setError(`❌ Coordenadas inválidas en los polos

🌍 En los polos (latitud ±90°), la longitud debe ser 0°

Coordenadas ingresadas:
   • Latitud: ${latNum}° ${latNum === 90 ? "(Polo Norte)" : "(Polo Sur)"}
   • Longitud: ${lonNum}° ❌ Debe ser 0°

💡 En los polos geográficos, todos los meridianos convergen, por lo que la única longitud válida es 0°.

Corrección sugerida: ${latNum}, 0`);
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:8000/lugares/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grupo, nombre, lat: latNum, lon: lonNum })
      });

      const data = await res.json();

      if (!res.ok) {
        // Detectar errores específicos de Redis
        const errorMsg = JSON.stringify(data);
        if (errorMsg.includes("invalid longitude,latitude pair") || 
            errorMsg.includes("longitude") || 
            errorMsg.includes("latitude")) {
          setError(`❌ Error de coordenadas detectado por Redis

🔴 El servidor Redis rechazó las coordenadas proporcionadas

Coordenadas enviadas:
   • Latitud: ${latNum}°
   • Longitud: ${lonNum}°

Posibles causas:
   • Las coordenadas están en el orden incorrecto
   • Redis detectó valores fuera de rango
   • Problema con el formato de precisión

💡 Verifica que:
   1. La latitud esté entre -90 y 90
   2. La longitud esté entre -180 y 180
   3. Los valores sean números decimales válidos

Mensaje del servidor: ${errorMsg}`);
        } else {
          setError(`❌ Error del servidor

⚠️ El servidor respondió con un error

Código de estado: ${res.status}
Mensaje: ${errorMsg}

💡 Por favor, verifica tu conexión e intenta nuevamente`);
        }
      } else {
        setSuccess(`✅ ¡Lugar agregado exitosamente!

📍 Detalles del lugar registrado:
   • Nombre: ${nombre}
   • Grupo: ${grupo}
   • Coordenadas: ${latNum}, ${lonNum}

El lugar ha sido guardado en la base de datos y ya está disponible para búsquedas geoespaciales.`);
        
        // Limpiar formulario tras éxito
        setNombre("");
        setLat("");
        setLon("");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Volver al inicio
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">📍 Agregar Lugar</h1>
          <p className="text-gray-600">Registra un nuevo punto de interés con sus coordenadas geográficas</p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
          <h3 className="font-bold text-blue-800 mb-2">💡 Guía de uso</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Selecciona el grupo al que pertenece el lugar</li>
            <li>• Ingresa un nombre descriptivo</li>
            <li>• Proporciona las coordenadas: latitud (-90 a 90) y longitud (-180 a 180)</li>
            <li>• Puedes usar herramientas como Google Maps para obtener coordenadas exactas</li>
          </ul>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="mb-4">
            <label className="block font-semibold text-gray-700 mb-2">Grupo</label>
            <select
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Cervecería Antares Puerto Madero"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Latitud <span className="text-sm text-gray-500">(-90 a 90)</span>
              </label>
              <input
                type="number"
                step="any"
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="Ej: -34.603722"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Longitud <span className="text-sm text-gray-500">(-180 a 180)</span>
              </label>
              <input
                type="number"
                step="any"
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                placeholder="Ej: -58.381592"
              />
            </div>
          </div>

          <button
            onClick={enviar}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Enviando...
              </>
            ) : (
              "Agregar Lugar"
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
            <pre className="text-red-800 whitespace-pre-wrap font-sans text-sm">{error}</pre>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">
            <pre className="text-green-800 whitespace-pre-wrap font-sans text-sm">{success}</pre>
          </div>
        )}
      </div>
    </div>
  );
}