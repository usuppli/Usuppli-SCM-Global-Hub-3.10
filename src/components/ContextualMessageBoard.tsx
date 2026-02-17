
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  MessageSquare, Search, Send, Paperclip, X, Plus, 
  MoreVertical, Building2, Package, Truck, TestTube, ArrowUpRight,
  Bell, Minus, Maximize2, Mail, MessageCircle, Copy, 
  Image as ImageIcon, FileSpreadsheet, Pin, Trash2, RotateCcw, Factory,
  PanelRight
} from 'lucide-react';
import { Customer, Job, SampleRequest, Shipment, User, Supplier, Language } from '../types'; 
import { translations } from '../translations';

// ==========================================
// TYPES
// ==========================================
export type ThreadPriority = 'urgent' | 'important' | 'normal';

export interface ThreadAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'doc' | 'spreadsheet';
  size: string;
  url: string;
}

export interface ThreadMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  text: string;
  timestamp: string;
  mentions: string[];
  attachments: ThreadAttachment[];
  isPinned: boolean;
  isEdited: boolean;
}

export interface CustomerThread {
  id: string;
  customerId: string;
  customerName: string;
  linkedOrderId?: string;
  linkedOrderType?: 'Job' | 'Sample' | 'Shipment' | 'Supplier';
  topic: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  priority: ThreadPriority;
  status: 'open' | 'resolved' | 'archived';
  isPinned?: boolean; 
  tags: string[];
  participants: string[];
  messages: ThreadMessage[];
}

interface ContextualMessageBoardProps {
  customers: Customer[];
  suppliers?: Supplier[]; 
  jobs?: Job[];
  samples?: SampleRequest[];
  shipments?: Shipment[];
  currentUser?: User | null;
  isOpen: boolean;            
  onClose: () => void;        
  onNavigateToCustomer: (customerId: string) => void;
  onNavigateToOrder: (orderId: string) => void;
  lang: Language;
}

// --- MOCK DATA ---
const MOCK_THREADS: CustomerThread[] = [
  {
    id: 't1',
    customerId: 'CUST-001',
    customerName: 'Urban Outfitters',
    linkedOrderId: 'PO-2024-8821',
    linkedOrderType: 'Job',
    topic: 'Q3 Production Delays',
    lastMessage: 'Checking with the factory manager now.',
    lastMessageTime: '10:42 AM',
    unreadCount: 2,
    priority: 'urgent',
    status: 'open',
    isPinned: true,
    tags: ['Production'],
    participants: ['Mike R.', 'Sarah J.'],
    messages: [
      { id: 'm1', authorId: 'u2', authorName: 'Sarah Jenkins', authorRole: 'Customer', text: 'Hi Mike, hearing rumors about fabric shortages.', timestamp: 'Yesterday, 4:20 PM', mentions: [], attachments: [], isPinned: false, isEdited: false },
      { id: 'm3', authorId: 'u1', authorName: 'Mike Ross', authorRole: 'Account Manager', text: 'Checking with the factory manager now.', timestamp: '10:42 AM', mentions: [], attachments: [], isPinned: false, isEdited: false }
    ]
  }
];

