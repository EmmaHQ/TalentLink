import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // 🔥 IMPORTANTE

  const API_URL = "https://talentlink-1-bbse.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      const token = res.data.token;

      localStorage.setItem("token", token);

      const userRes = await axios.get(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = userRes.data;

      login(token, user);

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Login fallido");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      alert("Usuario creado correctamente");
      setFlipped(false);
    } catch (error) {
      console.error(error);
      alert("Error creando usuario");
    }
  };

  return (
    <div
      className="
      min-h-screen flex flex-col items-center justify-center
      relative overflow-hidden text-white gap-5
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

      {/* FLOAT GLOW EFFECT */}
      <div className="absolute w-[500px] h-[500px] bg-yellow-400/20 blur-[120px] rounded-full top-10 left-10" />
      <div className="absolute w-[400px] h-[400px] bg-green-400/20 blur-[120px] rounded-full bottom-10 right-10" />

      {/* TAB SWITCHER BAR */}
      <div className="relative w-[400px] flex items-center bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-1 shadow-xl">
        {/* sliding pill */}
        <div
          className="
            absolute top-1 bottom-1 w-[calc(50%-4px)]
            bg-yellow-400 rounded-xl
            transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          "
          style={{
            transform: flipped
              ? "translateX(calc(100% + 8px))"
              : "translateX(0)",
          }}
        />

        <button
          onClick={() => setFlipped(false)}
          className={`
            relative z-10 flex-1 py-2 rounded-xl text-sm font-semibold
            transition-colors duration-300
            ${!flipped ? "text-black" : "text-white/70 hover:text-white"}
          `}
        >
          Iniciar sesión
        </button>

        <button
          onClick={() => setFlipped(true)}
          className={`
            relative z-10 flex-1 py-2 rounded-xl text-sm font-semibold
            transition-colors duration-300
            ${flipped ? "text-black" : "text-white/70 hover:text-white"}
          `}
        >
          Registrarse
        </button>
      </div>

      {/* CARD */}
      <div className="relative w-[400px] h-[540px] perspective">
        <div
          className={`
          relative w-full h-full
          transition-transform duration-700
          transform-style-preserve-3d
          ${flipped ? "rotate-y-180" : ""}
        `}
        >
          {/* FRONT - LOGIN */}
          <div
            className="
            absolute w-full h-full backface-hidden
            bg-white/10 backdrop-blur-2xl
            border border-white/20
            rounded-3xl p-8
            shadow-2xl
            flex flex-col justify-center
          "
          >
            {/* HEADER */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">
                Inicia sesión en{" "}
                <span className="text-yellow-400">TalentLink</span>
              </h1>
              <p className="text-gray-300 text-sm mt-2">
                Conecta con talentos increíbles
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <input
                placeholder="Correo electrónico"
                className="
                  px-4 py-3 rounded-xl
                  bg-white/10 border border-white/20
                  outline-none text-white
                  focus:ring-2 focus:ring-yellow-400/50
                "
              />

              <input
                type="password"
                placeholder="Contraseña"
                className="
                  px-4 py-3 rounded-xl
                  bg-white/10 border border-white/20
                  outline-none text-white
                  focus:ring-2 focus:ring-yellow-400/50
                "
              />

              <button
                className="
                mt-2 py-3 rounded-xl
                bg-yellow-400 text-black font-semibold
                hover:scale-[1.03] transition
                shadow-lg
              "
              >
                Iniciar sesión
              </button>
              <div className="text-right">
                <span className="text-sm text-gray-300 hover:text-yellow-400 cursor-pointer transition">
                  ¿Olvidaste tu contraseña?
                </span>
              </div>
            </form>

            <p className="text-center mt-2 text-sm text-gray-300">
              ¿No tienes cuenta?{" "}
              <span
                onClick={() => setFlipped(true)}
                className="text-yellow-400 cursor-pointer font-semibold"
              >
                Crear cuenta
              </span>
            </p>
          </div>

          {/* BACK - REGISTER */}
          <div
            className="
            absolute w-full h-full rotate-y-180 backface-hidden
            bg-white/10 backdrop-blur-2xl
            border border-white/20
            rounded-3xl p-8
            shadow-2xl
            flex flex-col justify-center
          "
          >
            {/* HEADER */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">
                Únete a <span className="text-yellow-400">TalentLink</span>
              </h1>
              <p className="text-gray-300 text-sm mt-2">
                Crea tu perfil y empieza a destacar
              </p>
            </div>

            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <input
                placeholder="Nombre completo"
                className="
                  px-4 py-3 rounded-xl
                  bg-white/10 border border-white/20
                  outline-none text-white
                  focus:ring-2 focus:ring-yellow-400/50
                "
              />

              <input
                placeholder="Correo electrónico"
                className="
                  px-4 py-3 rounded-xl
                  bg-white/10 border border-white/20
                  outline-none text-white
                  focus:ring-2 focus:ring-yellow-400/50
                "
              />

              <input
                type="password"
                placeholder="Contraseña"
                className="
                  px-4 py-3 rounded-xl
                  bg-white/10 border border-white/20
                  outline-none text-white
                  focus:ring-2 focus:ring-yellow-400/50
                "
              />

              <button
                className="
                mt-2 py-3 rounded-xl
                bg-yellow-400 text-black font-semibold
                hover:scale-[1.03] transition
                shadow-lg
              "
              >
                Crear cuenta
              </button>
            </form>

            <p className="text-center mt-6 text-sm text-gray-300">
              ¿Ya tienes cuenta?{" "}
              <span
                onClick={() => setFlipped(false)}
                className="text-yellow-400 cursor-pointer font-semibold"
              >
                Inicia sesión
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
