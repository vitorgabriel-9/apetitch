import type { LoginData, RegisterData, User } from "../types/auth";
import { saveCurrentUser } from "./appState";

const fakeUser: User = {
  id: "1",
  name: "Usuário Apetitch",
  email: "usuario@email.com",
};

export async function login(data: LoginData): Promise<User> {
  // Simula uma requisição para uma API
  await new Promise((resolve) => setTimeout(resolve, 800));

  const user = { ...fakeUser, email: data.email };
  saveCurrentUser(user);
  return user;
}

export async function register(data: RegisterData): Promise<User> {
  // Simula uma requisição para uma API
  await new Promise((resolve) => setTimeout(resolve, 800));

  const user = {
    id: "2",
    name: data.name,
    email: data.email,
  };

  saveCurrentUser(user);
  return user;
}
