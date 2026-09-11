'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { ApplicationHeader } from '@/components/application/ApplicationHeader';
import { ApplicationNavTabs, APPLICATION_TABS } from '@/components/application/ApplicationNavTabs';
import { getSession } from '@/lib/state/session-store';
import { CheckCircle2, AlertCircle, ArrowRight, FileCheck, Edit3, ShieldAlert } from 'lucide-react';

export default function ApplicationDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState(getSession());

  useEffect(() => {
    setSession(getSession());
  }, []);

  const completedCount = Object.values(session.completedTabs || {}).filter(Boolean).length;
  const totalTabs = APPLICATION_TABS.length;
  const isReadyForVerification = completedCount >= 9; // At least first 9 tabs before final verification

  return (
    <div className="flex flex-col min-h-screen">
      <PortalHeader
        currentStepTitle="Application Dashboard"
        breadcrumbs={[
          { label: 'Registration', href: '/registration' },
          { label: 'Application Summary' }
        ]}
      />

      <div className="max-w-6xl mx-auto w-full px-4 py-6 flex-1">
        
        {/* Header Summary */}
        <ApplicationHeader session={session} />

        {/* Tab Stepper Bar */}
        <ApplicationNavTabs session={session} />

        {/* Progress Overview Card */}
        <div className="portal-card p-5 mb-6 bg-linear-to-r from-blue-50 to-white border-blue-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#1B365D]">
                Application Form Progress ({completedCount} of {totalTabs} Tabs Completed)
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Complete all mandatory sections before proceeding to the final verification and EVC submission.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-32 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${(completedCount / totalTabs) * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold text-slate-800">
                {Math.round((completedCount / totalTabs) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* 10 Tabs Detailed List Table */}
        <div className="portal-card overflow-hidden">
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Registration Sections &amp; Status
            </h3>
            <span className="text-xs text-slate-500 font-medium">Click Edit to review or enter data</span>
          </div>

          <div className="divide-y divide-slate-200">
            {APPLICATION_TABS.map((tab, idx) => {
              const isCompleted = Boolean(session.completedTabs?.[tab.id as keyof typeof session.completedTabs]);

              return (
                <div
                  key={tab.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{tab.label}</h4>
                      <p className="text-xs text-slate-500">
                        {isCompleted
                          ? 'Section details recorded and verified'
                          : 'Mandatory information pending'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Completed</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Incomplete</span>
                        </>
                      )}
                    </span>

                    <Link
                      href={tab.path}
                      className="portal-btn-secondary text-xs py-1 px-3"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isCompleted ? 'View / Edit' : 'Fill Section'}</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-600 flex items-center gap-2">
              {!isReadyForVerification && (
                <span className="flex items-center gap-1 text-amber-800 font-medium">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Please complete the remaining tabs to unlock final EVC submission.
                </span>
              )}
            </div>

            <Link
              href="/registration/application/business"
              className="portal-btn-primary"
            >
              <span>Start with Business Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
