
import React, { useState, useRef, useMemo } from 'react';
import { Product, Language, User, UserRole, Job, AuditLogEntry } from '../../types';
import { translations } from '../../translations';
import GraphicalWorldClock from '../GraphicalWorldClock'; 
import UserPreferences from './UserPreferences'; 
import { 
  Shield, 
  User as UserIcon, 
  Trash2 as DeleteIcon, 
  Mail as MailIcon, 
  Download as DownloadIcon, 
  Upload as UploadIcon, 
  Edit as EditIcon, 
  Save as SaveIcon, 
  Lock as LockIcon, 
  Unlock as UnlockIcon, 
  Settings as SettingsIcon,
  Search,
  FileText,
  CheckCircle2,
  LayoutTemplate,
  ChevronDown
} from 'lucide-react';

const STYLES = {
  wrapper: "w-full",
  label: "block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5",
  inputBase: "w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none transition-all duration-200 relative",
  inputFocus: "focus:bg-white dark:focus:bg-slate-900 focus:border-[#003d5b] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#003d5b]/20",
  inputError: "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50 dark:bg-red-950/20 text-red-900",
  errorText: "mt-1 text-xs text-red-500 font-bold"
};

const Input = ({ label, error, icon, className, ...props }: any) => (
  <div className={STYLES.wrapper}>
    {label && <label className={STYLES.label}>{label}</label>}
    <div className="relative">
      {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">{icon}</div>}
      <input className={`${STYLES.inputBase} ${STYLES.inputFocus} ${error ? STYLES.inputError : ''} ${icon ? 'pl-10' : ''} ${className||''}`} {...props} />
    </div>
    {error && <p className={STYLES.errorText}>{error}</p>}
  </div>
);

const Select = ({ label, error, options, className, children, ...props }: any) => (
  <div className={STYLES.wrapper}>
    {label && <label className={STYLES.label}>{label}</label>}
    <div className="relative">
      <select className={`${STYLES.inputBase} appearance-none ${STYLES.inputFocus} ${error ? STYLES.inputError : ''} ${className||''}`} {...props}>
        {options ? options.map((opt: any) => (
          <option key={opt.value} value={opt.value} className="dark:bg-slate-900">{opt.label}</option>
        )) : children}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
    {error && <p className={STYLES.errorText}>{error}</p>}
  </div>
);

interface Props {
  lang: Language;
  setLang?: (lang: Language) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  jobs: Job[];
  setSelectedProductId: (id: string | null) => void;
  currentUser: User | null;
  systemVersion?: string;
  globalTariffs?: Record<string, number>;
  lockedTariffs?: string[]; 
  onUpdateVersion?: (v: string) => void;
  onUpdateTariff?: (country: string, rate: string | number) => void;
  onToggleTariffLock?: (country: string) => void;
  auditLogs?: AuditLogEntry[];
}

const AdminPanel: React.FC<Props> = ({ 
  lang, 
  setLang,
  users = [], 
  setUsers, 
  currentUser, 
  systemVersion, 
  globalTariffs = {}, 
  lockedTariffs = [],
  onUpdateVersion, 
  onUpdateTariff,
  onToggleTariffLock,
  auditLogs = []
}) => {
  // CRASH PROTECTION: Safe access to translations
  const rootT = translations[lang] || translations['en'];
  const t = rootT.admin;
  const commonT = rootT.common;

  const [activeTab, setActiveTab] = useState<'system' | 'users' | 'backup' | 'audit' | 'preferences'>('system');
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'viewer', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  const [isEditingVersion, setIsEditingVersion] = useState(false);
  const [tempVersion, setTempVersion] = useState(systemVersion || 'v3.05');
  
  const [editingTariff, setEditingTariff] = useState<string | null>(null);
  const [tempTariff, setTempTariff] = useState<string>('');

  const [auditSearch, setAuditSearch] = useState('');
  const [auditFilter, setAuditFilter] = useState<'ALL' | 'AUTH' | 'SYSTEM' | 'PRODUCT'>('ALL');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const userRole = currentUser?.role || 'viewer';
  const isSuperAdmin = userRole.toLowerCase() === 'super_admin';
  const isAdmin = userRole.toLowerCase() === 'admin';
  const hasAccess = isSuperAdmin || isAdmin;

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesSearch = log.details.toLowerCase().includes(auditSearch.toLowerCase()) || 
                            log.user.toLowerCase().includes(auditSearch.toLowerCase());
      const matchesFilter = auditFilter === 'ALL' ? true : 
                            auditFilter === 'AUTH' ? (log.action === 'LOGIN' || log.action === 'LOGOUT') :
                            auditFilter === 'PRODUCT' ? (log.module === 'Product Catalog') :
                            true;
      return matchesSearch && matchesFilter;
    });
  }, [auditLogs, auditSearch, auditFilter]);

  const handleExportAudit = () => {
    const headers = ['Timestamp', 'User', 'Action', 'Module', 'Details'];
    const rows = filteredLogs.map(log => [
      new Date(log.timestamp).toLocaleString(),
      log.user,
      log.action,
      log.module,
      `"${log.details.replace(/"/g, '""')}"` 
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `audit_log_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = { 
        id: `USR-${Date.now()}`, 
        name: newUser.name, 
        email: newUser.email, 
        role: newUser.role as UserRole, 
        password: newUser.password,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.name)}&background=random`,
        lastActive: new Date().toISOString()
    };
    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'viewer', password: '' });
  };

  const executeDelete = () => {
      if (userToDelete) {
          setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
          setUserToDelete(null); 
      }
  };

  const handleExportBackup = () => {
    const backupKeys = ['usuppli_products', 'usuppli_customers', 'usuppli_shipments', 'usuppli_factories', 'usuppli_jobs'];
    const data: Record<string, any> = {};
    backupKeys.forEach(key => {
      const val = localStorage.getItem(key);
      if (val) data[key] = JSON.parse(val);
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `usuppli-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        Object.keys(json).forEach(key => localStorage.setItem(key, JSON.stringify(json[key])));
        alert("Restored successfully. Reloading...");
        window.location.reload();
      } catch (err) { alert("Backup Failed."); }
    };
    reader.readAsText(file);
  };

  const handleSaveVersion = () => {
    if (onUpdateVersion && tempVersion.trim() !== "") {
        onUpdateVersion(tempVersion);
        setIsEditingVersion(false);
    }
  };

  if (!hasAccess) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-in fade-in zoom-in-95">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-3xl flex items-center justify-center text-red-600 dark:text-red-400 mb-6 shadow-xl shadow-red-200 dark:shadow-none">
                  <Shield className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Access Denied</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">Institutional protocols restrict this section to administrative accounts.</p>
          </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
      {userToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm text-center">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 max-w-sm w-full border border-slate-200 dark:border-slate-800">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-4">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Delete Account?</h3>
                <p className="text-slate-500 text-sm mt-2 mb-6">Are you sure you want to remove <span className="font-bold text-slate-800 dark:text-slate-200">{userToDelete.name}</span>? This action is irreversible.</p>
                <div className="flex gap-3 w-full">
                    <button onClick={() => setUserToDelete(null)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold uppercase tracking-widest text-[10px]">{commonT?.cancel || "Cancel"}</button>
                    <button onClick={executeDelete} className="flex-1 py-3 bg-red-600 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/20">{commonT?.delete || "Delete"}</button>
                </div>
            </div>
        </div>
      )}

      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Shield className="w-8 h-8 text-[#003d5b] dark:text-blue-500" />
                {t?.title || "Admin Panel"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 uppercase font-bold text-[10px] tracking-widest">{t?.subtitle || "Global Configuration & Identity Management"}</p>
         </div>
         <div className={`px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest ${isSuperAdmin ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800' : 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400'}`}>
            {userRole.replace('_', ' ')} MODE
         </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 border-b dark:border-slate-800 pb-2 flex items-center gap-2">
           <GraphicalWorldClock className="w-4 h-4" /> Global Time Sync
         </h3>
         <GraphicalWorldClock />
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
         {['system', 'users', 'backup', 'audit'].map(tab => (
           <button 
             key={tab} 
             onClick={() => setActiveTab(tab as any)} 
             className={`px-6 py-3 border-b-2 font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab ? 'border-[#003d5b] text-[#003d5b] dark:border-blue-500 dark:text-blue-400' : 'border-transparent text-slate-400'}`}
           >
             {t?.tabs?.[tab] || tab}
           </button>
         ))}
         <button onClick={() => setActiveTab('preferences')} className={`px-6 py-3 border-b-2 font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'preferences' ? 'border-[#003d5b] text-[#003d5b] dark:border-blue-500 dark:text-blue-400' : 'border-transparent text-slate-400'}`}>
             <SettingsIcon className="w-4 h-4" /> {t?.tabs?.preferences || "Preferences"}
         </button>
      </div>

      <div className="min-h-[500px]">
         {activeTab === 'system' && (
            <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-[2rem]">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">{t?.system?.dbStatus || "Database"}</p>
                      <p className="text-xl font-black text-slate-800 dark:text-slate-200">{t?.system?.connected || "System Online"} ✅</p>
                    </div>
                    
                    <div className="p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-[2rem]">
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">{t?.system?.version || "Versioning"}</p>
                        <div className="flex items-center justify-between">
                            {isEditingVersion ? (
                                <input className="w-32 p-2 text-sm font-bold border border-blue-300 rounded-xl bg-white dark:bg-slate-800 dark:text-white outline-none" value={tempVersion} onChange={(e) => setTempVersion(e.target.value)} autoFocus />
                            ) : (
                                <p className="text-xl font-black text-slate-800 dark:text-slate-200 font-mono">{systemVersion || 'v3.05'}</p>
                            )}
                            {isSuperAdmin && (
                                <button onClick={() => isEditingVersion ? handleSaveVersion() : setIsEditingVersion(true)} className="p-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-sm hover:scale-110 transition-transform">
                                    {isEditingVersion ? <SaveIcon className="w-4 h-4 text-emerald-500" /> : <EditIcon className="w-4 h-4 text-blue-500" />}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b dark:border-slate-800 pb-4">Global Tariff Matrix</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(globalTariffs).map(([country, rate]) => {
                            const isLocked = lockedTariffs.includes(country);
                            return (
                                <div key={country} className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl flex justify-between items-center group transition-all hover:border-blue-500/30">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${isLocked ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                                            {isLocked ? <LockIcon className="w-5 h-5" /> : <UnlockIcon className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{country}</p>
                                            <p className="text-lg font-black font-mono text-slate-800 dark:text-white">{(Number(rate) * 100).toFixed(1)}%</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => { setEditingTariff(country); setTempTariff((Number(rate) * 100).toString()); }}
                                        className="p-3 opacity-0 group-hover:opacity-100 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl transition-all shadow-sm hover:scale-105"
                                    >
                                        <EditIcon className="w-4 h-4 text-blue-500" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
         )}
         
         {activeTab === 'users' && (
            <div className="space-y-8 animate-in fade-in">
               <div className="bg-slate-50 dark:bg-slate-950/30 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800">
                  <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder="Full Name" icon={<UserIcon className="w-4 h-4" />} value={newUser.name} onChange={(e: any) => setNewUser(prev => ({...prev, name: e.target.value}))} />
                      <Input placeholder="Email Address" type="email" icon={<MailIcon className="w-4 h-4" />} value={newUser.email} onChange={(e: any) => setNewUser(prev => ({...prev, email: e.target.value}))} />
                      <Input type={showPassword ? "text" : "password"} placeholder="Password" value={newUser.password} onChange={(e: any) => setNewUser(prev => ({...prev, password: e.target.value}))} />
                      <Select value={newUser.role} onChange={(e: any) => setNewUser(prev => ({...prev, role: e.target.value}))}>
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                        {isSuperAdmin && <option value="super_admin">Super Admin</option>}
                      </Select>
                      <div className="md:col-span-2 text-right">
                        <button type="submit" className="bg-[#003d5b] dark:bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest py-3 px-8 rounded-xl hover:bg-sky-900 dark:hover:bg-blue-500 transition-all shadow-lg active:scale-95">
                          {t?.users?.registerIdentity || "Register Identity"}
                        </button>
                      </div>
                  </form>
               </div>
               <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b dark:border-slate-800 pb-2">{t?.users?.title || "User Registry"}</h4>
                  <div className="grid grid-cols-1 gap-3">
                      {users.map(u => (
                          <div key={u.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:border-blue-500/20">
                              <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500">{u.name.charAt(0)}</div>
                                  <div>
                                      <p className="font-bold text-slate-800 dark:text-white text-sm">{u.name}</p>
                                      <p className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase">{u.email}</p>
                                  </div>
                              </div>
                              <div className="flex items-center gap-4">
                                  <span className="px-3 py-1 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm">{u.role.replace('_', ' ')}</span>
                                  {u.id !== currentUser?.id && (
                                    <button onClick={() => setUserToDelete(u)} className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors">
                                      <DeleteIcon className="w-4 h-4" />
                                    </button>
                                  )}
                              </div>
                          </div>
                      ))}
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'backup' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center text-center transition-all hover:border-blue-500/30">
                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6"><DownloadIcon className="w-10 h-10" /></div>
                        <h4 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">{t?.backup?.jsonTitle || "Export DB"}</h4>
                        <p className="text-xs text-slate-500 mb-6 leading-relaxed">{t?.backup?.jsonDesc || "Download Snapshot"}</p>
                        <button onClick={handleExportBackup} className="w-full py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-500 transition-all shadow-lg active:scale-95">{t?.backup?.generate || "Generate Snapshot"}</button>
                    </div>

                    <div className="p-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center text-center transition-all hover:border-emerald-500/30">
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6"><UploadIcon className="w-10 h-10" /></div>
                        <h4 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">{t?.backup?.restoreDB || "Restore DB"}</h4>
                        <p className="text-xs text-slate-500 mb-6 leading-relaxed">Upload a previous JSON backup to restore system state. Warning: Overwrites local data.</p>
                        <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImportBackup} />
                        <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-emerald-500 transition-all shadow-lg active:scale-95">{t?.backup?.upload || "Upload & Restore"}</button>
                    </div>
                </div>
            </div>
         )}
         
         {activeTab === 'audit' && (
             <div className="space-y-6 animate-in fade-in">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder={commonT?.search || "Search..."}
                                value={auditSearch}
                                onChange={(e) => setAuditSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                    <button 
                        onClick={handleExportAudit}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-colors"
                    >
                        <FileText className="w-4 h-4" /> {t?.audit?.exportCSV || "Export CSV"}
                    </button>
                </div>

                <div className="bg-[#0b1120] text-emerald-400 p-6 rounded-[2rem] font-mono text-xs h-[500px] overflow-y-auto shadow-inner border border-slate-800 custom-scrollbar relative">
                    <div className="sticky top-0 bg-[#0b1120] z-10 pb-4 border-b border-slate-800 mb-4 flex justify-between items-end">
                        <div>
                            <p className="text-sky-400 font-black underline uppercase tracking-widest text-[10px]">Secure Institutional Log</p>
                            <p className="text-slate-500 mt-1">Tracking ID: {currentUser?.id || 'GUEST'}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {filteredLogs.map((log) => (
                            <div key={log.id} className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-2 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5 transition-all">
                                <span className="text-slate-500 min-w-[140px] shrink-0">[{new Date(log.timestamp).toLocaleString()}]</span>
                                <span className="text-purple-400 font-bold min-w-[100px]">{log.module}</span>
                                <span className="text-slate-300 flex-1 truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:bg-[#0b1120] group-hover:z-50">
                                    <span className="text-slate-500 mr-2">{log.user}:</span>
                                    {log.details}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
             </div>
         )}

         {activeTab === 'preferences' && (
             <div className="animate-in fade-in slide-in-from-top-4 duration-500">
               <UserPreferences 
                  currentLang={lang} 
                  onLanguageChange={(newLang) => setLang && setLang(newLang)} 
               />
             </div>
         )}
      </div>
    </div>
  );
};

export default AdminPanel;