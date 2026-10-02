import { useNavigate } from "react-router-dom";

import "./Welcome.css";

export function Welcome() {
  const navigate = useNavigate();

  return (
    <main className="welcome-page">
      <div className="welcome-background" />

      <div className="welcome-overlay" />

      <section className="welcome-content">
        <div className="welcome-logo">
          apetitch
          <span />
        </div>

        <div className="welcome-text">
          <h1>
            Descubra, escolha, <strong>aproveite.</strong>
          </h1>

          <p>
            Tudo o que você precisa para viver
            <br />
            boas experiências gastronômicas,
            <br />
            em um só lugar.
          </p>
        </div>

        <div className="welcome-actions">
          <button
            className="primary-button"
            onClick={() => navigate("/cadastro")}
          >
            Continuar
            <span>→</span>
          </button>

          <button
            className="secondary-button"
            onClick={() => navigate("/login")}
          >
            Já tenho uma conta
          </button>
        </div>
      </section>
    </main>
  );
}