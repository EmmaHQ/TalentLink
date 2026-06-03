import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:8001/api";

function getToken() {
  return localStorage.getItem("token") || "";
}

function getCurrentUserId() {
  try {
    const token = getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || payload.id || payload.userId || null;
  } catch {
    return null;
  }
}

// ── STAR DISPLAY ──────────────────────────────────────────────────
function Stars({ value, max = 5, size = "text-sm" }) {
  return (
    <span className={size}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < value ? "text-yellow-400" : "text-white/20"}>
          ★
        </span>
      ))}
    </span>
  );
}

// ── STAR PICKER ───────────────────────────────────────────────────
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className={`text-2xl transition-transform hover:scale-110 ${
            n <= (hovered || value) ? "text-yellow-400" : "text-white/25"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ── REVIEWS SECTION ───────────────────────────────────────────────
function ReviewsSection({ skillId, skillOwnerId }) {
  const currentUserId = getCurrentUserId();
  const isOwn = currentUserId && currentUserId === skillOwnerId;

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitOk, setSubmitOk] = useState(false);

  useEffect(() => {
    if (!skillId) return;
    setLoadingReviews(true);
    axios
      .get(`${API}/reviews?skillId=${skillId}`)
      .then((res) => {
        const data = res.data;
        setReviews(data);
        if (currentUserId) {
          setAlreadyReviewed(data.some((r) => r.userId === currentUserId));
        }
      })
      .catch(() => setReviews([]))
      .finally(() => setLoadingReviews(false));
  }, [skillId]);

  async function handleSubmit() {
    if (rating === 0 || comment.trim().length < 3) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const token = getToken();
      const res = await axios.post(
        `${API}/reviews`,
        { skillId, skillOwnerId, comment: comment.trim(), rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setReviews((prev) => [res.data, ...prev]);
      setAlreadyReviewed(true);
      setSubmitOk(true);
      setRating(0);
      setComment("");
    } catch (e) {
      setSubmitError(e?.response?.data?.message || "Error al enviar la reseña.");
    } finally {
      setSubmitting(false);
    }
  }

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="mt-1">
      <div className="h-px w-full bg-white/10 mb-5" />

      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-green-400">
          Reseñas
        </p>
        {avgRating && (
          <div className="flex items-center gap-1.5">
            <Stars value={Math.round(avgRating)} />
            <span className="text-xs text-gray-400">{avgRating} / 5</span>
          </div>
        )}
      </div>

      {loadingReviews ? (
        <p className="text-xs text-gray-500 animate-pulse mb-4">Cargando reseñas...</p>
      ) : reviews.length === 0 ? (
        <p className="text-xs text-gray-500 mb-4">Aún no hay reseñas. ¡Sé el primero!</p>
      ) : (
        <div className="flex flex-col gap-3 mb-5 max-h-44 overflow-y-auto pr-1">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-white">{r.userName}</p>
                <Stars value={r.rating} size="text-xs" />
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      )}

      {!currentUserId ? (
        <p className="text-xs text-gray-500 italic">Inicia sesión para dejar una reseña.</p>
      ) : isOwn ? (
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
          <span className="text-base">🔒</span>
          <p className="text-xs text-gray-400">No puedes reseñar tus propias habilidades.</p>
        </div>
      ) : alreadyReviewed ? (
        <div className="flex items-center gap-2 bg-green-400/10 border border-green-400/20 rounded-xl px-4 py-3">
          <span className="text-base">✅</span>
          <p className="text-xs text-green-300">Ya enviaste una reseña para esta habilidad.</p>
        </div>
      ) : submitOk ? (
        <div className="flex items-center gap-2 bg-green-400/10 border border-green-400/20 rounded-xl px-4 py-3">
          <span className="text-base">🎉</span>
          <p className="text-xs text-green-300">¡Reseña enviada con éxito!</p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-300">Deja tu reseña</p>
          <StarPicker value={rating} onChange={setRating} />
          <textarea
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="¿Qué te pareció esta habilidad?"
            className="w-full resize-none rounded-xl bg-white/10 border border-white/15 text-white text-xs placeholder-gray-500 px-3 py-2 outline-none focus:ring-1 focus:ring-yellow-400/50 transition"
          />
          {submitError && <p className="text-xs text-red-400">{submitError}</p>}
          <button
            onClick={handleSubmit}
            disabled={submitting || rating === 0 || comment.trim().length < 3}
            className="py-2 rounded-xl text-xs font-bold bg-yellow-400 text-black disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] transition"
          >
            {submitting ? "Enviando..." : "Enviar reseña"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── SKILL MODAL ───────────────────────────────────────────────────
// Props:
//   entry        → { user, skill } | null
//   onClose      → () => void
//   onViewProfile → (userId) => void   (opcional, no se muestra el botón si no se pasa)
//   onOpenOrder  → (user, skill) => void
export default function SkillModal({ entry, onClose, onViewProfile, onOpenOrder }) {
  if (!entry) return null;
  const { user, skill } = entry;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* card */}
      <div className="
        relative z-10 w-full max-w-lg
        bg-gradient-to-br from-black/80 via-green-950/60 to-black/80
        backdrop-blur-3xl border border-white/15
        rounded-3xl overflow-hidden
        shadow-[0_0_80px_rgba(0,0,0,0.6)]
        flex flex-col max-h-[90vh]
      ">
        {/* top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 shrink-0" />

        {/* scrollable body */}
        <div className="overflow-y-auto flex-1">
          {/* header */}
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

          {/* author row */}
          <div className="flex items-center gap-3 px-7 pb-5 border-b border-white/10">
            <div className="w-9 h-9 rounded-full shrink-0 bg-gradient-to-br from-yellow-400 to-green-400 flex items-center justify-center text-black font-bold text-sm">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-xs text-gray-400">{user.descripcion || "Sin descripción"}</p>
            </div>
          </div>

          {/* body */}
          <div className="px-7 py-6 flex flex-col gap-5">
            <p className="text-gray-300 text-sm leading-relaxed">
              {skill.description || "Este talento no tiene descripción."}
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-white">
                📶 {skill.level || "N/A"}
              </span>
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-400/15 border border-yellow-400/30 text-yellow-300">
                {"⭐".repeat(Math.min(skill.rating || 0, 5))} ({skill.rating || 0})
              </span>
              {skill.price > 0 && (
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-400/15 border border-green-400/30 text-green-300">
                  💰 ${Number(skill.price).toLocaleString("es-CO")}
                </span>
              )}
            </div>

            <ReviewsSection skillId={skill.id} skillOwnerId={user.id} />
          </div>
        </div>

        {/* footer */}
        <div className="px-7 pb-7 pt-4 flex gap-3 shrink-0 border-t border-white/10 bg-black/30">
          {/* "Ver perfil" solo si se pasa el callback */}
          {onViewProfile && (
            <button
              onClick={() => { onClose(); onViewProfile(user.id); }}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-white/10 border border-white/20 hover:bg-white/20 transition"
            >
              Ver perfil
            </button>
          )}
          <button
            onClick={() => { onClose(); onOpenOrder(user, skill); }}
            className="flex-1 py-3 rounded-xl text-sm font-semibold bg-yellow-400 text-black hover:scale-[1.02] transition shadow-lg"
          >
            Contactar
          </button>
        </div>
      </div>
    </div>
  );
}