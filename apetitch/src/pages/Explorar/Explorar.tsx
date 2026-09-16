import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./Explorar.css";

import { BottomNavigation } from "../../components/BottomNavigation/BottomNavigation";

import { getRestaurants } from "../../services/restaurantService";

import type {
  Restaurant,
  RestaurantCategory,
} from "../../types/restaurant";


const categories: {
  name: RestaurantCategory | "Todos";
  icon: string;
}[] = [
  { name: "Todos", icon: "🍽️" },
  { name: "Pizza", icon: "🍕" },
  { name: "Hambúrguer", icon: "🍔" },
  { name: "Japonesa", icon: "🍣" },
  { name: "Brasileira", icon: "BR" },
  { name: "Italiana", icon: "🍝" },
  { name: "Cafeteria", icon: "☕" },
  { name: "Saudável", icon: "🥗" },
];


const restaurantIcon = L.divIcon({
  className: "restaurant-marker",

  html: `
    <div class="restaurant-marker-inner">
      🍴
    </div>
  `,

  iconSize: [40, 40],
  iconAnchor: [20, 40],
});


const userIcon = L.divIcon({
  className: "user-marker",

  html: `
    <div class="user-marker-inner"></div>
  `,

  iconSize: [26, 26],
  iconAnchor: [13, 13],
});


function RecenterMap({
  position,
}: {
  position: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 14);
  }, [map, position]);

  return null;
}


