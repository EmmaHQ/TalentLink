import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // 🔥 login
  const login = async (token) => {
    setToken(token);
    localStorage.setItem("token", token);

    // 🔥 SIEMPRE traer user real del backend
    const res = await axios.get("https://talentlink-1-bbse.onrender.com/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUser(res.data);
    localStorage.setItem("user", JSON.stringify(res.data));
  };

  // 🔥 logout
  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // 🔥 restaurar sesión al refrescar
  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);

      axios
        .get("http://localhost:8001/api/auth/me", {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          logout(); // si token es inválido
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);