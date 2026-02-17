import React, { useEffect, useState } from 'react';
import { 
  X, 
  Download, 
  Mail, 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  FileText, 
  AlertCircle 
} from 'lucide-react';
import { Supplier, SupplierMetric } from '../types';

interface ScorecardProps {
  supplier: Supplier;
  isOpen: boolean;
  onClose: () => void;
  viewMode?: 'admin' | 'customer';
}

// Helper to render the correct icon
const getIcon = (label: string) => {
  if (label.includes('Quality')) return Award;
  if (label.includes('Delivery') || label.includes('Time')) return Clock;
  if (label.includes('Cost') || label.includes('Price')) return DollarSign;
  if (label.includes('Compliance') || label.includes('Audit')) return ShieldCheck;
  return FileText;
};

const MetricItem: React.FC<{ metric: SupplierMetric }> = ({ metric }) => {
  const Icon = getIcon(metric.label);
  const isDeclining = metric.trend === 'down';
  const isImproving = metric.trend === 'up';

  return (
    <div className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all duration-300 group">
      <div className={`p-3 rounded-xl transition-colors ${
        metric.score >= 90 ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : 
        metric.score >= 75 ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' : 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'
      }`}>
        <Icon className="w-6 h-6" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{metric.label}</p>
          <span className={`flex items-center text-[10px] font-black uppercase ${
            isImproving ? 'text-emerald-500' : isDeclining ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'
          }`}>
            {isImproving && <TrendingUp className="w-3 h-3 mr-1" />}
            {isDeclining && <TrendingDown className="w-3 h-3 mr-1" />}
            {metric.trend}
          </span>
        </div>
        <p className="text-xl font-black text-slate-800 dark:text-white tracking-tight">{metric.value}</p>
        
        {/* Progress Bar */}
        <div className="mt-3 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              metric.score >= 90 ? 'bg-emerald-500' : 
              metric.score >= 75 ? 'bg-blue-500' : 'bg-red-500'
            }`}
            style={{ width: `${metric.score}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export const SupplierScorecard = ({ supplier, isOpen, onClose, viewMode = 'admin' }: ScorecardProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setMounted(false), 500);
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!mounted && !isOpen) return null;

  const visibleMetrics = supplier.metrics.filter(m => 
    viewMode === 'admin' ? true : !m.isPrivate
  );

  const gradeColors: Record<string, string> = {
    'A': 'from-emerald-500 to-teal-600 shadow-emerald-200 dark:shadow-emerald-900/20',
    'B': 'from-blue-500 to-indigo-600 shadow-blue-200 dark:shadow-indigo-900/20',
    'C': 'from-amber-400 to-orange-500 shadow-amber-200 dark:shadow-amber-900/20',
    'D': 'from-red-500 to-rose-600 shadow-red-200 dark:shadow-red-900/20'
  };

  return (
    <div className="fixed inset-0 z-[150] flex justify-end overflow-hidden">
      {/* GLASSMORPHISM BACKDROP */}
      <div 
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-500 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* DRAWER PANEL */}
      <div 
        className={`relative w-full max-w-[500px] h-full bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-100 dark:border-slate-700 flex flex-col transform transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* STICKY HEADER */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{supplier.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{supplier.sector}</span>
              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{supplier.country}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          
          {/* HERO GRADE KPI CARD */}
          <section>
            <div className={`relative overflow-hidden rounded-[2.5rem] p-8 text-white bg-gradient-to-br shadow-2xl ${gradeColors[supplier.overallGrade] || gradeColors['B']}`}>
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-2">Overall Quality Grade</p>
                  <h3 className="text-8xl font-black tracking-tighter leading-none">{supplier.overallGrade}</h3>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full mb-4">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Active Scorecard</span>
                  </div>
                  <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Last Audit Date</p>
                  <p className="text-sm font-bold">{supplier.lastAuditDate}</p>
                </div>
              </div>
              
              {/* Background Decoration */}
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
            </div>
          </section>

          {/* METRICS VERTICAL LIST */}
          <section className="space-y-4">
            <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] px-2 mb-4">Performance Metrics</h4>
            <div className="space-y-3">
              {visibleMetrics.map((metric) => (
                <MetricItem key={metric.id} metric={metric} />
              ))}
            </div>
          </section>

          {/* CERTIFICATIONS SECTION */}
          <section className="pt-4">
            <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] px-2 mb-4">Certifications</h4>
            <div className="flex flex-wrap gap-2 px-2">
              {supplier.certifications.map((cert, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{cert}</span>
                </div>
              ))}
            </div>
          </section>

          {/* WARNINGS / ALERTS */}
          {viewMode === 'admin' && supplier.overallGrade === 'D' && (
            <div className="p-5 rounded-[2rem] bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 flex gap-4 animate-in zoom-in-95 duration-300">
              <div className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-200 dark:shadow-none">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-red-900 dark:text-red-400 uppercase tracking-tight">Escalation Required</h4>
                <p className="text-xs text-red-700 dark:text-red-500/80 mt-1 leading-relaxed">
                  Supplier performance has dropped below institutional safety thresholds. A corrective action plan (CAPA) is required immediately.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* STICKY FOOTER ACTIONS */}
        <footer className="sticky bottom-0 z-20 p-6 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm text-sm">
            <Download className="w-4 h-4" />
            PDF Report
          </button>
          <button className="flex items-center justify-center gap-2 py-4 bg-slate-900 dark:bg-blue-600 text-white font-bold rounded-2xl hover:bg-slate-800 dark:hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-slate-200 dark:shadow-none text-sm">
            <Mail className="w-4 h-4" />
            Email Portfolio
          </button>
        </footer>
      </div>
    </div>
  );
};