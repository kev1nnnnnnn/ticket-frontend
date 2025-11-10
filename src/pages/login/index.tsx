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
import ReCAPTCHA from "react-google-recaptcha";

const providers: AuthProvider[] = [
  { id: "credentials", name: "Email and password" },
];

const RECAPTCHA_SITE_KEY = "6LdKbQQsAAAAAI7qY3iwd6551W4e8UGejruDm1Ia";

export default function Login() {
  const theme = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [recaptchaError, setRecaptchaError] = React.useState("");

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const recaptchaRef = React.useRef<ReCAPTCHA>(null);

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
    setRecaptchaError("");

    try {
      const email = (formData?.get("email") as string) || "";
      const password = (formData?.get("password") as string) || "";
      const recaptchaToken = recaptchaRef.current?.getValue();

      // Verifica campos obrigatórios
      if (!email.trim() || !password.trim() || !recaptchaToken) {
        if (!email.trim()) setEmailError("O e-mail é obrigatório");
        if (!password.trim()) setPasswordError("A senha é obrigatória");
        if (!recaptchaToken) setRecaptchaError("Valide o reCAPTCHA");
        return { type: "CredentialsSignin", error: "Erro de validação" };
      }

      // Faz o login enviando o token junto
      await login(email, password, recaptchaToken);

      // Se passou, exibe sucesso
      setSnackbarMessage("Login realizado com sucesso!");
      setOpenSnackbar(true);
      recaptchaRef.current?.reset();

      setTimeout(() => navigate("/"), 1000);
      return { type: "CredentialsSignin" };
    } catch (err: any) {
      const backendErrors = err?.response?.data?.errors;

      if (Array.isArray(backendErrors)) {
        backendErrors.forEach((e: any) => {
          const msg = String(e?.message || "Erro de validação");
          if (e.field === "email") setEmailError(msg);
          else if (e.field === "password") setPasswordError(msg);
          else if (e.field === "recaptcha") setRecaptchaError(msg);
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
                emailField: {
                  autoFocus: true,
                  helperText: emailError,
                  error: !!emailError,
                },
                passwordField: {
                  helperText: passwordError,
                  error: !!passwordError,
                },
              }}
            />

            {/* reCAPTCHA */}
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <ReCAPTCHA ref={recaptchaRef} sitekey={RECAPTCHA_SITE_KEY} />
              {recaptchaError && (
                <p style={{ color: "red", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                  {recaptchaError}
                </p>
              )}
            </div>

            {/* Snackbar */}
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
}
