
import React, { useState, useEffect, useMemo } from 'react';
import { Job, Product, Customer, Language } from '../../types';
import { translations } from '../../translations';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- SAFE ICONS ---
const SensorIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>);
const AlertIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>);
const SearchIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const GridIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 v2a2 2 0 01-2 h-2a2 2 0 01-2-2v-2z" /></svg>);
const ListIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>);
const DownloadIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>);

interface Props {
  jobs: Job[];
  products?: Product[];
  customers?: Customer[];
  lang: Language;
}

const ProductionFloor: React.FC<Props> = ({ jobs = [], lang }) => {
  // Safe Translation Access
  const rootT = translations[lang] || translations['en'];
  const t = rootT.shopFloor;
  const commonT = rootT.common;

  const userRole = localStorage.getItem('userRole') || 'viewer';
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';

  const [isConnected, setIsConnected] = useState(false);
  const [activeMachine] = useState<string>('Line A');
  const [telemetryData, setTelemetryData] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(() => {
      setTelemetryData(prev => {
        const now = new Date();
        const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        const newData = {
          time,
          efficiency: 85 + Math.random() * 10,
          temperature: 60 + Math.random() * 5,
          output: Math.floor(Math.random() * 20) + 100
        };
        const newArr = [...prev, newData];
        if (newArr.length > 20) newArr.shift();
        return newArr;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isConnected]);

  useEffect(() => {
    const initData = Array.from({ length: 10 }).map((_, i) => ({
      time: `10:${30 + i}`,
      efficiency: 88,
      temperature: 62,
      output: 110
    }));
    setTelemetryData(initData);
  }, []);

  const activeJob = jobs.find(j => j.status === 'Production') || jobs[0];

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => 
        (j.jobName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (j.id || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  const handleExportCSV = () => {
    if (filteredJobs.length === 0) return;
    const headers = "ID,JobName,Status,ProductionStage,Completion,DeliveryDate";
    const rows = filteredJobs.map(j => 
      `"${j.id}","${j.jobName}","${j.status}","${j.productionStage}","${j.completionPercent}%","${j.deliveryDate || j.targetDelivery}"`
    ).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `usuppli-shopfloor-queue-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER: COMMAND CENTER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-800">
          <div>
            <div className="flex items-center gap-4 mb-2">
                <div className={`w-3.5 h-3.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'}`}></div>
                <h3 className="text-3xl font-black tracking-tight">{t?.title || "Shop Floor Telemetry"}</h3>
            </div>
            <p className="text-slate-400 text-xs font-mono uppercase tracking-[0.2em]">
                {isConnected ? `Connected: ${activeMachine} • Node_ID: US-SCM-A4` : 'Station Standby • Awaiting Signal'}
            </p>
          </div>
          
          <div className="flex gap-6 mt-6 md:mt-0">
              <div className="text-right hidden md:block border-r border-slate-800 pr-8">
                  <span className="block text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Active Stream</span>
                  <span className="block text-xl font-mono font-bold text-emerald-400">{activeJob?.id || 'NO_SIGNAL'}</span>
              </div>
              <button 
                onClick={() => setIsConnected(!isConnected)}
                className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
                    isConnected 
                    ? 'bg-red-600/10 text-red-500 border border-red-600/30 hover:bg-red-600 hover:text-white shadow-red-950/20' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-950/40'
                }`}
              >
                  {isConnected ? 'Kill Connection' : (t?.refresh || 'Sync Line Status')}
              </button>
          </div>
      </div>

      {/* TELEMETRY DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                  <h4 className="text-white font-black text-sm uppercase tracking-[0.2em] flex items-center gap-3">
                      <SensorIcon className="w-5 h-5 text-blue-400" />
                      Live Efficiency Matrix
                  </h4>
                  <div className="flex gap-3 text-[10px] text-slate-400 font-black font-mono">
                      <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">OEE: 87.4%</span>
                      <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-blue-400">TARGET: 92%</span>
                  </div>
              </div>
              <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={telemetryData}>
                          <defs>
                              <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                          <XAxis dataKey="time" tick={{fontSize: 10, fill: '#475569', fontWeight: 700}} axisLine={false} tickLine={false} />
                          <YAxis domain={[60, 100]} tick={{fontSize: 10, fill: '#475569', fontWeight: 700}} axisLine={false} tickLine={false} />
                          <Tooltip 
                            contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', color: '#fff', fontWeight: 800, fontSize: '12px'}} 
                            cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                          />
                          <Area type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorEff)" isAnimationActive={false} />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
          </div>

          <div className="space-y-6">
              <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
                  <h4 className="text-slate-500 text-[10px] font-black uppercase mb-6 tracking-[0.2em]">Environmental Sensors</h4>
                  <div className="space-y-6">
                      {['Core Temperature', 'Vibration (Axis Z)', 'Power Utilization'].map((label, idx) => (
                          <div key={label}>
                              <div className="flex justify-between text-xs text-slate-300 font-bold mb-2 uppercase tracking-wide">
                                  <span>{label}</span>
                                  <span className="font-mono text-emerald-400">{idx === 0 ? '62.4°C' : idx === 1 ? '1.2 Hz' : '45.2 kW'}</span>
                              </div>
                              <div className="w-full bg-slate-800 rounded-full h-2">
                                  <div className={`h-2 rounded-full transition-all duration-1000 ${idx === 2 ? 'bg-blue-500' : 'bg-emerald-500'}`} style={{width: idx === 0 ? '64%' : idx === 1 ? '18%' : '79%'}}></div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
                  <h4 className="text-slate-500 text-[10px] font-black uppercase mb-6 tracking-[0.2em]">Diagnostic Alerts</h4>
                  <div className="space-y-3">
                      <div className="flex items-start gap-4 p-4 bg-red-600/10 border border-red-600/30 rounded-2xl animate-pulse">
                          <AlertIcon className="w-6 h-6 text-red-500 mt-0.5" />
                          <div>
                              <p className="text-red-400 font-black text-xs uppercase tracking-tight">Pressure Anomaly</p>
                              <p className="text-red-500/60 text-[10px] font-bold mt-0.5">Station 4 // Sector G</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* PRODUCTION QUEUE STATUS SECTION */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm gap-4">
        <div>
           <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Production Queue Status</h3>
           <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">Live factory throughput tracking</p>
        </div>

        <div className="flex items-center gap-3 w-full xl:w-auto">
          <div className="relative flex-grow md:w-72 group">
            <SearchIcon className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
            <input 
                className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600" 
                placeholder={commonT?.search || "Search Active Jobs..."} 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border dark:border-slate-700">
            <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-lg text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600'}`}><GridIcon className="w-5 h-5" /></button>
            <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-lg text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600'}`}><ListIcon className="w-5 h-5" /></button>
          </div>
          
          {isAdmin && (
            <button 
                onClick={handleExportCSV} 
                className="px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 shadow-sm"
            >
                <DownloadIcon className="w-4 h-4" /> <span>{commonT?.export || "Export CSV"}</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW: GRID */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJobs.map(j => (
            <div key={j.id} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-1 group">
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-xl tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{j.jobName}</h4>
                    <span className="text-[10px] font-mono font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1 block">{j.id}</span>
                 </div>
                 <span className="text-xs font-black bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-900/50">{j.completionPercent || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                 <div className="bg-blue-600 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.5)]" style={{ width: `${j.completionPercent || 0}%` }}></div>
              </div>
              <div className="mt-6 flex justify-between items-center">
                 <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{j.productionStage || 'In_Queue'}</p>
                 <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700">{j.deliveryDate || j.targetDelivery}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* VIEW: LIST */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[2.5rem] shadow-sm overflow-hidden border-separate">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] font-black uppercase text-slate-500 dark:text-slate-500 tracking-[0.2em] border-b dark:border-slate-800">
              <tr>
                <th className="p-6">Job Identity</th>
                <th className="p-6">Phase Status</th>
                <th className="p-6">Throughput</th>
                <th className="p-6 text-center">Batch Flow</th>
                <th className="p-6 text-right">Commitment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredJobs.map(job => (
                <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer">
                  <td className="p-6 font-bold">
                      <div className="text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{job.jobName}</div>
                      <div className="text-[10px] font-mono font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-1">{job.id}</div>
                  </td>
                  <td className="p-6">
                      <span className="px-3 py-1.5 bg-blue-100/50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-200 dark:border-blue-900">{job.productionStage || 'Queued'}</span>
                  </td>
                  <td className="p-6">
                     <div className="flex items-center gap-4">
                        <div className="w-32 bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden shadow-inner"><div className="bg-blue-600 h-full shadow-[0_0_8px_rgba(37,99,235,0.4)]" style={{ width: `${job.completionPercent || 0}%` }}></div></div>
                        <span className="text-xs font-black text-slate-900 dark:text-slate-300">{job.completionPercent || 0}%</span>
                     </div>
                  </td>
                  <td className="p-6 text-center font-mono font-black text-slate-400 dark:text-slate-600">120 u/hr</td>
                  <td className="p-6 text-right text-slate-500 dark:text-slate-400 font-mono font-bold">{job.deliveryDate || job.targetDelivery}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductionFloor;