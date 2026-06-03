import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Order from "../../components/MakeOrder";
import SkillModal from "../../components/SkillModal";

const API = "http://localhost:8001/api";

async function fetchRandomSkillsPerUser() {
  const usersRes = await axios.get(`${API}/users`);
  const users = usersRes.data;

  const results = await Promise.allSettled(
    users.map(async (user) => {
      const skillsRes = await axios.get(`${API}/users/${user.id}/services`);
      const skills = skillsRes.data;
      if (!skills || skills.length === 0) return null;
      const random = skills[Math.floor(Math.random() * skills.length)];
      return { user, skill: random };
    }),
  );

  return results
    .filter((r) => r.status === "fulfilled" && r.value !== null)
    .map((r) => r.value);
}

export default function Explore() {
  const navigate = useNavigate();

  const [entries,  setEntries]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);
  const [selected, setSelected] = useState(null);

  const [orderOpen,  setOrderOpen]  = useState(false);
  const [orderUser,  setOrderUser]  = useState(null);
  const [orderSkill, setOrderSkill] = useState(null);

  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("");
  const [level,    setLevel]    = useState("");
  const [rating,   setRating]   = useState(0);

  const handleOpenOrder = (user, skill) => {
    setOrderUser(user);
    setOrderSkill(skill);
    setOrderOpen(true);
  };

  useEffect(() => {
    fetchRandomSkillsPerUser()
      .then(setEntries)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return entries.filter(({ user, skill }) => {
      const haystack = (user.name + (skill.title || "") + (skill.category || "")).toLowerCase();
      const matchSearch   = !search   || haystack.includes(search.toLowerCase());
      const matchCategory = !category || (skill.category || "").toLowerCase().includes(category.toLowerCase());
      const matchLevel    = !level    || skill.level === level;
      const matchRating   = !rating   || (skill.rating || 0) >= rating;
      return matchSearch && matchCategory && matchLevel && matchRating;
    });
  }, [entries, search, category, level, rating]);

  return (
    <div className="min-h-screen text-white pt-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-green-950 to-yellow-500 opacity-90 -z-10" />

      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-5xl font-extrabold mb-3">
          Explora <span className="text-yellow-400">Talentos</span>
        </h1>
        <p className="text-gray-200">Encuentra estudiantes por habilidad, nivel y calificación</p>
      </div>

      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Buscar talento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white outline-none focus:ring-2 focus:ring-yellow-400/50"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-8 mb-12">
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Categorías</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white outline-none">
            <option value="" className="text-black">Todas</option>
            <option value="Diseño" className="text-black">Diseño</option>
            <option value="Programación" className="text-black">Programación</option>
            <option value="Marketing" className="text-black">Marketing</option>
            <option value="Data" className="text-black">Data</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Nivel</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white outline-none">
            <option value="" className="text-black">Todos</option>
            <option value="Básico" className="text-black">Básico</option>
            <option value="Intermedio" className="text-black">Intermedio</option>
            <option value="Avanzado" className="text-black">Avanzado</option>
          </select>
        </div>

        <div className="flex flex-col items-center">
          <label className="text-sm text-gray-300 mb-1">Calificación ({rating}+)</label>
          <input type="range" min="0" max="5" step="1" value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-40 accent-yellow-400" />
        </div>

        <button
          onClick={() => { setSearch(""); setCategory(""); setLevel(""); setRating(0); }}
          className="px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition self-end"
        >
          Reset filtros
        </button>
      </div>

      {loading && <p className="text-center text-gray-300 animate-pulse mb-8">Cargando talentos...</p>}
      {error   && <p className="text-center text-red-400 mb-8">Error al cargar talentos. Revisa el backend.</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-center text-gray-400 mb-8">No hay resultados para tu búsqueda.</p>
      )}

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-3">
        {filtered.map(({ user, skill }) => (
          <div key={`${user.id}-${skill.id}`}
            className="relative group p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden hover:scale-[1.03] transition duration-300 flex flex-col gap-3"
          >
            {skill.category && (
              <span className="text-xs font-semibold text-yellow-400 uppercase tracking-widest">
                {skill.category}
              </span>
            )}
            <div>
              <h2 className="text-xl font-bold mb-1">{user.name}</h2>
              <p className="text-gray-200 text-sm">{skill.title || "Sin título"}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-yellow-300 text-sm">
                {"⭐".repeat(skill.rating || 0)} ({skill.rating || 0})
              </div>
              {skill.price > 0 && (
                <span className="text-green-300 text-xs font-semibold">
                  ${Number(skill.price).toLocaleString("es-CO")}
                </span>
              )}
            </div>
            <span className="text-xs px-3 py-1 w-fit rounded-full bg-yellow-400/20 text-yellow-300">
              {skill.level || "N/A"}
            </span>
            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => setSelected({ user, skill })}
                className="flex-1 py-2 rounded-xl bg-yellow-400 text-black font-semibold text-sm hover:scale-[1.02] transition"
              >
                Ver habilidad
              </button>
              <button
                onClick={() => navigate(`/profile/${user.id}`)}
                className="flex-1 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition text-sm"
              >
                Ver perfil
              </button>
            </div>
          </div>
        ))}
      </div>

      <SkillModal
        entry={selected}
        onClose={() => setSelected(null)}
        onViewProfile={(id) => navigate(`/profile/${id}`)}
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