import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { BottomNavigation } from "../../components/BottomNavigation/BottomNavigation";
import { getOrders } from "../../services/orderService";
import type { Order, OrderType } from "../../types/order";

import "./Orders.css";

type FilterType = "Todos" | OrderType;

export function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<FilterType>("Todos");

  useEffect(() => {
    async function loadOrders() {
      setOrders(await getOrders());
    }

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (filter === "Todos") {
      return orders;
    }

    return orders.filter((order) => order.type === filter);
  }, [filter, orders]);

  const activeOrders = filteredOrders.filter(
    (order) => order.status !== "concluido" && order.status !== "cancelado"
  );
  const completedOrders = filteredOrders.filter(
    (order) => order.status === "concluido"
  );
  const cancelledOrders = filteredOrders.filter(
    (order) => order.status === "cancelado"
  );
  const orderTotal = orders.reduce((total, order) => total + (order.total ?? 0), 0);

  function removeOrder(id: number) {
    setOrders((current) => current.filter((order) => order.id !== id));
  }

  return (
    <div className="orders-page">
      <header className="orders-topbar">
        <div className="orders-brand">
          <div className="orders-logo">A</div>
          <span>Apetitch</span>
        </div>

        <div className="orders-topbar-actions">
          <span className="orders-location">📍 Fortaleza, CE</span>
          <button
            className="orders-profile"
            onClick={() => navigate("/perfil")}
            aria-label="Abrir perfil"
          >
            👤
          </button>
        </div>
      </header>

      <main className="orders-content">
        <section className="orders-heading">
          <button
            className="orders-back"
            onClick={() => navigate("/home")}
            aria-label="Voltar para a página inicial"
          >
            ‹
          </button>
          <div>
            <h1>Meus pedidos</h1>
            <p>Acompanhe cada etapa, do preparo à entrega.</p>
          </div>
        </section>

        <section className="orders-overview" aria-label="Resumo dos pedidos">
          <div>
            <span>Em andamento</span>
            <strong>{activeOrders.length}</strong>
          </div>
          <div>
            <span>Pedidos no histórico</span>
            <strong>{orders.length}</strong>
          </div>
          <div>
            <span>Total registrado</span>
            <strong>{orderTotal ? `R$ ${orderTotal.toFixed(2).replace(".", ",")}` : "—"}</strong>
          </div>
        </section>

        <section className="orders-filters" aria-label="Filtrar pedidos">
          {(["Todos", "presencial", "delivery"] as FilterType[]).map(
            (option) => (
              <button
                key={option}
                className={`orders-filter ${filter === option ? "active" : ""}`}
                onClick={() => setFilter(option)}
              >
                {option === "presencial" ? "Presencial" : option === "delivery" ? "Delivery" : option}
              </button>
            )
          )}
        </section>

        <OrderSection title="Em andamento" orders={activeOrders} onRemove={removeOrder} />
        <OrderSection title="Concluídos" orders={completedOrders} onRemove={removeOrder} />
        {cancelledOrders.length > 0 && (
          <OrderSection title="Cancelados" orders={cancelledOrders} onRemove={removeOrder} />
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}

type OrderSectionProps = {
  title: string;
  orders: Order[];
  onRemove: (id: number) => void;
};

function OrderSection({ title, orders, onRemove }: OrderSectionProps) {
  return (
    <section className="orders-section">
      <div className="orders-section-header">
        <h2>{title}</h2>
        <span>{orders.length} {orders.length === 1 ? "pedido" : "pedidos"}</span>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">Nenhum pedido nesta categoria.</div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => <OrderCard key={order.id} order={order} onRemove={onRemove} />)}
        </div>
      )}
    </section>
  );
}

type OrderCardProps = {
  order: Order;
  onRemove: (id: number) => void;
};

function OrderCard({ order, onRemove }: OrderCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const isCompleted = order.status === "concluido";
  const status = order.status === "em_preparacao"
    ? { label: "Em preparação", description: "O restaurante está preparando seu pedido.", icon: "◔" }
    : order.status === "a_caminho"
      ? { label: "A caminho", description: "Seu pedido está a caminho.", icon: "↗" }
      : isCompleted
        ? { label: "Concluído", description: "Pedido finalizado.", icon: "✓" }
        : { label: "Cancelado", description: "Este pedido foi cancelado.", icon: "×" };

  return (
    <article className={`order-card ${isCompleted ? "is-completed" : ""}`}>
      <img className="order-image" src={order.image} alt={`Pedido ${order.id}`} />

      <div className="order-information">
        <div className="order-eyebrow">
          <span>#{order.id}</span>
          <span>{order.type === "delivery" ? "Delivery" : "Presencial"}</span>
        </div>
        <h3>{order.restaurant}</h3>
        <span className="order-time">{order.date} · {order.time}</span>
        <p>{order.deliveryTime ? `Previsão: ${order.deliveryTime}` : order.table ?? order.deliveredBy ?? "Pedido no local"}</p>
      </div>

      <div className={`order-status ${isCompleted ? "completed" : "preparing"}`}>
        <span>{status.icon}</span>{status.label}
      </div>

      <button
        className="order-details-button"
        type="button"
        onClick={() => setShowDetails((current) => !current)}
        aria-label={showDetails ? "Ocultar detalhes do pedido" : "Ver detalhes do pedido"}
        aria-expanded={showDetails}
      >
        {showDetails ? "Ocultar detalhes" : "Ver detalhes"}
      </button>

      {showDetails && (
        <div className="order-detail-panel">
          <div>
            <strong>Detalhes do pedido</strong>
            <p>{order.items?.join(" · ") ?? "Os itens deste pedido não estão disponíveis."}</p>
          </div>
          <div className="order-detail-total">
            {order.total !== undefined && <strong>R$ {order.total.toFixed(2).replace(".", ",")}</strong>}
            <span>{status.description}</span>
          </div>
          <button
            className="order-remove"
            type="button"
            onClick={() => onRemove(order.id)}
            aria-label={`Ocultar pedido ${order.id} desta visualização`}
          >
            Ocultar pedido
          </button>
        </div>
      )}
    </article>
  );
}
