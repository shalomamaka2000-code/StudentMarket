// src/pages/Chat.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { Send } from 'lucide-react';
import './Chat.css';

const Chat: React.FC = () => {
  const { peerId } = useParams<{ peerId: string }>();
  const { messages, send } = useChat(peerId);
  const [text, setText] = useState('');

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;
    send(text.trim());
    setText('');
  };

  return (
    <div className="chat-page">
      <h1 className="cozy-headline">Chat</h1>
      <div className="chat-window cozy-card">
        {messages.map(m => (
          <div key={m._id} className={`bubble ${m.sender === peerId ? 'peer' : 'me'}`}>
            <p>{m.content}</p>
            <span>{new Date(m.createdAt).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="chat-input-row">
        <input className="cozy-input" value={text} onChange={e => setText(e.target.value)}
               placeholder="Type a message…" />
        <button className="cozy-btn" type="submit"><Send size={18} /></button>
      </form>
    </div>
  );
};

export default Chat;