import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">API Turismo - Frontend</h1>

      <div className="flex flex-col gap-4">
        <Link className="bg-blue-600 text-white px-4 py-2 rounded" href="/agregar">
          Agregar Lugar
        </Link>
        <Link className="bg-green-600 text-white px-4 py-2 rounded" href="/cercanos">
          Buscar Lugares Cercanos
        </Link>
        <Link className="bg-purple-600 text-white px-4 py-2 rounded" href="/distancia">
          Calcular Distancia
        </Link>
      </div>
    </div>
  );
}
