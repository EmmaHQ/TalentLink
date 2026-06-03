import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const API = "https://talentlink-1-bbse.onrender.com/api";

const categories = ["Diseño", "Programación", "Marketing", "Data", "IA"];
const levels = ["Básico", "Intermedio", "Avanzado"];

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "",
  level: "",
  price: "",
};

export default function Publish() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [form, setForm]       = useState(EMPTY_FORM);
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  // Redirigir si no está logueado
  useEffect(() => {
    if (user === null && token === null) {
      navigate("/login");
    }
  }, [user, token]);

  if (!user) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const validate = () => {
    if (!form.title.trim())       return "El nombre del talento es obligatorio.";
    if (!form.description.trim()) return "La descripción es obligatoria.";
    if (!form.category)           return "Selecciona una categoría.";
    if (!form.level)              return "Selecciona un nivel.";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setSaving(true);
    setError("");

    try {
      await axios.post(
        `${API}/users/${user.id}/services`,
        {
          ...form,
          price: form.price ? Number(form.price) : 0,
          rating: 0,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(true);
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error(err);
      setError("Error al publicar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="
      min-h-screen relative overflow-hidden
      pt-28 px-6 text-white
      flex justify-center
    ">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-green-950 to-yellow-500 opacity-90" />
      <div className="absolute w-[500px] h-[500px] bg-green-400/20 blur-[120px] rounded-full top-10 left-10" />
      <div className="absolute w-[400px] h-[400px] bg-yellow-400/20 blur-[120px] rounded-full bottom-10 right-10" />

      {/* CONTENT */}
      <div className="relative w-full max-w-3xl">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight">
            Publica tu <span className="text-yellow-400">talento</span>
          </h1>
          <p className="text-gray-200 mt-4 text-lg max-w-xl mx-auto">
            Comparte lo que sabes, conecta con estudiantes y haz crecer tu perfil dentro de TalentLink.
          </p>
        </div>

        {/* SUCCESS BANNER */}
        {success && (
          <div className="
            mb-6 px-5 py-4 rounded-2xl
            bg-green-400/15 border border-green-400/30
            text-green-300 text-sm font-semibold
            flex items-center justify-between gap-4
          ">
            <span>🎉 ¡Talento publicado correctamente!</span>
            <div className="flex gap-3">
              <button
                onClick={() => setSuccess(false)}
                className="underline text-green-200 hover:text-white transition text-xs"
              >
                Publicar otro
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="underline text-green-200 hover:text-white transition text-xs"
              >
                Ver mi perfil
              </button>
            </div>
          </div>
        )}

        {/* FORM CARD */}
        <div className="
          p-8 rounded-3xl mb-8
          bg-white/10 backdrop-blur-2xl
          border border-white/20
          shadow-2xl
          flex flex-col gap-4
        ">

          {/* TITULO */}
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Nombre de tu talento"
            className="
              w-full px-4 py-3 rounded-xl
              bg-white/10 border border-white/20
              outline-none text-white placeholder-gray-200
              focus:ring-2 focus:ring-yellow-400/40 transition
            "
          />

          {/* DESCRIPCIÓN */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe tu talento..."
            className="
              w-full px-4 py-3 rounded-xl
              bg-white/10 border border-white/20
              outline-none text-white placeholder-gray-200
              h-32 resize-none
              focus:ring-2 focus:ring-yellow-400/40 transition
            "
          />

          {/* CATEGORÍA + NIVEL */}
          <div className="grid md:grid-cols-2 gap-4">

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="
                px-4 py-3 rounded-xl
                bg-white/10 border border-white/20
                text-white outline-none
                focus:ring-2 focus:ring-yellow-400/40
              "
            >
              <option value="" className="text-black">Categoría</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="text-black">{cat}</option>
              ))}
            </select>

            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className="
                px-4 py-3 rounded-xl
                bg-white/10 border border-white/20
                text-white outline-none
                focus:ring-2 focus:ring-yellow-400/40
              "
            >
              <option value="" className="text-black">Nivel</option>
              {levels.map((lvl) => (
                <option key={lvl} value={lvl} className="text-black">{lvl}</option>
              ))}
            </select>

          </div>

          {/* PRECIO (opcional) */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              placeholder="Precio (opcional)"
              className="
                w-full pl-8 pr-4 py-3 rounded-xl
                bg-white/10 border border-white/20
                outline-none text-white placeholder-gray-200
                focus:ring-2 focus:ring-yellow-400/40 transition
              "
            />
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-400 text-sm font-medium px-1">{error}</p>
          )}

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="
              mt-2 w-full py-3 rounded-xl
              bg-yellow-400 text-black font-semibold
              hover:scale-[1.02] transition shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
            "
          >
            {saving ? "Publicando..." : "Publicar talento"}
          </button>

        </div>

      </div>
    </div>
  );
}