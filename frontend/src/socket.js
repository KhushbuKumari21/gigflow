import { io } from "socket.io-client";

export const socket = io("http://localhost:5000"); // match backend

socket.on("connect", () => {
  console.log("Connected to Socket.IO server:", socket.id);
});

socket.on("newBid", (data) => {
  console.log("New bid received:", data);
});

export const placeBid = (bid) => {
  socket.emit("bidPlaced", bid);
};
