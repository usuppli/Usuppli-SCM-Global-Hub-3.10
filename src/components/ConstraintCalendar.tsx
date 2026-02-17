
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Shipment, Language, Customer, Job, SampleRequest, Supplier, Product } from '../types';
import { translations } from '../translations';
import { 
  X, Calendar, ChevronLeft, ChevronRight, AlertTriangle, 
  MapPin, Info, Minus, Maximize2, PanelRight, Ship, Package, Plus, Save,
  Link, User, Factory, FileText, Truck, TestTube, Calculator, Clock, ArrowRight,
  Box, Hash, CheckCircle2, CalendarPlus, Trash2
} from 'lucide-react';

// --- TYPES & INTERFACES ---
export interface ConstraintEvent {
  id: string;
  title: string;
  description: string;
  start: string; 
  end: string;   
  type: 'factory_shutdown' | 'port_delay' | 'holiday' | 'weather' | 'shipping_opportunity' | 'customer_event' | 'logistics_plan';
  severity: 'low' | 'medium' | 'high' | 'opportunity' | 'plan'; 
  region?: string;
  impactedArea?: string;
  linkedEntityType?: 'Customer' | 'Job' | 'Shipment' | 'Sample' | 'Supplier' | 'Order' | 'Product';
  linkedEntityId?: string;
  linkedEntityName?: string;
}

interface LeadTimeBreakdown {
  production: number;
  qualityCheck: number;
  shipping: number;
  customs: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  customers?: Customer[];
  jobs?: Job[];
  shipments?: Shipment[];
  samples?: SampleRequest[];
  suppliers?: Supplier[];
  products?: Product[];
  orders?: any[]; 
}

const MOCK_EVENTS: ConstraintEvent[] = [
  { id: 'e1', title: 'LA Port Congestion', description: 'Moderate Delay Risk - Shipping', start: '2026-02-01', end: '2026-02-05', type: 'port_delay', severity: 'medium', region: 'North America', linkedEntityType: 'Shipment', linkedEntityName: 'SH-9921' },
  { id: 'e2', title: 'CNY Factory Shutdown', description: 'All production halted', start: '2026-02-10', end: '2026-02-24', type: 'factory_shutdown', severity: 'high', region: 'Asia' },
];

const SEVERITY_STYLES = {
  low: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800', dot: 'bg-blue-500' },
  medium: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800', dot: 'bg-amber-500' },
  high: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-800', dot: 'bg-red-500' },
  opportunity: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-500' },
  plan: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800', dot: 'bg-indigo-500' } 
};

