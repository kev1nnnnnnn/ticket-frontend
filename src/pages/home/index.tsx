import * as React from "react";
import { useAuth } from "../../hooks/useAuth";

export default function Home() {
  const { user, logout, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;
  if (!user) return null; // usuário deslogado

  return (
    <div style={{ padding: 20 }}>
      <h1>🏠 Página Home</h1>
      <p>Bem-vindo, {user.fullName}!</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
