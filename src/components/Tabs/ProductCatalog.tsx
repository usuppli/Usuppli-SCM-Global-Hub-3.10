
import React, { useState, useMemo, useEffect } from 'react';
import { Product, Language, UserRole } from '../../types';
import { translations } from '../../translations';
import GraphicalWorldClock from '../GraphicalWorldClock';
import { Logo } from '../Logo';
import { TOP_30_CATEGORIES } from './constants';

// --- SAFE ICONS ---
const SearchIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const PlusIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>);
const DownloadIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>);
const FilterIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>);
const CubeIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>);

interface Props {
  products: Product[];
  lang: Language;
  onAddProduct: () => void;
  onUpdateProduct: (product: Product) => void;
  userRole: UserRole;
  onOpenWorkspace: (id: string) => void;
}

const ProductCatalog: React.FC<Props> = ({ 
  products, 
  lang, 
  onAddProduct, 
  onUpdateProduct, 
  userRole, 
  onOpenWorkspace 
}) => {
  const rootT = translations[lang] || translations['en'];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const isAdmin = userRole === 'admin' || userRole === 'super_admin';
  const isReadOnly = userRole === 'viewer';

  const BACKGROUND_IMAGES = [
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605218427368-35b81a3dd695?q=80&w=2070&auto=format&fit=crop"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (p.brand || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleExportCSV = () => {
    if (filteredProducts.length === 0) return;
    const headers = "ID,Name,Brand,Category,Status,HSCode,MOQ,Cost";
    const rows = filteredProducts.map(p => 
      `"${p.id}","${p.name}","${p.brand}","${p.category}","${p.status}","${p.hsCode}","${p.moq}","${p.costVariables?.materials || 0}"`
    ).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `usuppli-catalog-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
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
          <h2 className="text-3xl font-black text-white tracking-tight">{rootT.nav.productCatalog}</h2>
          <p className="text-slate-300 text-sm font-bold uppercase tracking-widest mt-1">{rootT.catalog.subtitle}</p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm gap-4">
         <div className="flex items-center gap-3">
             <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400">
                 <FilterIcon className="w-5 h-5" />
             </div>
             <select 
                className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
             >
                 <option value="All" className="dark:bg-slate-900">All Categories</option>
                 {TOP_30_CATEGORIES.map(c => <option key={c} value={c} className="dark:bg-slate-900">{c}</option>)}
             </select>
         </div>

         <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
             <div className="relative flex-grow md:w-64 group">
                 <SearchIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Search catalog..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
             </div>

             {/* ROLE SECURITY: Only Admins can Export */}
             {isAdmin && (
                <button 
                    onClick={handleExportCSV} 
                    className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 shadow-sm"
                >
                    <DownloadIcon className="w-4 h-4" /> <span>Export CSV</span>
                </button>
             )}

             {!isReadOnly && (
                 <button onClick={onAddProduct} className="px-4 py-2.5 bg-[#003d5b] dark:bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-sky-900 dark:hover:bg-blue-500 shadow-lg flex items-center gap-2 transition-all active:scale-95 shrink-0">
                    <PlusIcon className="w-4 h-4" /> <span>{rootT.nav.newProduct}</span>
                 </button>
             )}
         </div>
      </div>

      {/* CONTENT AREA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(p => (
              <div 
                key={p.id} 
                onClick={() => onOpenWorkspace(p.id)}
                className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl dark:hover:bg-slate-800/80 transition-all cursor-pointer group flex flex-col"
              >
                  <div className="aspect-square bg-slate-50 dark:bg-slate-950 rounded-2xl mb-4 overflow-hidden border border-slate-100 dark:border-slate-800 relative">
                      {p.image ? (
                          <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-700">
                              <CubeIcon className="w-12 h-12" />
                          </div>
                      )}
                      <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 shadow-sm border border-slate-100 dark:border-slate-800">
                          {p.category}
                      </div>
                  </div>
                  
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{p.name}</h3>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">{p.brand}</p>
                  
                  <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                          p.status === 'Production' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900' : 
                          'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                      }`}>
                          {p.status}
                      </span>
                      {isAdmin && (
                          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                              ${(p.costVariables?.materials || 0).toFixed(2)}
                          </span>
                      )}
                  </div>
              </div>
          ))}
          
          {filteredProducts.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-20 text-slate-400 dark:text-slate-600">
                  <CubeIcon className="w-16 h-16 mb-4 opacity-50" />
                  <p className="font-bold">No products found matching your search.</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default ProductCatalog;
