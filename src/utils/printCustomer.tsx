import { Customer } from '../types';

const logoSvg = `
<svg height="60" viewBox="0 0 380 87.4" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill="#003d5b" d="M96,12.5c-.8-2.2-2.9-3.8-5.4-3.8s-5.7,2.6-5.7,5.7.3,2,.7,2.8h0c2.5,5,3.8,10.6,3.8,16.3,0,20.1-16.4,36.5-36.5,36.5S16.6,53.7,16.6,33.6s1.3-11,3.7-16c.2-.4.4-.7.6-1.1,0,0,0,0,0-.1h0c.2-.6.3-1.2.3-1.8,0-3.2-2.6-5.7-5.7-5.7s-3.5.9-4.5,2.2h0c0,0,0,.2-.2.3-.3.4-.5.8-.6,1.3-3.2,6.5-4.9,13.8-4.9,21.1,0,26.4,21.5,47.8,47.8,47.8s47.8-21.5,47.8-47.8-1.7-14.5-4.9-21Z"/>
  <path fill="#e3224a" d="M60.1,37.1c0,3.9-3.2,7.1-7.1,7.1s-7.1-3.2-7.1-7.1,3.2-7.1,7.1-7.1,7.1,3.2,7.1,7.1Z"/>
  <path fill="#e3224a" d="M79.1,26.5c0,3.9-3.2,7.1-7.1,7.1s-7.1-3.2-7.1-7.1,3.2-7.1,7.1-7.1,7.1,3.2,7.1,7.1Z"/>
  <path fill="#e3224a" d="M73.3,51.5c0,3.9-3.2,7.1-7.1,7.1s-7.1-3.2-7.1-7.1,3.2-7.1,7.1-7.1,7.1,3.2,7.1,7.1Z"/>
  <text x="125" y="62" font-family="sans-serif" font-weight="bold" font-size="52" fill="#003d5b">Usuppli</text>
</svg>`;

export const printCustomer = (customer: Customer) => {
  const win = window.open('', '_blank');
  if (!win) return;

  const customerId = customer.id || 'N/A';
  const today = new Date().toLocaleDateString();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Customer_${customer.companyName.replace(/\s+/g, '_')}</title>
      <style>
        @page { size: portrait; margin: 15mm; }
        body { 
          font-family: 'Helvetica', 'Arial', sans-serif; 
          color: #1e293b; 
          line-height: 1.5; 
          margin: 0; 
          -webkit-print-color-adjust: exact; 
        }
        .container { width: 100%; }
        
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 2px solid #003d5b; padding-bottom: 20px; }
        .header-left { display: flex; flex-direction: column; gap: 4px; }
        .header-right { text-align: right; }
        .title { font-size: 24px; font-weight: 800; color: #003d5b; margin: 0; text-transform: uppercase; letter-spacing: 0.05em; }
        .ref { font-size: 11px; font-weight: 700; color: #64748b; margin-top: 4px; font-family: monospace; }

        .identity-section { margin-bottom: 30px; }
        .company-name { font-size: 32px; font-weight: 900; color: #0f172a; line-height: 1.1; margin: 0; }
        .tier-badge { display: inline-block; padding: 4px 12px; background: #f1f5f9; border-radius: 6px; font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; margin-top: 10px; }

        .contact-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 30px; }
        .contact-box h3 { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #64748b; margin: 0 0 15px 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; }
        .contact-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 15px; }
        .contact-item label { display: block; font-size: 9px; font-weight: 800; text-transform: uppercase; color: #94a3b8; }
        .contact-item p { font-size: 13px; font-weight: 600; margin: 2px 0; color: #1e293b; }

        .address-section { display: flex; flex-direction: column; gap: 20px; }
        .address-block { border-left: 4px solid #003d5b; padding-left: 20px; }
        .address-block h4 { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; margin: 0 0 8px 0; }
        .address-block p { font-size: 13px; margin: 2px 0; font-weight: 500; }

        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #f1f5f9; font-size: 10px; color: #94a3b8; text-align: center; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-left">
            ${logoSvg}
          </div>
          <div class="header-right">
            <h1 class="title">Customer Profile</h1>
            <div class="ref">RECORD ID: ${customerId}</div>
          </div>
        </div>

        <div class="identity-section">
          <h2 class="company-name">${customer.companyName}</h2>
          <div class="tier-badge">${customer.tier || 'Standard'} Account</div>
        </div>

        <div class="contact-box">
          <h3>Primary Contact Information</h3>
          <div class="contact-grid">
            <div class="contact-item"><label>Contact Person</label><p>${customer.contactName || customer.contactPerson || 'N/A'}</p></div>
            <div class="contact-item"><label>Email Address</label><p>${customer.email}</p></div>
            <div class="contact-item"><label>Phone Number</label><p>${customer.phone || 'N/A'}</p></div>
            <div class="contact-item"><label>Business Type</label><p>${customer.businessType || 'N/A'}</p></div>
            <div class="contact-item"><label>Industry</label><p>${customer.industry || 'N/A'}</p></div>
            <div class="contact-item"><label>Account Owner</label><p>${customer.accountOwner || 'Unassigned'}</p></div>
          </div>
        </div>

        <div class="address-section">
          <div class="address-block">
            <h4>Billing Address</h4>
            <p>${customer.billingStreet || customer.location || 'N/A'}</p>
            <p>${customer.billingCity || ''} ${customer.billingState || ''} ${customer.billingZip || ''}</p>
            <p>${customer.billingCountry || ''}</p>
          </div>
          
          <div class="address-block" style="border-left-color: #64748b;">
            <h4>Shipping Address</h4>
            ${customer.shippingSameAsBilling ? 
              '<p style="font-style: italic; color: #64748b;">Same as billing address</p>' : 
              `
              <p>${customer.shippingStreet || 'N/A'}</p>
              <p>${customer.shippingCity || ''} ${customer.shippingState || ''} ${customer.shippingZip || ''}</p>
              <p>${customer.shippingCountry || ''}</p>
              `
            }
          </div>
        </div>

        <div class="footer">
          Confidential Customer Record | Generated on ${today} | Usuppli CRM Protocol
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
