import { useNavigate } from "react-router-dom";
import "./Profile.css";

export function Profile() {
  const navigate = useNavigate();

  function handleLogout() {
    navigate("/login");
  }

  return (
    <div className="profile-page">

      {/* HEADER */}
      <header className="profile-header">
        <button
          className="profile-back"
          onClick={() => navigate("/home")}
        >
          ←
        </button>

        <h1>Meu perfil</h1>

        <button className="profile-settings">
          ⚙
        </button>
      </header>

      <main className="profile-content">

        {/* PERFIL */}
        <section className="profile-card">
          <div className="profile-avatar">
            A
          </div>

          <div className="profile-info">
            <h2>Alan Yudi</h2>
            <p>alan@email.com</p>

            <span className="profile-member">
              ✦ Membro do Apetitch
            </span>
          </div>

          <button className="edit-profile">
            Editar
          </button>
        </section>

        {/* ESTATÍSTICAS */}
        <section className="profile-stats">

          <div className="stat">
            <strong>12</strong>
            <span>Pedidos</span>
          </div>

          <div className="stat">
            <strong>8</strong>
            <span>Favoritos</span>
          </div>

          <div className="stat">
            <strong>5</strong>
            <span>Avaliações</span>
          </div>

        </section>

        {/* MENU */}
        <section className="profile-section">

          <span className="profile-section-label">
            Minha conta
          </span>

          <div className="profile-menu">

            <button className="profile-menu-item">
              <div className="menu-icon orange">
                📦
              </div>

              <div className="menu-text">
                <strong>Meus pedidos</strong>
                <span>Acompanhe seus pedidos</span>
              </div>

              <span className="menu-arrow">
                →
              </span>
            </button>

            <button className="profile-menu-item">
              <div className="menu-icon red">
                ♡
              </div>

              <div className="menu-text">
                <strong>Favoritos</strong>
                <span>Restaurantes que você salvou</span>
              </div>

              <span className="menu-arrow">
                →
              </span>
            </button>

            <button className="profile-menu-item">
              <div className="menu-icon yellow">
                ⭐
              </div>

              <div className="menu-text">
                <strong>Minhas avaliações</strong>
                <span>Veja suas avaliações</span>
              </div>

              <span className="menu-arrow">
                →
              </span>
            </button>

            <button className="profile-menu-item">
              <div className="menu-icon blue">
                📍
              </div>

              <div className="menu-text">
                <strong>Endereços</strong>
                <span>Gerencie seus endereços</span>
              </div>

              <span className="menu-arrow">
                →
              </span>
            </button>

          </div>
        </section>

        {/* PREFERÊNCIAS */}
        <section className="profile-section">

          <span className="profile-section-label">
            Preferências
          </span>

          <div className="profile-menu">

            <button className="profile-menu-item">
              <div className="menu-icon purple">
                🔔
              </div>

              <div className="menu-text">
                <strong>Notificações</strong>
                <span>Alertas e atualizações</span>
              </div>

              <span className="menu-arrow">
                →
              </span>
            </button>

            <button className="profile-menu-item">
              <div className="menu-icon green">
                ⚙
              </div>

              <div className="menu-text">
                <strong>Configurações</strong>
                <span>Preferências da conta</span>
              </div>

              <span className="menu-arrow">
                →
              </span>
            </button>

          </div>
        </section>

        {/* AJUDA */}
        <section className="profile-section">

          <span className="profile-section-label">
            Suporte
          </span>

          <div className="profile-menu">

            <button className="profile-menu-item">
              <div className="menu-icon gray">
                ?
              </div>

              <div className="menu-text">
                <strong>Ajuda e suporte</strong>
                <span>Precisa de ajuda?</span>
              </div>

              <span className="menu-arrow">
                →
              </span>
            </button>

          </div>
        </section>

        {/* LOGOUT */}
        <button
          className="logout-button"
          onClick={handleLogout}
        >
          <span>↪</span>
          Sair da conta
        </button>

        <p className="profile-version">
          Apetitch • versão 1.0.0
        </p>

      </main>

      {/* NAVEGAÇÃO */}
      <nav className="bottom-navigation">

        <button
          className="nav-item"
          onClick={() => navigate("/home")}
        >
          <span>⌂</span>
          <small>Início</small>
        </button>

        <button className="nav-item">
          <span>🗺️</span>
          <small>Explorar</small>
        </button>

        <button className="nav-item">
          <span>📦</span>
          <small>Pedidos</small>
        </button>

        <button className="nav-item">
          <span>♡</span>
          <small>Favoritos</small>
        </button>

        <button className="nav-item active">
          <span>👤</span>
          <small>Perfil</small>
        </button>

      </nav>

    </div>
  );
}