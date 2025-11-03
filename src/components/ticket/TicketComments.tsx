import { useEffect, useState, useRef } from "react";
import { getComentarios, createComentario, type Comentario } from "../../api/comments";
import { TextField, Stack, Typography, Box, Paper, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { DateTime } from "luxon";
import { resolveTicket } from "../../api/tickets";
import { useSocket } from "../../hooks/useSocket"; 
import { useCallback } from 'react'

interface TicketCommentsProps {
  chamadoId: number;
  userId?: number;
}

export default function TicketComments({ chamadoId, userId }: TicketCommentsProps) {
  const [comments, setComments] = useState<Comentario[]>([]);
  const [newComment, setNewComment] = useState("");
  const [resolvido, setResolvido] = useState(false);
  const [resolvidoAt, setResolvidoAt] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Carrega os comentários do chamado
  const loadComments = async () => {
    try {
      const data = await getComentarios(chamadoId);
      setComments(data);

      const last = data[data.length - 1];
      if (last?.comentario.includes("[RESOLVIDO]")) {
        setResolvido(true);
        setResolvidoAt(last.createdAt || null);
      } else {
        setResolvido(false);
        setResolvidoAt(null);
      }
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
    }
  };

  // 🔹 Busca inicial
  useEffect(() => {
    loadComments();
  }, [chamadoId]);

  // 🔹 Scroll automático
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [comments]);

  const handleNewComment = useCallback((comentario: Comentario) => {
    if (comentario.chamadoId === chamadoId) {
      setComments((prev) => [...prev, comentario])
    }
  }, [chamadoId])

  useSocket('newComment', handleNewComment)

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await createComentario(chamadoId, { comentario: newComment } as any);
      setNewComment("");
      // loadComments(); ❌ Agora não precisa, o socket atualiza automaticamente
    } catch (error) {
      console.error("Erro ao criar comentário:", error);
    }
  };

  const handleResolvido = async () => {
    try {
      await resolveTicket(chamadoId);
      setResolvido(true);
      setResolvidoAt(new Date().toISOString());
      // loadComments(); ❌ Também não precisa mais
    } catch (error) {
      console.error("Erro ao marcar como resolvido:", error);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 1,
        p: 2,
        borderRadius: 3,
        border: "1px solid #e0e0e0",
        background: "#fff",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ mb: 1.5, fontWeight: 600, color: "#444", textAlign: "center" }}
      >
        💬 Conversa do Chamado
      </Typography>

      <Box
        ref={chatRef}
        sx={{
          maxHeight: 280,
          overflowY: "auto",
          p: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          scrollBehavior: "smooth",
          background: "#fafafa",
          borderRadius: 2,
        }}
      >
        {comments.map((c) => {
          const isUser = c.userId === userId;
          const isSystem = c.comentario.includes("[RESOLVIDO]");
          return (
            <Box
              key={c.id}
              sx={{
                display: "flex",
                justifyContent: isSystem
                  ? "center"
                  : isUser
                  ? "flex-end"
                  : "flex-start",
              }}
            >
              <Box
                sx={{
                  maxWidth: "70%",
                  p: 1.2,
                  borderRadius: 2,
                  backgroundColor: isSystem
                    ? "#e8f5e9"
                    : isUser
                    ? "#1976d2"
                    : "#f0f0f0",
                  color: isUser ? "white" : "#333",
                  fontSize: "0.9rem",
                }}
              >
                <Typography sx={{ whiteSpace: "pre-line", wordBreak: "break-word" }}>
                  {c.comentario}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", mt: 0.3, opacity: 0.7, fontSize: "0.7rem" }}
                >
                  {DateTime.fromISO(c.createdAt || "").toFormat("dd/MM HH:mm")}
                </Typography>
              </Box>
            </Box>
          );
        })}

        {resolvido && resolvidoAt && (
          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 1.5, color: "green", fontWeight: 500 }}
          >
            ✅ Chamado resolvido em {DateTime.fromISO(resolvidoAt).toFormat("dd/MM/yyyy HH:mm")}
          </Typography>
        )}
      </Box>

      {!resolvido && (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Escreva uma mensagem..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <IconButton color="primary" onClick={handleSubmit}>
            <SendIcon />
          </IconButton>
          <IconButton color="success" onClick={handleResolvido}>
            <CheckCircleIcon />
          </IconButton>
        </Stack>
      )}
    </Paper>
  );
}
