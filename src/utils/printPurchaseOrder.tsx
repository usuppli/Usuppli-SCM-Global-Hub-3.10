import { Job, Factory, Customer, Product } from '../types';

export const printPurchaseOrder = (job: Partial<Job>, factory?: Factory, customer?: Customer, product?: Product) => {
  const win = window.open('', '_blank');
  if (!win) return;

  const jobId = job.id || 'N/A';
  const unitCost = product?.costVariables?.materials || 0;
  const quantity = job.quantity || 0;
  const total = unitCost * quantity;
  const today = new Date().toLocaleDateString();

  const logoSvg = `
    <svg height="60" viewBox="0 0 380 87.4" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="#003d5b" d="M96,12.5c-.8-2.2-2.9-3.8-5.4-3.8s-5.7,2.6-5.7,5.7.3,2,.7,2.8h0c2.5,5,3.8,10.6,3.8,16.3,0,20.1-16.4,36.5-36.5,36.5S16.6,53.7,16.6,33.6s1.3-11,3.7-16c.2-.4.4-.7.6-1.1,0,0,0,0,0-.1h0c.2-.6.3-1.2.3-1.8,0-3.2-2.6-5.7-5.7-5.7s-3.5.9-4.5,2.2h0c0,0,0,.2-.2.3-.3.4-.5.8-.6,1.3-3.2,6.5-4.9,13.8-4.9,21.1,0,26.4,21.5,47.8,47.8,47.8s47.8-21.5,47.8-47.8-1.7-14.5-4.9-21Z"/>
      <path fill="#e3224a" d="M60.1,37.1c0,3.9-3.2,7.1-7.1,7.1s-7.1-3.2-7.1-7.1,3.2-7.1,7.1-7.1,7.1,3.2,7.1,7.1Z"/>
      <path fill="#e3224a" d="M79.1,26.5c0,3.9-3.2,7.1-7.1,7.1s-7.1-3.2-7.1-7.1,3.2-7.1,7.1-7.1,7.1,3.2,7.1,7.1Z"/>
      <path fill="#e3224a" d="M73.3,51.5c0,3.9-3.2,7.1-7.1,7.1s-7.1-3.2-7.1-7.1,3.2-7.1,7.1-7.1,7.1,3.2,7.1,7.1Z"/>
      <text x="125" y="62" font-family="sans-serif" font-weight="bold" font-size="52" fill="#003d5b">Usuppli</text>
    </svg>
  `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>PO_${jobId}</title>
      <style>
        @page { size: A4 landscape; margin: 15mm; }
        body { 
          font-family: 'Helvetica', 'Arial', sans-serif; 
          color: #1e293b; 
          line-height: 1.4; 
          margin: 0; 
          -webkit-print-color-adjust: exact; 
        }
        .container { width: 100%; }
        
        /* Header */
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
        .header-left { display: flex; flex-direction: column; gap: 8px; }
        .company-address { font-size: 11px; color: #64748b; font-weight: 500; }
        .header-right { text-align: right; }
        .po-title { font-size: 32px; font-weight: 800; color: #1e293b; margin: 0; line-height: 1; }
        .po-ref { font-size: 14px; font-weight: 700; color: #64748b; margin-top: 4px; font-family: monospace; }

        /* Grid */
        .info-grid { display: grid; grid-template-cols: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; border-top: 2px solid #f1f5f9; padding-top: 20px; }
        .grid-col h4 { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #94a3b8; margin: 0 0 8px 0; letter-spacing: 0.05em; }
        .grid-col p { font-size: 12px; margin: 2px 0; font-weight: 600; }

        /* Table */
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #f1f5f9; text-align: left; padding: 12px; font-size: 10px; font-weight: 800; text-transform: uppercase; color: #475569; border-bottom: 2px solid #e2e8f0; }
        td { padding: 12px; font-size: 12px; border-bottom: 1px solid #f1f5f9; font-weight: 500; }
        .text-right { text-align: right; }
        .total-row { background: #f8fafc; font-weight: 800; font-size: 14px; }

        /* Notes */
        .notes-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
        .note-box h4 { font-size: 11px; font-weight: 800; color: #475569; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
        .note-box p { font-size: 11px; color: #64748b; white-space: pre-wrap; }

        /* Footer */
        .footer { display: flex; justify-content: flex-end; margin-top: 60px; }
        .signature-block { text-align: center; width: 250px; }
        .signature-line { border-top: 2px solid #1e293b; margin-bottom: 8px; }
        .signature-label { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #475569; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-left">
            ${logoSvg}
            <div class="company-address">87 Hope Drive, Dallas, Georgia, 30157 | +1-4702704180</div>
          </div>
          <div class="header-right">
            <h1 class="po-title">PURCHASE ORDER</h1>
            <div class="po-ref">REF: ${jobId}</div>
          </div>
        </div>

        <div class="info-grid">
          <div class="grid-col">
            <h4>Vendor</h4>
            <p>${factory?.name || 'N/A'}</p>
            <p>${factory?.contactPerson || factory?.contact || ''}</p>
            <p>${factory?.contactEmail || ''}</p>
          </div>
          <div class="grid-col">
            <h4>Ship To</h4>
            <p>${job.destinationAddress || 'Factory Floor'}</p>
            <p>Attn: ${job.leadBuyer || 'Purchasing Dept'}</p>
          </div>
          <div class="grid-col">
            <h4>Order Data</h4>
            <p>Date: ${today}</p>
            <p>Terms: ${job.paymentTerms || 'N/A'}</p>
            <p>Method: ${job.shippingMethod || 'Sea'}</p>
            <p>Incoterms: ${job.incoterms || 'FOB'}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item / Description</th>
              <th>SKU / Reference</th>
              <th class="text-right">Quantity</th>
              <th class="text-right">Unit Cost</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${product?.name || job.jobName}</td>
              <td style="font-family: monospace;">${product?.skus?.[0]?.code || job.productRefId}</td>
              <td class="text-right">${quantity.toLocaleString()}</td>
              <td class="text-right">$${unitCost.toFixed(2)}</td>
              <td class="text-right">$${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr class="total-row">
              <td colspan="4" class="text-right">GRAND TOTAL (USD)</td>
              <td class="text-right">$${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>

        <div class="notes-grid">
          <div class="note-box">
            <h4>Project Description</h4>
            <p>${job.description || 'No additional project description provided.'}</p>
          </div>
          <div class="note-box">
            <h4>Packaging Requirements</h4>
            <p>${job.packagingInstructions || 'Standard export packaging required.'}</p>
          </div>
        </div>

        <div class="footer">
          <div class="signature-block">
            <div class="signature-line"></div>
            <div class="signature-label">Authorized Signature & Date</div>
          </div>
        </div>
      </div>
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() { window.close(); };
        };
      </script>
    </body>
    </html>
  `;

  win.document.write(html);
  win.document.close();
};