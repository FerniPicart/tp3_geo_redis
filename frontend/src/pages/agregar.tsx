import { useState } from "react";
import FormInput from "@/components/FormInput";

export default function Agregar() {
  const [grupo, setGrupo] = useState("cervecerias");
  const [nombre, setNombre] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [respuesta, setRespuesta] = useState("");

  const enviar = async () => {
    const res = await fetch("http://localhost:8000/lugares/agregar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grupo, nombre, lat: Number(lat), lon: Number(lon) })
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
          onChange={(e) => setGrupo(e.target.value)}
        >
          <option value="cervecerias">Cervecerías</option>
          <option value="universidades">Universidades</option>
          <option value="farmacias">Farmacias</option>
          <option value="emergencias">Emergencias</option>
          <option value="supermercados">Supermercados</option>
        </select>
      </div>

      <FormInput label="Nombre" value={nombre} onChange={setNombre} />
      <FormInput label="Latitud" value={lat} onChange={setLat} />
      <FormInput label="Longitud" value={lon} onChange={setLon} />


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
