
import React, { useState, useMemo } from 'react';
import { Shipment, Job, Language } from '../../types';
import { translations } from '../../translations';
import GraphicalWorldClock from '../GraphicalWorldClock';
import { Logo } from '../Logo';
import PrintWizard from '../PrintWizard';
import { Printer, Truck, Ship, Plane, AlertTriangle, CheckCircle, Clock, MapPin, ArrowRight, Plus, Filter, Download, Edit } from 'lucide-react';

// --- SAFE ICONS (Legacy Wrappers if needed, or use Lucide directly) ---
// Note: We are using Lucide icons directly in the main return for consistency with your other files.

// ==========================================
// LOCAL STANDARDIZED COMPONENTS
// ==========================================

const LOCAL_STYLES = {
  inputBase: "w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 outline-none transition-all duration-200",
  inputFocus: "focus:bg-white dark:focus:bg-slate-900 focus:border-[#003d5b] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#003d5b]/20",
  label: "block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5",
};

const Input = ({ label, className, ...props }: any) => (
  <div className="w-full">
    {label && <label className={LOCAL_STYLES.label}>{label}</label>}
    <input className={`${LOCAL_STYLES.inputBase} ${LOCAL_STYLES.inputFocus} ${className||''}`} {...props} />
  </div>
);

const Select = ({ label, children, ...props }: any) => (
  <div className="w-full">
    {label && <label className={LOCAL_STYLES.label}>{label}</label>}
    <div className="relative">
      <select className={`${LOCAL_STYLES.inputBase} appearance-none ${LOCAL_STYLES.inputFocus}`} {...props}>
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  </div>
);

const DEMO_SHIPMENTS: Shipment[] = [
  { id: 'SHP-2024-001', trackingNumber: 'MSKU1234567', carrier: 'Maersk', status: 'In Transit', origin: 'Shenzhen, China', destination: 'Los Angeles, USA', eta: '2024-03-15', method: 'Sea', jobId: 'JOB-2024-001', lastUpdated: '2024-02-28' },
  { id: 'SHP-2024-002', trackingNumber: 'DHL7890123', carrier: 'DHL', status: 'Booked', origin: 'Ho Chi Minh, Vietnam', destination: 'Berlin, Germany', eta: '2024-03-10', method: 'Air', lastUpdated: '2024-03-01' },
  { id: 'SHP-2024-003', trackingNumber: 'CMAU4567890', carrier: 'CMA CGM', status: 'Customs', origin: 'Ningbo, China', destination: 'Rotterdam, Netherlands', eta: '2024-03-05', method: 'Sea', jobId: 'JOB-2024-002', lastUpdated: '2024-03-02' },
];

interface Props {
  shipments: Shipment[];
  jobs: Job[];
  onUpdateShipment: (shipment: Shipment) => void;
  onCreateShipment: (shipment: Shipment) => void;
  isReadOnly?: boolean;
  lang: Language;
  onOpenWizard?: () => void;
}

