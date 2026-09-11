'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { getSession } from '@/lib/state/session-store';
import { downloadCertificatePdf } from '@/lib/certificate/pdf-generator';
import { Download, FileText, CheckCircle2, ArrowRight, ShieldAlert, Award } from 'lucide-react';

export default function CertificatePage() {
  const [session, setSession] = useState(getSession());
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  useEffect(() => {
    setSession(getSession());
  }, []);

  const gstin = session.gstin || '29ABCDE1234F1Z5';
  const legalName = session.business?.legalName || session.legalName || 'TAXLA DEMO TECHNOLOGIES PVT LTD';
  const tradeName = session.business?.tradeName || 'TAXLA TECH';
  const constitution = session.business?.constitution || 'Proprietorship';
  const principalAddress = session.principalPlace
    ? `${session.principalPlace.door}, ${session.principalPlace.building}, ${session.principalPlace.street}, ${session.principalPlace.city}, ${session.principalPlace.state} - ${session.principalPlace.pin}`
    : 'Indiranagar, Bengaluru, Karnataka - 560038';
  const effectiveDate = session.business?.commencementDate || '2024-02-01';
  const arn = session.arn || 'ARN2026090123456789';
  const signatory = session.signatory?.name || 'RAMESH KUMAR SHARMA';

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      downloadCertificatePdf({
        gstin,
        legalName,
        tradeName,
        constitution,
        principalPlace: principalAddress,
        effectiveDate,
        arn,
        signatory,
        applicationId: session.applicationId
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PortalHeader
        currentStepTitle="GST Registration Certificate"
        breadcrumbs={[
          { label: 'Registration', href: '/registration' },
          { label: 'Certificate' }
        ]}
      />

      <div className="max-w-5xl mx-auto w-full px-4 py-8 flex-1">
        
        {/* Persistent Demo Warning Banner */}
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded text-xs text-red-900 flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-sm text-red-950 block">
              MOCK REGISTRATION CERTIFICATE — NOT A GOVERNMENT DOCUMENT
            </span>
            <p className="leading-relaxed text-red-800 mt-0.5">
              This certificate is generated dynamically for TAXLA automated Playwright workflow validation.
              It holds no legal validity and does not represent official registration with the Government of India or GSTN.
            </p>
          </div>
        </div>

        {/* Action Header Card */}
        <div className="portal-card p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 border-slate-300">
          <div>
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#1B365D]" />
              Form GST REG-06: Registration Certificate
            </h1>
            <p className="text-xs text-slate-600">
              Certificate issued under Central / State Goods and Services Tax Act (Simulation)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              id="gst-download-certificate"
              data-testid="gst-download-certificate"
              onClick={handleDownload}
              disabled={isDownloading}
              className="portal-btn-primary shadow"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Generating PDF...' : 'Download Certificate (PDF)'}</span>
            </button>

            <Link
              href="/registration/application/success"
              className="portal-btn-secondary text-xs"
            >
              <span>Summary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Certificate Visual Preview Card */}
        <div className="bg-white border-2 border-[#1B365D] rounded shadow-lg p-6 md:p-10 font-sans text-slate-800 relative overflow-hidden">
          
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <span className="text-8xl font-black text-slate-900 transform -rotate-45">
              TAXLA DEMO
            </span>
          </div>

          {/* Certificate Header */}
          <div className="text-center border-b-2 border-[#1B365D] pb-5 mb-6">
            <div className="text-xs font-bold text-red-700 uppercase tracking-widest mb-1">
              DEMO / NOT A GOVERNMENT CERTIFICATE
            </div>
            <div className="text-base md:text-xl font-black text-[#1B365D] tracking-wide uppercase">
              Government of India (Simulation)
            </div>
            <div className="text-xs text-slate-600 font-medium mt-0.5">
              Goods and Services Tax Registration Certificate (Form GST REG-06)
            </div>
          </div>

          {/* Core Table */}
          <div className="border border-slate-300 rounded overflow-hidden text-xs my-4">
            <table className="w-full border-collapse">
              <tbody className="divide-y divide-slate-300">
                
                <tr className="bg-slate-50">
                  <td className="p-3 font-bold text-slate-700 w-1/3">1. Registration Number (GSTIN)</td>
                  <td className="p-3 font-mono font-black text-base text-[#1B365D]">
                    {gstin}
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-700">2. Legal Name of Business</td>
                  <td className="p-3 font-semibold text-slate-900 uppercase">{legalName}</td>
                </tr>

                <tr className="bg-slate-50">
                  <td className="p-3 font-bold text-slate-700">3. Trade Name, if any</td>
                  <td className="p-3 uppercase">{tradeName}</td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-700">4. Constitution of Business</td>
                  <td className="p-3 font-medium">{constitution}</td>
                </tr>

                <tr className="bg-slate-50">
                  <td className="p-3 font-bold text-slate-700">5. Address of Principal Place</td>
                  <td className="p-3">{principalAddress}</td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-700">6. Date of Liability</td>
                  <td className="p-3">{effectiveDate}</td>
                </tr>

                <tr className="bg-slate-50">
                  <td className="p-3 font-bold text-slate-700">7. Period of Validity</td>
                  <td className="p-3">From {effectiveDate} to Continuous</td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-700">8. Type of Registration</td>
                  <td className="p-3">Regular</td>
                </tr>

                <tr className="bg-slate-50">
                  <td className="p-3 font-bold text-slate-700">9. Application Ref Number (ARN)</td>
                  <td className="p-3 font-mono font-bold text-slate-800">{arn}</td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-700">10. Demo Application ID</td>
                  <td className="p-3 font-mono text-slate-600">{session.applicationId}</td>
                </tr>

              </tbody>
            </table>
          </div>

          {/* Mock Signature Stamp */}
          <div className="mt-8 flex flex-col sm:flex-row items-end justify-between text-xs gap-4 pt-4 border-t border-slate-200">
            <div className="text-[11px] text-slate-500">
              <div>Date of Issue: {new Date().toLocaleDateString('en-GB')}</div>
              <div>Place of Issue: {session.district || 'Bengaluru'}, {session.state || 'Karnataka'}</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-300 rounded text-right space-y-0.5">
              <div className="font-bold text-slate-800 text-[11px]">Digitally Signed &amp; Approved</div>
              <div className="text-[10px] text-slate-500">Jurisdictional Tax Officer (Simulated)</div>
              <div className="text-[11px] font-semibold text-emerald-800">Signatory: {signatory}</div>
              <div className="text-[10px] font-mono text-slate-400">Timestamp: {new Date().toISOString()}</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
