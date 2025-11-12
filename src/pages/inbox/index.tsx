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
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DrawerList from "../../components/drawer/DrawerList";
import { useAuth } from "../../hooks/useAuth";
import {
  sendEmail,
  getEmailLogs,
  deleteEmailLog,
  type EmailPayload,
  type EmailLog,
  sendMassEmail, // 🔹 nova função importada
} from "../../api/email";

const drawerWidth = 240;

export default function EmailPage() {
  const { logout } = useAuth();

  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [massModalOpen, setMassModalOpen] = useState(false); // 🔹 novo modal
  const [massList, setMassList] = useState<string>(""); // 🔹 e-mails em massa
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [form, setForm] = useState<EmailPayload>({
    to: "",
    subject: "",
    message: "",
  });

  // 🔹 Carregar logs
  const loadLogs = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const data = await getEmailLogs(pageNumber);
      setLogs(data.data);
      if (data.meta?.total && data.meta?.per_page) {
        setTotalPages(Math.ceil(data.meta.total / data.meta.per_page));
      }
    } catch (err) {
      console.error("Erro ao carregar logs:", err);
      setErrorMessage("Erro ao carregar histórico de e-mails");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs(page);
  }, [page]);

  // 🔹 Atualizar formulário
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Envio individual
  const handleSendEmail = async () => {
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await sendEmail(form);
      setSuccessMessage("📨 E-mail enviado com sucesso!");
      setForm({ to: "", subject: "", message: "" });
      setModalOpen(false);
      loadLogs();
    } catch (err: any) {
      console.error("Erro ao enviar:", err);
      setErrorMessage(err.response?.data?.message || "Erro ao enviar e-mail");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Envio em massa
  const handleSendMassEmail = async () => {
    if (!massList.trim()) {
      setErrorMessage("Insira pelo menos um e-mail para envio em massa");
      return;
    }

    const destinatarios = massList
      .split(/[\n,;]/)
      .map((email) => email.trim())
      .filter((email) => email);

    if (destinatarios.length === 0) {
      setErrorMessage("Nenhum e-mail válido encontrado.");
      return;
    }

    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const payloads: EmailPayload[] = destinatarios.map((to) => ({
        to,
        subject: form.subject,
        message: form.message,
      }));

      await sendMassEmail(payloads);

      setSuccessMessage(`✅ ${destinatarios.length} e-mails enviados com sucesso!`);
      setMassList("");
      setMassModalOpen(false);
      loadLogs();
    } catch (err) {
      console.error("Erro envio em massa:", err);
      setErrorMessage("Falha ao enviar e-mails em massa");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Excluir log
  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este log?")) return;
    try {
      await deleteEmailLog(id);
      loadLogs();
    } catch (err) {
      alert("Erro ao excluir log.");
    }
  };

  // 🔹 Paginação
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );

  // 🔹 Status Chip
  const StatusChip = ({ status }: { status: string }) => {
    const colorMap: Record<string, "success" | "error"> = {
      enviado: "success",
      falhou: "error",
    };
    return <Chip label={status.toUpperCase()} color={colorMap[status]} size="small" />;
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
          ✉️ Envio e Histórico de E-mails
        </Typography>

        {/* Alertas */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {/* Botões de ação */}
        <Box display="flex" gap={2} mb={2}>
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={() => setModalOpen(true)}
          >
            Novo E-mail
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            startIcon={<SendIcon />}
            onClick={() => setMassModalOpen(true)}
          >
            Envio em Massa
          </Button>
        </Box>

        {/* Tabela de Logs */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Destinatário</TableCell>
              <TableCell>Assunto</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Data de Envio</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.id}</TableCell>
                  <TableCell>{log.destinatario}</TableCell>
                  <TableCell>{log.assunto}</TableCell>
                  <TableCell>
                    <StatusChip status={log.status} />
                  </TableCell>
                  <TableCell>
                    {new Date(log.data_envio).toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDelete(log.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhum e-mail enviado ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Paginação */}
        <Box display="flex" justifyContent="flex-start" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>

        {/* Modal de Envio Individual */}
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Enviar Novo E-mail</DialogTitle>
          <DialogContent>
            <TextField
              label="Destinatário"
              name="to"
              type="email"
              value={form.to}
              onChange={handleChange}
              fullWidth
              margin="normal"
              placeholder="exemplo@dominio.com"
            />

            <TextField
              label="Assunto"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              fullWidth
              margin="normal"
              placeholder="Assunto do e-mail"
            />

            <TextField
              label="Mensagem"
              name="message"
              value={form.message}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={6}
              placeholder="Digite sua mensagem aqui..."
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={handleSendEmail}
              disabled={loading || !form.to || !form.subject || !form.message}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Enviar"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal de Envio em Massa */}
        <Dialog open={massModalOpen} onClose={() => setMassModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Envio em Massa</DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 2 }}>
              Digite um e-mail por linha ou separados por vírgula.
            </Alert>

            <TextField
              label="Destinatários"
              multiline
              rows={6}
              value={massList}
              onChange={(e) => setMassList(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="exemplo1@dominio.com, exemplo2@dominio.com"
            />

            <TextField
              label="Assunto"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              fullWidth
              margin="normal"
              placeholder="Assunto do e-mail"
            />

            <TextField
              label="Mensagem"
              name="message"
              value={form.message}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={6}
              placeholder="Digite sua mensagem..."
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setMassModalOpen(false)}>Cancelar</Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSendMassEmail}
              disabled={loading || !massList || !form.subject || !form.message}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Enviar em Massa"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
