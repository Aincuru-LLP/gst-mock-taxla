import { NextRequest, NextResponse } from 'next/server';
import { buildCertificatePdf } from '@/lib/certificate/pdf-generator';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gstin = searchParams.get('gstin') || '29ABCDE1234F1Z5';
  const legalName = searchParams.get('legalName') || 'TAXLA DEMO TECHNOLOGIES PVT LTD';
  const tradeName = searchParams.get('tradeName') || 'TAXLA TECH';
  const constitution = searchParams.get('constitution') || 'Proprietorship';
  const principalPlace = searchParams.get('principalPlace') || 'Indiranagar, Bengaluru, Karnataka - 560038';
  const effectiveDate = searchParams.get('effectiveDate') || '2024-02-01';
  const arn = searchParams.get('arn') || 'ARN2026090123456789';
  const signatory = searchParams.get('signatory') || 'RAMESH KUMAR SHARMA';
  const applicationId = searchParams.get('applicationId') || 'GST-DEMO-2026-000001';

  const doc = buildCertificatePdf({
    gstin,
    legalName,
    tradeName,
    constitution,
    principalPlace,
    effectiveDate,
    arn,
    signatory,
    applicationId
  });

  const pdfArrayBuffer = doc.output('arraybuffer');
  const cleanGstin = gstin.replace(/[^a-zA-Z0-9]/g, '');

  return new NextResponse(pdfArrayBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="GST-DEMO-CERTIFICATE-${cleanGstin}.pdf"`
    }
  });
}
