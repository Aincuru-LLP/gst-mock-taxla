'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { getSession } from '@/lib/state/session-store';
import { downloadCertificatePdf } from '@/lib/certificate/pdf-generator';
import { CheckCircle2, Download, Award, ArrowRight, RotateCcw, ShieldCheck } from 'lucide-react';

export default function SuccessPage() {
  const [session, setSession] = useState(getSession());

  useEffect(() => {
    setSession(getSession());
  }, []);

  const handleDownload = () => {
    downloadCertificatePdf({
      gstin: session.gstin || '29ABCDE1234F1Z5',
      legalName: session.business?.legalName || session.legalName || 'TAXLA DEMO TECHNOLOGIES PVT LTD',
      tradeName: session.business?.tradeName || 'TAXLA TECH',
      constitution: session.business?.constitution || 'Proprietorship',
      principalPlace: session.principalPlace
        ? `${session.principalPlace.door}, ${session.principalPlace.building}, ${session.principalPlace.city}, ${session.principalPlace.state}`
        : 'Indiranagar, Bengaluru, Karnataka',
      effectiveDate: session.business?.commencementDate || '2024-02-01',
      arn: session.arn || 'ARN2026090123456789',
      signatory: session.signatory?.name || 'RAMESH KUMAR SHARMA',
      applicationId: session.applicationId
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PortalHeader
        currentStepTitle="Registration Completed"
        breadcrumbs={[
          { label: 'Registration', href: '/registration' },
          { label: 'Application', href: '/registration/application' },
          { label: 'Success' }
        ]}
      />

      <div className="max-w-4xl mx-auto w-full px-4 py-8 flex-1">
        
        {/* Main Success Container */}
        <div
          data-testid="gst-success"
          className="portal-card p-6 md:p-8 border-t-4 border-t-emerald-600 mb-6"
        >
          <div className="text-center pb-6 border-b border-slate-200">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              GST Registration Completed Successfully
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-lg mx-auto">
              Your mock registration workflow has reached final completion. All identifiers and verification milestones have been recorded.
            </p>
          </div>

          {/* Reference Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 text-xs">
            
            {/* TRN */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500 uppercase font-bold text-[10px] block mb-1">
                Temporary Reference Number (TRN)
              </span>
              <span
                data-testid="gst-success-trn"
                className="font-mono text-base font-bold text-slate-900"
              >
                {session.trn || 'TRN202609012345'}
              </span>
            </div>

            {/* ARN */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500 uppercase font-bold text-[10px] block mb-1">
                Application Reference Number (ARN)
              </span>
              <span
                data-testid="gst-success-arn"
                className="font-mono text-base font-bold text-[#1B365D]"
              >
                {session.arn || 'ARN2026090123456789'}
              </span>
            </div>

            {/* GSTIN */}
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded sm:col-span-2">
              <span className="text-emerald-800 uppercase font-bold text-[10px] block mb-1">
                Allocated GST Identification Number (GSTIN - Demo)
              </span>
              <span
                data-testid="gst-success-gstin"
                className="font-mono text-xl md:text-2xl font-black text-emerald-950 tracking-wider"
              >
                {session.gstin || '29ABCDE1234F1Z5'}
              </span>
            </div>

          </div>

          {/* Certificate Download Card */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 text-[#1B365D] rounded-full">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900">Form GST REG-06 Certificate Ready</h3>
                <p className="text-[11px] text-slate-600">
                  Download the generated synthetic certificate PDF for Playwright verification.
                </p>
              </div>
            </div>

            <button
              type="button"
              id="gst-success-certificate"
              data-testid="gst-success-certificate"
              onClick={handleDownload}
              className="portal-btn-primary text-xs shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Certificate</span>
            </button>
          </div>

          {/* Reset / Start Next Demo Run */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-500">
              Demo Application: <strong className="font-mono text-slate-700">{session.applicationId}</strong>
            </span>

            <div className="flex items-center gap-3">
              <Link
                href="/registration/certificate"
                className="portal-btn-secondary text-xs"
              >
                <span>View Certificate Form</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/registration/new?resetDemo=true"
                className="portal-btn-secondary text-xs text-blue-900 hover:bg-blue-50"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Start New Registration Session</span>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
