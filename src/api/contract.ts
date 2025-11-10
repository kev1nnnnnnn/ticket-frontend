// src/api/contrato.ts
import axiosInstance from "../utils/axiosInstance";

// Tipagem de um contrato
export interface Contrato {
  id: number;
  clienteId: number;
  numeroContrato: string;
  dataInicio: string; // ISO string
  dataFim?: string | null;
  valorTotal: number;
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
  cliente?: {
    id: number;
    nome: string;
    email?: string;
    telefone?: string;
  };
}

// 🔹 Listar contratos com paginação
export const getContratos = async (page = 1, limit = 10): Promise<{
  data: Contrato[];
  meta: { last_page: number; current_page: number; total: number; per_page: number };
}> => {
  const { data } = await axiosInstance.get(`/contratos?page=${page}&limit=${limit}`);
  return data;
};

// 🔹 Criar contrato
export const createContrato = async (contrato: Omit<Contrato, "id" | "cliente">): Promise<Contrato> => {
  const { data } = await axiosInstance.post<Contrato>("/contratos", contrato);
  return data;
};

// 🔹 Atualizar contrato
export const updateContrato = async (id: number, contrato: Partial<Omit<Contrato, "id" | "cliente">>): Promise<Contrato> => {
  const { data } = await axiosInstance.put<Contrato>(`/contratos/${id}`, contrato);
  return data;
};

// 🔹 Deletar contrato
export const deleteContrato = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/contratos/${id}`);
};

// 🔹 Mostrar contrato específico
export const getContratoById = async (id: number): Promise<Contrato> => {
  const { data } = await axiosInstance.get<Contrato>(`/contratos/${id}`);
  return data;
};

// 🔹 Filtrar contratos (com paginação)
export const filterContratos = async (filtros: {
  numeroContrato?: string;
  clienteNome?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
}): Promise<{
  data: Contrato[];
  meta: { lastPage: number; currentPage: number; total: number; perPage: number };
}> => {
  const { data } = await axiosInstance.post('/contratos/filtrar', filtros);
  return data;
};

export const gerarPdfContrato = async (id: number): Promise<Blob> => {
  const response = await axiosInstance.get(`/contratos/${id}/pdf`, {
    responseType: 'blob', 
  });
  console.log('response: ',response)
  return response.data;
};