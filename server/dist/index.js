"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
require('dotenv').config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});
app.use(express_1.default.json());
// Store notes for each room
const rooms = {};
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    // Join a room
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        // Send current notes for the room
        socket.emit('current_notes', rooms[roomId] || []);
    });
    // Handle note updates
    socket.on('update_notes', (roomId, notes) => {
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
