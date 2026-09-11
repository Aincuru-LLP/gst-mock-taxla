import React from 'react';
import Link from 'next/link';
import { ShieldCheck, HelpCircle, FileText, ArrowRight } from 'lucide-react';

interface PortalHeaderProps {
  currentStepTitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PortalHeader({ currentStepTitle, breadcrumbs }: PortalHeaderProps) {
  return (
    <header className="w-full">
      {/* Persistent Critical Disclaimer Banner */}
      <div className="bg-red-700 text-white px-4 py-1.5 text-center text-xs font-bold tracking-wide uppercase flex items-center justify-center gap-2 border-b border-red-800">
        <span className="bg-white text-red-700 px-1.5 py-0.2 rounded font-black text-[10px]">NOTICE</span>
        <span>TAXLA GST AUTOMATION DEMO — MOCK PORTAL — NOT A GOVERNMENT WEBSITE</span>
      </div>

      {/* Main Official-Style Blue Header */}
      <div className="bg-[#1B365D] text-white border-b-4 border-[#D97706] px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* LEFT: Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-white text-[#1B365D] font-black flex items-center justify-center text-xl shadow border border-amber-400">
              GST
            </div>
            <div>
              <div className="text-base md:text-lg font-bold tracking-tight text-white leading-tight flex items-center gap-2">
                TAXLA GST AUTOMATION DEMO
                <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                  Mock Target
                </span>
              </div>
              <div className="text-xs text-blue-200">
                Functional GST Registration Portal Simulator for Automation Testing
              </div>
            </div>
          </div>

          {/* CENTER: Context / Step */}
          {currentStepTitle && (
            <div className="hidden lg:flex flex-col items-center bg-[#142A4A] border border-blue-900/60 px-4 py-1.5 rounded">
              <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Registration Workflow</span>
              <span className="text-xs font-semibold text-slate-100">{currentStepTitle}</span>
            </div>
          )}

          {/* RIGHT: Navigation & Demo Status */}
          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/registration/new"
              className="text-blue-100 hover:text-white flex items-center gap-1 font-medium hover:underline"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              New Registration
            </Link>

            <Link
              href="/registration/trn-login"
              className="text-blue-100 hover:text-white flex items-center gap-1 font-medium hover:underline"
            >
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              TRN Login
            </Link>

            <div className="h-4 w-px bg-blue-400/40 hidden sm:block" />

            <div className="flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 px-2 py-1 rounded text-[11px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Target Ready</span>
            </div>

            <Link
              href="/health"
              className="text-blue-200 hover:text-white flex items-center gap-1 hover:underline"
              title="Health Check"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Health</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="bg-slate-100 border-b border-slate-200 px-4 md:px-8 py-1.5 text-xs text-slate-600">
          <div className="max-w-7xl mx-auto flex items-center gap-1.5">
            <Link href="/" className="hover:text-blue-800 hover:underline">
              Home
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <span>/</span>
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-blue-800 hover:underline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-slate-800">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
