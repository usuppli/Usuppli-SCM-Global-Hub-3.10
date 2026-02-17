
import React, { useState } from 'react';
import { Shipment, Job, SampleRequest } from '../../types';
import { X, ChevronRight, Truck, MapPin, Calendar, Package, Globe, User, FileText, FlaskConical, Briefcase } from 'lucide-react';

const STYLES = {
  label: "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5",
  inputBase: "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 relative",
  inputFocus: "focus:bg-white focus:border-[#003d5b] focus:ring-2 focus:ring-[#003d5b]/20",
  inputReadOnly: "w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-mono text-slate-500 cursor-not-allowed",
  selectBase: "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none transition-all duration-200 appearance-none cursor-pointer",
  errorText: "mt-1 text-xs text-red-500 font-bold",
  sectionTitle: "text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 mt-2",
  toggleContainer: "flex p-1 bg-slate-100 rounded-xl mb-4",
  toggleButton: (active: boolean) => `flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${active ? 'bg-white text-[#003d5b] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`
};

interface Props {
  jobs: Job[];
  samples: SampleRequest[];
  onClose: () => void;
  onComplete: (shipment: Shipment) => void;
}

const CreateShipmentWizard: React.FC<Props> = ({ jobs, samples, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [scope, setScope] = useState<'Production' | 'Sample'>('Production');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Auto-generate ID immediately
  const [formData, setFormData] = useState<{
    id: string;
    trackingNumber: string;
    carrier: string;
    method: string;
    status: string;
    accountManager: string;
    origin: string;
    destination: string;
    etd: string;
    eta: string;
    jobId: string;
    linkedSampleId: string;
    accountType: string;
  }>({
    id: `SHP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    trackingNumber: '',
    carrier: 'DHL',
    method: 'Air',
    status: 'Booked',
    accountManager: '',
    origin: '',
    destination: '',
    etd: '',
    eta: '',
    jobId: '',
    linkedSampleId: '',
    accountType: 'Usuppli/Axcess'
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
        if (!formData.trackingNumber.trim()) newErrors.trackingNumber = "Tracking Number is required";
        if (!formData.accountManager.trim()) newErrors.accountManager = "Account Manager is required";
    }
    if (currentStep === 2) {
        if (!formData.origin.trim()) newErrors.origin = "Origin is required";
        if (!formData.destination.trim()) newErrors.destination = "Destination is required";
        if (!formData.eta) newErrors.eta = "ETA is required";
        
        // Context specific validation
        if (scope === 'Production' && !formData.jobId) newErrors.link = "Please link a Job";
        if (scope === 'Sample' && !formData.linkedSampleId) newErrors.link = "Please link a Sample Request";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep(s => s + 1);
  };

  const handleSubmit = () => {
    if (!validateStep(step)) return;

    const newShipment: Shipment = {
        id: formData.id,
        trackingNumber: formData.trackingNumber,
        carrier: formData.carrier,
        status: formData.status as any,
        origin: formData.origin,
        destination: formData.destination,
        eta: formData.eta,
        method: formData.method as any,
        currentLocation: 'Origin', // Default
        lastUpdated: new Date().toISOString(),
        
        // New Fields
        accountManager: formData.accountManager,
        accountType: formData.accountType as any,
        shipmentType: scope,
        
        // Link based on scope
        jobId: scope === 'Production' ? formData.jobId : undefined,
        linkedSampleId: scope === 'Sample' ? formData.linkedSampleId : undefined
    };

    onComplete(newShipment);
  };

  return (
    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
      
      {/* HEADER */}
      <div className="bg-[#003d5b] p-6 flex justify-between items-center text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Create New Shipment</h3>
            <p className="text-white/60 text-xs mt-1">Logistics & Tracking Protocol</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
        
        {/* STEP 1: CORE DETAILS */}
        {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                
                {/* ID (READ ONLY) */}
                <div>
                    <label className={STYLES.label}>Shipment Reference ID</label>
                    <input 
                        className={STYLES.inputReadOnly}
                        value={formData.id}
                        readOnly
                    />
                </div>

                {/* ROW 1: Tracking Number + Carrier */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className={STYLES.label}>Tracking Number <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Package className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                            <input 
                                className={`${STYLES.inputBase} ${errors.trackingNumber ? 'border-red-500' : STYLES.inputFocus} pl-10`}
                                placeholder="e.g. MSKU901283"
                                value={formData.trackingNumber}
                                onChange={(e) => handleChange('trackingNumber', e.target.value)}
                            />
                        </div>
                        {errors.trackingNumber && <p className={STYLES.errorText}>{errors.trackingNumber}</p>}
                    </div>
                    <div>
                        <label className={STYLES.label}>Carrier</label>
                        <select 
                            className={`${STYLES.selectBase} ${STYLES.inputFocus}`}
                            value={formData.carrier}
                            onChange={(e) => handleChange('carrier', e.target.value)}
                        >
                            <option>DHL</option>
                            <option>Maersk</option>
                            <option>FedEx</option>
                            <option>MSC</option>
                            <option>UPS</option>
                            <option>CMA CGM</option>
                            <option>Cosco</option>
                        </select>
                    </div>
                </div>

                {/* ROW 2: Type of Shipment + Method */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className={STYLES.label}>Type of Shipment</label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                            <select 
                                className={`${STYLES.selectBase} ${STYLES.inputFocus} pl-10`}
                                value={formData.accountType}
                                onChange={(e) => handleChange('accountType', e.target.value)}
                            >
                                <option value="Usuppli/Axcess">Usuppli/Axcess</option>
                                <option value="Existing Customer">Existing Customer</option>
                                <option value="New Customer">New Customer</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className={STYLES.label}>Transport Method</label>
                        <select 
                            className={`${STYLES.selectBase} ${STYLES.inputFocus}`}
                            value={formData.method}
                            onChange={(e) => handleChange('method', e.target.value)}
                        >
                            <option>Air</option>
                            <option>Ocean</option>
                            <option>Sea</option>
                            <option>Rail</option>
                            <option>Truck</option>
                        </select>
                    </div>
                </div>

                {/* ROW 3: Status + Account Manager */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className={STYLES.label}>Current Status</label>
                        <select 
                            className={`${STYLES.selectBase} ${STYLES.inputFocus}`}
                            value={formData.status}
                            onChange={(e) => handleChange('status', e.target.value)}
                        >
                            <option>Booked</option>
                            <option>In Transit</option>
                            <option>Customs</option>
                            <option>Delivered</option>
                            <option>Exception</option>
                        </select>
                    </div>
                    <div>
                        <label className={STYLES.label}>Account Manager <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                            <input 
                                className={`${STYLES.inputBase} ${errors.accountManager ? 'border-red-500' : STYLES.inputFocus} pl-10`}
                                placeholder="Manager Name"
                                value={formData.accountManager}
                                onChange={(e) => handleChange('accountManager', e.target.value)}
                            />
                        </div>
                        {errors.accountManager && <p className={STYLES.errorText}>{errors.accountManager}</p>}
                    </div>
                </div>
            </div>
        )}

        {/* STEP 2: ROUTE & TIMELINE */}
        {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                
                <h4 className={STYLES.sectionTitle}>Route Information</h4>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className={STYLES.label}>Origin <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                            <input 
                                className={`${STYLES.inputBase} ${errors.origin ? 'border-red-500' : STYLES.inputFocus} pl-10`}
                                placeholder="City, Country"
                                value={formData.origin}
                                onChange={(e) => handleChange('origin', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className={STYLES.label}>Destination <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                            <input 
                                className={`${STYLES.inputBase} ${errors.destination ? 'border-red-500' : STYLES.inputFocus} pl-10`}
                                placeholder="City, Country"
                                value={formData.destination}
                                onChange={(e) => handleChange('destination', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className={STYLES.label}>ETD (Departure)</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                            <input 
                                type="date"
                                className={`${STYLES.inputBase} ${STYLES.inputFocus} pl-10`}
                                value={formData.etd}
                                onChange={(e) => handleChange('etd', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className={STYLES.label}>ETA (Arrival) <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                            <input 
                                type="date"
                                className={`${STYLES.inputBase} ${errors.eta ? 'border-red-500' : STYLES.inputFocus} pl-10`}
                                value={formData.eta}
                                onChange={(e) => handleChange('eta', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <h4 className={STYLES.sectionTitle}>Link & Context</h4>

                <div className={STYLES.toggleContainer}>
                    <button 
                        type="button"
                        onClick={() => setScope('Production')} 
                        className={STYLES.toggleButton(scope === 'Production')}
                    >
                        <Globe className="w-4 h-4" /> Production Job
                    </button>
                    <button 
                        type="button"
                        onClick={() => setScope('Sample')} 
                        className={STYLES.toggleButton(scope === 'Sample')}
                    >
                        <FlaskConical className="w-4 h-4" /> Sample Request
                    </button>
                </div>

                <div>
                    <label className={STYLES.label}>
                        {scope === 'Production' ? 'Linked Job Order' : 'Linked Sample Request'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        {scope === 'Production' ? (
                            <>
                                <Globe className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                <select 
                                    className={`${STYLES.selectBase} ${errors.link ? 'border-red-500' : STYLES.inputFocus} pl-10`}
                                    value={formData.jobId}
                                    onChange={(e) => handleChange('jobId', e.target.value)}
                                >
                                    <option value="">Select Active Job...</option>
                                    {jobs.map(j => (
                                        <option key={j.id} value={j.id}>{j.jobName} ({j.id})</option>
                                    ))}
                                </select>
                            </>
                        ) : (
                            <>
                                <FileText className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                <select 
                                    className={`${STYLES.selectBase} ${errors.link ? 'border-red-500' : STYLES.inputFocus} pl-10`}
                                    value={formData.linkedSampleId}
                                    onChange={(e) => handleChange('linkedSampleId', e.target.value)}
                                >
                                    <option value="">Select Sample Request...</option>
                                    {samples.map(s => (
                                        <option key={s.id} value={s.id}>{s.id} - {s.type}</option>
                                    ))}
                                </select>
                            </>
                        )}
                    </div>
                    {errors.link && <p className={STYLES.errorText}>{errors.link}</p>}
                </div>

            </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
        <button 
          type="button"
          onClick={step === 1 ? onClose : () => setStep(1)}
          className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors text-sm"
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </button>
        <button 
          type="button"
          onClick={step === 1 ? handleNext : handleSubmit}
          className="px-8 py-3 bg-[#003d5b] text-white rounded-xl font-bold shadow-lg hover:bg-sky-900 transition-all text-sm flex items-center gap-2"
        >
          {step === 1 ? 'Next Step' : 'Create Shipment'}
          {step === 1 && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default CreateShipmentWizard;
