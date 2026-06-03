import { useParams } from "react-router-dom";

const skills = [
  {
    id: 0,
    name: "Diseño UX/UI",
    person: "Ana López",
    description:
      "Diseño de interfaces modernas enfocadas en experiencia de usuario.",
    category: "Diseño",
    level: "Avanzado",
    rating: 5,
  },
  {
    id: 1,
    name: "React Developer",
    person: "Carlos Ruiz",
    description: "Desarrollo de aplicaciones web con React y Vite.",
    category: "Programación",
    level: "Intermedio",
    rating: 4,
  },
];

const comments = [
  { user: "Juan", text: "Muy buena habilidad 🔥" },
  { user: "Ana", text: "Me ayudó bastante" },
  { user: "Carlos", text: "Nivel profesional 👌" },
];

export default function SkillDetail() {
  const { id } = useParams();

  const skill = skills.find((s) => s.id === Number(id));

  if (!skill) {
    return <div className="text-white pt-28 px-6">Skill no encontrada</div>;
  }

  return (
    <div
      className="
      min-h-screen pt-28 px-6 text-white
      relative overflow-hidden
    "
    >
      {/* BACKGROUND */}
      <div
        className="
        absolute inset-0
        bg-gradient-to-br from-black via-green-950 to-yellow-500
        opacity-90
      "
      />

      <div className="relative max-w-3xl mx-auto mb-4">
        {/* 👤 NOMBRE COMO HEADER */}
        <h1 className="text-3xl font-bold mb-2">
          {skill.person} - {skill.name}
        </h1>

        {/* INFO CARD */}
        <div
          className="
  p-6 rounded-2xl mb-8
  bg-white/10 backdrop-blur-md
  border border-white/20
"
        >
          {/* 📝 DESCRIPCIÓN */}
          <p className="text-gray-200 mb-4">{skill.description}</p>

          {/* META DATA */}
          <div className="space-y-1 text-sm">
            <p>
              <strong className="text-white">Categoría:</strong>{" "}
              <span className="text-gray-200">{skill.category}</span>
            </p>

            <p>
              <strong className="text-white">Nivel:</strong>{" "}
              <span className="text-gray-200">{skill.level}</span>
            </p>

            <p className="text-yellow-300 mt-2">
              {"⭐".repeat(skill.rating)} ({skill.rating})
            </p>
          </div>
        </div>

        {/* COMMENTS */}
        <h2 className="text-xl font-semibold mb-4">Comentarios</h2>

        <div className="space-y-3">
          {comments.map((c, i) => (
            <div
              key={i}
              className="
                p-4 rounded-xl
                bg-white/10 backdrop-blur-md
                border border-white/20
              "
            >
              <p className="text-yellow-300 font-semibold">{c.user}</p>
              <p className="text-gray-200">{c.text}</p>
            </div>
          ))}
        </div>

        {/* INPUT COMMENT */}
        <div className="mt-6 flex gap-2">
          <input
            placeholder="Escribe un comentario..."
            className="
              flex-1 px-4 py-3 rounded-xl
              bg-white/10 border border-white/20
              text-white outline-none
            "
          />

          <button
            className="
            px-6 py-3 rounded-xl
            bg-yellow-400 text-black font-semibold
          "
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
