import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";
import { register } from "../../services/authService";

import "./Register.css";

export function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);

      const user = await register({
        name,
        email,
        password,
        confirmPassword,
      });

      console.log("Usuário criado:", user);

      navigate("/home");
    } catch {
      setError("Não foi possível criar sua conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-header">
          <div className="logo">apetitch</div>

          <h1>Crie sua conta</h1>

          <p>
            Faça parte do apetitch e descubra novos restaurantes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Nome"
            placeholder="Seu nome"
            value={name}
            onChange={setName}
          />

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
            placeholder="Crie uma senha"
            value={password}
            onChange={setPassword}
          />

          <Input
            label="Confirmar senha"
            type="password"
            placeholder="Digite a senha novamente"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />

          {error && <p className="form-error">{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>

        <div className="auth-footer">
          <span>Já possui uma conta?</span>

          <Link to="/login">
            Entrar
          </Link>
        </div>
      </section>
    </main>
  );
}