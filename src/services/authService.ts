import type { LoginData, RegisterData, User } from "../types/auth";
import { saveCurrentUser } from "./appState";

const API_URL = import.meta.env.VITE_API_URL;

interface AuthResponse {
  token: string;
  user: User;
}

export async function login(data: LoginData): Promise<User> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Não foi possível realizar o login.");
  }

  const authData = result as AuthResponse;

  localStorage.setItem("apetitch:token", authData.token);
  saveCurrentUser(authData.user);

  return authData.user;
}

export async function register(data: RegisterData): Promise<User> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Não foi possível criar sua conta.");
  }

  const authData = result as AuthResponse;

  localStorage.setItem("apetitch:token", authData.token);
  saveCurrentUser(authData.user);

  return authData.user;
}

export function logout(): void {
  localStorage.removeItem("apetitch:token");
  localStorage.removeItem("apetitch:user");
}

export function getToken(): string | null {
  return localStorage.getItem("apetitch:token");
}