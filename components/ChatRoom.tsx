
import React, { useState, useRef, useEffect } from 'react';
import { User, Message, Language } from '../types';

interface ChatRoomProps {
  currentUser: User;
  partner: User;
  onClose: () => void;
  language?: Language;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ currentUser, partner, onClose, language = 'en' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    const chatId = [currentUser.id, partner.id].sort().join('_');
    const saved = localStorage.getItem(`chat_${chatId}`);
    if (saved) setMessages(JSON.parse(saved));
  }, [currentUser.id, partner.id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: inputText,
      timestamp: Date.now()
    };

    const updated = [...messages, newMessage];
    setMessages(updated);
    setInputText("");

    const chatId = [currentUser.id, partner.id].sort().join('_');
    localStorage.setItem(`chat_${chatId}`, JSON.stringify(updated));

    // Simulate response for interactivity
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: partner.id,
        text: language === 'kn' ? 'ಖಂಡಿತ, ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ!' : 
              language === 'hi' ? 'ज़रूर, मैं आपकी मदद करूँगा!' : 
              'Sure, I will help you with that!',
        timestamp: Date.now()
      };
      const final = [...updated, response];
      setMessages(final);
      localStorage.setItem(`chat_${chatId}`, JSON.stringify(final));
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-[#F8FAF8] z-[120] flex flex-col animate-in slide-in-from-right duration-300">
      <header className="bg-white p-6 pt-10 shadow-sm border-b border-green-50 flex items-center gap-4">
        <button onClick={onClose} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center text-green-700 font-bold border border-green-100">
            {partner.name[0]}
          </div>
          <div>
            <h2 className="font-bold text-[#1B4332] text-sm leading-none mb-1">{partner.name}</h2>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Online</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map(msg => {
          const isMine = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-3xl text-sm shadow-sm ${
                isMine ? 'bg-[#1B4332] text-white rounded-tr-none' : 'bg-white text-gray-700 border border-green-50 rounded-tl-none'
              }`}>
                {msg.text}
                <div className={`text-[8px] mt-2 opacity-50 ${isMine ? 'text-white' : 'text-gray-400'}`}>
                   {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      <div className="p-6 bg-white border-t border-green-50">
        <form onSubmit={sendMessage} className="flex gap-3">
          <input 
            type="text" 
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
          <button 
            type="submit"
            className="w-14 h-14 bg-[#1B4332] text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
