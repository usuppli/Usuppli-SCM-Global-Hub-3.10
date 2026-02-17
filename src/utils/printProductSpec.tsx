import { Product } from '../types';

export const printProductSpec = (product: Product) => {
  const win = window.open('', '_blank');
  if (!win) return;

  const productId = product.id || 'N/A';
  const unitCost = Object.values(product.costVariables || {}).reduce((acc: number, val: any) => acc + (Number(val) || 0), 0);
  const today = new Date().toLocaleDateString();

  const logoSvg = `
    <svg height="60" viewBox="0 0 380 87.4" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="#003d5b" d="M96,12.5c-.8-2.2-2.9-3.8-5.4-3.8s-5.7,2.6-5.7,5.7.3,2,.7,2.8h0c2.5,5,3.8,10.6,3.8,16.3,0,20.1-16.4,36.5-36.5,36.5S16.6,53.7,16.6,33.6s1.3-11,3.7-16c.2-.4.4-.7.6-1.1,0,0,0,0,0-.1h0c.2-.6.3-1.2.3-1.8,0-3.2-2.6-5.7-5.7-5.7s-3.5.9-4.5,2.2h0c0,0,0,.2-.2.3-.3.4-.5.8-.6,1.3-3.2,6.5-4.9,13.8-4.9,21.1,0,26.4,21.5,47.8,47.8,47.8s47.8-21.5,47.8-47.8-1.7-14.5-4.9-21Z"/>
      <path fill="#e3224a" d="M60.1,37.1c0,3.9-3.2,7.1-7.1,7.1s-7.1-3.2-7.1-7.1,3.2-7.1,7.1-7.1,7.1,3.2,7.1,7.1Z"/>
      <path fill="#e3224a" d="M79.1,26.5c0,3.9-3.2,7.1-7.1,7.1s-7.1-3.2-7.1-7.1,3.2-7.1,7.1-7.1,7.1,3.2,7.1,7.1Z"/>
      <path fill="#e3224a" d="M73.3,51.5c0,3.9-3.2,7.1-7.1,7.1s-7.1-3.2-7.1-7.1,3.2-7.1,7.1-7.1,7.1,3.2,7.1,7.1Z"/>
      <text x="125" y="62" font-family="sans-serif" font-weight="bold" font-size="52" fill="#003d5b">Usuppli</text>
    </svg>`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Spec_${productId}</title>
      <style>
        @page { size: portrait; margin: 10mm; }
        body { 
          font-family: 'Helvetica', 'Arial', sans-serif; 
          color: #1e293b; 
          line-height: 1.4; 
          margin: 0; 
          -webkit-print-color-adjust: exact; 
        }
        .container { width: 100%; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 2px solid #003d5b; padding-bottom: 15px; }
        .header-left { display: flex; flex-direction: column; gap: 4px; }
        .company-address { font-size: 10px; color: #64748b; font-weight: 500; }
        .header-right { text-align: right; }
        .title { font-size: 24px; font-weight: 800; color: #003d5b; margin: 0; line-height: 1; text-transform: uppercase; }
        .ref { font-size: 11px; font-weight: 700; color: #64748b; margin-top: 4px; font-family: monospace; }

        .main-content { display: flex; flex-direction: column; gap: 20px; }
        .image-section { width: 100%; text-align: center; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #f8fafc; }
        .image-section img { width: 100%; max-height: 350px; object-fit: contain; padding: 10px; }
        
        .details-box h3 { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #64748b; margin: 0 0 10px 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 5px; }
        .details-grid { display: grid; grid-template-cols: 1fr 1fr 1fr; gap: 15px; margin-bottom: 10px; }
        .detail-item label { display: block; font-size: 9px; font-weight: 800; text-transform: uppercase; color: #94a3b8; }
        .detail-item p { font-size: 12px; font-weight: 600; margin: 2px 0; color: #1e293b; }

        .notes-section { margin-top: 10px; padding: 12px; background: #f1f5f9; border-radius: 8px; }
        .notes-section label { display: block; font-size: 9px; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 4px; }
        .notes-section p { font-size: 11px; color: #475569; margin: 0; }

        .cost-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .cost-table th { background: #f1f5f9; text-align: left; padding: 10px; font-size: 9px; font-weight: 800; text-transform: uppercase; color: #475569; border-bottom: 2px solid #e2e8f0; }
        .cost-table td { padding: 8px; font-size: 11px; border-bottom: 1px solid #f1f5f9; font-weight: 500; }
        .text-right { text-align: right; }
        .total-row { background: #003d5b; color: white; font-weight: 800; }
        .total-row td { border: none; color: white; }

        .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #f1f5f9; font-size: 9px; color: #94a3b8; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-left">
            ${logoSvg}
            <div class="company-address">Technical Operations Division | Usuppli Global SCM</div>
          </div>
          <div class="header-right">
            <h1 class="title">Product Specification</h1>
            <div class="ref">IDENTIFIER: ${productId}</div>
          </div>
        </div>

        <div class="main-content">
          <div class="image-section">
            ${product.image ? `<img src="${product.image}" />` : '<div style="color: #cbd5e1; font-weight: 800; padding: 100px 0;">NO IMAGE ASSET</div>'}
          </div>

          <div class="details-box">
            <h3>Technical DNA</h3>
            <div class="details-grid">
              <div class="detail-item"><label>Product Name</label><p>${product.name}</p></div>
              <div class="detail-item"><label>Brand Ref</label><p>${product.brand}</p></div>
              <div class="detail-item"><label>Category</label><p>${product.category}</p></div>
              <div class="detail-item"><label>HS Code</label><p>${product.hsCode || 'PENDING'}</p></div>
              <div class="detail-item"><label>Material</label><p>${product.material || 'N/A'}</p></div>
              <div class="detail-item"><label>Lead Time</label><p>${product.leadTime || 'N/A'}</p></div>
              <div class="detail-item"><label>Length</label><p>${product.dimensions.lengthCm} cm</p></div>
              <div class="detail-item"><label>Width</label><p>${product.dimensions.widthCm} cm</p></div>
              <div class="detail-item"><label>Height</label><p>${product.dimensions.heightCm} cm</p></div>
              <div class="detail-item"><label>Unit Weight</label><p>${product.dimensions.weightKg} kg</p></div>
            </div>
            <div class="notes-section">
              <label>Construction Notes</label>
              <p>${product.construction || 'No specific construction instructions provided.'}</p>
            </div>
          </div>
        </div>

        <table class="cost-table">
          <thead>
            <tr>
              <th>Variable</th>
              <th class="text-right">Estimated Unit Value (USD)</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(product.costVariables || {}).filter(([_, val]) => !!val).map(([key, val]) => `
              <tr>
                <td style="text-transform: capitalize;">${key.replace(/([A-Z])/g, ' $1')}</td>
                <td class="text-right">$${Number(val).toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td style="padding: 12px; font-size: 13px;">Estimated Ex-Factory Cost</td>
              <td class="text-right" style="padding: 12px; font-size: 13px;">$${unitCost.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          Generated via Usuppli Workspace Protocol | Secure Document | Date: ${today}
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