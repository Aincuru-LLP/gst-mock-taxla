'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { OtpSection } from '@/components/otp/OtpSection';
import { getSession, saveSession, generateSyntheticTrn } from '@/lib/state/session-store';
import { validateOtp } from '@/lib/validation/rules';

export default function InitialOtpVerifyPage() {
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

    // Generate synthetic TRN
    const generatedTrn = generateSyntheticTrn(session.applicationId);
    const now = new Date();
    const expiry = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);

    const updated = {
      ...session,
      trn: generatedTrn,
      trnStatus: 'GENERATED' as const,
      trnCreatedAt: now.toISOString(),
      trnExpiryDate: expiry.toISOString().split('T')[0],
      status: 'TRN_GENERATED' as const
    };

    saveSession(updated);
    setIsLoading(false);

    router.push('/registration/trn-generated');
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
        currentStepTitle="OTP Verification"
        breadcrumbs={[
          { label: 'Registration', href: '/registration' },
          { label: 'New Registration', href: '/registration/new' },
          { label: 'Verify OTP' }
        ]}
      />

      <div className="max-w-2xl mx-auto w-full px-4 py-8 flex-1">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-[#1B365D]">Verify Mobile &amp; Email OTP</h1>
          <p className="text-xs text-slate-600 mt-1">
            To proceed with your application, please enter the One Time Passwords (OTPs) dispatched to your contact details.
          </p>
        </div>

        <OtpSection
          title="Initial Registration OTP Checkpoint"
          subtitle="A separate OTP has been dispatched to your mobile number and email address."
          mobileOtpTestId="gst-mobile-otp"
          emailOtpTestId="gst-email-otp"
          verifyBtnTestId="gst-verify-otp"
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
