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
  Typography,
  Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DrawerList from "../../components/drawer/DrawerList";
import { useAuth } from "../../hooks/useAuth";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
  type Client,
  type Address,
} from "../../api/client";
import { createAddress } from "../../api/address";
import axiosInstance from "../../utils/axiosInstance";
import ClienteFilters from "../../components/client/ClientFilters";

const drawerWidth = 240;

export default function ClientsPage() {
  const { logout } = useAuth();

  // Estados principais
  const [clients, setClients] = useState<Client[]>([]);
  const [clientesFiltrados, setClientesFiltrados] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

    // Paginação
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const clientesParaExibir = (clientesFiltrados?.length ?? 0) > 0 ? clientesFiltrados : clients || [];



  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  });

  // Carrega clientes da API
  const loadClients = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const data = await getClients(pageNumber, perPage);
      setClients(data.data);
      setTotalPages(data.meta?.last_page || 1);
    } finally {
      setLoading(false);
    }
  };


   useEffect(() => {
    loadClients(page);
  }, [page]);

const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const cepDigitado = e.target.value.replace(/\D/g, '');
  setForm(prev => ({ ...prev, cep: cepDigitado }));

  console.log('Digitei no CEP:', e.target.value);
  console.log('Apenas números:', cepDigitado);
  console.log('Comprimento:', cepDigitado.length);

  if (cepDigitado.length === 8) {
    console.log('Vai chamar a API do CEP...');
    try {
      const res = await axiosInstance.get(`/enderecos/cep?cep=${cepDigitado}`);
      const data = res.data;
      console.log('Dados retornados do CEP:', data);

      setForm(prev => ({
        ...prev,
        rua: data.rua || '',
        bairro: data.bairro || '',
        cidade: data.cidade || '',
        estado: data.estado || '',
      }));
    } catch (err: any) {
      console.error('Erro ao buscar CEP:', err.response?.data || err.message);
    }
  }
};




  // Abrir modal (novo ou edição)
  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      const firstAddress: Address | undefined = client.enderecos?.[0];
      setForm({
        nome: client.nome,
        email: client.email,
        telefone: client.telefone || "",
        rua: firstAddress?.rua || "",
        numero: firstAddress?.numero || "",
        bairro: firstAddress?.bairro || "",
        cidade: firstAddress?.cidade || "",
        estado: firstAddress?.estado || "",
        cep: firstAddress?.cep || "",
      });
    } else {
      setEditingClient(null);
      setForm({
        nome: "",
        email: "",
        telefone: "",
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
      });
    }
    setModalOpen(true);
  };

  // Salvar cliente
  const handleSave = async () => {
    try {
      let client: Client;

      if (editingClient) {
        client = await updateClient(editingClient.id, {
          nome: form.nome,
          email: form.email,
          telefone: form.telefone,
        });
      } else {
        client = await createClient({
          nome: form.nome,
          email: form.email,
          telefone: form.telefone,
        });
      }

      // Cria endereço se tiver rua, cidade e estado
      if (form.rua && form.cidade && form.estado) {
        await createAddress({
          rua: form.rua,
          numero: form.numero,
          bairro: form.bairro,
          cidade: form.cidade,
          estado: form.estado,
          cep: form.cep,
          cliente_id: client.id,
        });
      }

      setModalOpen(false);
      loadClients();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao salvar cliente");
    }
  };

  // Deletar cliente
  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      await deleteClient(id);
      loadClients();
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <Box sx={{ display: "" }}>
      {/* Drawer lateral */}
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
        <Typography variant="h5" gutterBottom>
          👤 Lista de Clientes
        </Typography>

         {/* 🔎 Filtros */}
       <ClienteFilters
          onFiltrar={(res) => {
            setClientesFiltrados(res.data);
            setTotalPages(res.meta.lastPage || 1);
            setPage(1);
          }}
        />


        <Button
        variant="contained"
        startIcon={<AddCircleIcon />}
        onClick={() => handleOpenModal()}
        >
        Novo Cliente
        </Button>

        {/* Tabela */}
        <Table sx={{ marginTop: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Endereço</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
             {(clientesParaExibir || []).map((client) => {
              const firstAddress: Address | undefined = client.enderecos?.[0];
              return (
                <TableRow key={client.id}>
                  <TableCell>{client.nome}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.telefone}</TableCell>
                  <TableCell>
                    {firstAddress
                      ? `${firstAddress.rua}, ${firstAddress.numero} - ${firstAddress.cidade}/${firstAddress.estado}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenModal(client)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(client.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* 🔹 Paginação */}
        <Box display="flex" justifyContent="flex-start" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            sx={{ ml: 0 }} // garante que fique colado no canto
          />
        </Box>

        {/* Modal de criação/edição */}
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingClient ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
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
              label="Telefone"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              fullWidth
              margin="normal"
            />

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Endereço
            </Typography>

            <TextField
              label="Rua"
              value={form.rua}
              onChange={(e) => setForm({ ...form, rua: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Número"
              value={form.numero}
              onChange={(e) => setForm({ ...form, numero: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Bairro"
              value={form.bairro}
              onChange={(e) => setForm({ ...form, bairro: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Cidade"
              value={form.cidade}
              onChange={(e) => setForm({ ...form, cidade: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Estado"
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="CEP"
              value={form.cep}
              fullWidth
              margin="normal"
              // inputProps={{ maxLength: 8 }} // comente enquanto testa
              onChange={handleCepChange}
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
