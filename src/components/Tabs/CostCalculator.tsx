
import React, { useState, useEffect, useMemo } from 'react';
import { Product, Language, CostVariables } from '../../types';
import { translations } from '../../translations';

// --- ICONS ---
const CalculatorIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>);
const ScaleIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>);
const TrendingIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>);
const AlertIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const TrashIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const PlusIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>);

const STYLES = {
  // Removed spinners via CSS class [appearance:textfield]...
  inputTable: "w-full p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 outline-none transition-all duration-200 focus:bg-white dark:focus:bg-slate-900 focus:border-[#003d5b] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#003d5b]/20 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
  inputName: "w-full p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 outline-none transition-all duration-200 focus:bg-white dark:focus:bg-slate-900 focus:border-[#003d5b] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#003d5b]/20",
  inputCard: "w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 outline-none transition-all duration-200 focus:bg-white dark:focus:bg-slate-900 focus:border-[#003d5b] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#003d5b]/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
  label: "block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5"
};

// --- CONSTANTS ---
const DEFAULT_COMPONENTS = [
    "Materials",
    "Labor",
    "Packaging",
    "Custom Design",
    "Logistics",
    "Inspection",
    "Production",
    "Export Processing (China)",
    "Export Fee (International)"
];

const LOGISTICS_KEYS = ['freight', 'duty', 'insurance', 'other'];

// Explicit list of legacy/unwanted keys to purge from the UI
const EXCLUDED_KEYS = ['exportinternal', 'exportexternal', 'design', 'shipping', 'export_internal', 'export_external'];

interface CostLine {
    id: string;
    name: string;
    value: number;
}

interface Props {
  product: Product;
  lang: Language;
  onSave: (product: Product) => void;
  isReadOnly?: boolean;
}

