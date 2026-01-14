import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http"; // For Socket.IO
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import gigRoutes from "./routes/gig.routes.js";
import bidRoutes from "./routes/bid.routes.js";

dotenv.config();
connectDB();

const app = express();

// Parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Allowed origins for CORS
const allowedOrigins = [

  "https://iridescent-starlight-5a23d6.netlify.app/", // Netlify frontend
];

// CORS for HTTP API
// Enable CORS for allowed origins and send cookies
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (!allowedOrigins.includes(origin)) {
        return callback(
          new Error(`CORS policy: The origin ${origin} is not allowed.`),
          false
        );
      }
      // Origin is allowed
      return callback(null, true);
    },
    credentials: true, // This allows sending cookies cross-domain
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
    origin: allowedOrigins, // only allow these origins
    methods: ["GET", "POST"],
    credentials: true, // allow sending cookies cross-domain
  },
});

// Make io accessible in controllers if needed
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
