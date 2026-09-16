import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { BottomNavigation } from "../../components/BottomNavigation/BottomNavigation";

import "./Orders.css";

type OrderType = "Delivery" | "Presencial";
type OrderStatus = "Em preparação" | "Concluído";
type FilterType = "Todos" | OrderType;

interface Order {
  id: number;
  type: OrderType;
  status: OrderStatus;
  time: string;
  description: string;
  image: string;
}

const initialOrders: Order[] = [
  {
    id: 1258,
    type: "Delivery",
    status: "Em preparação",
    time: "Hoje 19:32",
    description: "Previsão de entrega: 20:05",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 1247,
    type: "Presencial",
    status: "Concluído",
    time: "Hoje 13:15",
    description: "Mesa 12 • Bistrô Vila Madá",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 1240,
    type: "Delivery",
    status: "Concluído",
    time: "Ontem 20:10",
    description: "Entregue por iFood",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80",
  },
];

export function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<FilterType>("Todos");

  const filteredOrders = useMemo(() => {
    if (filter === "Todos") {
      return orders;
    }

    return orders.filter((order) => order.type === filter);
  }, [orders, filter]);

  const activeOrders = filteredOrders.filter(
    (order) => order.status !== "Concluído"
  );

  const completedOrders = filteredOrders.filter(
    (order) => order.status === "Concluído"
  );

  function deleteOrder(id: number) {
    const shouldDelete = window.confirm(
      "Deseja realmente excluir este pedido?"
    );

    if (!shouldDelete) {
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.filter((order) => order.id !== id)
    );
  }

  return (
    <div className="orders-page">
      {/* HEADER PADRÃO DO APP */}

      <header className="orders-topbar">
        <div className="orders-brand">
          <div className="orders-logo">A</div>

          <span>Apetitch</span>
        </div>

        <div className="orders-topbar-actions">
          <button className="orders-location">
            <span>📍</span>
            Fortaleza, CE
          </button>

          <button
            className="orders-profile"
            onClick={() => navigate("/perfil")}
            aria-label="Abrir perfil"
          >
            👤
          </button>
        </div>
      </header>

      {/* CONTEÚDO */}

      <main className="orders-content">
        {/* TÍTULO */}

        <section className="orders-heading">
          <button
            className="orders-back"
            onClick={() => navigate(-1)}
            aria-label="Voltar"
          >
            ‹
          </button>

          <div>
            <h1>Meus pedidos</h1>
            <p>Bistrô Vila Madá</p>
          </div>
        </section>

        {/* FILTROS */}

        <section className="orders-filters">
          {(["Todos", "Presencial", "Delivery"] as FilterType[]).map(
            (option) => (
              <button
                key={option}
                className={`orders-filter ${
                  filter === option ? "active" : ""
                }`}
                onClick={() => setFilter(option)}
              >
                {option}
              </button>
            )
          )}
        </section>

        {/* EM ANDAMENTO */}

        <OrderSection
          title="Em andamento"
          orders={activeOrders}
          onDelete={deleteOrder}
        />

        {/* CONCLUÍDOS */}

        <OrderSection
          title="Concluídos"
          orders={completedOrders}
          onDelete={deleteOrder}
        />
      </main>

      {/* NAVBAR PADRÃO DO APP */}

      <BottomNavigation />
    </div>
  );
}

interface OrderSectionProps {
  title: string;
  orders: Order[];
  onDelete: (id: number) => void;
}

function OrderSection({
  title,
  orders,
  onDelete,
}: OrderSectionProps) {
  return (
    <section className="orders-section">
      <div className="orders-section-header">
        <h2>{title}</h2>

        <span>
          {orders.length} {orders.length === 1 ? "pedido" : "pedidos"}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          Nenhum pedido nesta categoria.
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}

interface OrderCardProps {
  order: Order;
  onDelete: (id: number) => void;
}

function OrderCard({
  order,
  onDelete,
}: OrderCardProps) {
  return (
    <article className="order-card">
      <img
        className="order-image"
        src={order.image}
        alt={`Pedido ${order.id}`}
      />

      <div className="order-information">
        <strong className="order-title">
          #{order.id} • {order.type}
        </strong>

        <span className="order-time">
          {order.time}
        </span>

        <p>{order.description}</p>
      </div>

      <div
        className={`order-status ${
          order.status === "Concluído"
            ? "completed"
            : "preparing"
        }`}
      >
        {order.status}
      </div>

      <button
        className="order-delete"
        onClick={() => onDelete(order.id)}
        aria-label={`Excluir pedido ${order.id}`}
        title="Excluir pedido"
      >
        ×
      </button>
    </article>
  );
}