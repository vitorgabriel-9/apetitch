import type { Restaurant } from "../types/restaurant";

const API_URL = import.meta.env.VITE_API_URL;

function normalizeRestaurant(
  restaurant: any
): Restaurant {
  return {
    id: String(restaurant._id),

    name: restaurant.name,
    category: restaurant.category,
    secondaryCategory: restaurant.secondaryCategory,

    rating: restaurant.rating ?? 0,
    reviews: restaurant.reviews ?? 0,

    distance: restaurant.distance ?? 0,
    waitTime: restaurant.waitTime ?? "15 min",
    deliveryTime: restaurant.deliveryTime ?? "30–40 min",

    status: restaurant.status ?? "Aberto",

    price: restaurant.price ?? "$$",
    priceRange: restaurant.priceRange ?? "R$ 30–60",

    delivery: restaurant.delivery ?? true,

    latitude: restaurant.latitude,
    longitude: restaurant.longitude,

    image: restaurant.image,

    description:
      restaurant.description ??
      "Um restaurante preparado para oferecer uma ótima experiência.",

    address:
      restaurant.address ??
      "Endereço não informado",

    location: restaurant.location ?? {
      street: "",
      neighborhood: "Não informado",
      city: "Fortaleza",
      state: "CE",
    },

    openingHours:
      restaurant.openingHours ?? [],

    contactChannels:
      restaurant.contactChannels ?? [],

    orderMethods:
      restaurant.orderMethods ?? [],

    menu:
      restaurant.menu ?? [],

    feedbacks:
      restaurant.feedbacks ?? [],
  };
}

export async function getRestaurants(): Promise<Restaurant[]> {
  const response = await fetch(
    `${API_URL}/restaurants`
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao buscar restaurantes."
    );
  }

  const restaurants = await response.json();

  return restaurants.map(normalizeRestaurant);
}

export async function getRestaurantById(
  id: string
): Promise<Restaurant> {
  const response = await fetch(
    `${API_URL}/restaurants/${id}`
  );

  if (!response.ok) {
    throw new Error(
      "Restaurante não encontrado."
    );
  }

  const restaurant = await response.json();

  return normalizeRestaurant(restaurant);
}