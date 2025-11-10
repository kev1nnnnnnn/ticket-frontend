// src/pages/contracts/ContractsPage.tsx
import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Pagination,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DrawerList from "../../components/drawer/DrawerList";
import { useAuth } from "../../hooks/useAuth";
import {
  getContratos,
  createContrato,
  updateContrato,
  deleteContrato,
  filterContratos,
  type Contrato,
  gerarPdfContrato,
} from "../../api/contract";
import { getClients, type Client } from "../../api/client";
import { handleCurrencyInput, maskCurrency } from "../../utils/mask";
import ContractFilters from "../../components/contract/ContractFilters";

const drawerWidth = 240;

export default function ContractsPage() {
  const { logout } = useAuth();

  const [contracts, setContracts] = useState<Contrato[]>([]);
  const [contractsFiltered, setContratosFiltrados] = useState<Contrato[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contrato | null>(null);

  // Paginação
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const contractsToDisplay =
    (contractsFiltered?.length ?? 0) > 0 ? contractsFiltered : contracts || [];

  const [form, setForm] = useState({
    clienteId: 0,
    numeroContrato: "",
    dataInicio: "",
    dataFim: "",
    valorTotal: 0,
    ativo: true,
  });

  // Carregar contratos
  const loadContracts = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const data = await getContratos(pageNumber, perPage);
      setContracts(data.data);
      setTotalPages(data.meta.last_page || 1);
    } finally {
      setLoading(false);
    }
  };

  // Carregar clientes para o select
  const loadClients = async () => {
    try {
      const data = await getClients(1, 1000); // carregar todos ou ajustar limite
      setClients(data.data);
    } catch (err) {
      console.error("Erro ao carregar clientes", err);
    }
  };

  useEffect(() => {
    loadContracts(page);
    loadClients();
  }, [page]);

  // Abrir modal
  const handleOpenModal = (contract?: Contrato) => {
    if (contract) {
      setEditingContract(contract);
      setForm({
        clienteId: contract.clienteId,
        numeroContrato: contract.numeroContrato,
        dataInicio: contract.dataInicio,
        dataFim: contract.dataFim || "",
        valorTotal: contract.valorTotal,
        ativo: contract.ativo,
      });
    } else {
      setEditingContract(null);
      setForm({
        clienteId: 0,
        numeroContrato: "",
        dataInicio: "",
        dataFim: "",
        valorTotal: 0,
        ativo: true,
      });
    }
    setModalOpen(true);
  };

  // Salvar contrato
  const handleSave = async () => {
    try {
      if (editingContract) {
        await updateContrato(editingContract.id, form);
      } else {
        await createContrato(form);
      }
      setModalOpen(false);
      loadContracts();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao salvar contrato");
    }
  };

  // Deletar contrato
  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este contrato?")) {
      await deleteContrato(id);
      loadContracts();
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Filtros simples
  const handleFilter = async (filters: { numeroContrato?: string; clienteNome?: string; ativo?: boolean }) => {
    const data = await filterContratos({ ...filters, page: 1, limit: perPage });
    setContratosFiltrados(data.data);
    setTotalPages(data.meta.lastPage || 1);
    setPage(1);
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <Box sx={{ display: "" }}>
      <DrawerList onLogout={logout} />

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
          📄 Lista de Contratos
        </Typography>

        {/* Filtros */}
        <ContractFilters
            onFiltrar={(res) => {
            setContratosFiltrados(res.data);
            setTotalPages(res.meta.lastPage || 1);
            setPage(1);
            }}
        />

        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={() => handleOpenModal()}
        >
          Novo Contrato
        </Button>

        {/* Tabela */}
        <Table sx={{ marginTop: 2 }}>
         <TableHead>
            <TableRow>
                <TableCell>Número</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Data Início</TableCell>
                <TableCell>Data Fim</TableCell>
                <TableCell>Valor Total</TableCell>
                <TableCell>Ativo</TableCell>
                <TableCell>Visualizar PDF</TableCell> {/* nova coluna */}
                <TableCell>Ações</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {contractsToDisplay.map((contract) => (
                <TableRow key={contract.id}>
                <TableCell>{contract.numeroContrato}</TableCell>
                <TableCell>{contract.cliente?.nome || "—"}</TableCell>
                <TableCell>{contract.dataInicio}</TableCell>
                <TableCell>{contract.dataFim || "—"}</TableCell>
                <TableCell>{maskCurrency(contract.valorTotal)}</TableCell>
                <TableCell>{contract.ativo ? "Sim" : "Não"}</TableCell>
                <TableCell>
                    <Button
                    variant="outlined"
                    size="small"
                    onClick={async () => {
                        const pdfBlob = await gerarPdfContrato(contract.id);
                        const url = URL.createObjectURL(pdfBlob);
                        window.open(url, "_blank"); // abre o PDF em nova aba
                    }}
                    >
                    📄 Abrir
                    </Button>
                </TableCell>
                <TableCell>
                    <IconButton onClick={() => handleOpenModal(contract)}>
                    <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(contract.id)} color="error">
                    <DeleteIcon />
                    </IconButton>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>

        {/* Paginação */}
        <Box display="flex" justifyContent="flex-start" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>

        {/* Modal */}
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>{editingContract ? "Editar Contrato" : "Novo Contrato"}</DialogTitle>
            <DialogContent>
                {/* Número do Contrato */}
                <TextField
                label="Número do Contrato"
                value={editingContract ? form.numeroContrato : "Será gerado automaticamente"}
                fullWidth
                margin="normal"
                InputProps={{
                    readOnly: true, // 🔹 impede edição
                }}
                />

                {/* Select de Cliente */}
                <FormControl fullWidth margin="normal">
                <InputLabel id="select-cliente-label">Cliente</InputLabel>
                <Select
                    labelId="select-cliente-label"
                    value={form.clienteId}
                    label="Cliente"
                    onChange={(e) => setForm({ ...form, clienteId: Number(e.target.value) })}
                >
                    {clients.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                        {c.nome}
                    </MenuItem>
                    ))}
                </Select>
                </FormControl>

                {/* Outras informações */}
                <TextField
                label="Data Início"
                type="date"
                value={form.dataInicio}
                onChange={(e) => setForm({ ...form, dataInicio: e.target.value })}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                />
                <TextField
                label="Data Fim"
                type="date"
                value={form.dataFim}
                onChange={(e) => setForm({ ...form, dataFim: e.target.value })}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                />
               <TextField
                label="Valor Total"
                type="text"
                value={form.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                onChange={(e) => {
                    handleCurrencyInput(e); // aplica a máscara
                    // Atualiza o estado com o valor numérico
                    const numericValue = Number(
                    (e.target as HTMLInputElement).value.replace(/\D/g, '')
                    ) / 100;
                    setForm({ ...form, valorTotal: numericValue });
                }}
                fullWidth
                margin="normal"
                />

                <TextField
                label="Ativo"
                value={form.ativo ? "Sim" : "Não"}
                onChange={(e) => setForm({ ...form, ativo: e.target.value === "Sim" })}
                fullWidth
                margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
                <Button variant="contained" onClick={handleSave}>
                Salvar
                </Button>
            </DialogActions>
        </Dialog>

      </Box>
    </Box>
  );
}
