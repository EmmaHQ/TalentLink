import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const isLoggedIn = !!token;
  const navigate = useNavigate();

  const [open,        setOpen]        = useState(false); // mobile menu
  const [dropdownOpen, setDropdownOpen] = useState(false); // user dropdown
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <h1 className="text-2xl font-bold text-white">
          Talent<span className="text-yellow-400">Link</span>
        </h1>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex gap-8 text-white">
          <NavItem to="/"        label="Home" />
          <NavItem to="/explore" label="Explorar talentos" />
          <NavItem to="/publish" label="Publicar habilidad" />
          <NavItem to="/order"   label="Gestionar mis órdenes" />
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            // ── DROPDOWN DE USUARIO ──
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition"
              >
                <img
                  src={user?.avatar || "https://i.pravatar.cc/40"}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-white font-medium">
                  {user?.name || "Usuario"}
                </span>
                <span className="text-white/60 text-xs">▾</span>
              </button>

              {/* dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-xl border border-white/15 rounded-2xl overflow-hidden shadow-2xl">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-white hover:bg-white/10 transition"
                  >
                    👤 Mi perfil
                  </Link>
                  <div className="h-px bg-white/10 mx-3" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition"
                  >
                    🚪 Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl border border-white/30 bg-yellow-400 text-black hover:scale-105 transition"
            >
              Iniciar sesión
            </Link>
          )}

          {/* HAMBURGER */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white text-3xl"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-black/40 backdrop-blur-xl border-t border-white/10 px-6 py-6 flex flex-col gap-5 text-white animate-[fadeIn_0.2s_ease-out]">
          <NavItemMobile to="/"        label="Home"                   setOpen={setOpen} />
          <NavItemMobile to="/explore" label="Explorar talentos"      setOpen={setOpen} />
          <NavItemMobile to="/publish" label="Publicar habilidad"     setOpen={setOpen} />
          <NavItemMobile to="/order"   label="Gestionar mis órdenes"  setOpen={setOpen} />
          {isLoggedIn && (
            <>
              <div className="h-px bg-white/10" />
              <button
                onClick={handleLogout}
                className="text-left text-lg text-red-400 hover:text-red-300 transition"
              >
                🚪 Cerrar sesión
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

function NavItem({ to, label }) {
  return (
    <Link to={to} className="relative group text-white">
      {label}
      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

function NavItemMobile({ to, label, setOpen }) {
  return (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className="text-lg hover:text-yellow-400 transition"
    >
      {label}
    </Link>
  );
}