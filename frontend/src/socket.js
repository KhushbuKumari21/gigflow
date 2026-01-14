import { io } from "socket.io-client";

export const socket = io("https://gigflow-backend-a3ke.onrender.com", {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Connected to Socket.IO server:", socket.id);
});

socket.on("newBid", (data) => {
  console.log("New bid received:", data);
});

export const placeBid = (bid) => {
  socket.emit("bidPlaced", bid);
};
