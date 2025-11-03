import { io } from "socket.io-client";

export const socket = io("http://localhost:3333", { 
  transports: ["websocket"], 
  withCredentials: true,
});

socket.on("connect", () => console.log("Conectado WS:", socket.id));
socket.on("connect_error", (error) => {
  if (socket.active) {
    // temporary failure, the socket will automatically try to reconnect
  } else {
    // the connection was denied by the server
    // in that case, `socket.connect()` must be manually called in order to reconnect
    console.log(error.message);
  }
});
socket.on("newComment", (comment) => console.log("Novo comentário:", comment));
