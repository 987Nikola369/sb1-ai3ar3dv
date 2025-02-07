import { Server } from 'socket.io';
import { db } from './db';

export function setupWebSockets(io: Server) {
  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('join-room', (roomId: string) => {
      socket.join(roomId);
    });

    socket.on('leave-room', (roomId: string) => {
      socket.leave(roomId);
    });

    socket.on('send-message', async (data) => {
      // Handle message sending
      io.to(data.roomId).emit('new-message', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
}