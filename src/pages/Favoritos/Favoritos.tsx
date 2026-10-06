import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getFavoriteRestaurantIds,
  saveFavoriteRestaurantIds,
} from "../../services/appState";

import { getRestaurants } from "../../services/restaurantService";

import type { Restaurant } from "../../types/restaurant";

import { BottomNavigation } from "../../components/BottomNavigation/BottomNavigation";

import "./Favoritos.css";

export function Favoritos() {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [favorites, setFavorites] = useState<string[]>(
    getFavoriteRestaurantIds()
  );

  const [search, setSearch] = useState("");

  const [location, setLocation] = useState("Fortaleza, CE");

  const [loading, setLoading] = useState(true);

  /*
   * =====================================================
   * CARREGAR RESTAURANTES
   * =====================================================
   */

  useEffect(() => {
    async function loadRestaurants() {
      try {
        setLoading(true);

        const data = await getRestaurants();

        setRestaurants(data);
      } catch (error) {
        console.error("Erro ao carregar restaurantes:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRestaurants();
  }, []);

  /*
   * =====================================================
   * RESTAURANTES FAVORITOS
   * =====================================================
   */

  const favoriteRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const isFavorite = favorites.includes(restaurant.id);

      const searchTerm = search.toLowerCase().trim();

      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchTerm) ||
        restaurant.category.toLowerCase().includes(searchTerm);

      return isFavorite && matchesSearch;
    });
  }, [restaurants, favorites, search]);

  /*
   * =====================================================
   * REMOVER DOS FAVORITOS
   * =====================================================
   */

  function removeFavorite(id: string) {
    const updatedFavorites = favorites.filter(
      (favoriteId) => favoriteId !== id
    );

    setFavorites(updatedFavorites);

    saveFavoriteRestaurantIds(updatedFavorites);
  }

  /*
   * =====================================================
   * LOCALIZAÇÃO
   * =====================================================
   */

  function getLocation() {
    if (!navigator.geolocation) {
      alert("Seu navegador não suporta localização.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setLocation("Sua localização atual");
      },
      () => {
        alert("Não foi possível obter sua localização.");
      }
    );
  }

  /*
   * =====================================================
   * ABRIR RESTAURANTE
   * =====================================================
   */

  function openRestaurant(id: string) {
    navigate(`/restaurante/${id}`);
  }

  /*
   * =====================================================
   * BUSCA
   * =====================================================
   */

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <div className="favorites-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="favorites-header">

        <div className="favorites-header-top">

          {/* LOGO */}

          <div
            className="favorites-brand"
            onClick={() => navigate("/home")}
          >
            <span className="favorites-brand-icon">A</span>

            <span>Apetitch</span>
          </div>

          {/* AÇÕES */}

          <div className="favorites-header-actions">

            <button
              className="favorites-location"
              onClick={getLocation}
            >
              <span>📍</span>

              <span>{location}</span>
            </button>

            <button
              className="favorites-profile"
              onClick={() => navigate("/perfil")}
              aria-label="Abrir perfil"
            >
              👤
            </button>

          </div>

        </div>

        {/* =================================================
            BUSCA
        ================================================= */}

        <div className="favorites-search-area">

          <form
            className="favorites-search"
            onSubmit={handleSearch}
          >

            <span className="favorites-search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Buscar restaurante, prato..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            {search && (
              <button
                type="button"
                className="favorites-clear"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}

          </form>

          <button
            className="favorites-settings"
            onClick={() => navigate("/perfil")}
            aria-label="Configurações"
          >
            ⚙
          </button>

        </div>

      </header>

      {/* =================================================
          CONTEÚDO
      ================================================= */}

      <main className="favorites-content">

        <section className="favorites-title-section">

          <div className="favorites-title-icon">
            ♥
          </div>

          <div>
            <h1>Seus Favoritos</h1>

            <p>
              Restaurantes que você salvou para não perder de vista.
            </p>
          </div>

        </section>

        {/* =================================================
            CARREGANDO
        ================================================= */}

        {loading && (
          <div className="favorites-message">
            <div className="favorites-spinner"></div>

            <p>Carregando seus favoritos...</p>
          </div>
        )}

        {/* =================================================
            NENHUM FAVORITO
        ================================================= */}

        {!loading && favoriteRestaurants.length === 0 && (
          <section className="favorites-empty">

            <div className="favorites-empty-icon">
              ♡
            </div>

            <h2>
              {search
                ? "Nenhum favorito encontrado"
                : "Você ainda não tem favoritos"}
            </h2>

            <p>
              {search
                ? "Tente buscar por outro restaurante ou categoria."
                : "Explore os restaurantes e toque no coração para adicioná-los aqui."}
            </p>

            {!search && (
              <button
                className="favorites-explore-button"
                onClick={() => navigate("/explorar")}
              >
                Explorar restaurantes
              </button>
            )}

          </section>
        )}

        {/* =================================================
            LISTA DE FAVORITOS
        ================================================= */}

        {!loading && favoriteRestaurants.length > 0 && (
          <section className="favorites-list">

            {favoriteRestaurants.map((restaurant) => (

              <article
                className="favorite-card"
                key={restaurant.id}
                onClick={() => openRestaurant(restaurant.id)}
              >

                {/* IMAGEM */}

                <div className="favorite-image-wrapper">

                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="favorite-image"
                  />

                  {/* CORAÇÃO */}

                  <button
                    className="favorite-heart"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeFavorite(restaurant.id);
                    }}
                    aria-label={`Remover ${restaurant.name} dos favoritos`}
                  >
                    ♥
                  </button>

                </div>

                {/* INFORMAÇÕES */}

                <div className="favorite-info">

                  <h2>{restaurant.name}</h2>

                  <p className="favorite-category">
                    🍴 {restaurant.category}
                  </p>

                  <div className="favorite-rating">

                    <span className="star">
                      ★
                    </span>

                    <span>
                      {restaurant.rating.toFixed(1)}
                    </span>

                    <span className="separator">
                      •
                    </span>

                    <span>
                      {restaurant.distance.toFixed(1).replace(".", ",")} km
                    </span>

                  </div>

                </div>

                {/* TEMPO DE ESPERA */}

                <div className="favorite-wait">

                  <div className="favorite-clock">
                    ◷
                  </div>

                  <div>

                    <strong>
                      {restaurant.waitTime}
                    </strong>

                    <small>
                      Tempo médio de espera
                    </small>

                  </div>

                </div>

                {/* SETA */}

                <div className="favorite-arrow">
                  ›
                </div>

              </article>

            ))}

          </section>
        )}

      </main>

      {/* =================================================
          NAVEGAÇÃO
      ================================================= */}

      <BottomNavigation />

    </div>
  );
}