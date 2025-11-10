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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DrawerList from "../../components/drawer/DrawerList";
import { useAuth } from "../../hooks/useAuth";
import {
  getOrdensDeServico,
  createOrdemDeServico,
  updateOrdemDeServico,
  deleteOrdemDeServico,
  gerarPdfOrdemDeServico,
  type OrdemDeServico,
} from "../../api/service_order";
import { getClients, type Client } from "../../api/client";
import { getUsers, type User } from "../../api/users";
import { getTickets, type Ticket } from "../../api/tickets";
import ServiceFilters from "../../components/service_orders/ServiceFilters";

const drawerWidth = 240;

export default function ServiceOrdersPage() {
  const { logout } = useAuth();

  const [orders, setOrders] = useState<OrdemDeServico[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrdemDeServico[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [tecnicos, setTecnicos] = useState<User[]>([]);
  const [chamados, setChamados] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrdemDeServico | null>(null);

  // Paginação
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const ordersToDisplay = filteredOrders.length > 0 ? filteredOrders : orders;

  // ✅ Formulário compatível com backend
  const [form, setForm] = useState({
    chamadoId: null as number | null,
    clienteId: 0,
    tecnicoId: null as number | null,
    descricaoProblema: "",
    descricaoSolucao: "",
    tipoAtendimento: "presencial" as "presencial" | "remoto",
    status: "aberta" as "aberta" | "em_andamento" | "finalizada" | "cancelada",
    tempoGastoHoras: 0,
    valorServico: 0,
    materiaisUtilizados: "",
    observacoesTecnico: "",
  });

  // 🔹 Carregar OS
  const loadOrders = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const data = await getOrdensDeServico(pageNumber, perPage);
      setOrders(data.data);
      setTotalPages(data.meta.last_page || 1);
    } catch (err) {
      console.error("Erro ao carregar ordens de serviço:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Carregar clientes / técnicos / chamados
  const loadClients = async () => {
    try {
      const data = await getClients(1, 1000);
      setClients(data.data);
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
    }
  };

    const loadTecnicos = async () => {
    try {
        const data = await getUsers(1, 1000); // exemplo: página 1, 1000 resultados
        const apenasTecnicos = data.data.filter((u: any) => u.tipo === "tecnico");
        setTecnicos(apenasTecnicos);
    } catch (err) {
        console.error("Erro ao carregar técnicos:", err);
    }
    };


  const loadChamados = async () => {
    try {
      const data = await getTickets(1, 1000);
      setChamados(data.data);
    } catch (err) {
      console.error("Erro ao carregar chamados:", err);
    }
  };

  useEffect(() => {
    loadOrders(page);
    loadClients();
    loadTecnicos();
    loadChamados();
  }, [page]);

  // 🔹 Abrir modal
  const handleOpenModal = (order?: OrdemDeServico) => {
    if (order) {
      setEditingOrder(order);
      setForm({
        chamadoId: order.chamadoId || null,
        clienteId: order.clienteId,
        tecnicoId: order.tecnicoId || null,
        descricaoProblema: order.descricaoProblema || "",
        descricaoSolucao: order.descricaoSolucao || "",
        tipoAtendimento: order.tipoAtendimento || "presencial",
        status: order.status || "aberta",
        tempoGastoHoras: Number(order.tempoGastoHoras) || 0,
        valorServico: Number(order.valorServico) || 0,
        materiaisUtilizados: order.materiaisUtilizados || "",
        observacoesTecnico: order.observacoesTecnico || "",
      });
    } else {
      setEditingOrder(null);
      setForm({
        chamadoId: null,
        clienteId: 0,
        tecnicoId: null,
        descricaoProblema: "",
        descricaoSolucao: "",
        tipoAtendimento: "presencial",
        status: "aberta",
        tempoGastoHoras: 0,
        valorServico: 0,
        materiaisUtilizados: "",
        observacoesTecnico: "",
      });
    }
    setModalOpen(true);
  };

  // 🔹 Salvar OS
  const handleSave = async () => {
    try {
      if (form.clienteId === 0 || !form.descricaoProblema.trim()) {
        alert("Selecione o cliente e preencha a descrição do problema.");
        return;
      }

      if (editingOrder) {
        await updateOrdemDeServico(editingOrder.id, form);
      } else {
        await createOrdemDeServico(form);
      }
      setModalOpen(false);
      loadOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao salvar ordem de serviço.");
    }
  };

  // 🔹 Deletar OS
  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta ordem de serviço?")) {
      try {
        await deleteOrdemDeServico(id);
        loadOrders();
      } catch {
        alert("Erro ao excluir a ordem de serviço.");
      }
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );

    // 🔹 Função utilitária: define cor conforme status
    const getRowColorByStatus = (status: string) => {
    const colors: Record<string, string> = {
        aberta: "#fff8e1",
        em_andamento: "#e3f2fd",
        finalizada: "#e8f5e9",
        cancelada: "#ffebee",
    };
    return colors[status] || "inherit";
    };

    // 🔹 Componente para exibir o status com um Chip colorido
    const StatusChip = ({ status }: { status: string }) => {
    const colorMap: Record<string, "default" | "info" | "success" | "error" | "warning"> = {
        aberta: "warning",
        em_andamento: "info",
        finalizada: "success",
        cancelada: "error",
    };

    const labelMap: Record<string, string> = {
        aberta: "Aberta",
        em_andamento: "Em andamento",
        finalizada: "Finalizada",
        cancelada: "Cancelada",
    };

    return <Chip label={labelMap[status] || "—"} color={colorMap[status]} size="small" />;
    };

  return (
    <Box sx={{ display: "flex" }}>
      <DrawerList onLogout={logout} />

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
          🧾 Ordens de Serviço
        </Typography>

        {/* 🔹 Filtros */}
        <ServiceFilters
          onFiltrar={(res) => {
            setFilteredOrders(res.data);
            setTotalPages(res.meta.lastPage || 1);
            setPage(1);
          }}
        />

        {/* 🔹 Nova Ordem */}
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={() => handleOpenModal()}
          sx={{ mb: 2 }}
        >
          Nova O.S
        </Button>

        {/* 🔹 Tabela */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Chamado</TableCell>
              <TableCell>Técnico</TableCell>
              <TableCell>Descrição do Problema</TableCell>
              <TableCell>Tipo Atendimento</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>PDF</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
        <TableBody>
            {ordersToDisplay.length > 0 ? (
                ordersToDisplay.map((order) => (
                <TableRow
                    key={order.id}
                    sx={{ backgroundColor: getRowColorByStatus(order.status || "") }}
                >
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.cliente?.nome || "—"}</TableCell>
                    <TableCell>{order.chamado ? `#${order.chamado.id}` : "—"}</TableCell>
                    <TableCell>{order.tecnico?.fullName || "—"}</TableCell>
                    <TableCell>{order.descricaoProblema}</TableCell>
                    <TableCell>{order.tipoAtendimento}</TableCell>
                    <TableCell>
                    <StatusChip status={order.status || ""} />
                    </TableCell>
                    <TableCell>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={async () => {
                        const pdfBlob = await gerarPdfOrdemDeServico(order.id);
                        const url = URL.createObjectURL(pdfBlob);
                        window.open(url, "_blank");
                        }}
                    >
                        📄 Abrir
                    </Button>
                    </TableCell>
                    <TableCell>
                    <IconButton onClick={() => handleOpenModal(order)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(order.id)} color="error">
                        <DeleteIcon />
                    </IconButton>
                    </TableCell>
                </TableRow>
                ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={9} align="center">
                        Nenhuma ordem de serviço encontrada.
                    </TableCell>
                    </TableRow>
                )}
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
          />
        </Box>

        {/* 🔹 Modal de Criação / Edição */}
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingOrder ? "Editar Ordem de Serviço" : "Nova Ordem de Serviço"}
          </DialogTitle>
          <DialogContent>
            {/* Cliente */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="select-cliente-label">Cliente</InputLabel>
              <Select
                labelId="select-cliente-label"
                value={form.clienteId}
                label="Cliente"
                onChange={(e) =>
                  setForm({ ...form, clienteId: Number(e.target.value) })
                }
              >
                <MenuItem value={0}>Selecione um cliente</MenuItem>
                {clients.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Chamado */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="select-chamado-label">Chamado</InputLabel>
              <Select
                labelId="select-chamado-label"
                value={form.chamadoId || ""}
                label="Chamado"
                onChange={(e) =>
                  setForm({ ...form, chamadoId: Number(e.target.value) })
                }
              >
                <MenuItem value="">Selecione um chamado</MenuItem>
                {chamados.map((ch) => (
                  <MenuItem key={ch.id} value={ch.id}>
                    #{ch.id} - {ch.titulo || "Sem título"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Técnico */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="select-tecnico-label">Técnico Responsável</InputLabel>
              <Select
                labelId="select-tecnico-label"
                value={form.tecnicoId || ""}
                label="Técnico Responsável"
                onChange={(e) =>
                  setForm({ ...form, tecnicoId: Number(e.target.value) })
                }
              >
                <MenuItem value="">Selecione o técnico</MenuItem>
                {tecnicos.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.fullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Descrição do Problema"
              value={form.descricaoProblema}
              onChange={(e) =>
                setForm({ ...form, descricaoProblema: e.target.value })
              }
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />

            <TextField
              label="Descrição da Solução"
              value={form.descricaoSolucao}
              onChange={(e) =>
                setForm({ ...form, descricaoSolucao: e.target.value })
              }
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="select-tipo-label">Tipo de Atendimento</InputLabel>
              <Select
                labelId="select-tipo-label"
                value={form.tipoAtendimento}
                label="Tipo de Atendimento"
                onChange={(e) =>
                  setForm({
                    ...form,
                    tipoAtendimento: e.target.value as "presencial" | "remoto",
                  })
                }
              >
                <MenuItem value="presencial">Presencial</MenuItem>
                <MenuItem value="remoto">Remoto</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Tempo Gasto (horas)"
              type="number"
              value={form.tempoGastoHoras}
              onChange={(e) =>
                setForm({ ...form, tempoGastoHoras: Number(e.target.value) })
              }
              fullWidth
              margin="normal"
            />

            <TextField
              label="Valor do Serviço (R$)"
              type="number"
              value={form.valorServico}
              onChange={(e) =>
                setForm({ ...form, valorServico: Number(e.target.value) })
              }
              fullWidth
              margin="normal"
            />

            <TextField
              label="Materiais Utilizados"
              value={form.materiaisUtilizados}
              onChange={(e) =>
                setForm({ ...form, materiaisUtilizados: e.target.value })
              }
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />

            <TextField
              label="Observações do Técnico"
              value={form.observacoesTecnico}
              onChange={(e) =>
                setForm({ ...form, observacoesTecnico: e.target.value })
              }
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="select-status-label">Status</InputLabel>
              <Select
                labelId="select-status-label"
                value={form.status}
                label="Status"
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as
                      | "aberta"
                      | "em_andamento"
                      | "finalizada"
                      | "cancelada",
                  })
                }
              >
                <MenuItem value="aberta">Aberta</MenuItem>
                <MenuItem value="em_andamento">Em Andamento</MenuItem>
                <MenuItem value="finalizada">Finalizada</MenuItem>
                <MenuItem value="cancelada">Cancelada</MenuItem>
              </Select>
            </FormControl>
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
