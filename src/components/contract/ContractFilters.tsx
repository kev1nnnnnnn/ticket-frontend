// src/components/contract/ContractFilters.tsx
import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { filterContratos, type Contrato } from "../../api/contract";
import { getClients, type Client } from "../../api/client";

interface ContractFiltersProps {
  onFiltrar: (res: { data: Contrato[]; meta: any }) => void;
}

export default function ContractFilters({ onFiltrar }: ContractFiltersProps) {
  const [filtros, setFiltros] = useState({
    numeroContrato: "",
    clienteId: 0,
    ativo: "",
  });

  const [clients, setClients] = useState<Client[]>([]);

  // Carrega clientes para o select
  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await getClients(1, 1000); // carregar todos
        setClients(data.data);
      } catch (err) {
        console.error("Erro ao carregar clientes:", err);
      }
    };
    loadClients();
  }, []);

  const handleChange = (field: string, value: any) => {
    setFiltros((prev) => ({ ...prev, [field]: value }));
  };

  const handleBuscar = async () => {
    try {
      const payload = {
        numeroContrato: filtros.numeroContrato || undefined,
        clienteNome:
          filtros.clienteId > 0
            ? clients.find((c) => c.id === filtros.clienteId)?.nome
            : undefined,
        ativo: filtros.ativo !== "" ? filtros.ativo === "Sim" : undefined,
        page: 1,
        limit: 10,
      };

      const res = await filterContratos(payload);
      onFiltrar(res);
    } catch (err) {
      console.error("Erro ao filtrar contratos:", err);
    }
  };

  const handleLimpar = () => {
    setFiltros({
      numeroContrato: "",
      clienteId: 0,
      ativo: "",
    });
    onFiltrar({ data: [], meta: { lastPage: 1 } });
  };

  return (
    <Box sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: "white", boxShadow: 1 }}>
      <Typography variant="h6" gutterBottom>
        🔎 Filtros de Contratos
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <TextField
          label="Número do Contrato"
          value={filtros.numeroContrato}
          onChange={(e) => handleChange("numeroContrato", e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="select-cliente-label">Cliente</InputLabel>
          <Select
            labelId="select-cliente-label"
            value={filtros.clienteId}
            label="Cliente"
            onChange={(e) => handleChange("clienteId", Number(e.target.value))}
          >
            <MenuItem value={0}>Todos</MenuItem>
            {clients.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="select-ativo-label">Ativo</InputLabel>
          <Select
            labelId="select-ativo-label"
            value={filtros.ativo}
            label="Ativo"
            onChange={(e) => handleChange("ativo", e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Sim">Sim</MenuItem>
            <MenuItem value="Não">Não</MenuItem>
          </Select>
        </FormControl>

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
