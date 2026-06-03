import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Order from "../../components/MakeOrder";
import SkillModal from "../../components/SkillModal";

const API = "http://localhost:8001/api";

export default function PublicProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewSkill, setViewSkill] = useState(null);

  const [orderOpen, setOrderOpen] = useState(false);
  const [orderUser, setOrderUser] = useState(null);
  const [orderSkill, setOrderSkill] = useState(null);

  const handleOpenOrder = (user, skill) => {
    setOrderUser(user);
    setOrderSkill(skill);
    setOrderOpen(true);
  };

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      axios.get(`${API}/users/${userId}`),
      axios.get(`${API}/users/${userId}/services`),
    ])
      .then(([userRes, skillsRes]) => {
        setUser(userRes.data);
        setSkills(skillsRes.data || []);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="text-white text-center mt-20 animate-pulse">
        Cargando perfil...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-white text-center mt-20">
        <p className="text-xl mb-4">Perfil no encontrado.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-xl bg-yellow-400 text-black font-semibold"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-28 px-4 sm:px-6 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-green-950 to-yellow-500 opacity-90" />
      <div className="absolute w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-green-400/20 blur-[120px] rounded-full top-10 left-10" />
      <div className="absolute w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-yellow-400/20 blur-[120px] rounded-full bottom-10 right-10" />

      <div className="relative max-w-5xl mx-auto mb-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
        >
          ← Volver a explorar
        </button>

        <div className="p-5 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
          <h1 className="text-2xl sm:text-4xl font-bold">{user.name}</h1>
          <p className="text-gray-300 mt-1 text-sm sm:text-base">
            {user.descripcion || "Sin descripción"}
          </p>
          <p className="text-yellow-300 mt-2 text-sm sm:text-base">
            {"⭐".repeat(Math.round(user.rating || 0))} (
            {(user.rating || 0).toFixed(1)})
          </p>
          <div className="flex gap-6 sm:gap-8 mt-6">
            <div>
              <p className="text-xl sm:text-2xl font-bold">{skills.length}</p>
              <p className="text-gray-300 text-xs sm:text-sm">Habilidades</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">0</p>
              <p className="text-gray-300 text-xs sm:text-sm">Publicaciones</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mt-10 mb-5">Habilidades</h2>

        {skills.length === 0 ? (
          <p className="text-gray-400">
            Este usuario no tiene habilidades publicadas.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {skills.map((s) => (
              <div
                key={s.id}
                className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col gap-3 hover:border-white/40 transition"
              >
                <div>
                  <h3 className="font-bold text-base sm:text-lg">
                    {s.title || "Sin título"}
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    Nivel: {s.level || "N/A"}
                  </p>
                  <p className="text-yellow-300 mt-1">
                    {"⭐".repeat(s.rating || 0)}
                  </p>
                </div>
                <button
                  onClick={() => setViewSkill({ user, skill: s })}
                  className="mt-auto py-1.5 rounded-lg text-xs font-semibold bg-yellow-400 text-black hover:scale-105 transition"
                >
                  Ver propuesta
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SkillModal sin "Ver perfil" porque ya estamos en el perfil */}
      <SkillModal
        entry={viewSkill}
        onClose={() => setViewSkill(null)}
        onOpenOrder={handleOpenOrder}
      />

      <Order
        open={orderOpen}
        onClose={() => setOrderOpen(false)}
        user={orderUser}
        skill={orderSkill}
      />
    </div>
  );
}
