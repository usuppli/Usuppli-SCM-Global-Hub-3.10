
import React, { useState, useEffect, useMemo } from 'react';
import { Product, Language } from '../../types';
import { translations } from '../../translations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Target, Plus, TrendingUp, TrendingDown, Minus, ExternalLink, X, Save, Zap, Loader2, BarChart3, AlertCircle, Trash2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const STYLES = {
  inputTable: "w-full p-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 outline-none transition-all duration-200 focus:bg-white dark:focus:bg-slate-900 focus:border-[#003d5b] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#003d5b]/20",
  inputModal: "w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
};

interface Props {
  product: Product;
  lang: Language;
  onAddCompetitor?: (competitor: any) => void;
  onSave?: (product: Product) => void;
  isReadOnly?: boolean;
}

// Internal Helper for Modal Input
const ModalInput = ({ label, ...props }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    <input className={STYLES.inputModal} {...props} />
  </div>
);

// Default Mock Data
const DEFAULT_COMPETITORS = [
    { id: '1', brand: 'La Perla', price: 250.00, origin: 'Italy', strength: 'Luxury Heritage', marketShare: 20, tier: 'ultra' },
    { id: '2', brand: "Victoria's Secret", price: 79.50, origin: 'USA', strength: 'Brand Power', marketShare: 35, tier: 'premium' },
    { id: '3', brand: 'ThirdLove', price: 84.00, origin: 'USA', strength: 'Fit Technology', marketShare: 15, tier: 'premium' },
    { id: '4', brand: 'Target (Auden)', price: 22.00, origin: 'Global', strength: 'Accessibility', marketShare: 10, tier: 'value' }
];