const CostCalculator: React.FC<Props> = ({ product, lang, onSave, isReadOnly }) => {
  const t = translations[lang].costing;
  const common = translations[lang].common;

  // State
  const [isEditingCosts, setIsEditingCosts] = useState(false);
  const [isEditingLogistics, setIsEditingLogistics] = useState(false);
  
  const [costLines, setCostLines] = useState<CostLine[]>([]);
  const [logisticsCosts, setLogisticsCosts] = useState<Record<string, number>>({});
  const [dims, setDims] = useState(product.dimensions || { weightKg: 0, lengthCm: 0, widthCm: 0, heightCm: 0 });
  const [targetRetail, setTargetRetail] = useState<number>(100); 
  const [dutyRate, setDutyRate] = useState<number>(0); 

  // --- INITIALIZATION LOGIC ---
  useEffect(() => {
    const rawCosts = (product.costVariables as unknown as Record<string, number>) || {};
    
    const loadedLines: CostLine[] = [];
    const fixed: Record<string, number> = {};
    const foundKeys = new Set<string>();

    // 1. Load existing saved data (Filtering out unwanted keys)
    Object.entries(rawCosts).forEach(([key, value]) => {
        if (LOGISTICS_KEYS.includes(key)) {
            fixed[key] = value;
        } else {
            // Check against blacklist (case-insensitive)
            if (EXCLUDED_KEYS.includes(key.toLowerCase())) return;

            // Try to match the key back to a nice Default Name if possible
            const match = DEFAULT_COMPONENTS.find(d => d.toLowerCase().replace(/[^a-z0-9]/g, '_') === key);
            
            // If match found use proper casing, otherwise prettify the key
            const displayName = match || key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            
            loadedLines.push({ id: key, name: displayName, value: Number(value) || 0 });
            foundKeys.add(key);
        }
    });

    // 2. Merge in missing default components
    // This ensures your required list shows up even if data hasn't been saved for them yet
    DEFAULT_COMPONENTS.forEach(name => {
        const key = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        if (!foundKeys.has(key)) {
            loadedLines.push({ 
                id: key, 
                name: name, 
                value: 0 
            });
        }
    });

    // Sort to ensure Default Components appear first in the standard order
    loadedLines.sort((a, b) => {
        const indexA = DEFAULT_COMPONENTS.indexOf(a.name);
        const indexB = DEFAULT_COMPONENTS.indexOf(b.name);
        
        // If both are defaults, sort by default order
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        // If only A is default, it comes first
        if (indexA !== -1) return -1;
        // If only B is default, it comes first
        if (indexB !== -1) return 1;
        // Otherwise keep original order (or alphabetical)
        return 0;
    });
    
    setCostLines(loadedLines);
    setLogisticsCosts(fixed);
    setDims(product.dimensions || { weightKg: 0, lengthCm: 0, widthCm: 0, heightCm: 0 });
  }, [product]);

  // --- CALCULATIONS ENGINE ---
  const volumetricWeight = useMemo(() => (dims.lengthCm * dims.widthCm * dims.heightCm) / 5000, [dims]);
  const chargeableWeight = useMemo(() => Math.max(dims.weightKg, volumetricWeight), [dims.weightKg, volumetricWeight]);
  
  const subtotalFOB = useMemo(() => costLines.reduce((acc, line) => acc + (line.value || 0), 0), [costLines]);
  const calculatedDuty = useMemo(() => subtotalFOB * (dutyRate / 100), [subtotalFOB, dutyRate]);
  
  const totalLandedCost = useMemo(() => {
      const logisticsSum = (logisticsCosts.freight || 0) + calculatedDuty + (logisticsCosts.insurance || 0) + (logisticsCosts.other || 0);
      return subtotalFOB + logisticsSum;
  }, [subtotalFOB, logisticsCosts, calculatedDuty]);
  
  const margin = useMemo(() => targetRetail === 0 ? 0 : ((targetRetail - totalLandedCost) / targetRetail) * 100, [targetRetail, totalLandedCost]);
  const profit = useMemo(() => targetRetail - totalLandedCost, [targetRetail, totalLandedCost]);

  // --- HANDLERS ---
  const saveCosts = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    // Reconstruct the flat object
    const combinedCosts: any = { ...logisticsCosts, duty: calculatedDuty };
    costLines.forEach(line => {
        // Generate safe key (lowercase, underscores) for DB
        const safeKey = line.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        combinedCosts[safeKey] = line.value;
    });

    onSave({ ...product, costVariables: combinedCosts, dimensions: dims });
    setIsEditingCosts(false);
  };

  const saveLogistics = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onSave({ ...product, dimensions: dims });
    setIsEditingLogistics(false);
  };

  const addCostLine = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCostLines([...costLines, { id: `new_${Date.now()}`, name: '', value: 0 }]);
  };

  const removeCostLine = (index: number, e: React.MouseEvent) => {
      e.stopPropagation();
      const newLines = [...costLines];
      newLines.splice(index, 1);
      setCostLines(newLines);
  };

  const updateCostLine = (index: number, field: keyof CostLine, val: any) => {
      const newLines = [...costLines];
      newLines[index] = { ...newLines[index], [field]: val };
      setCostLines(newLines);
  };

  const getCardClassName = (isEditing: boolean) => 
    `bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden transition-all duration-200 ${
      !isEditing && !isReadOnly ? 'cursor-pointer hover:border-sky-400 dark:hover:border-blue-500 hover:shadow-md group' : ''
    }`;

  const EditControls = ({ onCancel, onSave }: { onCancel: () => void, onSave: (e: any) => void }) => (
    <div className="absolute top-4 right-4 flex gap-2 z-20">
        <button onClick={(e) => { e.stopPropagation(); onCancel(); }} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">{common.cancel}</button>
        <button onClick={onSave} className="px-3 py-1.5 bg-[#003d5b] dark:bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-sky-900 dark:hover:bg-blue-500 shadow-lg transition-all">{common.save}</button>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER */}
      <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <CalculatorIcon className="w-6 h-6 text-[#003d5b] dark:text-blue-400" />
              Smart Costing Engine
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Landed Cost Estimation & Margin Analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMN 1: DYNAMIC COST BREAKDOWN */}
          <div 
            id="cost-card" 
            className={`${getCardClassName(isEditingCosts)} lg:col-span-2`} 
            onClick={() => !isEditingCosts && !isReadOnly && setIsEditingCosts(true)}
          >
              {!isEditingCosts && !isReadOnly && (
                 <div className="absolute top-4 right-4 text-[10px] font-bold text-sky-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider pointer-events-none">{common.clickToEdit}</div>
              )}
              {isEditingCosts && <EditControls onCancel={() => { setIsEditingCosts(false); }} onSave={saveCosts} />}

              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">Cost Structure (Per Unit)</h4>
              
              <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                      <thead className="text-[10px] text-slate-400 uppercase font-bold bg-slate-50 dark:bg-slate-950/50">
                          <tr>
                              <th className="p-3 text-left rounded-l-lg">Component</th>
                              <th className="p-3 text-right">Value (USD)</th>
                              <th className="p-3 text-right rounded-r-lg w-24">% of Total</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          
                          {/* DYNAMIC FOB COMPONENTS */}
                          {costLines.map((line, index) => (
                              <tr key={index} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                  <td className="p-3 pl-4 border-l-2 border-transparent group-hover:border-blue-500">
                                      {isEditingCosts ? (
                                          <div className="flex items-center gap-2">
                                              <button 
                                                onClick={(e) => removeCostLine(index, e)} 
                                                className="text-slate-400 hover:text-red-500 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                title="Remove Component"
                                              >
                                                  <TrashIcon className="w-3.5 h-3.5" />
                                              </button>
                                              <input 
                                                className={STYLES.inputName} 
                                                value={line.name} 
                                                placeholder="Component Name"
                                                onClick={(e) => e.stopPropagation()} 
                                                onChange={(e) => updateCostLine(index, 'name', e.target.value)} 
                                              />
                                          </div>
                                      ) : (
                                          <span className="font-medium text-slate-600 dark:text-slate-300 capitalize">{line.name}</span>
                                      )}
                                  </td>
                                  <td className="p-3 text-right">
                                      {isEditingCosts ? (
                                          <input 
                                            type="number" 
                                            className={STYLES.inputTable} 
                                            value={line.value || ''} 
                                            onClick={(e) => e.stopPropagation()} 
                                            onChange={(e) => updateCostLine(index, 'value', parseFloat(e.target.value) || 0)} 
                                          />
                                      ) : (
                                          <span className="font-mono">${(line.value || 0).toFixed(2)}</span>
                                      )}
                                  </td>
                                  <td className="p-3 text-right text-xs text-slate-400">
                                      {totalLandedCost > 0 ? `${(((line.value || 0) / totalLandedCost) * 100).toFixed(1)}%` : '-'}
                                  </td>
                              </tr>
                          ))}

                          {/* ADD BUTTON ROW */}
                          {isEditingCosts && (
                              <tr>
                                  <td colSpan={3} className="p-2 text-center">
                                      <button onClick={addCostLine} className="px-3 py-1.5 border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 mx-auto">
                                          <PlusIcon className="w-3.5 h-3.5" /> Add Cost Component
                                      </button>
                                  </td>
                              </tr>
                          )}
                          
                          {/* SUBTOTAL ROW */}
                          <tr className="bg-slate-50/50 dark:bg-slate-800/20 font-bold">
                              <td className="p-3 text-slate-800 dark:text-white">FOB Subtotal (Factory)</td>
                              <td className="p-3 text-right text-slate-800 dark:text-white font-mono">${subtotalFOB.toFixed(2)}</td>
                              <td className="p-3"></td>
                          </tr>

                          {/* FREIGHT */}
                          <tr>
                              <td className="p-3 font-medium text-slate-600 dark:text-slate-300 pl-4">Freight (Shipping)</td>
                              <td className="p-3 text-right">
                                  {isEditingCosts ? 
                                    <input type="number" className={STYLES.inputTable} value={logisticsCosts.freight || 0} onClick={(e) => e.stopPropagation()} onChange={e => setLogisticsCosts({...logisticsCosts, freight: parseFloat(e.target.value) || 0})} /> 
                                    : <span className="font-mono">${(logisticsCosts.freight || 0).toFixed(2)}</span>
                                  }
                              </td>
                              <td className="p-3 text-right text-xs text-slate-400">{totalLandedCost > 0 ? `${(((logisticsCosts.freight || 0) / totalLandedCost) * 100).toFixed(1)}%` : '-'}</td>
                          </tr>
                          
                          {/* DUTY */}
                          <tr>
                              <td className="p-3 font-medium text-slate-600 dark:text-slate-300 pl-4 flex items-center gap-2">
                                  Import Duty 
                                  {isEditingCosts && (
                                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded px-1" onClick={(e) => e.stopPropagation()}>
                                          <span className="text-[10px] text-slate-400">Rate:</span>
                                          <input type="number" className="w-10 p-0.5 text-center bg-transparent border-none text-xs outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" value={dutyRate} onChange={e => setDutyRate(parseFloat(e.target.value) || 0)} />
                                          <span className="text-xs">%</span>
                                      </div>
                                  )}
                                  {!isEditingCosts && dutyRate > 0 && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">{dutyRate}%</span>}
                              </td>
                              <td className="p-3 text-right">
                                  <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">${calculatedDuty.toFixed(2)}</span>
                              </td>
                              <td className="p-3 text-right text-xs text-slate-400">{totalLandedCost > 0 ? `${((calculatedDuty / totalLandedCost) * 100).toFixed(1)}%` : '-'}</td>
                          </tr>

                          {/* TOTAL */}
                          <tr className="bg-[#003d5b]/5 dark:bg-blue-900/20 border-t-2 border-[#003d5b] dark:border-blue-500">
                              <td className="p-4 text-base font-black text-[#003d5b] dark:text-blue-400 uppercase tracking-wide">Total Landed Cost</td>
                              <td className="p-4 text-right text-xl font-black text-[#003d5b] dark:text-blue-400 font-mono">${totalLandedCost.toFixed(2)}</td>
                              <td className="p-4 text-right text-xs font-bold text-[#003d5b] dark:text-blue-400">100%</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>

          {/* COLUMN 2: LOGISTICS & MARGIN */}
          <div className="flex flex-col gap-6">
              
              {/* LOGISTICS CARD (CLICK TO EDIT) */}
              <div 
                id="logistics-card"
                className={getCardClassName(isEditingLogistics)} 
                onClick={() => !isEditingLogistics && !isReadOnly && setIsEditingLogistics(true)}
              >
                  {!isEditingLogistics && !isReadOnly && (
                     <div className="absolute top-4 right-4 text-[10px] font-bold text-sky-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider pointer-events-none">{common.clickToEdit}</div>
                  )}
                  {isEditingLogistics && <EditControls onCancel={() => { setIsEditingLogistics(false); setDims(product.dimensions); }} onSave={saveLogistics} />}

                  <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                      <ScaleIcon className="w-4 h-4" /> Logistics Metrics
                  </h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                          <label className={STYLES.label}>Dimensions (cm)</label>
                          {isEditingLogistics ? (
                              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                  <input type="number" className={STYLES.inputCard} placeholder="L" value={dims.lengthCm} onChange={e => setDims({...dims, lengthCm: parseFloat(e.target.value)})} />
                                  <input type="number" className={STYLES.inputCard} placeholder="W" value={dims.widthCm} onChange={e => setDims({...dims, widthCm: parseFloat(e.target.value)})} />
                                  <input type="number" className={STYLES.inputCard} placeholder="H" value={dims.heightCm} onChange={e => setDims({...dims, heightCm: parseFloat(e.target.value)})} />
                              </div>
                          ) : (
                              <div className="text-sm font-mono text-slate-700 dark:text-slate-300">{dims.lengthCm} x {dims.widthCm} x {dims.heightCm}</div>
                          )}
                      </div>
                      <div>
                          <label className={STYLES.label}>Weight (kg)</label>
                          {isEditingLogistics ? (
                              <input type="number" className={STYLES.inputCard} value={dims.weightKg} onClick={(e) => e.stopPropagation()} onChange={e => setDims({...dims, weightKg: parseFloat(e.target.value)})} />
                          ) : (
                              <div className="text-sm font-mono text-slate-700 dark:text-slate-300">{dims.weightKg} kg</div>
                          )}
                      </div>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-slate-500">Volumetric Wgt:</span>
                          <span className="text-xs font-mono">{volumetricWeight.toFixed(2)} kg</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-1 mt-1">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Chargeable Wgt:</span>
                          <span className={`text-sm font-mono font-bold ${chargeableWeight > dims.weightKg ? 'text-red-500' : 'text-emerald-500'}`}>
                              {chargeableWeight.toFixed(2)} kg
                          </span>
                      </div>
                      {chargeableWeight > dims.weightKg && (
                          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                              <AlertIcon className="w-3 h-3" /> Paying for Volume, not Weight
                          </div>
                      )}
                  </div>
              </div>

              {/* MARGIN SIMULATOR (Always Editable) */}
              <div className="bg-[#003d5b] dark:bg-slate-800 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                      <TrendingIcon className="w-24 h-24" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-4 relative z-10">Profit Simulator</h4>
                  
                  <div className="space-y-4 relative z-10">
                      <div>
                          <label className="block text-[10px] font-bold text-sky-200 uppercase mb-1">Target Retail Price</label>
                          <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-900 dark:text-white font-bold">$</span>
                              <input 
                                type="number" 
                                className="w-full p-2 pl-6 bg-white/10 border border-white/20 rounded-xl text-white font-bold outline-none focus:bg-white/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                value={targetRetail}
                                onChange={e => setTargetRetail(parseFloat(e.target.value) || 0)}
                              />
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                              <p className="text-[10px] text-sky-200 uppercase">Margin</p>
                              <p className={`text-xl font-black ${margin < 30 ? 'text-red-300' : 'text-emerald-300'}`}>{margin.toFixed(1)}%</p>
                          </div>
                          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                              <p className="text-[10px] text-sky-200 uppercase">Net Profit</p>
                              <p className="text-xl font-black">${profit.toFixed(2)}</p>
                          </div>
                      </div>
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
};

export default CostCalculator;