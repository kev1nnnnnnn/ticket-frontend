import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import PeopleIcon from '@mui/icons-material/People'; 
import ConfirmationNumberIcon from '@mui/icons-material/People'; 
import { useNavigate } from 'react-router-dom';

interface DrawerProps {
  onLogout: () => void;
}

export default function DrawerList({ onLogout }: DrawerProps) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

  const handleLogout = () => {
    onLogout();       
    navigate('/login');
  };

  // Itens de navegação
  const menuItems = [
    { text: 'Início', icon: <InboxIcon />, path: '/' },
    { text: 'Usuários', icon: <PeopleIcon />, path: '/users' },
    { text: 'Tickets', icon: <ConfirmationNumberIcon />, path: '/tickets' }, 
    { text: 'Inbox', icon: <MailIcon />, path: '/inbox' }, 
  ];

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>Menu</Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider />

          <List>
            {/* Botão de logout */}
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary="Sair" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </div>
  );
}
