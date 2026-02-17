import React from 'react';
import { SampleRequest, Factory, Product } from '../types';

interface Props { sample: SampleRequest; factory?: Factory; product?: Product; }

export const PrintableSample: React.FC<Props> = ({ sample, factory, product }) => {
  return (
    <div id="printable-area" className="bg-white text-slate-900 p-8 max-w-[210mm] mx-auto min-h-[297mm] text-sm font-sans">
      <div className="border-b-2 border-blue-900 pb-6 mb-8">
        <h1 className="text-3xl font-black text-blue-900">SAMPLE REQUEST</h1>
        <p>Ref: {sample.id}</p>
      </div>
      <div className="p-4 bg-slate-50 rounded-xl mb-8">
        <p><strong>Factory:</strong> {factory?.name}</p>
        <p><strong>Product:</strong> {sample.productName || product?.name}</p>
        <p><strong>Type:</strong> {sample.type}</p>
      </div>
      <div className="border-2 border-dashed border-slate-300 p-6 rounded-xl">
        <h4 className="font-bold mb-2">Instructions</h4>
        <p>{sample.notes}</p>
      </div>
    </div>
  );
};