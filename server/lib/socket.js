import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL],
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  const userId  = socket.handshake.userId;
  if (userId) userSocketMap[userId] = socket.id
  io.emit();
  
});

export { io, app, server };
