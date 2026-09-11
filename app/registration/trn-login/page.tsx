'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { CaptchaBox } from '@/components/captcha/CaptchaBox';
import { getSession, saveSession } from '@/lib/state/session-store';
import { validateCaptcha, validateEmail, validateMobile } from '@/lib/validation/rules';
import { KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';

export default function TrnLoginPage() {
  const router = useRouter();

  const [trn, setTrn] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [captcha, setCaptcha] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const session = getSession();
    if (session.trn) setTrn(session.trn);
    if (session.email) setEmail(session.email);
    if (session.mobile) setMobile(session.mobile);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const cleanTrn = trn.trim().toUpperCase();
    if (!cleanTrn) {
      newErrors.trn = 'Temporary Reference Number (TRN) is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Registered Email Address is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!mobile.trim()) {
      newErrors.mobile = 'Registered Mobile Number is required';
    } else if (!validateMobile(mobile)) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }

    const currentSession = getSession();
    if (!captcha.trim()) {
      newErrors.captcha = 'CAPTCHA is required';
    } else if (!validateCaptcha(captcha, currentSession.scenario)) {
      newErrors.captcha = 'Invalid CAPTCHA entered. For demo, use 1234';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Save session state with updated credentials if entered
    const updated = {
      ...currentSession,
      trn: cleanTrn,
      email: email.trim(),
      mobile: mobile.trim()
    };
    saveSession(updated);

    router.push('/registration/trn-login/verify');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PortalHeader
        currentStepTitle="TRN Login"
        breadcrumbs={[
          { label: 'Registration', href: '/registration' },
          { label: 'TRN Login' }
        ]}
      />

      <div className="max-w-3xl mx-auto w-full px-4 py-8 flex-1">
        
        <div className="mb-4">
          <h1 className="text-xl font-bold text-[#1B365D]">Temporary Reference Number (TRN) Login</h1>
          <p className="text-xs text-slate-600 mt-1">
            Access your saved GST registration application using your Temporary Reference Number (TRN).
          </p>
        </div>

        <div className="portal-card p-6 border-t-4 border-t-[#D97706]">
          <form onSubmit={handleSubmit} noValidate>
            
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-4">
              <KeyRound className="w-5 h-5 text-[#D97706]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Applicant Credentials
              </h2>
            </div>

            <div className="space-y-4">
              
              {/* TRN Input */}
              <div>
                <label htmlFor="trn-input" className="portal-label portal-label-required">
                  Temporary Reference Number (TRN)
                </label>
                <input
                  id="trn-input"
                  data-testid="gst-trn-login"
                  type="text"
                  placeholder="e.g. TRN202609012345"
                  value={trn}
                  onChange={e => setTrn(e.target.value.toUpperCase())}
                  className="portal-input font-mono font-bold tracking-wider max-w-md"
                  required
                />
                {errors.trn && <p className="text-xs text-red-600 mt-1">{errors.trn}</p>}
                <span className="text-[11px] text-slate-500 block mt-1">
                  Auto-populated from the active demo session.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label htmlFor="email-input" className="portal-label portal-label-required">
                    Registered Email Address
                  </label>
                  <input
                    id="email-input"
                    data-testid="gst-trn-email"
                    type="email"
                    placeholder="e.g. demo@taxla-example.test"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="portal-input"
                    required
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>

                {/* Mobile */}
                <div>
                  <label htmlFor="mobile-input" className="portal-label portal-label-required">
                    Registered Mobile Number
                  </label>
                  <input
                    id="mobile-input"
                    data-testid="gst-trn-mobile"
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={e => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                    className="portal-input"
                    required
                  />
                  {errors.mobile && <p className="text-xs text-red-600 mt-1">{errors.mobile}</p>}
                </div>
              </div>

              {/* CAPTCHA */}
              <div className="pt-2">
                <CaptchaBox
                  value={captcha}
                  onChange={setCaptcha}
                  error={errors.captcha}
                  testId="gst-trn-captcha"
                />
              </div>

            </div>

            {/* Submit */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-end">
              <button
                type="submit"
                data-testid="gst-trn-proceed"
                disabled={isSubmitting}
                className="portal-btn-primary"
              >
                <span>{isSubmitting ? 'Verifying...' : 'Proceed to Verification'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
