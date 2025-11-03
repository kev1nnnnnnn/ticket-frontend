// src/api/ticket.ts
import axiosInstance from "../utils/axiosInstance";

// Tipagem de um chamado (ticket)
export interface Ticket {
  id: number;
  titulo: string;
  descricao: string;
  status: "aberto" | "em_progresso" | "resolvido" | "cancelado";
  prioridade: "baixa" | "media" | "alta" | "urgente";
  userId: number;
  tecnicoId?: number | null;
  categoriaId?: number | null;
  createdAt?: string;
  updatedAt?: string;
  closedAt?: string | null;
}

// 🔹 Listar chamados
// 🔹 Listar chamados com paginação
export const getTickets = async (page = 1, limit = 5): Promise<{
  data: Ticket[];
  meta: { last_page: number; current_page: number; total: number; per_page: number };
}> => {
  const { data } = await axiosInstance.get(`/chamados?page=${page}&limit=${limit}`);
  return data; // aqui já retorna { data: Ticket[], meta: {...} }
};


// 🔹 Criar chamado
export const createTicket = async (ticket: Omit<Ticket, "id">): Promise<Ticket> => {
  const { data } = await axiosInstance.post<Ticket>("/chamados", ticket);
  return data;
};

// 🔹 Atualizar chamado
export const updateTicket = async (id: number, ticket: Partial<Ticket>): Promise<Ticket> => {
  const { data } = await axiosInstance.put<Ticket>(`/chamados/${id}`, ticket);
  return data;
};

// 🔹 Deletar chamado
export const deleteTicket = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/chamados/${id}`);
};

// 🔹 Marcar chamado como resolvido
export const resolveTicket = async (id: number): Promise<Ticket> => {
  const { data } = await axiosInstance.put<Ticket>(`/chamados/${id}/resolvido`);
  return data;
};

// 🔹 Filtrar chamados (com paginação)
export const filterTickets = async (filtros: {
  status?: string;
  prioridade?: string;
  categoriaId?: number;
  tecnicoId?: number;
  userId?: number;
  dataInicio?: string | null;
  dataFim?: string | null;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{
  data: Ticket[];
  meta: { lastPage: number; currentPage: number; total: number; perPage: number };
}> => {
  const { data } = await axiosInstance.post('/chamados/filtrar', filtros)
  return data // retorna { data: Ticket[], meta: {...} }
};
