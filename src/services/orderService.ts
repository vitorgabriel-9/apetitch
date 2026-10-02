import type { Order } from "../types/order";
import foodBackground from "../assets/food-background.jpg";

const ORDERS_KEY = "apetitch:orders";

const orders: Order[] = [
  {
    id: 1258,
    restaurant: "Bistrô Vila Madá",
    type: "delivery",
    status: "em_preparacao",
    date: "Hoje",
    time: "19:32",
    image: foodBackground,
    deliveryTime: "20:05",
  },

  {
    id: 1247,
    restaurant: "Bistrô Vila Madá",
    type: "presencial",
    status: "concluido",
    date: "Hoje",
    time: "13:15",
    image: foodBackground,
    table: "Mesa 12",
  },

  {
    id: 1240,
    restaurant: "Bistrô Vila Madá",
    type: "delivery",
    status: "concluido",
    date: "Ontem",
    time: "20:10",
    image: foodBackground,
    deliveredBy: "iFood",
  },
];

export async function getOrders(): Promise<Order[]> {
  // Simula uma requisição para a API
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    const savedOrders = JSON.parse(
      window.localStorage.getItem(ORDERS_KEY) ?? "[]"
    ) as Order[];

    return [...savedOrders, ...orders];
  } catch {
    return orders;
  }
}

export function createOrder({
  restaurant,
  itemCount,
  items,
  total,
}: Pick<Order, "restaurant" | "itemCount" | "items" | "total">): Order {
  const order: Order = {
    id: Date.now(),
    restaurant,
    type: "delivery",
    status: "em_preparacao",
    date: "Hoje",
    time: new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    image: foodBackground,
    deliveryTime: "Em até 45 min",
    itemCount,
    items,
    total,
  };

  let savedOrders: Order[] = [];

  try {
    savedOrders = JSON.parse(
      window.localStorage.getItem(ORDERS_KEY) ?? "[]"
    ) as Order[];
  } catch {
    // Mantém a lista vazia quando o armazenamento local estiver inválido.
  }

  window.localStorage.setItem(
    ORDERS_KEY,
    JSON.stringify([order, ...savedOrders])
  );

  return order;
}
