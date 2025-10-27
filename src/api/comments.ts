import axiosInstance from "../utils/axiosInstance";

// Tipagem de um comentário de chamado
export interface Comentario {
  id: number;
  chamadoId: number;
  userId: number;
  comentario: string;
  createdAt?: string;
  updatedAt?: string;
  usuario?: {
    id: number;
    fullName: string;
    email: string;
    tipo: "usuario" | "tecnico";
  };
}

// 🔹 Listar comentários de um chamado específico
export const getComentarios = async (chamadoId: number): Promise<Comentario[]> => {
  const { data } = await axiosInstance.get<Comentario[]>(`/chamados/${chamadoId}/comentarios`);
  return data;
};

// 🔹 Criar um novo comentário

export const createComentario = async (
  chamadoId: number,
  comentario: { comentario: string } // só o texto do comentário
): Promise<Comentario> => {
  const { data } = await axiosInstance.post<Comentario>(
    `/chamados/${chamadoId}/comentarios`,
    comentario
  );
  return data;
};


// 🔹 Atualizar comentário (rota RESTful direta)
export const updateComentario = async (
  id: number,
  comentario: { comentario: string }
): Promise<Comentario> => {
  const { data } = await axiosInstance.put<Comentario>(`/comentarios-chamados/${id}`, comentario);
  return data;
};

// 🔹 Deletar comentário (rota RESTful direta)
export const deleteComentario = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/comentarios-chamados/${id}`);
};
