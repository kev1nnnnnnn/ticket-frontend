// src/api/dashboard.ts
import axiosInstance from "../utils/axiosInstance";

// Tipagens para os dados do dashboard
export interface DashboardStatus {
  status: "aberto" | "em_progresso" | "resolvido" | "cancelado";
  total: number;
}

export interface DashboardPrioridade {
  prioridade: "baixa" | "media" | "alta" | "urgente";
  total: number;
}

export interface DashboardUltimosDias {
  data: string; // YYYY-MM-DD
  total: number;
}

export interface DashboardTempoMedio {
  media_horas: string; // ex: "12.3"
}

export interface DashboardResumo {
  porStatus: DashboardStatus[];
  porPrioridade: DashboardPrioridade[];
  ultimos7: DashboardUltimosDias[];
  tempoMedio: DashboardTempoMedio;
}

// 🔹 Chamados agrupados por status
export const getDashboardStatus = async (): Promise<DashboardStatus[]> => {
  const { data } = await axiosInstance.get<DashboardStatus[]>("/dashboard/status");
  return data;
};

// 🔹 Chamados agrupados por prioridade
export const getDashboardPrioridade = async (): Promise<DashboardPrioridade[]> => {
  const { data } = await axiosInstance.get<DashboardPrioridade[]>("/dashboard/prioridade");
  return data;
};

// 🔹 Chamados últimos 7 dias
export const getDashboardUltimos7Dias = async (): Promise<DashboardUltimosDias[]> => {
  const { data } = await axiosInstance.get<DashboardUltimosDias[]>("/dashboard/ultimos-7-dias");
  return data;
};

// 🔹 Tempo médio de resolução
export const getDashboardTempoMedio = async (): Promise<DashboardTempoMedio> => {
  const { data } = await axiosInstance.get<DashboardTempoMedio>("/dashboard/tempo-medio");
  return data;
};

// 🔹 Dashboard completo
export const getDashboardResumo = async (): Promise<DashboardResumo> => {
  const { data } = await axiosInstance.get<DashboardResumo>("/dashboard/resumo");
  return data;
};

// 🔹 Todos os chamados com relacionamentos
export const getTodosChamadosDashboard = async (): Promise<any[]> => {
  const { data } = await axiosInstance.get<any[]>("/dashboard/todos");
  return data;
};
