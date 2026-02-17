
import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Product, Factory, Customer, Language } from '../../types';
import { 
  X, ArrowRight, ArrowLeft, Package, ClipboardList, Layers, 
  Truck, DollarSign, FileText, CheckCircle, Globe, Upload
} from 'lucide-react';

const TOP_40_CATEGORIES = [ 
  "Consumer Electronics", "Apparel & Clothing", "Home & Garden", "Health & Beauty Products", "Automotive Parts & Accessories", 
  "Shoes & Footwear", "Bags, Luggage & Cases", "Jewelry & Watches", "Toys & Games", "Sports & Outdoor Equipment", 
  "Lights & Lighting", "Tools & Hardware", "Pet Supplies", "Office & School Supplies", "Packaging & Printing", 
  "Electrical Equipment & Supplies", "Security & Surveillance", "Home Appliances", "Furniture", "Textiles & Fabrics", 
  "Electronic Components", "Industrial Machinery", "Construction & Building Materials", "Chemicals & Raw Materials", 
  "Food & Beverage Products", "Medical & Healthcare Supplies", "Gifts & Crafts", "Baby & Maternity Products", 
  "Fashion Accessories", "Renewable Energy Products", "Telecommunications Equipment", "Agriculture & Food Processing", 
  "Instruments & Measurement Equipment", "Wedding & Event Supplies", "Cleaning & Hygiene Supplies", "Musical Instruments & Equipment", 
  "Cameras & Photography Equipment", "Vehicles & Transportation", "Material Handling Equipment", "Safety & Protection Equipment" 
];

const STYLES = {
  label: "block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5",
  inputBase: "w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-100 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white dark:focus:bg-slate-900 focus:border-[#003d5b] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#003d5b]/20",
  selectBase: "w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-100 outline-none transition-all duration-200 appearance-none cursor-pointer focus:bg-white dark:focus:bg-slate-900 focus:border-[#003d5b] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#003d5b]/20",
  sectionTitle: "text-lg font-bold text-slate-800 dark:text-white mb-1",
  sectionDesc: "text-xs text-slate-500 dark:text-slate-400 mb-6",
  buttonUpload: "w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 hover:border-[#003d5b] dark:hover:border-blue-500 hover:text-[#003d5b] dark:hover:text-blue-500 hover:bg-sky-50 dark:hover:bg-slate-800 transition-all cursor-pointer group",
  stepDot: (active: boolean, completed: boolean) => 
    `w-2.5 h-2.5 rounded-full transition-all duration-300 ${active ? 'bg-[#003d5b] dark:bg-blue-500 scale-125' : completed ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`
};

interface Props {
  factories: Factory[];
  customers: Customer[];
  lang?: Language;
  onComplete: (product: Product) => void;
  onCancel: () => void;
  isOpen?: boolean;
}

