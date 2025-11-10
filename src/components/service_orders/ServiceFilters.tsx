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
import {
  filterOrdensDeServico,
  type OrdemDeServico,
} from "../../api/service_order";
import { getClients, type Client } from "../../api/client";

interface ServiceOrderFiltersProps {
  onFiltrar: (res: { data: OrdemDeServico[]; meta: any }) => void;
}

export default function ServiceOrderFilters({
  onFiltrar,
}: ServiceOrderFiltersProps) {
  const [filtros, setFiltros] = useState({
    clienteId: 0,
    tipoServico: "",
    status: "",
    tecnicoResponsavel: "",
    dataAgendadaInicio: "",
    dataAgendadaFim: "",
  });

  const [clients, setClients] = useState<Client[]>([]);

  // 🔹 Carregar clientes para o select
  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await getClients(1, 1000);
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

  // 🔹 Buscar ordens de serviço com filtros
  const handleBuscar = async () => {
    try {
      const payload = {
        clienteNome:
          filtros.clienteId > 0
            ? clients.find((c) => c.id === filtros.clienteId)?.nome
            : undefined,
        tipoServico: filtros.tipoServico || undefined,
        status: filtros.status || undefined,
        tecnicoResponsavel: filtros.tecnicoResponsavel || undefined,
        dataAgendadaInicio: filtros.dataAgendadaInicio || undefined,
        dataAgendadaFim: filtros.dataAgendadaFim || undefined,
        page: 1,
        limit: 10,
      };

      const res = await filterOrdensDeServico(payload);
      onFiltrar(res);
    } catch (err) {
      console.error("Erro ao filtrar ordens de serviço:", err);
    }
  };

  // 🔹 Limpar filtros
  const handleLimpar = () => {
    setFiltros({
      clienteId: 0,
      tipoServico: "",
      status: "",
      tecnicoResponsavel: "",
      dataAgendadaInicio: "",
      dataAgendadaFim: "",
    });
    onFiltrar({ data: [], meta: { lastPage: 1 } });
  };

  return (
    <Box sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: "white", boxShadow: 1 }}>
      <Typography variant="h6" gutterBottom>
        🔎 Filtros de Ordens de Serviço
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {/* Cliente */}
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

        {/* Tipo de Serviço */}
        <TextField
          label="Tipo de Serviço"
          value={filtros.tipoServico}
          onChange={(e) => handleChange("tipoServico", e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
        />

        {/* Técnico Responsável */}
        <TextField
          label="Técnico Responsável"
          value={filtros.tecnicoResponsavel}
          onChange={(e) => handleChange("tecnicoResponsavel", e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
        />

        {/* Status */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="select-status-label">Status</InputLabel>
          <Select
            labelId="select-status-label"
            value={filtros.status}
            label="Status"
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="aberta">Aberta</MenuItem>
            <MenuItem value="em_andamento">Em Andamento</MenuItem>
            <MenuItem value="concluida">Concluída</MenuItem>
            <MenuItem value="cancelada">Cancelada</MenuItem>
          </Select>
        </FormControl>

        {/* Período de Agendamento */}
        <TextField
          label="Data Inicial"
          type="date"
          value={filtros.dataAgendadaInicio}
          onChange={(e) => handleChange("dataAgendadaInicio", e.target.value)}
          size="small"
          sx={{ minWidth: 160 }}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Data Final"
          type="date"
          value={filtros.dataAgendadaFim}
          onChange={(e) => handleChange("dataAgendadaFim", e.target.value)}
          size="small"
          sx={{ minWidth: 160 }}
          InputLabelProps={{ shrink: true }}
        />

        {/* Botões */}
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
