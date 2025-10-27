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
export const getTickets = async (): Promise<Ticket[]> => {
  const { data } = await axiosInstance.get<Ticket[]>("/chamados");
  return data;
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

