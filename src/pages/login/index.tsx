import * as React from "react";
import { AppProvider, SignInPage, type AuthProvider, type AuthResponse } from "@toolpad/core";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const providers: AuthProvider[] = [{ id: "credentials", name: "Email and password" }];

export default function Login() {
  const theme = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

const signIn = async (provider: AuthProvider, formData?: FormData): Promise<AuthResponse> => {
  try {
    const email = formData?.get("email") as string;
    const password = formData?.get("password") as string;

    if (!email || !password) {
      return { type: "CredentialsSignin", error: "Preencha todos os campos" };
    }

    await login(email, password);

    // Login bem-sucedido → retorna tipo correto e redireciona para Home
    navigate("/"); // ← vai para a Home, não para o login
    return { type: "CredentialsSignin" }; // Toolpad entende que login foi concluído
  } catch (err: any) {
    return { type: "CredentialsSignin", error: err.message || "Erro ao fazer login" };
  }
};


  return (
    <AppProvider theme={theme}>
      <SignInPage signIn={signIn} providers={providers} slotProps={{ emailField: { autoFocus: false }, form: { noValidate: true } }} />
    </AppProvider>
  );
}
