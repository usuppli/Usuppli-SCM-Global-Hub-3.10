
import React, { useState, useEffect, useMemo } from 'react';
import { Job, Language, Customer, Factory, Product } from '../../types';
import { translations } from '../../translations';
import { draftOrderEmail } from '../../utils/emailOrder';
import PrintWizard from '../PrintWizard';

const EditIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>);
const BoxIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>);
const CalendarIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>);
const UserIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const CheckCircleIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const AlertIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>);
const TrendingIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>);
const SortIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>);
const PencilIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>);
const CloseIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>);
const PrinterIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>);
const MailIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);

const STYLES = {
  label: "block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5",
  inputBase: "w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 focus:border-[#003d5b] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#003d5b]/20",
  inputError: "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50 dark:bg-red-950/20",
  errorText: "mt-1 text-xs text-red-500 font-bold"
};

const Input = ({ label, error, ...props }: any) => (
  <div className="w-full">
    {label && <label className={STYLES.label}>{label} {error && <span className="text-red-500">*</span>}</label>}
    <input className={`${STYLES.inputBase} ${error ? STYLES.inputError : ''}`} {...props} />
    {error && <p className={STYLES.errorText}>{error}</p>}
  </div>
);

const Select = ({ label, error, children, ...props }: any) => (
  <div className="w-full">
    {label && <label className={STYLES.label}>{label} {error && <span className="text-red-500">*</span>}</label>}
    <div className="relative">
      <select className={`${STYLES.inputBase} appearance-none cursor-pointer ${error ? STYLES.inputError : ''}`} {...props}>{children}</select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">▼</div>
    </div>
    {error && <p className={STYLES.errorText}>{error}</p>}
  </div>
);

const PRODUCTION_BACKGROUNDS = [
    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1565514020176-db935a6439a3?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop",
];

interface Props {
  jobs: Job[];
  viewMode: 'board' | 'list';
  lang: Language;
  onUpdateJob: (job: Job) => void;
  onDeleteJob: (id: string) => void;
  isReadOnly?: boolean;
  customers: Customer[];
  factories: Factory[];
  products: Product[];
}

