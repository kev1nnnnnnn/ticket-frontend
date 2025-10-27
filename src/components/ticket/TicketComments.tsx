import { useEffect, useState } from "react";
import { getComentarios, createComentario, type Comentario } from "../../api/comments";
import { TextField, Button, Stack, Typography, Box } from "@mui/material";
import { DateTime } from "luxon";
import axiosInstance from "../../utils/axiosInstance";

interface TicketCommentsProps {
  chamadoId: number;
  userId?: number;
}

export default function TicketComments({ chamadoId }: TicketCommentsProps) {
  const [comments, setComments] = useState<Comentario[]>([]);
  const [newComment, setNewComment] = useState("");
  const [resolvido, setResolvido] = useState(false);
  const [resolvidoAt, setResolvidoAt] = useState<string | null>(null);

  // Carrega comentários e status de resolução
  const loadComments = async () => {
    try {
      const data = await getComentarios(chamadoId);
      setComments(data);

      // Supondo que o último comentário ou uma flag do backend indique resolução
      const lastComment = data[data.length - 1];
      if (lastComment?.comentario.includes("[RESOLVIDO]")) {
        setResolvido(true);
        setResolvidoAt(lastComment.createdAt || null);
      } else {
        setResolvido(false);
        setResolvidoAt(null);
      }
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
    }
  };

  useEffect(() => {
    loadComments();
  }, [chamadoId]);

  // Criar novo comentário
  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      await createComentario(chamadoId, { comentario: newComment } as any);
      setNewComment("");
      loadComments();
    } catch (error) {
      console.error("Erro ao criar comentário:", error);
    }
  };

  // Marcar chamado como resolvido
  const handleResolvido = async () => {
    try {
      // Pode ser uma rota do backend tipo PUT /chamados/:id/resolvido
      await axiosInstance.put(`/chamados/${chamadoId}/resolvido`);
      setResolvido(true);
      setResolvidoAt(new Date().toISOString());

      // Opcional: criar comentário automático indicando resolução
      await createComentario(chamadoId, { comentario: "[RESOLVIDO]" } as any);
      loadComments();
    } catch (error) {
      console.error("Erro ao marcar como resolvido:", error);
    }
  };

  return (
    <Box sx={{ mt: 1, borderTop: "1px solid #eee", pt: 1 }}>
      <Stack spacing={1}>
        {comments.map((c) => (
          <Box key={c.id} sx={{ p: 1, borderRadius: 1, backgroundColor: "#f5f5f5" }}>
            <Typography variant="subtitle2">
              {c.usuario?.fullName || "Usuário"} -{" "}
              {c.createdAt
                ? DateTime.fromISO(c.createdAt).toFormat("dd/MM/yyyy HH:mm")
                : ""}
            </Typography>
            <Typography variant="body2">{c.comentario}</Typography>
          </Box>
        ))}

        {resolvido && resolvidoAt && (
          <Typography variant="body2" color="green">
            ✅ Chamado resolvido em {DateTime.fromISO(resolvidoAt).toFormat("dd/MM/yyyy HH:mm")}
          </Typography>
        )}

        {!resolvido && (
          <Button variant="outlined" color="success" onClick={handleResolvido}>
            Marcar como resolvido
          </Button>
        )}

        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            size="small"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Adicionar comentário..."
          />
          <Button variant="contained" onClick={handleSubmit}>
            Enviar
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
