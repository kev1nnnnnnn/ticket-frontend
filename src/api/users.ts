import axiosInstance from "../utils/axiosInstance";

export interface User {
  id: number;
  fullName: string;
  email: string;
  tipo: "usuario" | "tecnico";
  password?: string;
}

/* ============================
   📄 Listar usuários (paginado)
=============================== */
export const getUsers = async (
  page = 1,
  limit = 10
): Promise<{
  data: User[];
  meta: {
    last_page: number;
    current_page: number;
    total: number;
    per_page: number;
  };
}> => {
  const { data } = await axiosInstance.get(`/users?page=${page}&limit=${limit}`);
  return data; // já retorna { data, meta }
};

/* ============================
   🔍 Filtrar usuários (com paginação)
=============================== */
export const filterUsers = async (filtros: {
  fullName?: string;
  email?: string;
  tipo?: string;
  page?: number;
  limit?: number;
}): Promise<{
  data: User[];
  meta: {
    last_page: number;
    current_page: number;
    total: number;
    per_page: number;
  };
}> => {
  const { data } = await axiosInstance.get("/users/filtrar", { params: filtros });
  return data; // retorna { data, meta }
};

/* ============================
  Criar usuário
=============================== */
export const createUser = async (user: Omit<User, "id">): Promise<User> => {
  const { data } = await axiosInstance.post<User>("/users", user);
  return data;
};

/* ============================
  Atualizar usuário
=============================== */
export const updateUser = async (id: number, user: Partial<User>): Promise<User> => {
  const { data } = await axiosInstance.put<User>(`/users/${id}`, user);
  return data;
};

/* ============================
  Deletar usuário
=============================== */
export const deleteUser = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/users/${id}`);
};
