import { jsPDF } from 'jspdf';

export interface CertificateData {
  gstin: string;
  legalName: string;
  tradeName: string;
  constitution: string;
  principalPlace: string;
  effectiveDate: string;
  arn: string;
  signatory: string;
  applicationId: string;
}

export function buildCertificatePdf(data: CertificateData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Top Watermark / Disclaimer Banner
  doc.setFillColor(254, 242, 242);
  doc.rect(10, 8, pageWidth - 20, 12, 'F');
  doc.setFontSize(9);
  doc.setTextColor(185, 28, 28);
  doc.setFont('helvetica', 'bold');
  doc.text(
    'TAXLA GST AUTOMATION DEMO — MOCK CERTIFICATE — NOT A GOVERNMENT DOCUMENT',
    pageWidth / 2,
    15,
    { align: 'center' }
  );

  // Outer Border
  doc.setDrawColor(27, 54, 93);
  doc.setLineWidth(0.8);
  doc.rect(10, 24, pageWidth - 20, 260);

  // Inner Border
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.rect(12, 26, pageWidth - 24, 256);

  // Header
  doc.setTextColor(27, 54, 93);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF INDIA (DEMO / MOCK)', pageWidth / 2, 36, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.text('Central Goods and Services Tax Act, 2017 (Simulation)', pageWidth / 2, 42, { align: 'center' });

  doc.setFontSize(13);
  doc.setTextColor(27, 54, 93);
  doc.setFont('helvetica', 'bold');
  doc.text('GST REGISTRATION CERTIFICATE', pageWidth / 2, 50, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('(Form GST REG-06 - Simulated Copy)', pageWidth / 2, 55, { align: 'center' });

  // Divider line
  doc.setDrawColor(27, 54, 93);
  doc.setLineWidth(0.5);
  doc.line(15, 60, pageWidth - 15, 60);

  // Certificate Fields Table
  let y = 70;
  const col1 = 18;
  const col2 = 65;
  const colWidth = pageWidth - col2 - 18;

  const addRow = (num: string, label: string, value: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text(num, col1, y);
    doc.text(label, col1 + 6, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    
    // Split text if it wraps
    const splitLines = doc.splitTextToSize(value, colWidth);
    doc.text(splitLines, col2, y);

    y += Math.max(8, splitLines.length * 5 + 3);
  };

  addRow('1.', 'Registration Number (GSTIN)', data.gstin || '29ABCDE1234F1Z5');
  addRow('2.', 'Legal Name of Business', data.legalName || 'TAXLA DEMO ENTERPRISE');
  addRow('3.', 'Trade Name, if any', data.tradeName || data.legalName || 'TAXLA DEMO');
  addRow('4.', 'Constitution of Business', data.constitution || 'Proprietorship');
  addRow('5.', 'Address of Principal Place', data.principalPlace || 'Bengaluru, Karnataka');
  addRow('6.', 'Date of Liability', data.effectiveDate || '2024-02-01');
  addRow('7.', 'Period of Validity', 'From ' + (data.effectiveDate || '2024-02-01') + ' to Continuous');
  addRow('8.', 'Type of Registration', 'Regular');
  addRow('9.', 'Application Ref Number (ARN)', data.arn || 'ARN2026090001');
  addRow('10.', 'Demo Application ID', data.applicationId || 'GST-DEMO-2026-000001');

  // Approving Authority Box
  y += 10;
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(pageWidth - 95, y, 80, 40, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Digitally Signed by Approving Authority', pageWidth - 90, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Jurisdictional Officer (Simulated)', pageWidth - 90, y + 15);
  doc.text(`Authorized Signatory: ${data.signatory || 'RAMESH SHARMA'}`, pageWidth - 90, y + 22);
  doc.text(`Timestamp: ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`, pageWidth - 90, y + 29);
  doc.text('Status: APPROVED - DEMO VERIFIED', pageWidth - 90, y + 36);

  // Note Box at Bottom
  doc.setFillColor(241, 245, 249);
  doc.rect(15, 245, pageWidth - 30, 28, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('IMPORTANT DEMO NOTICE:', 20, 252);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(
    'This is a synthetic mock registration certificate generated for TAXLA automated Playwright testing.',
    20,
    258
  );
  doc.text(
    'It holds NO legal validity and does not represent any registration with the Government of India or GSTN.',
    20,
    264
  );

  return doc;
}

export function downloadCertificatePdf(data: CertificateData): void {
  const doc = buildCertificatePdf(data);
  const cleanGstin = (data.gstin || '29ABCDE1234F1Z5').replace(/[^a-zA-Z0-9]/g, '');
  const fileName = `GST-DEMO-CERTIFICATE-${cleanGstin}.pdf`;
  doc.save(fileName);
}
