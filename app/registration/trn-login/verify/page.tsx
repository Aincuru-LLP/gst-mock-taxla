'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { OtpSection } from '@/components/otp/OtpSection';
import { getSession, saveSession } from '@/lib/state/session-store';
import { validateOtp } from '@/lib/validation/rules';

export default function TrnLoginVerifyPage() {
  const router = useRouter();
  const [session, setSession] = useState(getSession());
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setSession(getSession());
  }, []);

  const handleVerify = (mobileOtp: string, emailOtp: string) => {
    setError('');
    setIsLoading(true);

    const isMobileValid = validateOtp(mobileOtp, session.scenario);
    const isEmailValid = validateOtp(emailOtp, session.scenario);

    if (!isMobileValid || !isEmailValid) {
      setError('Invalid OTP entered. Please use demo OTP: 123456');
      setIsLoading(false);
      return;
    }

    const updated = {
      ...session,
      trnStatus: 'VERIFIED' as const,
      status: 'IN_PROGRESS' as const
    };
    saveSession(updated);
    setIsLoading(false);

    router.push('/registration/application');
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
        currentStepTitle="TRN Authentication"
        breadcrumbs={[
          { label: 'Registration', href: '/registration' },
          { label: 'TRN Login', href: '/registration/trn-login' },
          { label: 'Verify OTP' }
        ]}
      />

      <div className="max-w-2xl mx-auto w-full px-4 py-8 flex-1">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-[#1B365D]">TRN Authentication Checkpoint</h1>
          <p className="text-xs text-slate-600 mt-1">
            Authenticate your login session using the OTP dispatched to your registered credentials.
          </p>
        </div>

        <OtpSection
          title="Second OTP Checkpoint (TRN Login)"
          subtitle={`Verifying access for TRN: ${session.trn || 'TRN202609012345'}`}
          mobileOtpTestId="gst-trn-mobile-otp"
          emailOtpTestId="gst-trn-email-otp"
          verifyBtnTestId="gst-trn-verify-otp"
          checkpointTestId="checkpoint-otp"
          checkpointType="otp"
          mobileValue={maskedMobile}
          emailValue={maskedEmail}
          onVerify={handleVerify}
          isLoading={isLoading}
          errorMessage={error}
        />
      </div>
    </div>
  );
}
