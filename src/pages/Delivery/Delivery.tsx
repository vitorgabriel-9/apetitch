import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { clearRestaurantCart } from "../../services/cartService";
import { createOrder, updateOrderStatus } from "../../services/orderService";

import "./Delivery.css";

// Este tipo descreve os dados que chegam da tela de comparação.
type DeliveryData = {
  restaurantId: string;
  restaurantName: string;
  deliveryName: string;
  fee: number;
  time: string;
  mode: "apetitch" | "partner" | "pickup";
  orderId?: number;
  checkout?: {
    itemCount: number;
    items: string[];
    total: number;
  };
};

const DELIVERY_SUMMARY_KEY = "apetitch:delivery-summary";

function getStoredDelivery(): DeliveryData | null {
  try {
    const savedDelivery = window.sessionStorage.getItem(DELIVERY_SUMMARY_KEY);
    return savedDelivery ? (JSON.parse(savedDelivery) as DeliveryData) : null;
  } catch {
    return null;
  }
}

// Cada item é uma etapa visual da entrega.
const deliverySteps = [
  "Pedido confirmado",
  "Em preparação",
  "Pronto para sair",
  "Pedido entregue",
];

export function Delivery() {
  const navigate = useNavigate();
  const location = useLocation();

  // `location.state` contém os dados enviados pela tela anterior.
  // O sessionStorage é um plano B caso a página seja atualizada.
  const [delivery, setDelivery] = useState<DeliveryData | null>(
    () => (location.state as DeliveryData | null) ?? getStoredDelivery()
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Se alguém abrir /entrega diretamente, não existem dados para mostrar.
  if (!delivery) {
    return (
      <main className="delivery-not-found">
        <span>🛵</span>
        <h1>Nenhuma entrega selecionada</h1>
        <p>Compare uma modalidade de entrega antes de abrir este resumo.</p>
        <button type="button" onClick={() => navigate("/home")}>
          Voltar para a Home
        </button>
      </main>
    );
  }

  // A partir daqui existe uma entrega válida; o alias mantém essa garantia nos callbacks.
  const deliveryData = delivery;
  const isPickup = delivery.mode === "pickup";
  const isFinished = currentStep === deliverySteps.length - 1;

  function finishCheckout() {
    if (!deliveryData.checkout) {
      navigate(`/restaurante/${deliveryData.restaurantId}`);
      return;
    }

    if (deliveryData.orderId) {
      navigate("/pedidos");
      return;
    }

    const order = createOrder({
      restaurant: deliveryData.restaurantName,
      itemCount: deliveryData.checkout.itemCount,
      items: deliveryData.checkout.items,
      total: deliveryData.checkout.total,
    });
    clearRestaurantCart(String(deliveryData.restaurantId));
    const trackedDelivery = { ...deliveryData, orderId: order.id };
    setDelivery(trackedDelivery);
    window.sessionStorage.setItem(
      DELIVERY_SUMMARY_KEY,
      JSON.stringify(trackedDelivery)
    );
  }

  function advanceStep() {
    if (!deliveryData.orderId) {
      return;
    }

    // Nunca deixa o índice passar da última etapa.
    setCurrentStep((step) => {
      const nextStep = Math.min(step + 1, deliverySteps.length - 1);

      if (nextStep === deliverySteps.length - 1) {
        updateOrderStatus(deliveryData.orderId!, "concluido");
      }

      return nextStep;
    });
  }

  return (
    <main className="delivery-page">
      <header className="delivery-header">
        <button
          type="button"
          className="delivery-back"
          onClick={() => navigate(-1)}
          aria-label="Voltar para a comparação"
        >
          ←
        </button>
        <span>Apetitch</span>
        <span className="delivery-header-status">Resumo</span>
      </header>

      <section className="delivery-content">
        <span className="delivery-eyebrow">
          {isPickup ? "Retirada escolhida" : "Entrega escolhida"}
        </span>
        <h1>{delivery.restaurantName}</h1>
        <p className="delivery-description">
          Confira os dados da modalidade selecionada e confirme o pedido para acompanhar a entrega.
        </p>

        <article className="delivery-summary-card">
          <div className="delivery-icon">{isPickup ? "🥡" : "🛵"}</div>
          <div>
            <span>Modalidade</span>
            <strong>{delivery.deliveryName}</strong>
          </div>
          <div>
            <span>{isPickup ? "Tempo de preparo" : "Previsão"}</span>
            <strong>{delivery.time}</strong>
          </div>
          <div>
            <span>Taxa</span>
            <strong>{delivery.fee ? `R$ ${delivery.fee.toFixed(2).replace(".", ",")}` : "Sem taxa"}</strong>
          </div>
        </article>

        {delivery.checkout && (
          <section className="delivery-order-summary" aria-label="Resumo do pedido">
            <span>
              {delivery.checkout.itemCount} {delivery.checkout.itemCount === 1 ? "item" : "itens"} no pedido
            </span>
            <strong>R$ {delivery.checkout.total.toFixed(2).replace(".", ",")}</strong>
          </section>
        )}

        <section className="delivery-timeline" aria-labelledby="delivery-timeline-title">
          <div className="timeline-heading">
            <div>
              <span className="delivery-eyebrow">Acompanhamento</span>
              <h2 id="delivery-timeline-title">Status da entrega</h2>
            </div>
            <span className="timeline-progress">{currentStep + 1} de {deliverySteps.length}</span>
          </div>

          <ol>
            {deliverySteps.map((step, index) => (
              <li
                key={step}
                className={index < currentStep ? "completed" : index === currentStep ? "current" : ""}
              >
                <span>{index < currentStep ? "✓" : index + 1}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>

          <button
            className="advance-delivery"
            type="button"
            onClick={advanceStep}
            disabled={isFinished || !deliveryData.orderId}
          >
            {!deliveryData.orderId
              ? "Confirme o pedido para acompanhar"
              : isFinished
                ? "Entrega concluída"
                : "Avançar status de demonstração"}
          </button>
        </section>

        <label className="delivery-notifications">
          <span>
            <strong>Atualizações da entrega</strong>
            <small>Receber avisos sobre mudanças no status.</small>
          </span>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={() => setNotificationsEnabled((enabled) => !enabled)}
          />
        </label>

        <button
          className="delivery-menu-button"
          type="button"
          onClick={finishCheckout}
        >
          {!delivery.checkout
            ? "Escolher itens do restaurante"
            : deliveryData.orderId
              ? "Ver meus pedidos"
              : "Confirmar pedido"}
        </button>
      </section>
    </main>
  );
}
