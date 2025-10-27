import { useAuth } from "../../hooks/useAuth";
import DrawerList from "../../components/drawer/DrawerList";

export default function Home() {
  const { user, logout, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;
  if (!user) return null;

  return (
    <div style={{ padding: 20 }}>
      <h1>🏠 Ticket's</h1>
      <p>Bem-vindo, {user.fullName}!</p>

      <DrawerList onLogout={logout} />
    </div>
  );
}
