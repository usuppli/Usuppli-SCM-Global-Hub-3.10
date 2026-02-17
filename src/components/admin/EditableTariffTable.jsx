
import React from 'react';
import { useTariff } from '../../context/TariffContext';

// Standardized Security Icon
const LockIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
);

const EditableTariffTable = ({ currentUser }) => {
    const { rates, updateRate, resetToDefaults } = useTariff();

    // --- SECURITY GATE ---
    // Strictly enforce role check. Normalizes case to prevent 'Super_Admin' bypasses.
    const isSuperAdmin = currentUser?.role?.toLowerCase() === 'super_admin';

    if (!isSuperAdmin) {
        return (
            <div className="p-8 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-2xl flex flex-col items-center text-center animate-in fade-in">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
                    <LockIcon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-red-700 dark:text-red-400">Access Restricted</h3>
                <p className="text-sm text-red-600 dark:text-red-300 mt-2">
                    Modification of Global Duty Rates is restricted to Super Administrators.
                    <br />Please contact IT Governance for clearance.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-4">
            
            {/* Admin Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        Admin Tariff Control
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Editing as: <span className="font-mono font-bold text-[#003d5b] dark:text-blue-400">{currentUser.email}</span>
                    </p>
                </div>
                <div className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-red-200 dark:border-red-800">
                    Write Access
                </div>
            </div>

            {/* Edit Table */}
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                        <th className="p-4 pl-6">Region / Country</th>
                        <th className="p-4">Decimal Rate</th>
                        <th className="p-4">Percentage</th>
                        <th className="p-4 text-right pr-6">Input</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {Object.entries(rates).map(([country, rate]) => (
                        <tr key={country} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="p-4 pl-6 font-bold text-slate-700 dark:text-slate-200">
                                {country}
                            </td>
                            <td className="p-4 font-mono text-slate-600 dark:text-slate-400">
                                {rate.toFixed(4)}
                            </td>
                            <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                {(rate * 100).toFixed(2)}%
                            </td>
                            <td className="p-4 pr-6 text-right">
                                <input
                                    type="number"
                                    step="0.001"
                                    min="0"
                                    max="1"
                                    value={rate}
                                    onChange={(e) => updateRate(country, e.target.value)}
                                    className="w-24 p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-right font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Footer Actions */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                    onClick={() => {
                        if (window.confirm("SECURITY WARNING: This will overwrite all custom rates with the 2026 System Defaults. This action cannot be undone.")) {
                            resetToDefaults();
                        }
                    }}
                    className="px-4 py-2 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 font-bold text-xs rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm active:scale-95"
                >
                    Reset to 2026 Defaults
                </button>
            </div>
        </div>
    );
};

export default EditableTariffTable;
