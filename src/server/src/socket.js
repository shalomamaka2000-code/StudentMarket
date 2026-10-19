const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');

const onlineUsers = new Map(); // userId -> socketId

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL, credentials: true },
  });

  // Authenticate every socket connection
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    onlineUsers.set(socket.userId, socket.id);
    console.log(`User connected: ${socket.userId}`);

    // send_message event
    socket.on('send_message', async ({ to, content }, ack) => {
      try {
        const message = await Message.create({
          sender: socket.userId,
          receiver: to,
          content,
        });

        const receiverSocket = onlineUsers.get(to);
        if (receiverSocket) {
          io.to(receiverSocket).emit('message', message);
        }
        if (ack) ack({ success: true, message });
      } catch (err) {
        if (ack) ack({ success: false, error: err.message });
      }
    });

    // mark as read
    socket.on('mark_read', async ({ messageId }) => {
      await Message.findByIdAndUpdate(messageId, { read: true });
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(socket.userId);
    });
  });

  return io;
}

module.exports = { initSocket };