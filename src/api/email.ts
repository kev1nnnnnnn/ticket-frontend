import axiosInstance from "../utils/axiosInstance";

// 🔹 Tipagem do e-mail
export interface EmailPayload {
  to: string;       // destinatário
  subject: string;  // assunto
  message: string;  // corpo do e-mail (HTML ou texto)
  from?: string;    // opcional — sobrescreve o padrão do backend
}

// 🔹 Enviar e-mail simples
export const sendEmail = async (payload: EmailPayload): Promise<{ message: string }> => {
  const { data } = await axiosInstance.post<{ message: string }>("/enviar-email", payload);
  return data;
};
