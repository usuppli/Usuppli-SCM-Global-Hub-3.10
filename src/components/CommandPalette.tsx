
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Product, Job, Customer, Language } from '../types';
import { translations } from '../translations';

// --- ICONS ---
const SearchIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);
const PlusIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
);
const HomeIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
);
const BoxIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
);
const UsersIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
);
const CogIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 3.31a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-3.31a1.724 1.724 0 002.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const ClipboardIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
);

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  products: Product[];
  jobs: Job[];
  customers: Customer[];
  onNavigate: (tab: any) => void;
  onCreateProduct: () => void;
  onCreateJob: () => void;
}

const CommandPalette: React.FC<Props> = ({ isOpen, onClose, lang, products, jobs, customers, onNavigate, onCreateProduct, onCreateJob }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const t = translations[lang]?.search || translations['en']?.search || {
      placeholder: "Search...",
      quickActions: "Quick Actions",
      noResults: "No results.",
      commands: { newProduct: "New Product", newOrder: "New Order", goDashboard: "Dashboard", goSettings: "Settings" }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const getResults = () => {
    const q = query.toLowerCase();
    let res: any[] = [];

    const actions = [
        { type: 'action', id: 'new_prod', label: t.commands.newProduct, icon: PlusIcon },
        { type: 'action', id: 'new_order', label: t.commands.newOrder, icon: PlusIcon },
        { type: 'action', id: 'go_dash', label: t.commands.goDashboard, icon: HomeIcon },
        { type: 'action', id: 'go_settings', label: t.commands.goSettings, icon: CogIcon },
    ];

    if (!q) res = actions;
    else res = actions.filter(a => a.label.toLowerCase().includes(q));

    if (!q && res.length > 0) return res;

    const prodMatches = products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)).slice(0, 3).map(p => ({ type: 'product', id: p.id, label: p.name, sub: p.category, icon: BoxIcon }));
    res = [...res, ...prodMatches];

    const jobMatches = jobs.filter(j => j.jobName.toLowerCase().includes(q) || j.id.toLowerCase().includes(q)).slice(0, 3).map(j => ({ type: 'job', id: j.id, label: j.jobName, sub: j.status, icon: ClipboardIcon }));
    res = [...res, ...jobMatches];

    const custMatches = customers.filter(c => c.companyName.toLowerCase().includes(q) || c.contactPerson.toLowerCase().includes(q)).slice(0, 3).map(c => ({ type: 'customer', id: c.id, label: c.companyName, sub: c.contactPerson, icon: UsersIcon }));
    res = [...res, ...custMatches];

    return res;
  };

  const results = getResults();

  const handleSelect = (item: any) => {
    onClose();
    if (item.type === 'action') {
      if (item.id === 'new_prod') onCreateProduct();
      if (item.id === 'new_order') onCreateJob();
      if (item.id === 'go_dash') onNavigate('DASHBOARD');
      if (item.id === 'go_settings') onNavigate('ADMIN');
    } else if (item.type === 'product') { onNavigate('PRODUCT_CATALOG'); }
    else if (item.type === 'job') { onNavigate('ORDER_MANAGER'); }
    else if (item.type === 'customer') { onNavigate('CRM'); }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { 
        e.preventDefault(); 
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1)); 
      }
      else if (e.key === 'ArrowUp') { 
        e.preventDefault(); 
        setSelectedIndex(prev => Math.max(prev - 1, 0)); 
      }
      else if (e.key === 'Enter') { 
        e.preventDefault(); 
        const selected = results[selectedIndex]; 
        if (selected) handleSelect(selected); 
      }
      else if (e.key === 'Escape') {
        e.preventDefault();
        onClose(); 
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, results, onClose]); 

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* UPDATED CONTAINER: 
          Added dark:bg-slate-900 and dark:border-slate-700
      */}
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
        
        {/* HEADER */}
        <div className="flex items-center px-4 py-4 border-b border-slate-100 dark:border-slate-800">
          <SearchIcon className="w-5 h-5 text-slate-400 mr-3" />
          {/* UPDATED INPUT: Added dark:text-slate-100 */}
          <input 
            ref={inputRef} 
            type="text" 
            className="flex-1 bg-transparent border-none text-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:ring-0 p-0" 
            placeholder={t.placeholder} 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
          />
          {/* UPDATED CLOSE BUTTON: Added dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 */}
          <button 
            onClick={onClose}
            className="text-[10px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 px-2 py-1 rounded transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            ESC
          </button>
        </div>

        {/* RESULTS LIST */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? <div className="p-8 text-center text-slate-400 text-sm font-medium">{t.noResults}</div> : 
            <div className="space-y-1">
              {results.map((item, idx) => (
                <button 
                    key={item.id + idx} 
                    onClick={() => handleSelect(item)} 
                    onMouseEnter={() => setSelectedIndex(idx)} 
                    // UPDATED LIST ITEM: Added dark:text-slate-300 dark:hover:bg-slate-800
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                      idx === selectedIndex 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                  <div className={`p-2 rounded-lg ${
                    idx === selectedIndex 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' // UPDATED ICON BG
                  }`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                      {/* UPDATED TEXT COLOR */}
                      <p className={`text-sm font-bold truncate ${
                        idx === selectedIndex ? 'text-white' : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {item.label}
                      </p>
                      <p className={`text-xs truncate ${
                        idx === selectedIndex ? 'text-blue-100' : 'text-slate-400'
                      }`}>
                        {item.sub}
                      </p>
                  </div>
                  
                  {idx === selectedIndex && <span className="text-xs font-bold opacity-60">↵</span>}
                </button>
              ))}
            </div>
          }
        </div>

        {/* FOOTER */}
        <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
            <span>{t.quickActions}</span>
            <div className="flex gap-2">
                <span>Navigate <b className="text-slate-600 dark:text-slate-400">↓↑</b></span>
                <span>Select <b className="text-slate-600 dark:text-slate-400">↵</b></span>
            </div>
        </div>
      </div>
    </div>, document.body
  );
};

export default CommandPalette;