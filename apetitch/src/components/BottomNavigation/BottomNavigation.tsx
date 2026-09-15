import { useNavigate, useLocation } from "react-router-dom";

import "./BottomNavigation.css";

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bottom-navigation">
      <button
        className={location.pathname === "/home" ? "active" : ""}
        onClick={() => navigate("/home")}
      >
        <span className="nav-icon">⌂</span>
        <span>Início</span>
      </button>

      <button
        className={location.pathname === "/busca" ? "active" : ""}
        onClick={() => navigate("/busca")}
      >
        <span className="nav-icon">⌕</span>
        <span>Busca</span>
      </button>

      <button
        className={location.pathname === "/pedidos" ? "active" : ""}
        onClick={() => navigate("/pedidos")}
      >
        <span className="nav-icon">▣</span>
        <span>Pedidos</span>
      </button>

      <button
        className={location.pathname === "/perfil" ? "active" : ""}
        onClick={() => navigate("/perfil")}
      >
        <span className="nav-icon">♙</span>
        <span>Perfil</span>
      </button>
    </nav>
  );
}