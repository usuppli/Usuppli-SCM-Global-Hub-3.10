
import React, { useState, useEffect } from 'react';
import { Product, Language } from '../../types';
import { translations } from '../../translations';

// --- NEW ICONS FOR SKU ACTIONS ---
const CopyIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>);
const TrashIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const PlusIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>);

const STYLES = {
  wrapper: "w-full",
  label: "block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5",
  inputBase: "w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
  inputFocus: "focus:bg-white dark:focus:bg-slate-900 focus:border-[#003d5b] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#003d5b]/20",
  inputError: "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200 text-red-900",
  errorText: "mt-1 text-xs text-red-500 font-bold"
};

const Input = ({ label, error, icon, className, ...props }: any) => (
  <div className={STYLES.wrapper}>
    {label && <label className={STYLES.label}>{label} {error && <span className="text-red-500">*</span>}</label>}
    <div className="relative">
      {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">{icon}</div>}
      <input className={`${STYLES.inputBase} ${error ? STYLES.inputError : STYLES.inputFocus} ${icon ? 'pl-10' : ''} ${className||''}`} {...props} />
    </div>
    {error && <p className={STYLES.errorText}>{error}</p>}
  </div>
);

const TextArea = ({ label, error, className, ...props }: any) => (
  <div className={STYLES.wrapper}>
    {label && <label className={STYLES.label}>{label}</label>}
    <textarea className={`${STYLES.inputBase} ${STYLES.inputFocus} ${error ? STYLES.inputError : ''} ${className||''}`} {...props} />
    {error && <p className={STYLES.errorText}>{error}</p>}
  </div>
);

interface Props {
  product: Product;
  lang: Language;
  onSave: (product: Product) => void;
  isReadOnly?: boolean;
}

const ProductSpecs: React.FC<Props> = ({ product, lang, onSave, isReadOnly }) => {
  const t = translations[lang];
  const s = t.specs; 
  
  const [isEditing, setIsEditing] = useState(false);
  
  // Removed 'id' from SKU initialization objects to match type definition
  const [formData, setFormData] = useState<Product>(() => ({
    ...product,
    dimensions: product.dimensions || { weightKg: 0, lengthCm: 0, widthCm: 0, heightCm: 0 },
    skus: (product.skus && product.skus.length > 0) ? product.skus : [{ code: `${product.id}-001`, size: 'One Size', prices: { USA: 0 } }]
  }));
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Removed 'id' from SKU fallback initialization
    setFormData({
        ...product,
        dimensions: product.dimensions || { weightKg: 0, lengthCm: 0, widthCm: 0, heightCm: 0 },
        skus: (product.skus && product.skus.length > 0) ? product.skus : [{ code: `${product.id}-001`, size: 'One Size', prices: { USA: 0 } }]
    });
    setErrors({});
  }, [product]);

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = "Product Name is required";
    if (!formData.brand?.trim()) newErrors.brand = "Brand Ref is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    setIsEditing(false);
  };

  const handleChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleDimChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      dimensions: { ...prev.dimensions, [field]: parseFloat(value) || 0 }
    }));
  };

  // --- SKU ACTIONS ---

  const handleSkuChange = (index: number, field: string, value: string) => {
    const newSkus = [...(formData.skus || [])];
    if (field === 'price') {
        newSkus[index] = { ...newSkus[index], prices: { ...newSkus[index].prices, USA: parseFloat(value) || 0 } };
    } else {
        newSkus[index] = { ...newSkus[index], [field as keyof typeof newSkus[0]]: value };
    }
    setFormData(prev => ({ ...prev, skus: newSkus }));
  };

  const handleAddSku = (e: React.MouseEvent) => {
      e.stopPropagation();
      // Removed 'id' from new SKU object
      const newSku = { 
          code: `${formData.id}-${(formData.skus?.length || 0) + 1}`, 
          size: '', 
          prices: { USA: 0 } 
      };
      setFormData(prev => ({ ...prev, skus: [...(prev.skus || []), newSku] }));
  };

  const handleDuplicateSku = (index: number, e: React.MouseEvent) => {
      e.stopPropagation();
      const skuToCopy = formData.skus![index];
      // Removed 'id' from duplicate SKU object
      const newSku = { 
          ...skuToCopy, 
          code: `${skuToCopy.code}-COPY` 
      };
      
      const newSkus = [...(formData.skus || [])];
      newSkus.splice(index + 1, 0, newSku); 
      setFormData(prev => ({ ...prev, skus: newSkus }));
  };

  const handleDeleteSku = (index: number, e: React.MouseEvent) => {
      e.stopPropagation();
      const newSkus = [...(formData.skus || [])];
      if (newSkus.length > 1) {
          newSkus.splice(index, 1);
          setFormData(prev => ({ ...prev, skus: newSkus }));
      } else {
          newSkus[0] = { ...newSkus[0], code: '', size: '', prices: { USA: 0 } };
          setFormData(prev => ({ ...prev, skus: newSkus }));
      }
  };

  const handleCardClick = () => {
    if (!isEditing && !isReadOnly) setIsEditing(true);
  };

  const getCardClassName = () => 
    `bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all duration-200 ${
      !isEditing && !isReadOnly ? 'cursor-pointer hover:border-sky-400 dark:hover:border-blue-500 group' : ''
    }`;

  const ClickToEditOverlay = () => (
    !isEditing && !isReadOnly ? (
      <div className="absolute top-4 right-4 text-[10px] font-bold text-sky-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider pointer-events-none">
        {t.common?.clickToEdit || "Click to Edit"}
      </div>
    ) : null
  );

  const cleanNumberInputClass = "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <div id="tech-pack-sheet" className="space-y-6 animate-in fade-in relative">
      
      <div className="flex justify-between items-center no-print mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{s.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Engineering control and asset management</p>
          </div>
          <div className="flex gap-2">
            {!isReadOnly && (
                isEditing ? (
                    <>
                        <button onClick={() => { setIsEditing(false); setFormData({...product, dimensions: product.dimensions || { weightKg: 0, lengthCm: 0, widthCm: 0, heightCm: 0 }, skus: (product.skus && product.skus.length > 0) ? product.skus : [{ code: `${product.id}-001`, size: 'One Size', prices: { USA: 0 } }]}); setErrors({}); }} className="px-4 py-2 text-slate-500 dark:text-slate-400 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                            {t.common.cancel}
                        </button>
                        <button onClick={handleSave} className="px-4 py-2 bg-[#003d5b] dark:bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-sky-900 shadow-lg transition-colors">
                            {t.common.save}
                        </button>
                    </>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors">
                        {t.common.edit} Specs
                    </button>
                )
            )}
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2">
          
          <div className={getCardClassName()} onClick={handleCardClick}>
              <ClickToEditOverlay />
              <h4 className="font-bold text-sky-700 dark:text-sky-400 uppercase text-xs tracking-widest mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Media & Assets</h4>
              <div className="space-y-4">
                  <Input label="Product Image URL" disabled={!isEditing} value={formData.image || ''} placeholder="https://..." onChange={(e:any) => handleChange('image', e.target.value)} className="font-mono text-xs" />
                  <Input label="3D Model / CAD Link" disabled={!isEditing} value={formData.cadLink || ''} placeholder="Cloud Link" onChange={(e:any) => handleChange('cadLink', e.target.value)} className="font-mono text-xs" />
              </div>
          </div>

          <div className={getCardClassName()} onClick={handleCardClick}>
              <ClickToEditOverlay />
              <h4 className="font-bold text-sky-700 dark:text-sky-400 uppercase text-xs tracking-widest mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">{s.dna}</h4>
              <div className="grid grid-cols-2 gap-4">
                  <Input label="Brand Ref" disabled={!isEditing} value={formData.brand || ''} onChange={(e:any) => handleChange('brand', e.target.value)} error={errors.brand} />
                  <Input label="Product Name" disabled={!isEditing} value={formData.name || ''} onChange={(e:any) => handleChange('name', e.target.value)} error={errors.name} />
                  <Input label="Category" disabled={!isEditing} value={formData.category || ''} onChange={(e:any) => handleChange('category', e.target.value)} />
                  <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Internal ID</label>
                      <p className="font-mono text-xs text-slate-500 dark:text-slate-400 p-2">{product.id}</p>
                  </div>
              </div>
          </div>

          <div className={getCardClassName()} onClick={handleCardClick}>
              <ClickToEditOverlay />
              <h4 className="font-bold text-sky-700 dark:text-sky-400 uppercase text-xs tracking-widest mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">{s.fabrication}</h4>
              <div className="space-y-4">
                  <TextArea label={s.material} disabled={!isEditing} rows={2} value={formData.material || ''} onChange={(e:any) => handleChange('material', e.target.value)} />
                  <TextArea label={s.construction} disabled={!isEditing} rows={2} value={formData.construction || ''} onChange={(e:any) => handleChange('construction', e.target.value)} />
              </div>
          </div>

          <div className={getCardClassName()} onClick={handleCardClick}>
              <ClickToEditOverlay />
              <h4 className="font-bold text-sky-700 dark:text-sky-400 uppercase text-xs tracking-widest mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">{s.logistics}</h4>
              <div className="grid grid-cols-2 gap-4">
                  <Input label={s.hsCode} disabled={!isEditing} className="font-mono" value={formData.hsCode || ''} onChange={(e:any) => handleChange('hsCode', e.target.value)} />
                  <Input label="Weight (KG)" disabled={!isEditing} type="number" step="0.01" value={formData.dimensions.weightKg} onChange={(e:any) => handleDimChange('weightKg', e.target.value)} />
                  <div className="col-span-2">
                      <label className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-2 block">{s.dims} (L x W x H CM)</label>
                      <div className="flex gap-2">
                          <input type="number" disabled={!isEditing} className={`w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center font-mono text-sm dark:text-slate-200 ${cleanNumberInputClass}`} value={formData.dimensions.lengthCm} onChange={(e) => handleDimChange('lengthCm', e.target.value)} />
                          <input type="number" disabled={!isEditing} className={`w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center font-mono text-sm dark:text-slate-200 ${cleanNumberInputClass}`} value={formData.dimensions.widthCm} onChange={(e) => handleDimChange('widthCm', e.target.value)} />
                          <input type="number" disabled={!isEditing} className={`w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center font-mono text-sm dark:text-slate-200 ${cleanNumberInputClass}`} value={formData.dimensions.heightCm} onChange={(e) => handleDimChange('heightCm', e.target.value)} />
                      </div>
                  </div>
              </div>
          </div>

          <div className={`${getCardClassName()} md:col-span-2`} onClick={handleCardClick}>
              <ClickToEditOverlay />
              <h4 className="font-bold text-sky-700 dark:text-sky-400 uppercase text-xs tracking-widest mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">{s.skuMatrix}</h4>
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                      <thead className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950">
                          <tr>
                              <th className="p-3 px-4">SKU Code</th>
                              <th className="p-3 px-4">Variant / Size</th>
                              <th className="p-3 px-4 text-right">Target MSRP</th>
                              <th className="p-3 px-4 w-20 text-center">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {formData.skus?.map((sku, i) => (
                              <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                  <td className="p-3 px-4">
                                      <input 
                                        disabled={!isEditing} 
                                        className="bg-transparent font-mono w-full outline-none dark:text-slate-300" 
                                        value={sku.code || ''} 
                                        placeholder="SKU-001"
                                        onChange={(e) => handleSkuChange(i, 'code', e.target.value)} 
                                      />
                                  </td>
                                  <td className="p-3 px-4">
                                      <input 
                                        disabled={!isEditing} 
                                        className="bg-transparent font-bold w-full outline-none dark:text-slate-200" 
                                        value={sku.size || ''} 
                                        placeholder="Size/Color"
                                        onChange={(e) => handleSkuChange(i, 'size', e.target.value)} 
                                      />
                                  </td>
                                  <td className="p-3 px-4 text-right font-mono">
                                      <input 
                                        disabled={!isEditing} 
                                        type="number" 
                                        className={`bg-transparent font-bold text-emerald-600 dark:text-emerald-400 text-right w-full outline-none ${cleanNumberInputClass}`} 
                                        value={sku.prices['USA'] || 0} 
                                        onChange={(e) => handleSkuChange(i, 'price', e.target.value)} 
                                      />
                                  </td>
                                  <td className="p-3 px-4 text-center">
                                      {isEditing && (
                                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                              <button 
                                                onClick={(e) => handleDuplicateSku(i, e)} 
                                                className="p-1.5 hover:bg-sky-100 dark:hover:bg-blue-900/30 text-slate-400 hover:text-sky-600 rounded-lg transition-colors"
                                                title="Duplicate Row"
                                              >
                                                  <CopyIcon className="w-3.5 h-3.5" />
                                              </button>
                                              <button 
                                                onClick={(e) => handleDeleteSku(i, e)} 
                                                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                                                title="Delete Row"
                                              >
                                                  <TrashIcon className="w-3.5 h-3.5" />
                                              </button>
                                          </div>
                                      )}
                                  </td>
                              </tr>
                          ))}
                          
                          {/* ADD BUTTON FOOTER */}
                          {isEditing && (
                              <tr>
                                  <td colSpan={4} className="p-2">
                                      <button 
                                        onClick={handleAddSku} 
                                        className="w-full py-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-[#003d5b] dark:hover:text-blue-400 hover:border-[#003d5b]/30 dark:hover:border-blue-500/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
                                      >
                                          <PlusIcon className="w-4 h-4" /> Add New Variant
                                      </button>
                                  </td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ProductSpecs;
