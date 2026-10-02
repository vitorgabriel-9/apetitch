import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearCurrentUser,
  getAllRestaurantFeedbacks,
  getCurrentUser,
  getFavoriteRestaurantIds,
  getProfileAddresses,
  getProfilePreferences,
  removeRestaurantFeedback,
  saveCurrentUser,
  saveProfileAddresses,
  saveProfilePreferences,
} from "../../services/appState";
import type { ProfileAddress } from "../../services/appState";
import "./profile.css";

function getProfileFeedbacks() {
  return Object.entries(getAllRestaurantFeedbacks()).flatMap(
    ([restaurantId, restaurantFeedbacks]) => restaurantFeedbacks.map((feedback, feedbackIndex) => ({
      ...feedback,
      restaurantId,
      feedbackIndex,
    }))
  );
}

export function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "Usuário Apetitch");
  const [email, setEmail] = useState(user?.email ?? "usuario@email.com");
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    () => getProfilePreferences().notificationsEnabled
  );
  const [activePanel, setActivePanel] = useState<"reviews" | "addresses" | "settings" | "support" | null>(null);
  const [addresses, setAddresses] = useState(getProfileAddresses);
  const [addressLabel, setAddressLabel] = useState("");
  const [address, setAddress] = useState("");
  const [addressReference, setAddressReference] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const favoriteCount = getFavoriteRestaurantIds().length;
  const [feedbacks, setFeedbacks] = useState(getProfileFeedbacks);

  function togglePanel(panel: NonNullable<typeof activePanel>) {
    setActivePanel((current) => current === panel ? null : panel);
  }

  function toggleNotifications() {
    setNotificationsEnabled((current) => {
      const next = !current;
      saveProfilePreferences({ notificationsEnabled: next });
      setProfileMessage(next ? "Notificações ativadas." : "Notificações desativadas.");
      return next;
    });
  }

  function addAddress(event: React.FormEvent) {
    event.preventDefault();
    if (!addressLabel.trim() || !address.trim()) {
      setProfileMessage("Informe um nome e o endereço para salvar.");
      return;
    }

    const nextAddresses: ProfileAddress[] = [
      ...addresses,
      {
        id: String(Date.now()),
        label: addressLabel.trim(),
        address: address.trim(),
        reference: addressReference.trim() || undefined,
      },
    ];
    setAddresses(nextAddresses);
    saveProfileAddresses(nextAddresses);
    setAddressLabel("");
    setAddress("");
    setAddressReference("");
    setProfileMessage("Endereço salvo com sucesso.");
  }

  function removeAddress(id: string) {
    const nextAddresses = addresses.filter((savedAddress) => savedAddress.id !== id);
    setAddresses(nextAddresses);
    saveProfileAddresses(nextAddresses);
    setProfileMessage("Endereço removido.");
  }

  function removeFeedback(restaurantId: string, feedbackIndex: number) {
    removeRestaurantFeedback(restaurantId, feedbackIndex);
    setFeedbacks(getProfileFeedbacks());
    setProfileMessage("Avaliação removida.");
  }

  function handleLogout() {
    clearCurrentUser();
    navigate("/login");
  }

  function saveProfile(event: React.FormEvent) {
    event.preventDefault();

    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setProfileMessage("Informe nome e e-mail válidos.");
      return;
    }

    const updatedUser = {
      id: user?.id ?? "1",
      name: name.trim(),
      email,
    };

    saveCurrentUser(updatedUser);
    setUser(updatedUser);
    setIsEditing(false);
    setProfileMessage("Perfil atualizado com sucesso.");
  }

  return (
    <div className="profile-page">

      {/* HEADER */}
      <header className="profile-header">
        <button
          className="profile-back"
          onClick={() => navigate("/home")}
          aria-label="Voltar para a página inicial"
        >
          ←
        </button>

        <h1>Meu perfil</h1>

        <button
          className="profile-settings"
          aria-label="Configurações da conta"
          onClick={() => togglePanel("settings")}
          aria-expanded={activePanel === "settings"}
          aria-controls="profile-settings-panel"
        >
          ⚙
        </button>
      </header>

      <main className="profile-content">

        {/* PERFIL */}
        <section className="profile-card">
          <div className="profile-avatar">
            {(user?.name ?? "A").charAt(0).toUpperCase()}
          </div>

          <div className="profile-info">
            <h2>{user?.name ?? "Usuário Apetitch"}</h2>
            <p>{user?.email ?? "usuario@email.com"}</p>

            <span className="profile-member">
              ✦ Membro do Apetitch
            </span>
          </div>

          <button className="edit-profile" type="button" onClick={() => setIsEditing((current) => !current)}>
            {isEditing ? "Cancelar" : "Editar"}
          </button>
        </section>

        {isEditing && (
          <form className="profile-edit-form" onSubmit={saveProfile}>
            <label htmlFor="profile-name">Nome</label>
            <input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} />
            <label htmlFor="profile-email">E-mail</label>
            <input id="profile-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <button type="submit">Salvar alterações</button>
          </form>
        )}

        {profileMessage && <p className="profile-message" role="status">{profileMessage}</p>}

        {/* ESTATÍSTICAS */}
        <section className="profile-stats">

          <div className="stat">
            <strong>12</strong>
            <span>Pedidos</span>
          </div>

          <div className="stat">
            <strong>{favoriteCount}</strong>
            <span>Favoritos</span>
          </div>

          <div className="stat">
            <strong>{feedbacks.length}</strong>
            <span>Avaliações</span>
          </div>

        </section>

        {/* MENU */}
        <section className="profile-section">

          <span className="profile-section-label">
            Minha conta
          </span>

          <div className="profile-menu">

            <button className="profile-menu-item" onClick={() => navigate("/pedidos")}>
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

            <button className="profile-menu-item" onClick={() => navigate("/home?favoritos=1")}>
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

            <button
              className="profile-menu-item"
              onClick={() => togglePanel("reviews")}
              aria-expanded={activePanel === "reviews"}
              aria-controls="profile-reviews"
            >
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

            <button
              className="profile-menu-item"
              onClick={() => togglePanel("addresses")}
              aria-expanded={activePanel === "addresses"}
              aria-controls="profile-addresses"
            >
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

        {activePanel === "reviews" && (
          <section className="profile-detail-panel" id="profile-reviews" aria-label="Minhas avaliações">
            <div className="profile-detail-heading">
              <div><span>Minhas avaliações</span><p>As avaliações enviadas por você aparecem aqui.</p></div>
              <button type="button" onClick={() => setActivePanel(null)} aria-label="Fechar avaliações">×</button>
            </div>
            {feedbacks.length ? (
              <div className="profile-feedback-list">
                {feedbacks.map((feedback) => (
                  <article key={`${feedback.restaurantId}-${feedback.feedbackIndex}`}>
                    <div><strong>Restaurante #{feedback.restaurantId} · ★ {feedback.rating}</strong><p>{feedback.comment}</p><small>{feedback.date}</small></div>
                    <button type="button" onClick={() => removeFeedback(feedback.restaurantId, feedback.feedbackIndex)} aria-label={`Excluir avaliação do restaurante ${feedback.restaurantId}`}>Excluir</button>
                  </article>
                ))}
              </div>
            ) : <p className="profile-empty-state">Você ainda não enviou avaliações. Elas podem ser feitas na página de cada restaurante.</p>}
          </section>
        )}

        {activePanel === "addresses" && (
          <section className="profile-detail-panel" id="profile-addresses" aria-label="Meus endereços">
            <div className="profile-detail-heading">
              <div><span>Meus endereços</span><p>Salve endereços para usar nos próximos pedidos.</p></div>
              <button type="button" onClick={() => setActivePanel(null)} aria-label="Fechar endereços">×</button>
            </div>
            <div className="saved-addresses">
              {addresses.map((savedAddress) => (
                <article key={savedAddress.id}>
                  <div><strong>{savedAddress.label}</strong><p>{savedAddress.address}</p>{savedAddress.reference && <small>{savedAddress.reference}</small>}</div>
                  <button type="button" onClick={() => removeAddress(savedAddress.id)} aria-label={`Remover endereço ${savedAddress.label}`}>Remover</button>
                </article>
              ))}
              {!addresses.length && <p className="profile-empty-state">Nenhum endereço salvo ainda.</p>}
            </div>
            <form className="address-form" onSubmit={addAddress}>
              <label htmlFor="address-label">Identificação</label>
              <input id="address-label" value={addressLabel} onChange={(event) => setAddressLabel(event.target.value)} placeholder="Ex.: Casa" />
              <label htmlFor="address-value">Endereço</label>
              <input id="address-value" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Rua, número e bairro" />
              <label htmlFor="address-reference">Referência <small>(opcional)</small></label>
              <input id="address-reference" value={addressReference} onChange={(event) => setAddressReference(event.target.value)} placeholder="Ex.: Próximo à praça" />
              <button type="submit">Salvar endereço</button>
            </form>
          </section>
        )}

        {/* PREFERÊNCIAS */}
        <section className="profile-section">

          <span className="profile-section-label">
            Preferências
          </span>

          <div className="profile-menu">

            <button
              className="profile-menu-item"
              onClick={toggleNotifications}
            >
              <div className="menu-icon purple">
                🔔
              </div>

              <div className="menu-text">
                <strong>Notificações</strong>
                <span>{notificationsEnabled ? "Alertas ativados" : "Alertas desativados"}</span>
              </div>

              <span className="menu-arrow">
                →
              </span>
            </button>

            <button
              className="profile-menu-item"
              onClick={() => togglePanel("settings")}
              aria-expanded={activePanel === "settings"}
              aria-controls="profile-settings-panel"
            >
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

            <button
              className="profile-menu-item"
              onClick={() => togglePanel("support")}
              aria-expanded={activePanel === "support"}
              aria-controls="profile-support"
            >
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

        {activePanel === "settings" && (
          <section className="profile-detail-panel" id="profile-settings-panel" aria-label="Configurações">
            <div className="profile-detail-heading">
              <div><span>Configurações</span><p>Controle suas preferências nesta demonstração.</p></div>
              <button type="button" onClick={() => setActivePanel(null)} aria-label="Fechar configurações">×</button>
            </div>
            <label className="preference-toggle">
              <span><strong>Notificações</strong><small>Receba atualizações sobre pedidos e restaurantes.</small></span>
              <input type="checkbox" checked={notificationsEnabled} onChange={toggleNotifications} />
            </label>
          </section>
        )}

        {activePanel === "support" && (
          <section className="profile-detail-panel" id="profile-support" aria-label="Ajuda e suporte">
            <div className="profile-detail-heading">
              <div><span>Ajuda e suporte</span><p>Encontre respostas rápidas sobre o Apetitch.</p></div>
              <button type="button" onClick={() => setActivePanel(null)} aria-label="Fechar ajuda">×</button>
            </div>
            <div className="support-content"><p><strong>Como avaliar?</strong> Abra um restaurante e use a seção de avaliações.</p><p><strong>Como acompanhar pedidos?</strong> Acesse “Meus pedidos” para consultar o status e os itens.</p><a href="mailto:suporte@apetitch.com">Falar com o suporte</a></div>
          </section>
        )}

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

        <button className="nav-item" onClick={() => navigate("/explorar")}>
          <span>🗺️</span>
          <small>Explorar</small>
        </button>

        <button className="nav-item" onClick={() => navigate("/pedidos")}>
          <span>📦</span>
          <small>Pedidos</small>
        </button>

        <button className="nav-item" onClick={() => navigate("/home?favoritos=1")}>
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
