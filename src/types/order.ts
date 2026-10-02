export type OrderType = "delivery" | "presencial";

export type OrderStatus =
  | "em_preparacao"
  | "a_caminho"
  | "concluido"
  | "cancelado";

export interface Order {
  id: number;
  restaurant: string;
  type: OrderType;
  status: OrderStatus;

  date: string;
  time: string;

  image: string;

  deliveryTime?: string;
  table?: string;
  deliveredBy?: string;
  itemCount?: number;
  items?: string[];
  total?: number;
}
