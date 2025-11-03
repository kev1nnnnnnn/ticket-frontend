// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useAuth } from "../../hooks/useAuth";
import DrawerList from "../../components/drawer/DrawerList";

import {
  getDashboardStatus,
  getDashboardPrioridade,
  getDashboardUltimos7Dias,
  getDashboardTempoMedio,
} from "../../api/dashboard";

import type {
  DashboardStatus,
  DashboardPrioridade,
  DashboardUltimosDias,
  DashboardTempoMedio,
} from "../../api/dashboard";

// Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const drawerWidth = 240;
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

export default function Dashboard() {
  const { user, logout, loading } = useAuth();

  const [statusData, setStatusData] = useState<DashboardStatus[]>([]);
  const [prioridadeData, setPrioridadeData] = useState<DashboardPrioridade[]>([]);
  const [ultimos7Data, setUltimos7Data] = useState<DashboardUltimosDias[]>([]);
  const [tempoMedio, setTempoMedio] = useState<DashboardTempoMedio | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [status, prioridade, ultimos7, tempo] = await Promise.all([
          getDashboardStatus(),
          getDashboardPrioridade(),
          getDashboardUltimos7Dias(),
          getDashboardTempoMedio(),
        ]);

        setStatusData(status);
        setPrioridadeData(prioridade);
        setUltimos7Data(ultimos7);
        setTempoMedio(tempo);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <p>Carregando...</p>;
  if (!user) return null;

  return (
    <Box sx={{ display: "" }}>
      {/* Drawer fixo */}
      <DrawerList onLogout={logout} />

      {/* Conteúdo principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f5f6fa",
          p: 3,
          marginLeft: `${drawerWidth}px`,
          minHeight: "100vh",
        }}
      >
        <Typography variant="h4" gutterBottom>
          🏠 Dashboard
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Bem-vindo, {user.fullName}!
        </Typography>

        {/* Tempo Médio */}
        {tempoMedio && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6">⏱ Tempo Médio de Resolução</Typography>
            <Typography variant="h4">{tempoMedio.media_horas} horas</Typography>
          </Paper>
        )}

        {/* Chamados por Status */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">📊 Chamados por Status</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={statusData.map(item => ({
                status: item.status,
                total: item.total,
              }))}
            >
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        {/* Chamados por Prioridade */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">🎯 Chamados por Prioridade</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={prioridadeData.map(item => ({
                  name: item.prioridade,
                  value: item.total,
                }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {prioridadeData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>

        {/* Chamados últimos 7 dias */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">📈 Chamados últimos 7 dias</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={ultimos7Data.map(item => ({
                data: item.data,
                total: item.total,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#1976d2" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Box>
  );
}
