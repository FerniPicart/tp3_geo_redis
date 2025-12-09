import { useState } from "react";
import FormInput from "@/components/FormInput";

export default function Agregar() {
  const [grupo, setGrupo] = useState("cervecerias");
  const [nombre, setNombre] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [respuesta, setRespuesta] = useState("");

  const enviar = async () => {
    // Validar que lat y lon sean números válidos
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    
    if (isNaN(latNum) || isNaN(lonNum)) {
      setRespuesta(JSON.stringify({error: "Latitud y Longitud deben ser números válidos"}, null, 2));
      return;
    }

    // Validar rangos geográficos
    if (latNum < -90 || latNum > 90) {
      setRespuesta(JSON.stringify({error: "Latitud debe estar entre -90 y 90 grados"}, null, 2));
      return;
    }

    if (lonNum < -180 || lonNum > 180) {
      setRespuesta(JSON.stringify({error: "Longitud debe estar entre -180 y 180 grados"}, null, 2));
      return;
    }

    // Validar que el nombre no esté vacío
    if (! nombre.trim()) {
      setRespuesta(JSON.stringify({error: "El nombre es requerido"}, null, 2));
      return;
    }

    const res = await fetch("http://localhost:8000/lugares/agregar", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grupo, nombre, lat: latNum, lon: lonNum })
    });

    setRespuesta(JSON.stringify(await res.json(), null, 2));
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl mb-4 font-bold">Agregar Lugar</h1>

      <div>
        <label className="font-semibold">Grupo</label>
        <select
          className="border p-2 rounded w-full mb-4"
          value={grupo}
          onChange={(e) => setGrupo(e.target. value)}
        >
          <option value="cervecerias">Cervecerías</option>
          <option value="universidades">Universidades</option>
          <option value="farmacias">Farmacias</option>
          <option value="emergencias">Emergencias</option>
          <option value="supermercados">Supermercados</option>
        </select>
      </div>

      <FormInput label="Nombre" value={nombre} onChange={setNombre} />
      
      <div className="mb-4">
        <label className="font-semibold">Latitud (-90 a 90)</label>
        <input
          type="number"
          step="any"
          min="-90"
          max="90"
          className="border p-2 rounded w-full"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          placeholder="-32.48"
        />
      </div>

      <div className="mb-4">
        <label className="font-semibold">Longitud (-180 a 180)</label>
        <input
          type="number"
          step="any"
          min="-180"
          max="180"
          className="border p-2 rounded w-full"
          value={lon}
          onChange={(e) => setLon(e.target.value)}
          placeholder="-58.24"
        />
      </div>

      <button
        onClick={enviar}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
      >
        Enviar
      </button>

      {respuesta && (
        <pre className="bg-gray-900 text-white p-4 mt-4 rounded">{respuesta}</pre>
      )}
    </div>
  );
}