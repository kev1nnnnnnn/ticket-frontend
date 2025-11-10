import axiosInstance from "../utils/axiosInstance";

export interface LoginPayload {
  email: string;
  password: string;
  recaptchaToken?: string; // 👈 novo campo opcional
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    fullName: string;
    email: string;
  };
}

export const loginAPI = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await axiosInstance.post<LoginResponse>("/login", payload);
  return data;
};

export const getMe = async () => {
  const { data } = await axiosInstance.get<{ user: LoginResponse["user"] }>("/me");
  return data.user;
};
