import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { api } from '../api';

export interface ChatMessage {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  createdAt: string;
  read?: boolean;
}

export function useChat(peerId: string | undefined) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('message', (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!peerId) return;
    (async () => {
      const { data } = await api.get<ChatMessage[]>(`/chat/${peerId}`);
      setMessages(data);
    })();
  }, [peerId]);

  const send = (content: string) => {
    if (!peerId || !socketRef.current) return;
    socketRef.current.emit('send_message', { to: peerId, content }, (res: { success: boolean }) => {
      if (res.success) {
        // server will echo back via `message` event — no local push needed
      }
    });
  };

  return { messages, send };
}