const OrderManager: React.FC<Props> = ({ jobs = [], lang, onUpdateJob, onDeleteJob, isReadOnly, customers = [], factories = [], products = [] }) => {
  // ROLE RESTRICTION FOR CSV EXPORT
  const userRole = localStorage.getItem('userRole') || 'viewer';
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPrintWizard, setShowPrintWizard] = useState(false);
  
  // NEW: State for printing from list row
  const [printJob, setPrintJob] = useState<Job | null>(null);

  const [editingJob, setEditingJob] = useState<Partial<Job>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sortOrder, setSortOrder] = useState<'date' | 'priority'>('date');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentBgIndex((prev) => (prev + 1) % PRODUCTION_BACKGROUNDS.length);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!selectedJobId && jobs.length > 0) {
      setSelectedJobId(jobs[0].id);
    }
  }, [jobs, selectedJobId]);

  const sortedJobs = useMemo(() => {
      return [...jobs].sort((a, b) => {
          if (sortOrder === 'priority') {
              const pMap: any = { 'Urgent': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
              return (pMap[a.priority] || 2) - (pMap[b.priority] || 2);
          }
          return new Date(b.startDate || Date.now()).getTime() - new Date(a.startDate || Date.now()).getTime();
      });
  }, [jobs, sortOrder]);

  const selectedJob = useMemo(() => jobs.find(j => j.id === selectedJobId), [jobs, selectedJobId]);

  const handleEditClick = (job: Job) => {
    if(!job) return;
    setEditingJob({ ...job });
    setErrors({});
    setShowModal(true);
  };

  const handleFieldChange = (field: string, value: any) => {
    setEditingJob(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!editingJob.jobName?.trim()) newErrors.jobName = "Job Name is required";
    if (!editingJob.factoryId) newErrors.factoryId = "Factory is required";
    if (!editingJob.customerId) newErrors.customerId = "Customer is required";
    if ((editingJob.quantity || 0) <= 0) newErrors.quantity = "Qty must be > 0";
    if (!editingJob.deliveryDate) newErrors.deliveryDate = "Date required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingJob.id) {
      onUpdateJob(editingJob as Job);
      setShowModal(false);
    }
  };

  const handleEmailOrder = () => {
    const factory = factories.find(f => f.id === editingJob.factoryId);
    if (!factory) {
      alert("Error: Factory not found.");
      return;
    }
    draftOrderEmail(editingJob, factory);
  };

  const getStatusColor = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('complet')) return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
    if (s.includes('produc')) return 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800';
    if (s.includes('inquiry')) return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800';
    return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
  };

  const getProgressColor = (percent: number) => {
    if (percent === 100) return 'bg-emerald-500';
    if (percent >= 75) return 'bg-teal-500';
    if (percent >= 50) return 'bg-sky-500';
    if (percent >= 25) return 'bg-amber-500';
    return 'bg-slate-300 dark:bg-slate-700';
  };

  const getCustomerName = (id: string) => {
      if(!customers) return 'Internal';
      const c = customers.find(x => x.id === id);
      return c ? (c.companyName || c.name) : 'Internal Order';
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-280px)] min-h-[600px] gap-6 animate-in fade-in duration-500">
      <div className="w-full lg:w-1/3 flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center sticky top-0 z-10">
           <div>
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Orders</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{jobs.length} Records Found</p>
           </div>
           <button onClick={() => setSortOrder(prev => prev === 'date' ? 'priority' : 'date')} className="p-2 text-slate-400 dark:text-slate-500 hover:text-[#003d5b] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
                <SortIcon className="w-4 h-4" />
           </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
           {sortedJobs.map(job => (
             <div 
               key={job.id} 
               onClick={() => setSelectedJobId(job.id)}
               className={`p-4 rounded-xl border transition-all cursor-pointer group relative flex flex-col gap-2 shadow-sm ${
                 selectedJobId === job.id 
                   ? 'bg-white dark:bg-slate-800 border-[#003d5b] dark:border-blue-500 ring-1 ring-[#003d5b]/10 shadow-md' 
                   : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-[#003d5b]/30 dark:hover:border-blue-500/50 hover:shadow-md'
               }`}
             >
                <div className="flex justify-between items-start">
                   <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getStatusColor(job.status)}`}>
                      {job.status}
                   </span>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{job.deliveryDate}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setPrintJob(job); }} 
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-[#003d5b] dark:hover:text-blue-400 transition-colors"
                        title="Print Order"
                      >
                        <PrinterIcon className="w-3 h-3" />
                      </button>
                   </div>
                </div>
                <div>
                   <h5 className={`font-bold text-sm leading-tight ${selectedJobId === job.id ? 'text-[#003d5b] dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'}`}>
                      {job.jobName}
                   </h5>
                   <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{job.productRefId}</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-50 dark:border-slate-800 mt-1">
                   <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <BoxIcon className="w-3 h-3 text-slate-400" /> {job.quantity?.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">units</span>
                   </span>
                   {job.priority === 'Urgent' && <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">Urgent</span>}
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="flex-1 rounded-[2rem] overflow-hidden flex flex-col relative bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
         {selectedJob ? (
           <div className="h-full overflow-y-auto custom-scrollbar p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div onClick={() => handleEditClick(selectedJob)} className="md:col-span-3 bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-800 relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all min-h-[180px]">
                     {PRODUCTION_BACKGROUNDS.map((img, index) => (
                          <img key={index} src={img} alt="" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentBgIndex ? 'opacity-40' : 'opacity-0'}`} />
                     ))}
                     <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent z-10 pointer-events-none"></div>
                     <div className="relative z-20 flex justify-between items-start">
                        <div>
                           <div className="flex items-center gap-3 mb-2">
                              <h2 className="text-2xl font-bold text-white">{selectedJob.jobName}</h2>
                              <span className="text-xs font-mono text-slate-400 bg-white/10 px-2 py-1 rounded backdrop-blur-sm">{selectedJob.id}</span>
                           </div>
                           <div className="flex items-center gap-4 text-sm text-slate-300">
                              <span className="flex items-center gap-1"><UserIcon className="w-4 h-4" /> {getCustomerName(selectedJob.customerId || '')}</span>
                              <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                              <span className="flex items-center gap-1"><BoxIcon className="w-4 h-4" /> {selectedJob.productRefId}</span>
                           </div>
                        </div>
                        {!isReadOnly && <div className="p-2 text-white/50 group-hover:text-white bg-white/10 rounded-full transition-colors"><EditIcon className="w-5 h-5" /></div>}
                     </div>
                  </div>

                  <div onClick={() => handleEditClick(selectedJob)} className="md:col-span-3 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 cursor-pointer hover:shadow-md transition-all">
                     <div className="flex justify-between items-center mb-6">
                        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Production Timeline</h4>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${getProgressColor(selectedJob.completionPercent)}`}>{selectedJob.completionPercent}% Complete</span>
                     </div>
                     <div className="relative">
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 rounded-full z-0"></div>
                        <div className={`absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full z-0 transition-all duration-1000 ${getProgressColor(selectedJob.completionPercent)}`} style={{ width: `${selectedJob.completionPercent}%` }}></div>
                        <div className="relative z-10 flex justify-between">
                           {['Inquiry', 'Sampling', 'Material Prep', 'Production', 'QC', 'In Transit', 'Delivered'].map((stage, index) => {
                              const isCompleted = index <= ['Inquiry', 'Sampling', 'Material Prep', 'Production', 'QC', 'In Transit', 'Delivered'].findIndex(s => s === selectedJob.status) || (selectedJob.completionPercent > (index * 15)); 
                              const isCurrent = stage === selectedJob.status;
                              return (
                                 <div key={stage} className="flex flex-col items-center gap-3 group">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isCompleted ? `border-transparent text-white ${getProgressColor(selectedJob.completionPercent)}` : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600'}`}>
                                       {isCompleted ? <CheckCircleIcon className="w-4 h-4" /> : <span className="text-[10px] font-bold">{index + 1}</span>}
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase tracking-wide transition-colors ${isCurrent ? 'text-[#003d5b] dark:text-blue-400' : 'text-slate-300 dark:text-slate-600'}`}>{stage}</span>
                                 </div>
                              )
                           })}
                        </div>
                     </div>
                  </div>

                  <div onClick={() => handleEditClick(selectedJob)} className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 shadow-lg shadow-emerald-500/20 text-white relative group cursor-pointer hover:scale-105 transition-transform duration-300">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="p-2 bg-white/20 rounded-xl"><TrendingIcon className="w-6 h-6" /></div>
                         <div>
                            <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">Total Value</p>
                            <p className="text-xl font-bold">${(selectedJob.quantity * 25).toLocaleString()}</p>
                         </div>
                      </div>
                  </div>

                  <div onClick={() => handleEditClick(selectedJob)} className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl p-6 shadow-lg shadow-indigo-500/20 text-white relative group cursor-pointer hover:scale-105 transition-transform duration-300">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="p-2 bg-white/20 rounded-xl"><BoxIcon className="w-6 h-6" /></div>
                         <div>
                            <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-wider">Order Volume</p>
                            <p className="text-xl font-bold">{selectedJob.quantity.toLocaleString()}</p>
                         </div>
                      </div>
                  </div>

                  <div onClick={() => handleEditClick(selectedJob)} className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-6 shadow-lg shadow-amber-500/20 text-white relative group cursor-pointer hover:scale-105 transition-transform duration-300">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="p-2 bg-white/20 rounded-xl"><CalendarIcon className="w-6 h-6" /></div>
                         <div>
                            <p className="text-[10px] font-bold text-amber-100 uppercase tracking-wider">Target Delivery</p>
                            <p className="text-xl font-bold">{selectedJob.deliveryDate}</p>
                         </div>
                      </div>
                  </div>
              </div>
           </div>
         ) : (
           <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
              <BoxIcon className="w-16 h-16 opacity-50 mb-4" />
              <h3 className="text-xl font-bold text-slate-600 dark:text-slate-400">Select an Order</h3>
           </div>
         )}
      </div>

      {showModal && editingJob && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
         <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden border dark:border-slate-800">
            <div className="bg-[#003d5b] dark:bg-slate-950 p-6 text-white font-bold flex justify-between items-center">
                <h3>Edit Order Details</h3>
                <button onClick={() => setShowModal(false)}><CloseIcon className="w-5 h-5 opacity-70" /></button>
            </div>
            
            <div className="p-8 space-y-5 overflow-y-auto max-h-[80vh]">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                       <Input label="Job Name" value={editingJob.jobName || ''} onChange={(e: any) => handleFieldChange('jobName', e.target.value)} error={errors.jobName} />
                       <Select label="Factory" value={editingJob.factoryId || ''} onChange={(e: any) => handleFieldChange('factoryId', e.target.value)} error={errors.factoryId}>
                          <option value="" className="dark:bg-slate-900">Select Factory...</option>
                          {factories.map(f => <option key={f.id} value={f.id} className="dark:bg-slate-900">{f.name}</option>)}
                       </Select>
                       <Select label="Customer" value={editingJob.customerId || ''} onChange={(e: any) => handleFieldChange('customerId', e.target.value)} error={errors.customerId}>
                          <option value="" className="dark:bg-slate-900">Select Customer...</option>
                          {customers.map(c => <option key={c.id} value={c.id} className="dark:bg-slate-900">{c.companyName || c.name}</option>)}
                       </Select>
                       <Select label="Status" value={editingJob.status || 'Inquiry'} onChange={(e: any) => handleFieldChange('status', e.target.value)}>
                          {['Inquiry', 'Sampling', 'Material Prep', 'Production', 'QC', 'In Transit', 'Delivered'].map(s => <option key={s} value={s} className="dark:bg-slate-900">{s}</option>)}
                       </Select>
                       <div className="w-full">
                          <label className={STYLES.label}>Project Description</label>
                          <textarea className={`${STYLES.inputBase} h-24 resize-none`} value={editingJob.description || ''} onChange={(e) => handleFieldChange('description', e.target.value)} />
                       </div>
                   </div>
                   <div className="space-y-4">
                       <Input label="Quantity" type="number" value={editingJob.quantity || 0} onChange={(e: any) => handleFieldChange('quantity', Number(e.target.value))} error={errors.quantity} />
                       <Input label="Delivery Date" type="date" value={editingJob.deliveryDate || ''} onChange={(e: any) => handleFieldChange('deliveryDate', e.target.value)} error={errors.deliveryDate} />
                       <Select label="Incoterms" value={editingJob.incoterms || 'FOB'} onChange={(e: any) => handleFieldChange('incoterms', e.target.value)}>
                          {['EXW', 'FOB', 'CIF', 'DDP', 'DAP'].map(i => <option key={i} value={i} className="dark:bg-slate-900">{i}</option>)}
                       </Select>
                       <div className="w-full">
                          <label className={STYLES.label}>Packaging Requirements</label>
                          <textarea className={`${STYLES.inputBase} h-24 resize-none`} value={editingJob.packagingInstructions || ''} onChange={(e) => handleFieldChange('packagingInstructions', e.target.value)} />
                       </div>
                   </div>
               </div>
               <div className="pt-4 border-t dark:border-slate-800">
                  <label className={STYLES.label}>Overall Progress ({editingJob.completionPercent || 0}%)</label>
                  <input type="range" min="0" max="100" className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#003d5b]" value={editingJob.completionPercent || 0} onChange={(e) => handleFieldChange('completionPercent', Number(e.target.value))} />
               </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
               <div className="flex gap-2">
                  <button onClick={() => setShowPrintWizard(true)} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs flex items-center gap-2 transition-all"><PrinterIcon className="w-4 h-4" /> Export PO</button>
                  <button onClick={handleEmailOrder} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs flex items-center gap-2 transition-all"><MailIcon className="w-4 h-4" /> Email Factory</button>
               </div>
               <div className="flex gap-2">
                  <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-slate-500 font-bold hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-sm">Cancel</button>
                  <button onClick={handleSave} className="px-6 py-2.5 bg-[#003d5b] dark:bg-blue-600 text-white font-bold rounded-xl hover:bg-sky-900 shadow-lg text-sm">Save Changes</button>
               </div>
            </div>
         </div>
      </div>
    )}

    {/* Wizard for Editing Job (Existing) */}
    {showPrintWizard && editingJob.id && (
      <PrintWizard 
        mode="order"
        job={editingJob as Job} 
        factory={factories.find(f => f.id === editingJob.factoryId) || { id: 'unknown', name: 'Unknown Factory', location: 'N/A', country: 'N/A', contactPerson: 'N/A', contactEmail: 'N/A', rating: 0, contact: '', phone: '' }} 
        customer={customers.find(c => c.id === editingJob.customerId) || { id: 'unknown', companyName: 'Unknown Customer', email: '', region: 'N/A', contactPerson: '', totalOrders: 0 }} 
        product={products.find(p => p.id === editingJob.productRefId)}
        onClose={() => setShowPrintWizard(false)} 
      />
    )}

    {/* Wizard for List Item Printing (New) */}
    {printJob && (
      <PrintWizard 
        mode="order"
        job={printJob} 
        factory={factories.find(f => f.id === printJob.factoryId)} 
        customer={customers.find(c => c.id === printJob.customerId)} 
        product={products.find(p => p.id === printJob.productRefId)}
        onClose={() => setPrintJob(null)} 
      />
    )}
    </div>
  );
};

export default OrderManager;
