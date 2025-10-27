// src/routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface GuestRouteProps {
  children: JSX.Element;
}

// Rota para páginas que **não podem ser acessadas por usuários logados**, tipo Login/Cadastro
export function GuestRoute({ children }: GuestRouteProps) {
  const { user, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;

  if (user) return <Navigate to="/" replace />; // já está logado → redireciona para Home

  return children;
}

interface PrivateRouteProps {
  children: JSX.Element;
}

// Rota para páginas que **só podem ser acessadas por usuários logados**, tipo Home
export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;

  if (!user) return <Navigate to="/login" replace />; // não logado → redireciona para login

  return children;
}
