import axiosInstance from "../utils/axiosInstance"

// 🔹 Tipagem do e-mail
export interface EmailPayload {
  to: string
  subject: string
  message: string
  from?: string
}

// 🔹 Tipagem da resposta
export interface EmailResponse {
  message: string
  status: 'enviado' | 'falhou'
  logId?: number
}

// 🔹 Tipagem do log
export interface EmailLog {
  id: number
  destinatario: string
  assunto: string
  mensagem: string
  status: 'enviado' | 'falhou'
  erro?: string | null
  data_envio: string
  createdAt?: string
  updatedAt?: string
}

export interface PaginatedEmailLogs {
  data: EmailLog[]
  meta?: {
    total: number
    current_page: number
    per_page: number
  }
}

// ===================================================================
// 1. Enviar e-mail
// ===================================================================
export const sendEmail = async (payload: EmailPayload): Promise<EmailResponse> => {
  try {
    // 👉 endpoint corrigido
    const { data } = await axiosInstance.post<EmailResponse>("/emails/enviar", payload)
    return data
  } catch (error: any) {
    console.error("Erro ao enviar e-mail:", error?.response?.data || error)
    return { message: "Falha ao enviar e-mail", status: "falhou" }
  }
}

// ===================================================================
// 2. Listar logs
// ===================================================================
export const getEmailLogs = async (page: number = 1): Promise<PaginatedEmailLogs> => {
  const { data } = await axiosInstance.get<PaginatedEmailLogs>(`/emails/logs?page=${page}`)
  return data
}

// ===================================================================
// 3. Buscar log por ID
// ===================================================================
export const getEmailLogById = async (id: number): Promise<EmailLog> => {
  const { data } = await axiosInstance.get<EmailLog>(`/emails/logs/${id}`)
  return data
}

// ===================================================================
// 4. Excluir log
// ===================================================================
export const deleteEmailLog = async (id: number): Promise<{ message: string }> => {
  const { data } = await axiosInstance.delete<{ message: string }>(`/emails/logs/${id}`)
  return data
}

// ===================================================================
// 5. Envio em massa
// ===================================================================
export const sendMassEmail = async (emails: EmailPayload[]): Promise<EmailResponse[]> => {
  try {
    const { data } = await axiosInstance.post<EmailResponse[]>("/emails/enviar-massa", emails);
    return data;
  } catch (error: any) {
    console.error("Erro ao enviar e-mails em massa:", error?.response?.data || error);
    throw new Error("Falha ao enviar e-mails em massa");
  }
}
 