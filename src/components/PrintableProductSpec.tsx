import React from 'react';
import { Product } from '../types';
import { Logo } from './Logo';
import { Package, Hash, Tag, Scale, Layers } from 'lucide-react';

interface Props {
  product: Product;
}

export const PrintableProductSpec: React.FC<Props> = ({ product }) => {
  const unitCost = Object.values(product.costVariables || {}).reduce((acc: number, val: any) => acc + (Number(val) || 0), 0);

  return (
    <div id="printable-area" className="bg-white text-slate-900 p-12 max-w-[210mm] mx-auto min-h-[297mm] text-sm font-sans shadow-lg print:shadow-none print:w-full flex flex-col">
      
      {/* Header */}
      <div className="border-b-4 border-[#003d5b] pb-6 mb-8 flex justify-between items-start shrink-0">
        <div>
          <Logo className="h-12 w-auto text-[#003d5b] mb-2" variant="full" />
          <p className="text-slate-500 font-bold text-lg">Product Specification Sheet</p>
        </div>
        <div className="text-right">
          <div className="bg-slate-100 px-4 py-2 rounded-lg inline-block print:border print:border-slate-300">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Internal ID</span>
            <span className="font-mono text-lg font-bold">{product.id}</span>
          </div>
        </div>
      </div>

      {/* Portrait Content: Top-Down */}
      <div className="flex flex-col gap-8 flex-1">
        
        {/* Top: Image Section */}
        <div className="w-full">
            <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center p-6 h-80">
                {product.image ? (
                    <img src={product.image} className="max-w-full max-h-full object-contain" alt={product.name} />
                ) : (
                    <div className="text-slate-300 flex flex-col items-center">
                        <Package className="w-16 h-16 mb-2 opacity-20" />
                        <span className="font-bold text-xs uppercase tracking-widest">No Media Asset</span>
                    </div>
                )}
            </div>
        </div>

        {/* Middle: Technical Details */}
        <div className="space-y-8">
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                Technical DNA
              </h4>
              <div className="grid grid-cols-3 gap-6">
                  <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                          <Tag className="w-3 h-3" /> Product Name
                      </h4>
                      <p className="font-bold text-sm">{product.name}</p>
                  </div>
                  <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                          <Hash className="w-3 h-3" /> Brand Ref
                      </h4>
                      <p className="font-bold text-sm">{product.brand}</p>
                  </div>
                  <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Category</h4>
                      <p className="font-bold text-sm">{product.category}</p>
                  </div>
                  <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">HS Code</h4>
                      <p className="font-mono font-bold text-blue-600">{product.hsCode || 'PENDING'}</p>
                  </div>
                  <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Material</h4>
                      <p className="font-bold text-sm">{product.material || 'Standard'}</p>
                  </div>
                  <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Lead Time</h4>
                      <p className="font-bold text-sm">{product.leadTime || 'N/A'}</p>
                  </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                            <Scale className="w-3 h-3" /> Unit weight
                        </h4>
                        <p className="font-black text-blue-900">{product.dimensions.weightKg} kg</p>
                    </div>
                    <div>
                        <h4 className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Dimensions</h4>
                        <p className="font-black text-blue-900 text-xs">{product.dimensions.lengthCm}x{product.dimensions.widthCm}x{product.dimensions.heightCm} cm</p>
                    </div>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                       <Layers className="w-3 h-3" /> Construction
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed italic line-clamp-3">
                        {product.construction || 'Standard manufacturing process required.'}
                    </p>
                </div>
            </div>
        </div>

        {/* Bottom: Cost Table */}
        <div className="mt-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Unit Cost Breakdown</h4>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200">
                <th className="p-3 text-[10px] font-bold uppercase text-slate-500 tracking-wider">Cost Variable</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-500 tracking-wider text-right">Value (USD)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(product.costVariables || {}).filter(([_, val]) => !!val).map(([key, val]) => (
                  <tr key={key} className="border-b border-slate-100">
                      <td className="p-3 capitalize text-xs font-bold text-slate-600">{key.replace(/([A-Z])/g, ' $1')}</td>
                      <td className="p-3 text-right font-mono font-bold text-xs">${Number(val).toFixed(2)}</td>
                  </tr>
              ))}
              <tr className="bg-[#003d5b] text-white">
                <td className="p-4 font-black uppercase text-xs">Ex-Factory Unit Target</td>
                <td className="p-4 text-right font-black text-lg font-mono">${unitCost.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-8 flex justify-between items-end border-t border-slate-100 shrink-0">
        <div className="text-[9px] text-slate-400 space-y-1">
          <p>Generated via Usuppli Workspace Engine</p>
          <p>Institutional Compliance: TECH-SPEC-P1</p>
          <p>Timestamp: {new Date().toLocaleString()}</p>
        </div>
        <div className="text-right">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Documentation</span>
        </div>
      </div>

    </div>
  );
};