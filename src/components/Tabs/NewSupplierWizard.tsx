
import React, { useState, useEffect } from 'react';
import { Factory, Language } from '../../types';

// --- ICONS ---
const CloseIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>);
const FactoryIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>);
const StarIcon = ({ className, filled }: { className: string, filled?: boolean }) => (<svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363 1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>);
const CheckIcon = ({ className }: { className: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>);

// --- STYLES ---
const STYLES = {
  label: "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5",
  inputBase: "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 relative",
  inputError: "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50",
  inputFocus: "focus:bg-white focus:border-[#003d5b] focus:ring-2 focus:ring-[#003d5b]/20",
  inputReadOnly: "w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-mono text-slate-500 cursor-not-allowed",
  selectBase: "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none transition-all duration-200 appearance-none cursor-pointer",
  errorText: "mt-1 text-xs text-red-500 font-bold",
  tagBase: "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2",
  checkboxBase: "w-5 h-5 rounded border-slate-300 text-[#003d5b] focus:ring-[#003d5b] transition-all cursor-pointer"
};

const COUNTRY_OPTIONS = [
  "China", "Vietnam", "India", "Thailand", "Bangladesh", "Turkey", "Mexico", "USA", "South Africa"
];

const COMPLIANCE_LIST = [
  "ISO 9001", "ISO 14001", "SA8000", "C-TPAT", "WRAP", "OEKO-TEX", "BSCI"
];

// Helper to infer region from country
const getRegion = (country: string) => {
  if (['China', 'Vietnam', 'Thailand', 'Bangladesh', 'India'].includes(country)) return 'Asia';
  if (['Turkey', 'Germany', 'France'].includes(country)) return 'Europe';
  if (['Mexico', 'USA', 'Canada'].includes(country)) return 'Americas';
  if (['South Africa', 'Egypt'].includes(country)) return 'Africa';
  return 'Asia'; // Default
};

interface Props {
  lang?: Language;
  onComplete: (factory: Factory) => void;
  onCancel: () => void;
}

const NewSupplierWizard: React.FC<Props> = ({ lang, onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Tag Input State
  const [catInput, setCatInput] = useState("");

  // Initial State - ID IS GENERATED HERE
  const [formData, setFormData] = useState<Partial<Factory>>({
    id: `FAC-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Auto-generated Immediately
    name: '',
    businessType: 'Manufacturer',
    country: '',
    address: '',
    contactPerson: '',
    contactEmail: '',
    phone: '',
    website: '',
    capabilities: [], 
    capacity: undefined,
    moq: undefined,
    currency: 'USD',
    incoterms: 'FOB',
    rating: 0,
    source: 'Alibaba',
    certifications: [],
    status: 'Pending'
  });

  const handleChange = (field: keyof Factory, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field as string];
        return next;
      });
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && catInput.trim()) {
      e.preventDefault();
      if (!formData.capabilities?.includes(catInput.trim())) {
        handleChange('capabilities', [...(formData.capabilities || []), catInput.trim()]);
      }
      setCatInput("");
    }
  };

  const removeTag = (tag: string) => {
    handleChange('capabilities', (formData.capabilities || []).filter(t => t !== tag));
  };

  const toggleCert = (cert: string) => {
    const current = formData.certifications || [];
    const updated = current.includes(cert) 
      ? current.filter(c => c !== cert)
      : [...current, cert];
    handleChange('certifications', updated);
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.name?.trim()) newErrors.name = "Supplier Name is required";
      if (!formData.country) newErrors.country = "Country is required";
      if (!formData.contactPerson?.trim()) newErrors.contactPerson = "Contact Name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = () => {
    if (!validateStep(step)) return;

    // Construct final object using the ID we generated at the start
    const finalFactory: Factory = {
      ...formData as Factory,
      
      // Explicit mapping for compatibility
      location: formData.country || 'Unknown', 
      contact: formData.contactPerson, 
      certificationsList: (formData.certifications || []).join(', '), 
      status: 'Pending',
      region: getRegion(formData.country || ''), 
      
      supplierType: formData.businessType,
      websiteUrl: formData.website,
      productCategories: formData.capabilities,
      productionCapacity: formData.capacity?.toString() || ''
    };

    onComplete(finalFactory);
  };

  return (
    <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      
      {/* HEADER */}
      <div className="bg-[#003d5b] p-6 flex justify-between items-center text-white shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
            <FactoryIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">New Supplier Onboarding</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${step >= 1 ? 'bg-white text-[#003d5b]' : 'bg-white/20 text-white/60'}`}>Identity</span>
              <div className="w-4 h-px bg-white/20"></div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${step >= 2 ? 'bg-white text-[#003d5b]' : 'bg-white/20 text-white/60'}`}>Commercial</span>
              <div className="w-4 h-px bg-white/20"></div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${step >= 3 ? 'bg-white text-[#003d5b]' : 'bg-white/20 text-white/60'}`}>Compliance</span>
            </div>
          </div>
        </div>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
        
        {/* STEP 1: IDENTITY & CONTACT */}
        {step === 1 && (
          <div className="space-y-6">
            
            {/* VISIBLE ID FIELD - ADDRESSING YOUR ISSUE DIRECTLY */}
            <div>
              <label className={STYLES.label}>System ID (Auto-Generated)</label>
              <input 
                className={STYLES.inputReadOnly}
                value={formData.id}
                readOnly
              />
            </div>

            <div>
              <label className={STYLES.label}>Supplier Name <span className="text-red-500">*</span></label>
              <input 
                className={`${STYLES.inputBase} ${errors.name ? STYLES.inputError : STYLES.inputFocus}`}
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="Official Registered Company Name"
              />
              {errors.name && <p className={STYLES.errorText}>{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={STYLES.label}>Supplier Type</label>
                <div className="relative">
                  <select 
                    className={`${STYLES.selectBase} ${STYLES.inputFocus}`}
                    value={formData.businessType}
                    onChange={e => handleChange('businessType', e.target.value)}
                  >
                    <option value="Manufacturer">Manufacturer</option>
                    <option value="Trading Company">Trading Company</option>
                    <option value="Agent">Agent</option>
                    <option value="Wholesaler">Wholesaler</option>
                  </select>
                  <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">▼</div>
                </div>
              </div>
              <div>
                <label className={STYLES.label}>Country <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    className={`${STYLES.selectBase} ${errors.country ? STYLES.inputError : STYLES.inputFocus}`}
                    value={formData.country}
                    onChange={e => handleChange('country', e.target.value)}
                  >
                    <option value="">Select Country...</option>
                    {COUNTRY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">▼</div>
                </div>
                {errors.country && <p className={STYLES.errorText}>{errors.country}</p>}
              </div>
            </div>

            <div>
              <label className={STYLES.label}>Full Address</label>
              <textarea 
                className={`${STYLES.inputBase} ${STYLES.inputFocus} min-h-[80px] resize-none`}
                value={formData.address}
                onChange={e => handleChange('address', e.target.value)}
                placeholder="Street address, City, Province, Zip Code"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={STYLES.label}>Primary Contact Name <span className="text-red-500">*</span></label>
                <input 
                  className={`${STYLES.inputBase} ${errors.contactPerson ? STYLES.inputError : STYLES.inputFocus}`}
                  value={formData.contactPerson}
                  onChange={e => handleChange('contactPerson', e.target.value)}
                  placeholder="Full Name"
                />
                {errors.contactPerson && <p className={STYLES.errorText}>{errors.contactPerson}</p>}
              </div>
              <div>
                <label className={STYLES.label}>Email Address</label>
                <input 
                  type="email"
                  className={`${STYLES.inputBase} ${STYLES.inputFocus}`}
                  value={formData.contactEmail}
                  onChange={e => handleChange('contactEmail', e.target.value)}
                  placeholder="contact@supplier.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={STYLES.label}>Phone / WeChat / WhatsApp</label>
                <input 
                  className={`${STYLES.inputBase} ${STYLES.inputFocus}`}
                  value={formData.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  placeholder="+86..."
                />
              </div>
              <div>
                <label className={STYLES.label}>Website URL</label>
                <input 
                  className={`${STYLES.inputBase} ${STYLES.inputFocus}`}
                  value={formData.website}
                  onChange={e => handleChange('website', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: COMMERCIAL DETAILS */}
        {step === 2 && (
          <div className="space-y-6">
            
            <div>
              <label className={STYLES.label}>Product Categories (Capabilities)</label>
              <div className="flex flex-wrap gap-2 mb-2 p-1">
                {formData.capabilities?.map(tag => (
                  <span key={tag} className={STYLES.tagBase}>
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-blue-900"><CloseIcon className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <input 
                className={`${STYLES.inputBase} ${STYLES.inputFocus}`}
                value={catInput}
                onChange={e => setCatInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a category and press Enter (e.g. 'Activewear')"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={STYLES.label}>Monthly Capacity (Units)</label>
                <input 
                  type="number"
                  className={`${STYLES.inputBase} ${STYLES.inputFocus}`}
                  value={formData.capacity || ''}
                  onChange={e => handleChange('capacity', Number(e.target.value))}
                  placeholder="e.g. 50000"
                />
              </div>
              <div>
                <label className={STYLES.label}>Minimum Order Qty (MOQ)</label>
                <input 
                  type="number"
                  className={`${STYLES.inputBase} ${STYLES.inputFocus}`}
                  value={formData.moq || ''}
                  onChange={e => handleChange('moq', Number(e.target.value))}
                  placeholder="e.g. 500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={STYLES.label}>Preferred Currency</label>
                <div className="relative">
                  <select 
                    className={`${STYLES.selectBase} ${STYLES.inputFocus}`}
                    value={formData.currency}
                    onChange={e => handleChange('currency', e.target.value)}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="CNY">CNY (¥)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                  <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">▼</div>
                </div>
              </div>
              <div>
                <label className={STYLES.label}>Standard Incoterms</label>
                <div className="relative">
                  <select 
                    className={`${STYLES.selectBase} ${STYLES.inputFocus}`}
                    value={formData.incoterms}
                    onChange={e => handleChange('incoterms', e.target.value)}
                  >
                    <option value="FOB">FOB</option>
                    <option value="EXW">EXW</option>
                    <option value="DDP">DDP</option>
                    <option value="CIF">CIF</option>
                  </select>
                  <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">▼</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={STYLES.label}>Internal Rating</label>
                <div className="flex gap-2 items-center h-[46px] px-3 border border-slate-200 rounded-xl bg-slate-50">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      type="button"
                      onClick={() => handleChange('rating', star)}
                      className={`transition-transform hover:scale-110 ${star <= (formData.rating || 0) ? 'text-amber-400' : 'text-slate-300'}`}
                    >
                      <StarIcon className="w-6 h-6" filled={star <= (formData.rating || 0)} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={STYLES.label}>Source Channel</label>
                <div className="relative">
                  <select 
                    className={`${STYLES.selectBase} ${STYLES.inputFocus}`}
                    value={formData.source}
                    onChange={e => handleChange('source', e.target.value)}
                  >
                    <option value="Alibaba">Alibaba</option>
                    <option value="Trade Show">Trade Show</option>
                    <option value="Referral">Referral</option>
                    <option value="Direct Outreach">Direct Outreach</option>
                    <option value="Agent">Agent</option>
                  </select>
                  <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">▼</div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* STEP 3: COMPLIANCE & CERTIFICATIONS */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 border-b border-slate-200 pb-2">Compliance Standards</h4>
              <div className="grid grid-cols-2 gap-4">
                {COMPLIANCE_LIST.map(cert => (
                  <label key={cert} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.certifications?.includes(cert) 
                      ? 'bg-blue-50 border-blue-200 shadow-sm' 
                      : 'bg-white border-slate-100 hover:border-slate-300'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        formData.certifications?.includes(cert) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-100 border-slate-300'
                      }`}>
                        {formData.certifications?.includes(cert) && <CheckIcon className="w-3 h-3" />}
                      </div>
                      <span className={`text-sm font-bold ${
                        formData.certifications?.includes(cert) ? 'text-blue-800' : 'text-slate-600'
                      }`}>{cert}</span>
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={formData.certifications?.includes(cert)}
                      onChange={() => toggleCert(cert)}
                    />
                  </label>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-xs font-medium">
              <p><strong>Note:</strong> Upload actual certificate documents in the Supplier Detail view after creation.</p>
            </div>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
        <button 
          type="button"
          onClick={step === 1 ? onCancel : handleBack}
          className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors text-sm"
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </button>
        <button 
          type="button"
          onClick={step === 3 ? handleSubmit : handleNext}
          className="px-8 py-3 bg-[#003d5b] text-white rounded-xl font-bold shadow-lg hover:bg-sky-900 transition-all text-sm flex items-center gap-2"
        >
          {step === 3 ? 'Create Supplier' : 'Next Step'}
        </button>
      </div>
    </div>
  );
};

export default NewSupplierWizard;