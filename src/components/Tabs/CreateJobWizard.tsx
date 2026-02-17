
import React, { useState, useEffect } from 'react';
import { Product, Customer, Factory, Job, Language } from '../../types';
import { X, ChevronRight, ClipboardList, Calendar, Package, Factory as FactoryIcon, User, Truck, FileText } from 'lucide-react';

// --- STYLES (Standardized v3.01) ---
const STYLES = {
  label: "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5",
  inputBase: "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 relative",
  inputFocus: "focus:bg-white focus:border-[#003d5b] focus:ring-2 focus:ring-[#003d5b]/20",
  inputReadOnly: "w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-mono text-slate-500 cursor-not-allowed",
  selectBase: "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none transition-all duration-200 appearance-none cursor-pointer",
  errorText: "mt-1 text-xs text-red-500 font-bold",
  sectionTitle: "text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 mt-2"
};

interface Props {
  products: Product[];
  customers: Customer[];
  factories: Factory[];
  lang?: Language;
  onComplete: (job: Job) => void;
  onCancel: () => void;
  isOpen?: boolean; 
}

const CreateJobWizard: React.FC<Props> = ({ products = [], customers = [], factories = [], lang, onComplete, onCancel, isOpen }) => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- FORM STATE (Restored v2.67 Fields) ---
  const [formData, setFormData] = useState({
    // ID Generated IMMEDIATELY
    id: `JOB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    
    // Core Identifiers
    jobName: '',
    poNumber: '',
    
    // Links
    productRefId: '',
    factoryId: '',
    customerId: '',
    
    // People
    leadBuyer: '',
    
    // Quantities & Stages
    quantity: 1000,
    productionStage: 'Inquiry', // Default to Inquiry
    priority: 'Medium',
    status: 'Planned',
    
    // Dates
    orderDate: new Date().toISOString().split('T')[0], // Start Date
    targetDelivery: '', // End Date
    
    // Logistics (Critical for Print/Email)
    incoterms: 'FOB',
    shippingMethod: 'Sea',
    destinationAddress: '',
    paymentTerms: '',
    
    // Details
    description: '',
    packagingInstructions: ''
  });

  // Auto-select defaults
  useEffect(() => {
    const updates: any = {};
    if (!formData.productRefId && products && products.length > 0) updates.productRefId = products[0].id;
    if (!formData.factoryId && factories && factories.length > 0) updates.factoryId = factories[0].id;
    if (!formData.customerId && customers && customers.length > 0) updates.customerId = customers[0].id;
    if (Object.keys(updates).length > 0) setFormData(prev => ({ ...prev, ...updates }));
  }, [products, factories, customers]);

  // Auto-select factory when product changes
  useEffect(() => {
    if (formData.productRefId && products) {
      const selectedProduct = products.find(p => p.id === formData.productRefId);
      if (selectedProduct?.primaryFactoryId) {
        setFormData(prev => ({ ...prev, factoryId: selectedProduct.primaryFactoryId || prev.factoryId }));
      }
    }
  }, [formData.productRefId, products]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
        if (!formData.jobName.trim()) newErrors.jobName = "Job Name required";
        if (!formData.poNumber.trim()) newErrors.poNumber = "PO Number required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep(s => s + 1);
  };

  const handleSubmit = () => {
    if (!validateStep(step)) return;

    // Construct final Job object (Mapping to types.tsx)
    const finalJob: Job = {
      id: formData.id,
      jobName: formData.jobName,
      poNumber: formData.poNumber,
      description: formData.description,
      
      productRefId: formData.productRefId || 'UNLINKED',
      factoryId: formData.factoryId || 'UNASSIGNED',
      customerId: formData.customerId,
      
      quantity: Number(formData.quantity),
      startDate: formData.orderDate, // Mapped to startDate
      date: formData.orderDate, // Legacy support
      targetDelivery: formData.targetDelivery,
      
      status: formData.status,
      productionStage: formData.productionStage,
      priority: formData.priority as any,
      
      // Logistics Data (Restored for Print Function)
      leadBuyer: formData.leadBuyer,
      incoterms: formData.incoterms as any,
      shippingMethod: formData.shippingMethod as any,
      destinationAddress: formData.destinationAddress,
      paymentTerms: formData.paymentTerms,
      packagingInstructions: formData.packagingInstructions,
      
      completionPercent: 0,
      value: 0 
    };

    onComplete(finalJob);
  };

  return (
    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
      
      {/* HEADER */}
      <div className="bg-[#003d5b] p-6 flex justify-between items-center text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg"><ClipboardList className="w-6 h-6" /></div>
          <div>
            <h3 className="text-xl font-bold">New Production Order</h3>
            <p className="text-white/60 text-xs mt-1">Create Job Protocol v2.67</p>
          </div>
        </div>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
        
        {/* STEP 1: SCOPE & IDENTIFICATION */}
        {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                
                {/* 1. INTERNAL ID (TOP PRIORITY) */}
                <div>
                    <label className={STYLES.label}>Internal Job ID (Auto)</label>
                    <input 
                        className={STYLES.inputReadOnly}
                        value={formData.id}
                        readOnly
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className={STYLES.label}>Job Name / Reference <span className="text-red-500">*</span></label>
                        <input 
                            className={`${STYLES.inputBase} ${errors.jobName ? 'border-red-500' : STYLES.inputFocus}`}
                            placeholder="e.g. Summer Collection Batch A"
                            value={formData.jobName}
                            onChange={(e) => handleChange('jobName', e.target.value)}
                        />
                        {errors.jobName && <p className={STYLES.errorText}>{errors.jobName}</p>}
                    </div>
                    <div>
                        <label className={STYLES.label}>PO Number <span className="text-red-500">*</span></label>
                        <input 
                            className={`${STYLES.inputBase} ${errors.poNumber ? 'border-red-500' : STYLES.inputFocus}`}
                            placeholder="PO-2026-..."
                            value={formData.poNumber}
                            onChange={(e) => handleChange('poNumber', e.target.value)}
                        />
                        {errors.poNumber && <p className={STYLES.errorText}>{errors.poNumber}</p>}
                    </div>
                </div>

                <h4 className={STYLES.sectionTitle}>Product & Customer</h4>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className={STYLES.label}>Product Model</label>
                        <div className="relative">
                            <select 
                                className={`${STYLES.selectBase} ${STYLES.inputFocus}`}
                                value={formData.productRefId}
                                onChange={(e) => handleChange('productRefId', e.target.value)}
                            >
                                {products && products.length > 0 ? (
                                    products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                                ) : (
                                    <option value="">No Products Found</option>
                                )}
                            </select>
                            <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">▼</div>
                        </div>
                    </div>
                    <div>
                        <label className={STYLES.label}>Quantity</label>
                        <input 
                            type="number"
                            className={`${STYLES.inputBase} ${STYLES.inputFocus}`}
                            value={formData.quantity}
                            onChange={(e) => handleChange('quantity', e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className={STYLES.label}>Customer (Optional)</label>
                        <div className="relative">
                            <select 
                                className={`${STYLES.selectBase} ${STYLES.inputFocus}`}
                                value={formData.customerId}
                                onChange={(e) => handleChange('customerId', e.target.value)}
                            >
                                <option value="">Unassigned Stock</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                            </select>
                            <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">▼</div>
                        </div>
                    </div>
                    <div>
                        <label className={STYLES.label}>Lead Buyer</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                            <input 
                                className={`${STYLES.inputBase} ${STYLES.inputFocus} pl-10`}
                                placeholder="Name of Buyer"
                                value={formData.leadBuyer}
                                onChange={(e) => handleChange('leadBuyer', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className={STYLES.label}>Initial Stage</label>
                        <select 
                            className={`${STYLES.selectBase} ${STYLES.inputFocus}`}
                            value={formData.productionStage}
                            onChange={(e) => handleChange('productionStage', e.target.value)}
                        >
                            <option>Inquiry</option>
                            <option>Costing</option>
                            <option>Sampling</option>
                            <option>Production</option>
                        </select>
                    </div>
                    <div>
                        <label className={STYLES.label}>Priority</label>
                        <select 
                            className={`${STYLES.selectBase} ${STYLES.inputFocus}`}
                            value={formData.priority}
                            onChange={(e) => handleChange('priority', e.target.value)}
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Urgent</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className={STYLES.label}>Project Description</label>
                    <textarea 
                        className={`${STYLES.inputBase} ${STYLES.inputFocus} min-h-[80px] resize-none`}
                        placeholder="Internal notes about this order..."
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                    />
                </div>
            </div>
        )}

        {/* STEP 2: LOGISTICS & EXECUTION */}
        {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                
                <div>
                    <label className={STYLES.label}>Manufacturing Partner (Factory)</label>
                    <div className="relative">
                        <FactoryIcon className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <select 
                            className={`${STYLES.selectBase} ${STYLES.inputFocus} pl-10`}
                            value={formData.factoryId}
                            onChange={(e) => handleChange('factoryId', e.target.value)}
                        >
                            {factories.length === 0 && <option value="">No Factories</option>}
                            {factories.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* DATES - ADDED START DATE */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className={STYLES.label}>Order Start Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                            <input 
                                type="date"
                                className={`${STYLES.inputBase} ${STYLES.inputFocus} pl-10`}
                                value={formData.orderDate}
                                onChange={(e) => handleChange('orderDate', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className={STYLES.label}>Target Ex-Factory Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                            <input 
                                type="date"
                                className={`${STYLES.inputBase} ${STYLES.inputFocus} pl-10`}
                                value={formData.targetDelivery}
                                onChange={(e) => handleChange('targetDelivery', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <h4 className={STYLES.sectionTitle}>Shipping & Financials</h4>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className={STYLES.label}>Incoterms</label>
                        <select 
                            className={`${STYLES.selectBase} ${STYLES.inputFocus}`}
                            value={formData.incoterms}
                            onChange={(e) => handleChange('incoterms', e.target.value)}
                        >
                            <option>FOB</option>
                            <option>EXW</option>
                            <option>CIF</option>
                            <option>DDP</option>
                            <option>DAP</option>
                        </select>
                    </div>
                    <div>
                        <label className={STYLES.label}>Shipping Method</label>
                        <div className="relative">
                            <Truck className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                            <select 
                                className={`${STYLES.selectBase} ${STYLES.inputFocus} pl-10`}
                                value={formData.shippingMethod}
                                onChange={(e) => handleChange('shippingMethod', e.target.value)}
                            >
                                <option>Sea</option>
                                <option>Air</option>
                                <option>Rail</option>
                                <option>Truck</option>
                                <option>Express</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className={STYLES.label}>Destination Address</label>
                        <input 
                            className={`${STYLES.inputBase} ${STYLES.inputFocus}`}
                            placeholder="Warehouse / Port"
                            value={formData.destinationAddress}
                            onChange={(e) => handleChange('destinationAddress', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className={STYLES.label}>Payment Terms</label>
                        <input 
                            className={`${STYLES.inputBase} ${STYLES.inputFocus}`}
                            placeholder="e.g. 30% Deposit"
                            value={formData.paymentTerms}
                            onChange={(e) => handleChange('paymentTerms', e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className={STYLES.label}>Packaging Instructions</label>
                    <textarea 
                        className={`${STYLES.inputBase} ${STYLES.inputFocus} min-h-[80px] resize-none`}
                        placeholder="Carton markings, polybag details, sticker requirements..."
                        value={formData.packagingInstructions}
                        onChange={(e) => handleChange('packagingInstructions', e.target.value)}
                    />
                </div>

            </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
        <button 
          type="button"
          onClick={step === 1 ? onCancel : () => setStep(1)}
          className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors text-sm"
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </button>
        <button 
          type="button"
          onClick={step === 1 ? handleNext : handleSubmit}
          className="px-8 py-3 bg-[#003d5b] text-white rounded-xl font-bold shadow-lg hover:bg-sky-900 transition-all text-sm flex items-center gap-2"
        >
          {step === 1 ? 'Next Step' : 'Create Order'}
          {step === 1 && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default CreateJobWizard;