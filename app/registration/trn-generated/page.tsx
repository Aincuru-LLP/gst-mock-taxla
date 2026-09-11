'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { getSession } from '@/lib/state/session-store';
import { CheckCircle2, Copy, ArrowRight, Calendar, Hash, Clock, ShieldCheck } from 'lucide-react';

export default function TrnGeneratedPage() {
  const router = useRouter();
  const [session, setSession] = useState(getSession());
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setSession(getSession());
  }, []);

  const handleCopy = () => {
    if (session.trn) {
      navigator.clipboard.writeText(session.trn);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleProceedLogin = () => {
    router.push('/registration/trn-login');
  };

  const handleStartApplication = () => {
    router.push('/registration/trn-login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PortalHeader
        currentStepTitle="TRN Generated"
        breadcrumbs={[
          { label: 'Registration', href: '/registration' },
          { label: 'TRN Generated' }
        ]}
      />

      <div className="max-w-3xl mx-auto w-full px-4 py-8 flex-1">
        
        {/* Success Banner */}
        <div className="portal-card p-6 border-t-4 border-t-emerald-600 mb-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-full shrink-0 mt-0.5">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Temporary Reference Number (TRN) Generated Successfully
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                Your Temporary Reference Number (TRN) has been generated and dispatched to your registered email and mobile number.
              </p>
            </div>
          </div>

          {/* TRN Display Box */}
          <div className="mt-6 p-5 bg-blue-50/80 border-2 border-dashed border-blue-300 rounded text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Your Temporary Reference Number (TRN)
            </span>
            <div className="flex items-center justify-center gap-3">
              <span
                data-testid="gst-trn"
                className="font-mono text-2xl md:text-3xl font-black text-[#1B365D] tracking-wider selection:bg-amber-200"
              >
                {session.trn || 'TRN202609012345'}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                title="Copy TRN to clipboard"
                className="p-1.5 text-slate-600 hover:text-[#1B365D] bg-white border border-slate-300 rounded hover:bg-slate-50 transition cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && (
              <span className="text-xs text-emerald-700 font-semibold block mt-1">
                TRN copied to clipboard!
              </span>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500 flex items-center gap-1 mb-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Created Date
              </span>
              <span className="font-semibold text-slate-800">
                {new Date(session.trnCreatedAt || Date.now()).toLocaleDateString('en-GB')}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500 flex items-center gap-1 mb-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                TRN Expiry
              </span>
              <span
                data-testid="gst-trn-expiry"
                className="font-semibold text-red-700"
              >
                {session.trnExpiryDate || '15 Days from generation'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500 flex items-center gap-1 mb-1 font-medium">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                Session Reference
              </span>
              <span className="font-mono font-semibold text-slate-800">
                {session.applicationId}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleStartApplication}
              className="portal-btn-secondary"
            >
              Start Application
            </button>

            <button
              type="button"
              onClick={handleProceedLogin}
              className="portal-btn-primary"
            >
              <span>Proceed to TRN Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Informational Guidance */}
        <div className="p-4 bg-slate-100 border border-slate-200 rounded text-xs text-slate-700">
          <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            Next Step for Automation:
          </h3>
          <p className="leading-relaxed">
            Click <strong>&quot;Proceed to TRN Login&quot;</strong>. On the TRN login screen, the generated TRN will be authenticated via OTP before entering the 10-tab application dashboard.
          </p>
        </div>

      </div>
    </div>
  );
}
