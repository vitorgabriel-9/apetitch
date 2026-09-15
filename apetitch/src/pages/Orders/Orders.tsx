import { useEffect, useState } from "react";

import type { Order, OrderType } from "../../types/order";
import { getOrders } from "../../services/orderService";

import { BottomNavigation } from "../../components/BottomNavigation/BottomNavigation";

import "./Orders.css";

type Filter = "todos" | OrderType;

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<Filter>("todos");

  useEffect(() => {
    async function loadOrders() {
      const data = await getOrders();

      setOrders(data);
    }

    loadOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (filter === "todos") {
      return true;
    }

    return order.type === filter;
  });

  const ongoingOrders = filteredOrders.filter(
    (order) =>
      order.status === "em_preparacao" ||
      order.status === "a_caminho"
  );

  const completedOrders = filteredOrders.filter(
    (order) => order.status === "concluido"
  );

  return (
    <main className="orders-page">

      <section className="orders-container">

        {/* CABEÇALHO */}

        <header className="orders-header">

          <div className="orders-title-area">

            <button
              className="back-button"
              onClick={() => window.history.back()}
            >
              ‹
            </button>

            <div>
              <h1>Meus pedidos</h1>
              <p>Bistrô Vila Madá</p>
            </div>

          </div>

        </header>


        {/* FILTROS */}

        <div className="order-filters">

          <button
            className={filter === "todos" ? "selected" : ""}
            onClick={() => setFilter("todos")}
          >
            Todos
          </button>

          <button
            className={filter === "presencial" ? "selected" : ""}
            onClick={() => setFilter("presencial")}
          >
            Presencial
          </button>

          <button
            className={filter === "delivery" ? "selected" : ""}
            onClick={() => setFilter("delivery")}
          >
            Delivery
          </button>

        </div>


        {/* PEDIDOS EM ANDAMENTO */}

        {ongoingOrders.length > 0 && (
          <section className="orders-section">

            <h2>Em andamento</h2>

            <div className="orders-list">

              {ongoingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                />
              ))}

            </div>

          </section>
        )}


        {/* PEDIDOS CONCLUÍDOS */}

        {completedOrders.length > 0 && (
          <section className="orders-section">

            <h2>Concluídos</h2>

            <div className="orders-list">

              {completedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                />
              ))}

            </div>

          </section>
        )}


        {/* NENHUM PEDIDO */}

        {filteredOrders.length === 0 && (
          <div className="empty-orders">

            <span>🍽️</span>

            <h3>Nenhum pedido encontrado</h3>

            <p>
              Seus pedidos aparecerão aqui.
            </p>

          </div>
        )}

      </section>

      <BottomNavigation />

    </main>
  );
}


/* =========================
   CARD DO PEDIDO
========================= */

interface OrderCardProps {
  order: Order;
}

function OrderCard({ order }: OrderCardProps) {

  const isOngoing =
    order.status === "em_preparacao" ||
    order.status === "a_caminho";

  const typeText =
    order.type === "delivery"
      ? "Delivery"
      : "Presencial";


  let statusText = "Concluído";

  if (order.status === "em_preparacao") {
    statusText = "Em preparação";
  }

  if (order.status === "a_caminho") {
    statusText = "A caminho";
  }

  return (
    <article className="order-card">

      <img
        src={order.image}
        alt="Foto do pedido"
        className="order-image"
      />

      <div className="order-info">

        <div className="order-top">

          <strong>
            #{order.id} • {typeText}
          </strong>

          <span
            className={
              isOngoing
                ? "order-status ongoing"
                : "order-status completed"
            }
          >
            {statusText}
          </span>

        </div>


        <p className="order-date">
          {order.date} {order.time}
        </p>


        {order.deliveryTime && (
          <p className="order-detail">
            Previsão de entrega:{" "}
            <strong>{order.deliveryTime}</strong>
          </p>
        )}


        {order.table && (
          <p className="order-detail">
            {order.table} • {order.restaurant}
          </p>
        )}


        {order.deliveredBy && (
          <p className="order-detail">
            Entregue por <strong>{order.deliveredBy}</strong>
          </p>
        )}

      </div>


      <button
        className="order-menu"
        aria-label="Mais opções"
      >
        ⋮
      </button>

    </article>
  );
}