import * as React from "react";
import {
  AppProvider,
  SignInPage,
  type AuthProvider,
  type AuthResponse,
} from "@toolpad/core";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { FormWrapper, LeftSide, LoginContainer, RightSide } from "./loginStyles";

const providers: AuthProvider[] = [
  { id: "credentials", name: "Email and password" },
];

export default function Login() {
  const theme = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [emailError, setEmailError] = React.useState<string>("");
  const [passwordError, setPasswordError] = React.useState<string>("");

  // Snackbar state
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const signIn = async (
    provider: AuthProvider,
    formData?: FormData
  ): Promise<AuthResponse> => {
    setEmailError("");
    setPasswordError("");

    try {
      const email = (formData?.get("email") as string) || "";
      const password = (formData?.get("password") as string) || "";

      // Validação de campos vazios local
      if (!email.trim() || !password.trim()) {
        if (!email.trim()) setEmailError("O e-mail é obrigatório");
        if (!password.trim()) setPasswordError("A senha é obrigatória");
        return { type: "CredentialsSignin", error: "Erro de validação" };
      }

      // Chamada da API
      await login(email, password);

      // Login realizado com sucesso → abrir Snackbar
      setSnackbarMessage("Login realizado com sucesso!");
      setOpenSnackbar(true);

      // Espera 1 segundo antes de navegar para ver o Snackbar
      setTimeout(() => {
        navigate("/");
      }, 1000);

      return { type: "CredentialsSignin" };
    } catch (err: any) {
      const backendErrors = err?.response?.data?.errors;

      if (Array.isArray(backendErrors)) {
        backendErrors.forEach((e: any) => {
          const msg = String(e?.message || "Erro de validação");
          if (e.field === "email") setEmailError(msg);
          else if (e.field === "password") setPasswordError(msg);
          else {
            setEmailError(msg);
            setPasswordError(msg);
          }
        });
        return { type: "CredentialsSignin", error: "Erro de validação" };
      }

      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Erro ao fazer login";

      setEmailError(msg);
      setPasswordError(msg);

      return { type: "CredentialsSignin", error: msg };
    }
  };

  return (
    <LoginContainer>
      <LeftSide />

      <RightSide>
        <FormWrapper>
          <AppProvider theme={theme}>
            <SignInPage
              signIn={signIn}
              providers={providers}
              slotProps={{
                form: { noValidate: true },
                emailField: { autoFocus: true, helperText: emailError, error: !!emailError },
                passwordField: { helperText: passwordError, error: !!passwordError },
              }}
            />

            <Snackbar
              open={openSnackbar}
              autoHideDuration={3000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity="success"
                variant="filled"
                sx={{ width: "100%" }}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </AppProvider>
        </FormWrapper>
      </RightSide>
    </LoginContainer>
  );

};
