
import React, { useState, useMemo, useEffect } from 'react';
import { Factory, Product, Language, Job, Shipment, SampleRequest } from '../../types'; // Added Job/Shipment types
import { translations } from '../../translations';
import GraphicalWorldClock from '../GraphicalWorldClock';
import { Logo } from '../Logo';
import { FactoryInspector } from '../FactoryInspector';
import { TOP_30_CATEGORIES } from './constants';

// --- NEW IMPORTS FOR OVERLAYS ---
import ContextualMessageBoard from '../ContextualMessageBoard';
import ConstraintCalendar from '../ConstraintCalendar';

// --- ICONS (Preserving your exact style) ---
const SearchIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const PlusIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>);
const FactoryIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>);
const StarIcon: React.FC<{ className: string, filled?: boolean }> = ({ className, filled }) => (<svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>);
const MapPinIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const DeleteIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const SortIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>);
const GridIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 v2a2 2 0 01-2 h-2a2 2 0 01-2-2v-2z" /></svg>);
const ListIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>);
const DownloadIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>);

// New Icons for Calendar & Hub
const CalendarIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>);
const ChatIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>);

// --- INTERNAL DEMO DATA FOR OVERLAYS ---
// Added missing factoryId to DEMO_JOBS
const DEMO_JOBS: Job[] = [
  { id: 'JOB-101', poNumber: 'PO-2024-8821', customer: 'Urban Outfitters', jobName: 'Graphic Tee Run', quantity: 5000, status: 'In Production', date: '2024-03-15', targetDelivery: '2024-04-15', completionPercent: 45, productRefId: 'PROD-001', factoryId: 'f1' },
  { id: 'JOB-102', poNumber: 'PO-2024-9902', customer: 'Zalando SE', jobName: 'Denim Jacket Run', quantity: 2500, status: 'Cutting', date: '2024-04-01', targetDelivery: '2024-05-01', completionPercent: 10, productRefId: 'PROD-002', factoryId: 'f2' },
];
// Fix: Remove customer property from Shipment and add required carrier and method.
const DEMO_SHIPMENTS: Shipment[] = [
  { id: 'SH-9921', trackingNumber: 'TRK-9921-X', origin: 'Shanghai', destination: 'Los Angeles', eta: '2024-05-10', status: 'In Transit', carrier: 'Maersk', method: 'Sea' },
];
// Fix: Replace styleNo with productId and add required factoryId, cost, and courierCost.
const DEMO_SAMPLES: SampleRequest[] = [
  { id: 'SMP-001', type: 'Fit Sample', productId: 'PROD-001', factoryId: 'f1', status: 'Pending Approval', requestDate: '2024-02-15', cost: 100, courierCost: 50 },
];

interface Props {
  factories: Factory[];
  products: Product[];
  lang: Language;
  onSaveFactory: (f: Factory) => void;
  onDeleteFactory: (id: string) => void;
  isReadOnly?: boolean;
  onOpenWizard: () => void;
}

