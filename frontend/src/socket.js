import { io } from "socket.io-client";

// Use the Render backend URL here
export const socket = io("https://gigflow-backend-a3ke.onrender.com", {
  withCredentials: true, // allow cookies if backend uses them
});

// Log connection
socket.on("connect", () => {
  console.log("Connected to Socket.IO server:", socket.id);
});

// Listen for new bids
socket.on("newBid", (data) => {
  console.log("New bid received:", data);
});

// Function to place a bid
export const placeBid = (bid) => {
  socket.emit("bidPlaced", bid);
};
