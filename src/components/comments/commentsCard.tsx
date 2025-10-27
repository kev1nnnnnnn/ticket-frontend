import { Box, Typography } from "@mui/material";

interface Props {
  usuario: string;
  comentario: string;
  createdAt: string;
}

export default function ComentarioCard({ usuario, comentario, createdAt }: Props) {
  return (
    <Box sx={{ p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
      <Typography variant="body2">
        <strong>{usuario}</strong> ({new Date(createdAt).toLocaleString()}):
      </Typography>
      <Typography variant="body2">{comentario}</Typography>
    </Box>
  );
}
