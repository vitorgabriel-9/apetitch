import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import "./Restaurant.css";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

type RestaurantData = {
  name: string;
  category: string;
  rating: number;
  reviews: number;
  distance: string;
  waitTime: string;
  deliveryTime: string;
  status: "Aberto" | "Lotado" | "Fechado";
  price: string;
  image: string;
  description: string;
  address: string;
  menu: MenuItem[];
};

const restaurants: Record<string, RestaurantData> = {
  "1": {
    name: "La Nonna Trattoria",
    category: "Italiana",
    rating: 4.8,
    reviews: 324,
    distance: "1,2 km",
    waitTime: "10–20 min",
    deliveryTime: "30–45 min",
    status: "Aberto",
    price: "$$",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200&q=85",
    description:
      "Uma experiência italiana com massas artesanais, pizzas e pratos preparados com ingredientes selecionados.",
    address: "Av. Beira Mar, 1200 — Fortaleza, CE",
    menu: [
      {
        id: 1,
        name: "Spaghetti à Bolonhesa",
        description:
          "Massa artesanal com molho de tomate e carne bovina.",
        price: 32.9,
        image:
          "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=500&q=80",
      },
      {
        id: 2,
        name: "Pizza Margherita",
        description:
          "Molho de tomate, mozzarella, manjericão e azeite.",
        price: 39.9,
        image:
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80",
      },
      {
        id: 3,
        name: "Lasanha Especial",
        description:
          "Lasanha artesanal com molho de tomate, queijo e carne.",
        price: 36.9,
        image:
          "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500&q=80",
      },
    ],
  },

  "2": {
    name: "Sushi Ken",
    category: "Japonesa",
    rating: 4.7,
    reviews: 218,
    distance: "1,8 km",
    waitTime: "15–25 min",
    deliveryTime: "35–50 min",
    status: "Aberto",
    price: "$$",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&q=85",
    description:
      "Comida japonesa preparada na hora, com opções tradicionais e combinações especiais.",
    address: "Rua dos Restaurantes, 450 — Fortaleza, CE",
    menu: [
      {
        id: 1,
        name: "Combinado Sushi Ken",
        description:
          "Seleção especial de sushi e sashimi para uma pessoa.",
        price: 49.9,
        image:
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&q=80",
      },
      {
        id: 2,
        name: "Hot Roll",
        description:
          "Salmão, cream cheese e arroz empanados e crocantes.",
        price: 29.9,
        image:
          "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500&q=80",
      },
      {
        id: 3,
        name: "Temaki Salmão",
        description:
          "Cone de alga com arroz, salmão fresco e cream cheese.",
        price: 24.9,
        image:
          "https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=500&q=80",
      },
    ],
  },

  "3": {
    name: "Burger Place",
    category: "Hambúrguer",
    rating: 4.6,
    reviews: 451,
    distance: "2,1 km",
    waitTime: "20–30 min",
    deliveryTime: "30–40 min",
    status: "Lotado",
    price: "$",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=85",
    description:
      "Hambúrgueres artesanais, batatas crocantes e combinações para todos os gostos.",
    address: "Rua das Flores, 780 — Fortaleza, CE",
    menu: [
      {
        id: 1,
        name: "Classic Burger",
        description:
          "Hambúrguer artesanal, queijo, alface, tomate e molho especial.",
        price: 27.9,
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
      },
      {
        id: 2,
        name: "Bacon Burger",
        description:
          "Hambúrguer artesanal, queijo, bacon crocante e molho especial.",
        price: 32.9,
        image:
          "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&q=80",
      },
      {
        id: 3,
        name: "Batata Especial",
        description:
          "Batata frita crocante com queijo e molho da casa.",
        price: 18.9,
        image:
          "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80",
      },
    ],
  },

  "4": {
    name: "Pizzaria Bella Napoli",
    category: "Pizza",
    rating: 4.8,
    reviews: 389,
    distance: "2,5 km",
    waitTime: "10–15 min",
    deliveryTime: "25–40 min",
    status: "Aberto",
    price: "$$",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1200&q=85",
    description:
      "Pizzaria especializada em receitas clássicas e pizzas artesanais feitas no forno.",
    address: "Av. Santos Dumont, 920 — Fortaleza, CE",
    menu: [
      {
        id: 1,
        name: "Pizza Margherita",
        description:
          "Molho de tomate, mozzarella, manjericão e azeite.",
        price: 39.9,
        image:
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80",
      },
      {
        id: 2,
        name: "Pizza Pepperoni",
        description:
          "Molho de tomate, mozzarella e pepperoni.",
        price: 44.9,
        image:
          "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80",
      },
      {
        id: 3,
        name: "Pizza Quatro Queijos",
        description:
          "Mozzarella, provolone, parmesão e gorgonzola.",
        price: 46.9,
        image:
          "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=500&q=80",
      },
    ],
  },

  "5": {
    name: "Tempero Brasileiro",
    category: "Brasileira",
    rating: 4.5,
    reviews: 176,
    distance: "3,0 km",
    waitTime: "5–15 min",
    deliveryTime: "25–35 min",
    status: "Aberto",
    price: "$",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=85",
    description:
      "Comida brasileira caseira com pratos tradicionais e aquele sabor de comida feita em casa.",
    address: "Rua Ceará, 320 — Fortaleza, CE",
    menu: [
      {
        id: 1,
        name: "Baião de Dois",
        description:
          "Arroz, feijão, queijo coalho e carne seca.",
        price: 29.9,
        image:
          "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=500&q=80",
      },
      {
        id: 2,
        name: "Carne de Sol",
        description:
          "Carne de sol acompanhada de arroz, feijão e farofa.",
        price: 34.9,
        image:
          "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80",
      },
      {
        id: 3,
        name: "Feijoada",
        description:
          "Feijoada tradicional acompanhada de arroz e farofa.",
        price: 31.9,
        image:
          "https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80",
      },
    ],
  },
};

