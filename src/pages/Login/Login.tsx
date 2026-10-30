import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";
import { AuthLayout } from "../Auth/AuthLayout";
import { login } from "../../services/authService";

export function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Informe um e-mail válido.");
      return;
    }

    try {
      setLoading(true);

      await login({
        email,
        password,
      });

      navigate("/home");
    } catch {
      setError("Não foi possível realizar o login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Bem-vindo de volta!"
      subtitle="Entre na sua conta para descobrir novos lugares para comer."
      footerText="Ainda não possui uma conta?"
      footerLinkTo="/cadastro"
      footerLinkLabel="Criar conta"
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={setEmail}
        />

        <Input
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={setPassword}
        />

        {error && <p className="form-error">{error}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </AuthLayout>
  );
}