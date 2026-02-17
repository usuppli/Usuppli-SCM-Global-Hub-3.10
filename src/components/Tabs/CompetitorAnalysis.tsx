
import React, { useState, useEffect } from 'react';
import { Product, Language } from '../../types';
import { translations } from '../../translations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Target, Plus, TrendingUp, TrendingDown, Minus, ExternalLink, Globe, DollarSign, X, Save } from 'lucide-react';

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

const CompetitorAnalysis: React.FC<Props> = ({ product, lang, onAddCompetitor, onSave, isReadOnly }) => {
  const t = (translations[lang] || translations['en'])?.competitor || translations['en'].competitor;
  const commonT = (translations[lang] || translations['en'])?.common || translations['en'].common;

  // State for "Track New" Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComp, setNewComp] = useState({ brand: '', price: '', origin: '', strength: '', marketShare: '10' });

  // State for "Edit Table" Mode
  const [isEditingTable, setIsEditingTable] = useState(false);
  
  // Simulated Tier Data (In a real app, this would come from product.competitors)
  const [tierData, setTierData] = useState({
    ultra: [ { id: 1, brand: 'La Perla', price: '$250.00', origin: 'Italy', strength: 'Luxury Heritage', marketShare: 22, trend: 'up' } ],
    premium: [
        { id: 2, brand: "Victoria's Secret", price: '$79.50', origin: 'USA', strength: 'Brand Power', marketShare: 35, trend: 'down' },
        { id: 3, brand: 'ThirdLove', price: '$84.00', origin: 'USA', strength: 'Fit Technology', marketShare: 18, trend: 'neutral' }
    ],
    value: [ { id: 4, brand: 'Target (Auden)', price: '$22.00', origin: 'Global', strength: 'Accessibility', marketShare: 15, trend: 'up' } ]
  });

  // Chart Data Preparation (Combines Product + Simulated Data)
  const competitors = product.competitors || [];
  const priceData = [
    { name: 'My Product', price: product.retailPrice || 0, fill: '#3b82f6' },
    ...competitors.map((c: any) => ({ name: c.brand, price: Number(c.price), fill: '#94a3b8' }))
  ];
  const marketData = [
    { name: 'My Share', value: 15, fill: '#3b82f6' },
    ...competitors.map((c: any, i: number) => ({ name: c.brand, value: Number(c.marketShare) || 10, fill: ['#64748b', '#94a3b8', '#cbd5e1'][i % 3] }))
  ];

  // Handle "Track New" Save
  const handleModalSave = () => {
    if (!newComp.brand || !newComp.price) return;
    if (onAddCompetitor) {
        onAddCompetitor({
            id: `comp-${Date.now()}`,
            ...newComp,
            price: Number(newComp.price)
        });
    }
    setNewComp({ brand: '', price: '', origin: '', strength: '', marketShare: '10' });
    setIsModalOpen(false);
  };

  // Handle Table Changes
  const handleTableChange = (tier: 'ultra' | 'premium' | 'value', index: number, field: string, val: string) => {
      const newTier = [...tierData[tier]];
      newTier[index] = { ...newTier[index], [field]: val };
      setTierData(prev => ({ ...prev, [tier]: newTier }));
  };

  const EditableRow: React.FC<{ item: any, tier: 'ultra'|'premium'|'value', index: number }> = ({ item, tier, index }) => {
      if (!isEditingTable) {
          return (
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group/row">
                <td className="py-3 px-2 w-1/4">
                    <div className="font-bold text-slate-700 dark:text-slate-100">{item.brand}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{item.marketShare}% Share</div>
                </td>
                <td className="py-3 px-2 w-1/4">
                    <div className="text-slate-600 dark:text-slate-300 font-mono text-xs">{item.price}</div>
                </td>
                <td className="py-3 px-2 w-1/4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wide">{item.origin}</span>
                </td>
                <td className="py-3 px-2 w-1/4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs italic text-slate-600 dark:text-slate-400">{item.strength}</span>
                        <div className={`p-1 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity ${
                            item.trend === 'up' ? 'bg-emerald-100 text-emerald-600' : 
                            item.trend === 'down' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                            {item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : item.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                        </div>
                    </div>
                </td>
            </tr>
          );
      }
      return (
        <tr className="border-b dark:border-slate-800">
            <td className="py-2 w-1/4 pr-2"><input className={STYLES.inputTable} value={item.brand} onChange={e => handleTableChange(tier, index, 'brand', e.target.value)} placeholder="Brand Name" /></td>
            <td className="py-2 w-1/4 pr-2"><input className={STYLES.inputTable} value={item.price} onChange={e => handleTableChange(tier, index, 'price', e.target.value)} placeholder="Price" /></td>
            <td className="py-2 w-1/4 pr-2"><input className={STYLES.inputTable} value={item.origin} onChange={e => handleTableChange(tier, index, 'origin', e.target.value)} placeholder="Origin" /></td>
            <td className="py-2"><input className={STYLES.inputTable} value={item.strength} onChange={e => handleTableChange(tier, index, 'strength', e.target.value)} placeholder="Strength" /></td>
        </tr>
      );
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
             <Target className="w-8 h-8 text-rose-500" />
             {t?.title || "Competitor Intelligence"}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-bold text-xs uppercase tracking-widest pl-1">{t?.subtitle}</p>
        </div>
        {!isReadOnly && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#003d5b] dark:bg-blue-600 text-white rounded-xl shadow-lg hover:bg-[#002a40] transition-all active:scale-95 font-bold text-xs uppercase tracking-wide"
          >
            <Plus className="w-4 h-4" /> {t?.trackNew || "Track Competitor"}
          </button>
        )}
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
           <h4 className="text-xs font-bold text-slate-500 uppercase mb-6">{t?.pricePosition || "Price Position"}</h4>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={priceData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                 <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                 <YAxis tick={{fontSize: 10}} axisLine={false} tickLine={false} prefix="$" />
                 <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                 <Bar dataKey="price" radius={[4, 4, 0, 0]}>
                    {priceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
           <h4 className="text-xs font-bold text-slate-500 uppercase mb-6">{t?.marketShare || "Market Share"}</h4>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={marketData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {marketData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                 </Pie>
                 <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* TIERED ANALYSIS TABLE */}
      <div className={`bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all duration-200 ${!isEditingTable && !isReadOnly ? 'cursor-pointer hover:border-sky-400 dark:hover:border-blue-500 group' : ''}`} onClick={() => !isEditingTable && !isReadOnly && setIsEditingTable(true)}>
           
           {!isEditingTable && !isReadOnly && (
              <div className="absolute top-6 right-6 text-[10px] font-bold text-sky-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider bg-sky-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">{commonT?.clickToEdit || "Click to edit"}</div>
           )}

           {isEditingTable && (
              <div className="absolute top-6 right-6 flex gap-2 z-10">
                  <button onClick={(e) => { e.stopPropagation(); setIsEditingTable(false); }} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors">{commonT?.cancel || "Cancel"}</button>
                  <button onClick={(e) => { e.stopPropagation(); setIsEditingTable(false); if(onSave) onSave(product); }} className="px-4 py-2 bg-[#003d5b] dark:bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-sky-900 shadow-lg transition-colors">{commonT?.save || "Save"}</button>
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
                              {tierData[tierKey as keyof typeof tierData].map((item, i) => <EditableRow key={item.id} item={item} tier={tierKey as any} index={i} />)}
                          </tbody>
                      </table>
                  </div>
              ))}
           </div>
      </div>

      {/* TRACK NEW MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border dark:border-slate-800 p-6 space-y-4">
                <div className="flex justify-between items-center border-b dark:border-slate-800 pb-3">
                    <h3 className="font-bold text-lg dark:text-white">{t?.trackNew || "Track New Competitor"}</h3>
                    <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                
                <div className="space-y-4">
                    <ModalInput label={t?.headers?.brand || "Brand Name"} placeholder="e.g. Zara" value={newComp.brand} onChange={(e: any) => setNewComp({...newComp, brand: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                        <ModalInput label={t?.headers?.price || "Retail Price ($)"} type="number" placeholder="0.00" value={newComp.price} onChange={(e: any) => setNewComp({...newComp, price: e.target.value})} />
                        <ModalInput label={t?.marketShare || "Est. Share (%)"} type="number" placeholder="10" value={newComp.marketShare} onChange={(e: any) => setNewComp({...newComp, marketShare: e.target.value})} />
                    </div>
                    <ModalInput label={t?.headers?.origin || "Origin Country"} placeholder="e.g. Vietnam" value={newComp.origin} onChange={(e: any) => setNewComp({...newComp, origin: e.target.value})} />
                    <ModalInput label={t?.headers?.strength || "Key Strength"} placeholder="e.g. Fast Delivery" value={newComp.strength} onChange={(e: any) => setNewComp({...newComp, strength: e.target.value})} />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-500 font-bold">{commonT?.cancel || "Cancel"}</button>
                    <button onClick={handleModalSave} className="px-6 py-2 bg-[#003d5b] text-white rounded-lg font-bold flex items-center gap-2">
                        <Save className="w-4 h-4" /> {commonT?.save || "Save"}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CompetitorAnalysis;