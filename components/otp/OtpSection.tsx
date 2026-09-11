'use client';

import React, { useState } from 'react';
import { DEMO_OTP } from '@/lib/validation/rules';
import { ShieldCheck, Smartphone, Mail, RotateCw } from 'lucide-react';

interface OtpSectionProps {
  title?: string;
  subtitle?: string;
  mobileOtpTestId?: string;
  emailOtpTestId?: string;
  verifyBtnTestId?: string;
  checkpointTestId?: string;
  checkpointType?: string;
  onVerify: (mobileOtp: string, emailOtp: string) => void;
  mobileValue?: string;
  emailValue?: string;
  isLoading?: boolean;
  errorMessage?: string;
}

export function OtpSection({
  title = 'One Time Password (OTP) Verification',
  subtitle = 'OTP has been sent to your registered Mobile Number and Email Address.',
  mobileOtpTestId = 'gst-mobile-otp',
  emailOtpTestId = 'gst-email-otp',
  verifyBtnTestId = 'gst-verify-otp',
  checkpointTestId = 'checkpoint-otp',
  checkpointType = 'otp',
  onVerify,
  mobileValue = '98******10',
  emailValue = 'de******@example.test',
  isLoading = false,
  errorMessage = ''
}: OtpSectionProps) {
  const [mobileOtp, setMobileOtp] = useState<string>('');
  const [emailOtp, setEmailOtp] = useState<string>('');
  const [resendNotice, setResendNotice] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(mobileOtp, emailOtp);
  };

  const handleResend = () => {
    setResendNotice('New OTP successfully re-dispatched. Demo OTP remains: 123456');
    setTimeout(() => setResendNotice(''), 4000);
  };

  const handleFillDemoOtp = () => {
    setMobileOtp(DEMO_OTP);
    setEmailOtp(DEMO_OTP);
  };

  return (
    <div
      data-testid={checkpointTestId}
      data-checkpoint-type={checkpointType}
      data-checkpoint-status="required"
      className="portal-card p-6 border-t-4 border-t-[#1B365D]"
    >
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base md:text-lg font-bold text-[#1B365D] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            {title}
          </h2>
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
        <p className="text-xs text-slate-600 mt-1">{subtitle}</p>
      </div>

      {resendNotice && (
        <div className="mb-4 p-2.5 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded">
          {resendNotice}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        {/* Mobile OTP */}
        <div>
          <label htmlFor={mobileOtpTestId} className="portal-label portal-label-required flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-slate-500" />
            Mobile OTP (Sent to {mobileValue})
          </label>
          <input
            id={mobileOtpTestId}
            data-testid={mobileOtpTestId}
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit Mobile OTP"
            value={mobileOtp}
            onChange={e => setMobileOtp(e.target.value.replace(/[^0-9]/g, ''))}
            className="portal-input font-mono text-center tracking-widest text-base font-bold max-w-xs"
            autoComplete="one-time-code"
            required
          />
          <span className="text-[11px] text-slate-500 block mt-1">
            For automation/human verification: Use <strong>123456</strong>
          </span>
        </div>

        {/* Email OTP */}
        <div>
          <label htmlFor={emailOtpTestId} className="portal-label portal-label-required flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            Email OTP (Sent to {emailValue})
          </label>
          <input
            id={emailOtpTestId}
            data-testid={emailOtpTestId}
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit Email OTP"
            value={emailOtp}
            onChange={e => setEmailOtp(e.target.value.replace(/[^0-9]/g, ''))}
            className="portal-input font-mono text-center tracking-widest text-base font-bold max-w-xs"
            autoComplete="one-time-code"
            required
          />
          <span className="text-[11px] text-slate-500 block mt-1">
            For automation/human verification: Use <strong>123456</strong>
          </span>
        </div>

        {/* Actions */}
        <div className="pt-3 flex flex-wrap items-center gap-3">
          <button
            id={verifyBtnTestId}
            data-testid={verifyBtnTestId}
            type="submit"
            disabled={isLoading || !mobileOtp || !emailOtp}
            className="portal-btn-primary disabled:opacity-50"
          >
            {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
          </button>

          <button
            type="button"
            onClick={handleResend}
            className="portal-btn-secondary text-xs"
          >
            <RotateCw className="w-3 h-3" />
            Resend OTP
          </button>
        </div>
      </form>
    </div>
  );
}
