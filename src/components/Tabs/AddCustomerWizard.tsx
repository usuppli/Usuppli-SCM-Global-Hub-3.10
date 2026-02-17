
import React, { useState, useEffect } from 'react';
import { 
  X, Save, ChevronRight, ChevronLeft, Building2, User, Phone, Mail, 
  MapPin, Globe, CreditCard, FileText, Briefcase, 
  Zap, ShieldCheck, Hash, UserCheck, Share2
} from 'lucide-react';
import { Customer, Language, User as UserType } from '../../types';

// --- STYLES ---
const STYLES = {
  label: "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5",
  inputBase: "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 relative",
  inputFocus: "focus:bg-white focus:border-[#003d5b] focus:ring-2 focus:ring-[#003d5b]/20",
  inputReadOnly: "w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-mono text-slate-500 cursor-not-allowed",
  selectBase: "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none transition-all duration-200 appearance-none cursor-pointer",
  sectionTitle: "text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 mt-2",
  errorText: "mt-1 text-xs text-red-500 font-bold",
  checkboxLabel: "text-sm font-medium text-slate-700 select-none cursor-pointer ml-2"
};

// --- DATA LISTS ---
const COUNTRIES = [
  "USA", "Mexico", "Brazil", "Guyana", "Bahamas", "Grenada", "Jamaica", 
  "South Africa", "Cameroon", "Nigeria", "Ghana", "Tanzania", "Kenya", "Angola"
];

const INDUSTRIES = ["Non-Profit", "Military", "Government", "Retail", "Manufacturing", "Other"];

const BUSINESS_TYPES = [
  "Importer", "Influencer", "University/School", "Corporation", 
  "Non-Profit / Church / ORG.", "Online / Amazon Seller", "Small Business"
];

const SOCIAL_PLATFORMS = ["Instagram (IG)", "Facebook", "TikTok", "LinkedIn", "Other"];

const COMM_CHANNELS = ["Email", "Phone", "WhatsApp", "WeChat"];

// FIXED: Matched interface to App.tsx exactly
interface AddCustomerWizardProps {
  isOpen?: boolean;
  lang?: Language;
  users?: UserType[];
  onSave: (customer: Customer) => void;
  onClose: () => void;
}

type WizardMode = 'FAST' | 'ADVANCED';

