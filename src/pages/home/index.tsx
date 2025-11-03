import { useAuth } from "../../hooks/useAuth";
import DrawerList from "../../components/drawer/DrawerList";
import Box from "@mui/material/Box";
import Dashboard from "../dashboard";

const drawerWidth = 100;

export default function Home() {
  const { user, logout, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;
  if (!user) return null;

  return (
    <Box sx={{ display: "" }}>
      {/* Drawer fixo */}
      <DrawerList onLogout={logout} />

      {/* Conteúdo principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f5f6fa",
          p: 3,
          marginLeft: `${drawerWidth}px`,
          minHeight: "100vh",
        }}
      >
        <Dashboard />
      </Box>
    </Box>
  );
}
