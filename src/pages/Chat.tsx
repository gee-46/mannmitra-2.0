import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowRight } from 'lucide-react';
import { ChatMessage } from '../types';
import CrisisSupportCard from '../components/CrisisSupportCard';
import PageWrapper from '../components/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { generateChatbotResponse } from '../lib/chatbot';

const Chat = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, text: `Hello ${user?.name}! I'm MannMitra, your mental wellness companion. How are you feeling today?`, sender: 'ai' }
  ]);
  const [memorySize] = useState(8);
  const [showPrompts, setShowPrompts] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage: ChatMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // build context from last messages
    const recent = [...messages].slice(-memorySize).map(m => `${m.sender}: ${m.text}`).join('\n');
    const aiResponse = await generateChatbotResponse(input, recent);
    const aiMessage: ChatMessage = { id: Date.now() + 1, ...aiResponse };
    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const promptList = [
    "Help me reframe a negative thought",
    "Let's do a quick gratitude exercise",
    "Can you suggest a strategy for stress?",
  ];

  const sendPrompt = (p: string, sendDirect = false) => {
    if (sendDirect) {
      setInput(p);
      // allow small delay to set input and send
      setTimeout(() => {
        const evt = new Event('submit', { bubbles: true });
        // just set input and let user press send (keeping safe)
      }, 50);
    } else {
      setInput(p);
      setShowPrompts(false);
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col h-[calc(100vh-8rem)] pt-6">
        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.isCrisisCard ? (
                  <CrisisSupportCard />
                ) : (
                  <div>
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${msg.sender === 'user' ? 'bg-gradient-to-br from-primary to-cyan-400 text-primary-foreground rounded-br-lg' : 'bg-card backdrop-blur-lg border border-white/10 text-foreground rounded-bl-lg'}`}>
                      {msg.text}
                    </div>
                    {msg.action && msg.sender === 'ai' && (
                      <button
                        onClick={() => navigate(msg.action!.path)}
                        className="mt-2 flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors border border-primary/30"
                      >
                        <ArrowRight size={16} />
                        {msg.action.label}
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-card backdrop-blur-lg border border-white/10 text-foreground rounded-2xl rounded-bl-lg px-4 py-3">
                <div className="flex items-center space-x-1">
                  <span className="h-2 w-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-secondary rounded-full animate-bounce"></span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <form onSubmit={handleSend} className="flex items-center space-x-2 bg-card backdrop-blur-lg border border-white/10 rounded-full p-2 shadow-sm flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chat_page.placeholder')}
                className="flex-1 bg-transparent focus:outline-none px-3 text-foreground"
              />
              <button type="submit" className="bg-primary text-primary-foreground rounded-full p-3 hover:bg-primary/90 transition-colors transform hover:scale-110">
                <Send className="w-5 h-5" />
              </button>
            </form>

            <div className="relative">
              <button onClick={() => setShowPrompts(s => !s)} className="bg-card border border-white/10 rounded-full p-2 text-secondary hover:text-primary">
                Prompts
              </button>
              {showPrompts && (
                <div className="absolute right-0 mt-2 w-64 bg-card border border-white/10 rounded-lg p-3 shadow-lg">
                  <p className="text-sm text-secondary mb-2">Try a prompt</p>
                  <div className="flex flex-col gap-2">
                    {promptList.map(p => (
                      <button key={p} onClick={() => sendPrompt(p)} className="text-left p-2 rounded-md hover:bg-white/5 text-foreground">{p}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Chat;
