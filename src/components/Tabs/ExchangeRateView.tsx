
import React, { useState, useMemo } from 'react';
import { useExchangeRates } from '../../hooks/useExchangeRates';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RefreshIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
);
const TrendingUpIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
);
const EditIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
);
const SaveIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
);

// Matching Styles from Workspace/Tariffs
const INPUT_STYLE = "w-full p-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-lg font-black text-slate-700 dark:text-slate-200 outline-none transition-all duration-200 focus:bg-white dark:focus:bg-slate-900 focus:border-[#003d5b] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#003d5b]/20";

export const ExchangeRateView: React.FC = () => {
  const { rates, loading, refresh, lastUpdated, getTrendData } = useExchangeRates();
  const currencies = Object.keys(rates);
  
  const [selectedCurrency, setSelectedCurrency] = useState<string>('CNY');
  const [isEditing, setIsEditing] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, number>>({});

  const displayRate = (curr: string) => overrides[curr] || rates[curr] || 0;

  const handleOverride = (curr: string, val: string) => {
      setOverrides(prev => ({ ...prev, [curr]: parseFloat(val) }));
  };

  const trendData = useMemo(() => getTrendData(selectedCurrency), [selectedCurrency, getTrendData]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
        <div className="flex justify-between items-center mb-4">
            <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Market Spot Rates</h3>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">Institutional procurement indices</p>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`p-3 rounded-xl transition-all shadow-sm active:scale-95 ${isEditing ? 'bg-[#003d5b] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                    title={isEditing ? "Save Changes" : "Edit Rates"}
                >
                    {isEditing ? <SaveIcon className="w-5 h-5" /> : <EditIcon className="w-5 h-5" />}
                </button>
                <button 
                    onClick={refresh} 
                    disabled={loading}
                    className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all text-slate-600 dark:text-slate-300 disabled:opacity-50 shadow-sm active:scale-95"
                >
                    <RefreshIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>

        {/* CURRENCY GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currencies.map(curr => (
                <div 
                    key={curr} 
                    onClick={() => setSelectedCurrency(curr)}
                    className={`bg-white dark:bg-slate-800 border p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer group relative ${selectedCurrency === curr ? 'border-[#003d5b] ring-2 ring-[#003d5b]/20' : 'border-slate-100 dark:border-slate-700 hover:-translate-y-1'}`}
                >
                    {/* Header - Arrows Removed */}
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{curr} / USD</span>
                    </div>
                    
                    {/* Rate Display / Edit Input */}
                    <div className="flex items-baseline gap-2 mb-1">
                        {isEditing ? (
                            <input 
                                type="number" 
                                className={INPUT_STYLE}
                                value={displayRate(curr)}
                                onChange={(e) => handleOverride(curr, e.target.value)}
                                onFocus={() => setSelectedCurrency(curr)}
                            />
                        ) : (
                            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{displayRate(curr).toFixed(3)}</span>
                        )}
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{curr}</span>
                    </div>

                    <div className="pt-3 border-t border-slate-50 dark:border-slate-700 flex justify-between items-center">
                        <span className="text-[8px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Base: 1.00 USD</span>
                        <span className="text-[9px] text-slate-300 dark:text-slate-600 font-mono font-bold bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded">
                            {lastUpdated ? new Date(lastUpdated).toLocaleDateString() : '--'}
                        </span>
                    </div>
                </div>
            ))}
        </div>

        {/* GRAPH SECTION */}
        <div className="mt-6 p-8 bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h4 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <TrendingUpIcon className="w-5 h-5 text-[#003d5b]" />
                        {selectedCurrency} Historical Trend
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">30-Day Rate Fluctuation Analysis</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-500">1M</span>
                    <span className="px-3 py-1 bg-white dark:bg-slate-900 rounded-lg text-[10px] font-bold text-slate-400 border border-slate-200 dark:border-slate-700">3M</span>
                    <span className="px-3 py-1 bg-white dark:bg-slate-900 rounded-lg text-[10px] font-bold text-slate-400 border border-slate-200 dark:border-slate-700">1Y</span>
                </div>
            </div>
            
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                        <defs>
                            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#003d5b" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#003d5b" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                        <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: number) => [value.toFixed(4), 'Rate']}
                        />
                        <Area type="monotone" dataKey="value" stroke="#003d5b" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
};

export default ExchangeRateView;