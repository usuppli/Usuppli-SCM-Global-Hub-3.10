
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User, ChatMessage, ChatThread, Language } from '../../types';
import { translations } from '../../translations';

// --- ICONS ---
const SendIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>);
const SearchIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const AttachmentIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>);
const MoreIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>);
const MinimizeIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>);
const XIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>);
const PopOutIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>);
const GroupIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
const MicIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>);
const StopIcon = ({ className }: { className: string }) => (<svg className={className} fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>);
const DocumentIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>);
const PlayIcon = ({ className }: { className: string }) => (<svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>);
const ResizeGripIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-12.728 12.728M18.364 11.293l-7.071 7.071M18.364 16.95l-1.414 1.414" /></svg>);
const TrashIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const WhatsAppIcon = ({ className }: { className: string }) => (<svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.237a9.994 9.994 0 004.779 1.218h.004c5.505 0 9.988-4.478 9.99-9.984 0-2.669-1.037-5.176-2.922-7.062A9.935 9.935 0 0012.012 2z" /></svg>);
const WeChatIcon = ({ className }: { className: string }) => (<svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M8.5,3C5.5,3,3,5.2,3,8c0,1.5,0.7,2.9,1.9,3.8L4.5,14l2.5-1.3c0.5,0.1,1,0.2,1.5,0.2c0-0.3,0-0.6,0-1 c0-3.3,2.9-6,6.5-6c0.6,0,1.2,0.1,1.8,0.2C15.9,4.2,12.5,3,8.5,3z M15,7c-3,0-5.5,2.2-5.5,5s2.5,5,5.5,5c0.5,0,1-0.1,1.4-0.2L19,18l-0.4-2.3 c1.1-0.9,1.9-2.2,1.9-3.7C20.5,9.2,18,7,15,7z" /></svg>);
const EmailIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const SMSIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>);

const STYLES = {
  inputBase: "w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-100 placeholder:text-slate-400 outline-none transition-all duration-200",
  inputFocus: "focus:bg-white dark:focus:bg-slate-900 focus:border-[#003d5b] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#003d5b]/20",
};

interface ChatContentProps {
  currentUser: User;
  users: User[];
  lang: Language;
  threads: ChatThread[];
  messages: Record<string, ChatMessage[]>;
  activeThreadId: string | null;
  onSelectThread: (id: string) => void;
  onSendMessage: (text: string, isAudio: boolean) => void;
  onFileUpload: (file: File) => void;
  onDeleteMessage: (msgId: string) => void;
  onShowNotification: (msg: string) => void;
  isPoppedOut: boolean;
  onPopOut?: () => void;
  onClose?: () => void;
  onMinimize?: () => void;
  dragHandleProps?: any; 
  notificationToast?: string | null;
}

const ChatContent: React.FC<ChatContentProps> = ({ 
  currentUser, users, lang, threads, messages, activeThreadId, 
  onSelectThread, onSendMessage, onFileUpload, onDeleteMessage, onShowNotification,
  isPoppedOut, onPopOut, onClose, onMinimize, dragHandleProps, notificationToast
}) => {
  // CRASH PROTECTION: Fallback if translation key is missing
  const t = (translations[lang] || translations['en'])?.teamChat || translations['en'].teamChat;

  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeThread = threads.find(t => t.id === activeThreadId);
  const currentMessages = activeThreadId ? (messages[activeThreadId] || []) : [];
  
  const filteredThreads = threads.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const groupThreads = filteredThreads.filter(t => t.type === 'group');
  const directThreads = filteredThreads.filter(t => t.type === 'direct');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, activeThreadId]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!inputText.trim() && !isRecording)) return;
    onSendMessage(inputText, isRecording);
    setInputText('');
    setIsRecording(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileUpload(e.target.files[0]);
      e.target.value = ''; 
    }
  };

  const handleShare = (platform: 'whatsapp' | 'email' | 'sms' | 'wechat') => {
    if (!currentMessages.length) return;
    const lastMsg = currentMessages[currentMessages.length - 1];
    const text = `[Team Chat] ${currentUser.name} shared: "${lastMsg.text || '[Attachment]'}"`;
    setMenuOpen(false);
    if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    else if (platform === 'email') window.open(`mailto:?subject=Chat Log&body=${encodeURIComponent(text)}`, '_blank');
    else if (platform === 'sms') window.open(`sms:?&body=${encodeURIComponent(text)}`, '_blank');
    else if (platform === 'wechat') {
      navigator.clipboard.writeText(text).then(() => onShowNotification(t?.copied || "Copied"));
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl relative">
      
      {notificationToast && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-slate-800 dark:bg-slate-700 text-white px-4 py-2 rounded-xl shadow-lg z-50 text-xs font-bold animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          {notificationToast}
        </div>
      )}

      <div 
        {...dragHandleProps}
        className={`bg-slate-900 dark:bg-slate-950 text-white p-4 flex justify-between items-center select-none ${!isPoppedOut ? 'cursor-grab active:cursor-grabbing' : ''}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white/10 rounded-lg"><GroupIcon className="w-5 h-5" /></div>
          <h3 className="font-bold text-sm">{t?.title || "Team Chat"}</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {!isPoppedOut && (
            <button onClick={onPopOut} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><PopOutIcon className="w-4 h-4" /></button>
          )}
          {!isPoppedOut && (
             <button onClick={onMinimize} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><MinimizeIcon className="w-4 h-4" /></button>
          )}
          {!isPoppedOut && (
            <button onClick={onClose} className="p-2 hover:bg-red-500/80 rounded-lg transition-colors"><XIcon className="w-4 h-4" /></button>
          )}
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        <div className="w-72 bg-slate-50 dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800 flex flex-col">
          <div className="p-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <SearchIcon className="w-3.5 h-3.5" />
              </div>
              <input 
                type="text" 
                placeholder={t?.channels} // Use safe fallback
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${STYLES.inputBase} ${STYLES.inputFocus} pl-9 pr-3 text-xs`}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
            <div>
              <h4 className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{t?.channels || "Channels"}</h4>
              <div className="space-y-1">
                {groupThreads.map(thread => (
                  <button key={thread.id} onClick={() => onSelectThread(thread.id)} className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-3 transition-colors ${activeThreadId === thread.id ? 'bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50'}`}>
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center"><GroupIcon className="w-4 h-4" /></div>
                    <div className="flex-1 min-w-0"><div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{thread.name}</span>{thread.unreadCount > 0 && <span className="bg-indigo-500 text-white text-[9px] font-bold px-1.5 rounded-full">{thread.unreadCount}</span>}</div></div>
                  </button>
                ))}
              </div>
            </div>
            <div>
               <h4 className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{t?.directMessages || "Direct Messages"}</h4>
               <div className="space-y-1">
                 {directThreads.map(thread => (
                   <button key={thread.id} onClick={() => onSelectThread(thread.id)} className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-3 transition-colors ${activeThreadId === thread.id ? 'bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50'}`}>
                     <div className="relative"><div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center text-[10px] font-bold">{thread.name.charAt(0)}</div>{thread.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-50 dark:border-slate-900 rounded-full"></div>}</div>
                     <div className="flex-1 min-w-0"><div className="flex justify-between items-center mb-0.5"><span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{thread.name}</span>{thread.unreadCount > 0 && <span className="bg-blue-500 text-white text-[9px] font-bold px-1.5 rounded-full">{thread.unreadCount}</span>}</div><p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{thread.isTyping ? <span className="text-emerald-500">{t?.typing || "Typing..."}</span> : thread.lastMessage}</p></div>
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 relative">
          {activeThreadId ? (
            <>
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur z-10 relative">
                <div className="flex items-center gap-3">
                  {activeThread?.type === 'group' ? <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center"><GroupIcon className="w-5 h-5" /></div> : <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center text-sm font-bold">{activeThread?.name.charAt(0)}</div>}
                  <div><h3 className="font-bold text-slate-800 dark:text-white text-sm">{activeThread?.name}</h3><p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{activeThread?.type === 'group' ? '3 members' : (activeThread?.isOnline ? t?.online : t?.offline)}</p></div>
                </div>
                <div className="relative">
                  <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"><MoreIcon className="w-5 h-5" /></button>
                  {menuOpen && (
                    <div className="absolute right-0 top-12 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-100 dark:border-slate-700 p-2 w-48 z-50">
                      <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-50 dark:border-slate-700 mb-1">{t?.shareVia || "Share Via"}</p>
                      <button onClick={() => handleShare('wechat')} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-200"><div className="text-emerald-500"><WeChatIcon className="w-4 h-4" /></div> WeChat</button>
                      <button onClick={() => handleShare('whatsapp')} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-200"><div className="text-green-500"><WhatsAppIcon className="w-4 h-4" /></div> WhatsApp</button>
                      <button onClick={() => handleShare('email')} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-200"><div className="text-blue-500"><EmailIcon className="w-4 h-4" /></div> Email</button>
                      <button onClick={() => handleShare('sms')} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-200"><div className="text-slate-500"><SMSIcon className="w-4 h-4" /></div> SMS</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
                 {currentMessages.map((msg, idx) => {
                   const isMe = msg.senderId === currentUser.id;
                   const sender = users.find(u => u.id === msg.senderId);
                   return (
                     <div key={msg.id} className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'} group`}>
                       {!isMe && <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white bg-slate-400 dark:bg-slate-600">{sender ? sender.name.charAt(0) : '?'}</div>}
                       <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'} relative`}>
                          <div className={`px-4 py-2.5 text-xs font-medium shadow-sm overflow-hidden ${isMe ? 'bg-slate-900 dark:bg-blue-600 text-white rounded-2xl rounded-tr-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-700'}`}>
                             {msg.attachment ? (
                               <div className="flex flex-col gap-2">
                                 {msg.attachment.type === 'image' && <img src={msg.attachment.url} alt="attachment" className="rounded-lg max-h-48 object-cover border border-white/10" />}
                                 {msg.attachment.type === 'file' && <div className="flex items-center gap-3 bg-black/5 dark:bg-black/20 p-2 rounded-lg min-w-[200px]"><div className="bg-white dark:bg-slate-700 p-2 rounded text-slate-500 dark:text-slate-300"><DocumentIcon className="w-5 h-5" /></div><div className="flex-1 min-w-0"><p className="font-bold truncate text-[11px]">{msg.attachment.name}</p><p className="text-[9px] opacity-60">{msg.attachment.size}</p></div></div>}
                                 {msg.attachment.type === 'audio' && <div className="flex items-center gap-3 bg-black/5 dark:bg-black/20 p-2 rounded-lg min-w-[160px]"><div className="bg-white dark:bg-slate-700 p-2 rounded-full text-slate-900 dark:text-white"><PlayIcon className="w-4 h-4" /></div><div className="flex-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full overflow-hidden"><div className="h-full w-1/3 bg-slate-900 dark:bg-blue-500"></div></div><span className="text-[10px] font-bold">{msg.attachment.duration}</span></div>}
                               </div>
                             ) : msg.text}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[9px] font-bold text-slate-300 dark:text-slate-600 px-1 opacity-0 group-hover:opacity-100 transition-opacity">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                             <button onClick={() => onDeleteMessage(msg.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 dark:text-slate-600 hover:text-red-500 p-0.5" title={t?.deleteMsg}><TrashIcon className="w-3 h-3" /></button>
                          </div>
                       </div>
                     </div>
                   );
                 })}
                 {activeThread?.isTyping && <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom-2"><div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-[9px] font-bold text-white">...</div><div className="bg-white dark:bg-slate-800 px-3 py-2.5 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-1"><div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></div><div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-75"></div><div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-150"></div></div></div>}
                 <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <form onSubmit={handleSend} className="flex gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-[1.2rem] border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-[#003d5b]/10 dark:focus-within:ring-blue-500/20 transition-all items-center">
                   <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*,.pdf,.docx,.doc,.txt" />
                   <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><AttachmentIcon className="w-4 h-4" /></button>
                   
                   {isRecording ? (
                      <div className="flex-1 flex items-center gap-3 px-3 py-1 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400 animate-pulse">
                         <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div><span className="text-xs font-bold">{t?.recording || "Recording..."}</span><div className="flex-1"></div><button type="button" onClick={() => setIsRecording(false)} className="text-[10px] font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">{t?.cancel || "Cancel"}</button>
                      </div>
                   ) : (
                      <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder={t?.typeMessage || "Type a message..."} className="flex-1 bg-transparent border-none focus:ring-0 text-xs font-medium text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none" />
                   )}

                   {(inputText.trim() || isRecording) ? (
                      <button type="submit" className={`p-2.5 text-white rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg ${isRecording ? 'bg-red-500' : 'bg-[#003d5b] dark:bg-blue-600'}`}>{isRecording ? <StopIcon className="w-4 h-4" /> : <SendIcon className="w-4 h-4" />}</button>
                   ) : (
                      <button type="button" onClick={() => setIsRecording(true)} className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><MicIcon className="w-5 h-5" /></button>
                   )}
                </form>
            </div>
          </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
               <div className="w-20 h-20 rounded-[2rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4"><SendIcon className="w-8 h-8 text-slate-200 dark:text-slate-700" /></div>
               <h3 className="text-lg font-black text-slate-800 dark:text-slate-200">{t?.title || "Team Chat"}</h3>
               <p className="text-xs font-bold mt-1 text-slate-400 dark:text-slate-500">Select a thread to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN CONTAINER ---
interface TeamChatProps {
  currentUser: User;
  users: User[];
  lang: Language;
  isOpen?: boolean;
  isMinimized?: boolean;
  onMinimize?: () => void;
  onClose?: () => void;
  onUnreadChange?: (count: number) => void;
  setGlobalMessages?: React.Dispatch<React.SetStateAction<Record<string, ChatMessage[]>>>;
}

const TeamChat: React.FC<TeamChatProps> = ({ currentUser, users, lang, isOpen, isMinimized, onMinimize, onClose, onUnreadChange, setGlobalMessages }) => {
  const t = (translations[lang] || translations['en'])?.teamChat || translations['en'].teamChat;
  const GROUP_ID = 'team-general';

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [isPoppedOut, setIsPoppedOut] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const externalWindow = useRef<Window | null>(null);

  const [size, setSize] = useState({ w: 800, h: 600 });
  const [position, setPosition] = useState({ x: window.innerWidth - 850, y: window.innerHeight - 650 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);

  const [threads, setThreads] = useState<ChatThread[]>(() => {
    const dms = users.filter(u => u.id !== currentUser.id).map((u, i) => ({
      id: u.id, name: u.name, type: 'direct' as const, unreadCount: i===0?2:0, lastMessage: i===0?"Did you approve the sample?":"Thanks for the update.", lastMessageTime: new Date(Date.now()-10000000*(i+1)), isOnline: i<2
    }));
    return [{ id: GROUP_ID, name: t?.teamGeneral || "General Team", type: 'group', unreadCount: 5, lastMessage: "Please check the new logistics report.", lastMessageTime: new Date(Date.now()-300000), isOnline: true }, ...dms];
  });
  
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    [users[0]?.id || '']: [
      { id: '1', senderId: users[0]?.id || '', text: "Hey, looking at the Q3 production plan.", timestamp: new Date(Date.now()-86400000), isRead: true },
      { id: '2', senderId: currentUser.id, text: "I've uploaded the new specs to the dashboard.", timestamp: new Date(Date.now()-80000000), isRead: true },
      { id: '3', senderId: users[0]?.id || '', text: "Great. Did you approve the sample?", timestamp: new Date(Date.now()-100000), isRead: false },
    ],
    [GROUP_ID]: [{ id: 'g1', senderId: users[1]?.id, text: "Welcome everyone.", timestamp: new Date(Date.now()-999999), isRead: true }]
  });

  useEffect(() => {
      (window as any).clearAllChatHistory = () => {
          setMessages({});
          setThreads(prev => prev.map(t => ({...t, lastMessage: '', unreadCount: 0})));
      };
  }, []);

  useEffect(() => {
      const totalUnread = threads.reduce((acc, t) => acc + t.unreadCount, 0);
      if (onUnreadChange) onUnreadChange(totalUnread);
  }, [threads, onUnreadChange]);

  const showNotification = (msg: string) => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendMessage = (text: string, isAudio: boolean) => {
      if (!activeThreadId) return;
      const msg: ChatMessage = {
          id: Date.now().toString(),
          senderId: currentUser.id,
          text: isAudio ? "" : text,
          timestamp: new Date(),
          isRead: true,
          attachment: isAudio ? { type: 'audio', url: '#', duration: '0:12', name: 'Audio' } : undefined
      };
      addMessage(msg);
  };

  const handleFileUpload = (file: File) => {
      if (!activeThreadId) return;
      const objectUrl = URL.createObjectURL(file);
      const isImage = file.type.startsWith('image/');
      const msg: ChatMessage = {
          id: Date.now().toString(),
          senderId: currentUser.id,
          text: "", timestamp: new Date(), isRead: true,
          attachment: { type: isImage ? 'image' : 'file', url: objectUrl, name: file.name, size: (file.size/1024/1024).toFixed(2)+' MB', mimeType: file.type }
      };
      addMessage(msg);
  };

  const handleDeleteMessage = (msgId: string) => {
      if (!activeThreadId) return;
      setMessages(prev => ({
          ...prev,
          [activeThreadId]: prev[activeThreadId].filter(m => m.id !== msgId)
      }));
  };

  const addMessage = (msg: ChatMessage) => {
      if(!activeThreadId) return;
      setMessages(p => ({...p, [activeThreadId]: [...(p[activeThreadId]||[]), msg]}));
      setThreads(p => p.map(t => t.id === activeThreadId ? {...t, lastMessage: msg.attachment?'[Attachment]':msg.text, lastMessageTime: new Date()} : t));
      simulateReply(activeThreadId);
  };

  const simulateReply = (threadId: string) => {
      setTimeout(() => setThreads(p => p.map(t => t.id===threadId?{...t, isTyping: true}:t)), 1500);
      setTimeout(() => {
          setThreads(p => p.map(t => t.id===threadId?{...t, isTyping: false}:t));
          const reply: ChatMessage = { id: Date.now().toString(), senderId: threadId===GROUP_ID?users[1].id:threadId, text: "Got it!", timestamp: new Date(), isRead: false };
          setMessages(p => ({...p, [threadId]: [...(p[threadId]||[]), reply]}));
          setThreads(p => p.map(t => t.id === threadId ? { ...t, lastMessage: "Got it!", lastMessageTime: new Date(), unreadCount: activeThreadId !== threadId ? t.unreadCount + 1 : 0 } : t));
      }, 3500);
  };

  const handleSelectThread = (id: string) => {
      setActiveThreadId(id);
      setThreads(prev => prev.map(t => t.id === id ? { ...t, unreadCount: 0 } : t));
  };

  const handlePopOut = () => {
      const w = window.open('', 'TeamChat', 'width=800,height=600,left=100,top=100,popup=yes,toolbar=no,menubar=no,scrollbars=no,status=no,location=no'); 
      if (w) {
          externalWindow.current = w;
          w.document.title = "Team Chat";
          Array.from(document.styleSheets).forEach(styleSheet => {
            try {
              if (styleSheet.href) {
                const link = w.document.createElement('link');
                link.rel = 'stylesheet';
                link.href = styleSheet.href;
                w.document.head.appendChild(link);
              } else if (styleSheet.cssRules) {
                 const style = w.document.createElement('style');
                 Array.from(styleSheet.cssRules).forEach(rule => style.appendChild(document.createTextNode(rule.cssText)));
                 w.document.head.appendChild(style);
              }
            } catch (e) {}
          });
          const style = w.document.createElement('style');
          style.textContent = `html, body { height: 100%; margin: 0; padding: 0; overflow: hidden; background-color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; } #root { height: 100%; } .dark body { background-color: #020617; }`;
          w.document.head.appendChild(style);
          const script = w.document.createElement('script');
          script.src = "https://cdn.tailwindcss.com";
          w.document.head.appendChild(script);
          w.onbeforeunload = () => { setIsPoppedOut(false); externalWindow.current = null; };
          setIsPoppedOut(true);
      }
  };

  useEffect(() => {
      if(!isOpen || isMinimized || isPoppedOut) return;
      const onMove = (e: MouseEvent) => {
          if(isDragging) setPosition({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
          if(isResizing) setSize({ w: Math.max(600, e.clientX - position.x), h: Math.max(400, e.clientY - position.y) });
      };
      const onUp = () => { setIsDragging(false); setIsResizing(false); };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
      return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [isDragging, isResizing, dragOffset, position, isOpen, isMinimized, isPoppedOut]);

  const handleHeaderDown = (e: React.MouseEvent) => {
      if((e.target as HTMLElement).closest('button')) return;
      setIsDragging(true);
      setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  if (!isOpen) return null;

  if (isMinimized && !isPoppedOut) {
      const totalUnread = threads.reduce((acc,t) => acc+t.unreadCount, 0);
      return (
          <button onClick={onMinimize} className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-800 text-white rounded-full p-4 shadow-2xl flex items-center gap-3 hover:scale-105 transition-all">
               <div className="relative">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                   {totalUnread > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-slate-900"></span>}
               </div>
               <span className="font-bold pr-2">{t?.title || "Team Chat"}</span>
          </button>
      )
  }

  if (isPoppedOut && externalWindow.current) {
      return createPortal(
          <div className="h-full w-full bg-slate-50 dark:bg-slate-950 flex flex-col p-4">
               <ChatContent 
                   currentUser={currentUser} users={users} lang={lang} 
                   threads={threads} messages={messages} activeThreadId={activeThreadId}
                   onSelectThread={handleSelectThread} onSendMessage={handleSendMessage} onFileUpload={handleFileUpload} onDeleteMessage={handleDeleteMessage}
                   onShowNotification={showNotification}
                   isPoppedOut={true} notificationToast={toastMessage}
               />
          </div>,
          externalWindow.current.document.body
      );
  }

  return (
      <div style={{ left: position.x, top: position.y, width: size.w, height: size.h }} className="fixed z-50 rounded-[2rem] shadow-2xl overflow-hidden">
          <ChatContent 
               currentUser={currentUser} users={users} lang={lang} 
               threads={threads} messages={messages} activeThreadId={activeThreadId}
               onSelectThread={handleSelectThread} onSendMessage={handleSendMessage} onFileUpload={handleFileUpload} onDeleteMessage={handleDeleteMessage}
               onShowNotification={showNotification}
               isPoppedOut={false} onPopOut={handlePopOut} onClose={onClose} onMinimize={onMinimize}
               dragHandleProps={{ onMouseDown: handleHeaderDown }}
               notificationToast={toastMessage}
           />
          <div onMouseDown={(e)=>{e.stopPropagation(); setIsResizing(true);}} className="absolute bottom-2 right-2 cursor-se-resize text-slate-400 p-2 hover:text-slate-600 z-50">
              <ResizeGripIcon className="w-5 h-5" />
          </div>
      </div>
  );
};

export default TeamChat;