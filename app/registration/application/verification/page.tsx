'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { ApplicationHeader } from '@/components/application/ApplicationHeader';
import { ApplicationNavTabs } from '@/components/application/ApplicationNavTabs';
import { getSession, saveSession } from '@/lib/state/session-store';
import { FileCheck, ArrowRight, ArrowLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function VerificationPage() {
  const router = useRouter();
  const [session, setSession] = useState(getSession());

  const [signatoryName, setSignatoryName] = useState<string>('RAMESH KUMAR SHARMA');
  const [place, setPlace] = useState<string>('Bengaluru');
  const [declared, setDeclared] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const s = getSession();
    setSession(s);
    setSignatoryName(s.verification?.signatoryName || s.signatory?.name || 'RAMESH KUMAR SHARMA');
    setPlace(s.verification?.place || s.district || 'Bengaluru');
    setDeclared(s.verification?.declared ?? true);
  }, []);

  const handleProceedToEvc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declared) {
      setError('You must accept the statutory declaration before proceeding.');
      return;
    }

    if (!place.trim()) {
      setError('Please enter the Place of verification.');
      return;
    }

    const updated = {
      ...session,
      verification: {
        signatoryName,
        place: place.trim(),
        declared: true,
        date: new Date().toISOString().split('T')[0]
      },
      completedTabs: {
        ...session.completedTabs,
        verification: true
      }
    };

    saveSession(updated);
    router.push('/registration/application/evc');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PortalHeader
        currentStepTitle="Verification &amp; Declaration"
        breadcrumbs={[
          { label: 'Registration', href: '/registration' },
          { label: 'Application', href: '/registration/application' },
          { label: 'Verification' }
        ]}
      />

      <div className="max-w-6xl mx-auto w-full px-4 py-6 flex-1">
        <ApplicationHeader session={session} />
        <ApplicationNavTabs session={session} />

        <div className="portal-card p-6 border-t-4 border-t-[#1B365D]">
          
          <div className="border-b border-slate-200 pb-3 mb-5">
            <h2 className="text-base font-bold text-[#1B365D] flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Tab 10: Verification &amp; Statutory Declaration
            </h2>
            <p className="text-xs text-slate-600">
              Review your declaration and confirm identity of Authorized Signatory prior to final EVC authentication.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleProceedToEvc}>
            
            {/* Statutory Declaration Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded mb-6 text-xs text-slate-800 space-y-3">
              <div className="flex items-start gap-3">
                <input
                  id="gst-declaration"
                  data-testid="gst-declaration"
                  type="checkbox"
                  checked={declared}
                  onChange={e => setDeclared(e.target.checked)}
                  className="w-4 h-4 text-[#1B365D] rounded border-slate-300 focus:ring-blue-500 shrink-0 mt-0.5"
                  required
                />
                <label htmlFor="gst-declaration" className="cursor-pointer leading-relaxed">
                  <strong>I hereby solemnly affirm and declare</strong> that the information given herein above is true and correct to the best of my knowledge and belief and nothing has been concealed therefrom. I understand that any false statement or suppression of material facts will render me liable to prosecution and cancellation of registration under the Central / State Goods and Services Tax Act.
                </label>
              </div>
            </div>

            {/* Signatory & Place Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              
              {/* Authorized Signatory Dropdown */}
              <div>
                <label htmlFor="signatory-name" className="portal-label portal-label-required">
                  Name of Authorized Signatory
                </label>
                <select
                  id="signatory-name"
                  value={signatoryName}
                  onChange={e => setSignatoryName(e.target.value)}
                  className="portal-input font-medium"
                  required
                >
                  <option value={signatoryName}>{signatoryName}</option>
                  {session.promoters?.map(p => (
                    <option key={p.id} value={`${p.firstName} ${p.lastName}`}>
                      {p.firstName} {p.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Place */}
              <div>
                <label htmlFor="gst-place" className="portal-label portal-label-required">
                  Place
                </label>
                <input
                  id="gst-place"
                  data-testid="gst-place"
                  type="text"
                  placeholder="e.g. Bengaluru"
                  value={place}
                  onChange={e => setPlace(e.target.value)}
                  className="portal-input"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label htmlFor="verification-date" className="portal-label">
                  Date
                </label>
                <input
                  id="verification-date"
                  type="text"
                  disabled
                  value={new Date().toLocaleDateString('en-GB')}
                  className="portal-input bg-slate-100 text-slate-600"
                />
              </div>

            </div>

            {/* Summary Review Notice */}
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 flex items-start gap-2.5 mb-6">
              <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Next Step: Electronic Verification Code (EVC)</span>
                <p className="text-slate-600 mt-0.5">
                  Clicking <strong>&quot;Proceed to EVC&quot;</strong> will transition to the final Human Checkpoint,
                  where Playwright automation can pause for human OTP entry or supply the demo OTP (123456).
                </p>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => router.push('/registration/application/aadhaar')}
                className="portal-btn-secondary"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back (Aadhaar)</span>
              </button>

              <button
                type="submit"
                className="portal-btn-primary"
              >
                <span>Proceed to EVC</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
