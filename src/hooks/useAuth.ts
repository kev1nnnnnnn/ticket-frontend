import { useState, useEffect } from "react";
import { loginAPI, getMe } from "../api/auth";
import { useNavigate } from "react-router-dom";

// Define o tipo do usuário
export interface User {
  id: number;
  fullName: string;
  email: string;
}

export function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getMe()
        .then(setUser)
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginAPI({ email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setLoading(false);
    navigate("/login"); // redireciona corretamente
  };

  return { user, login, logout, loading };
}
