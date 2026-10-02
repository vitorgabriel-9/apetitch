import { useLocation, useNavigate } from "react-router-dom";

import "./BottomNavigation.css";

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  function isActive(path: string) {
    return location.pathname === path;
  }

  return (
    <nav className="bottom-navigation">
      <button
        className={`nav-item ${isActive("/home") ? "active" : ""}`}
        onClick={() => navigate("/home")}
      >
        <span>⌂</span>
        <small>Início</small>
      </button>

      <button
        className={`nav-item ${isActive("/explorar") ? "active" : ""}`}
        onClick={() => navigate("/explorar")}
      >
        <span>🗺️</span>
        <small>Explorar</small>
      </button>

      <button
        className={`nav-item ${isActive("/pedidos") ? "active" : ""}`}
        onClick={() => navigate("/pedidos")}
      >
        <span>📦</span>
        <small>Pedidos</small>
      </button>

      <button
        className={location.search === "?favoritos=1" ? "nav-item active" : "nav-item"}
        onClick={() => navigate("/home?favoritos=1")}
      >
        <span>♡</span>
        <small>Favoritos</small>
      </button>

      <button
        className={`nav-item ${isActive("/perfil") ? "active" : ""}`}
        onClick={() => navigate("/perfil")}
      >
        <span>👤</span>
        <small>Perfil</small>
      </button>
    </nav>
  );
}
