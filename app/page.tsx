'use client';

import React from 'react';
import Link from 'next/link';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { FilePlus, KeyRound, ShieldCheck, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PortalHeader currentStepTitle="Mock Registration Landing" />

      <div className="max-w-5xl mx-auto w-full px-4 py-8 flex-1">
        {/* Banner Alert */}
        <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded text-xs text-amber-950">
          <div className="font-bold flex items-center gap-1.5 text-sm mb-1 text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            TAXLA Automated Playwright Target Portal
          </div>
          <p className="leading-relaxed">
            This is a standalone, deterministic mock of the Indian Goods and Services Tax (GST) registration workflow.
            It is designed to validate TAXLA&apos;s Playwright browser automation without interacting with government production systems.
          </p>
        </div>

        {/* Two Main Cards: New Registration vs TRN Login */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          
          {/* New Registration Card */}
          <div className="portal-card p-6 border-t-4 border-t-[#1B365D] hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 text-[#1B365D] rounded-full">
                <FilePlus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">New Registration (Part A)</h2>
                <p className="text-xs text-slate-500">Initiate GST registration for a new business entity</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Playwright starting route for new applicant automation. Collects Taxpayer Type, State, District,
              Legal Name, PAN, Email, Mobile, and mock CAPTCHA.
            </p>

            <Link
              href="/registration/new"
              className="portal-btn-primary w-full py-2 text-sm justify-center"
            >
              <span>Start New Registration</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* TRN Login Card */}
          <div className="portal-card p-6 border-t-4 border-t-[#D97706] hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-50 text-[#D97706] rounded-full">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Temporary Ref Number (TRN)</h2>
                <p className="text-xs text-slate-500">Resume saved application using TRN</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Encountered after Part A OTP verification. Allows the Playwright worker or user to log in with TRN,
              verify via OTP, and complete the 10 application tabs.
            </p>

            <Link
              href="/registration/trn-login"
              className="portal-btn-secondary w-full py-2 text-sm justify-center border-amber-400 text-amber-900 hover:bg-amber-50"
            >
              <span>Login using TRN</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* Workflow overview box */}
        <div className="portal-card p-6 bg-slate-50 border border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
            Automation Flow Progression
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-3 border border-slate-200 rounded">
              <span className="font-bold text-blue-900 block mb-1">1. Part A</span>
              <span className="text-slate-600">Taxpayer info &amp; CAPTCHA checkpoint</span>
            </div>
            <div className="bg-white p-3 border border-slate-200 rounded">
              <span className="font-bold text-blue-900 block mb-1">2. TRN &amp; Login</span>
              <span className="text-slate-600">OTP 123456 &amp; TRN generation</span>
            </div>
            <div className="bg-white p-3 border border-slate-200 rounded">
              <span className="font-bold text-blue-900 block mb-1">3. 10 Tabs</span>
              <span className="text-slate-600">Business, Promoters, Place, HSN, Bank</span>
            </div>
            <div className="bg-white p-3 border border-slate-200 rounded">
              <span className="font-bold text-blue-900 block mb-1">4. ARN &amp; Cert</span>
              <span className="text-slate-600">EVC OTP, 0-8s GSTIN, Download PDF</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
