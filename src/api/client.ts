import axiosInstance from "../utils/axiosInstance"

// 🔹 Tipagem do Cliente
export interface Client {
  id: number
  nome: string
  email: string
  telefone?: string | null
  createdAt?: string
  updatedAt?: string
  enderecos?: Address[] // vinculado aos endereços
}

// 🔹 Tipagem do Endereço (importado aqui para referência)
export interface Address {
  id: number
  rua: string
  numero: string
  bairro?: string | null
  cidade: string
  estado: string
  cep?: string | null
  cliente_id: number
  createdAt?: string
  updatedAt?: string
}
export const getClients = async (
  page = 1,
  limit = 10
): Promise<{
  data: Client[];
  meta: { last_page: number; current_page: number; total: number; per_page: number };
}> => {
  const { data } = await axiosInstance.get(`/clientes?page=${page}&limit=${limit}`);
  return data; // já retorna { data, meta }
};


// 🔹 Criar um novo cliente
export const createClient = async (
  client: Omit<Client, "id" | "createdAt" | "updatedAt" | "enderecos">
): Promise<Client> => {
  const { data } = await axiosInstance.post<Client>("/clientes", client)
  return data
}

// 🔹 Atualizar cliente
export const updateClient = async (
  id: number,
  client: Partial<Client>
): Promise<Client> => {
  const { data } = await axiosInstance.put<Client>(`/clientes/${id}`, client)
  return data
}

// 🔹 Deletar cliente
export const deleteClient = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/clientes/${id}`)
}

// 🔹 Buscar cliente específico (com endereços)
export const getClientById = async (id: number): Promise<Client> => {
  const { data } = await axiosInstance.get<Client>(`/clientes/${id}`)
  return data
}


// 🔹 Filtrar clientes (com paginação)
export const filterClients = async (filtros: {
  nome?: string;
  email?: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  page?: number;
  limit?: number;
}): Promise<{
  data: Client[];
  meta: { lastPage: number; currentPage: number; total: number; perPage: number };
}> => {
  const { data } = await axiosInstance.get("/clientes/filtrar", { params: filtros });
  return data; // retorna { data: Client[], meta: {...} }
};