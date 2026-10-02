import type { User } from "../types/auth";

const USER_KEY = "apetitch:user";
const FAVORITES_KEY = "apetitch:favorites";
const FEEDBACKS_KEY = "apetitch:feedbacks";
const ADDRESSES_KEY = "apetitch:addresses";
const PREFERENCES_KEY = "apetitch:preferences";

export type StoredFeedback = {
  author: string;
  rating: number;
  date: string;
  comment: string;
};

export type ProfileAddress = {
  id: string;
  label: string;
  address: string;
  reference?: string;
};

export type ProfilePreferences = {
  notificationsEnabled: boolean;
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getCurrentUser(): User | null {
  return readJson<User | null>(USER_KEY, null);
}

export function saveCurrentUser(user: User): void {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearCurrentUser(): void {
  window.localStorage.removeItem(USER_KEY);
}

export function getFavoriteRestaurantIds(): number[] {
  return readJson<number[]>(FAVORITES_KEY, []);
}

export function saveFavoriteRestaurantIds(ids: number[]): void {
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export function getRestaurantFeedbacks(restaurantId: string): StoredFeedback[] {
  const feedbacks = readJson<Record<string, StoredFeedback[]>>(FEEDBACKS_KEY, {});
  return feedbacks[restaurantId] ?? [];
}

export function saveRestaurantFeedback(
  restaurantId: string,
  feedback: StoredFeedback
): void {
  const feedbacks = readJson<Record<string, StoredFeedback[]>>(FEEDBACKS_KEY, {});
  const restaurantFeedbacks = feedbacks[restaurantId] ?? [];

  window.localStorage.setItem(
    FEEDBACKS_KEY,
    JSON.stringify({
      ...feedbacks,
      [restaurantId]: [feedback, ...restaurantFeedbacks],
    })
  );
}

export function getAllRestaurantFeedbacks(): Record<string, StoredFeedback[]> {
  return readJson<Record<string, StoredFeedback[]>>(FEEDBACKS_KEY, {});
}

export function removeRestaurantFeedback(
  restaurantId: string,
  feedbackIndex: number
): void {
  const feedbacks = getAllRestaurantFeedbacks();
  const restaurantFeedbacks = feedbacks[restaurantId] ?? [];
  const remainingFeedbacks = restaurantFeedbacks.filter(
    (_, index) => index !== feedbackIndex
  );

  if (remainingFeedbacks.length) {
    window.localStorage.setItem(
      FEEDBACKS_KEY,
      JSON.stringify({ ...feedbacks, [restaurantId]: remainingFeedbacks })
    );
    return;
  }

  const remainingRestaurants = Object.fromEntries(
    Object.entries(feedbacks).filter(([id]) => id !== restaurantId)
  );
  window.localStorage.setItem(FEEDBACKS_KEY, JSON.stringify(remainingRestaurants));
}

export function getProfileAddresses(): ProfileAddress[] {
  return readJson<ProfileAddress[]>(ADDRESSES_KEY, []);
}

export function saveProfileAddresses(addresses: ProfileAddress[]): void {
  window.localStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
}

export function getProfilePreferences(): ProfilePreferences {
  return readJson<ProfilePreferences>(PREFERENCES_KEY, {
    notificationsEnabled: true,
  });
}

export function saveProfilePreferences(preferences: ProfilePreferences): void {
  window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
}
