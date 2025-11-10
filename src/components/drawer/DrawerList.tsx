import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from '@mui/icons-material/Description';
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { useNavigate } from "react-router-dom";

interface DrawerProps {
  onLogout: () => void;
}

const drawerWidth = 240;

export default function DrawerList({ onLogout }: DrawerProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const menuItems = [
    { text: "Início", icon: <InboxIcon />, path: "/" },
    { text: "Usuários", icon: <PeopleIcon />, path: "/usuarios" },
    { text: "Tickets", icon: <ConfirmationNumberIcon />, path: "/tickets" },
    { text: "Clientes", icon: <PeopleIcon />, path: "/clientes" },
    { text: "Contratos", icon: <DescriptionIcon />, path: "/contratos" },
    { text: "Ordens de Serviço", icon: <DescriptionIcon />, path: "/ordem_de_servico" },
    { text: "Email", icon: <MailIcon />, path: "/emails" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#1e1e2f", // cor de fundo escura elegante
          color: "#fff",
        },
      }}
    >
      <Box sx={{ overflow: "auto"}}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Sair" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
