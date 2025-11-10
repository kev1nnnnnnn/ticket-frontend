import axiosInstance from "../utils/axiosInstance"

// 🔹 Tipagem do Endereço
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

// 🔹 Listar todos os endereços
export const getAddresses = async (): Promise<Address[]> => {
  const { data } = await axiosInstance.get<Address[]>("/enderecos")
  return data
}

// 🔹 Criar novo endereço vinculado a um cliente
export const createAddress = async (
  address: Omit<Address, "id" | "createdAt" | "updatedAt">
): Promise<Address> => {
  const { data } = await axiosInstance.post<Address>("/enderecos", address)
  return data
}

// 🔹 Atualizar endereço
export const updateAddress = async (
  id: number,
  address: Partial<Address>
): Promise<Address> => {
  const { data } = await axiosInstance.put<Address>(`/enderecos/${id}`, address)
  return data
}

// 🔹 Deletar endereço
export const deleteAddress = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/enderecos/${id}`)
}

// 🔹 Buscar endereço específico
export const getAddressById = async (id: number): Promise<Address> => {
  const { data } = await axiosInstance.get<Address>(`/enderecos/${id}`)
  return data
}
