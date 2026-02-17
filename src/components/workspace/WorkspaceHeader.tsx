
import React from 'react';
import { useGlobalConfig } from '../../context/GlobalConfigContext';

const SparklesIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
);

const WorkspaceHeader: React.FC = () => {
    // Consume global version string dynamically
    const { systemVersion } = useGlobalConfig();

    return (
        <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-2xl shadow-lg mb-6 text-white border border-slate-700/50">
            
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                    <SparklesIcon className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest">Global Environment</h2>
                    <p className="text-[10px] text-slate-400 font-mono">Running Protocol: {systemVersion}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-4 mt-3 md:mt-0">
                <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">System Optimal</span>
                </div>
            </div>
        </div>
    );
};

export default WorkspaceHeader;
