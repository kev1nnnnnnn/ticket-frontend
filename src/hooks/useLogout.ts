// src/hooks/useLogout.ts
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const { logout: clearAuth } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    clearAuth();        // limpa token + usuário
    navigate("/login"); // redireciona
  };

  return logout;
};
