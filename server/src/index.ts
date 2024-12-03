import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());

// Store notes for each room
const rooms: Record<string, string[]> = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a room
  socket.on('join_room', (roomId: string) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    // Send current notes for the room
    socket.emit('current_notes', rooms[roomId] || []);
  });

  // Handle note updates
  socket.on('update_notes', (roomId: string, notes: string[]) => {
    rooms[roomId] = notes; // Update the room's notes
    io.to(roomId).emit('update_notes', notes); // Broadcast to everyone in the room (including the sender)
  });
  

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