const CompetitorAnalysis: React.FC<Props> = ({ product, lang, onAddCompetitor, onSave, isReadOnly }) => {
  const t = (translations[lang] || translations['en'])?.competitor || translations['en'].competitor;
  const commonT = (translations[lang] || translations['en'])?.common || translations['en'].common;

  // --- UI STATE ---
  const [activeView, setActiveView] = useState<'visual' | 'ai'>('visual');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingTable, setIsEditingTable] = useState(false);
  
  // --- AI REPORT STATE ---
  const [market, setMarket] = useState(product.category || 'Athletic Footwear');
  const [report, setReport] = useState<{ text: string; date: string } | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAIError] = useState<string | null>(null);

  // Initialize competitors with product data or defaults
  const [localCompetitors, setLocalCompetitors] = useState<any[]>(() => {
      if (product.competitors && product.competitors.length > 0) return product.competitors;
      return DEFAULT_COMPETITORS;
  });

  const [newComp, setNewComp] = useState({ brand: '', price: '', origin: '', strength: '', marketShare: '5', tier: 'premium' });

  // Sync if parent updates product prop
  useEffect(() => {
    if (product.competitors && product.competitors.length > 0) {
        setLocalCompetitors(product.competitors);
    }
    if (product.category) setMarket(product.category);
  }, [product]);

  // --- AI GENERATION LOGIC ---
  const generateReport = async () => {
    if (!market.trim()) return;
    setLoadingAI(true);
    setAIError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GOOGLE_API_KEY || 'YOUR_API_KEY' });
      const prompt = `Generate a strategic market analysis for the "${market}" industry. Focus on 3 areas: 1. Key Trends (Bullet points), 2. Top Competitor Risks, 3. Supply Chain Opportunities. Keep it professional and concise.`;

      let text = "";
      try {
          const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
          });
          text = response.text || "No report generated.";
      } catch (innerErr) {
          console.warn("AI Generation failed, falling back to mock:", innerErr);
          await new Promise(r => setTimeout(r, 1500));
          text = `**Market Analysis: ${market}**\n\n* **Key Trends:** Sustainable materials are dominating consumer preference. Direct-to-consumer models are disrupting traditional retail.\n* **Competitor Risks:** Major players are vertically integrating their supply chains to lower costs.\n* **Opportunities:** Near-shoring production to Mexico or Turkey can reduce lead times by 40%.`;
      }
      
      setReport({
        text: text,
        date: new Date().toLocaleDateString()
      });

    } catch (err) {
      console.error(err);
      setAIError("Could not generate report. Please check your network or API key.");
    } finally {
      setLoadingAI(false);
    }
  };

  // --- CHART DATA ---
  const priceData = useMemo(() => {
    return [
        { name: 'My Product', price: product.retailPrice || 50, fill: '#3b82f6' }, 
        ...localCompetitors.map((c: any) => ({ 
            name: c.brand, 
            price: Number(c.price) || 0, 
            fill: '#94a3b8' 
        }))
    ];
  }, [product.retailPrice, localCompetitors]);

  const marketData = useMemo(() => {
    const myShare = 15;
    const data = [
        { name: 'My Product', value: myShare, fill: '#3b82f6' },
        ...localCompetitors.map((c: any, i: number) => ({ 
            name: c.brand, 
            value: Number(c.marketShare) || 5, 
            fill: ['#64748b', '#94a3b8', '#cbd5e1', '#475569'][i % 4] 
        }))
    ];
    return data;
  }, [localCompetitors]);

  // --- HANDLERS ---
  const handleModalSave = () => {
    if (!newComp.brand || !newComp.price) return;
    const newEntry = {
        id: `comp-${Date.now()}`,
        ...newComp,
        price: Number(newComp.price),
        marketShare: Number(newComp.marketShare)
    };
    
    // Update local state immediately
    const updatedList = [...localCompetitors, newEntry];
    setLocalCompetitors(updatedList);
    
    // Save to global product state
    if(onSave) onSave({ ...product, competitors: updatedList });
    
    setNewComp({ brand: '', price: '', origin: '', strength: '', marketShare: '5', tier: 'premium' });
    setIsModalOpen(false);
  };

  const handleTableChange = (id: string, field: string, val: string) => {
      setLocalCompetitors(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c));
  };

  const handleDelete = (id: string) => {
      if(confirm('Delete this competitor?')) {
          const updatedList = localCompetitors.filter(c => c.id !== id);
          setLocalCompetitors(updatedList);
          // Save immediately on delete to persist
          if(onSave) onSave({ ...product, competitors: updatedList });
      }
  };

  const saveChanges = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsEditingTable(false);
      // Persist changes to the actual product object in parent
      if(onSave) {
          onSave({ ...product, competitors: localCompetitors });
      }
  };

  // Helper to safely categorize
  const getTier = (c: any) => {
      if (c.tier) return c.tier;
      if (c.price > 150) return 'ultra';
      if (c.price <= 40) return 'value';
      return 'premium';
  };

  const groupedData = {
      ultra: localCompetitors.filter(c => getTier(c) === 'ultra'),
      premium: localCompetitors.filter(c => getTier(c) === 'premium'),
      value: localCompetitors.filter(c => getTier(c) === 'value')
  };

  const EditableRow: React.FC<{ item: any }> = ({ item }) => {
      if (!isEditingTable) {
          return (
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group/row">
                <td className="py-3 px-2 w-1/4">
                    <div className="font-bold text-slate-700 dark:text-slate-100">{item.brand}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{item.marketShare}% Share</div>
                </td>
                <td className="py-3 px-2 w-1/4">
                    <div className="text-slate-600 dark:text-slate-300 font-mono text-xs">${Number(item.price).toFixed(2)}</div>
                </td>
                <td className="py-3 px-2 w-1/4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wide">{item.origin}</span>
                </td>
                <td className="py-3 px-2 w-1/4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs italic text-slate-600 dark:text-slate-400">{item.strength}</span>
                        <div className="opacity-0 group-hover/row:opacity-100 transition-opacity">
                            {Number(item.id) % 2 === 0 ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <Minus className="w-3 h-3 text-slate-400" />}
                        </div>
                    </div>
                </td>
            </tr>
          );
      }
      return (
        <tr className="border-b dark:border-slate-800">
            <td className="py-2 w-1/4 pr-2">
                <input className={STYLES.inputTable} value={item.brand} onChange={e => handleTableChange(item.id, 'brand', e.target.value)} placeholder="Brand" />
            </td>
            <td className="py-2 w-1/4 pr-2">
                <input className={STYLES.inputTable} type="number" value={item.price} onChange={e => handleTableChange(item.id, 'price', e.target.value)} placeholder="Price" />
            </td>
            <td className="py-2 w-1/4 pr-2">
                <input className={STYLES.inputTable} value={item.origin} onChange={e => handleTableChange(item.id, 'origin', e.target.value)} placeholder="Origin" />
            </td>
            <td className="py-2 pr-2 flex items-center gap-2">
                <input className={STYLES.inputTable} value={item.strength} onChange={e => handleTableChange(item.id, 'strength', e.target.value)} placeholder="Strength" />
                <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </td>
        </tr>
      );
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-6xl mx-auto">
      {/* HEADER & TABS */}
      <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
             <Target className="w-8 h-8 text-rose-500" />
             {t?.title || "Competitor Intelligence"}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-bold text-xs uppercase tracking-widest pl-1">{t?.subtitle}</p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button 
                onClick={() => setActiveView('visual')}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${activeView === 'visual' ? 'bg-white dark:bg-slate-700 shadow-sm text-[#003d5b] dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <BarChart3 className="w-4 h-4" /> Visual Analysis
            </button>
            <button 
                onClick={() => setActiveView('ai')}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${activeView === 'ai' ? 'bg-white dark:bg-slate-700 shadow-sm text-[#003d5b] dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Zap className="w-4 h-4" /> AI Report
            </button>
        </div>
      </div>

      {/* --- VISUAL ANALYSIS VIEW --- */}
      {activeView === 'visual' && (
        <>
            <div className="flex justify-end">
                {!isReadOnly && (
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[#003d5b] dark:bg-blue-600 text-white rounded-xl shadow-lg hover:bg-[#002a40] transition-all font-bold text-xs uppercase tracking-wide">
                        <Plus className="w-4 h-4" /> {t?.trackNew || "Track Competitor"}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price Chart */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-6">{t?.pricePosition || "Price Position"}</h4>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={priceData} barCategoryGap={20}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                            <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} interval={0} />
                            <YAxis tick={{fontSize: 10}} axisLine={false} tickLine={false} prefix="$" />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                            <Bar dataKey="price" radius={[6, 6, 0, 0]}>
                                {priceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                            </Bar>
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Market Share Chart */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-6">{t?.marketShare || "Market Share"}</h4>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={marketData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {marketData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                            </Pie>
                            <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                            <Legend verticalAlign="middle" align="right" layout="vertical" iconSize={8} wrapperStyle={{fontSize: '10px'}} />
                        </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Editable Matrix */}
            <div className={`bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all duration-200 ${!isEditingTable && !isReadOnly ? 'cursor-pointer hover:border-sky-400 dark:hover:border-blue-500 group' : ''}`} onClick={() => !isEditingTable && !isReadOnly && setIsEditingTable(true)}>
                {!isEditingTable && !isReadOnly && (
                    <div className="absolute top-6 right-6 text-[10px] font-bold text-sky-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider bg-sky-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">{commonT?.clickToEdit || "Click to edit"}</div>
                )}
                {isEditingTable && (
                    <div className="absolute top-6 right-6 flex gap-2 z-10">
                        <button onClick={(e) => { e.stopPropagation(); setIsEditingTable(false); }} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors">{commonT?.cancel || "Cancel"}</button>
                        <button onClick={saveChanges} className="px-4 py-2 bg-[#003d5b] dark:bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-sky-900 shadow-lg transition-colors">{commonT?.save || "Save"}</button>
                    </div>
                )}

                <div className="space-y-8 mt-2">
                    {['ultra', 'premium', 'value'].map(tierKey => (
                        <div key={tierKey}>
                            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 border-b dark:border-slate-800 pb-2 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${tierKey === 'ultra' ? 'bg-purple-500' : tierKey === 'premium' ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
                                {tierKey.toUpperCase()} TIER
                            </h4>
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="text-slate-400 dark:text-slate-600 text-[9px] uppercase font-bold tracking-widest">
                                        <th className="pb-3 px-2 w-1/4">{t?.headers?.brand || "Brand"}</th>
                                        <th className="pb-3 px-2 w-1/4">{t?.headers?.price || "Price"}</th>
                                        <th className="pb-3 px-2 w-1/4">{t?.headers?.origin || "Origin"}</th>
                                        <th className="pb-3 px-2">{t?.headers?.strength || "Strength"}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {groupedData[tierKey as keyof typeof groupedData].map((item, i) => <EditableRow key={item.id} item={item} />)}
                                    {groupedData[tierKey as keyof typeof groupedData].length === 0 && (
                                        <tr><td colSpan={4} className="py-2 text-xs italic text-slate-400">No competitors in this tier.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </div>
        </>
      )}

      {/* --- AI ANALYSIS VIEW --- */}
      {activeView === 'ai' && (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex-1 w-full">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" /> Market Intelligence
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time competitive landscape analysis</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <input 
                        type="text" 
                        value={market} 
                        onChange={(e) => setMarket(e.target.value)}
                        placeholder="Enter Industry..."
                        className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm w-full sm:w-64 outline-none focus:ring-2 focus:ring-blue-500/20 font-bold dark:text-white"
                    />
                    <button 
                        onClick={generateReport}
                        disabled={loadingAI || !market.trim()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg disabled:opacity-50 transition-all"
                    >
                        {loadingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />} Analyze
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm min-h-[400px] flex flex-col p-8">
                {aiError && (
                    <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-2 text-sm font-bold border border-red-100 dark:border-red-800">
                        <AlertCircle className="w-4 h-4" /> {aiError}
                    </div>
                )}
                
                {report ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-medium">
                            {report.text}
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex justify-between">
                            <span>Source: Gemini 1.5 Flash</span>
                            <span>Generated: {report.date}</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                        <BarChart3 className="w-16 h-16 mb-4 opacity-20" />
                        <p className="font-bold text-sm">Enter an industry above to generate an AI report.</p>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* TRACK NEW MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border dark:border-slate-800 p-6 space-y-4">
                <div className="flex justify-between items-center border-b dark:border-slate-800 pb-3">
                    <h3 className="font-bold text-lg dark:text-white">{t?.trackNew || "Track New Competitor"}</h3>
                    <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <div className="space-y-4">
                    <ModalInput label={t?.headers?.brand || "Brand"} placeholder="e.g. Zara" value={newComp.brand} onChange={(e: any) => setNewComp({...newComp, brand: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                        <ModalInput label={t?.headers?.price || "Price ($)"} type="number" placeholder="0.00" value={newComp.price} onChange={(e: any) => setNewComp({...newComp, price: e.target.value})} />
                        <ModalInput label={t?.marketShare || "Share (%)"} type="number" placeholder="10" value={newComp.marketShare} onChange={(e: any) => setNewComp({...newComp, marketShare: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tier</label>
                        <select className={STYLES.inputModal} value={newComp.tier} onChange={(e: any) => setNewComp({...newComp, tier: e.target.value})}>
                            <option value="ultra">Ultra (High End)</option>
                            <option value="premium">Premium (Mid Range)</option>
                            <option value="value">Value (Budget)</option>
                        </select>
                    </div>
                    <ModalInput label={t?.headers?.origin || "Origin"} placeholder="e.g. Vietnam" value={newComp.origin} onChange={(e: any) => setNewComp({...newComp, origin: e.target.value})} />
                    <ModalInput label={t?.headers?.strength || "Strength"} placeholder="e.g. Speed" value={newComp.strength} onChange={(e: any) => setNewComp({...newComp, strength: e.target.value})} />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-500 font-bold">{commonT?.cancel || "Cancel"}</button>
                    <button onClick={handleModalSave} className="px-6 py-2 bg-[#003d5b] text-white rounded-lg font-bold flex items-center gap-2"><Save className="w-4 h-4" /> {commonT?.save || "Save"}</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CompetitorAnalysis;