const FactoryMaster: React.FC<Props> = ({ factories, products, lang, onSaveFactory, onDeleteFactory, isReadOnly, onOpenWizard }) => {
  const t = translations[lang] || translations['en'];
  const fT = t.factory;

  const userRole = localStorage.getItem('userRole') || 'viewer';
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFactory, setSelectedFactory] = useState<Factory | null>(null);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // --- OVERLAY STATES ---
  const [isHubOpen, setIsHubOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const BACKGROUND_IMAGES = [
    "https://images.unsplash.com/photo-1565514020176-db935a6439a3?q=80&w=2070&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex(prev => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const filteredFactories = useMemo(() => {
    let result = (factories || []).filter(f => {
      const term = searchTerm.toLowerCase();
      const nameMatch = f.name.toLowerCase().includes(term);
      const locMatch = (f.location || '').toLowerCase().includes(term);
      const countryMatch = (f.country || '').toLowerCase().includes(term);
      const capMatch = (f.capabilities || []).some(cap => cap.toLowerCase().includes(term));
      return nameMatch || locMatch || countryMatch || capMatch;
    });

    return result.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (sortOrder === 'asc') return nameA.localeCompare(nameB);
      return nameB.localeCompare(nameA);
    });
  }, [factories, searchTerm, sortOrder]);

  const handleExportCSV = () => {
    if (filteredFactories.length === 0) return;
    const headers = "ID,Name,Country,Location,Status,MOQ,BusinessType";
    const rows = filteredFactories.map(f => {
        return `"${f.id}","${f.name}","${f.country}","${f.location}","${f.status}","${f.moq}","${f.businessType}"`;
    }).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `usuppli-factories-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="relative w-full flex justify-center items-center mb-6">
        <div className="flex justify-center w-full bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700">
          <GraphicalWorldClock />
        </div>
        <div className="absolute top-4 right-6 z-10 hidden md:block">
          <Logo className="h-10 w-auto text-slate-700 dark:text-slate-300" variant="mark" />
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="relative w-full h-48 rounded-[2rem] overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700">
        {BACKGROUND_IMAGES.map((img, i) => (
          <img 
            key={img} 
            src={img} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === currentBgIndex ? 'opacity-40' : 'opacity-0'}`} 
            alt=""
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent flex flex-col justify-center p-8">
          <h2 className="text-3xl font-black text-white tracking-tight">{fT.title}</h2>
          <p className="text-slate-300 text-sm font-bold uppercase tracking-widest mt-1">{fT.subtitle}</p>
        </div>
      </div>

      {/* COMMAND TOOLBAR */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm gap-4">
        <div className="flex flex-col">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
                <FactoryIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Portfolio Explorer
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Active Manufacturing Partners</p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-[200px] group">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                <input 
                    type="text" 
                    placeholder={fT.search} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 dark:text-slate-100 rounded-xl text-xs font-bold outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-600/10 transition-all"
                />
            </div>

            <button 
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"
            >
                <SortIcon className={`w-5 h-5 transition-transform duration-300 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            </button>

            <button 
                onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"
            >
                {viewMode === 'grid' ? <ListIcon className="w-5 h-5" /> : <GridIcon className="w-5 h-5" />}
            </button>

            {/* --- NEW BUTTONS FOR OVERLAYS --- */}
            <button 
                onClick={() => setIsCalendarOpen(true)}
                className={`w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all shadow-sm ${isCalendarOpen ? 'ring-2 ring-blue-500/20' : ''}`}
                title="Constraints Calendar"
            >
                <CalendarIcon className="w-5 h-5" />
            </button>

            <button 
                onClick={() => setIsHubOpen(true)}
                className={`w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all shadow-sm ${isHubOpen ? 'ring-2 ring-blue-500/20' : ''}`}
                title="Hub Messages"
            >
                <ChatIcon className="w-5 h-5" />
            </button>

            {/* ROLE SECURITY */}
            {isAdmin && (
                <button 
                    onClick={handleExportCSV} 
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 shadow-sm"
                >
                    <DownloadIcon className="w-4 h-4" /> <span>CSV</span>
                </button>
            )}

            {!isReadOnly && (
                <button 
                    onClick={onOpenWizard}
                    className="h-10 px-5 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg active:scale-95 shrink-0"
                >
                    <PlusIcon className="w-4 h-4" />
                    <span>{fT.addBtn}</span>
                </button>
            )}
        </div>
      </div>

      {/* CONTENT AREA */}
      {filteredFactories.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFactories.map(f => (
              <div key={f.id} onClick={() => setSelectedFactory(f)} className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group flex flex-col overflow-hidden cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-slate-400 dark:text-slate-500 group-hover:bg-blue-600 dark:group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <FactoryIcon className="w-6 h-6" />
                      </div>
                      <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                          <StarIcon key={star} className={`w-3 h-3 ${star <= (f.rating || 0) ? 'text-amber-400' : 'text-slate-200 dark:text-slate-900'}`} filled={star <= (f.rating || 0)} />
                      ))}
                      </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">{f.name}</h3>
                  <p className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-4">
                      <MapPinIcon className="w-3 h-3" /> {f.location}{f.country ? `, ${f.country}` : ''}
                  </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-700 flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedFactory(f); }} className="flex-1 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all">View Audit</button>
                    {!isReadOnly && (
                        <button onClick={(e) => { e.stopPropagation(); onDeleteFactory(f.id); }} className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 rounded-xl transition-all"><DeleteIcon className="w-4 h-4" /></button>
                    )}
                  </div>
              </div>
              ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                        <th className="p-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Supplier Identity</th>
                        <th className="p-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Location</th>
                        <th className="p-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</th>
                        <th className="p-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredFactories.map(f => (
                        <tr key={f.id} onClick={() => setSelectedFactory(f)} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                            <td className="p-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-blue-600 dark:group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                        <FactoryIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-white text-sm">{f.name}</p>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight">{f.businessType || 'Manufacturer'}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-5 text-xs font-bold text-slate-600 dark:text-slate-300">
                                {f.location}{f.country ? `, ${f.country}` : ''}
                            </td>
                            <td className="p-5">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                                    f.status === 'Vetting' ? 'bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' : 'bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                                }`}>{f.status || 'Active'}</span>
                            </td>
                            <td className="p-5 text-right">
                                <button onClick={(e) => { e.stopPropagation(); setSelectedFactory(f); }} className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 font-bold text-[10px] rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all shadow-sm">View Audit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
              </table>
          </div>
        )
      ) : (
          <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-600 text-center">
              <FactoryIcon className="w-16 h-16 mb-6 opacity-10" />
              <p className="font-bold text-lg text-slate-800 dark:text-white">No results found</p>
          </div>
      )}

      {/* --- INTEGRATED OVERLAYS --- */}
      <ConstraintCalendar 
          isOpen={isCalendarOpen} 
          onClose={() => setIsCalendarOpen(false)} 
          lang={lang} 
          // Mapping Factories to Suppliers for the Calendar
          suppliers={factories.map(f => ({ id: f.id, name: f.name, country: f.country } as any))} 
          jobs={DEMO_JOBS} 
          shipments={DEMO_SHIPMENTS} 
          samples={DEMO_SAMPLES}
          products={products}
      />

      <ContextualMessageBoard 
          isOpen={isHubOpen} 
          onClose={() => setIsHubOpen(false)} 
          lang={lang} // Added missing lang prop
          customers={[]} 
          suppliers={factories.map(f => ({ id: f.id, name: f.name, country: f.country } as any))}
          currentUser={null} // Or pass actual user if available
          jobs={DEMO_JOBS} 
          samples={DEMO_SAMPLES} 
          shipments={DEMO_SHIPMENTS} 
          onNavigateToCustomer={() => {}} 
          onNavigateToOrder={() => {}}
      />

      {/* FACTORY INSPECTOR MODAL */}
      <FactoryInspector isOpen={!!selectedFactory} onClose={() => setSelectedFactory(null)} factory={selectedFactory} />
    </div>
  );
};

export default FactoryMaster;
