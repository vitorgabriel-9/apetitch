import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createOrder } from "../../services/orderService";
import {
  getFavoriteRestaurantIds,
  getCurrentUser,
  getRestaurantFeedbacks,
  saveFavoriteRestaurantIds,
  saveRestaurantFeedback,
} from "../../services/appState";
import {
  clearRestaurantCart,
  getRestaurantCart,
  saveRestaurantCart,
} from "../../services/cartService";

import "./Restaurant.css";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

type OpeningHours = {
  day: string;
  hours: string;
};

type Address = {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  reference?: string;
};

type ContactChannel = {
  label: string;
  value: string;
  href: string;
};

type Feedback = {
  author: string;
  rating: number;
  date: string;
  comment: string;
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
  priceRange: string;
  image: string;
  description: string;
  address: string;
  location: Address;
  openingHours: OpeningHours[];
  contactChannels: ContactChannel[];
  orderMethods: string[];
  feedbacks: Feedback[];
  menu: MenuItem[];
};

const standardOpeningHours: OpeningHours[] = [
  { day: "Segunda a quinta", hours: "11:30 – 23:00" },
  { day: "Sexta e sábado", hours: "11:30 – 00:00" },
  { day: "Domingo", hours: "11:30 – 22:30" },
];

const standardContactChannels: ContactChannel[] = [
  { label: "WhatsApp", value: "(85) 99999-0000", href: "https://wa.me/5585999990000" },
  { label: "Instagram", value: "@apetitchrestaurante", href: "https://instagram.com" },
];

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
    priceRange: "$$ · R$ 40–80 por pessoa",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200&q=85",
    description:
      "Uma experiência italiana com massas artesanais, pizzas e pratos preparados com ingredientes selecionados.",
    address: "Av. Beira Mar, 1200 — Fortaleza, CE",
    location: {
      street: "Av. Beira Mar, 1200",
      neighborhood: "Meireles",
      city: "Fortaleza",
      state: "CE",
      reference: "Próximo ao Mercado dos Peixes",
    },
    openingHours: standardOpeningHours,
    contactChannels: standardContactChannels,
    orderMethods: ["Delivery pelo Apetitch", "Retirada no local", "Reserva por WhatsApp"],
    feedbacks: [
      { author: "Mariana S.", rating: 5, date: "Há 2 dias", comment: "Massa fresca e atendimento muito atencioso. A lasanha chegou quentinha." },
      { author: "Rafael M.", rating: 4, date: "Há 1 semana", comment: "Ótima opção para jantar; a pizza Margherita é excelente." },
    ],
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
    priceRange: "$$ · R$ 55–95 por pessoa",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&q=85",
    description:
      "Comida japonesa preparada na hora, com opções tradicionais e combinações especiais.",
    address: "Rua dos Restaurantes, 450 — Fortaleza, CE",
    location: { street: "Rua dos Restaurantes, 450", neighborhood: "Aldeota", city: "Fortaleza", state: "CE" },
    openingHours: [
      { day: "Terça a quinta", hours: "12:00 – 23:00" },
      { day: "Sexta e sábado", hours: "12:00 – 00:00" },
      { day: "Domingo", hours: "12:00 – 22:00" },
      { day: "Segunda", hours: "Fechado" },
    ],
    contactChannels: standardContactChannels,
    orderMethods: ["Delivery pelo Apetitch", "Retirada no local"],
    feedbacks: [
      { author: "Camila R.", rating: 5, date: "Há 3 dias", comment: "Peixe fresco e combinado bem servido." },
      { author: "João P.", rating: 4, date: "Há 2 semanas", comment: "O temaki é muito bom e o pedido chegou no prazo." },
    ],
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
    priceRange: "$ · R$ 25–50 por pessoa",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=85",
    description:
      "Hambúrgueres artesanais, batatas crocantes e combinações para todos os gostos.",
    address: "Rua das Flores, 780 — Fortaleza, CE",
    location: { street: "Rua das Flores, 780", neighborhood: "Cocó", city: "Fortaleza", state: "CE" },
    openingHours: [
      { day: "Segunda a quinta", hours: "17:00 – 23:00" },
      { day: "Sexta e sábado", hours: "17:00 – 00:00" },
      { day: "Domingo", hours: "17:00 – 22:30" },
    ],
    contactChannels: standardContactChannels,
    orderMethods: ["Delivery pelo Apetitch", "Retirada no local"],
    feedbacks: [
      { author: "Lucas A.", rating: 5, date: "Há 1 dia", comment: "Hambúrguer no ponto e batata bem crocante." },
      { author: "Beatriz L.", rating: 4, date: "Há 5 dias", comment: "Vale a espera nos horários mais movimentados." },
    ],
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
    priceRange: "$$ · R$ 45–85 por pessoa",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1200&q=85",
    description:
      "Pizzaria especializada em receitas clássicas e pizzas artesanais feitas no forno.",
    address: "Av. Santos Dumont, 920 — Fortaleza, CE",
    location: { street: "Av. Santos Dumont, 920", neighborhood: "Aldeota", city: "Fortaleza", state: "CE" },
    openingHours: standardOpeningHours,
    contactChannels: standardContactChannels,
    orderMethods: ["Delivery pelo Apetitch", "Retirada no local", "Reserva por WhatsApp"],
    feedbacks: [
      { author: "Ana C.", rating: 5, date: "Há 4 dias", comment: "Pizza saborosa, massa leve e entrega cuidadosa." },
      { author: "Pedro V.", rating: 5, date: "Há 2 semanas", comment: "A quatro queijos é uma das melhores que já pedi." },
    ],
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
    priceRange: "$ · R$ 25–55 por pessoa",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=85",
    description:
      "Comida brasileira caseira com pratos tradicionais e aquele sabor de comida feita em casa.",
    address: "Rua Ceará, 320 — Fortaleza, CE",
    location: { street: "Rua Ceará, 320", neighborhood: "Praia de Iracema", city: "Fortaleza", state: "CE" },
    openingHours: [
      { day: "Segunda a sábado", hours: "11:00 – 22:00" },
      { day: "Domingo", hours: "11:00 – 16:00" },
    ],
    contactChannels: standardContactChannels,
    orderMethods: ["Delivery pelo Apetitch", "Retirada no local"],
    feedbacks: [
      { author: "Fernanda G.", rating: 5, date: "Há 2 dias", comment: "Comida caseira muito bem feita e porção generosa." },
      { author: "Diego F.", rating: 4, date: "Há 1 semana", comment: "Baião de dois delicioso e preço justo." },
    ],
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

  const [favorite, setFavorite] = useState(() =>
    id ? getFavoriteRestaurantIds().includes(Number(id)) : false
  );
  const [cart, setCart] = useState<Record<number, number>>(() =>
    id ? getRestaurantCart(id) : {}
  );
  const [showOpeningHours, setShowOpeningHours] = useState(false);
  const [showCartReview, setShowCartReview] = useState(false);
  const [customFeedbacks, setCustomFeedbacks] = useState<Feedback[]>(() =>
    id ? getRestaurantFeedbacks(id) : []
  );
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const restaurant = id ? restaurants[id] : undefined;

  useEffect(() => {
    if (id) {
      saveRestaurantCart(id, cart);
    }
  }, [cart, id]);

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

  function toggleFavorite() {
    if (!id) {
      return;
    }

    const restaurantId = Number(id);
    const currentFavorites = getFavoriteRestaurantIds();
    const updatedFavorites = favorite
      ? currentFavorites.filter((favoriteId) => favoriteId !== restaurantId)
      : [...currentFavorites, restaurantId];

    saveFavoriteRestaurantIds(updatedFavorites);
    setFavorite(!favorite);
  }

  const cartItems = restaurant.menu.filter(
    (item) => cart[item.id]
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * cart[item.id],
    0
  );

  const statusDetail =
    restaurant.status === "Aberto"
      ? "Aberto agora"
      : restaurant.status === "Lotado"
        ? "Aberto, com alta demanda"
        : "Fechado no momento";
  const restaurantName = restaurant.name;

  function finishOrder() {
    const itemCount = cartItems.reduce(
      (total, item) => total + cart[item.id],
      0
    );

    createOrder({
      restaurant: restaurantName,
      itemCount,
      items: cartItems.map((item) => `${cart[item.id]}x ${item.name}`),
      total: cartTotal,
    });
    if (id) {
      clearRestaurantCart(id);
    }
    setCart({});
    setShowCartReview(false);
    navigate("/pedidos");
  }

  function submitFeedback(event: React.FormEvent) {
    event.preventDefault();

    if (!feedbackComment.trim() || !id) {
      setFeedbackMessage("Escreva um comentário antes de enviar.");
      return;
    }

    const feedback: Feedback = {
      author: getCurrentUser()?.name ?? "Cliente Apetitch",
      rating: feedbackRating,
      date: "Agora",
      comment: feedbackComment.trim(),
    };

    saveRestaurantFeedback(id, feedback);
    setCustomFeedbacks((current) => [feedback, ...current]);
    setFeedbackComment("");
    setFeedbackMessage("Avaliação enviada. Obrigado pelo feedback!");
  }

  const allFeedbacks = [...customFeedbacks, ...restaurant.feedbacks];
  const totalReviews = restaurant.reviews + customFeedbacks.length;

  return (
    <div className="restaurant-page">

      <header className="restaurant-header">
        <button
          className="back-button"
          onClick={() => navigate("/home")}
          aria-label="Voltar para a página inicial"
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
          onClick={toggleFavorite}
          aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          aria-pressed={favorite}
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

                <small>{statusDetail}</small>
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
              <span className="info-icon">$</span>

              <div>
                <strong>{restaurant.price}</strong>

                <small>Faixa de preço</small>
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

            <div className="restaurant-about">
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
            </div>

            <div className="restaurant-address">
              <strong>📍 {restaurant.address}</strong>
              <span>
                {restaurant.location.neighborhood} · {restaurant.location.city}, {restaurant.location.state}
                {restaurant.location.reference && ` · ${restaurant.location.reference}`}
              </span>
            </div>

            <div className="restaurant-details">
              <div className="detail-block">
                <div className="detail-heading">
                  <span>🕒 Funcionamento</span>
                  <button
                    type="button"
                    aria-expanded={showOpeningHours}
                    aria-controls="opening-hours-list"
                    onClick={() => setShowOpeningHours((current) => !current)}
                  >
                    {showOpeningHours ? "Ocultar" : "Ver horários"}
                  </button>
                </div>
                <strong>Consulte os horários por dia</strong>
                {showOpeningHours && (
                  <ul className="opening-hours-list" id="opening-hours-list">
                    {restaurant.openingHours.map((schedule) => (
                      <li key={schedule.day}>
                        <span>{schedule.day}</span>
                        <strong>{schedule.hours}</strong>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="detail-block">
                <span>Faixa de preço</span>
                <strong>{restaurant.priceRange}</strong>
              </div>

              <div className="detail-block order-details">
                <span>Como pedir</span>
                <div className="detail-tags">
                  {restaurant.orderMethods.map((method) => <span key={method}>{method}</span>)}
                </div>
              </div>

              <div className="detail-block contact-details">
                <span>Atendimento</span>
                <div className="detail-links">
                  {restaurant.contactChannels.map((channel) => (
                    <a key={channel.label} href={channel.href} target="_blank" rel="noreferrer">
                      {channel.label}: {channel.value}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <a className="menu-access-button" href="#cardapio">
              Ver cardápio completo ↓
            </a>

          </section>

          <section className="menu-section" id="cardapio">

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
                          aria-label={`Diminuir quantidade de ${item.name}`}
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
                          aria-label={`Aumentar quantidade de ${item.name}`}
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
                        aria-label={`Adicionar ${item.name} ao carrinho`}
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

          <section className="reviews-section" aria-labelledby="reviews-title">
            <div className="reviews-header">
              <div>
                <span className="section-label">Avaliações</span>
                <h2 id="reviews-title">O que dizem sobre o restaurante</h2>
              </div>
              <div className="reviews-summary">
                <strong>★ {restaurant.rating}</strong>
                <span>{totalReviews} avaliações</span>
              </div>
            </div>

            <div className="feedback-list">
              {allFeedbacks.map((feedback) => (
                <article className="feedback-card" key={`${feedback.author}-${feedback.date}`}>
                  <div>
                    <strong>{feedback.author}</strong>
                    <span>★ {feedback.rating} · {feedback.date}</span>
                  </div>
                  <p>{feedback.comment}</p>
                </article>
              ))}
            </div>

            <form className="feedback-form" onSubmit={submitFeedback}>
              <label htmlFor="feedback-comment">Deixe sua avaliação</label>
              <div className="rating-picker" aria-label="Escolha uma nota">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    className={rating <= feedbackRating ? "selected" : ""}
                    onClick={() => setFeedbackRating(rating)}
                    aria-label={`${rating} estrela${rating > 1 ? "s" : ""}`}
                    aria-pressed={rating === feedbackRating}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                id="feedback-comment"
                value={feedbackComment}
                onChange={(event) => setFeedbackComment(event.target.value)}
                placeholder="Conte como foi sua experiência"
                maxLength={280}
              />
              {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
              <button type="submit">Enviar avaliação</button>
            </form>
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

            <button
              className="comparison-button"
              onClick={() => navigate(`/home?comparar=${id}`)}
            >
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

          <button onClick={() => setShowCartReview(true)}>
            Ver pedido →
          </button>

        </div>
      )}

      {showCartReview && (
        <div className="cart-review" role="dialog" aria-modal="true" aria-labelledby="cart-review-title">
          <div className="cart-review-content">
            <button
              className="cart-review-close"
              type="button"
              onClick={() => setShowCartReview(false)}
              aria-label="Fechar revisão do pedido"
            >
              ×
            </button>
            <span className="section-label">Revisar pedido</span>
            <h2 id="cart-review-title">{restaurantName}</h2>
            <div className="cart-review-items">
              {cartItems.map((item) => (
                <div key={item.id}>
                  <span>{cart[item.id]}x {item.name}</span>
                  <strong>R$ {(item.price * cart[item.id]).toFixed(2).replace(".", ",")}</strong>
                </div>
              ))}
            </div>
            <div className="cart-review-total">
              <span>Total</span>
              <strong>R$ {cartTotal.toFixed(2).replace(".", ",")}</strong>
            </div>
            <button className="confirm-order-button" onClick={finishOrder}>
              Confirmar pedido
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
