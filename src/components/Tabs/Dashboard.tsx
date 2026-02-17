
import React, { useState } from 'react';
import { Product, Language, Factory, Job, TabType } from '../../types';
import { translations } from '../../translations';
import GraphicalWorldClock from '../GraphicalWorldClock';
import { Logo } from '../Logo';
import { CurrencyWidget } from '../Widgets/CurrencyWidget';

// --- ICONS ---
const ActivityIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
);
const PackageIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
);
const TrendingUpIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
);
const ZapIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
);
const GlobeIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const ArrowRightIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
);
const RefreshIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
);

interface Props {
  activeTab: TabType;
  products: Product[];
  factories: Factory[];
  jobs: Job[];
  lang: Language;
  onSelectProduct: (id: string) => void;
  onViewCatalog: () => void;
  onMasterSave: () => void;
  onSave: (product: Product) => void;
  onViewLogistics?: () => void;
  systemVersion?: string;
}

const Dashboard: React.FC<Props> = ({ products, jobs, lang, onSelectProduct, onViewCatalog, onMasterSave, onViewLogistics }) => {
  const t = translations[lang] || translations['en'];
  const d = t.dashboard;
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeJobs = jobs.filter(j => j.status !== 'Delivered' && j.status !== 'Inquiry').length;
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => { setIsRefreshing(false); onMasterSave(); }, 1500);
  };

  const KpiCard = ({ label, value, subValue, icon, colorBg, colorText }: any) => (
    <div className="bg-white dark:bg-slate-900 shadow-xl dark:shadow-none rounded-[2rem] p-6 flex flex-col justify-between group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-start mb-4">
             <div className={`p-3 rounded-2xl ${colorBg} ${colorText} transition-transform group-hover:scale-110 duration-300`}>{icon}</div>
             <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${colorBg} ${colorText}`}>{subValue}</span>
        </div>
        <div>
            <h3 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tighter mb-1">{value}</h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
        </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 min-h-screen p-2">
      {/* GLOBAL CLOCK BAR */}
      <div className="relative w-full flex justify-center items-center mb-4">
         {/* UPDATED: Changed dark:bg-slate-800 to dark:bg-slate-900 and dark:border-slate-700 to dark:border-slate-800 */}
         <div className="flex justify-center w-full bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800">
            <GraphicalWorldClock />
         </div>
         <div className="absolute top-4 right-6 z-10 hidden md:block"><Logo className="h-10 w-auto text-slate-700 dark:text-slate-300" variant="mark" /></div>
      </div>

      <div className="flex justify-between items-end px-2">
         <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{d.title}</h2>
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest">{d.subtitle}</p>
         </div>
         <button onClick={handleRefresh} className="h-10 px-5 bg-slate-900 dark:bg-blue-600 text-white font-bold rounded-2xl text-xs shadow-xl flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-blue-500 transition-all">
            <RefreshIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Syncing...' : 'Refresh Pulse'}
         </button>
      </div>

      {/* KPI SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard label={d.activeJobs} value={activeJobs} subValue="+12%" icon={<ActivityIcon className="w-6 h-6" />} colorBg="bg-emerald-50 dark:bg-emerald-950/30" colorText="text-emerald-600 dark:text-emerald-400" />
          <KpiCard label={d.globalSkus} value={products.length} subValue="Stable" icon={<PackageIcon className="w-6 h-6" />} colorBg="bg-blue-50 dark:bg-blue-950/30" colorText="text-blue-600 dark:text-blue-400" />
          <KpiCard label={d.inventoryVal} value="$2.4M" subValue="WIP" icon={<TrendingUpIcon className="w-6 h-6" />} colorBg="bg-amber-50 dark:bg-amber-950/30" colorText="text-amber-600 dark:text-amber-400" />
          <KpiCard label={d.supplierHealth} value="98%" subValue="A+" icon={<ZapIcon className="w-6 h-6" />} colorBg="bg-purple-50 dark:bg-purple-950/30" colorText="text-purple-600 dark:text-purple-400" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
          {/* PRODUCTION QUEUE / RECENT ACTIVITY SECTION */}
          <div className="lg:w-[60%] bg-white dark:bg-slate-900 shadow-xl dark:shadow-none rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-900 dark:text-slate-100"><ActivityIcon className="w-6 h-6" /></div>
                      <h3 className="font-bold text-xl text-slate-800 dark:text-white tracking-tight">{d.recentActivity}</h3>
                  </div>
                  <button onClick={onViewCatalog} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">View All <ArrowRightIcon className="w-3 h-3" /></button>
              </div>
              <div className="space-y-4">
                  {products.slice(0, 3).map((p) => (
                      <div key={p.id} onClick={() => onSelectProduct(p.id)} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border dark:border-slate-700">
                                  {p.image ? <img src={p.image} className="w-full h-full object-cover" alt={p.name} /> : <PackageIcon className="w-6 h-6 text-slate-400 dark:text-slate-600" />}
                              </div>
                              <div>
                                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">{p.name}</h4>
                                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{p.brand} • {p.category}</p>
                              </div>
                          </div>
                          <ArrowRightIcon className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-[#003d5b] dark:group-hover:text-blue-400 transition-colors" />
                      </div>
                  ))}
              </div>
          </div>

          <div className="flex-1 flex flex-col gap-6">
              {/* FIXED HEIGHT CONVERTER WIDGET */}
              <div className="h-[320px] shrink-0">
                  <CurrencyWidget />
              </div>
              
              {/* COMPRESSED LOGISTICS CONTROL CARD */}
              <div className="flex-1 min-h-[220px] bg-[#003d5b] dark:bg-blue-600 rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10 flex flex-col h-full justify-between">
                      <div>
                          <GlobeIcon className="w-8 h-8 mb-3 text-sky-300" />
                          <h3 className="text-xl font-bold mb-2">Logistics Control</h3>
                          <p className="text-sm text-sky-100 mb-4 opacity-90 leading-relaxed">Monitor global shipments and port congestion in real-time.</p>
                      </div>
                      <button onClick={onViewLogistics} className="w-full py-3 bg-white text-[#003d5b] font-bold rounded-xl text-xs hover:bg-sky-50 transition-all shadow-lg active:scale-[0.98]">
                          Open Logistics Tower
                      </button>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;