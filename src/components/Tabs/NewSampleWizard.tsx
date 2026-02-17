

import React, { useState, useEffect, useRef } from 'react';
import { Product, Customer, Factory, SampleRequest, Language } from '../../types';

// --- SAFE ICONS ---
const CloseIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>);
const BoxIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>);
const UploadIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>);
const FileIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>);

// --- STANDARDIZED STYLES ---
const STYLES = {
  label: "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5",
  inputBase: "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 relative",
  inputError: "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50",
  inputFocus: "focus:bg-white focus:border-[#003d5b] focus:ring-2 focus:ring-[#003d5b]/20",
  inputReadOnly: "w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-mono text-slate-500 cursor-not-allowed",
  selectBase: "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none transition-all duration-200 appearance-none cursor-pointer",
  errorText: "mt-1 text-xs text-red-500 font-bold"
};

interface Props {
  products: Product[];
  customers: Customer[];
  factories: Factory[];
  lang?: Language;
  onComplete: (sample: SampleRequest) => void;
  onCancel: () => void;
}

const NewSampleWizard: React.FC<Props> = ({ products, customers, factories, lang, onComplete, onCancel }) => {
  
  // --- FORM STATE ---
  // ID is now generated HERE so it is visible immediately
  const [formData, setFormData] = useState({
    id: `SMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    type: 'Counter Sample',
    productRefId: '',
    factoryId: '', 
    notes: '',
    courierCost: 0,
    sampleCost: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize defaults (Auto-select first product/factory if available)
  useEffect(() => {
    const updates: any = {};
    if (!formData.productRefId && products.length > 0) updates.productRefId = products[0].id;
    if (!formData.factoryId && factories.length > 0) updates.factoryId = factories[0].id;
    if (Object.keys(updates).length > 0) setFormData(prev => ({ ...prev, ...updates }));
  }, [products, factories]);

  // Auto-select factory when product changes
  useEffect(() => {
    if (formData.productRefId) {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // --- VALIDATION CHECK ---
    const newErrors: Record<string, string> = {};
    if (!formData.productRefId) newErrors.productRefId = "Please select a product model";
    if (!formData.factoryId) newErrors.factoryId = "Please select a factory";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newSample: SampleRequest = {
      // Use the ID from state (so it matches what the user saw)
      id: formData.id,
      productId: formData.productRefId,
      factoryId: formData.factoryId,
      customerId: 'INTERNAL',
      type: formData.type as any,
      status: 'Requested',
      requestDate: new Date().toISOString().split('T')[0],
      estimatedCompletion: '',
      trackingNumber: '',
      courier: '',
      cost: formData.sampleCost,
      courierCost: formData.courierCost,
      attachments: attachments.map(file => ({
        id: `att-${Math.random()}`,
        name: file.name,
        url: URL.createObjectURL(file), 
        type: file.type.includes('image') ? 'image' : 'file'
      })),
      comments: [{
        id: `c-${Date.now()}`,
        userId: 'u1',
        userName: 'Current User',
        text: formData.notes || 'Sample request created.',
        date: new Date().toISOString(),
      }]
    };

    onComplete(newSample);
  };

  return (
    // NOTE: Parent handles conditional rendering (isOpen)
    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="bg-[#003d5b] p-6 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg"><BoxIcon className="w-6 h-6" /></div>
            <div>
              <h3 className="text-xl font-bold">Request New Sample</h3>
              <p className="text-white/60 text-xs mt-1">Production or Counter Sample</p>
            </div>
          </div>
          <button type="button" onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              
              {/* --- VISIBLE ID FIELD (ADDED) --- */}
              <div>
                <label className={STYLES.label}>Sample Request ID (Auto)</label>
                <input 
                  className={STYLES.inputReadOnly}
                  value={formData.id}
                  readOnly
                />
              </div>

              {/* Type Selection */}
              <div>
                <label className={STYLES.label}>Sample Type</label>
                <div className="relative">
                    <select 
                      className={`${STYLES.selectBase} ${STYLES.inputFocus}`}
                      value={formData.type}
                      onChange={(e) => handleChange('type', e.target.value)}
                    >
                      <option value="Counter Sample">Counter Sample</option>
                      <option value="Pre-Production">Pre-Production (PP)</option>
                      <option value="Top of Production">Top of Production (TOP)</option>
                      <option value="Photo Sample">Photo Sample</option>
                      <option value="Size Set">Size Set</option>
                    </select>
                    <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">▼</div>
                </div>
              </div>

              {/* ROW 1: Product & Factory */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={STYLES.label}>Product Model <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      className={`${STYLES.selectBase} ${errors.productRefId ? STYLES.inputError : STYLES.inputFocus}`}
                      value={formData.productRefId}
                      onChange={(e) => handleChange('productRefId', e.target.value)}
                    >
                      {products.length === 0 && <option value="">No Products Found</option>}
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.skus?.[0]?.code || 'No SKU'})</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">▼</div>
                  </div>
                  {errors.productRefId && <p className={STYLES.errorText}>{errors.productRefId}</p>}
                </div>

                <div>
                  <label className={STYLES.label}>Factory <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      className={`${STYLES.selectBase} ${errors.factoryId ? STYLES.inputError : STYLES.inputFocus}`}
                      value={formData.factoryId}
                      onChange={(e) => handleChange('factoryId', e.target.value)}
                    >
                      {factories.length === 0 && <option value="">No Factories Found</option>}
                      {factories.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">▼</div>
                  </div>
                  {errors.factoryId && <p className={STYLES.errorText}>{errors.factoryId}</p>}
                </div>
              </div>

              {/* ROW 2: Costs */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={STYLES.label}>Est. Sample Cost ($)</label>
                  <input 
                    type="number" 
                    className={`${STYLES.inputBase} ${STYLES.inputFocus}`}
                    placeholder="0.00"
                    value={formData.sampleCost}
                    onChange={(e) => handleChange('sampleCost', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className={STYLES.label}>Est. Courier Cost ($)</label>
                  <input 
                    type="number" 
                    className={`${STYLES.inputBase} ${STYLES.inputFocus}`}
                    placeholder="0.00"
                    value={formData.courierCost}
                    onChange={(e) => handleChange('courierCost', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* ATTACHMENTS SECTION */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Attachments</label>
                    <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-bold text-[#003d5b] hover:underline flex items-center gap-1"
                    >
                        <UploadIcon className="w-3 h-3" /> Upload Files
                    </button>
                    <input 
                        type="file" 
                        multiple 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileChange} 
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                </div>

                {attachments.length === 0 ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-[#003d5b] hover:bg-white transition-all"
                    >
                        <p className="text-xs text-slate-400 font-medium">Click to upload specs, drawings, or PDFs</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {attachments.map((file, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white p-2 px-3 rounded-lg border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <div className="p-1.5 bg-slate-100 rounded text-slate-500"><FileIcon className="w-4 h-4" /></div>
                                    <span className="text-xs font-bold text-slate-700 truncate">{file.name}</span>
                                    <span className="text-[10px] text-slate-400">({(file.size / 1024).toFixed(0)}kb)</span>
                                </div>
                                <button onClick={() => removeAttachment(idx)} className="text-slate-400 hover:text-red-500">
                                    <CloseIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
              </div>

              <div>
                <label className={STYLES.label}>Instructions / Notes</label>
                <textarea 
                  className={`${STYLES.inputBase} ${STYLES.inputFocus} min-h-[100px] resize-none`}
                  placeholder="Describe the changes or specific details for this sample..."
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                />
              </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
            <button 
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors text-sm"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleSubmit}
              className="px-8 py-3 bg-[#003d5b] text-white rounded-xl font-bold shadow-lg hover:bg-sky-900 transition-all text-sm flex items-center gap-2"
            >
              Request Sample
            </button>
        </div>
    </div>
  );
};

export default NewSampleWizard;