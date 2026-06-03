import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:8001/api";

const CATEGORIAS = ["Diseño", "Programación", "Marketing", "Data", "Fotografía"];
const NIVELES    = ["Básico", "Intermedio", "Avanzado"];

export default function EditSkillModal({ skill, userId, token, onClose, onSaved, onDeleted }) {
  const [form,     setForm]     = useState({});
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error,    setError]    = useState("");

  useEffect(() => {
    if (skill) setForm({
      title:       skill.title       || "",
      category:    skill.category    || "",
      level:       skill.level       || "",
      description: skill.description || "",
      price:       skill.price       || 0,
    });
  }, [skill]);

  if (!skill) return null;

  const authHeaders = {
    headers: {
      Authorization:  `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const handleSave = async () => {
    if (!form.title.trim()) return setError("El título es obligatorio.");
    setSaving(true);
    setError("");
    try {
      const res = await axios.put(
        `${API}/users/${userId}/services/${skill.id}`,
        { ...skill, ...form, price: Number(form.price) },
        authHeaders
      );
      onSaved(res.data);
      onClose();
    } catch (e) {
      setError(e?.response?.data?.message || "Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que quieres eliminar esta habilidad?")) return;
    setDeleting(true);
    try {
      await axios.delete(
        `${API}/users/${userId}/services/${skill.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onDeleted(skill.id);
      onClose();
    } catch (e) {
      setError(e?.response?.data?.message || "Error al eliminar.");
    } finally {
      setDeleting(false);
    }
  };

  const field = (label, key, type = "text", extra = {}) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        {label}
      </label>
      <input
        type={type}
        value={form[key] ?? ""}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:ring-2 focus:ring-yellow-400/50 transition"
        {...extra}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-md bg-black/70 backdrop-blur-3xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-green-400 via-yellow-400 to-green-400" />

        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">Editar habilidad</h2>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-lg">
            ✕
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-4 overflow-y-auto max-h-[60vh]">

          {/* Título */}
          {field("Título", "title")}

          {/* Categoría */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Categoría</label>
            <select
              value={form.category || ""}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:ring-2 focus:ring-yellow-400/50 transition"
            >
              <option value="" className="text-black">Seleccionar...</option>
              {CATEGORIAS.map(c => <option key={c} value={c} className="text-black">{c}</option>)}
            </select>
          </div>

          {/* Nivel */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Nivel</label>
            <select
              value={form.level || ""}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:ring-2 focus:ring-yellow-400/50 transition"
            >
              <option value="" className="text-black">Seleccionar...</option>
              {NIVELES.map(n => <option key={n} value={n} className="text-black">{n}</option>)}
            </select>
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Descripción</label>
            <textarea
              rows={3}
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="px-4 py-3 rounded-xl resize-none bg-white/10 border border-white/20 text-white text-sm outline-none focus:ring-2 focus:ring-yellow-400/50 transition"
            />
          </div>

          {/* Precio */}
          {field("Precio (COP)", "price", "number", { min: 0 })}

          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>

        <div className="px-6 py-5 border-t border-white/10 flex gap-3">
          <button onClick={handleDelete} disabled={deleting}
            className="py-2.5 px-4 rounded-xl text-sm font-semibold bg-red-500/20 border border-red-400/30 text-red-400 hover:bg-red-500/30 transition disabled:opacity-50">
            {deleting ? "Eliminando..." : "🗑 Eliminar"}
          </button>
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/10 border border-white/20 hover:bg-white/20 transition">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-yellow-400 text-black hover:scale-[1.02] transition disabled:opacity-50">
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}