export default function ConstraintCalendar({ 
  isOpen, onClose, lang,
  customers = [], jobs = [], shipments = [], samples = [], suppliers = [], products = []
}: Props) {
  // CRASH PROTECTION: Safe access to translations
  const rootT = translations[lang] || translations['en'];
  const t = rootT.calendar;
  const commonT = rootT.common;

  // Helper for dynamic translation keys
  const getTranslatedType = (typeKey: string) => {
    // Maps 'Job' -> t.typeJob, 'Sample' -> t.typeSample, etc.
    const key = `type${typeKey}` as keyof typeof t;
    return t[key] || typeKey;
  };

  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1));
  const [events, setEvents] = useState<ConstraintEvent[]>(MOCK_EVENTS);
  const [hoveredEvent, setHoveredEvent] = useState<ConstraintEvent | null>(null);
  
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  // --- CALCULATOR STATE (Restored) ---
  const [calcStartDate, setCalcStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [calcType, setCalcType] = useState<'Job' | 'Sample' | 'Product'>('Job');
  const [calcSelectedId, setCalcSelectedId] = useState('');
  const [calcQuantity, setCalcQuantity] = useState(1000);
  const [calcDestination, setCalcDestination] = useState('Los Angeles, CA');
  const [leadTimeData, setLeadTimeData] = useState<LeadTimeBreakdown>({
    production: 30,
    qualityCheck: 5,
    shipping: 25,
    customs: 3
  });

  const [newEvent, setNewEvent] = useState<Partial<ConstraintEvent>>({
    type: 'factory_shutdown',
    severity: 'medium',
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
    linkedEntityType: undefined
  });

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => dateStr >= e.start && dateStr <= e.end);
  };

  const days = useMemo(() => {
    const d = [];
    for (let i = 0; i < firstDayOfMonth; i++) d.push(null);
    for (let i = 1; i <= daysInMonth; i++) d.push(i);
    return d;
  }, [daysInMonth, firstDayOfMonth]);

  // --- CALCULATOR EFFECTS (Restored) ---
  useEffect(() => {
    const baseProduction = 20;
    const qtyFactor = Math.ceil(calcQuantity / 500) * 2;
    setLeadTimeData(prev => ({ ...prev, production: baseProduction + qtyFactor }));
  }, [calcQuantity]);

  const calculateETA = () => {
    const totalDays = (Number(leadTimeData.production) || 0) + (Number(leadTimeData.qualityCheck) || 0) + (Number(leadTimeData.shipping) || 0) + (Number(leadTimeData.customs) || 0);
    const start = new Date(calcStartDate);
    const eta = new Date(start);
    eta.setDate(start.getDate() + totalDays);
    return { totalDays, eta };
  };

  const calcResults = calculateETA();
  // Localized Date String Logic
  const localizedETA = calcResults.eta.toLocaleDateString(lang === 'en' ? 'en-US' : (lang === 'zh-Hans' ? 'zh-CN' : 'zh-TW'), { 
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' 
  });

  const handleSaveCalculationToCalendar = () => {
    let entityName = '';
    if (calcSelectedId) {
        if (calcType === 'Job') entityName = jobs.find(j => j.id === calcSelectedId)?.poNumber || '';
        else if (calcType === 'Sample') entityName = samples.find(s => s.id === calcSelectedId)?.id || '';
        else if (calcType === 'Product') entityName = products.find(p => p.id === calcSelectedId)?.name || '';
    } else { entityName = 'Unspecified Item'; }

    const calcEvent: ConstraintEvent = {
        id: `plan-${Date.now()}`,
        title: `Logistics Plan: ${entityName}`,
        description: `Planned shipment of ${calcQuantity} units to ${calcDestination}.`,
        start: calcStartDate,
        end: calcResults.eta.toISOString().split('T')[0],
        type: 'logistics_plan',
        severity: 'plan', 
        region: calcDestination,
        linkedEntityType: calcType,
        linkedEntityId: calcSelectedId,
        linkedEntityName: entityName
    };
    setEvents([...events, calcEvent]);
    setShowCalculator(false);
    setCurrentDate(new Date(calcStartDate)); // Jump to start date
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) return;
    let entityName = '';
    if (newEvent.linkedEntityType && newEvent.linkedEntityId) {
       if (newEvent.linkedEntityType === 'Customer') entityName = customers.find(c => c.id === newEvent.linkedEntityId)?.companyName || '';
       else if (newEvent.linkedEntityType === 'Job') entityName = jobs.find(j => j.id === newEvent.linkedEntityId)?.poNumber || '';
       else if (newEvent.linkedEntityType === 'Shipment') entityName = shipments.find(s => s.id === newEvent.linkedEntityId)?.trackingNumber || '';
       else if (newEvent.linkedEntityType === 'Supplier') entityName = suppliers.find(s => s.id === newEvent.linkedEntityId)?.name || '';
       else entityName = newEvent.linkedEntityId;
    }

    const eventToAdd: ConstraintEvent = {
        id: `e-${Date.now()}`,
        title: newEvent.title,
        description: newEvent.description || 'Manual Entry',
        start: newEvent.start,
        end: newEvent.end,
        type: newEvent.type as any,
        severity: newEvent.severity as any,
        region: newEvent.region || 'Global',
        linkedEntityType: newEvent.linkedEntityType,
        linkedEntityId: newEvent.linkedEntityId,
        linkedEntityName: entityName
    };
    setEvents([...events, eventToAdd]);
    setShowAddModal(false);
    setNewEvent({ type: 'factory_shutdown', severity: 'medium', start: new Date().toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] });
  };

  const getEntityIcon = (type?: string) => {
    switch(type) {
      case 'Customer': return <User className="w-3 h-3" />;
      case 'Job': return <Package className="w-3 h-3" />;
      case 'Shipment': return <Truck className="w-3 h-3" />;
      case 'Sample': return <TestTube className="w-3 h-3" />;
      case 'Supplier': return <Factory className="w-3 h-3" />;
      case 'Product': return <Box className="w-3 h-3" />;
      default: return <Info className="w-3 h-3" />;
    }
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-24 z-[200] animate-in slide-in-from-bottom-10 fade-in duration-300">
        <button onClick={() => setIsMinimized(false)} className="bg-[#003d5b] hover:bg-[#002a40] text-white p-4 rounded-full shadow-2xl flex items-center gap-3 border border-white/20 transition-transform hover:scale-105 active:scale-95">
          <div className="relative"><Calendar className="w-6 h-6" /><span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#003d5b]"></span></div>
          <span className="font-bold pr-2">{t?.title || "Constraint Calendar"}</span><Maximize2 className="w-4 h-4 opacity-70" />
        </button>
      </div>
    );
  }

  const containerClasses = isDocked ? "fixed right-0 top-0 h-full w-[500px] z-[100] shadow-2xl animate-in slide-in-from-right duration-300" : "fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200";
  const windowClasses = isDocked ? "bg-white dark:bg-slate-900 w-full h-full border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden" : "bg-white dark:bg-slate-900 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200";

  return (
    <div className={containerClasses}>
      <div className={windowClasses}>
        
        {/* HEADER */}
        <div className="bg-[#003d5b] p-3 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg"><Calendar className="w-5 h-5" /></div>
            <div>
              <h3 className="text-lg font-bold leading-none">{t?.title || "Constraint Calendar"}</h3>
              <p className="text-white/60 text-xs mt-0.5">Global Production & Logistics Constraints</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={() => setShowCalculator(!showCalculator)} className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${showCalculator ? 'bg-white/20' : ''}`} title="Calculator">
                <Calculator className="w-5 h-5" />
             </button>
             <button onClick={() => setShowAddModal(true)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 border border-white/10 mr-2">
                <Plus className="w-3 h-3" /> {t?.addEvent || "Add Event"}
             </button>
             <button onClick={() => setIsDocked(!isDocked)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><PanelRight className="w-5 h-5" /></button>
             <button onClick={() => setIsMinimized(true)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Minus className="w-5 h-5" /></button>
             <button onClick={onClose} className="p-2 hover:bg-red-500/80 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>

        {/* CALENDAR BODY */}
        <div className="flex h-full overflow-hidden bg-slate-50 dark:bg-slate-950/50 relative">
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all"><ChevronLeft className="w-5 h-5" /></button>
                    <span className="px-4 font-bold text-slate-700 dark:text-white min-w-[140px] text-center">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all"><ChevronRight className="w-5 h-5" /></button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-700 border rounded-2xl overflow-hidden shadow-sm">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="bg-slate-50 dark:bg-slate-800 p-2 text-center text-xs font-bold uppercase text-slate-400">{day}</div>
                ))}
                
                {days.map((day, index) => {
                    if (!day) return <div key={`empty-${index}`} className="bg-white dark:bg-slate-900 min-h-[100px]" />;
                    const dayEvents = getEventsForDay(day);
                    const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
                    return (
                    <div key={day} className={`bg-white dark:bg-slate-900 min-h-[100px] p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 relative ${isToday ? 'bg-blue-50/30' : ''}`}>
                        <span className={`text-sm font-bold ${isToday ? 'text-blue-600 bg-blue-100 w-7 h-7 flex items-center justify-center rounded-full' : 'text-slate-700 dark:text-slate-300'}`}>{day}</span>
                        <div className="mt-2 space-y-1">
                        {dayEvents.map((event) => (
                            <div key={event.id} onMouseEnter={() => setHoveredEvent(event)} onMouseLeave={() => setHoveredEvent(null)} className={`text-[10px] px-1.5 py-1 rounded border-l-2 truncate cursor-help flex items-center gap-1 shadow-sm ${SEVERITY_STYLES[event.severity].bg} ${SEVERITY_STYLES[event.severity].text} ${SEVERITY_STYLES[event.severity].border}`}>
                            {event.linkedEntityType && <span className="opacity-70">{getEntityIcon(event.linkedEntityType)}</span>}
                            <span className="truncate">{event.title}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                    );
                })}
                </div>
            </div>
          </div>

          {/* CALCULATOR PANEL (Full Logic Restored) */}
          {showCalculator && (
             <div className="w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-300 shadow-xl z-20">
                <div className="p-4 border-b dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0">
                    <h3 className="font-bold text-sm flex items-center gap-2 text-slate-800 dark:text-slate-100">
                      <Calculator className="w-4 h-4 text-blue-600" /> {t?.calculator || "Lead Time Calculator"}
                    </h3>
                    <button onClick={() => setShowCalculator(false)} className="text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                </div>
                
                <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                    {/* SECTION 1: CONTEXT */}
                    <div className="space-y-3 pb-4 border-b border-slate-50 dark:border-slate-800">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t?.calculationFor || "Calculation For"}</label>
                            <div className="flex gap-2">
                                {['Job', 'Sample', 'Product'].map((typeOption) => (
                                    <button 
                                        key={typeOption}
                                        onClick={() => setCalcType(typeOption as any)}
                                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${calcType === typeOption ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                    >
                                        {getTranslatedType(typeOption)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t?.selectItem || "Select Item"}</label>
                            <div className="relative">
                                <select 
                                    className="w-full p-2 pl-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm appearance-none dark:text-slate-200"
                                    value={calcSelectedId}
                                    onChange={(e) => setCalcSelectedId(e.target.value)}
                                >
                                    <option value="">{t?.select || "Select"} {getTranslatedType(calcType)}...</option>
                                    {calcType === 'Job' && jobs.map(j => <option key={j.id} value={j.id}>{j.poNumber}</option>)}
                                    {calcType === 'Sample' && samples.map(s => <option key={s.id} value={s.id}>{s.id} - {s.type}</option>)}
                                    {calcType === 'Product' && products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                <div className="absolute left-2.5 top-2.5 text-slate-400">
                                    {calcType === 'Job' ? <Package className="w-4 h-4" /> : calcType === 'Sample' ? <TestTube className="w-4 h-4" /> : <Box className="w-4 h-4" />}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: LOGISTICS */}
                    <div className="space-y-3 pb-4 border-b border-slate-50 dark:border-slate-800">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t?.quantity || "Quantity"}</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        className="w-full p-2 pl-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none dark:text-slate-200"
                                        value={calcQuantity}
                                        onChange={(e) => setCalcQuantity(Number(e.target.value))}
                                    />
                                    <Hash className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" strokeWidth={1.5} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t?.start || "Start Date"}</label>
                                <input type="date" className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-slate-200" 
                                    value={calcStartDate}
                                    onChange={e => setCalcStartDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t?.destination || "Destination"}</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    className="w-full p-2 pl-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-slate-200"
                                    value={calcDestination}
                                    onChange={(e) => setCalcDestination(e.target.value)}
                                    placeholder={t?.enterCity || "Enter city or port..."}
                                />
                                <MapPin className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: BREAKDOWN */}
                    <div className="space-y-3">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t?.breakdown || "Breakdown (Days)"}</label>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2"><Factory className="w-3 h-3" /> {t?.production || "Production"}</span>
                            <input type="number" className="w-16 p-1 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 border rounded text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" value={leadTimeData.production} onChange={e => setLeadTimeData({...leadTimeData, production: Number(e.target.value)})} />
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> {t?.qualityCheck || "Quality Check"}</span>
                            <input type="number" className="w-16 p-1 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 border rounded text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" value={leadTimeData.qualityCheck} onChange={e => setLeadTimeData({...leadTimeData, qualityCheck: Number(e.target.value)})} />
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2"><Ship className="w-3 h-3" /> {t?.shipping || "Shipping"}</span>
                            <input type="number" className="w-16 p-1 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 border rounded text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" value={leadTimeData.shipping} onChange={e => setLeadTimeData({...leadTimeData, shipping: Number(e.target.value)})} />
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2"><FileText className="w-3 h-3" /> {t?.customs || "Customs"}</span>
                            <input type="number" className="w-16 p-1 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 border rounded text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" value={leadTimeData.customs} onChange={e => setLeadTimeData({...leadTimeData, customs: Number(e.target.value)})} />
                        </div>
                    </div>

                    {/* RESULTS & ACTION */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 mt-2 shrink-0">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{t?.totalDays || "Total Days"}</span>
                            <span className="text-xl font-black text-slate-800 dark:text-white">{calcResults.totalDays}</span>
                        </div>
                        <div className="pt-2 border-t border-blue-200 dark:border-blue-800 flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-500">{t?.eta || "Est. Arrival (ETA)"}</span>
                            <span className="text-sm font-bold text-blue-700 dark:text-blue-300">{localizedETA}</span>
                        </div>
                        <button onClick={handleSaveCalculationToCalendar} className="w-full mt-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-95">
                            <CalendarPlus className="w-4 h-4" strokeWidth={2} /> {t?.addPlan || "Add Plan to Calendar"}
                        </button>
                    </div>
                </div>
             </div>
          )}

        </div>

        {/* ADD EVENT MODAL (RESTORED FULL VERSION) */}
        {showAddModal && (
            <div className="absolute inset-0 z-[160] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-3">
                        <h3 className="font-bold text-lg dark:text-white">{t?.addEvent || "Add Constraint / Event"}</h3>
                        <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Event Title</label>
                        <input className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-sm dark:text-slate-200" placeholder="e.g. Typhoon Warning" value={newEvent.title || ''} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t?.start || "Start Date"}</label>
                            <input type="date" className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-sm dark:text-slate-200" value={newEvent.start} onChange={e => setNewEvent({...newEvent, start: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t?.end || "End Date"}</label>
                            <input type="date" className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-sm dark:text-slate-200" value={newEvent.end} onChange={e => setNewEvent({...newEvent, end: e.target.value})} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                            <select className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-sm dark:text-slate-200" value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value as any})}>
                                <option value="factory_shutdown">Factory Shutdown</option>
                                <option value="port_delay">Port Delay</option>
                                <option value="holiday">Holiday</option>
                                <option value="weather">Weather</option>
                                <option value="shipping_opportunity">Opportunity</option>
                                <option value="customer_event">Customer Event</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Severity</label>
                            <select className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-sm dark:text-slate-200" value={newEvent.severity} onChange={e => setNewEvent({...newEvent, severity: e.target.value as any})}>
                                <option value="low">Low (Blue)</option>
                                <option value="medium">Medium (Amber)</option>
                                <option value="high">High (Red)</option>
                                <option value="opportunity">Opportunity (Green)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-2 text-blue-600"><Link className="w-4 h-4" /><span className="text-xs font-bold uppercase">Link to Record (Optional)</span></div>
                        <div className="grid grid-cols-2 gap-4">
                            <select className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-sm dark:text-slate-200" value={newEvent.linkedEntityType || ''} onChange={e => setNewEvent({...newEvent, linkedEntityType: e.target.value as any, linkedEntityId: ''})}>
                                <option value="">-- No Link --</option><option value="Customer">Customer</option><option value="Job">Production Job</option><option value="Shipment">Shipment</option><option value="Sample">Sample Order</option><option value="Supplier">Supplier</option>
                            </select>
                            <select className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-sm dark:text-slate-200" value={newEvent.linkedEntityId || ''} onChange={e => setNewEvent({...newEvent, linkedEntityId: e.target.value})} disabled={!newEvent.linkedEntityType}>
                                <option value="">Select Item...</option>
                                {newEvent.linkedEntityType === 'Customer' && customers.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                                {newEvent.linkedEntityType === 'Job' && jobs.map(j => <option key={j.id} value={j.id}>{j.poNumber}</option>)}
                                {newEvent.linkedEntityType === 'Shipment' && shipments.map(s => <option key={s.id} value={s.id}>{s.trackingNumber}</option>)}
                                {newEvent.linkedEntityType === 'Sample' && samples.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
                                {newEvent.linkedEntityType === 'Supplier' && suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <button onClick={handleAddEvent} className="w-full py-2.5 bg-[#003d5b] text-white rounded-lg font-bold hover:bg-[#002a40] flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"><Save className="w-4 h-4" /> {commonT?.save || "Save Event"}</button>
                </div>
            </div>
        )}

        {/* HOVER TOOLTIP */}
        {hoveredEvent && !showAddModal && (
          <div className="fixed z-[150] bg-white dark:bg-slate-800 p-4 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-64 pointer-events-none animate-in fade-in zoom-in-95" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg border ${SEVERITY_STYLES[hoveredEvent.severity].bg} ${SEVERITY_STYLES[hoveredEvent.severity].border} ${SEVERITY_STYLES[hoveredEvent.severity].text}`}><Info className="w-4 h-4" /></div>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">{hoveredEvent.title}</h5>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">{hoveredEvent.description}</p>
            {hoveredEvent.linkedEntityName && (
                <div className="flex items-center gap-2 mb-3 bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-50 dark:border-slate-700">
                    {getEntityIcon(hoveredEvent.linkedEntityType)}
                    <span className="text-xs font-mono font-bold text-blue-600">{hoveredEvent.linkedEntityName}</span>
                </div>
            )}
            <div className="flex gap-4 border-t border-slate-50 dark:border-slate-800 pt-3">
              <div><span className="text-[8px] font-bold uppercase text-slate-400 dark:text-slate-500 block">Region</span><span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{hoveredEvent.region}</span></div>
              <div><span className="text-[8px] font-bold uppercase text-slate-400 dark:text-slate-500 block">Duration</span><span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{new Date(hoveredEvent.start).getDate()} - {new Date(hoveredEvent.end).getDate()} {monthNames[new Date(hoveredEvent.start).getMonth()].substring(0,3)}</span></div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}