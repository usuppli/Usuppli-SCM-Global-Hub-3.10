
import React, { useState, useMemo, useEffect } from 'react';
import { Job, Product, Factory, SampleRequest, Language, Customer } from '../../types';
import { translations } from '../../translations';
import OrderManager from './OrderManager';
import GraphicalWorldClock from '../GraphicalWorldClock';
import { Logo } from '../Logo';
import { IconsOutline as Icons } from '../Icons';
import { Printer, Plus, Search, Paperclip, Truck, DollarSign, User, Pencil, X, Download } from 'lucide-react';
import PrintWizard from '../PrintWizard';

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

// --- PRE-POPULATED DATA ---
const DEMO_JOBS: Job[] = [
    // Added missing factoryId to DEMO_JOBS
    { id: 'JOB-2024-001', jobName: 'Spring Collection Launch', productRefId: 'PROD-001', factoryId: 'FAC-001', quantity: 5000, status: 'Production', completionPercent: 60, productionStage: 'Assembly', startDate: '2024-01-15', deliveryDate: '2024-03-01', targetDelivery: '2024-03-01', priority: 'High' },
    { id: 'JOB-2024-002', jobName: 'Urgent Restock - Black Tees', productRefId: 'PROD-004', factoryId: 'FAC-002', quantity: 2000, status: 'Inquiry', completionPercent: 10, productionStage: 'Material Prep', startDate: '2024-02-01', deliveryDate: '2024-02-28', targetDelivery: '2024-02-28', priority: 'Urgent' },
];

const DEMO_SAMPLES: SampleRequest[] = [
  { id: 'SMP-CN-001', type: 'Counter Sample', productId: 'PROD-BAMBOO', factoryId: 'FAC-CN-005', customerId: 'CUST-ROTH', status: 'In Progress', requestDate: '2024-02-01', estimatedCompletion: '2024-02-15', trackingNumber: 'Pending', courier: 'SF Express', cost: 120.00, courierCost: 35.00, attachments: [], comments: [{ id: 'c1', userId: 'sys', userName: 'System', text: 'Fabric weight must be 220gsm.', date: new Date().toISOString() }] },
];

const SAMPLE_BACKGROUNDS = [
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=2070&auto=format&fit=crop", 
];

interface Props {
  products: Product[];
  customers: Customer[];
  factories: Factory[];
  jobs: Job[];
  samples: SampleRequest[];
  lang: Language;
  onSaveJobsList: (jobs: Job[]) => void;
  onSaveSample: (sample: SampleRequest) => void;
  onRequestNewJob?: () => void;
  onRequestNewSample?: () => void;
  isReadOnly?: boolean;
}

