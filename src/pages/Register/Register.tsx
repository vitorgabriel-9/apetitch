import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";
import { AuthLayout } from "../Auth/AuthLayout";
import { register } from "../../services/authService";

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

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Informe um e-mail válido.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);

      await register({
        name,
        email,
        password,
        confirmPassword,
      });

      navigate("/home");
    } catch {
      setError("Não foi possível criar sua conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Faça parte do apetitch e descubra novos restaurantes."
      footerText="Já possui uma conta?"
      footerLinkTo="/login"
      footerLinkLabel="Entrar"
    >
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
    </AuthLayout>
  );
}