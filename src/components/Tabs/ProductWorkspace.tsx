
import React, { useState, useMemo, useEffect } from 'react';
import { Product, Language, Customer, Factory, SampleRequest, UserRole } from '../../types';
import { translations } from '../../translations';

// Sub-components
import ProductionSpecs from './ProductionSpecs';
import CostCalculator from './CostCalculator';
import TariffRates from './TariffRates';
import CompetitorAnalysis from './CompetitorAnalysis';
import LaunchTimeline from './LaunchTimeline';
import AIStrategy from './AIStrategy';
import ExchangeRateView from './ExchangeRateView';
import HSLookup from './HSLookup';
import SCMAIStrategist from '../SCMAIStrategist';
import PrintWizard from '../PrintWizard';

// Wizards
import NewProductWizard from './NewProductWizard';
import NewSampleWizard from './NewSampleWizard';
import { Printer, Search, ArrowLeft, Box as CubeIcon, FileText, DollarSign, Globe, Download, Sparkles, Plus, FlaskConical as BeakerIcon, Brain, Wrench as ToolIcon } from 'lucide-react';

interface Props {
  products: Product[];
  customers: Customer[];
  factories: Factory[];
  lang: Language;
  onSave: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onSaveSample: (sample: SampleRequest) => void;
  isReadOnly?: boolean;
  initialSelectedId?: string | null; 
  onSelectProduct?: (id: string | null) => void;
  globalTariffs?: Record<string, number>;
  lockedTariffs?: string[]; 
  onUpdateGlobalTariff?: (country: string, rate: string | number) => void;
  userRole?: UserRole | string;
}

