const CART_KEY_PREFIX = "apetitch:cart:";

export function getRestaurantCart(restaurantId: string): Record<number, number> {
  try {
    const savedCart = window.localStorage.getItem(`${CART_KEY_PREFIX}${restaurantId}`);
    return savedCart ? (JSON.parse(savedCart) as Record<number, number>) : {};
  } catch {
    return {};
  }
}

export function saveRestaurantCart(
  restaurantId: string,
  cart: Record<number, number>
): void {
  window.localStorage.setItem(
    `${CART_KEY_PREFIX}${restaurantId}`,
    JSON.stringify(cart)
  );
}

export function clearRestaurantCart(restaurantId: string): void {
  window.localStorage.removeItem(`${CART_KEY_PREFIX}${restaurantId}`);
}
