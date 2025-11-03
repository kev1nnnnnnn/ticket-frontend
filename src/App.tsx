// src/App.tsx
import { RouterProvider } from "react-router";
import { router } from "./router/router";

// 👇 Importações necessárias para o DatePicker do MUI
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ptBR } from "@mui/x-date-pickers/locales";

function App() {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText}
    >
      <RouterProvider router={router} />
    </LocalizationProvider>
  );
}

export default App;
