import React from 'react';
import { Job, Factory, Customer, Product } from '../types';
import { Logo } from './Logo';

interface Props {
  job: Job;
  factory?: Factory;
  customer?: Customer;
  product?: Product;
}

const PrintableOrder: React.FC<Props> = ({ job, factory, customer, product }) => {
  return (
    <div className="w-[297mm] min-h-[210mm] bg-white p-[15mm] text-slate-900 box-border relative">
        
        {/* HEADER */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
            <div>
                <div className="text-[#003d5b] mb-2"><Logo variant="full" className="h-12" /></div>
                <div className="text-xs font-bold text-slate-500 space-y-1">
                    <p>87 Hope Drive</p>
                    <p>Dallas, Georgia, 30157</p>
                    <p>+1-4702704180</p>
                </div>
            </div>
            <div className="text-right">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter">PURCHASE ORDER</h1>
                <p className="text-lg font-mono font-bold text-slate-500 mt-2">{job.id}</p>
                <p className="text-sm font-bold text-slate-400">Date: {new Date().toLocaleDateString()}</p>
            </div>
        </div>

        {/* INFO GRID */}
        <div className="grid grid-cols-2 gap-12 mb-8">
            <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-200 pb-1">Vendor (Factory)</h3>
                <p className="font-bold text-lg">{factory?.name || 'N/A'}</p>
                <p className="text-sm">{factory?.location || 'N/A'}</p>
                <p className="text-sm mt-1">Attn: {factory?.contact || 'N/A'}</p>
                <p className="text-sm">{factory?.phone || ''}</p>
            </div>
            <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-200 pb-1">Ship To</h3>
                <p className="font-bold text-lg">{job.destinationAddress || 'TBD'}</p>
                <p className="text-sm mt-1">Attn: {job.leadBuyer || 'Receiving Dept'}</p>
                <p className="text-sm text-slate-500 mt-1">{customer?.companyName || 'N/A'}</p>
            </div>
        </div>

        {/* LOGISTICS STRIP */}
        <div className="grid grid-cols-4 gap-4 mb-8 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Incoterms</label>
                <p className="font-bold text-sm">{job.incoterms || 'FOB'}</p>
            </div>
            <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Ship Method</label>
                <p className="font-bold text-sm">{job.shippingMethod || 'Sea'}</p>
            </div>
            <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Payment Terms</label>
                <p className="font-bold text-sm">{job.paymentTerms || 'Standard'}</p>
            </div>
            <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase">Target Delivery</label>
                <p className="font-bold text-sm">{job.deliveryDate}</p>
            </div>
        </div>

        {/* LINE ITEMS */}
        <table className="w-full mb-8">
            <thead>
                <tr className="bg-slate-900 text-white text-xs uppercase">
                    <th className="p-3 text-left">Product / SKU</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-center">Quantity</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Total</th>
                </tr>
            </thead>
            <tbody className="text-sm">
                <tr className="border-b border-slate-200">
                    <td className="p-3 font-bold">
                        {product?.name || job.jobName}
                        <div className="text-xs font-normal text-slate-500 font-mono mt-0.5">{job.sku || 'N/A'}</div>
                    </td>
                    <td className="p-3 text-slate-600 max-w-[300px]">{job.description || 'Production Run'}</td>
                    <td className="p-3 text-center font-bold">{job.quantity.toLocaleString()}</td>
                    <td className="p-3 text-right">$0.00</td>
                    <td className="p-3 text-right font-bold">$0.00</td>
                </tr>
            </tbody>
        </table>

        {/* NOTES & SIGNATURE */}
        <div className="grid grid-cols-2 gap-12 mt-auto">
            <div className="text-xs text-slate-500 space-y-2">
                <h4 className="font-bold text-slate-700 uppercase">Packaging Instructions:</h4>
                <p className="p-2 bg-slate-50 rounded border border-slate-100">{job.packagingInstructions || 'Standard Export Packaging'}</p>
            </div>
            <div className="flex flex-col justify-end">
                <div className="border-b-2 border-slate-300 mb-2"></div>
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                    <span>Authorized Signature</span>
                    <span>Date</span>
                </div>
            </div>
        </div>

    </div>
  );
};

export default PrintableOrder;