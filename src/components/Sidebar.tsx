
import React, { useState, memo } from 'react';
import { TabType, User, Language } from '../types';
import { translations } from '../translations';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Factory, 
  ClipboardList, 
  Wrench, 
  Truck, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  ChevronRight,
  ChevronLeft,
  EyeOff
} from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle'; 
import { Logo } from './Logo'; 

// --- ICONS (Lighter/Thinner style) ---
const SearchTriggerIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);

const HideIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
);

interface SidebarProps {
  user: User;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  currentLang: Language;
  setCurrentLang: (lang: Language) => void;
  isReadOnly: boolean;
  onOpenProductWizard: () => void;
  onLogout: () => void;
  chatOpen?: boolean;
  onToggleChat?: () => void;
  unreadCount?: number;
  onOpenCommandPalette?: () => void;
  isPinned: boolean;
  setIsPinned: (val: boolean) => void;
  onHide: () => void;
  systemVersion?: string;
}

const NavGroupLabel: React.FC<{ label: string; isExpanded: boolean }> = ({ label, isExpanded }) => (
  <div className={`px-4 mt-6 mb-2 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 h-0 mt-0 mb-0 overflow-hidden'}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap">{label}</p>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({ 
  user, activeTab, setActiveTab, currentLang, setCurrentLang, isReadOnly, onOpenProductWizard, onLogout,
  chatOpen, onToggleChat, unreadCount, onOpenCommandPalette, isPinned, setIsPinned, onHide,
  systemVersion = '3.09'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isExpanded = isPinned || isHovered;

  const t = translations[currentLang] || translations['en'];
  const navT = t?.nav || translations['en'].nav; 
  const commonT = t?.common || translations['en'].common;

  // Navigation Items Configuration
  const navItems = [
    { group: navT?.analytics, id: 'DASHBOARD', label: navT?.dashboard, icon: LayoutDashboard },
    { group: navT?.sourcing, id: 'PRODUCT_CATALOG', label: navT?.productCatalog, icon: Package, restrictedTo: ['admin', 'super_admin', 'editor', 'viewer'] },
    { group: null, id: 'PRODUCT_WORKSPACE', label: navT?.productWorkspace || 'Workspace', icon: Layers, restrictedTo: ['admin', 'super_admin', 'editor', 'viewer'] }, 
    { group: null, id: 'FACTORY_MASTER', label: navT?.factoryMaster, icon: Factory, restrictedTo: ['admin', 'super_admin', 'editor'] },
    { group: navT?.executionGroup, id: 'ORDER_MANAGER', label: navT?.production, icon: ClipboardList },
    { group: null, id: 'PRODUCTION_FLOOR', label: navT?.shopFloor, icon: Wrench },
    { group: null, id: 'LOGISTICS_TOWER', label: navT?.logistics, icon: Truck },
    { group: null, id: 'CRM', label: navT?.crm, icon: Users, restrictedTo: ['admin', 'super_admin', 'editor', 'viewer'] },
    { group: navT?.system, id: 'TEAM_CHAT', label: navT?.teamChat, icon: MessageSquare },
    { group: null, id: 'ADMIN', label: navT?.admin, icon: Settings, restrictedTo: ['admin', 'super_admin'] },
  ];

  return (
    <aside 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-[#0f172a] text-slate-300 flex flex-col h-screen transition-all duration-500 ease-in-out z-[60] relative border-r border-slate-800 shadow-2xl ${isExpanded ? 'w-64' : 'w-20'}`}
    >
      {/* PIN / HIDE CONTROLS */}
      <div className={`absolute -right-3 top-20 flex flex-col gap-2 z-[70] transition-opacity duration-300 ${!isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button onClick={() => setIsPinned(!isPinned)} className="bg-slate-800 border border-slate-700 rounded-full p-1.5 shadow-xl text-blue-400 hover:text-white transition-all">
          <ChevronLeft className={`w-3 h-3 transition-transform duration-500 ${!isPinned ? 'rotate-180' : ''}`} />
        </button>
        <button onClick={onHide} className="bg-slate-800 border border-slate-700 rounded-full p-1.5 shadow-xl text-slate-400 hover:text-red-400 transition-all">
          <EyeOff className="w-3 h-3" />
        </button>
      </div>

      {/* HEADER */}
      <div className="flex flex-col gap-4 p-6 pb-2">
          <div className={`flex items-center gap-3 overflow-hidden transition-all duration-500 ${!isExpanded ? '-ml-1' : ''}`}>
            <div className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
               <Logo className="h-7 w-auto text-white" />
            </div>
            {!isExpanded && (
               <div className="w-full flex justify-center">
                  <Logo className="text-white h-7 w-7" variant="mark" />
               </div>
            )}
          </div>

          {/* LANGUAGE TOGGLE */}
          <div className={`flex bg-slate-800 p-1 rounded-lg transition-all duration-500 ${!isExpanded ? 'opacity-0 h-0 overflow-hidden' : 'gap-1'}`}>
            <button onClick={() => setCurrentLang('en')} className={`flex-1 py-1 text-[9px] font-bold rounded-md transition-all ${currentLang === 'en' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>EN</button>
            <button onClick={() => setCurrentLang('zh-Hans')} className={`flex-1 py-1 text-[9px] font-bold rounded-md transition-all ${currentLang === 'zh-Hans' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>简</button>
            <button onClick={() => setCurrentLang('zh-Hant')} className={`flex-1 py-1 text-[9px] font-bold rounded-md transition-all ${currentLang === 'zh-Hant' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>繁</button>
        </div>
      </div>

      {/* NEW PRODUCT BUTTON & TOGGLE */}
      <div className="px-3 mb-4 flex items-center justify-center gap-3">
         {!isReadOnly && (
            <button 
                onClick={onOpenProductWizard}
                className={`group relative flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-300 ${
                    isExpanded 
                    ? 'w-[57%] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/20' 
                    : 'w-full bg-transparent hover:bg-slate-800 text-blue-500 justify-center p-2 aspect-square'
                }`}
            >
                <div className={`shrink-0 ${!isExpanded ? 'p-1 rounded-lg bg-blue-600/20' : ''}`}>
                    <Plus className={`w-4 h-4 ${isExpanded ? 'text-white' : 'text-blue-500 group-hover:text-blue-400'}`} />
                </div>
                {isExpanded && <span className="font-bold text-xs tracking-wide">{navT?.newProduct || "New Product"}</span>}
            </button>
         )}
         <div className={`${isExpanded ? '' : 'hidden'}`}>
             <ThemeToggle />
         </div>
      </div>

      {/* NAVIGATION LINKS - UPDATED: Active state matches New Product Gradient */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto no-scrollbar custom-scrollbar">
        {navItems.map((item) => {
            if (item.restrictedTo && !item.restrictedTo.includes(user.role)) return null;
            const isActive = activeTab === item.id;

            return (
                <React.Fragment key={item.id}>
                    {item.group && <NavGroupLabel label={item.group} isExpanded={isExpanded} />}
                    <button 
                        onClick={() => setActiveTab(item.id as TabType)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                            isActive 
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/20' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50' 
                        } ${!isExpanded ? 'justify-center' : ''}`}
                        title={!isExpanded ? item.label : ''}
                    >
                        <div className={`shrink-0 transition-transform duration-300 ${!isExpanded ? 'mx-auto scale-110' : ''}`}>
                            <item.icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'group-hover:text-slate-300'}`} />
                        </div>
                        <span className={`text-xs font-bold whitespace-nowrap transition-all duration-300 overflow-hidden ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                            {item.label}
                        </span>
                        
                        {item.id === 'TEAM_CHAT' && unreadCount && unreadCount > 0 && (
                            <span className={`bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-lg ${!isExpanded ? 'absolute top-1 right-1' : ''}`}>
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>
                </React.Fragment>
            );
        })}
      </nav>

      {/* FOOTER */}
      <div className="bg-[#0f172a] border-t border-slate-800">
          {onOpenCommandPalette && isExpanded && (
              <div className="px-3 pt-4 pb-2">
                <button 
                    onClick={onOpenCommandPalette}
                    className="w-full flex items-center justify-between bg-slate-900/50 hover:bg-slate-800 text-slate-500 hover:text-white px-3 py-2 rounded-xl transition-all border border-slate-800 hover:border-slate-700 shadow-inner"
                >
                    <div className="flex items-center gap-2">
                        <SearchTriggerIcon className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{commonT?.command || "Command"}</span>
                    </div>
                    <span className="text-[9px] font-black opacity-30 bg-slate-800 px-1 rounded">⌘K</span>
                </button>
            </div>
          )}

          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-black text-blue-400 border border-slate-700 shadow-lg shrink-0 ${!isExpanded ? 'mx-auto' : ''}`}>
                    {user.name.charAt(0)}
                </div>
                
                <div className={`flex-1 min-w-0 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 h-0 overflow-hidden'}`}>
                    <p className="font-bold text-xs text-white truncate">{user.name}</p>
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-tighter truncate">{user.role.replace('_', ' ')}</p>
                </div>
                
                {isExpanded && (
                    <button onClick={onLogout} title="Logout" className="text-slate-500 hover:text-red-400 transition-colors p-2 rounded-xl hover:bg-red-400/10">
                        <LogOut className="w-5 h-5" />
                    </button>
                )}
            </div>

            {!isExpanded && (
                 <button onClick={onHide} className="w-full mt-4 flex justify-center text-slate-600 hover:text-slate-400">
                    <HideIcon className="w-5 h-5" />
                 </button>
            )}
            
            {isExpanded && (
                <div className="mt-3 flex justify-between items-center px-1">
                    <span className="text-[8px] font-mono text-slate-600">v{systemVersion}</span>
                    <button onClick={onHide} className="text-slate-600 hover:text-slate-400" title="Hide Sidebar">
                        <HideIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
          </div>
      </div>
    </aside>
  );
};

export default memo(Sidebar);
