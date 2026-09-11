'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { ApplicationHeader } from '@/components/application/ApplicationHeader';
import { getSession, saveSession, generateSyntheticArn } from '@/lib/state/session-store';
import { DEMO_OTP, validateOtp } from '@/lib/validation/rules';
import { ShieldCheck, Smartphone, Mail, RotateCw, Lock } from 'lucide-react';

export default function FinalEvcPage() {
  const router = useRouter();
  const [session, setSession] = useState(getSession());

  const [mobileOtp, setMobileOtp] = useState<string>('');
  const [emailOtp, setEmailOtp] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resendNotice, setResendNotice] = useState<string>('');

  useEffect(() => {
    setSession(getSession());
  }, []);

  const handleFillDemoOtp = () => {
    setMobileOtp(DEMO_OTP);
    setEmailOtp(DEMO_OTP);
  };

  const handleResend = () => {
    setResendNotice('Fresh EVC re-dispatched. Demo OTP: 123456');
    setTimeout(() => setResendNotice(''), 4000);
  };

  const handleSubmitEvc = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const isMobileValid = validateOtp(mobileOtp, session.scenario);
    const isEmailValid = validateOtp(emailOtp, session.scenario);

    if (!isMobileValid || !isEmailValid) {
      setError('Invalid EVC / OTP entered. For demo verification, please use: 123456');
      setIsLoading(false);
      return;
    }

    // Generate synthetic ARN
    const syntheticArn = generateSyntheticArn(session.trn || 'TRN202609012345');
    const now = new Date().toISOString();

    const updated = {
      ...session,
      arn: syntheticArn,
      arnGeneratedAt: now,
      status: 'SUBMITTED' as const
    };

    saveSession(updated);
    setIsLoading(false);

    router.push('/registration/application/arn');
  };

  const maskedMobile = session.mobile
    ? `${session.mobile.slice(0, 2)}******${session.mobile.slice(-2)}`
    : '98******10';

  const maskedEmail = session.email
    ? `${session.email.slice(0, 2)}******@${session.email.split('@')[1] || 'example.test'}`
    : 'de******@example.test';

  return (
    <div className="flex flex-col min-h-screen">
      <PortalHeader
        currentStepTitle="Electronic Verification Code (EVC)"
        breadcrumbs={[
          { label: 'Registration', href: '/registration' },
          { label: 'Application', href: '/registration/application' },
          { label: 'Final EVC' }
        ]}
      />

      <div className="max-w-4xl mx-auto w-full px-4 py-6 flex-1">
        <ApplicationHeader session={session} />

        {/* Human Checkpoint Container */}
        <div
          data-testid="checkpoint-final-otp"
          data-checkpoint-type="otp"
          data-checkpoint-status="required"
          className="portal-card p-6 border-t-4 border-t-emerald-600 mb-6"
        >
          <div className="border-b border-slate-200 pb-4 mb-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-600" />
                  Final Submission Checkpoint — EVC Authentication
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  Sign application using Electronic Verification Code (EVC) dispatched to registered credentials.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded text-xs font-bold font-mono">
                  Demo OTP: {DEMO_OTP}
                </span>
                <button
                  type="button"
                  onClick={handleFillDemoOtp}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded border border-slate-300 font-medium cursor-pointer"
                >
                  Fill Demo OTP
                </button>
              </div>
            </div>
          </div>

          {resendNotice && (
            <div className="mb-4 p-2.5 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded">
              {resendNotice}
            </div>
          )}

          {error && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmitEvc} className="space-y-4 max-w-xl">
            {/* Method selection: fixed to EVC */}
            <div>
              <label htmlFor="auth-method" className="portal-label">Verification Method</label>
              <input
                id="auth-method"
                type="text"
                disabled
                value="EVC (Electronic Verification Code)"
                className="portal-input bg-slate-100 font-semibold text-slate-700"
              />
            </div>

            {/* Mobile OTP */}
            <div>
              <label htmlFor="final-mobile-otp" className="portal-label portal-label-required flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                Mobile EVC / OTP (Dispatched to {maskedMobile})
              </label>
              <input
                id="final-mobile-otp"
                data-testid="gst-final-otp"
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit Mobile OTP"
                value={mobileOtp}
                onChange={e => setMobileOtp(e.target.value.replace(/[^0-9]/g, ''))}
                className="portal-input font-mono text-center tracking-widest text-base font-bold max-w-xs"
                required
              />
            </div>

            {/* Email OTP */}
            <div>
              <label htmlFor="final-email-otp" className="portal-label portal-label-required flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                Email EVC / OTP (Dispatched to {maskedEmail})
              </label>
              <input
                id="final-email-otp"
                data-testid="gst-final-email-otp"
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit Email OTP"
                value={emailOtp}
                onChange={e => setEmailOtp(e.target.value.replace(/[^0-9]/g, ''))}
                className="portal-input font-mono text-center tracking-widest text-base font-bold max-w-xs"
                required
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                id="gst-submit-evc"
                data-testid="gst-submit-evc"
                disabled={isLoading || !mobileOtp || !emailOtp}
                className="portal-btn-primary disabled:opacity-50"
              >
                {isLoading ? 'Verifying & Submitting...' : 'Submit Application via EVC'}
              </button>

              <button
                type="button"
                onClick={handleResend}
                className="portal-btn-secondary text-xs"
              >
                <RotateCw className="w-3 h-3" />
                Resend EVC
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