const LogisticsTower: React.FC<Props> = ({ shipments, jobs, onUpdateShipment, onCreateShipment, isReadOnly, lang, onOpenWizard }) => {
  // Safe Translation Access
  const t = (translations[lang] || translations['en'])?.logistics || translations['en'].logistics;
  const commonT = (translations[lang] || translations['en'])?.common || translations['en'].common;

  const userRole = localStorage.getItem('userRole') || 'viewer';
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'eta' | 'carrier' | 'status'>('eta');
  const [simulatedShipments, setSimulatedShipments] = useState<Shipment[]>([]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Partial<Shipment> | null>(null);
  const [printShipmentData, setPrintShipmentData] = useState<Shipment | null>(null);

  const allShipments = useMemo(() => [...shipments, ...simulatedShipments], [shipments, simulatedShipments]);

  const hudStats = useMemo(() => {
    const active = allShipments.filter(s => s.status !== 'Delivered');
    const customsHold = active.filter(s => s.status === 'Customs');
    const airCount = active.filter(s => s.method === 'Air').length;
    const oceanCount = active.filter(s => s.method === 'Sea' || s.method === 'Ocean').length;
    const nextArrival = [...active].sort((a, b) => (a.eta || '9999').localeCompare(b.eta || '9999'))[0] || null;
    return { activeCount: active.length, customsHold: customsHold.length, airCount, oceanCount, nextArrival };
  }, [allShipments]);

  const filtered = useMemo(() => {
    return allShipments.filter(s => 
      (s.trackingNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (s.carrier || '').toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
      if (sortBy === 'eta') return (a.eta || '9999').localeCompare(b.eta || '9999');
      const valA = (a[sortBy] as string) || '';
      const valB = (b[sortBy] as string) || '';
      return valA.localeCompare(valB);
    });
  }, [allShipments, searchTerm, sortBy]);

  const handleEditClick = (shipment: Shipment) => {
    setEditingShipment({ ...shipment });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingShipment && editingShipment.id) {
      if (shipments.find(s => s.id === editingShipment.id)) {
        onUpdateShipment(editingShipment as Shipment);
      } else {
        setSimulatedShipments(prev => prev.map(s => s.id === editingShipment.id ? editingShipment as Shipment : s));
      }
      setShowModal(false);
      setEditingShipment(null);
    }
  };

  const handleExportCSV = () => {
    if (filtered.length === 0) return;
    const headers = "ID,Tracking,Carrier,Status,Origin,Destination,ETA,Method,CurrentLocation";
    const rows = filtered.map(s => 
      `"${s.id}","${s.trackingNumber}","${s.carrier}","${s.status}","${s.origin}","${s.destination}","${s.eta}","${s.method}","${s.currentLocation}"`
    ).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `usuppli-logistics-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Exception': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'Customs': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HUD DASHBOARD */}
      <div className="w-full h-72 bg-slate-900 rounded-3xl relative overflow-hidden shadow-2xl group border border-slate-800">
          <div className="absolute top-6 left-6 z-30">
              <div className="bg-slate-900/50 backdrop-blur-md p-2 rounded-lg border border-white/10">
                  <Logo className="h-8 w-auto text-white" variant="mark" />
              </div>
          </div>
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
              <GraphicalWorldClock theme="dark" isAbsolute={false} className="scale-90" />
          </div>

          <div className="absolute top-1/2 left-6 -translate-y-1/2 z-20">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex gap-6 shadow-lg">
                <div>
                    <p className="text-[10px] font-bold text-sky-300 uppercase tracking-widest mb-1">{t?.inboundAir || 'Air'}</p>
                    <div className="flex items-center gap-2">
                        <Plane className="w-6 h-6 text-sky-400" />
                        <span className="text-2xl font-bold text-white">{hudStats.airCount}</span>
                    </div>
                </div>
                <div className="w-px bg-white/10"></div>
                <div>
                    <p className="text-[10px] font-bold text-sky-300 uppercase tracking-widest mb-1">{t?.inboundOcean || 'Ocean'}</p>
                    <div className="flex items-center gap-2">
                        <Ship className="w-6 h-6 text-sky-400" />
                        <span className="text-2xl font-bold text-white">{hudStats.oceanCount}</span>
                    </div>
                </div>
              </div>
          </div>

          {hudStats.customsHold > 0 && (
            <div className="absolute top-1/2 right-6 -translate-y-1/2 z-20">
                <div className="bg-red-500/20 backdrop-blur-md border border-red-500/50 rounded-2xl p-4 flex items-center gap-4 animate-pulse shadow-lg text-white">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center"><AlertTriangle className="w-6 h-6" /></div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest">{t?.customsHold || 'Customs'}</p>
                        <p className="font-bold">{hudStats.customsHold} Units</p>
                    </div>
                </div>
            </div>
          )}

          <div className="absolute inset-0 opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center group-hover:scale-105 transition-transform duration-[4000ms] z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-0"></div>
          
          <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none z-20">
            <div className="flex justify-between items-end w-full">
                <div>
                  <h2 className="text-4xl font-bold text-white">{hudStats.activeCount} <span className="text-lg text-slate-400 font-medium">{t?.activeUnits || 'Units'}</span></h2>
                </div>
                {hudStats.nextArrival && (
                  <div className="text-right text-white">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t?.nextArrival || 'Next Arrival'}</p>
                    <p className="text-2xl font-bold">{hudStats.nextArrival.eta}</p>
                  </div>
                )}
            </div>
          </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm gap-4">
        <div>
           <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t?.title || "Logistics Tower"}</h3>
           <p className="text-xs text-slate-500 dark:text-slate-400">{t?.subtitle || "Real-time freight tracking"}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {simulatedShipments.length === 0 && (
            <button onClick={() => setSimulatedShipments(DEMO_SHIPMENTS)} className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all">Load Simulation</button>
          )}
          
          <div className="relative flex-grow md:w-56">
            <div className="absolute left-3 top-3 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input className="w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#003d5b]/20 dark:focus:ring-blue-500/20" placeholder={commonT?.search || "Search..."} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>

          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3 pointer-events-none" />
            <select className="pl-10 pr-8 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white text-sm font-bold appearance-none cursor-pointer" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
              <option value="eta" className="dark:bg-slate-900">{t?.sortBy || "Sort by ETA"}</option>
              <option value="carrier" className="dark:bg-slate-900">Sort by Carrier</option>
              <option value="status" className="dark:bg-slate-900">Sort by Status</option>
            </select>
          </div>

          {/* ROLE SECURITY: Only Admins see Export */}
          {isAdmin && (
            <button 
              onClick={handleExportCSV} 
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" /> <span>{commonT?.export || "Export"}</span>
            </button>
          )}

          {!isReadOnly && (
            <button 
              onClick={onOpenWizard} 
              className="px-4 py-2 bg-[#003d5b] dark:bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-sky-900 dark:hover:bg-blue-500 transition-all flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" /> <span>{t?.addShipment || "Add Shipment"}</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW: GRID (Default) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(s => (
            <div 
              key={s.id} 
              onClick={() => !isReadOnly && handleEditClick(s)}
              className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 hover:shadow-md dark:hover:bg-slate-800/50 hover:border-[#003d5b]/30 dark:hover:border-blue-500/30 transition-all cursor-pointer group relative"
            >
               <div className="flex justify-between items-start mb-2 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">{s.trackingNumber}</span>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setPrintShipmentData(s); }}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-blue-500 transition-colors"
                        title={commonT?.print || "Print Manifest"}
                    >
                        <Printer className="w-3 h-3" />
                    </button>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getStatusColor(s.status)}`}>
                    {s.status}
                  </span>
               </div>
               
               <h5 className="font-bold text-slate-800 dark:text-white text-sm mb-1 leading-tight">{s.carrier}</h5>
               <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{s.origin} &rarr; {s.destination}</p>
               
               <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                      {s.method === 'Air' ? <Plane className="w-4 h-4 text-slate-400 dark:text-slate-500" /> : <Ship className="w-4 h-4 text-slate-400 dark:text-slate-500" />}
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{s.method}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">ETA: {s.eta}</span>
               </div>
            </div>
          ))}
      </div>

      {/* EDIT MODAL */}
      {showModal && editingShipment && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border dark:border-slate-800">
              <div className="bg-[#003d5b] dark:bg-slate-950 p-6 text-white font-bold flex justify-between items-center">
                  <h3>{commonT?.edit || "Edit"} Shipment</h3>
                  <button onClick={() => setShowModal(false)}>
                      <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
              </div>
              <div className="p-8 space-y-5 max-h-[70vh] overflow-y-auto">
                  <Select label="Status" value={editingShipment.status || 'Booked'} onChange={(e: any) => setEditingShipment({...editingShipment, status: e.target.value})}>
                    {['Booked', 'In Transit', 'Customs', 'Delivered', 'Exception', 'Delayed'].map(s => <option key={s} value={s} className="dark:bg-slate-900">{s}</option>)}
                  </Select>
                  <Input label="Current Location" value={editingShipment.currentLocation || ''} onChange={(e: any) => setEditingShipment({...editingShipment, currentLocation: e.target.value})} />
                  <Input label="ETA" type="date" value={editingShipment.eta || ''} onChange={(e: any) => setEditingShipment({...editingShipment, eta: e.target.value})} />
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-slate-500 font-bold hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-sm">{commonT?.cancel || "Cancel"}</button>
                  <button onClick={handleSave} className="px-6 py-2.5 bg-[#003d5b] dark:bg-blue-600 text-white font-bold rounded-xl hover:bg-sky-900 dark:hover:bg-blue-500 shadow-lg text-sm">{commonT?.save || "Save Changes"}</button>
              </div>
           </div>
        </div>
      )}

      {/* PRINT WIZARD */}
      {printShipmentData && (
        <PrintWizard 
          mode="shipment"
          shipment={printShipmentData}
          onClose={() => setPrintShipmentData(null)}
        />
      )}
    </div>
  );
};

export default LogisticsTower;