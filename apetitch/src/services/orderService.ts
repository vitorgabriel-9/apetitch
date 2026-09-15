import type { Order } from "../types/order";

const orders: Order[] = [
  {
    id: 1258,
    restaurant: "Bistrô Vila Madá",
    type: "delivery",
    status: "em_preparacao",
    date: "Hoje",
    time: "19:32",
    image: "/images/pedido1.jpg",
    deliveryTime: "20:05",
  },

  {
    id: 1247,
    restaurant: "Bistrô Vila Madá",
    type: "presencial",
    status: "concluido",
    date: "Hoje",
    time: "13:15",
    image: "/images/pedido2.jpg",
    table: "Mesa 12",
  },

  {
    id: 1240,
    restaurant: "Bistrô Vila Madá",
    type: "delivery",
    status: "concluido",
    date: "Ontem",
    time: "20:10",
    image: "/images/pedido3.jpg",
    deliveredBy: "iFood",
  },
];

export async function getOrders(): Promise<Order[]> {
  // Simula uma requisição para a API
  await new Promise((resolve) => setTimeout(resolve, 300));

  return orders;
}