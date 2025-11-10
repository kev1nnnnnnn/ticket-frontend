import axiosInstance from "../utils/axiosInstance";

// Tipagem da Ordem de Serviço (compatível com backend)
export interface OrdemDeServico {
  id: number;
  chamadoId?: number | null;
  clienteId: number;
  tecnicoId?: number | null;

  descricaoProblema?: string;
  descricaoSolucao?: string;
  status: "aberta" | "em_andamento" | "finalizada" | "cancelada";
  tipoAtendimento: "presencial" | "remoto";

  dataAbertura?: string;
  dataFechamento?: string | null;
  tempoGastoHoras?: number | null;
  valorServico?: number | null;
  materiaisUtilizados?: string | null;
  observacoesTecnico?: string | null;
  assinaturaCliente?: string | null;
  avaliacaoCliente?: number | null;

  createdAt?: string;
  updatedAt?: string;

  cliente?: {
    id: number;
    nome: string;
    email?: string;
    telefone?: string;
  };
  tecnico?: {
    id: number;
    fullName: string;
  };
  chamado?: {
    id: number;
    titulo: string;
  };
}

// 🔹 Listar ordens de serviço
export const getOrdensDeServico = async (page = 1, limit = 10) => {
  const { data } = await axiosInstance.get(`/ordem-de-servicos?page=${page}&limit=${limit}`);
  return data;
};

// 🔹 Criar OS
export const createOrdemDeServico = async (
  ordem: Omit<OrdemDeServico, "id" | "cliente" | "tecnico" | "chamado">
): Promise<OrdemDeServico> => {
  const { data } = await axiosInstance.post<OrdemDeServico>("/ordem-de-servicos", ordem);
  return data;
};

// 🔹 Atualizar OS
export const updateOrdemDeServico = async (
  id: number,
  ordem: Partial<Omit<OrdemDeServico, "id" | "cliente" | "tecnico" | "chamado">>
): Promise<OrdemDeServico> => {
  const { data } = await axiosInstance.put<OrdemDeServico>(`/ordem-de-servicos/${id}`, ordem);
  return data;
};

// 🔹 Deletar OS
export const deleteOrdemDeServico = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/ordem-de-servicos/${id}`);
};

// 🔹 Mostrar OS específica
export const getOrdemDeServicoById = async (id: number): Promise<OrdemDeServico> => {
  const { data } = await axiosInstance.get<OrdemDeServico>(`/ordem-de-servicos/${id}`);
  return data;
};

// 🔹 Filtrar OS
export const filterOrdensDeServico = async (filtros: {
  clienteId?: number;
  tecnicoId?: number;
  chamadoId?: number;
  status?: string;
  tipoAtendimento?: string;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  limit?: number;
}) => {
  const { data } = await axiosInstance.post("/ordem-de-servicos/filtrar", filtros);
  return data;
};

// 🔹 Gerar PDF
export const gerarPdfOrdemDeServico = async (id: number): Promise<Blob> => {
  const response = await axiosInstance.get(`/ordem-de-servicos/${id}/pdf`, {
    responseType: "blob",
  });
  return response.data;
};
