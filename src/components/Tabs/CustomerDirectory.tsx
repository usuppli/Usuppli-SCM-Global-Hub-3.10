
import React, { useState, useMemo } from 'react';
import { Customer, Language, User as UserType, Job, Shipment, SampleRequest, Supplier, Product } from '../../types';
import { translations } from '../../translations';
import GraphicalWorldClock from '../GraphicalWorldClock';
import { Logo } from '../Logo';
import ContextualMessageBoard from '../ContextualMessageBoard';
import ConstraintCalendar from '../ConstraintCalendar';

// --- ICONS ---
import { Search, Grid, List, UserPlus, Calendar, MessageSquare, Globe, Mail, MoreVertical, Building2 } from 'lucide-react';

// --- INTERNAL DEMO DATA TO PREVENT CRASHES ---
const DEMO_JOBS: Job[] = [
  { id: 'JOB-101', poNumber: 'PO-2024-8821', customer: 'Urban Outfitters', jobName: 'Graphic Tee Run', quantity: 5000, status: 'In Production', date: '2024-03-15', targetDelivery: '2024-04-15', completionPercent: 20, productRefId: 'PROD-001', factoryId: 'FAC-001' },
  { id: 'JOB-102', poNumber: 'PO-2024-9902', customer: 'Zalando SE', jobName: 'Denim Jacket Batch', quantity: 2500, status: 'Cutting', date: '2024-04-01', targetDelivery: '2024-05-01', completionPercent: 10, productRefId: 'PROD-002', factoryId: 'FAC-002' },
];

const DEMO_SHIPMENTS: Shipment[] = [
  { id: 'SH-9921', trackingNumber: 'TRK-9921-X', origin: 'Shanghai', destination: 'Los Angeles', eta: '2024-05-10', status: 'In Transit', items: [], carrier: 'Maersk', method: 'Sea' },
];

const DEMO_SAMPLES: SampleRequest[] = [
  { id: 'SMP-001', type: 'Fit Sample', productId: 'PROD-001', factoryId: 'FAC-001', status: 'Pending Approval', requestDate: '2024-02-15', cost: 100, courierCost: 50 },
];

const DEMO_SUPPLIERS: Supplier[] = [
  { id: 'SUP-001', name: 'GreenTextiles Ltd', country: 'Vietnam', sector: 'Textiles', overallGrade: 'A', lastAuditDate: '2024-01-01', certifications: [], metrics: [] },
];

const DEMO_PRODUCTS: Product[] = [
  { 
    id: 'PROD-001', 
    name: 'Organic Cotton Tee', 
    brand: 'Generic', 
    status: 'Active', 
    category: 'Tops', 
    sku: 'ORG-TEE', // Added missing 'sku' property
    dimensions: { lengthCm: 0, widthCm: 0, heightCm: 0, weightKg: 0 }, 
    costVariables: { materials: 12.50 }, 
    skus: [] 
  },
];

const COLORS = [
  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
];

interface Props {
  customers: Customer[];
  users: UserType[];
  lang: Language;
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer: (customer: Customer) => void;
  onDeleteCustomer?: (id: string) => void;
  isReadOnly?: boolean;
  jobs?: Job[];
  shipments?: Shipment[];
  samples?: SampleRequest[];
  onOpenCustomerWizard: () => void;
}

