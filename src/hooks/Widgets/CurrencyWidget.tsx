

import React, { useState, useMemo } from 'react';
import { useExchangeRates } from '../../hooks/useExchangeRates';

// --- STANDARDIZED FORM COMPONENTS ---
const STYLES = {
  inputBase: "w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-700 outline-none transition-all duration-200",
  inputFocus: "focus:bg-white focus:border-[#003d5b] focus:ring-2 focus:ring-[#003d5b]/20",
};

// --- SAFE LOCAL ICONS (No External Dependencies) ---
const RefreshIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
);
const ChartIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
);
const CalcIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
);
const ExpandIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
);

interface CurrencyWidgetProps {
  onViewDetails?: () => void;
}

export const CurrencyWidget: React.FC<CurrencyWidgetProps> = ({ onViewDetails }) => {
  const { rates, loading, refresh, lastUpdated } = useExchangeRates();
  
  // Local state
  const [amount, setAmount] = useState<number>(1);
  const [targetCurrency, setTargetCurrency] = useState('CNY');
  const [viewMode, setViewMode] = useState<'calc' | 'graph'>('calc');

  // Derived values
  const rate = rates[targetCurrency] || 0;
  const converted = (amount * rate).toFixed(2);
  const currencies = Object.keys(rates);

  // Simulate Trend Data (Replaces 'getTrendData' to ensure it works without complex hooks)
  // In a real app, this would come from your API.
  const trendData = useMemo(() => {
    if (!rate) return [];
    // Generate 7 days of fake variance around the current rate
    return Array.from({ length: 7 }).map((_, i) => {
        const variance = (Math.random() * 0.04) - 0.02; // +/- 2%
        return rate * (1 + variance);
    });
  }, [rate, targetCurrency]);

  const minVal = Math.min(...trendData);
  const maxVal = Math.max(...trendData);

  return (
    <div className="bg-white p-5 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col h-full relative overflow-hidden group">
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-4 z-10">
        <div>
          <h3 
            onClick={onViewDetails}
            className="text-slate-800 text-sm font-bold flex items-center gap-2 cursor-pointer hover:text-[#003d5b] transition-colors"
          >
             {viewMode === 'calc' ? 'Converter' : '7-Day Trend'}
          </h3>
          <p className="text-[10px] text-slate-400 font-medium">
            {lastUpdated ? new Date(lastUpdated).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : 'Live'}
          </p>
        </div>
        
        <div className="flex gap-1">
            {/* Expand Button */}
            {onViewDetails && (
                <button 
                  onClick={onViewDetails}
                  className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-[#003d5b]"
                  title="Full Screen"
                >
                  <ExpandIcon className="h-4 w-4" />
                </button>
            )}

            {/* Toggle View */}
            <button 
              onClick={() => setViewMode(viewMode === 'calc' ? 'graph' : 'calc')}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-[#003d5b]"
              title={viewMode === 'calc' ? "View Graph" : "View Calculator"}
            >
              {viewMode === 'calc' ? <ChartIcon className="h-4 w-4" /> : <CalcIcon className="h-4 w-4" />}
            </button>
            
            {/* Refresh */}
            <button 
              onClick={refresh} 
              disabled={loading} 
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-[#003d5b]"
            >
              <RefreshIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col justify-center z-10">
        
        {viewMode === 'calc' ? (
            /* MODE 1: CALCULATOR VIEW */
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 font-bold">$</span>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className={`${STYLES.inputBase} ${STYLES.inputFocus} font-mono`} 
                  />
                  <span className="text-xs font-bold text-slate-400">USD</span>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-1 rounded-xl border border-slate-100 pl-4">
                  <span className="text-2xl font-black text-[#003d5b]">{converted}</span>
                  <select 
                    value={targetCurrency} 
                    onChange={(e) => setTargetCurrency(e.target.value)}
                    className="text-xs font-bold bg-white text-slate-700 border border-slate-200 rounded-lg py-2 px-3 focus:ring-0 outline-none cursor-pointer shadow-sm m-1"
                  >
                    {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
            </div>
        ) : (
            /* MODE 2: TREND GRAPH (CSS-ONLY) */
            <div className="flex-1 flex flex-col justify-end animate-in fade-in slide-in-from-right-4">
                <div className="flex justify-between items-end h-32 gap-2 pb-2 border-b border-slate-200">
                   {trendData.map((val, i) => {
                       // Normalize height between 20% and 100%
                       const heightPercent = ((val - minVal) / (maxVal - minVal || 1)) * 80 + 20;
                       return (
                           <div key={i} className="flex-1 flex flex-col justify-end items-center group relative">
                               <div 
                                  className="w-full bg-sky-200/50 rounded-t-sm group-hover:bg-[#003d5b] transition-all duration-300"
                                  style={{ height: `${heightPercent}%` }}
                               ></div>
                               {/* Tooltip */}
                               <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                   {val.toFixed(4)}
                               </div>
                           </div>
                       );
                   })}
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-2 uppercase tracking-wider">
                   <span>7 Days Ago</span>
                   <span>Today</span>
                </div>
                <div className="mt-2 text-center">
                    <span className={`text-xs font-bold ${trendData[6] >= trendData[0] ? 'text-emerald-500' : 'text-red-500'}`}>
                        {trendData[6] >= trendData[0] ? '▲ Trending Up' : '▼ Trending Down'}
                    </span>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyWidget;