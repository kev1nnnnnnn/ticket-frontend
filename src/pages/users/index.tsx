import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../api/users";
import type { User } from "../../api/users";
import DrawerList from "../../components/drawer/DrawerList";
import { useAuth } from "../../hooks/useAuth";

const drawerWidth = 240;

export default function UsersPage() {
  const { logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    tipo: "usuario" as "usuario" | "tecnico",
  });

  // Carrega usuários da API
  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setForm({
        fullName: user.fullName,
        email: user.email,
        password: "",
        tipo: user.tipo,
      });
    } else {
      setEditingUser(null);
      setForm({ fullName: "", email: "", password: "", tipo: "usuario" });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload: Partial<User> = {
        fullName: form.fullName,
        email: form.email,
        tipo: form.tipo,
      };
      if (form.password) payload.password = form.password;

      if (editingUser) {
        await updateUser(editingUser.id, payload);
      } else {
        if (!form.password) {
          alert("Senha é obrigatória!");
          return;
        }
        await createUser({ ...form });
      }

      setModalOpen(false);
      loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao salvar usuário");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir?")) {
      await deleteUser(id);
      loadUsers();
    }
  };

  if (loading) return <p>Carregando...</p>;

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
        <h1>👥 Lista de Usuários</h1>

        <Button variant="contained" onClick={() => handleOpenModal()}>
          Novo Usuário
        </Button>

        <Table sx={{ marginTop: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.tipo === "tecnico" ? "Técnico" : "Usuário"}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenModal(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Modal de criar/editar */}
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
          <DialogTitle>
            {editingUser ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Nome"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label="Tipo"
              value={form.tipo}
              onChange={(e) =>
                setForm({
                  ...form,
                  tipo: e.target.value as "usuario" | "tecnico",
                })
              }
              fullWidth
              margin="normal"
            >
              <MenuItem value="usuario">Usuário</MenuItem>
              <MenuItem value="tecnico">Técnico</MenuItem>
            </TextField>
            <TextField
              label="Senha"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              fullWidth
              margin="normal"
              helperText={
                editingUser ? "Preencha apenas se quiser alterar a senha" : ""
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleSave}>
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