export default function AddCustomerWizard({ lang = 'en', users = [], onSave, onClose }: AddCustomerWizardProps) {
  const [mode, setMode] = useState<WizardMode>('FAST');
  const [step, setStep] = useState(1); 
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Custom State for "Other" inputs
  const [isCustomCountry, setIsCustomCountry] = useState(false);
  const [customCountryValue, setCustomCountryValue] = useState('');
  
  const [isCustomSocial, setIsCustomSocial] = useState(false);
  const [customSocialValue, setCustomSocialValue] = useState('');

  const [formData, setFormData] = useState<Partial<Customer>>({
    id: `CUST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'Pending',
    tier: 'Standard',
    totalSpend: 0,
    orders: 0,
    currency: 'USD',
    billingCountry: 'USA',
    communicationPreference: []
  });

  // Reset steps when toggling mode
  useEffect(() => {
    setStep(1);
  }, [mode]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleCommToggle = (channel: string) => {
    const current = formData.communicationPreference || [];
    const updated = current.includes(channel)
      ? current.filter(c => c !== channel)
      : [...current, channel];
    handleChange('communicationPreference', updated);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'Other') {
      setIsCustomCountry(true);
      handleChange('billingCountry', '');
    } else {
      setIsCustomCountry(false);
      handleChange('billingCountry', val);
    }
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'Other') {
      setIsCustomSocial(true);
      handleChange('notes', 'Social: Other'); 
    } else {
      setIsCustomSocial(false);
      handleChange('notes', `Social: ${val}`);
    }
  };

  const handleSaveClick = () => {
    // Critical Validation
    const newErrors: Record<string, string> = {};
    if (!formData.contactName) newErrors.contactName = "Contact Person is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // FIXED: If validation fails on the last step, bump them back to the step where the error is
      if (mode === 'FAST') setStep(1);
      if (mode === 'ADVANCED') setStep(2);
      return;
    }

    // Logic: If Company Name blank -> Use Contact Person
    const finalCompany = formData.companyName?.trim() ? formData.companyName : formData.contactName;
    // Logic: Custom Country Write-in
    const finalCountry = isCustomCountry ? customCountryValue : formData.billingCountry;
    // Logic: Append Social to notes if custom
    const finalNotes = isCustomSocial 
      ? `Social: ${customSocialValue} | ${formData.notes || ''}` 
      : formData.notes;

    const newCustomer: Customer = {
      id: formData.id!,
      companyName: finalCompany || 'Unknown',
      contactName: formData.contactName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      location: formData.location || (finalCountry ? `${formData.billingCity || ''}, ${finalCountry}` : 'Unknown Location'),
      status: mode === 'ADVANCED' ? 'Active' : 'Pending',
      tier: formData.tier as any || 'Standard',
      totalSpend: 0,
      // Fixed: totalOrders is required in Customer type
      totalOrders: 0,
      orders: 0,
      lastOrder: new Date().toISOString().split('T')[0],
      region: finalCountry || 'North America',
      billingCountry: finalCountry,
      notes: finalNotes,
      ...formData
    };

    // FIXED: Now calls onSave instead of onComplete
    onSave(newCustomer);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="bg-[#003d5b] p-6 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">New Customer Onboarding</h3>
              <p className="text-white/60 text-xs mt-1">Client Acquisition Protocol v3.0</p>
            </div>
          </div>
          {/* FIXED: Now calls onClose instead of onCancel */}
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* TABS */}
        <div className="flex border-b border-slate-100 bg-slate-50">
          <button 
            onClick={() => setMode('FAST')} 
            className={`flex-1 py-4 text-sm font-bold text-center transition-colors border-b-2 flex items-center justify-center gap-2 ${
              mode === 'FAST' 
                ? 'border-[#003d5b] text-[#003d5b] bg-white' 
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-4 h-4" /> Fast Track (Sales)
          </button>
          <button 
            onClick={() => setMode('ADVANCED')} 
            className={`flex-1 py-4 text-sm font-bold text-center transition-colors border-b-2 flex items-center justify-center gap-2 ${
              mode === 'ADVANCED' 
                ? 'border-purple-600 text-purple-700 bg-purple-50/30' 
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Advanced (Ops)
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          
          {/* ================= FAST TRACK ================= */}
          {mode === 'FAST' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
              
              {/* FAST STEP 1: IDENTITY */}
              {step === 1 && (
                <>
                  <h4 className={STYLES.sectionTitle}>Step 1: Identity & Contact</h4>
                  
                  {/* Internal ID & Account Owner (ROW 1) */}
                  <div className="grid grid-cols-12 gap-6">
                     <div className="col-span-4">
                        <label className={STYLES.label}>Internal ID</label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                            <input className={`${STYLES.inputReadOnly} pl-10`} value={formData.id} readOnly />
                        </div>
                     </div>
                     <div className="col-span-8">
                        <label className={STYLES.label}>Account Owner</label>
                        <div className="relative">
                          <UserCheck className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            className={`${STYLES.inputBase} ${STYLES.inputFocus} pl-10`}
                            placeholder="Sales Rep Name"
                            value={formData.accountOwner || ''} 
                            onChange={(e) => handleChange('accountOwner', e.target.value)} 
                          />
                        </div>
                     </div>
                  </div>

                  {/* Company Name & Contact Person (ROW 2) */}
                  <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className={STYLES.label}>Company Name</label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            className={`${STYLES.inputBase} ${STYLES.inputFocus} pl-10`}
                            placeholder="If blank, same as Contact"
                            value={formData.companyName || ''} 
                            onChange={(e) => handleChange('companyName', e.target.value)} 
                          />
                        </div>
                      </div>
                      <div>
                        <label className={STYLES.label}>Contact Person <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            className={`${STYLES.inputBase} ${STYLES.inputFocus} pl-10 ${errors.contactName ? 'border-red-500' : ''}`}
                            value={formData.contactName || ''} 
                            onChange={(e) => handleChange('contactName', e.target.value)} 
                          />
                        </div>
                        {errors.contactName && <p className={STYLES.errorText}>{errors.contactName}</p>}
                      </div>
                  </div>

                  {/* Email & Phone (ROW 3) */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={STYLES.label}>Email Address <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <input 
                          type="email" 
                          className={`${STYLES.inputBase} ${STYLES.inputFocus} pl-10 ${errors.email ? 'border-red-500' : ''}`}
                          value={formData.email || ''} 
                          onChange={(e) => handleChange('email', e.target.value)} 
                        />
                      </div>
                      {errors.email && <p className={STYLES.errorText}>{errors.email}</p>}
                    </div>
                    <div>
                      <label className={STYLES.label}>Contact No. <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <input 
                          type="tel" 
                          className={`${STYLES.inputBase} ${STYLES.inputFocus} pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                          value={formData.phone || ''} 
                          onChange={(e) => handleChange('phone', e.target.value)} 
                        />
                      </div>
                      {errors.phone && <p className={STYLES.errorText}>{errors.phone}</p>}
                    </div>
                  </div>
                </>
              )}

              {/* FAST STEP 2: BUSINESS & ADDRESS */}
              {step === 2 && (
                <>
                  <h4 className={STYLES.sectionTitle}>Step 2: Business & Location</h4>
                  
                  {/* Type of Business & Social Media */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={STYLES.label}>Type of Business</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <select 
                          className={`${STYLES.selectBase} ${STYLES.inputFocus} pl-10`}
                          value={formData.businessType || ''}
                          onChange={(e) => handleChange('businessType', e.target.value)}
                        >
                          <option value="">Select Type</option>
                          {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className={STYLES.label}>Social Media</label>
                      <div className="relative">
                        <Share2 className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <select 
                          className={`${STYLES.selectBase} ${STYLES.inputFocus} pl-10`}
                          onChange={handleSocialChange}
                        >
                          <option value="">Select Platform</option>
                          {SOCIAL_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      
                      {/* Social Write-in */}
                      {isCustomSocial && (
                        <div className="mt-2 animate-in fade-in">
                           <input 
                              className={`${STYLES.inputBase} ${STYLES.inputFocus}`} 
                              placeholder="e.g. @MyHandle"
                              value={customSocialValue}
                              onChange={(e) => setCustomSocialValue(e.target.value)}
                           />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className={STYLES.label}>Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                className={`${STYLES.inputBase} ${STYLES.inputFocus} pl-10`}
                                placeholder="Street Address"
                                value={formData.billingStreet || ''}
                                onChange={(e) => handleChange('billingStreet', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <input 
                            type="text" className={`${STYLES.inputBase} ${STYLES.inputFocus}`} placeholder="City"
                            value={formData.billingCity || ''} onChange={(e) => handleChange('billingCity', e.target.value)}
                        />
                    </div>
                    <div>
                        <input 
                            type="text" className={`${STYLES.inputBase} ${STYLES.inputFocus}`} placeholder="State/Province"
                            value={formData.billingState || ''} onChange={(e) => handleChange('billingState', e.target.value)}
                        />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ================= ADVANCED TRACK ================= */}
          {mode === 'ADVANCED' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
               
               {/* ADV STEP 1: IDENTITY & BIZ TYPE */}
               {step === 1 && (
                 <>
                    <h4 className={STYLES.sectionTitle}>Corporate Identity</h4>
                    
                    {/* Internal ID & Account Owner (Row 1) */}
                    <div className="grid grid-cols-12 gap-6">
                       <div className="col-span-4">
                          <label className={STYLES.label}>Internal ID (Auto)</label>
                          <div className="relative">
                              <Hash className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                              <input className={`${STYLES.inputReadOnly} pl-10`} value={formData.id} readOnly />
                          </div>
                       </div>
                       <div className="col-span-8">
                          <label className={STYLES.label}>Account Owner</label>
                          <input 
                              className={`${STYLES.inputBase} ${STYLES.inputFocus}`} 
                              placeholder="Name"
                              value={formData.accountOwner || ''}
                              onChange={(e) => handleChange('accountOwner', e.target.value)}
                          />
                       </div>
                    </div>

                    {/* Company Name & Industry (Row 2) */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className={STYLES.label}>Company Name</label>
                            <input 
                                className={`${STYLES.inputBase} ${STYLES.inputFocus}`} 
                                placeholder="If Blank, Same as Contact"
                                value={formData.companyName || ''}
                                onChange={(e) => handleChange('companyName', e.target.value)}
                            />
                        </div>
                        <div>
                          <label className={STYLES.label}>Industry</label>
                          <select 
                            className={`${STYLES.selectBase} ${STYLES.inputFocus}`}
                            value={formData.industry || ''}
                            onChange={(e) => handleChange('industry', e.target.value)}
                          >
                             <option value="">Select Industry</option>
                             {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                          </select>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div>
                          <label className={STYLES.label}>Type of Business</label>
                          <select 
                            className={`${STYLES.selectBase} ${STYLES.inputFocus}`}
                            value={formData.businessType || ''}
                            onChange={(e) => handleChange('businessType', e.target.value)}
                          >
                             <option value="">Select Type</option>
                             {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                       </div>
                       <div>
                            <label className={STYLES.label}>Account Source</label>
                            <select 
                                className={`${STYLES.selectBase} ${STYLES.inputFocus}`}
                                value={formData.accountSource || ''}
                                onChange={(e) => handleChange('accountSource', e.target.value)}
                            >
                                <option value="">Select Source</option>
                                <option>Referral</option>
                                <option>Trade Show</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>
                 </>
               )}

               {/* ADV STEP 2: CONTACT & PREFS */}
               {step === 2 && (
                 <>
                    <h4 className={STYLES.sectionTitle}>Contact & Preferences</h4>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className={STYLES.label}>Contact Person <span className="text-red-500">*</span></label>
                            <input 
                                className={`${STYLES.inputBase} ${STYLES.inputFocus} ${errors.contactName ? 'border-red-500' : ''}`} 
                                value={formData.contactName || ''}
                                onChange={(e) => handleChange('contactName', e.target.value)}
                            />
                            {errors.contactName && <p className={STYLES.errorText}>{errors.contactName}</p>}
                        </div>
                        <div>
                            <label className={STYLES.label}>Email <span className="text-red-500">*</span></label>
                            <input 
                                className={`${STYLES.inputBase} ${STYLES.inputFocus} ${errors.email ? 'border-red-500' : ''}`} 
                                value={formData.email || ''}
                                onChange={(e) => handleChange('email', e.target.value)}
                            />
                            {errors.email && <p className={STYLES.errorText}>{errors.email}</p>}
                        </div>
                        <div>
                            <label className={STYLES.label}>Contact No. <span className="text-red-500">*</span></label>
                            <input 
                                className={`${STYLES.inputBase} ${STYLES.inputFocus} ${errors.phone ? 'border-red-500' : ''}`} 
                                value={formData.phone || ''}
                                onChange={(e) => handleChange('phone', e.target.value)}
                            />
                            {errors.phone && <p className={STYLES.errorText}>{errors.phone}</p>}
                        </div>
                    </div>

                    <div>
                        <label className={STYLES.label}>Communication Preference</label>
                        <div className="grid grid-cols-2 gap-3 mt-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            {COMM_CHANNELS.map(channel => (
                                <label key={channel} className="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                        checked={(formData.communicationPreference || []).includes(channel)}
                                        onChange={() => handleCommToggle(channel)}
                                    />
                                    <span className={STYLES.checkboxLabel}>{channel}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                 </>
               )}

               {/* ADV STEP 3: LOCATION (COUNTRY LIST) */}
               {step === 3 && (
                 <>
                    <h4 className={STYLES.sectionTitle}>Global Location</h4>
                    
                    <div className="space-y-4">
                        <div>
                            <label className={STYLES.label}>Country</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                <select 
                                    className={`${STYLES.selectBase} ${STYLES.inputFocus} pl-10`}
                                    value={isCustomCountry ? 'Other' : formData.billingCountry}
                                    onChange={handleCountryChange}
                                >
                                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    <option value="Other">Other (Write-in)</option>
                                </select>
                            </div>
                            
                            {/* Write-in Field */}
                            {isCustomCountry && (
                                <div className="mt-2 animate-in fade-in">
                                    <input 
                                        className={`${STYLES.inputBase} ${STYLES.inputFocus}`} 
                                        placeholder="Type Country Name..."
                                        value={customCountryValue}
                                        onChange={(e) => setCustomCountryValue(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className={STYLES.label}>Street Address</label>
                                <input 
                                    className={`${STYLES.inputBase} ${STYLES.inputFocus}`} 
                                    value={formData.billingStreet || ''}
                                    onChange={(e) => handleChange('billingStreet', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={STYLES.label}>City</label>
                                <input 
                                    className={`${STYLES.inputBase} ${STYLES.inputFocus}`} 
                                    value={formData.billingCity || ''}
                                    onChange={(e) => handleChange('billingCity', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={STYLES.label}>Zip / Postal</label>
                                <input 
                                    className={`${STYLES.inputBase} ${STYLES.inputFocus}`} 
                                    value={formData.billingZip || ''}
                                    onChange={(e) => handleChange('billingZip', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                 </>
               )}

               {/* ADV STEP 4: REVIEW */}
               {step === 4 && (
                 <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-purple-600">
                       <FileText className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Review & Create</h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">
                       Creating active customer record for:
                    </p>
                    <div className="bg-slate-50 p-4 rounded-xl text-left text-xs space-y-2 max-w-xs mx-auto border border-slate-100 font-medium">
                       <div className="flex justify-between"><span className="text-slate-500">Name:</span> <span>{formData.companyName || formData.contactName}</span></div>
                       <div className="flex justify-between"><span className="text-slate-500">Country:</span> <span>{isCustomCountry ? customCountryValue : formData.billingCountry}</span></div>
                       <div className="flex justify-between"><span className="text-slate-500">Owner:</span> <span>{formData.accountOwner || 'Unassigned'}</span></div>
                    </div>
                 </div>
               )}

            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
          {/* FIXED: Now calls onClose */}
          <button 
            onClick={onClose} 
            className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors text-sm"
          >
            Cancel
          </button>
          
          {mode === 'FAST' ? (
            <>
                {step === 2 && (
                    <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200 text-sm flex items-center gap-2">
                        <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                )}
                {step === 1 ? (
                    <button onClick={() => setStep(2)} className="px-8 py-3 bg-[#003d5b] text-white rounded-xl font-bold shadow-lg hover:bg-sky-900 transition-all text-sm flex items-center gap-2">
                        Next Step <ChevronRight className="w-4 h-4" />
                    </button>
                ) : (
                    // FIXED: handleSaveClick wrapper
                    <button onClick={handleSaveClick} className="px-8 py-3 bg-[#003d5b] text-white rounded-xl font-bold shadow-lg hover:bg-sky-900 transition-all text-sm flex items-center gap-2">
                        <Save className="w-4 h-4" /> Create Customer
                    </button>
                )}
            </>
          ) : (
            <>
               {step > 1 && (
                 <button 
                   onClick={() => setStep(step - 1)} 
                   className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors text-sm flex items-center gap-2"
                 >
                   <ChevronLeft className="w-4 h-4" /> Back
                 </button>
               )}
               <button 
                 // FIXED: handleSaveClick wrapper
                 onClick={() => step < 4 ? setStep(step + 1) : handleSaveClick()} 
                 className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg hover:bg-purple-700 transition-all text-sm flex items-center gap-2"
               >
                 {step < 4 ? 'Next Step' : 'Complete Onboarding'}
                 {step < 4 ? <ChevronRight className="w-4 h-4" /> : <Save className="w-4 h-4" />}
               </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
