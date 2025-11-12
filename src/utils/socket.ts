// socket.ts (frontend)
import { io } from "socket.io-client";

export const socket = io("http://localhost:4000", {
  // Não force apenas websocket no início
  transports: ["polling", "websocket"],
});

socket.on("connect", () => console.log("Conectado WS:", socket.id));
socket.on("connect_error", (error) =>
  console.log("Erro de conexão WS:", error.message)
);
