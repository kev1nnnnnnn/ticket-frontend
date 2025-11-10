import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login";
import Users from "../pages/users";
import Tickets from "../pages/tickets"; 
import { GuestRoute, PrivateRoute } from "./ProtectedRoute";
import ClientsPage from "../pages/client";
import ContractsPage from "../pages/contract";
import ServiceOrdersPage from "../pages/service_order";
import EmailPage from "../pages/inbox";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Home />
      </PrivateRoute>
    ),
  },
  {
    path: "/usuarios",
    element: (
      <PrivateRoute>
        <Users />
      </PrivateRoute>
    ),
  },
  {
    path: "/tickets", 
    element: (
      <PrivateRoute>
        <Tickets />
      </PrivateRoute>
    ),
  },
  {
    path: "/clientes", 
    element: (
      <PrivateRoute>
        <ClientsPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/contratos", 
    element: (
      <PrivateRoute>
        <ContractsPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/ordem_de_servico", 
    element: (
      <PrivateRoute>
        <ServiceOrdersPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/emails", 
    element: (
      <PrivateRoute>
        <EmailPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
  },

]);
