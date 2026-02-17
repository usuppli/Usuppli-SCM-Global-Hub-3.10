
import React from 'react';
import { useTariff } from '../../context/TariffContext';

// Icons
const GlobeIcon = ({ className }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const CogIcon = ({ className }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 3.31a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-3.31a1.724 1.724 0 002.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);

const GlobalTariffMatrix = ({ currentUser, onNavigateToAdmin }) => {
    // Consume dynamic data from Context
    const { rates } = useTariff();

    const isSuperAdmin = currentUser?.role?.toLowerCase() === 'super_admin';

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full animate-in fade-in">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <GlobeIcon className="w-4 h-4 text-[#003d5b] dark:text-blue-400" />
                        Global Import Duties
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Live rates applied to costing models</p>
                </div>
                
                {/* Smart Link for Super Admins */}
                {isSuperAdmin && (
                    <button 
                        onClick={onNavigateToAdmin} 
                        className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-[#003d5b] dark:hover:text-blue-400 transition-colors bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700"
                        title="Edit Rates (Admin)"
                    >
                        <CogIcon className="w-3 h-3" /> Manage
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-950 text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest sticky top-0 border-b dark:border-slate-800">
                        <tr>
                            <th className="p-4">Region</th>
                            <th className="p-4 text-right">Duty Rate</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                        {Object.entries(rates).map(([country, rate]) => (
                            <tr key={country} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="p-4 font-bold text-slate-700 dark:text-slate-300 group-hover:text-[#003d5b] dark:group-hover:text-white">
                                    {country}
                                </td>
                                <td className="p-4 text-right font-mono font-bold text-slate-600 dark:text-slate-400">
                                    {(Number(rate) * 100).toFixed(1)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-[9px] text-slate-400 italic">
                    Rates are indicative. Verify with local brokers.
                </p>
            </div>
        </div>
    );
};

export default GlobalTariffMatrix;
