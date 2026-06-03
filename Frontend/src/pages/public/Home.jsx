import DescriptionCard from "../../components/home/DescriptionCard.jsx";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const cards = [
  {
    title: "Aprende",
    description: "Conecta con estudiantes que dominan lo que necesitas",
  },
  {
    title: "Enseña",
    description: "Comparte tus habilidades y gana experiencia",
  },
  {
    title: "Colabora",
    description: "Trabaja en proyectos con otros estudiantes",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-green-900 to-yellow-500 text-white flex flex-col items-center px-6 pt-28 py-12 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-yellow-400 opacity-20 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-500 opacity-20 blur-3xl"></div>

      {/* HERO */}
      <div className="text-center max-w-3xl z-10">
        <h1 className="text-6xl md:text-7xl font-extrabold leading-tight mb-4">
          Talent<span className="text-yellow-400">Link</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-200 mb-6">
          Conecta, aprende y crece con otros estudiantes.
        </p>

        <p className="text-gray-300 mb-8">
          Una plataforma donde puedes compartir tus habilidades, encontrar ayuda
          y construir experiencia real.
        </p>

        {/* CTA */}
        <div className="flex gap-4 justify-center">
          {/* Explorar talentos — siempre visible, navega a /explore */}
          <button
            onClick={() => navigate("/explore")}
            className="
              bg-yellow-400
              text-black
              px-6 py-3
              rounded-xl
              font-semibold
              relative
              hover:scale-105
              transition
              animate-[ring_1.5s_ease-in-out_infinite]
              hover:animate-none
            "
          >
            Explorar talentos
          </button>

          {/* Crear perfil — solo visible si NO hay sesión */}
          {!isLoggedIn && (
            <button
              onClick={() => navigate("/register")}
              className="
                relative
                px-6 py-3
                rounded-xl
                font-semibold
                text-white
                border border-white/20
                overflow-hidden
                group
                backdrop-blur-md
                transition-all duration-300
                hover:scale-105
              "
            >
              <span className="relative z-10">Crear perfil</span>

              <span
                className="
                  absolute inset-0
                  rounded-xl
                  bg-white/10
                  opacity-0
                  group-hover:opacity-100
                  transition duration-300
                "
              />

              <span
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-transparent
                  via-white/40
                  to-transparent
                  translate-x-[-100%]
                  group-hover:translate-x-[100%]
                  transition duration-700
                "
              />
            </button>
          )}
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
          >
            <DescriptionCard
              title={card.title}
              description={card.description}
            />
          </motion.div>
        ))}
      </div>

      {/* EXTRA SECTION */}
      <div className="mt-20 text-center max-w-2xl z-10">
        <h2 className="text-3xl font-bold mb-4">¿Por qué usar TalentLink?</h2>
        <p className="text-gray-300">
          Porque no solo aprendes, sino que también construyes tu portafolio,
          haces conexiones reales y ganas experiencia mientras estudias.
        </p>
      </div>
    </div>
  );
}