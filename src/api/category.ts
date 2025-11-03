import axiosInstance from "../utils/axiosInstance"

// 🔹 Tipagem da categoria
export interface Categoria {
  id: number
  nome: string
  descricao?: string | null
  createdAt?: string
  updatedAt?: string
}

// 🔹 Listar todas as categorias
export const getCategorias = async (): Promise<Categoria[]> => {
  const { data } = await axiosInstance.get<Categoria[]>("/categorias")
  return data
}

// 🔹 Criar nova categoria
export const createCategoria = async (
  categoria: Omit<Categoria, "id">
): Promise<Categoria> => {
  const { data } = await axiosInstance.post<Categoria>("/categorias", categoria)
  return data
}

// 🔹 Atualizar categoria
export const updateCategoria = async (
  id: number,
  categoria: Partial<Categoria>
): Promise<Categoria> => {
  const { data } = await axiosInstance.put<Categoria>(
    `/categorias/${id}`,
    categoria
  )
  return data
}

// 🔹 Deletar categoria
export const deleteCategoria = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/categorias/${id}`)
}
