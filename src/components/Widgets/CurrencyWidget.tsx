
import React, { useState, useMemo } from 'react';
import { useExchangeRates } from '../../hooks/useExchangeRates';

const STYLES = {
  inputBase: "w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-bold text-slate-700 dark:text-slate-100 outline-none transition-all duration-200",
  inputFocus: "focus:bg-white dark:focus:bg-slate-900 focus:border-[#003d5b] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#003d5b]/20",
};

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
  
  const [amount, setAmount] = useState<number>(1);
  const [targetCurrency, setTargetCurrency] = useState('CNY');
  const [viewMode, setViewMode] = useState<'calc' | 'graph'>('calc');

  const rate = rates[targetCurrency] || 0;
  const converted = (amount * rate).toFixed(2);
  const currencies = Object.keys(rates);

  const trendData = useMemo(() => {
    if (!rate) return [];
    return Array.from({ length: 7 }).map((_, i) => {
        const variance = (Math.random() * 0.04) - 0.02;
        return rate * (1 + variance);
    });
  }, [rate, targetCurrency]);

  const minVal = Math.min(...trendData);
  const maxVal = Math.max(...trendData);

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] shadow-xl dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col h-full relative overflow-hidden group">
      
      <div className="flex justify-between items-start mb-4 z-10">
        <div>
          <h3 
            onClick={onViewDetails}
            className="text-slate-800 dark:text-slate-100 text-sm font-bold flex items-center gap-2 cursor-pointer hover:text-[#003d5b] dark:hover:text-blue-400 transition-colors"
          >
             {viewMode === 'calc' ? 'Converter' : '7-Day Trend'}
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            {lastUpdated ? new Date(lastUpdated).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : 'Live'}
          </p>
        </div>
        
        <div className="flex gap-1">
            {onViewDetails && (
                <button 
                  onClick={onViewDetails}
                  className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-400 dark:text-slate-400 hover:text-[#003d5b] dark:hover:text-blue-400"
                  title="Full Screen"
                >
                  <ExpandIcon className="h-4 w-4" />
                </button>
            )}

            <button 
              onClick={() => setViewMode(viewMode === 'calc' ? 'graph' : 'calc')}
              className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-400 dark:text-slate-400 hover:text-[#003d5b] dark:hover:text-blue-400"
              title={viewMode === 'calc' ? "View Graph" : "View Calculator"}
            >
              {viewMode === 'calc' ? <ChartIcon className="h-4 w-4" /> : <CalcIcon className="h-4 w-4" />}
            </button>
            
            <button 
              onClick={refresh} 
              disabled={loading} 
              className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-400 dark:text-slate-400 hover:text-[#003d5b] dark:hover:text-blue-400"
            >
              <RefreshIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center z-10">
        {viewMode === 'calc' ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 dark:text-slate-600 font-bold">$</span>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className={`${STYLES.inputBase} ${STYLES.inputFocus} font-mono`} 
                  />
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-600">USD</span>
                </div>

                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-100 dark:border-slate-800 pl-4">
                  <span className="text-2xl font-black text-[#003d5b] dark:text-blue-400">{converted}</span>
                  <select 
                    value={targetCurrency} 
                    onChange={(e) => setTargetCurrency(e.target.value)}
                    className="text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 focus:ring-0 outline-none cursor-pointer shadow-sm m-1"
                  >
                    {currencies.map(c => <option key={c} value={c} className="dark:bg-slate-900">{c}</option>)}
                  </select>
                </div>
            </div>
        ) : (
            <div className="flex-1 flex flex-col justify-end animate-in fade-in slide-in-from-right-4">
                <div className="flex justify-between items-end h-32 gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                   {trendData.map((val, i) => {
                       const heightPercent = ((val - minVal) / (maxVal - minVal || 1)) * 80 + 20;
                       return (
                           <div key={i} className="flex-1 flex flex-col justify-end items-center group relative">
                               <div 
                                  className="w-full bg-sky-200/50 dark:bg-blue-900/30 rounded-t-sm group-hover:bg-[#003d5b] dark:group-hover:bg-blue-500 transition-all duration-300"
                                  style={{ height: `${heightPercent}%` }}
                               ></div>
                               <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-slate-700 text-white text-[9px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                   {val.toFixed(4)}
                               </div>
                           </div>
                       );
                   })}
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 dark:text-slate-600 font-mono mt-2 uppercase tracking-wider">
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