const CustomerDirectory: React.FC<Props> = ({ 
  customers = [], users = [], lang, onAddCustomer, onUpdateCustomer, onDeleteCustomer, isReadOnly, 
  jobs = DEMO_JOBS, shipments = DEMO_SHIPMENTS, samples = DEMO_SAMPLES, onOpenCustomerWizard
}) => {
  // Safe Translation Access
  const rootT = translations[lang] || translations['en'];
  const t = rootT.crm;
  const navT = rootT.nav;
  const commonT = rootT.common;
  
  const [isHubOpen, setIsHubOpen] = useState(false); 
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    return customers.filter(c => 
      (c.companyName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* GLOBAL CLOCK BAR */}
      <div className="relative w-full flex justify-center items-center mb-6">
         <div className="flex justify-center w-full bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800">
            <GraphicalWorldClock />
         </div>
         <div className="absolute top-4 right-6 z-10 hidden md:block">
            <Logo className="h-10 w-auto text-slate-700 dark:text-slate-300" variant="mark" />
         </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm gap-4">
         <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Globe className="w-6 h-6 text-[#003d5b] dark:text-blue-400" />
                {t?.title || "Customer Directory"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">Manage client relationships and regions</p>
         </div>

         <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
             
             <div className="relative flex-grow md:w-64 group">
                 <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                 <input 
                   type="text" 
                   placeholder={t?.search || "Search clients..."} 
                   className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
             </div>

             <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border dark:border-slate-700">
                 <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600'}`}><Grid className="w-4 h-4" /></button>
                 <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600'}`}><List className="w-4 h-4" /></button>
             </div>

             {/* CALENDAR BUTTON */}
             <button 
                onClick={() => setIsCalendarOpen(true)} 
                className={`px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl font-bold text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 shadow-sm ${isCalendarOpen ? 'bg-blue-50 dark:bg-slate-700 ring-2 ring-blue-500/20' : ''}`}
                title={navT?.calendar || "Calendar"}
             >
                <Calendar className="w-4 h-4" /> <span>{navT?.calendar || "Calendar"}</span>
             </button>

             {/* HUB BUTTON */}
             <button 
                onClick={() => setIsHubOpen(true)} 
                className={`px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl font-bold text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 shadow-sm ${isHubOpen ? 'bg-blue-50 dark:bg-slate-700' : ''}`}
                title={navT?.hub || "Hub"}
             >
                <MessageSquare className="w-4 h-4" /> <span>{navT?.hub || "Hub"}</span>
             </button>

             {!isReadOnly && (
                 <button onClick={onOpenCustomerWizard} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-blue-700 flex items-center gap-2 transition-all active:scale-95 shrink-0">
                    <UserPlus className="w-4 h-4" /> {t?.addCustomer || "Add Customer"}
                 </button>
             )}
         </div>
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c, index) => (
          <div key={c.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${COLORS[index % COLORS.length]}`}>
                    {(c.companyName || '?').charAt(0)}
                </div>
                <button className="p-2 text-slate-300 hover:text-slate-600 dark:hover:text-slate-100"><MoreVertical className="w-5 h-5" /></button>
            </div>
            
            <h4 className="font-bold text-slate-800 dark:text-white text-lg tracking-tight mb-1">{c.companyName}</h4>
            <div className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 mb-4">
                <Globe className="w-3 h-3" /> {c.region}
            </div>
            
            <div className="space-y-2 border-t border-slate-50 dark:border-slate-800 pt-4">
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <Mail className="w-4 h-4" /> {c.email}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <Building2 className="w-4 h-4" /> {c.contactPerson || 'N/A'}
                </div>
            </div>

            <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center mt-4">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Account Active</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">${(c.totalSpend || 0).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* STABLE OVERLAYS */}
      <ConstraintCalendar 
          isOpen={isCalendarOpen} 
          onClose={() => setIsCalendarOpen(false)} 
          lang={lang} 
          customers={customers}
          jobs={jobs}
          shipments={shipments}
          samples={samples}
          products={DEMO_PRODUCTS}
          suppliers={DEMO_SUPPLIERS}
      />

      <ContextualMessageBoard 
          isOpen={isHubOpen} 
          onClose={() => setIsHubOpen(false)} 
          lang={lang}
          customers={customers} 
          suppliers={DEMO_SUPPLIERS}
          currentUser={users[0] ? { id: users[0].id, name: users[0].name, email: users[0].email, role: users[0].role } : undefined}
          jobs={jobs}
          samples={samples}
          shipments={shipments}
          onNavigateToCustomer={(id) => { console.log("Navigate to customer", id); setIsHubOpen(false); }}
          onNavigateToOrder={(id) => { console.log("Navigate to order", id); setIsHubOpen(false); }}
      />

    </div>
  );
};

export default CustomerDirectory;
