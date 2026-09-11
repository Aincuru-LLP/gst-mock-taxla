'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { ApplicationHeader } from '@/components/application/ApplicationHeader';
import { ApplicationNavTabs } from '@/components/application/ApplicationNavTabs';
import { getSession, saveSession } from '@/lib/state/session-store';
import { DEMO_OTP, validateOtp } from '@/lib/validation/rules';
import { ShieldCheck, Save, ArrowRight, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';

export default function AadhaarAuthPage() {
  const router = useRouter();
  const [session, setSession] = useState(getSession());

  const [opted, setOpted] = useState<'YES' | 'NO'>('YES');
  const [aadhaarNumber, setAadhaarNumber] = useState<string>('234567890123');
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [aadhaarOtp, setAadhaarOtp] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const s = getSession();
    setSession(s);
    if (s.aadhaarAuthentication) {
      setOpted(s.aadhaarAuthentication.opted || 'YES');
      setAadhaarNumber(s.aadhaarAuthentication.aadhaarNumber || '234567890123');
      setIsVerified(Boolean(s.aadhaarAuthentication.isVerified));
    }
  }, []);

  const handleSendOtp = () => {
    if (!aadhaarNumber || aadhaarNumber.length < 12) {
      setError('Please enter a valid 12-digit Aadhaar Number.');
      return;
    }
    setError('');
    setIsOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOtp(aadhaarOtp, session.scenario)) {
      setError('Invalid Aadhaar OTP. For demo verification, please use: 123456');
      return;
    }

    setIsVerified(true);
    setIsOtpSent(false);
    setError('');

    const updated = {
      ...session,
      aadhaarAuthentication: {
        opted,
        aadhaarNumber,
        isVerified: true,
        verificationDate: new Date().toISOString()
      },
      completedTabs: {
        ...session.completedTabs,
        aadhaar: true
      }
    };
    saveSession(updated);
  };

  const handleSaveAndContinue = () => {
    if (opted === 'YES' && !isVerified) {
      setError('Please complete the Aadhaar authentication checkpoint before proceeding.');
      return;
    }

    const updated = {
      ...session,
      aadhaarAuthentication: {
        opted,
        aadhaarNumber,
        isVerified: opted === 'YES' ? isVerified : false,
        verificationDate: isVerified ? new Date().toISOString() : undefined
      },
      completedTabs: {
        ...session.completedTabs,
        aadhaar: true
      }
    };

    saveSession(updated);
    router.push('/registration/application/verification');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PortalHeader
        currentStepTitle="Aadhaar Authentication"
        breadcrumbs={[
          { label: 'Registration', href: '/registration' },
          { label: 'Application', href: '/registration/application' },
          { label: 'Aadhaar Authentication' }
        ]}
      />

      <div className="max-w-6xl mx-auto w-full px-4 py-6 flex-1">
        <ApplicationHeader session={session} />
        <ApplicationNavTabs session={session} />

        <div className="portal-card p-6 border-t-4 border-t-[#1B365D]">
          
          <div className="border-b border-slate-200 pb-3 mb-5">
            <h2 className="text-base font-bold text-[#1B365D] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Tab 9: Aadhaar Authentication
            </h2>
            <p className="text-xs text-slate-600">
              Opting for Aadhaar Authentication of Promoters and Authorized Signatories expedites GST registration approval.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded">
              {error}
            </div>
          )}

          {/* Opt-in radio buttons */}
          <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded">
            <label className="portal-label portal-label-required mb-2">
              Do you want to opt for Aadhaar Authentication of Promoters / Authorized Signatory?
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                <input
                  type="radio"
                  data-testid="gst-aadhaar-auth"
                  name="aadhaarAuth"
                  value="YES"
                  checked={opted === 'YES'}
                  onChange={() => setOpted('YES')}
                  className="w-4 h-4 text-[#1B365D]"
                />
                <span>YES (Recommended - Speeds up registration approval)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                <input
                  type="radio"
                  name="aadhaarAuth"
                  value="NO"
                  checked={opted === 'NO'}
                  onChange={() => setOpted('NO')}
                  className="w-4 h-4 text-[#1B365D]"
                />
                <span>NO (Physical site verification may be conducted)</span>
              </label>
            </div>
          </div>

          {/* When YES: Aadhaar Authentication Section & Checkpoint */}
          {opted === 'YES' && (
            <div
              data-testid="checkpoint-aadhaar"
              data-checkpoint-type="aadhaar"
              data-checkpoint-status={isVerified ? 'completed' : 'required'}
              className="border border-slate-200 rounded p-5 bg-white mb-6 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-blue-700" />
                  Authorized Signatory Aadhaar Verification Checkpoint
                </h3>
                {isVerified ? (
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Aadhaar Authentication Successful
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded text-xs font-bold">
                    Demo OTP: {DEMO_OTP}
                  </span>
                )}
              </div>

              {!isVerified ? (
                <div className="space-y-4 max-w-xl">
                  <div>
                    <label htmlFor="aadhaar-number" className="portal-label portal-label-required">
                      Aadhaar Number of Signatory ({session.signatory?.name || 'RAMESH SHARMA'})
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        id="aadhaar-number"
                        data-testid="gst-aadhaar-number"
                        type="text"
                        maxLength={12}
                        placeholder="12-digit Aadhaar Number"
                        value={aadhaarNumber}
                        onChange={e => setAadhaarNumber(e.target.value.replace(/[^0-9]/g, ''))}
                        className="portal-input font-mono max-w-xs"
                        required
                      />

                      <button
                        type="button"
                        data-testid="gst-aadhaar-verify"
                        onClick={handleSendOtp}
                        className="portal-btn-primary text-xs py-2"
                      >
                        Send Mock Aadhaar OTP
                      </button>
                    </div>
                  </div>

                  {isOtpSent && (
                    <form onSubmit={handleVerifyOtp} className="p-4 bg-blue-50/70 border border-blue-200 rounded space-y-3">
                      <label htmlFor="aadhaar-otp" className="portal-label portal-label-required">
                        Enter Aadhaar OTP (Sent to linked mobile)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          id="aadhaar-otp"
                          data-testid="gst-aadhaar-otp"
                          type="text"
                          maxLength={6}
                          placeholder="Enter 6-digit OTP"
                          value={aadhaarOtp}
                          onChange={e => setAadhaarOtp(e.target.value.replace(/[^0-9]/g, ''))}
                          className="portal-input font-mono text-center tracking-widest font-bold max-w-xs"
                          required
                        />

                        <button
                          type="submit"
                          className="portal-btn-primary text-xs py-2 bg-emerald-700 hover:bg-emerald-800 border-emerald-700"
                        >
                          Verify Aadhaar OTP
                        </button>
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        Use demo OTP <strong>123456</strong> to complete human checkpoint verification.
                      </span>
                    </form>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold text-sm text-emerald-900">
                      Aadhaar Authentication Successful
                    </div>
                    <p className="text-emerald-700">
                      Identity verified for {session.signatory?.name || 'RAMESH SHARMA'} against synthetic UIDAI test registry.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Actions */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push('/registration/application/state-specific')}
              className="portal-btn-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back (State Specific)</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAndContinue}
              className="portal-btn-primary"
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
