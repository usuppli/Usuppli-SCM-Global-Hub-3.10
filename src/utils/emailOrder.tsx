import { Job, Factory } from '../types';

export const draftOrderEmail = (job: Partial<Job>, factory?: Factory) => {
  const subject = encodeURIComponent(`PURCHASE ORDER: ${job.jobName} (Ref: ${job.id})`);
  
  const bodyLines = [
    `Dear ${factory?.name || 'Factory Manager'},`,
    "",
    "Please accept this official Purchase Order.",
    "",
    `Job: ${job.jobName}`,
    `Quantity: ${job.quantity}`,
    `Terms: ${job.incoterms || 'FOB'} via ${job.shippingMethod || 'Sea'}`,
    "",
    "Please reply with Pro-Forma Invoice.",
    "",
    "Best regards,",
    "",
    "BEMA Procurement Team"
  ];

  const body = encodeURIComponent(bodyLines.join("\r\n"));
  const mailtoLink = `mailto:${factory?.contactEmail || ''}?subject=${subject}&body=${body}`;
  
  window.location.href = mailtoLink;
};