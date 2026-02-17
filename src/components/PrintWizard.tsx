import React from 'react';
import { X, Printer, Mail } from 'lucide-react';
import { PrintableCustomer } from './PrintableCustomer';
import { Customer, Job, Factory, Product, SampleRequest, Shipment } from '../types';
import { printPurchaseOrder } from '../utils/printPurchaseOrder';
import { printSampleRequest } from '../utils/printSampleRequest';
import { printShipment } from '../utils/printShipment';
import { printProductSpec } from '../utils/printProductSpec';
import { printCustomer as printCustomerUtil } from '../utils/printCustomer';
import PrintableOrder from './PrintableOrder';
import { PrintableSample } from './PrintableSample';
import { PrintableShipment } from './PrintableShipment';
// Fixed: Imported missing component PrintableProductSpec
import { PrintableProductSpec } from './PrintableProductSpec';

interface Props {
  mode: 'customer' | 'order' | 'sample' | 'shipment' | 'product'; 
  onClose: () => void;
  customer?: Customer;
  job?: Job;
  factory?: Factory;
  product?: Product;
  sample?: SampleRequest;
  shipment?: Shipment;
}

export default function PrintWizard({ mode, onClose, customer, job, factory, product, sample, shipment }: Props) {
  
  const handlePrint = () => {
    // Specialized PDF generators
    if (mode === 'order' && job) {
      printPurchaseOrder(job, factory, customer, product);
      return;
    }

    if (mode === 'sample' && sample) {
       printSampleRequest(sample, factory, product);
       return;
    }

    if (mode === 'shipment' && shipment) {
      printShipment(shipment);
      return;
    }

    if (mode === 'product' && product) {
      printProductSpec(product);
      return;
    }

    if (mode === 'customer' && customer) {
      printCustomerUtil(customer);
      return;
    }

    // Standard browser print if no specialized utility is found
    window.print();
  };

  const handleEmail = () => {
    if (mode === 'customer' && customer) {
      const subject = `Customer Profile: ${customer.companyName}`;
      const body = `Please find the attached profile for ${customer.companyName}.`;
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else if (mode === 'order' && job) {
      const subject = `Purchase Order: ${job.jobName} (${job.id})`;
      const body = `Please find attached Purchase Order for ${job.jobName}.`;
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else if (mode === 'sample' && sample) {
      const subject = `Sample Request: ${sample.id}`;
      const body = `Please find attached Sample Request for ${sample.id}.`;
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else if (mode === 'shipment' && shipment) {
      const subject = `Shipping Manifest: ${shipment.trackingNumber}`;
      const body = `Please find attached Shipping Manifest for tracking ${shipment.trackingNumber}.`;
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else if (mode === 'product' && product) {
      const subject = `Product Specification: ${product.name} (${product.id})`;
      const body = `Please find attached Product Specification for ${product.name}.`;
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white print:static">
      
      {/* Sidebar Controls (Hidden when printing via CSS) */}
      <div className="bg-white w-80 h-[85vh] rounded-l-2xl p-6 flex flex-col shadow-2xl print:hidden animate-in slide-in-from-left-4 no-print">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-slate-800">Preview</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={handlePrint} 
            className="w-full py-4 bg-[#003d5b] hover:bg-[#002a40] text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-colors shadow-lg"
          >
            <Printer className="w-5 h-5"/> Print to PDF
          </button>
          
          <button 
            onClick={handleEmail} 
            className="w-full py-4 border-2 border-slate-200 hover:border-[#003d5b] text-slate-700 hover:text-[#003d5b] rounded-xl font-bold flex items-center justify-center gap-3 transition-all"
          >
            <Mail className="w-5 h-5"/> Draft Email
          </button>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center">
            Clicking Print will open your system dialog. Select "Save as PDF" to export.
          </p>
        </div>
      </div>

      {/* Preview Area */}
      <div className="bg-slate-200 h-[85vh] w-[210mm] rounded-r-2xl overflow-y-auto shadow-2xl print:h-auto print:w-full print:shadow-none print:rounded-none print:overflow-visible custom-scrollbar">
        <div className="transform origin-top scale-100 print:scale-100 min-h-full">
          {/* If mode is 'order', show the Order Preview */}
          {mode === 'order' && job && (
            <PrintableOrder 
              job={job} 
              factory={factory} 
              customer={customer} 
              product={product} 
            />
          )}

          {/* Existing Customer logic */}
          {mode === 'customer' && customer && (
             <PrintableCustomer customer={customer} />
          )}
          
          {/* If mode is 'sample', show the Sample Request Preview */}
          {mode === 'sample' && sample && (
             <PrintableSample sample={sample} factory={factory} product={product} />
          )}

          {/* If mode is 'shipment', show the Shipment Manifest Preview */}
          {mode === 'shipment' && shipment && (
            <PrintableShipment shipment={shipment} />
          )}

          {/* If mode is 'product', show the Product Specification Preview */}
          {mode === 'product' && product && (
            <PrintableProductSpec product={product} />
          )}
        </div>
      </div>
    </div>
  );
}