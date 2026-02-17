import React from 'react';
import { Customer } from '../types';
import { Building2, User, MapPin, Mail, Phone, Globe, CreditCard, Briefcase, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';

interface Props { 
  customer: Customer; 
}

export const PrintableCustomer: React.FC<Props> = ({ customer }) => {
  return (
    <div id="printable-area" className="bg-white text-slate-900 p-12 max-w-[210mm] mx-auto min-h-[297mm] text-sm font-sans shadow-lg print:shadow-none print:w-full flex flex-col box-border">
      
      {/* Header */}
      <div className="border-b-4 border-[#003d5b] pb-6 mb-8 flex justify-between items-start shrink-0">
        <div>
          <Logo className="h-12 w-auto text-[#003d5b] mb-2" variant="full" />
          <p className="text-slate-500 font-bold text-lg">Customer Intelligence Profile</p>
        </div>
        <div className="text-right">
          <div className="bg-slate-100 px-4 py-2 rounded-lg inline-block print:border print:border-slate-300">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Internal UID</span>
            <span className="font-mono text-lg font-bold">{customer.id}</span>
          </div>
        </div>
      </div>

      {/* Main Identity Section */}
      <div className="mb-10 shrink-0">
        <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tight leading-none mb-4">{customer.companyName}</h1>
        <div className="flex gap-3">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase border border-blue-100 flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3" /> {customer.tier || 'Standard'} Tier
          </span>
          <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-[10px] font-black uppercase border border-slate-100">
            Status: {customer.status}
          </span>
        </div>
      </div>

      {/* Contact Information Grid */}
      <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 mb-8 shrink-0">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
          <User className="w-3 h-3" /> Strategic Contact Details
        </h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Key Representative</label>
              <p className="font-bold text-base text-slate-800">{customer.contactName || customer.contactPerson || 'N/A'}</p>
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Official Email</label>
              <p className="font-bold text-slate-800 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-500" /> {customer.email}
              </p>
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Direct Phone</label>
              <p className="font-bold text-slate-800 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-500" /> {customer.phone || 'N/A'}
              </p>
            </div>
          </div>
          <div className="space-y-4 border-l border-slate-200 pl-8">
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Business Vertical</label>
              <p className="font-bold text-slate-800 flex items-center gap-2 uppercase text-xs">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {customer.industry || 'General Retail'}
              </p>
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Procurement Level</label>
              <p className="font-bold text-slate-800">{customer.businessType || 'N/A'}</p>
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Lead Manager</label>
              <p className="font-bold text-slate-800">{customer.accountOwner || 'System Root'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Global Locations */}
      <div className="grid grid-cols-1 gap-8 flex-1">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
            <MapPin className="w-3 h-3" /> Regional Addresses
          </h3>
          <div className="space-y-6">
            <div className="border-l-4 border-[#003d5b] pl-6 py-2">
              <h4 className="text-[10px] font-black text-[#003d5b] uppercase tracking-widest mb-2">Billing HQ</h4>
              <p className="font-bold text-lg text-slate-800 leading-tight">{customer.billingStreet || customer.location || 'N/A'}</p>
              <p className="text-slate-500">{customer.billingCity} {customer.billingState} {customer.billingZip}</p>
              <p className="text-slate-500 font-bold uppercase tracking-tighter">{customer.billingCountry}</p>
            </div>

            <div className={`border-l-4 pl-6 py-2 ${customer.shippingSameAsBilling ? 'border-slate-200' : 'border-indigo-500'}`}>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Shipping Logistics Hub</h4>
              {customer.shippingSameAsBilling ? (
                <p className="text-slate-400 italic">Identical to Billing Headquaters</p>
              ) : (
                <>
                  <p className="font-bold text-lg text-slate-800 leading-tight">{customer.shippingStreet}</p>
                  <p className="text-slate-500">{customer.shippingCity} {customer.shippingState} {customer.shippingZip}</p>
                  <p className="text-slate-500 font-bold uppercase tracking-tighter">{customer.shippingCountry}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Commercial Summary */}
      <div className="mt-auto pt-10 border-t border-slate-100 flex justify-between items-end shrink-0">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Institutional Compliance</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-300" />
              <span className="text-xs font-bold text-slate-500">Net 30 Protocol</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-300" />
              <span className="text-xs font-bold text-slate-500">{customer.currency || 'USD'} Ledger</span>
            </div>
          </div>
        </div>
        <div className="text-right">
           <p className="text-[9px] text-slate-400 font-mono italic">Document Hash: CRM-${Date.now().toString(16).toUpperCase()}</p>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Generated: {new Date().toLocaleString()}</p>
        </div>
      </div>

    </div>
  );
};
