
import React, { useState, useEffect } from 'react';
import { Product, Language } from '../../types';
import { translations } from '../../translations';

const STYLES = {
  inputTable: "w-full p-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 outline-none transition-all duration-200 focus:bg-white dark:focus:bg-slate-900 focus:border-[#003d5b] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#003d5b]/20",
};

interface Props {
  product?: Product;
  lang: Language;
  onSave?: (product: Product) => void;
  isReadOnly?: boolean;
}

const LaunchTimeline: React.FC<Props> = ({ lang, product, onSave, isReadOnly }) => {
  // CRASH PROTECTION: Use optional chaining and fallback to English
  const t = (translations[lang] || translations['en'])?.timeline || translations['en'].timeline;
  const common = (translations[lang] || translations['en'])?.common || translations['en'].common;

  // Helper to safely get phase translations
  const getPhaseText = (key: string, field: 'market' | 'activity', defaultText: string) => {
    return t?.phases?.[key]?.[field] || defaultText;
  };

  const [isEditing, setIsEditing] = useState(false);
  const [phases, setPhases] = useState([
    { id: 1, key: 'p1', date: 'Q1 2026', market: 'Global', activity: 'Concept Validation' },
    { id: 2, key: 'p2', date: 'Q2 2026', market: 'Asia', activity: 'Prototyping' },
    { id: 3, key: 'p3', date: 'Q3 2026', market: 'Europe', activity: 'Pilot Run' },
    { id: 4, key: 'p4', date: 'Q4 2026', market: 'USA', activity: 'Mass Production' },
    { id: 5, key: 'p5', date: 'Q1 2027', market: 'Global', activity: 'Official Launch' },
  ]);

  // Load translated initial values if not edited yet (optional enhancement)
  // For now, we keep static defaults to ensure stability, or you can map them:
  /*
  const [phases, setPhases] = useState([
    { id: 1, key: 'p1', date: 'Q1 2026', market: t?.phases?.concept || 'Global', activity: 'Concept' },
    ...
  ]);
  */

  useEffect(() => {
    if (isEditing) {
      const firstInput = document.querySelector('#timeline-card input') as HTMLElement;
      if (firstInput) firstInput.focus();
    }
  }, [isEditing]);

  const handleChange = (index: number, field: string, value: string) => {
    const newPhases = [...phases];
    newPhases[index] = { ...newPhases[index], [field]: value };
    setPhases(newPhases);
  };

  const handleSave = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (onSave && product) onSave(product);
    setIsEditing(false);
  };

  const getCardClassName = () => 
    `bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all duration-200 ${
      !isEditing && !isReadOnly ? 'cursor-pointer hover:border-sky-400 dark:hover:border-blue-500 group' : ''
    }`;

  return (
    <div className="space-y-6 animate-in fade-in">
        <div id="timeline-card" className={getCardClassName()} onClick={() => !isEditing && !isReadOnly && setIsEditing(true)}>
             {!isEditing && !isReadOnly && (
                <div className="absolute top-3 right-3 text-[10px] font-bold text-sky-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">{common?.clickToEdit || "Click to edit"}</div>
            )}

            {isEditing && (
                <div className="absolute top-3 right-3 flex gap-2 z-10">
                    <button onClick={(e) => { e.stopPropagation(); setIsEditing(false); }} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-lg hover:bg-slate-200">{common?.cancel || "Cancel"}</button>
                    <button onClick={handleSave} className="px-3 py-1 bg-[#003d5b] dark:bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-sky-900 shadow-lg">{common?.save || "Save"}</button>
                </div>
            )}

            <h3 className="font-bold text-slate-800 dark:text-white mb-1">{t?.title || "Product Launch Timeline"}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">{t?.subtitle || "Critical Path Management"}</p>
            
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    <tr><th className="p-3 px-4">Phase</th><th className="p-3 px-4">Timeline</th><th className="p-3 px-4">Region</th><th className="p-3 px-4">Major Activity</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {phases.map((p, i) => (
                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="p-4 px-4 font-black text-slate-300 dark:text-slate-600">0{p.id}</td>
                            <td className="p-4 px-4 font-mono text-slate-600 dark:text-slate-300">
                                {isEditing ? <input className={`${STYLES.inputTable} font-mono`} value={p.date} onChange={(e) => handleChange(i, 'date', e.target.value)} /> : p.date}
                            </td>
                            <td className="p-4 px-4 font-bold text-slate-800 dark:text-slate-200">
                                {isEditing ? <input className={STYLES.inputTable} value={p.market} onChange={(e) => handleChange(i, 'market', e.target.value)} /> : p.market}
                            </td>
                            <td className="p-4 px-4 text-slate-600 dark:text-slate-400">
                                {isEditing ? <input className={STYLES.inputTable} value={p.activity} onChange={(e) => handleChange(i, 'activity', e.target.value)} /> : p.activity}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};
export default LaunchTimeline;