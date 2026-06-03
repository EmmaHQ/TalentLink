import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-green-950 to-yellow-500 opacity-90 -z-10" />

      {/* planeta orbitando */}
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 border border-dashed border-white/30 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-yellow-400" />
        <div className="absolute w-3 h-3 rounded-full bg-green-400 top-0 left-1/2 -translate-x-1/2 animate-[orbit_3s_linear_infinite]" />
      </div>

      <h1 className="text-8xl font-extrabold tracking-tighter mb-2" style={{textShadow: "-3px 0 #EF9F27, 3px 0 #1D9E75"}}>
        404
      </h1>

      <p className="text-xl font-semibold mb-1">Página no encontrada</p>
      <p className="text-sm text-gray-400 mb-8 text-center max-w-xs">
        Esta página se perdió en el espacio. La URL puede estar mal escrita o ya no existe.
      </p>

      <div className="flex gap-3">
        <button onClick={() => navigate(-1)}
          className="px-5 py-2.5 rounded-xl bg-yellow-400 text-black font-semibold text-sm hover:scale-105 transition">
          ← Volver
        </button>
        <button onClick={() => navigate("/")}
          className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-sm hover:bg-white/20 transition">
          Ir al inicio
        </button>
      </div>
    </div>
  );
}