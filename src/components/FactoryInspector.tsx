
import React from 'react';
import { Factory } from '../types';
import { SupplierScorecard } from './SupplierScorecard';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  factory: Factory | null;
}

export const FactoryInspector: React.FC<Props> = ({ isOpen, onClose, factory }) => {
  if (!factory) return null;

  return (
    <>
      {factory.scorecardData ? (
        <SupplierScorecard 
          supplier={factory.scorecardData} 
          isOpen={isOpen} 
          onClose={onClose} 
        />
      ) : (
        /* Fallback for factories without scorecard data */
        <div 
          className={`fixed inset-0 z-[150] flex justify-end transition-opacity duration-500 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
          <div className={`relative w-full max-w-[500px] h-full bg-white shadow-2xl p-12 flex flex-col items-center justify-center text-center transform transition-transform duration-500 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
             <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400"
             >
                <X className="w-6 h-6" />
             </button>
             <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
             </div>
             <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">No Audit Data</h3>
             <p className="text-sm text-slate-400 mt-2 max-w-xs leading-relaxed">
               This facility hasn't been connected to the Global Scorecard network yet.
             </p>
          </div>
        </div>
      )}
    </>
  );
};

// Internal icon for fallback
const X = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
);
