import * as React from "react";
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
  Chip,
  MenuItem,
  Typography,
  Tooltip,
  Stack,
  Pagination,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  type Ticket,

} from "../../api/tickets";
import { getCategorias, type Categoria } from "../../api/category";
import TicketComments from "../../components/ticket/TicketComments";
import DrawerList from "../../components/drawer/DrawerList";
import { useAuth } from "../../hooks/useAuth";
import TicketFilters from "../../components/ticket/TicketFilters";

const drawerWidth = 240;

export default function TicketPage() {
  const { logout } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [chamados, setChamados] = useState<Ticket[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null);

  // Paginação
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const ticketsParaExibir = chamados.length > 0 ? chamados : tickets;

  const [form, setForm] = useState<Omit<Ticket, "id">>({
    titulo: "",
    descricao: "",
    status: "aberto",
    prioridade: "media",
    userId: 1,
    tecnicoId: null,
    categoriaId: null,
  });

  const loadTickets = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const data = await getTickets(pageNumber, perPage);
      setTickets(data.data);
      setTotalPages(data.meta.last_page);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets(page);
    getCategorias().then(setCategorias);
  }, [page]);

  const handleOpenModal = (ticket?: Ticket) => {
    if (ticket) {
      setEditingTicket(ticket);
      setForm({
        titulo: ticket.titulo,
        descricao: ticket.descricao,
        status: ticket.status,
        prioridade: ticket.prioridade,
        userId: ticket.userId,
        tecnicoId: ticket.tecnicoId || null,
        categoriaId: ticket.categoriaId || null,
      });
    } else {
      setEditingTicket(null);
      setForm({
        titulo: "",
        descricao: "",
        status: "aberto",
        prioridade: "media",
        userId: 1,
        tecnicoId: null,
        categoriaId: null,
      });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (
      (form.prioridade === "alta" || form.prioridade === "urgente") &&
      !form.categoriaId
    ) {
      alert("Selecione uma categoria para chamados de alta ou urgente prioridade.");
      return;
    }

    if (editingTicket) {
      await updateTicket(editingTicket.id, form);
    } else {
      await createTicket(form);
    }
    setModalOpen(false);
    loadTickets(page);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este chamado?")) {
      await deleteTicket(id);
      loadTickets(page);
    }
  };

  const prioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta":
        return "error";
      case "urgente":
        return "warning";
      case "media":
        return "info";
      default:
        return "success";
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "resolvido":
        return "success"; 
      case "aberto":
        return "info";
      case "em_progresso":
        return "warning";
      case "cancelado":
        return "error";
      default:
        return "default";
    }
  };


  const toggleExpand = (ticketId: number) => {
    setExpandedTicketId((prevId) => (prevId === ticketId ? null : ticketId));
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (loading) return <p>Carregando chamados...</p>;

  return (
    <Box sx={{ display: "" }}>
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
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Ticket's
        </Typography>

        <TicketFilters
          onFiltrar={(res) => {
            setChamados(res.data);           // tickets filtrados
            setTotalPages(res.meta.lastPage); // atualiza paginação
            setPage(1);                        // volta para página 1 do filtro
          }}
        />

        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={() => handleOpenModal()}
        >
          Novo Chamado
        </Button>

        <Table sx={{ mt: 3, borderRadius: 2, overflow: "hidden" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>Título</TableCell>
              <TableCell>Prioridade</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Aberto em</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>

        <TableBody>
          {ticketsParaExibir.map((ticket) => (
            <React.Fragment key={ticket.id}>
              <TableRow
                hover
                onClick={() => toggleExpand(ticket.id)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{ticket.titulo}</TableCell>
                <TableCell>
                  <Chip
                    label={ticket.prioridade.toUpperCase()}
                    color={prioridadeColor(ticket.prioridade)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={ticket.status.replace("_", " ").toUpperCase()}
                    color={statusColor(ticket.status)}
                    variant={ticket.status === "resolvido" ? "filled" : "outlined"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {categorias.find((cat) => cat.id === ticket.categoriaId)?.nome || "-"}
                </TableCell>
                <TableCell>
                  {ticket.createdAt
                    ? new Date(ticket.createdAt).toLocaleDateString("pt-BR")
                    : "-"}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar chamado">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(ticket);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir chamado">
                    <IconButton
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(ticket.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>

              {/* Expansão: descrição + comentários */}
              {expandedTicketId === ticket.id && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box sx={{ p: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Descrição
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, whiteSpace: "pre-line" }}>
                        {ticket.descricao || "-"}
                      </Typography>

                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Comentários
                      </Typography>
                      <TicketComments chamadoId={ticket.id} userId={ticket.userId} />
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
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
        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {editingTicket ? "Editar Chamado" : "Novo Chamado"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Título"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                fullWidth
              />
              <TextField
                label="Descrição"
                multiline
                rows={4}
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                fullWidth
              />
              <TextField
                select
                label="Prioridade"
                value={form.prioridade}
                onChange={(e) =>
                  setForm({
                    ...form,
                    prioridade: e.target.value as Ticket["prioridade"],
                  })
                }
                fullWidth
              >
                <MenuItem value="baixa">Baixa</MenuItem>
                <MenuItem value="media">Média</MenuItem>
                <MenuItem value="alta">Alta</MenuItem>
                <MenuItem value="urgente">Urgente</MenuItem>
              </TextField>

              <TextField
                select
                label="Categoria"
                value={form.categoriaId ?? ""}
                onChange={(e) =>
                  setForm({ ...form, categoriaId: Number(e.target.value) })
                }
                fullWidth
                required={form.prioridade === "alta" || form.prioridade === "urgente"}
              >
                <MenuItem value="">Nenhuma</MenuItem>
                {categorias.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.nome}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
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
