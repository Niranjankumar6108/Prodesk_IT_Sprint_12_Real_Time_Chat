require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT) || 5000;
const CLIENT_URL = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map(url => url.trim())
  : ["http://localhost:5173"];
const ROOMS = ["General", "Tech Support"];
const users = new Map();

app.use(cors({
  origin: CLIENT_URL,
  methods: ["GET", "POST"]
}));

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.get("/", (_req, res) => res.json({
  success: true,
  message: "Sprint 12 Real-Time Chat API is running",
  socket: "Socket.IO enabled",
  rooms: ROOMS
}));
app.get("/health", (_req, res) => res.json({ success: true, status: "healthy" }));

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.emit("server:welcome", { message: "Connected", socketId: socket.id });

  socket.on("room:join", (payload = {}, callback) => {
    const username = String(payload.username || "").trim().slice(0, 24);
    const room = String(payload.room || "");
    if (!username || !ROOMS.includes(room)) {
      if (typeof callback === "function") callback({ success: false, message: "Enter a name and choose a valid room." });
      return;
    }
    const old = users.get(socket.id);
    if (old) {
      socket.leave(old.room);
      socket.to(old.room).emit("user:left", { username: old.username, room: old.room });
    }
    users.set(socket.id, { username, room });
    socket.join(room);
    socket.emit("room:joined", { username, room });
    socket.to(room).emit("user:joined", { username, room });
    console.log(`${username} joined ${room}`);
    if (typeof callback === "function") callback({ success: true });
  });

  socket.on("chat:message", (payload = {}, callback) => {
    const user = users.get(socket.id);
    const text = String(payload.text || "").trim().slice(0, 2000);
    if (!user || !text) {
      if (typeof callback === "function") callback({ success: false, message: "Join a room and enter a message." });
      return;
    }
    const message = {
      id: `${Date.now()}-${socket.id}`,
      username: user.username,
      room: user.room,
      text,
      createdAt: new Date().toISOString()
    };
    io.to(user.room).emit("chat:message", message);
    if (typeof callback === "function") callback({ success: true });
  });

  socket.on("typing:start", () => {
    const user = users.get(socket.id);
    if (user) socket.to(user.room).emit("typing:update", { username: user.username, room: user.room, isTyping: true });
  });
  socket.on("typing:stop", () => {
    const user = users.get(socket.id);
    if (user) socket.to(user.room).emit("typing:update", { username: user.username, room: user.room, isTyping: false });
  });

  socket.on("disconnect", () => {
    const user = users.get(socket.id);
    if (user) {
      socket.to(user.room).emit("typing:update", { username: user.username, room: user.room, isTyping: false });
      socket.to(user.room).emit("user:left", { username: user.username, room: user.room });
      users.delete(socket.id);
    }
    console.log("Client disconnected:", socket.id);
  });
});
server.listen(PORT, () => console.log(`Sprint 12 Chat Server running at http://localhost:${PORT}`));
