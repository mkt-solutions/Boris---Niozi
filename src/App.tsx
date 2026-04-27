/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Briefcase, 
  TrendingUp, 
  Users, 
  ChevronRight, 
  MessageSquare
} from 'lucide-react';
import Markdown from 'react-markdown';
import { chatWithBoris } from './services/geminiService.ts';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: 'Olá. Sou Boris, estrategista da Niozi. Qual o maior desafio que seu negócio enfrenta hoje para crescer?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    const response = await chatWithBoris(newMessages);
    setMessages(prev => [...prev, { role: 'model', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen bg-brand-dark overflow-hidden text-slate-900">
      {/* Sidebar - Professional Profile */}
      <aside className="hidden lg:flex w-80 flex-col border-r border-slate-200 bg-brand-surface">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-6 font-display italic text-3xl text-brand-gold">
            <span>Niozi</span>
          </div>
          
          <div className="relative group">
            <div className="w-20 h-20 bg-white rounded-2xl mb-4 flex items-center justify-center border border-brand-gold/30 group-hover:border-brand-gold transition-colors overflow-hidden shadow-sm">
              <img 
                src="https://niozi.com.br/wp-content/uploads/2026/04/ICON.png" 
                alt="Boris" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          
          <h2 className="text-xl font-semibold mb-1 text-slate-900">Boris</h2>
          <p className="text-sm text-brand-gold font-medium uppercase tracking-widest mb-4">Estrategista Sênior</p>
          <p className="text-sm text-slate-500 leading-relaxed italic">
            "Transformando negócios através de sistemas de crescimento."
          </p>
        </div>

        <div className="flex-1 p-6 space-y-6">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-4">Expertise</h3>
            <div className="space-y-3">
              {[
                { label: 'Estratégia de Vendas', icon: TrendingUp },
                { label: 'Estruturação de Negócios', icon: Briefcase },
                { label: 'Comportamento Humano', icon: Users }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-slate-600">
                  <item.icon className="w-4 h-4 text-brand-gold" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <button className="w-full py-3 px-4 bg-brand-gold text-white font-bold rounded-lg text-sm transition-all hover:bg-brand-gold/90 hover:scale-[1.02] shadow-md flex items-center justify-center gap-2">
            Falar com um especialista
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative bg-white">
        {/* Mobile Header */}
        <header className="lg:hidden p-4 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-brand-gold/30 overflow-hidden">
              <img 
                src="https://niozi.com.br/wp-content/uploads/2026/04/ICON.png" 
                alt="Boris" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="font-semibold text-sm text-slate-900">Boris</h1>
              <p className="text-[10px] text-brand-purple font-bold uppercase tracking-widest">Niozi Strategist</p>
            </div>
          </div>
        </header>

        {/* Message Container */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 scroll-smooth">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[90%] md:max-w-[80%] group ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                  {msg.role === 'model' && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] uppercase font-bold tracking-tighter text-brand-purple">Boris</span>
                      <div className="h-[1px] w-4 bg-brand-purple/20"></div>
                    </div>
                  )}
                  <div className={`py-2 px-3 md:py-3 md:px-4 rounded-xl border ${
                    msg.role === 'user' 
                      ? 'bg-brand-purple text-white border-brand-purple font-medium shadow-sm' 
                      : 'bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
                  }`}>
                    <div className="markdown-body prose prose-slate text-sm max-w-none leading-tight">
                      <Markdown components={{
                        a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-brand-purple underline decoration-brand-purple/30 hover:decoration-brand-purple transition-all" />
                      }}>
                        {msg.content}
                      </Markdown>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex gap-2 items-center">
                <div className="w-2 h-2 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-8 border-t border-slate-100 bg-white">
          <div className="max-w-4xl mx-auto flex flex-col gap-3">
            <form 
              onSubmit={handleSubmit}
              className="relative flex items-center gap-4 bg-slate-50 border border-slate-200 p-2 rounded-2xl focus-within:border-brand-gold/50 transition-all shadow-sm"
            >
              <div className="pl-4 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Descreva seu desafio hoje..."
                className="flex-1 bg-transparent py-4 text-slate-800 placeholder-slate-400 focus:outline-none text-sm md:text-base"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-4 bg-brand-purple rounded-xl hover:bg-brand-purple/90 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center text-white shadow-md shadow-brand-purple/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

