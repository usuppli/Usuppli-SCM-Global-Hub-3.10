
import React, { useState, useEffect } from 'react';
import TariffAdminWidget from './TariffAdminWidget';
import { useGlobalConfig } from '../../context/GlobalConfigContext';
import { User } from '../../types';

// Icons
const SaveIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>;
const ResetIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const ShieldIcon = () => <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;

interface Props {
    currentUser: User | null;
}

const AdminSettingsPanel: React.FC<Props> = ({ currentUser }) => {
    const { tariffs, systemVersion, updateTariff, updateVersion, resetAll } = useGlobalConfig();
    const [localVersion, setLocalVersion] = useState(systemVersion);

    // Sync local state if context changes externally
    useEffect(() => {
        setLocalVersion(systemVersion);
    }, [systemVersion]);

    // STRICT RBAC CHECK
    const isSuperAdmin = currentUser?.role?.toLowerCase() === 'super_admin';

    if (!isSuperAdmin) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-3xl text-center animate-in fade-in">
                <div className="text-red-500 mb-4"><ShieldIcon /></div>
                <h3 className="text-xl font-bold text-red-700 dark:text-red-400">Access Denied</h3>
                <p className="text-sm text-red-600 dark:text-red-300 mt-2">
                    Global Configuration is restricted to Super Administrators only.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 dark:text-white">Global Configuration</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">System-wide parameters and constants</p>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-200 dark:border-purple-800">
                    Super Admin Mode
                </span>
            </div>

            {/* SECTION 1: SYSTEM IDENTITY */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> System Identity
                </h3>
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-wider">Global Version String</label>
                        <input 
                            type="text"
                            value={localVersion}
                            onChange={(e) => setLocalVersion(e.target.value)}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-sm font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
                        />
                    </div>
                    <button 
                        onClick={() => updateVersion(localVersion)}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95 flex items-center gap-2 text-sm"
                    >
                        <SaveIcon /> Update Version
                    </button>
                </div>
            </div>

            {/* SECTION 2: TARIFF RATES */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Global Tariff Matrix
                </h3>
                <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-2xl">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                            <tr>
                                <th className="p-4 border-b border-slate-200 dark:border-slate-800">Region</th>
                                <th className="p-4 border-b border-slate-200 dark:border-slate-800">Rate (Decimal)</th>
                                <th className="p-4 border-b border-slate-200 dark:border-slate-800 text-right">Effective %</th>
                                <th className="p-4 border-b border-slate-200 dark:border-slate-800 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {Object.entries(tariffs).map(([country, rate]) => (
                                <tr key={country} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4 font-bold text-slate-700 dark:text-slate-200">{country}</td>
                                    <td className="p-4">
                                        <input 
                                            type="number"
                                            step="0.001"
                                            min="0"
                                            max="1"
                                            value={rate}
                                            onChange={(e) => updateTariff(country, e.target.value)}
                                            className="w-32 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-white font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </td>
                                    <td className="p-4 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">
                                        {(Number(rate) * 100).toFixed(1)}%
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className="text-[10px] text-slate-400 italic">Auto-saved</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SECTION 3: DANGER ZONE */}
            <div className="flex justify-end pt-6 border-t border-slate-200 dark:border-slate-800">
                <button 
                    onClick={() => {
                        if(window.confirm("CRITICAL WARNING: This will factory reset all global settings. Are you sure?")) {
                            resetAll();
                        }
                    }}
                    className="px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 font-bold rounded-xl border border-red-200 dark:border-red-800 transition-colors flex items-center gap-2"
                >
                    <ResetIcon /> Reset All to Defaults
                </button>
            </div>
        </div>
    );
};

export default AdminSettingsPanel;
