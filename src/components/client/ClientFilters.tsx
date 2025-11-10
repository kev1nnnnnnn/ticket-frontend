// src/components/client/ClientFilters.tsx
import { useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { filterClients } from "../../api/client";
import type { Client } from "../../api/client";

interface ClientFiltersProps {
  onFiltrar: (res: { data: Client[]; meta: any }) => void;
}

export default function ClientFilters({ onFiltrar }: ClientFiltersProps) {
  const [filtros, setFiltros] = useState({
    nome: "",
    email: "",
    telefone: "",
    cidade: "",
    estado: "",
  });

  const handleChange = (field: string, value: string) => {
    setFiltros((prev) => ({ ...prev, [field]: value }));
  };

  const handleBuscar = async () => {
    try {
      const payload = {
        nome: filtros.nome || undefined,
        email: filtros.email || undefined,
        telefone: filtros.telefone || undefined,
        cidade: filtros.cidade || undefined,
        estado: filtros.estado || undefined,
        page: 1,
        limit: 10,
      };

      const res = await filterClients(payload); // { data, meta }
      onFiltrar(res);
    } catch (error) {
      console.error("Erro ao filtrar clientes:", error);
    }
  };

  const handleLimpar = () => {
    setFiltros({
      nome: "",
      email: "",
      telefone: "",
      cidade: "",
      estado: "",
    });
    onFiltrar({ data: [], meta: { lastPage: 1 } });
  };

  return (
    <Box sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: "white", boxShadow: 1 }}>
      <Typography variant="h6" gutterBottom>
        🔎 Filtros de Clientes
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <TextField
          label="Nome"
          value={filtros.nome}
          onChange={(e) => handleChange("nome", e.target.value)}
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
          label="Telefone"
          value={filtros.telefone}
          onChange={(e) => handleChange("telefone", e.target.value)}
          size="small"
          sx={{ minWidth: 160 }}
        />

        <TextField
          label="Cidade"
          value={filtros.cidade}
          onChange={(e) => handleChange("cidade", e.target.value)}
          size="small"
          sx={{ minWidth: 160 }}
        />

        <TextField
          label="Estado"
          value={filtros.estado}
          onChange={(e) => handleChange("estado", e.target.value)}
          size="small"
          sx={{ width: 100 }}
        />

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
