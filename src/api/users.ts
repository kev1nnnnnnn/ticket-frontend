import axiosInstance from "../utils/axiosInstance";

export interface User {
  id: number;
  fullName: string;
  email: string;
  tipo: 'usuario' | 'tecnico';
  password?: string;
}

// Listar usuários
export const getUsers = async (): Promise<User[]> => {
  const { data } = await axiosInstance.get<User[]>("/users");
  return data;
};

// Criar usuário
export const createUser = async (user: Omit<User, "id">): Promise<User> => {
  const { data } = await axiosInstance.post<User>("/users", user);
  return data;
};

// Atualizar usuário
export const updateUser = async (id: number, user: Partial<User>): Promise<User> => {
  const { data } = await axiosInstance.put<User>(`/users/${id}`, user);
  return data;
};

// Deletar usuário
export const deleteUser = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/users/${id}`);
};
