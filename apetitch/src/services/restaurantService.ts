import type { Restaurant } from "../types/restaurant";

const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "Bistrô Vila Madá",
    category: "Italiana",
    secondaryCategory: "Bistrô",
    rating: 4.7,
    distance: 0.8,
    deliveryTime: "25–35 min",
    latitude: -3.7319,
    longitude: -38.5091,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
  },

  {
    id: 2,
    name: "Smoke House",
    category: "Hambúrguer",
    secondaryCategory: "Americana",
    rating: 4.5,
    distance: 1.2,
    deliveryTime: "20–30 min",
    latitude: -3.736,
    longitude: -38.503,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  },

  {
    id: 3,
    name: "La Bella Pizza",
    category: "Pizza",
    secondaryCategory: "Italiana",
    rating: 4.6,
    distance: 1.6,
    deliveryTime: "30–40 min",
    latitude: -3.725,
    longitude: -38.515,
    image: "https://images.unsplash.com/photo-1579751626657-72bc17010498",
  },

  {
    id: 4,
    name: "Sakura Sushi",
    category: "Japonesa",
    secondaryCategory: "Sushi",
    rating: 4.8,
    distance: 2.1,
    deliveryTime: "25–35 min",
    latitude: -3.741,
    longitude: -38.512,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
  },

  {
    id: 5,
    name: "Verde Vida",
    category: "Saudável",
    secondaryCategory: "Vegetariana",
    rating: 4.6,
    distance: 2.4,
    deliveryTime: "20–30 min",
    latitude: -3.728,
    longitude: -38.523,
    image: "https://images.unsplash.com/photo-1543362906-acfc16c67564",
  },
];

export async function getRestaurants(): Promise<Restaurant[]> {
  // Simula uma futura chamada para API.
  return restaurants;
}
