import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  TextField,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { filterTickets } from "../../api/tickets";
import type { Ticket } from "../../api/tickets";
import axiosInstance from "../../utils/axiosInstance";

interface Categoria {
  id: number;
  nome: string;
}

interface TicketFiltersProps {
  onFiltrar: (res: { data: Ticket[]; meta: any }) => void; // ✅ envia array + meta
}

export default function TicketFilters({ onFiltrar }: TicketFiltersProps) {
  const [filtros, setFiltros] = useState({
    status: "",
    prioridade: "",
    userId: "",
    tecnicoId: "",
    categoriaId: "",
    dataInicio: null as Dayjs | null,
    dataFim: null as Dayjs | null,
    search: "",
  });

  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const { data } = await axiosInstance.get<Categoria[]>("/categorias");
        setCategorias(data);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };
    carregarCategorias();
  }, []);

  const handleChange = (field: string, value: any) => {
    setFiltros((prev) => ({ ...prev, [field]: value }));
  };

  const handleBuscar = async () => {
    try {
      const payload = {
        status: filtros.status || undefined,
        prioridade: filtros.prioridade || undefined,
        userId: filtros.userId ? Number(filtros.userId) : undefined,
        tecnicoId: filtros.tecnicoId ? Number(filtros.tecnicoId) : undefined,
        categoriaId: filtros.categoriaId ? Number(filtros.categoriaId) : undefined,
        dataInicio: filtros.dataInicio
          ? filtros.dataInicio.format("YYYY-MM-DD")
          : undefined,
        dataFim: filtros.dataFim
          ? filtros.dataFim.format("YYYY-MM-DD")
          : undefined,
        search: filtros.search || undefined,
        page: 1,      // 🔹 sempre começa na página 1 ao filtrar
        limit: 5,     // 🔹 você pode ajustar se quiser
      };

      const res = await filterTickets(payload); // res = { data, meta }
      onFiltrar(res); // envia objeto completo
    } catch (error) {
      console.error("Erro ao filtrar chamados:", error);
    }
  };

  const handleLimpar = () => {
    setFiltros({
      status: "",
      prioridade: "",
      userId: "",
      tecnicoId: "",
      categoriaId: "",
      dataInicio: null,
      dataFim: null,
      search: "",
    });
    onFiltrar({ data: [], meta: { lastPage: 1 } }); // limpa a lista e reseta paginação
  };

  return (
    <Box sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: "white", boxShadow: 1 }}>
      <Typography variant="h6" gutterBottom>
        🔎 Filtros de Chamados
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <TextField
          select
          label="Status"
          value={filtros.status}
          onChange={(e) => handleChange("status", e.target.value)}
          size="small"
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="aberto">Aberto</MenuItem>
          <MenuItem value="em_progresso">Em Progresso</MenuItem>
          <MenuItem value="resolvido">Resolvido</MenuItem>
          <MenuItem value="cancelado">Cancelado</MenuItem>
        </TextField>

        <TextField
          select
          label="Prioridade"
          value={filtros.prioridade}
          onChange={(e) => handleChange("prioridade", e.target.value)}
          size="small"
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">Todas</MenuItem>
          <MenuItem value="baixa">Baixa</MenuItem>
          <MenuItem value="media">Média</MenuItem>
          <MenuItem value="alta">Alta</MenuItem>
          <MenuItem value="urgente">Urgente</MenuItem>
        </TextField>

        <TextField
          label="Usuário ID"
          type="number"
          value={filtros.userId}
          onChange={(e) => handleChange("userId", e.target.value)}
          size="small"
          sx={{ width: 120 }}
        />

        <TextField
          select
          label="Categoria"
          value={filtros.categoriaId}
          onChange={(e) => handleChange("categoriaId", e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Todas</MenuItem>
          {categorias.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.nome}
            </MenuItem>
          ))}
        </TextField>

        <DatePicker
          label="Data Início"
          value={filtros.dataInicio}
          onChange={(v) => handleChange("dataInicio", v)}
          slotProps={{ textField: { size: "small" } }}
        />
        <DatePicker
          label="Data Fim"
          value={filtros.dataFim}
          onChange={(v) => handleChange("dataFim", v)}
          slotProps={{ textField: { size: "small" } }}
        />

        <TextField
          label="Buscar título ou descrição"
          value={filtros.search}
          onChange={(e) => handleChange("search", e.target.value)}
          size="small"
          sx={{ minWidth: 220 }}
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
