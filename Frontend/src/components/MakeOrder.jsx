import { useState } from "react";
import axios from "axios";

const API = "http://localhost:8001/api";

function getToken() {
  return localStorage.getItem("token") || "";
}

export default function MakeOrder({ open, onClose, skill, user }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  if (!open || !skill || !user) return null;

  const handleSendOrder = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      await axios.post(`${API}/orders`, null, {
        params: {
          sellerId:    user.id,
          sellerName:  user.name,
          skillId:     skill.id,
          skillTitle:  skill.title,
          message:     message.trim(),
          price:       skill.price ?? 0,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setSent(true);
      setMessage("");
    } catch (err) {
      setError(err?.response?.data?.message || "Error al enviar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSent(false);
    setError("");
    setMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      {/* backdrop */}
      <div onClick={handleClose} className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* card */}
      <div className="
        relative z-10 w-full max-w-md
        bg-gradient-to-br from-black/80 via-green-950/60 to-black/80
        backdrop-blur-3xl border border-white/15
        rounded-3xl overflow-hidden
        shadow-[0_0_80px_rgba(0,0,0,0.6)]
      ">
        {/* top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-green-400 via-yellow-400 to-green-400" />

        <div className="p-7 flex flex-col gap-5">

          {sent ? (
            /* ── ÉXITO ── */
            <div className="flex flex-col items-center gap-4 py-4">
              <span className="text-5xl">🎉</span>
              <p className="text-white font-bold text-lg text-center">¡Solicitud enviada!</p>
              <p className="text-gray-400 text-sm text-center">
                Le hemos notificado a <span className="text-white font-semibold">{user.name}</span> sobre tu interés en <span className="text-yellow-400 font-semibold">{skill.title}</span>.
              </p>
              <button
                onClick={handleClose}
                className="mt-2 px-6 py-2 rounded-xl bg-yellow-400 text-black font-semibold hover:scale-105 transition"
              >
                Cerrar
              </button>
            </div>
          ) : (
            /* ── FORMULARIO ── */
            <>
              {/* header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-yellow-400 uppercase tracking-widest mb-1">
                    Solicitud de servicio
                  </p>
                  <h2 className="text-xl font-extrabold text-white leading-tight">
                    {skill.title || "Sin título"}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                >
                  ✕
                </button>
              </div>

              {/* info del vendedor */}
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-green-400 flex items-center justify-center text-black font-bold text-sm shrink-0">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.descripcion || "Sin descripción"}</p>
                </div>
                {skill.price > 0 && (
                  <span className="text-green-300 text-xs font-bold shrink-0">
                    💰 ${Number(skill.price).toLocaleString("es-CO")}
                  </span>
                )}
              </div>

              {/* textarea */}
              <div>
                <p className="text-xs text-gray-400 mb-2">Tu mensaje</p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Cuéntale qué necesitas, cuándo lo necesitas y cualquier detalle relevante..."
                  rows={4}
                  className="w-full resize-none p-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder-gray-500 outline-none focus:ring-1 focus:ring-yellow-400/50 transition"
                />
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              {/* actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold bg-white/10 border border-white/20 hover:bg-white/20 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSendOrder}
                  disabled={loading || !message.trim()}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold bg-yellow-400 text-black hover:scale-[1.02] transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? "Enviando..." : "Enviar solicitud"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}