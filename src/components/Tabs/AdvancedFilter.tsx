
import React, { useState } from 'react';
import { FilterRule, SavedFilter, Language } from '../../types';
import { translations } from '../../translations';

// --- STANDARDIZED STYLES ---
const STYLES = {
  inputBase: "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200",
  inputFocus: "focus:bg-white focus:border-[#003d5b] focus:ring-2 focus:ring-[#003d5b]/20",
  buttonSecondary: "px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all",
  buttonPrimary: "px-6 py-2 bg-[#003d5b] text-white font-bold text-xs rounded-xl hover:bg-sky-900 shadow-lg transition-all"
};

// --- SAFE LOCAL ICONS ---
const PlusIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>);
const TrashIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const SaveIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>);
const FilterIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>);

interface Props {
  fields: { value: string; label: string; type?: 'text' | 'number' | 'select'; options?: string[] }[];
  onApply: (rules: FilterRule[]) => void;
  lang: Language;
}

const AdvancedFilter: React.FC<Props> = ({ fields, onApply, lang }) => {
  const [rules, setRules] = useState<FilterRule[]>([]);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showSave, setShowSave] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');
  
  // Safe Translation Fallback
  const t = (translations[lang] && translations[lang].filter) ? translations[lang].filter : translations['en'].filter;

  const addRule = () => {
    setRules([...rules, { id: Date.now().toString(), field: fields[0].value, operator: 'contains', value: '' }]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const updateRule = (id: string, key: keyof FilterRule, val: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, [key]: val } : r));
  };

  const handleApply = () => {
    onApply(rules);
  };

  const handleSave = () => {
    if (newFilterName && rules.length > 0) {
      setSavedFilters([...savedFilters, { id: Date.now().toString(), name: newFilterName, rules }]);
      setNewFilterName('');
      setShowSave(false);
    }
  };

  const loadFilter = (sf: SavedFilter) => {
    setRules(sf.rules);
    onApply(sf.rules);
  };

  if (!t) return null; 

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg mb-6 animate-in fade-in slide-in-from-top-2">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-slate-800 font-bold">
            <div className="p-2 bg-sky-50 rounded-lg text-[#003d5b]">
                <FilterIcon className="w-5 h-5" />
            </div>
            <h3>{t.title}</h3>
        </div>
        
        {savedFilters.length > 0 && (
            <div className="flex gap-2 items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">{t.savedFilters}</span>
                {savedFilters.map(sf => (
                    <button 
                        key={sf.id}
                        onClick={() => loadFilter(sf)}
                        className="text-xs bg-slate-100 hover:bg-[#003d5b] hover:text-white text-slate-600 px-3 py-1.5 rounded-lg font-bold transition-all border border-slate-200 hover:border-transparent"
                    >
                        {sf.name}
                    </button>
                ))}
            </div>
        )}
      </div>

      {/* RULES LIST */}
      <div className="space-y-3">
        {rules.map((rule, idx) => (
          <div key={rule.id} className="flex items-center gap-3 group">
            <span className="text-xs font-bold text-slate-400 w-12 text-right uppercase tracking-wider">{idx === 0 ? 'Where' : 'And'}</span>
            
            <div className="flex-1 grid grid-cols-12 gap-3">
                <div className="col-span-3">
                    <select 
                      value={rule.field}
                      onChange={(e) => updateRule(rule.id, 'field', e.target.value)}
                      className={`${STYLES.inputBase} ${STYLES.inputFocus} appearance-none cursor-pointer`}
                    >
                      {fields.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                </div>

                <div className="col-span-3">
                    <select 
                      value={rule.operator}
                      onChange={(e) => updateRule(rule.id, 'operator', e.target.value as any)}
                      className={`${STYLES.inputBase} ${STYLES.inputFocus} appearance-none cursor-pointer`}
                    >
                      <option value="contains">{t.operators.contains}</option>
                      <option value="equals">{t.operators.equals}</option>
                      <option value="startsWith">{t.operators.startsWith}</option>
                      <option value="gt">{t.operators.gt}</option>
                      <option value="lt">{t.operators.lt}</option>
                    </select>
                </div>

                <div className="col-span-6">
                    <input 
                      type="text"
                      value={rule.value}
                      onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                      className={`${STYLES.inputBase} ${STYLES.inputFocus}`}
                      placeholder="Value..."
                    />
                </div>
            </div>

            <button onClick={() => removeRule(rule.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
        {rules.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl">
                <p className="text-slate-400 text-sm mb-2">No filters applied.</p>
                <button onClick={addRule} className="text-[#003d5b] font-bold text-sm hover:underline">Add a new rule</button>
            </div>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
        <button onClick={addRule} className="flex items-center gap-2 text-sm font-bold text-[#003d5b] hover:text-sky-700 px-3 py-2 rounded-lg hover:bg-sky-50 transition-colors">
          <PlusIcon className="w-4 h-4" /> {t.addFilter}
        </button>

        <div className="flex gap-3 items-center">
           {rules.length > 0 && (
               <>
                 {showSave ? (
                     <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 bg-slate-50 p-1 rounded-xl border border-slate-200">
                         <input 
                            type="text" 
                            className="bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs outline-none focus:ring-2 focus:ring-[#003d5b]/20" 
                            placeholder={t.namePlaceholder}
                            value={newFilterName}
                            onChange={(e) => setNewFilterName(e.target.value)}
                            autoFocus
                         />
                         <button onClick={handleSave} className="text-xs bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-600 shadow-sm">Save</button>
                         <button onClick={() => setShowSave(false)} className="text-xs text-slate-500 hover:text-slate-700 px-2">Cancel</button>
                     </div>
                 ) : (
                     <button onClick={() => setShowSave(true)} className={STYLES.buttonSecondary}>
                        <div className="flex items-center gap-2"><SaveIcon className="w-4 h-4" /> {t.saveFilter}</div>
                     </button>
                 )}
                 
                 <button onClick={handleApply} className={STYLES.buttonPrimary}>
                    {t.apply}
                 </button>
               </>
           )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilter;
