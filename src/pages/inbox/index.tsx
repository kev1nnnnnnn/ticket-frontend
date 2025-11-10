import * as React from "react";
import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import DrawerList from "../../components/drawer/DrawerList";
import { useAuth } from "../../hooks/useAuth";
import { sendEmail, type EmailPayload } from "../../api/email";

const drawerWidth = 240;

export default function EmailPage() {
  const { logout } = useAuth();

  // Estados
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [form, setForm] = useState<EmailPayload>({
    to: "",
    subject: "",
    message: "",
  });

  // Função para atualizar o form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Enviar e-mail
  const handleSendEmail = async () => {
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await sendEmail(form);
      setSuccessMessage("📨 E-mail enviado com sucesso!");
      setForm({ to: "", subject: "", message: "" });
      setModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Erro ao enviar e-mail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
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
          ✉️ Envio de E-mails
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

        {/* Botão para abrir modal */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
          sx={{ mb: 2 }}
        >
          Novo E-mail
        </Button>

        {/* Modal de envio */}
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Enviar E-mail</DialogTitle>
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
      </Box>
    </Box>
  );
}
