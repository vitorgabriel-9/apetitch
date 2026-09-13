import type { LoginData, RegisterData, User } from "../types/auth";

const fakeUser: User = {
  id: "1",
  name: "Usuário Apetitch",
  email: "usuario@email.com",
};

export async function login(data: LoginData): Promise<User> {
  console.log("Login:", data);

  // Simula uma requisição para uma API
  await new Promise((resolve) => setTimeout(resolve, 800));

  return fakeUser;
}

export async function register(data: RegisterData): Promise<User> {
  console.log("Cadastro:", data);

  // Simula uma requisição para uma API
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    id: "2",
    name: data.name,
    email: data.email,
  };
}