const ProductWorkspace: React.FC<Props> = ({ 
  products = [], 
  customers = [],
  factories = [],
  lang, 
  onSave, 
  onAddProduct,
  onSaveSample,
  isReadOnly,
  initialSelectedId,
  onSelectProduct,
  globalTariffs,
  lockedTariffs = [],
  onUpdateGlobalTariff,
  userRole: propUserRole
}) => {
  const rootT = translations[lang] || translations['en'];
  const t = rootT.workspace || { tabs: { specs: 'Specs', costing: 'Costing', tariffs: 'Tariffs', exchange: 'FX', competitors: 'Intel', timeline: 'Plan', ai: 'AI' } };

  const userRole = propUserRole || localStorage.getItem('userRole') || 'viewer';
  const canModify = userRole === 'admin' || userRole === 'super_admin' || userRole === 'editor';
  const canSeeFinancials = userRole === 'admin' || userRole === 'super_admin';
  const effectiveReadOnly = isReadOnly || !canModify;

  // 1. STATE
  const [viewMode, setViewMode] = useState<'ops' | 'strat'>('ops');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('specs');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showProductWizard, setShowProductWizard] = useState(false);
  const [showSampleWizard, setShowSampleWizard] = useState(false);
  const [showPrintWizard, setShowPrintWizard] = useState(false);

  // --- STATE SYNCHRONIZATION ---
  useEffect(() => {
    if (selectedProduct) {
        const fresh = products.find(p => p.id === selectedProduct.id);
        if (fresh && fresh !== selectedProduct) {
            setSelectedProduct(fresh);
        }
    }
  }, [products]);

  // Handle external selection (e.g. from Dashboard URL)
  useEffect(() => {
    if (initialSelectedId) {
      const p = products.find(prod => prod.id === initialSelectedId);
      if (p) setSelectedProduct(p);
    }
  }, [initialSelectedId, products]);

  // 2. DATA: Tab Groups
  const opsTabs = useMemo(() => [
    { id: 'specs', label: t.tabs?.specs || "Specs", icon: FileText, restricted: false }, 
    { id: 'costing', label: t.tabs?.costing || "Costing", icon: DollarSign, restricted: true }, 
    { id: 'tariffs', label: t.tabs?.tariffs || "Tariffs", icon: Search, restricted: true }, 
    { id: 'hs_lookup', label: "HS Lookup", icon: Globe, restricted: false },
    { id: 'exchange', label: t.tabs?.exchange || "Exchange", icon: Globe, restricted: false },
    { id: 'timeline', label: t.tabs?.timeline || "Timeline", icon: Search, restricted: false },
  ], [t]);

  const stratTabs = useMemo(() => [
    { id: 'scm_ai', label: "SCM AI Strategist", icon: Sparkles, restricted: false },
    { id: 'competitor_analysis', label: t.tabs?.competitors || "Competitor Analysis", icon: CubeIcon, restricted: false },
    { id: 'ai', label: t.tabs?.ai || "AI Strategy", icon: Brain, restricted: false },
  ], [t]);

  // 3. LOGIC: Filter Tabs
  const visibleTabs = useMemo(() => {
    const currentSet = viewMode === 'ops' ? opsTabs : stratTabs;
    return currentSet.filter(tab => !tab.restricted || canSeeFinancials);
  }, [viewMode, opsTabs, stratTabs, canSeeFinancials]);

  // Handle Mode Switch
  const handleModeSwitch = (mode: 'ops' | 'strat') => {
    setViewMode(mode);
    const newSet = mode === 'ops' ? opsTabs : stratTabs;
    const firstValid = newSet.find(tab => !tab.restricted || canSeeFinancials);
    if (firstValid) setActiveTab(firstValid.id);
  };

  // Safety Redirect
  useEffect(() => {
    if (!canSeeFinancials && (activeTab === 'costing' || activeTab === 'tariffs')) {
        setActiveTab('specs');
    }
  }, [canSeeFinancials, activeTab]);

  const handleBackToExplorer = () => {
    setSelectedProduct(null);
    if (onSelectProduct) onSelectProduct(null);
  };

  const handleSelectLocal = (p: Product) => {
    setSelectedProduct(p);
    if (onSelectProduct) onSelectProduct(p.id);
  };

  const filtered = useMemo(() => {
    return (products || []).filter(p => 
      (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const getProductCost = (p: Product) => {
    if (!p.costVariables) return 0;
    return Object.values(p.costVariables).reduce((acc: number, val: any) => acc + (Number(val) || 0), 0);
  };

  const handleExportCSV = () => {
    if (!selectedProduct) return;
    const p = selectedProduct;
    const cost = canSeeFinancials ? getProductCost(p).toFixed(2) : "RESTRICTED"; 
    const headers = "ID,Name,Brand,Category,Status,HSCode,MOQ,EstimatedCost,Material,Dimensions";
    const dims = `${p.dimensions?.lengthCm || 0}x${p.dimensions?.widthCm || 0}x${p.dimensions?.heightCm || 0}cm (${p.dimensions?.weightKg || 0}kg)`;
    const row = `"${p.id}","${p.name}","${p.brand}","${p.category}","${p.status}","${p.hsCode}","${p.moq}","${cost}","${p.material}","${dims}"`;
    const blob = new Blob([`${headers}\n${row}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `usuppli-workspace-${p.id}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleProductCreate = (product: Product) => {
    if (onAddProduct) {
        onAddProduct(product);
        setShowProductWizard(false);
        handleSelectLocal(product);
    }
  };

  const handleSampleCreate = (sample: SampleRequest) => {
    if (onSaveSample) {
        onSaveSample(sample);
        setShowSampleWizard(false);
    }
  };

  const handleAddCompetitor = (newCompetitor: any) => {
    if(!selectedProduct) return;
    const updatedProduct = { 
        ...selectedProduct, 
        competitors: [...(selectedProduct.competitors || []), newCompetitor] 
    };
    onSave(updatedProduct);
  };

  if (selectedProduct) {
    return (
      <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in h-full pb-10">
        
        {/* LEFT SIDEBAR - Sticky */}
        <div className="lg:w-80 shrink-0 flex flex-col gap-6 sticky top-6 self-start h-fit">
           
           {/* Product Passport Card */}
           <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden group">
              <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-950 relative border-b border-slate-100 dark:border-slate-800">
                  {selectedProduct.image ? (
                    <img src={selectedProduct.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={selectedProduct.name} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <CubeIcon className="w-16 h-16 text-slate-200 dark:text-slate-800" />
                    </div>
                  )}
                  
                  {/* Floating Sample Button */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <button 
                        onClick={() => setShowSampleWizard(true)}
                        className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg hover:scale-110 transition-transform text-[#003d5b] dark:text-blue-400 border border-white/20"
                        title="Request Sample"
                      >
                          <BeakerIcon className="w-5 h-5" />
                      </button>
                  </div>
              </div>

              <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                      <button onClick={handleBackToExplorer} className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-[#003d5b] dark:hover:bg-blue-600 hover:text-white rounded-xl transition-all group-active:scale-95">
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg uppercase tracking-wider">
                        {selectedProduct.id}
                      </span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-tight mb-1">{selectedProduct.name}</h2>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{selectedProduct.brand}</p>
                  
                  <div className="mt-5 pt-5 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Status</span>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        selectedProduct.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                        selectedProduct.status === 'Development' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {selectedProduct.status || 'Draft'}
                      </span>
                  </div>
              </div>
           </div>
           
           {/* Quick Stats Grid */}
           <div className="grid grid-cols-2 gap-4">
              {canSeeFinancials && (
                <div className="bg-[#003d5b] dark:bg-blue-600 p-5 rounded-[2rem] text-white shadow-lg shadow-[#003d5b]/20 dark:shadow-none flex flex-col justify-between min-h-[100px]">
                    <p className="text-[9px] font-bold uppercase opacity-60">Est. Cost</p>
                    <p className="text-lg font-bold tracking-tight">${getProductCost(selectedProduct).toFixed(2)}</p>
                </div>
              )}
              <div className={`bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex flex-col justify-between min-h-[100px] ${!canSeeFinancials ? 'col-span-2' : ''}`}>
                  <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">HS Code</p>
                  <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 truncate" title={selectedProduct.hsCode}>
                    {selectedProduct.hsCode || '---'}
                  </p>
              </div>
           </div>
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Bar */}
          <div className="bg-white dark:bg-slate-900 p-2 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl shrink-0">
                  <button 
                    onClick={() => handleModeSwitch('ops')} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'ops' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                  >
                      <ToolIcon className="w-4 h-4" /> Ops
                  </button>
                  <button 
                    onClick={() => handleModeSwitch('strat')} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'strat' ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                  >
                      <Sparkles className="w-4 h-4" /> Strategy
                  </button>
              </div>

              <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

              <div className="flex gap-1 overflow-x-auto no-scrollbar flex-1 w-full sm:w-auto justify-center sm:justify-start">
                  {visibleTabs.map((tab) => (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                          <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                      </button>
                  ))}
              </div>
              
              <div className="flex items-center gap-2 pr-2">
                  <button onClick={() => setShowPrintWizard(true)} className="p-2 text-slate-400 hover:text-[#003d5b] dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all" title="Print Spec">
                      <Printer className="w-4 h-4" />
                  </button>
                  <button onClick={handleExportCSV} className="p-2 text-slate-400 hover:text-[#003d5b] dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all" title="Download CSV">
                      <Download className="w-4 h-4" />
                  </button>
              </div>
          </div>
          
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm p-8 min-h-[600px]">
              {activeTab === 'specs' && <ProductionSpecs product={selectedProduct} lang={lang} onSave={onSave} isReadOnly={effectiveReadOnly} />}
              {canSeeFinancials && activeTab === 'costing' && <CostCalculator product={selectedProduct} lang={lang} onSave={onSave} isReadOnly={effectiveReadOnly} />}
              {canSeeFinancials && activeTab === 'tariffs' && <TariffRates product={selectedProduct} lang={lang} onSave={onSave} isReadOnly={effectiveReadOnly} globalTariffs={globalTariffs} lockedTariffs={lockedTariffs} />}
              {/* Added missing lang prop to HSLookup */}
              {activeTab === 'hs_lookup' && <HSLookup product={selectedProduct} lang={lang} onSave={onSave} onUpdateGlobalTariff={onUpdateGlobalTariff} />}
              {activeTab === 'scm_ai' && <SCMAIStrategist lang={lang} />}
              {activeTab === 'competitor_analysis' && <CompetitorAnalysis product={selectedProduct} lang={lang} onAddCompetitor={handleAddCompetitor} onSave={onSave} isReadOnly={effectiveReadOnly} />}
              {activeTab === 'exchange' && <ExchangeRateView />}
              {activeTab === 'timeline' && <LaunchTimeline product={selectedProduct} lang={lang} onSave={onSave} isReadOnly={effectiveReadOnly} />}
              {/* Removed unnecessary product prop from AIStrategy */}
              {activeTab === 'ai' && <AIStrategy lang={lang} />}
          </div>
        </div>

        {showSampleWizard && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                <NewSampleWizard products={[selectedProduct]} customers={customers || []} factories={factories || []} lang={lang} onComplete={(sample) => { handleSampleCreate(sample); setShowSampleWizard(false); }} onCancel={() => setShowSampleWizard(false)} />
            </div>
        )}

        {showPrintWizard && <PrintWizard mode="product" product={selectedProduct} onClose={() => setShowPrintWizard(false)} />}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <CubeIcon className="w-7 h-7 text-[#003d5b] dark:text-blue-500" /> Product Workspace
        </h2>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64 group">
                <Search className="absolute right-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-[#003d5b] dark:group-focus-within:text-blue-400 transition-colors" />
                <input className="w-full pl-4 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#003d5b]/10 transition-all dark:text-slate-100" placeholder="Search Workspace..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            
            {canModify && (
                <button onClick={() => setShowProductWizard(true)} className="px-4 py-2.5 bg-[#003d5b] dark:bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-sky-900 dark:hover:bg-blue-500 flex items-center gap-2 shrink-0 transition-all active:scale-95">
                    <Plus className="w-4 h-4" /> <span>New Product</span>
                </button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {filtered.map(p => (
          <div key={p.id} onClick={() => handleSelectLocal(p)} className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-200 dark:border-slate-700 hover:shadow-xl dark:hover:bg-slate-800/80 cursor-pointer transition-all group flex flex-col relative overflow-hidden">
            
            {/* HOVER OVERLAY: Est Price / HS Code */}
            <div className="absolute inset-0 bg-[#003d5b]/90 dark:bg-slate-900/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-center p-4 z-20">
                {canSeeFinancials && (
                    <div className="mb-3 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                        <p className="text-[9px] font-bold text-sky-200 uppercase tracking-widest mb-0.5">Est. Cost</p>
                        <p className="text-2xl font-black text-white tracking-tight">${getProductCost(p).toFixed(2)}</p>
                    </div>
                )}
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                    <p className="text-[9px] font-bold text-sky-200 uppercase tracking-widest mb-0.5">HS Code</p>
                    <p className="text-xs font-mono font-bold text-white bg-white/10 px-2 py-1 rounded border border-white/10">{p.hsCode || '---'}</p>
                </div>
            </div>
            {/* END OVERLAY */}

            <div className="aspect-square bg-slate-50 dark:bg-slate-950 rounded-2xl mb-4 overflow-hidden border dark:border-slate-800 relative z-10">
              {p.image ? <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <div className="absolute inset-0 flex items-center justify-center"><CubeIcon className="w-12 h-12 text-slate-200 dark:text-slate-800" /></div>}
            </div>
            <h4 className="font-bold text-slate-800 dark:text-white text-lg leading-tight mb-1 relative z-10">{p.name}</h4>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest relative z-10">{p.brand}</p>
            <div className="mt-auto pt-4 flex justify-between items-center relative z-10">
               <span className="text-[10px] bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 px-2 py-0.5 rounded-full font-bold uppercase">{p.category}</span>
               <span className="text-sky-600 dark:text-blue-400 font-bold text-xs group-hover:translate-x-1 transition-transform">Enter &rarr;</span>
            </div>
          </div>
        ))}
      </div>

      {showProductWizard && (
            <NewProductWizard lang={lang} factories={factories || []} customers={customers || []} onComplete={handleProductCreate} onCancel={() => setShowProductWizard(false)} />
      )}
    </div>
  );
};

export default ProductWorkspace;
