export type RestaurantCategory =
  | "Pizza"
  | "Hambúrguer"
  | "Japonesa"
  | "Brasileira"
  | "Italiana"
  | "Cafeteria"
  | "Saudável";

export interface Restaurant {
  id: number;
  name: string;
  category: RestaurantCategory;
  secondaryCategory?: string;

  rating: number;
  distance: number;
  deliveryTime: string;

  latitude: number;
  longitude: number;

  image: string;
}