export default function NewProductWizard({ factories, customers, onComplete, onCancel }: Props) {
  const [mode, setMode] = useState<'express' | 'advanced'>('express');
  const [step, setStep] = useState(1);
  
  // File refs for visual simulation
  const techPackRef = useRef<HTMLInputElement>(null);
  const bomRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    id: `PRD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    name: '',
    brand: '',
    category: TOP_40_CATEGORIES[0],
    status: 'Development',
    moq: 500,
    costVariables: { materials: 0, labor: 0, packaging: 0, overhead: 0, logistics: 0, inspection: 0, production: 0, exportInternal: 0, exportExternal: 0, shipping: 0, design: 0 },
    dimensions: { lengthCm: 0, widthCm: 0, heightCm: 0, weightKg: 0 },
    leadTime: '30 Days',
    sourcingCountry: 'China',
    primaryFactoryId: ''
  });

  const totalSteps = mode === 'express' ? 4 : 7;

  const handleChange = (field: keyof Product | string, value: any) => {
    if (field.startsWith('costVariables.')) {
      const key = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        costVariables: { ...prev.costVariables!, [key]: parseFloat(value) || 0 }
      }));
    } else if (field.startsWith('dimensions.')) {
      const key = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        dimensions: { ...prev.dimensions!, [key]: parseFloat(value) || 0 } as any
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handleFinish = () => {
    if (!formData.name) return alert("Product Name is required");
    
    const finalProduct: Product = {
      ...formData as Product,
      image: formData.image || `https://placehold.co/400x400?text=${encodeURIComponent(formData.name || 'Product')}`,
      // Ensure SKUs exist even if not explicitly set in wizard
      skus: formData.skus || [{ 
        code: `${(formData.brand || 'GEN').substring(0,3).toUpperCase()}-${Math.floor(Math.random()*1000)}`, 
        size: 'One Size', 
        prices: { USA: formData.retailPrice || 0 } 
      }]
    };
    onComplete(finalProduct);
  };

  const renderStepContent = () => {
    // --- EXPRESS MODE (4 STEPS) ---
    if (mode === 'express') {
      switch (step) {
        case 1: // Identity
          return (
            <div className="space-y-6 animate-in slide-in-from-right-8 fade-in">
              <div>
                <h3 className={STYLES.sectionTitle}>Express Identity</h3>
                <p className={STYLES.sectionDesc}>Quickly define the core product details.</p>
              </div>
              <div>
                <label className={STYLES.label}>Product Name</label>
                <input className={STYLES.inputBase} placeholder="e.g. Wireless Headphones" value={formData.name} onChange={e => handleChange('name', e.target.value)} autoFocus />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={STYLES.label}>Brand</label>
                  <div className="relative">
                    <input 
                      list="brand-list" 
                      className={STYLES.inputBase} 
                      placeholder="Select or Type..." 
                      value={formData.brand} 
                      onChange={e => handleChange('brand', e.target.value)} 
                    />
                    <datalist id="brand-list">
                      {customers.map(c => <option key={c.id} value={c.companyName} />)}
                    </datalist>
                  </div>
                </div>
                <div>
                  <label className={STYLES.label}>Category</label>
                  <select className={STYLES.selectBase} value={formData.category} onChange={e => handleChange('category', e.target.value)}>
                    {TOP_40_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
            </div>
          );
        case 2: // Sourcing
          return (
            <div className="space-y-6 animate-in slide-in-from-right-8 fade-in">
              <div>
                <h3 className={STYLES.sectionTitle}>Sourcing Strategy</h3>
                <p className={STYLES.sectionDesc}>Assign a manufacturing partner.</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={STYLES.label}>Primary Supplier</label>
                  <select className={STYLES.selectBase} value={formData.primaryFactoryId} onChange={e => handleChange('primaryFactoryId', e.target.value)}>
                    <option value="">Select Factory...</option>
                    {factories.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={STYLES.label}>Origin Country</label>
                  <select className={STYLES.selectBase} value={formData.sourcingCountry} onChange={e => handleChange('sourcingCountry', e.target.value)}>
                    <option>China</option><option>Vietnam</option><option>India</option><option>Turkey</option><option>USA</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className={STYLES.label}>MOQ</label><input type="number" className={STYLES.inputBase} value={formData.moq} onChange={e => handleChange('moq', parseInt(e.target.value))} /></div>
                <div><label className={STYLES.label}>Lead Time</label><input className={STYLES.inputBase} value={formData.leadTime} onChange={e => handleChange('leadTime', e.target.value)} /></div>
              </div>
            </div>
          );
        case 3: // Specs
          return (
            <div className="space-y-6 animate-in slide-in-from-right-8 fade-in">
              <div>
                <h3 className={STYLES.sectionTitle}>Basic Specs</h3>
                <p className={STYLES.sectionDesc}>Essential attributes.</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className={STYLES.label}>SKU Code</label><input className={STYLES.inputBase} placeholder="AUTO-GEN" value={formData.sku} onChange={e => handleChange('sku', e.target.value)} /></div>
                <div><label className={STYLES.label}>HS Code</label><input className={STYLES.inputBase} placeholder="0000.00.00" value={formData.hsCode} onChange={e => handleChange('hsCode', e.target.value)} /></div>
              </div>
              <div><label className={STYLES.label}>Material Composition</label><input className={STYLES.inputBase} placeholder="e.g. 100% Cotton" value={formData.material} onChange={e => handleChange('material', e.target.value)} /></div>
            </div>
          );
        case 4: // Pricing (Express)
          return (
            <div className="space-y-6 animate-in slide-in-from-right-8 fade-in">
              <div>
                <h3 className={STYLES.sectionTitle}>Rough Costing</h3>
                <p className={STYLES.sectionDesc}>Estimated unit economics (Optional).</p>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
                <label className={STYLES.label}>Estimated Factory Cost ($)</label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <input 
                        type="number" 
                        className={`${STYLES.inputBase} pl-10`} 
                        placeholder="0.00"
                        value={formData.costVariables?.materials || ''} 
                        onChange={e => handleChange('costVariables.materials', e.target.value)} 
                    />
                </div>
                <p className="mt-2 text-xs text-slate-400 italic">Retail price is skipped in Express Mode.</p>
              </div>
            </div>
          );
      }
    } 
    // --- ADVANCED MODE (7 STEPS) ---
    else {
      switch (step) {
        case 1: // Concept
          return (
            <div className="space-y-6 animate-in slide-in-from-right-8 fade-in">
              <div className="flex items-center gap-2 mb-2"><ClipboardList className="w-5 h-5 text-indigo-600 dark:text-blue-400" /><h3 className={STYLES.sectionTitle}>Advanced: Concept</h3></div>
              <p className={STYLES.sectionDesc}>Detailed product definition.</p>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2"><label className={STYLES.label}>Product Name</label><input className={STYLES.inputBase} value={formData.name} onChange={e => handleChange('name', e.target.value)} /></div>
                <div>
                  <label className={STYLES.label}>Brand</label>
                  <input list="brand-list-adv" className={STYLES.inputBase} value={formData.brand} onChange={e => handleChange('brand', e.target.value)} />
                  <datalist id="brand-list-adv">{customers.map(c => <option key={c.id} value={c.companyName} />)}</datalist>
                </div>
                <div><label className={STYLES.label}>Category</label><select className={STYLES.selectBase} value={formData.category} onChange={e => handleChange('category', e.target.value)}>{TOP_40_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div className="col-span-2"><label className={STYLES.label}>Description</label><textarea className={`${STYLES.inputBase} min-h-[80px]`} value={formData.description} onChange={e => handleChange('description', e.target.value)} /></div>
              </div>
            </div>
          );
        case 2: // Specs + Tech Pack
          return (
            <div className="space-y-6 animate-in slide-in-from-right-8 fade-in">
              <div className="flex items-center gap-2 mb-2"><FileText className="w-5 h-5 text-indigo-600 dark:text-blue-400" /><h3 className={STYLES.sectionTitle}>Advanced: Engineering</h3></div>
              
              <div>
                  <label className={STYLES.label}>Tech Pack</label>
                  <div className={STYLES.buttonUpload} onClick={() => techPackRef.current?.click()}>
                      <Upload className="w-6 h-6 mb-2 text-slate-300 group-hover:text-[#003d5b] dark:group-hover:text-blue-400" />
                      <span className="text-xs font-bold">Attach Tech Pack (PDF)</span>
                      <input type="file" className="hidden" ref={techPackRef} />
                  </div>
              </div>

              <div><label className={STYLES.label}>External URL</label><input className={STYLES.inputBase} placeholder="https://drive..." /></div>
              
              <div className="grid grid-cols-3 gap-4">
                <div><label className={STYLES.label}>Length (cm)</label><input type="number" className={STYLES.inputBase} value={formData.dimensions?.lengthCm} onChange={e => handleChange('dimensions.lengthCm', e.target.value)} /></div>
                <div><label className={STYLES.label}>Width (cm)</label><input type="number" className={STYLES.inputBase} value={formData.dimensions?.widthCm} onChange={e => handleChange('dimensions.widthCm', e.target.value)} /></div>
                <div><label className={STYLES.label}>Height (cm)</label><input type="number" className={STYLES.inputBase} value={formData.dimensions?.heightCm} onChange={e => handleChange('dimensions.heightCm', e.target.value)} /></div>
              </div>
            </div>
          );
        case 3: // Materials + BOM
          return (
            <div className="space-y-6 animate-in slide-in-from-right-8 fade-in">
              <div className="flex items-center gap-2 mb-2"><Layers className="w-5 h-5 text-indigo-600 dark:text-blue-400" /><h3 className={STYLES.sectionTitle}>Advanced: Bill of Materials</h3></div>
              
              <div>
                  <label className={STYLES.label}>BOM File</label>
                  <div className={STYLES.buttonUpload} onClick={() => bomRef.current?.click()}>
                      <Upload className="w-6 h-6 mb-2 text-slate-300 group-hover:text-[#003d5b] dark:group-hover:text-blue-400" />
                      <span className="text-xs font-bold">Attach BOM (.XLS)</span>
                      <input type="file" className="hidden" ref={bomRef} />
                  </div>
              </div>

              <div><label className={STYLES.label}>Material Notes</label><textarea className={`${STYLES.inputBase} min-h-[100px] font-mono text-xs`} placeholder="1. Main Fabric: 100% Cotton, 220gsm..." /></div>
            </div>
          );
        case 4: // Sourcing
          return (
            <div className="space-y-6 animate-in slide-in-from-right-8 fade-in">
              <div className="flex items-center gap-2 mb-2"><Globe className="w-5 h-5 text-indigo-600 dark:text-blue-400" /><h3 className={STYLES.sectionTitle}>Advanced: Sourcing</h3></div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className={STYLES.label}>Supplier</label><select className={STYLES.selectBase} value={formData.primaryFactoryId} onChange={e => handleChange('primaryFactoryId', e.target.value)}>{factories.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div>
                <div><label className={STYLES.label}>Origin</label><input className={STYLES.inputBase} value={formData.sourcingCountry} onChange={e => handleChange('sourcingCountry', e.target.value)} /></div>
              </div>
            </div>
          );
        case 5: // Costing
          return (
            <div className="space-y-6 animate-in slide-in-from-right-8 fade-in">
              <div className="flex items-center gap-2 mb-2"><DollarSign className="w-5 h-5 text-indigo-600 dark:text-blue-400" /><h3 className={STYLES.sectionTitle}>Advanced: Cost Breakdown</h3></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={STYLES.label}>Material Cost</label><input type="number" className={STYLES.inputBase} value={formData.costVariables?.materials || ''} onChange={e => handleChange('costVariables.materials', e.target.value)} /></div>
                <div><label className={STYLES.label}>Labor Cost</label><input type="number" className={STYLES.inputBase} value={formData.costVariables?.labor || ''} onChange={e => handleChange('costVariables.labor', e.target.value)} /></div>
                <div><label className={STYLES.label}>Packaging</label><input type="number" className={STYLES.inputBase} value={formData.costVariables?.packaging || ''} onChange={e => handleChange('costVariables.packaging', e.target.value)} /></div>
                <div><label className={STYLES.label}>Logistics</label><input type="number" className={STYLES.inputBase} value={formData.costVariables?.logistics || ''} onChange={e => handleChange('costVariables.logistics', e.target.value)} /></div>
              </div>
            </div>
          );
        case 6: // Logistics
          return (
            <div className="space-y-6 animate-in slide-in-from-right-8 fade-in">
              <div className="flex items-center gap-2 mb-2"><Truck className="w-5 h-5 text-indigo-600 dark:text-blue-400" /><h3 className={STYLES.sectionTitle}>Advanced: Packaging</h3></div>
              <div><label className={STYLES.label}>Packaging Type</label><select className={STYLES.selectBase} value={formData.packagingType} onChange={e => handleChange('packagingType', e.target.value)}><option>Polybag</option><option>Retail Box</option><option>Custom</option></select></div>
              <div className="grid grid-cols-2 gap-6 mt-4">
                 <div><label className={STYLES.label}>Master Carton Qty</label><input type="number" className={STYLES.inputBase} /></div>
                 <div><label className={STYLES.label}>Unit Weight (kg)</label><input type="number" className={STYLES.inputBase} value={formData.dimensions?.weightKg} onChange={e => handleChange('dimensions.weightKg', e.target.value)} /></div>
              </div>
            </div>
          );
        case 7: // Review
          return (
            <div className="flex flex-col items-center justify-center py-10 animate-in slide-in-from-right-8 fade-in text-center">
              <div className="w-20 h-20 bg-indigo-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 text-indigo-600 dark:text-blue-400 shadow-xl shadow-indigo-200 dark:shadow-none">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">Review Complete</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs">All advanced specifications have been captured.</p>
            </div>
          );
      }
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onCancel} />

      {/* Drawer */}
      <div className="relative w-full max-w-2xl h-full bg-white dark:bg-slate-900 shadow-2xl border-t-4 border-blue-600 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="p-6 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${mode === 'advanced' ? 'bg-indigo-600 text-white' : 'bg-[#003d5b] dark:bg-blue-600 text-white'}`}>
                  {mode === 'advanced' ? <ClipboardList className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                </div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">New Product Wizard</h2>
              </div>
              
              {/* Mode Switcher */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
                <button 
                  onClick={() => { setMode('express'); setStep(1); }} 
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${mode === 'express' ? 'bg-white dark:bg-slate-700 shadow-sm text-[#003d5b] dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                  <Package className="w-3 h-3" /> Express
                </button>
                <button 
                  onClick={() => { setMode('advanced'); setStep(1); }} 
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${mode === 'advanced' ? 'bg-indigo-600 shadow-sm text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                  <ClipboardList className="w-3 h-3" /> Advanced
                </button>
              </div>
            </div>
            
            <button onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-8 pt-0 pb-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Step {step} of {totalSteps}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${mode === 'advanced' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                {mode === 'advanced' ? 'Advanced Workflow' : 'Express Workflow'}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ease-out ${mode === 'advanced' ? 'bg-indigo-600' : 'bg-[#003d5b] dark:bg-blue-600'}`} 
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {renderStepContent()}
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 z-10 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center">
          <button 
            onClick={step === 1 ? onCancel : handleBack} 
            className="px-6 py-3 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs flex items-center gap-2"
          >
            {step === 1 ? 'Cancel' : <><ArrowLeft className="w-4 h-4" /> Back</>}
          </button>
          
          <button 
            onClick={step === totalSteps ? handleFinish : handleNext} 
            className={`px-8 py-3 text-white rounded-xl font-bold shadow-lg transition-all text-xs flex items-center gap-2 ${mode === 'advanced' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-[#003d5b] dark:bg-blue-600 hover:bg-sky-900 dark:hover:bg-blue-500'}`}
          >
            {step === totalSteps ? 'Create Product' : <>Next Step <ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
