
import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme'; 
import { Language } from '../../types';
import { translations } from '../../translations'; 
import { 
  User, 
  Moon, 
  Sun, 
  Globe, 
  Layout, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Lock,
  LayoutTemplate,
  ChevronDown 
} from 'lucide-react';

interface Props {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

const UserPreferences: React.FC<Props> = ({ currentLang, onLanguageChange }) => {
  const { theme, toggleTheme } = useTheme();
  
  // FAILSAFE: Ensure translation object exists to prevent WSOD
  const t = translations[currentLang] || translations['en'];
  const navT = t?.nav || translations['en'].nav; 

  // Logic State
  const [startPage, setStartPage] = useState<string>(() => localStorage.getItem('usuppli-start-page') || 'dashboard');
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  
  // UI State
  const [isStartPageOpen, setIsStartPageOpen] = useState(true);

  const showNotification = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type }); 
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStartPageChange = (page: string) => {
    setStartPage(page);
    localStorage.setItem('usuppli-start-page', page);
    showNotification(currentLang === 'en' ? "Start page saved" : "启动页已保存", 'success');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
        showNotification(currentLang === 'en' ? "Passwords do not match!" : "密码不匹配！", 'error');
        return;
    }
    setPasswords({ current: '', new: '', confirm: '' }); 
    showNotification(currentLang === 'en' ? "Security updated" : "安全设置已更新", 'success');
  };

  // CORRECTED IDs (Must match App.tsx mapping) & SAFE LABELS
  const START_MENU_OPTIONS = [
    { id: 'dashboard', label: navT?.dashboard || 'Dashboard' },
    { id: 'workspace', label: navT?.productCatalog || 'Product Catalog' },
    { id: 'orders', label: navT?.production || 'Orders' },
    { id: 'logistics', label: navT?.logistics || 'Logistics' },
    { id: 'suppliers', label: navT?.factoryMaster || 'Suppliers' },
    { id: 'customers', label: navT?.crm || 'Customers' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto pb-12">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                    <User className="w-6 h-6 text-[#003d5b] dark:text-blue-500" />
                </div>
                {t?.admin?.tabs?.preferences || "Preferences"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold text-xs uppercase tracking-widest pl-1">
               Personalization & Security Hub
            </p>
        </div>
        
        {notification && (
            <div className={`px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in slide-in-from-top-4 shadow-xl border ${
              notification.type === 'success' 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30' 
                : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30'
            }`}>
                {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {notification.msg}
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT COLUMN (Theme, Language, Security) --- */}
          <div className="lg:col-span-7 space-y-6">
              
              {/* THEME & LANGUAGE ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Theme Card (Segmented Control) */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Layout className="w-4 h-4" /> Interface Theme
                      </h3>
                      <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
                          <button 
                            onClick={() => theme === 'dark' && toggleTheme()}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all ${theme === 'light' ? 'bg-white text-slate-800 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                              <Sun className="w-4 h-4" /> Light
                          </button>
                          <button 
                            onClick={() => theme === 'light' && toggleTheme()}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all ${theme === 'dark' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                              <Moon className="w-4 h-4" /> Dark
                          </button>
                      </div>
                  </div>

                  {/* Localization Card */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Globe className="w-4 h-4" /> Localization
                      </h3>
                      <div className="relative group">
                        <select 
                            value={currentLang} 
                            onChange={(e) => onLanguageChange(e.target.value as Language)}
                            className="w-full appearance-none p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer hover:border-blue-300 dark:hover:border-blue-700"
                        >
                            <option value="en">English (US)</option>
                            <option value="zh-Hans">简体中文 (Simplified)</option>
                            <option value="zh-Hant">繁體中文 (Traditional)</option>
                        </select>
                        <Globe className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" />
                      </div>
                  </div>
              </div>

              {/* Password Card */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-sm font-black text-slate-800 dark:text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                      <Lock className="w-4 h-4 text-rose-500" /> Security
                  </h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Current Password</label>
                            <input 
                                type="password" required
                                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all dark:text-white"
                                placeholder="••••••••"
                                value={passwords.current}
                                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">New Password</label>
                            <input 
                                type="password" required
                                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all dark:text-white"
                                placeholder="••••••••"
                                value={passwords.new}
                                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                            />
                        </div>
                      </div>
                      <div className="pt-2 text-right">
                          <button type="submit" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[10px] uppercase tracking-widest py-3 px-8 rounded-xl hover:scale-105 transition-transform shadow-lg">
                            Update Credentials
                          </button>
                      </div>
                  </form>
              </div>
          </div>

          {/* --- RIGHT COLUMN (Start Page - Collapsible) --- */}
          <div className="lg:col-span-5">
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
                  {/* Collapsible Header */}
                  <button 
                    onClick={() => setIsStartPageOpen(!isStartPageOpen)}
                    className="w-full p-8 flex items-center justify-between bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                      <div>
                          <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                              <LayoutTemplate className="w-4 h-4 text-purple-500" /> Default Start Page
                          </h3>
                          <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-tight text-left">
                              Currently: <span className="text-purple-600 dark:text-purple-400">{START_MENU_OPTIONS.find(o => o.id === startPage)?.label}</span>
                          </p>
                      </div>
                      <div className={`p-2 rounded-full bg-slate-100 dark:bg-slate-800 transition-transform duration-300 ${isStartPageOpen ? 'rotate-180' : ''}`}>
                          <ChevronDown className="w-5 h-5 text-slate-500" />
                      </div>
                  </button>

                  {/* Collapsible Content */}
                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isStartPageOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="p-8 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {START_MENU_OPTIONS.map((opt) => (
                              <button 
                                key={opt.id} 
                                onClick={() => handleStartPageChange(opt.id)}
                                className={`flex flex-col items-start p-4 rounded-2xl border-2 transition-all duration-200 ${
                                  startPage === opt.id 
                                  ? 'bg-purple-50 dark:bg-purple-900/10 border-purple-500 text-purple-700 dark:text-purple-300 shadow-md transform scale-[1.02]' 
                                  : 'bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-purple-200 dark:hover:border-purple-900 hover:bg-purple-50/50'
                                }`}
                              >
                                  <div className="flex items-center justify-between w-full mb-1">
                                      {startPage === opt.id 
                                        ? <CheckCircle2 className="w-5 h-5 text-purple-500" />
                                        : <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-700" />
                                      }
                                  </div>
                                  <span className="text-xs font-black uppercase tracking-tight text-left">{opt.label}</span>
                              </button>
                          ))}
                      </div>
                  </div>
              </div>
          </div>

      </div>
    </div>
  );
};

export default UserPreferences;