const Jobs: React.FC<Props> = ({ 
  products = [], 
  customers = [], 
  factories = [], 
  jobs = [], 
  samples = [], 
  lang, 
  onSaveJobsList, 
  onSaveSample, 
  onRequestNewJob, 
  onRequestNewSample,
  isReadOnly = false 
}) => {
  // Safe Translation Access
  const rootT = translations[lang] || translations['en'];
  const t = rootT.production;
  const commonT = rootT.common;
  
  const userRole = localStorage.getItem('userRole') || 'viewer';
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';

  const [activeSubTab, setActiveSubTab] = useState<'production' | 'samples'>('production');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'date' | 'status'>('date'); 
  const [simulatedJobs] = useState<Job[]>(DEMO_JOBS); 
  const [simulatedSamples] = useState<SampleRequest[]>(DEMO_SAMPLES); 
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [editingSample, setEditingSample] = useState<Partial<SampleRequest> | null>(null);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [printSample, setPrintSample] = useState<SampleRequest | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentBgIndex((prev) => (prev + 1) % SAMPLE_BACKGROUNDS.length), 15000);
    return () => clearInterval(timer);
  }, []);

  const allJobs = useMemo(() => [...(jobs.length > 0 ? jobs : simulatedJobs)], [jobs, simulatedJobs]);
  const allSamples = useMemo(() => [...(samples.length > 0 ? samples : simulatedSamples)], [samples, simulatedSamples]);

  const filteredSamples = useMemo(() => {
    return allSamples.filter(s => {
      const term = searchTerm.toLowerCase();
      return (s.trackingNumber || '').toLowerCase().includes(term) || (s.id || '').toLowerCase().includes(term);
    }).sort((a, b) => sortOrder === 'status' ? (a.status || '').localeCompare(b.status || '') : new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
  }, [allSamples, searchTerm, sortOrder]);

  const handleExportCSV = () => {
    const isProd = activeSubTab === 'production';
    const dataSet = isProd ? allJobs : allSamples;
    if (dataSet.length === 0) return;

    const headers = isProd ? "ID,Name,Status,Quantity,DeliveryDate" : "ID,Type,Status,Cost";
    const rows = isProd 
      ? allJobs.map(j => `"${j.id}","${j.jobName}","${j.status}","${j.quantity}","${j.deliveryDate || j.targetDelivery}"`).join('\n')
      : allSamples.map(s => `"${s.id}","${s.type}","${s.status}","${s.cost}"`).join('\n');

    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `usuppli-${isProd ? 'orders' : 'samples'}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getProductName = (id: string) => products?.find(p => p.id === id)?.name || id;
  const getFactoryName = (id: string) => factories?.find(f => f.id === id)?.name || id;

  const getStatusColor = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('approved') || s.includes('delivered')) return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
    if (s.includes('progress') || s.includes('transit') || s.includes('shipped')) return 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800';
    return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
  };

  const handleSaveSample = () => {
    if (editingSample?.id) {
        onSaveSample(editingSample as SampleRequest);
        setShowSampleModal(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="relative w-full flex justify-center items-center mb-2">
         <div className="flex justify-center w-full bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700"><GraphicalWorldClock /></div>
         <div className="absolute top-4 right-6 z-10 hidden md:block"><Logo className="h-10 w-auto text-slate-700 dark:text-slate-300" variant="mark" /></div>
      </div>

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm gap-4">
         <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                 <Icons.Order className="w-6 h-6 text-slate-400" />
                 <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{t?.title || "Order Manager"}</h3>
             </div>
             <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button onClick={() => setActiveSubTab('production')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'production' ? 'bg-white dark:bg-slate-700 text-[#003d5b] dark:text-white shadow-sm' : 'text-slate-500'}`}>
                    {t?.tabs?.production || "Production"}
                </button>
                <button onClick={() => setActiveSubTab('samples')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'samples' ? 'bg-white dark:bg-slate-700 text-[#003d5b] dark:text-white shadow-sm' : 'text-slate-500'}`}>
                    {t?.tabs?.samples || "Samples"}
                </button>
             </div>
         </div>
         
         <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-end">
             <div className="relative group flex-grow md:flex-grow-0 md:w-64">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Search className="h-4 w-4 text-slate-400" />
                 </div>
                 <input type="text" className={`${LOCAL_STYLES.inputBase} ${LOCAL_STYLES.inputFocus} pl-10`} placeholder={commonT?.search} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
             </div>

             {isAdmin && (
               <button onClick={handleExportCSV} className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm shrink-0">
                  <Download className="w-4 h-4" /> <span>{commonT?.export}</span>
               </button>
             )}

             {!isReadOnly && (
                 <button onClick={() => activeSubTab === 'production' ? onRequestNewJob?.() : onRequestNewSample?.()} className="px-4 py-2 bg-[#003d5b] dark:bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 shrink-0 hover:bg-sky-900 transition-all">
                    <Plus className="w-4 h-4" />
                    {activeSubTab === 'production' ? (t?.newJob || "New Order") : (t?.requestSample || "New Sample")}
                 </button>
             )}
         </div>
      </div>

      <div className="min-h-[600px]">
          {activeSubTab === 'production' ? (
            // Added missing onUpdateJob and onDeleteJob handlers
            <OrderManager 
              jobs={allJobs.filter(j => j.jobName.toLowerCase().includes(searchTerm.toLowerCase()))} 
              viewMode="board" 
              lang={lang} 
              products={products} 
              factories={factories} 
              customers={customers} 
              isReadOnly={isReadOnly} 
              onUpdateJob={(job) => onSaveJobsList(allJobs.map(j => j.id === job.id ? job : j))}
              onDeleteJob={(id) => onSaveJobsList(allJobs.filter(j => j.id !== id))}
            />
          ) : (
            <div className="flex flex-col lg:flex-row h-[calc(100vh-280px)] gap-6">
                {/* List View */}
                <div className="w-full lg:w-1/3 flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t?.sampleTracker || "Sample Tracker"}</h4>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/50 dark:bg-slate-950/50">
                        {filteredSamples.map(s => (
                            <div key={s.id} onClick={() => setSelectedSampleId(s.id)} className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${selectedSampleId === s.id ? 'bg-white dark:bg-slate-800 border-[#003d5b] dark:border-blue-500 shadow-md' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
                                <div className="flex justify-between items-start">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(s.status)}`}>{s.status}</span>
                                    <button onClick={(e) => { e.stopPropagation(); setPrintSample(s); }} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-400 transition-colors"><Printer className="w-3 h-3" /></button>
                                </div>
                                <h5 className="font-bold text-sm text-slate-700 dark:text-slate-200">{getProductName(s.productId)}</h5>
                                <p className="text-[10px] text-slate-400 font-mono">{s.id}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detail View */}
                <div className="flex-1 rounded-[2rem] bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 overflow-y-auto">
                    {selectedSampleId ? (
                        <div className="space-y-6">
                            <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden min-h-[200px] flex items-center">
                                <img src={SAMPLE_BACKGROUNDS[currentBgIndex]} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                                <div className="relative z-10 text-white">
                                    <h2 className="text-3xl font-black">{getProductName(allSamples.find(s => s.id === selectedSampleId)!.productId)}</h2>
                                    <p className="text-sky-300 font-mono mt-2">{selectedSampleId}</p>
                                </div>
                            </div>
                            {/* Detailed Info Cards... */}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                             <Icons.Order className="w-16 h-16 opacity-20 mb-4" />
                             <p className="font-bold uppercase tracking-widest text-xs">Select a sample to view details</p>
                        </div>
                    )}
                </div>
            </div>
          )}
      </div>

      {showSampleModal && editingSample && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
           <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border dark:border-slate-800 overflow-hidden">
              <div className="bg-[#003d5b] p-6 text-white font-bold flex justify-between">
                  <h3>{commonT?.edit} Sample Request</h3>
                  <button onClick={() => setShowSampleModal(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="p-8 space-y-4">
                  <Select label="Status" value={editingSample.status} onChange={(e:any) => setEditingSample({...editingSample, status: e.target.value})}>
                      {['Requested', 'In Progress', 'Shipped', 'Delivered', 'Feedback'].map(s => <option key={s} value={s}>{s}</option>)}
                  </Select>
                  <Input label="Tracking Number" value={editingSample.trackingNumber} onChange={(e:any) => setEditingSample({...editingSample, trackingNumber: e.target.value})} />
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t flex justify-end gap-2">
                  <button onClick={() => setShowSampleModal(false)} className="px-4 py-2 font-bold text-slate-500">{commonT?.cancel}</button>
                  <button onClick={handleSaveSample} className="px-6 py-2 bg-[#003d5b] text-white font-bold rounded-xl">{commonT?.save}</button>
              </div>
           </div>
        </div>
      )}

      {printSample && (
        <PrintWizard mode="sample" sample={printSample} product={products.find(p => p.id === printSample.productId)} factory={factories.find(f => f.id === printSample.factoryId)} onClose={() => setPrintSample(null)} />
      )}
    </div>
  );
};

export default Jobs;
