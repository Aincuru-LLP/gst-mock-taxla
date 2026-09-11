'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { getSession, saveSession, generateSyntheticGstin } from '@/lib/state/session-store';
import { ApplicationStatus } from '@/types/gst';
import { CheckCircle2, Clock, FileCheck, ArrowRight, ShieldCheck, Download, AlertCircle } from 'lucide-react';

const PROGRESSION_STAGES: { status: ApplicationStatus; label: string; delayMs: number }[] = [
  { status: 'ARN_GENERATED', label: 'ARN Generated Successfully', delayMs: 1500 },
  { status: 'PENDING_PROCESSING', label: 'Pending Processing by Jurisdictional Authority', delayMs: 3000 },
  { status: 'UNDER_PROCESSING', label: 'Under Active Officer Verification', delayMs: 4500 },
  { status: 'APPROVED', label: 'Registration Application Approved', delayMs: 6000 },
  { status: 'GSTIN_GENERATED', label: 'GSTIN Generated (Registration Completed)', delayMs: 7500 },
];

export default function ArnProcessingPage() {
  const router = useRouter();
  const [session, setSession] = useState(getSession());
  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>('ARN_GENERATED');
  const [gstin, setGstin] = useState<string>('');
  const [timerStartedAt, setTimerStartedAt] = useState<number>(Date.now());

  useEffect(() => {
    const s = getSession();
    setSession(s);

    // If GSTIN already generated in session, show it directly
    if (s.gstin && s.status === 'GSTIN_GENERATED') {
      setCurrentStatus('GSTIN_GENERATED');
      setGstin(s.gstin);
      return;
    }

    const start = Date.now();
    setTimerStartedAt(start);

    // Deterministic progression timers
    const timeouts: NodeJS.Timeout[] = [];

    PROGRESSION_STAGES.forEach(stage => {
      const t = setTimeout(() => {
        setCurrentStatus(stage.status);

        if (stage.status === 'GSTIN_GENERATED') {
          const synthGstin = generateSyntheticGstin(s.state, s.pan);
          setGstin(synthGstin);

          const updated = {
            ...s,
            status: 'GSTIN_GENERATED' as const,
            gstin: synthGstin,
            gstinStatus: 'GENERATED' as const,
            gstinGeneratedAt: new Date().toISOString()
          };
          saveSession(updated);
        }
      }, stage.delayMs);

      timeouts.push(t);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const isCompleted = currentStatus === 'GSTIN_GENERATED' || Boolean(gstin);

  return (
    <div className="flex flex-col min-h-screen">
      <PortalHeader
        currentStepTitle="ARN Status &amp; Processing"
        breadcrumbs={[
          { label: 'Registration', href: '/registration' },
          { label: 'Application', href: '/registration/application' },
          { label: 'ARN Status' }
        ]}
      />

      <div className="max-w-4xl mx-auto w-full px-4 py-8 flex-1">
        
        {/* Main Status Card */}
        <div className="portal-card p-6 border-t-4 border-t-emerald-600 mb-6">
          
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4 mb-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                Application Submitted Successfully
              </span>
              <h1 className="text-xl font-bold text-slate-900 mt-2 flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-emerald-600" />
                Application Reference Number (ARN) Generated
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                Your GST registration application has been acknowledged and routed for automated verification.
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Status</span>
              <span className="text-xs font-bold text-[#1B365D] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded inline-block mt-0.5">
                {currentStatus}
              </span>
            </div>
          </div>

          {/* ARN Display Box */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded text-center my-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Application Reference Number (ARN)
            </span>
            <span
              data-testid="gst-arn"
              className="font-mono text-2xl md:text-3xl font-black text-[#1B365D] tracking-wider selection:bg-amber-200"
            >
              {session.arn || 'ARN2026090123456789'}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              Generated: {new Date(session.arnGeneratedAt || Date.now()).toLocaleString('en-GB')}
            </span>
          </div>

          {/* Status Progression Timeline (0–8s deterministic) */}
          <div className="my-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Application Progression Timeline
            </h3>

            <div className="space-y-2.5">
              {PROGRESSION_STAGES.map((stage, idx) => {
                const stageIndex = PROGRESSION_STAGES.findIndex(s => s.status === currentStatus);
                const isPassed = stageIndex >= idx;
                const isCurrent = stage.status === currentStatus;

                return (
                  <div
                    key={stage.status}
                    className={`p-3 rounded border text-xs flex items-center justify-between transition-all ${
                      isCurrent
                        ? 'bg-blue-50 border-[#1B365D] font-bold text-[#1B365D]'
                        : isPassed
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 font-medium'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span>
                        {idx + 1}. {stage.label}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono">
                      {isPassed ? '✓ Complete' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GSTIN Generated Box */}
          {isCompleted && (
            <div className="p-5 bg-emerald-50 border-2 border-emerald-400 rounded my-6 text-center animate-in fade-in duration-500">
              <div className="inline-flex items-center justify-center p-2 bg-emerald-100 text-emerald-800 rounded-full mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-base md:text-lg font-bold text-emerald-950">
                GST Registration Approved — DEMO
              </h2>
              <p className="text-xs text-emerald-800 mt-0.5">
                Your Goods and Services Tax Identification Number (GSTIN) has been allocated.
              </p>

              <div className="mt-3 p-3 bg-white border border-emerald-300 rounded max-w-md mx-auto">
                <span className="text-[11px] text-slate-500 uppercase font-bold block mb-1">
                  Allocated GSTIN (Demo Synthetic)
                </span>
                <span
                  data-testid="gst-gstin"
                  className="font-mono text-2xl font-black text-emerald-900 tracking-wider"
                >
                  {gstin || session.gstin || '29ABCDE1234F1Z5'}
                </span>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-end gap-3">
            <Link
              href="/registration/certificate"
              className={`portal-btn-primary ${!isCompleted ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <Download className="w-4 h-4" />
              <span>View &amp; Download Certificate</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/registration/application/success"
              className="portal-btn-secondary"
            >
              <span>Application Summary</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
