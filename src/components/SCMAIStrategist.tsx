
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Loader2, AlertCircle, BrainCircuit } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { translations } from '../translations';
import { Language } from '../types';

interface Props {
  lang?: Language;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

const SCMAIStrategist: React.FC<Props> = ({ lang = 'en' }) => {
  // Safe Translation Access
  const t = (translations[lang] || translations['en'])?.ai || translations['en'].ai;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: lang === 'zh-Hans' 
        ? "你好！我是您的供应链 AI 策略师。我可以帮助您分析风险、起草供应商邮件、解读关税或集思广益采购策略。今天我能为您做什么？"
        : lang === 'zh-Hant'
        ? "你好！我是您的供應鏈 AI 策略師。我可以幫助您分析風險、起草供應商郵件、解讀關稅或集思廣益採購策略。今天我能為您做什麼？"
        : "Hello! I'm your Supply Chain AI Strategist. I can help you analyze risks, draft supplier emails, interpret tariffs, or brainstorm procurement strategies. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Always use process.env.API_KEY as per coding guidelines
      const apiKey = process.env.API_KEY || ""; 
      
      if (!apiKey) {
        // Fallback Simulation if no API key is present
        setTimeout(() => {
            const simResponse = "I am currently running in simulation mode because no API Key was detected. In a production environment, I would analyze your query: " + userMsg.text;
            setMessages((prev) => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: simResponse,
                timestamp: new Date(),
            }]);
            setIsLoading(false);
        }, 1500);
        return;
      }

      // Initialize GoogleGenAI with named parameter
      const ai = new GoogleGenAI({ apiKey });
      const systemContext = "You are an expert Supply Chain Strategist. Keep answers professional, concise, and actionable.";
      
      // Use ai.models.generateContent directly with model name and contents
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg.text,
        config: {
          systemInstruction: systemContext,
        },
      });
      const aiText = response.text || "No response generated."; // Use .text property directly

      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: aiText,
        timestamp: new Date(),
      }]);
    } catch (err) {
      console.error(err);
      setError("Connection issue. Please check your API key and network.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white">{t?.title || "SCM AI Strategist"}</h3>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t?.subtitle || "Intelligent Supply Chain Assistant"}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/30 dark:bg-slate-950/30">
        {messages.map((msg) => {
          const isModel = msg.role === 'model';
          return (
            <div key={msg.id} className={`flex gap-4 ${isModel ? 'justify-start' : 'justify-end'}`}>
              {isModel && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                  isModel
                    ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
                    : 'bg-[#003d5b] dark:bg-blue-600 text-white rounded-tr-none'
                }`}
              >
                {msg.text.split('\n').map((line, i) => (
                  <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                ))}
                <span className={`block text-[9px] mt-2 font-bold opacity-50 ${isModel ? 'text-slate-400' : 'text-blue-200'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {!isModel && (
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{t?.thinking || "Thinking..."}</span>
            </div>
          </div>
        )}
        {error && (
          <div className="flex gap-4 justify-center">
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100 dark:border-red-800">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="flex gap-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none px-4 text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400"
            placeholder={t?.promptPlaceholder || "Ask about tariffs, risks, or strategy..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-[#003d5b] dark:bg-blue-600 text-white rounded-xl hover:bg-sky-900 dark:hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SCMAIStrategist;
