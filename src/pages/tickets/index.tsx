// src/pages/ticket/index.tsx
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
import TicketComments from "../../components/ticket/TicketComments";

export default function TicketPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null); // Controle de expansão
  const [form, setForm] = useState<Omit<Ticket, "id">>({
    titulo: "",
    descricao: "",
    status: "aberto",
    prioridade: "media",
    userId: 1,
    tecnicoId: null,
    categoriaId: null,
  });

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await getTickets();
      setTickets(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

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
    if (editingTicket) {
      await updateTicket(editingTicket.id, form);
    } else {
      await createTicket(form);
    }
    setModalOpen(false);
    loadTickets();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este chamado?")) {
      await deleteTicket(id);
      loadTickets();
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

  if (loading) return <p>Carregando chamados...</p>;

  // Alterna expansão de apenas um ticket por vez
  const toggleExpand = (ticketId: number) => {
    setExpandedTicketId((prevId) => (prevId === ticketId ? null : ticketId));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Ticket's
      </Typography>

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
            <TableCell>Aberto em</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
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
                    variant="outlined"
                    size="small"
                  />
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
                        e.stopPropagation(); // Impede expandir ao clicar no botão
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

              {/* Linha de comentários - apenas o ticket expandido */}
              {expandedTicketId === ticket.id && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <TicketComments chamadoId={ticket.id} userId={ticket.userId} />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

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
                setForm({ ...form, prioridade: e.target.value as Ticket["prioridade"] })
              }
              fullWidth
            >
              <MenuItem value="baixa">Baixa</MenuItem>
              <MenuItem value="media">Média</MenuItem>
              <MenuItem value="alta">Alta</MenuItem>
              <MenuItem value="urgente">Urgente</MenuItem>
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
  );
}
