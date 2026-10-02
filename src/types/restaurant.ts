export type RestaurantCategory =
  | "Pizza"
  | "Hambúrguer"
  | "Japonesa"
  | "Brasileira"
  | "Italiana"
  | "Cafeteria"
  | "Saudável";

export type RestaurantStatus =
  | "Aberto"
  | "Lotado"
  | "Fechado";

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface OpeningHours {
  day: string;
  hours: string;
}

export interface Address {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  reference?: string;
}

export interface ContactChannel {
  label: string;
  value: string;
  href: string;
}

export interface Feedback {
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Restaurant {
  id: string;

  name: string;
  category: RestaurantCategory;
  secondaryCategory?: string;

  rating: number;
  reviews: number;

  distance: number;
  waitTime: string;
  deliveryTime: string;

  status: RestaurantStatus;

  price: string;
  priceRange: string;

  delivery: boolean;

  latitude: number;
  longitude: number;

  image: string;

  description: string;

  address: string;
  location: Address;

  openingHours: OpeningHours[];

  contactChannels: ContactChannel[];

  orderMethods: string[];

  menu: MenuItem[];

  feedbacks: Feedback[];
}