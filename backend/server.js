import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import gigRoutes from "./routes/gig.routes.js";
import bidRoutes from "./routes/bid.routes.js";

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://iridescent-starlight-5a23d6.netlify.app"
];

// CORS for Express
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: The origin ${origin} is not allowed.`), false);
      }
    },
    credentials: true, // Allow cookies
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Only allow these origins
    methods: ["GET", "POST"],
    credentials: true, // Allow cookies
  },
});

// Make io accessible in controllers
app.locals.io = io;

// Socket.IO events
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Join user-specific room
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  // Listen for bid placements
  socket.on("bidPlaced", (data) => {
    console.log("Bid received:", data);
    // Broadcast to all other clients except sender
    socket.broadcast.emit("newBid", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Backend running on port ${PORT} with Socket.IO`)
);
