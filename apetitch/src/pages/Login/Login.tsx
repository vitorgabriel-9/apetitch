import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";
import { login } from "../../services/authService";

import "./Login.css";

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

    try {
      setLoading(true);

      const user = await login({
        email,
        password,
      });

      console.log("Usuário autenticado:", user);

      navigate("/home");
    } catch {
      setError("Não foi possível realizar o login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-header">
          <div className="logo">apetitch</div>

          <h1>Bem-vindo de volta!</h1>

          <p>
            Entre na sua conta para descobrir novos lugares para comer.
          </p>
        </div>

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

        <div className="auth-footer">
          <span>Ainda não possui uma conta?</span>

          <Link to="/cadastro">
            Criar conta
          </Link>
        </div>
      </section>
    </main>
  );
}