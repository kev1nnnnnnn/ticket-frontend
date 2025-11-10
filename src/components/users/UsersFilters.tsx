// src/components/user/UsersFilter.tsx
import { useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import { filterUsers } from "../../api/users";
import type { User } from "../../api/users";

interface UsersFilterProps {
  onFiltrar: (res: { data: User[]; meta: any }) => void;
}

export default function UsersFilter({ onFiltrar }: UsersFilterProps) {
  const [filtros, setFiltros] = useState({
    fullName: "",
    email: "",
    tipo: "",
  });

  const handleChange = (field: string, value: string) => {
    setFiltros((prev) => ({ ...prev, [field]: value }));
  };

  const handleBuscar = async () => {
    try {
      const payload = {
        fullName: filtros.fullName || undefined,
        email: filtros.email || undefined,
        tipo: filtros.tipo || undefined,
        page: 1,
        limit: 10,
      };

      const res = await filterUsers(payload); // { data, meta }
      onFiltrar(res);
    } catch (error) {
      console.error("Erro ao filtrar usuários:", error);
    }
  };

  const handleLimpar = () => {
    setFiltros({
      fullName: "",
      email: "",
      tipo: "",
    });
    onFiltrar({ data: [], meta: { lastPage: 1 } });
  };

  return (
    <Box sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: "white", boxShadow: 1 }}>
      <Typography variant="h6" gutterBottom>
        🔎 Filtros de Usuários
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <TextField
          label="Nome"
          value={filtros.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
        />

        <TextField
          label="E-mail"
          value={filtros.email}
          onChange={(e) => handleChange("email", e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
        />

        <TextField
          label="Tipo"
          select
          value={filtros.tipo}
          onChange={(e) => handleChange("tipo", e.target.value)}
          size="small"
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="usuario">Usuário</MenuItem>
          <MenuItem value="tecnico">Técnico</MenuItem>
        </TextField>

        <Stack direction="row" spacing={1}>
          <Button variant="contained" color="primary" onClick={handleBuscar}>
            Buscar
          </Button>
          <Button variant="outlined" onClick={handleLimpar}>
            Limpar
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
