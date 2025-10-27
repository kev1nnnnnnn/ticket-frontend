import { useEffect, useState } from "react";
import { getComentarios, createComentario, type Comentario } from "../../api/comments";
import { TextField, Button, Stack, Typography, Box } from "@mui/material";
import { DateTime } from "luxon";

interface TicketCommentsProps {
  chamadoId: number;
  userId?: number;
}

export default function TicketComments({ chamadoId }: TicketCommentsProps) {
  const [comments, setComments] = useState<Comentario[]>([]);
  const [newComment, setNewComment] = useState("");

  const loadComments = async () => {
    try {
      const data = await getComentarios(chamadoId);
      setComments(data);
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
    }
  };

  useEffect(() => {
    loadComments();
  }, [chamadoId]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      await createComentario(chamadoId, { comentario: newComment } as any); // backend usa user logado
      setNewComment("");
      loadComments();
    } catch (error) {
      console.error("Erro ao criar comentário:", error);
    }
  };

  return (
    <Box sx={{ mt: 1, borderTop: "1px solid #eee", pt: 1 }}>
      <Stack spacing={1}>
        {comments.map((c) => (
          <Box key={c.id} sx={{ p: 1, borderRadius: 1, backgroundColor: "#f5f5f5" }}>
            <Typography variant="subtitle2">
              {c.usuario?.fullName || "Usuário"} -{" "}
              {DateTime.fromISO(c.createdAt!).toFormat("dd/MM/yyyy HH:mm")}
            </Typography>
            <Typography variant="body2">{c.comentario}</Typography>
          </Box>
        ))}
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
