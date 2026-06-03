import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditSkillModal from "../../components/EditSkillModal";

const API = "https://talentlink-1-bbse.onrender.com/api";

function SkillModal({ skill, user, onClose }) {
  if (!skill || !user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />
      <div
        className="
        relative z-10 w-full max-w-lg
        bg-gradient-to-br from-black/80 via-green-950/60 to-black/80
        backdrop-blur-3xl border border-white/15
        rounded-3xl overflow-hidden
        shadow-[0_0_80px_rgba(0,0,0,0.6)]
        flex flex-col
      "
      >
        <div className="h-1 w-full bg-gradient-to-r from-green-400 via-yellow-400 to-green-400" />

        <div className="flex items-start justify-between px-7 pt-7 pb-4">
          <div className="flex-1 pr-4">
            <p className="text-xs font-semibold text-yellow-400 uppercase tracking-widest mb-1">
              {skill.category || "Sin categoría"}
            </p>
            <h2 className="text-2xl font-extrabold text-white leading-tight">
              {skill.title || "Sin título"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center shrink-0 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-3 px-7 pb-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-full shrink-0 bg-gradient-to-br from-yellow-400 to-green-400 flex items-center justify-center text-black font-bold text-sm">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{user.name}</p>
            <p className="text-xs text-gray-400">
              {user.descripcion || "Sin descripción"}
            </p>
          </div>
        </div>

        <div className="px-7 py-6 flex flex-col gap-5">
          <p className="text-gray-300 text-sm leading-relaxed">
            {skill.description || "Este talento no tiene descripción."}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-white">
              📶 {skill.level || "N/A"}
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-400/15 border border-yellow-400/30 text-yellow-300">
              {"⭐".repeat(Math.min(skill.rating || 0, 5))} ({skill.rating || 0}
              )
            </span>
            {skill.price > 0 && (
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-400/15 border border-green-400/30 text-green-300">
                💰 ${Number(skill.price).toLocaleString("es-CO")}
              </span>
            )}
          </div>
        </div>

        <div className="px-7 pb-7">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-semibold bg-yellow-400 text-black hover:scale-[1.02] transition shadow-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [active, setActive] = useState("talents");
  const [talents, setTalents] = useState([]);

  const [editOpen, setEditOpen] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [saving, setSaving] = useState(false);

  const [viewSkill, setViewSkill] = useState(null);
  const [editSkill, setEditSkill] = useState(null);

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchTalents = () => {
    if (user && token) {
      axios
        .get(`${API}/users/${user.id}/services`, authHeaders)
        .then((res) => setTalents(res.data))
        .catch(() => setTalents([]));
    }
  };

  useEffect(() => {
    fetchTalents();
  }, [user, token]);
  useEffect(() => {
    if (editOpen) setDescripcion(user?.descripcion || "");
  }, [editOpen, user]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await axios.patch(
        `${API}/users/${user.id}`,
        { descripcion },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      user.descripcion = descripcion;
      setEditOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="text-white text-center mt-20">Cargando perfil...</div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-28 px-4 sm:px-6 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-green-950 to-yellow-500 opacity-90 -z-10" />
      <div className="absolute w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-green-400/20 blur-[120px] rounded-full top-10 left-10" />
      <div className="absolute w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-yellow-400/20 blur-[120px] rounded-full bottom-10 right-10" />

      <div className="relative max-w-5xl mx-auto mb-4">
        {/* HEADER CARD */}
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
              <p className="text-xl sm:text-2xl font-bold">{talents.length}</p>
              <p className="text-gray-300 text-xs sm:text-sm">Habilidades</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">0</p>
              <p className="text-gray-300 text-xs sm:text-sm">Publicaciones</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-4 mt-6">
            <button
              onClick={() => navigate("/publish")}
              className="px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base bg-yellow-400 text-black font-semibold hover:scale-105 transition"
            >
              Publicar talento
            </button>
            <button
              onClick={() => setEditOpen(true)}
              className="px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base bg-white/10 border border-white/20 hover:bg-white/20 transition"
            >
              Editar perfil
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-4 sm:gap-6 mt-8 sm:mt-10 justify-center">
          <button
            onClick={() => setActive("talents")}
            className={`px-3 sm:px-4 py-2 rounded-xl transition text-sm sm:text-base ${active === "talents" ? "bg-yellow-400 text-black" : "bg-white/10"}`}
          >
            Mis talentos
          </button>
          <button
            onClick={() => setActive("activity")}
            className={`px-3 sm:px-4 py-2 rounded-xl transition text-sm sm:text-base ${active === "activity" ? "bg-yellow-400 text-black" : "bg-white/10"}`}
          >
            Actividad
          </button>
        </div>

        {/* CONTENT */}
        <div className="mt-6 sm:mt-8">
          {active === "talents" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {talents.length > 0 ? (
                talents.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col gap-3 hover:border-white/40 transition"
                  >
                    {t.category && (
                      <span className="text-xs font-semibold text-yellow-400 uppercase tracking-widest">
                        {t.category}
                      </span>
                    )}
                    <div>
                      <h3 className="font-bold text-base sm:text-lg">
                        {t.title || "Sin título"}
                      </h3>
                      <p className="text-gray-300 text-xs sm:text-sm">
                        Nivel: {t.level || "N/A"}
                      </p>
                      <p className="text-yellow-300 mt-1">
                        {"⭐".repeat(t.rating || 0)}
                      </p>
                      {t.price > 0 && (
                        <p className="text-green-300 text-xs font-semibold mt-1">
                          ${Number(t.price).toLocaleString("es-CO")}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => setViewSkill(t)}
                        className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-yellow-400 text-black hover:scale-105 transition"
                      >
                        Ver propuesta
                      </button>
                      <button
                        onClick={() => setEditSkill(t)}
                        className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-white/10 border border-white/20 hover:bg-white/20 transition"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-300 text-sm sm:text-base">
                  No tienes talentos aún
                </p>
              )}
            </div>
          )}

          {active === "activity" && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <p className="text-gray-300 text-sm sm:text-base">
                🔥 Actividad próximamente...
              </p>
            </div>
          )}
        </div>
        {user.githubUsername && (
          <GithubExplorer githubUsername={user.githubUsername} />
        )}
      </div>

      {/* EDIT PROFILE SLIDE-OVER */}
      <div
        onClick={() => setEditOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${editOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />
      <div
        className={`fixed top-0 right-0 h-full z-50 w-full sm:w-[420px] bg-black/60 backdrop-blur-3xl border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${editOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h2 className="text-lg font-bold">Editar perfil</h2>
          <button
            onClick={() => setEditOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-lg"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={5}
              maxLength={300}
              placeholder="Cuéntale al mundo quién eres y qué haces..."
              className="w-full px-4 py-3 rounded-xl resize-none bg-white/10 border border-white/20 text-white text-sm placeholder-gray-500 outline-none focus:ring-2 focus:ring-yellow-400/50 transition"
            />
            <p className="text-right text-xs text-gray-500">
              {descripcion.length}/300
            </p>
          </div>
        </div>
        <div className="px-6 py-5 border-t border-white/10 flex gap-3">
          <button
            onClick={() => setEditOpen(false)}
            className="flex-1 py-3 rounded-xl text-sm font-semibold bg-white/10 border border-white/20 hover:bg-white/20 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="flex-1 py-3 rounded-xl text-sm font-semibold bg-yellow-400 text-black hover:scale-[1.02] transition disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>

      {/* VIEW SKILL MODAL */}
      <SkillModal
        skill={viewSkill}
        user={user}
        onClose={() => setViewSkill(null)}
      />

      {/* EDIT SKILL MODAL */}
      <EditSkillModal
        skill={editSkill}
        userId={user.id}
        token={token}
        onClose={() => setEditSkill(null)}
        onSaved={(updated) =>
          setTalents((prev) =>
            prev.map((t) => (t.id === updated.id ? updated : t)),
          )
        }
        onDeleted={(id) =>
          setTalents((prev) => prev.filter((t) => t.id !== id))
        }
      />
    </div>
  );
}