export default function ContextualMessageBoard({ 
  customers, suppliers = [], jobs = [], samples = [], shipments = [], currentUser,
  isOpen, onClose, onNavigateToCustomer, onNavigateToOrder, lang 
}: ContextualMessageBoardProps) {
  
  // Safe Translation Access
  const rootT = translations[lang] || translations['en'];
  const t = rootT.hub;
  const commonT = rootT.common;
  const navT = rootT.nav;

  const [threads, setThreads] = useState<CustomerThread[]>(MOCK_THREADS);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<ThreadAttachment[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedThread = useMemo(() => threads.find(t => t.id === selectedThreadId), [threads, selectedThreadId]);

  const sortedThreads = useMemo(() => {
    return [...threads].sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1))
      .filter(t => t.topic.toLowerCase().includes(filterText.toLowerCase()) || t.customerName.toLowerCase().includes(filterText.toLowerCase()));
  }, [threads, filterText]);

  const [newThreadData, setNewThreadData] = useState({
    customerId: '', topic: '', initialMessage: '', priority: 'normal' as ThreadPriority, linkedId: '', linkType: 'Job' as any
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedThread?.messages, pendingAttachments]);

  if (!isOpen) return null; 

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-[200] animate-in slide-in-from-bottom-10 fade-in duration-300">
        <button onClick={() => setIsMinimized(false)} className="bg-[#003d5b] hover:bg-[#002a40] text-white p-4 rounded-full shadow-2xl flex items-center gap-3 border border-white/20 transition-transform hover:scale-105 active:scale-95">
          <div className="relative"><MessageSquare className="w-6 h-6" /></div>
          <span className="font-bold pr-2">{t?.title || "Collaboration Hub"}</span><Maximize2 className="w-4 h-4 opacity-70" />
        </button>
      </div>
    );
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleSendMessage = () => {
    if (!newMessageText.trim() && pendingAttachments.length === 0) return;
    const msg: ThreadMessage = {
      id: `m-${Date.now()}`, authorId: currentUser?.id || 'guest', authorName: currentUser?.name || 'Me', authorRole: 'User',
      text: newMessageText, timestamp: 'Just now', mentions: [], attachments: [...pendingAttachments], isPinned: false, isEdited: false
    };
    setThreads(prev => prev.map(t => t.id === selectedThreadId ? { ...t, messages: [...t.messages, msg], lastMessage: newMessageText || 'Sent attachment' } : t));
    setNewMessageText('');
    setPendingAttachments([]);
  };

  const handleCreateThread = () => {
    if (!newThreadData.customerId || !newThreadData.topic) return;
    const customerName = customers.find(c => c.id === newThreadData.customerId)?.companyName || 'Unknown';
    const newThread: CustomerThread = {
      id: `t-${Date.now()}`,
      customerId: newThreadData.customerId,
      customerName,
      topic: newThreadData.topic,
      linkedOrderId: newThreadData.linkedId,
      linkedOrderType: newThreadData.linkType,
      lastMessage: newThreadData.initialMessage,
      lastMessageTime: 'Just now',
      unreadCount: 0,
      priority: newThreadData.priority,
      status: 'open',
      tags: [],
      participants: [currentUser?.name || 'Me'],
      messages: [{ id: `m-${Date.now()}`, authorId: currentUser?.id || 'guest', authorName: currentUser?.name || 'Me', authorRole: 'User', text: newThreadData.initialMessage, timestamp: 'Just now', mentions: [], attachments: [], isPinned: false, isEdited: false }]
    };
    setThreads([newThread, ...threads]);
    setSelectedThreadId(newThread.id);
    setShowNewThreadModal(false);
    setNewThreadData({ customerId: '', topic: '', initialMessage: '', priority: 'normal', linkedId: '', linkType: 'Job' });
  };

  const getPriorityColor = (p: ThreadPriority) => {
    switch (p) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'important': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const containerClasses = isDocked ? "fixed right-0 top-0 h-full w-[500px] z-[100] shadow-2xl animate-in slide-in-from-right" : "fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in";
  const windowClasses = isDocked ? "bg-white dark:bg-slate-900 w-full h-full border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden" : "bg-white dark:bg-slate-900 w-full max-w-6xl h-[85vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95";

  return (
    <div className={containerClasses}>
      <div className={windowClasses}>
        
        {/* HEADER */}
        <div className="bg-[#003d5b] p-3 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg"><MessageSquare className="w-5 h-5" /></div>
            <div>
              <h3 className="text-lg font-bold leading-none">{t?.title || "Collaboration Hub"}</h3>
              <p className="text-white/60 text-xs mt-0.5">{t?.subtitle || "Global Message Board"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={handleRefresh} className={`p-2 hover:bg-white/10 rounded-lg transition-all ${isRefreshing ? 'animate-spin' : ''}`} title={commonT?.refresh}>
                <RotateCcw className="w-4 h-4" />
             </button>

             <button onClick={() => setShowNewThreadModal(true)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 border border-white/10 mr-4">
                <Plus className="w-3 h-3" /> {t?.newThread || "New Thread"}
             </button>
             
             <button onClick={() => setIsDocked(!isDocked)} className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${isDocked ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white'}`} title={isDocked ? "Center Window" : "Dock to Right"}>
               <PanelRight className="w-5 h-5" />
             </button>

             <button onClick={() => setIsMinimized(true)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white" title="Minimize">
               <Minus className="w-5 h-5" />
             </button>
             
             <button onClick={onClose} className="p-2 hover:bg-red-500/80 rounded-lg transition-colors text-white/80 hover:text-white" title={commonT?.close || "Close"}>
               <X className="w-5 h-5" />
             </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* SIDEBAR: THREAD LIST */}
          <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex flex-col group shadow-lg">
            <div className="p-4 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={commonT?.search || "Search..."} 
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#003d5b]/20 dark:text-white" 
                  value={filterText} 
                  onChange={e => setFilterText(e.target.value)} 
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {sortedThreads.map(thread => (
                <div 
                  key={thread.id} 
                  onClick={() => setSelectedThreadId(thread.id)} 
                  className={`p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer transition-colors ${selectedThreadId === thread.id ? 'bg-white dark:bg-slate-800 border-l-4 border-l-[#003d5b]' : 'hover:bg-slate-100 dark:hover:bg-slate-900'}`}
                >
                  <div className="flex justify-between mb-1">
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${getPriorityColor(thread.priority)}`}>{thread.priority}</span>
                    <span className="text-xs text-slate-400">{thread.lastMessageTime}</span>
                  </div>
                  <h4 className="font-bold text-sm dark:text-white truncate">{thread.topic}</h4>
                  <p className="text-xs text-blue-600 truncate">{thread.customerName}</p>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-1">{thread.lastMessage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CHAT AREA */}
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
            {selectedThread ? (
              <>
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 z-10">
                   <div>
                      <h2 className="text-lg font-bold dark:text-white flex items-center gap-2">
                        {selectedThread.isPinned && <Pin className="w-4 h-4 text-orange-500 fill-orange-500" />}
                        {selectedThread.topic}
                      </h2>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1 hover:text-blue-600 cursor-pointer" onClick={() => onNavigateToCustomer(selectedThread.customerId)}>
                          <Building2 className="w-3 h-3"/> {selectedThread.customerName}
                        </span>
                      </div>
                   </div>
                   <div className="relative">
                      <button onClick={() => setShowActionsMenu(!showActionsMenu)} className={`p-2 rounded-full transition-colors ${showActionsMenu ? 'bg-slate-100 dark:bg-slate-800 text-blue-600' : 'text-slate-400 hover:bg-slate-50'}`}><MoreVertical className="w-5 h-5"/></button>
                      {showActionsMenu && (
                        <div className="absolute right-0 top-10 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                           <button onClick={() => { setThreads(prev => prev.map(t => t.id === selectedThreadId ? {...t, isPinned: !t.isPinned} : t)); setShowActionsMenu(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 dark:text-white">
                             <Pin className={`w-4 h-4 ${selectedThread.isPinned ? 'text-orange-500 fill-orange-500' : ''}`} /> 
                             {selectedThread.isPinned ? (t?.unpinThread || 'Unpin') : (t?.pinThread || 'Pin')}
                           </button>
                           <button onClick={() => { handleSendMessage(); setShowActionsMenu(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 dark:text-white border-t dark:border-slate-700">
                             <Mail className="w-4 h-4 text-blue-500"/> via Email
                           </button>
                           <button onClick={() => { if(confirm("Clear history?")) setThreads(prev => prev.map(t => t.id === selectedThreadId ? {...t, messages: []} : t)); setShowActionsMenu(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 text-red-600 border-t dark:border-slate-700">
                             <Trash2 className="w-4 h-4"/> {t?.clearHistory || 'Clear History'}
                           </button>
                        </div>
                      )}
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-950/20 custom-scrollbar">
                   {selectedThread.messages.map(msg => (
                     <div key={msg.id} className={`flex ${msg.authorId === (currentUser?.id || 'guest') ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${msg.authorId === (currentUser?.id || 'guest') ? 'bg-[#003d5b] text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 dark:text-white rounded-tl-none border border-slate-100 dark:border-slate-700'}`}>
                           <p className="font-bold text-[10px] mb-1 opacity-70 uppercase tracking-tighter">{msg.authorName}</p>
                           {msg.text}
                        </div>
                     </div>
                   ))}
                   <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t dark:border-slate-800 bg-white dark:bg-slate-900">
                   <div className="flex gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-[#003d5b]/20 transition-all">
                      <textarea value={newMessageText} onChange={e => setNewMessageText(e.target.value)} placeholder={t?.startConversation || "Type a message..."} className="flex-1 bg-transparent border-none focus:ring-0 text-sm h-10 resize-none dark:text-white" />
                      <button onClick={handleSendMessage} className="p-2 bg-[#003d5b] dark:bg-blue-600 text-white rounded-lg hover:bg-[#002a40] transition-colors"><Send className="w-4 h-4"/></button>
                   </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <MessageSquare className="w-16 h-16 opacity-10 mb-4" />
                <p className="font-bold uppercase tracking-widest text-xs">{t?.startConversation || "Select a thread to start collaborating"}</p>
              </div>
            )}
          </div>
        </div>

        {/* NEW THREAD MODAL */}
        {showNewThreadModal && (
          <div className="absolute inset-0 z-[110] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
             <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                <div className="flex justify-between items-center border-b dark:border-slate-800 pb-4">
                   <h3 className="font-bold text-lg dark:text-white">{t?.startNewThread || "Start New Thread"}</h3>
                   <button onClick={() => setShowNewThreadModal(false)} className="text-slate-400 hover:text-red-500"><X className="w-5 h-5"/></button>
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{navT?.crm?.replace('Directory', '') || "Customer"}</label>
                   <select className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20" value={newThreadData.customerId} onChange={e => setNewThreadData({...newThreadData, customerId: e.target.value})}>
                      <option value="">{t?.selectCustomer || "Select Customer..."}</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t?.topic || "Topic"}</label>
                   <input type="text" className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Subject..." value={newThreadData.topic} onChange={e => setNewThreadData({...newThreadData, topic: e.target.value})} />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t?.message || "Message"}</label>
                   <textarea className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm h-24 resize-none dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20" placeholder={t?.startConversation} value={newThreadData.initialMessage} onChange={e => setNewThreadData({...newThreadData, initialMessage: e.target.value})} />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                   <button onClick={() => setShowNewThreadModal(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-lg transition-colors">{commonT?.cancel}</button>
                   <button onClick={handleCreateThread} className="px-6 py-2 bg-[#003d5b] dark:bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:bg-sky-900 transition-all">{commonT?.save}</button>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}