export function Explorar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState<RestaurantCategory | "Todos">("Todos");

  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  const [showCategories, setShowCategories] = useState(true);

  const [userPosition, setUserPosition] =
    useState<[number, number]>([-3.7319, -38.5267]);
  const [locationLabel, setLocationLabel] = useState("Fortaleza, CE");
  const [isLocating, setIsLocating] = useState(false);
  const nearbyRequestHandled = useRef(false);


  useEffect(() => {
    async function loadRestaurants() {
      const data = await getRestaurants();

      setRestaurants(data);
    }

    loadRestaurants();
  }, []);

  useEffect(() => {
    if (searchParams.get("perto-de-mim") !== "1" || nearbyRequestHandled.current) {
      return;
    }

    nearbyRequestHandled.current = true;

    if (!navigator.geolocation) {
      alert("Geolocalização não disponível neste navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition([position.coords.latitude, position.coords.longitude]);
        setLocationLabel("Sua localização");
      },
      () => {
        alert("Não foi possível obter sua localização.");
      }
    );
  }, [searchParams]);


  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const matchesCategory =
        selectedCategory === "Todos" ||
        restaurant.category === selectedCategory;

      const term = search.toLowerCase().trim();

      const matchesSearch =
        restaurant.name.toLowerCase().includes(term) ||
        restaurant.category.toLowerCase().includes(term) ||
        restaurant.secondaryCategory
          ?.toLowerCase()
          .includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [restaurants, search, selectedCategory]);


  function getMyLocation() {
    if (!navigator.geolocation) {
      alert("Geolocalização não disponível neste navegador.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition([
          position.coords.latitude,
          position.coords.longitude,
        ]);
        setLocationLabel("Sua localização");
        setIsLocating(false);
      },

      () => {
        setIsLocating(false);
        alert("Não foi possível obter sua localização.");
      }
    );
  }


  return (
    <div className="explore-page">

      {/* CABEÇALHO */}

      <header className="explore-header">

        <div className="explore-brand">
          <div className="brand-icon">
            A
          </div>

          <span>Apetitch</span>
        </div>


        <div className="explore-search">

          <span className="search-icon">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Buscar restaurante, prato..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>


        <button
          className="location-button"
          type="button"
          onClick={getMyLocation}
          aria-label="Usar minha localização"
        >
          📍 {locationLabel}
        </button>


        <button
          className="profile-button"
          type="button"
          onClick={() => navigate("/perfil")}
          aria-label="Abrir perfil"
        >
          👤
        </button>

      </header>


      {/* CONTEÚDO */}

      <main className="explore-content">

        <section className="explore-title">

          <div>
            <h1>
              Explorar <span>restaurantes</span>
            </h1>

            <p>
              Encontre os melhores lugares perto de você.
            </p>
          </div>


          <button
            className="filter-button"
            type="button"
            onClick={() => setShowCategories((current) => !current)}
            aria-expanded={showCategories}
            aria-controls="explore-categories"
            aria-label={showCategories ? "Ocultar categorias" : "Exibir categorias"}
          >
            ☷
          </button>

        </section>


        {/* CATEGORIAS */}

        {showCategories && (
        <section className="categories" id="explore-categories">

          {categories.map((category) => (

            <button
              key={category.name}

              className={`category-button ${
                selectedCategory === category.name
                  ? "active"
                  : ""
              }`}

              onClick={() =>
                setSelectedCategory(category.name)
              }
            >

              <span>{category.icon}</span>

              {category.name}

            </button>

          ))}

        </section>
        )}


        {/* MAPA + RESTAURANTES */}

        <section className="explore-grid">

          <div className="map-container">

            <MapContainer
              center={userPosition}
              zoom={14}
              className="map"
            >

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />


              <RecenterMap
                position={userPosition}
              />


              <Marker
                position={userPosition}
                icon={userIcon}
              >

                <Popup>
                  Você está aqui
                </Popup>

              </Marker>


              {filteredRestaurants.map(
                (restaurant) => (

                  <Marker
                    key={restaurant.id}

                    position={[
                      restaurant.latitude,
                      restaurant.longitude,
                    ]}

                    icon={restaurantIcon}

                    eventHandlers={{
                      click: () =>
                        setSelectedRestaurant(
                          restaurant
                        ),
                    }}
                  >

                    <Popup>

                      <div className="map-popup">

                        <strong>
                          {restaurant.name}
                        </strong>

                        <span>
                          ⭐ {restaurant.rating}
                        </span>

                        <span>
                          {restaurant.distance} km
                        </span>

                      </div>

                    </Popup>

                  </Marker>

                )
              )}

            </MapContainer>


            <button
              className="my-location-button"
              type="button"
              onClick={getMyLocation}
              disabled={isLocating}
            >
              {isLocating ? "Localizando..." : "◎ Minha localização"}
            </button>

          </div>


          {/* LISTA */}

          <aside className="restaurants-panel">

            <div className="restaurants-header">

              <h2>
                Restaurantes próximos
              </h2>

              <span>
                {filteredRestaurants.length} resultados
              </span>

            </div>

            <div className="restaurants-list">

              {filteredRestaurants.map(
                (restaurant) => (

                  <article
                    key={restaurant.id}

                    className={`restaurant-card ${
                      selectedRestaurant?.id ===
                      restaurant.id
                        ? "selected"
                        : ""
                    }`}

                    onClick={() =>
                      setSelectedRestaurant(
                        restaurant
                      )
                    }
                  >

                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                    />


                    <div className="restaurant-info">

                      <h3>
                        {restaurant.name}
                      </h3>


                      <div className="restaurant-tags">

                        <span>
                          {restaurant.category}
                        </span>

                        {restaurant.secondaryCategory && (
                          <span>
                            {
                              restaurant.secondaryCategory
                            }
                          </span>
                        )}

                      </div>


                      <div className="restaurant-details">

                        <strong>
                          ⭐ {restaurant.rating}
                        </strong>

                        <span>
                          • {restaurant.distance} km
                        </span>

                        <span>
                          • {restaurant.deliveryTime}
                        </span>

                      </div>

                    </div>


                    <button
                      className="restaurant-open"
                      type="button"
                      aria-label={`Abrir perfil de ${restaurant.name}`}
                      onClick={(event) => {
                        event.stopPropagation();

                        navigate(
                          `/restaurante/${restaurant.id}`
                        );
                      }}
                    >
                      ›
                    </button>

                  </article>

                )
              )}

            </div>

          </aside>

        </section>

      </main>


      {/* NAVBAR PADRÃO */}

      <BottomNavigation />

    </div>
  );
}