export function Restaurant() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [favorite, setFavorite] = useState(false);
  const [cart, setCart] = useState<Record<number, number>>({});

  const restaurant = id ? restaurants[id] : undefined;

  if (!restaurant) {
    return (
      <main className="restaurant-not-found">
        <div>
          <span>🍽️</span>
          <h1>Restaurante não encontrado</h1>
          <p>Não conseguimos encontrar esse restaurante.</p>

          <button onClick={() => navigate("/home")}>
            Voltar para o início
          </button>
        </div>
      </main>
    );
  }

  function addToCart(itemId: number) {
    setCart((current) => ({
      ...current,
      [itemId]: (current[itemId] || 0) + 1,
    }));
  }

  function removeFromCart(itemId: number) {
    setCart((current) => {
      const quantity = current[itemId] || 0;

      if (quantity <= 1) {
        const updated = { ...current };
        delete updated[itemId];
        return updated;
      }

      return {
        ...current,
        [itemId]: quantity - 1,
      };
    });
  }

  const cartItems = restaurant.menu.filter(
    (item) => cart[item.id]
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * cart[item.id],
    0
  );

  return (
    <div className="restaurant-page">

      <header className="restaurant-header">
        <button
          className="back-button"
          onClick={() => navigate("/home")}
        >
          ←
        </button>

        <div className="restaurant-header-title">
          <span>Apetitch</span>
        </div>

        <button
          className={`restaurant-favorite ${
            favorite ? "active" : ""
          }`}
          onClick={() => setFavorite(!favorite)}
        >
          {favorite ? "♥" : "♡"}
        </button>
      </header>

      <main>

        <section className="restaurant-hero">

          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="restaurant-cover"
          />

          <div className="restaurant-overlay"></div>

          <div className="restaurant-hero-content">
            <span className="restaurant-category">
              {restaurant.category}
            </span>

            <h1>{restaurant.name}</h1>

            <div className="restaurant-rating">
              <span>★ {restaurant.rating}</span>
              <span>({restaurant.reviews} avaliações)</span>
            </div>
          </div>

        </section>

        <section className="restaurant-container">

          <div className="restaurant-info-card">

            <div className="info-item">
              <span className="info-icon">●</span>

              <div>
                <strong>
                  {restaurant.status}
                </strong>

                <small>
                  Aberto agora
                </small>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">⏱</span>

              <div>
                <strong>
                  {restaurant.waitTime}
                </strong>

                <small>
                  Tempo de espera
                </small>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">🛵</span>

              <div>
                <strong>
                  {restaurant.deliveryTime}
                </strong>

                <small>
                  Delivery
                </small>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">📍</span>

              <div>
                <strong>
                  {restaurant.distance}
                </strong>

                <small>
                  Distância
                </small>
              </div>
            </div>

          </div>

          <section className="restaurant-description">

            <div>
              <span className="section-label">
                Sobre o restaurante
              </span>

              <h2>
                Uma experiência feita para você.
              </h2>
            </div>

            <p>
              {restaurant.description}
            </p>

            <div className="restaurant-address">
              📍 {restaurant.address}
            </div>

          </section>

          <section className="menu-section">

            <div className="menu-header">
              <div>
                <span className="section-label">
                  Cardápio
                </span>

                <h2>
                  Escolha seus favoritos
                </h2>
              </div>

              <span className="menu-count">
                {restaurant.menu.length} itens
              </span>
            </div>

            <div className="menu-list">

              {restaurant.menu.map((item) => (
                <article
                  className="menu-item"
                  key={item.id}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div className="menu-item-content">

                    <h3>{item.name}</h3>

                    <p>
                      {item.description}
                    </p>

                    <strong>
                      R$ {item.price.toFixed(2).replace(".", ",")}
                    </strong>

                  </div>

                  <div className="menu-actions">

                    {cart[item.id] ? (
                      <div className="quantity-control">

                        <button
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                        >
                          −
                        </button>

                        <span>
                          {cart[item.id]}
                        </span>

                        <button
                          onClick={() =>
                            addToCart(item.id)
                          }
                        >
                          +
                        </button>

                      </div>
                    ) : (
                      <button
                        className="add-button"
                        onClick={() =>
                          addToCart(item.id)
                        }
                      >
                        +
                      </button>
                    )}

                  </div>

                </article>
              ))}

            </div>

          </section>

          <section className="comparison-section">

            <div>
              <span className="section-label">
                Apetitch
              </span>

              <h2>
                Compare antes de pedir
              </h2>

              <p>
                Veja opções de entrega e escolha a
                melhor alternativa para seu pedido.
              </p>
            </div>

            <button className="comparison-button">
              Comparar delivery →
            </button>

          </section>

        </section>

      </main>

      {cartItems.length > 0 && (
        <div className="cart-bar">

          <div className="cart-summary">

            <span>
              {cartItems.reduce(
                (total, item) =>
                  total + cart[item.id],
                0
              )}{" "}
              item(ns)
            </span>

            <strong>
              R$ {cartTotal.toFixed(2).replace(".", ",")}
            </strong>

          </div>

          <button>
            Ver pedido →
          </button>

        </div>
      )}

    </div>
  );
}