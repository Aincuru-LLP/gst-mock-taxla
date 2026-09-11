'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { CaptchaBox } from '@/components/captcha/CaptchaBox';
import { INDIAN_STATES, getDistrictsForState } from '@/lib/data/locations';
import { TAXPAYER_TYPE_OPTIONS, validatePan, validateMobile, validateEmail, validateCaptcha } from '@/lib/validation/rules';
import { getSession, saveSession, resetSession } from '@/lib/state/session-store';
import { ArrowRight, RotateCcw, AlertCircle, Info } from 'lucide-react';

export default function NewRegistrationPage() {
  const router = useRouter();

  const [taxpayerType, setTaxpayerType] = useState<string>('Taxpayer');
  const [state, setState] = useState<string>('Karnataka');
  const [district, setDistrict] = useState<string>('Bengaluru Urban');
  const [legalName, setLegalName] = useState<string>('');
  const [pan, setPan] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [captcha, setCaptcha] = useState<string>('');

  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const session = getSession();
    if (session.legalName) setLegalName(session.legalName);
    if (session.pan) setPan(session.pan);
    if (session.email) setEmail(session.email);
    if (session.mobile) setMobile(session.mobile);
    if (session.state) {
      setState(session.state);
      setAvailableDistricts(getDistrictsForState(session.state));
    } else {
      setAvailableDistricts(getDistrictsForState('Karnataka'));
    }
    if (session.district) setDistrict(session.district);
    if (session.taxpayerType) setTaxpayerType(session.taxpayerType);
  }, []);

  const handleStateChange = (selectedState: string) => {
    setState(selectedState);
    const districts = getDistrictsForState(selectedState);
    setAvailableDistricts(districts);
    setDistrict(districts[0] || '');
  };

  const handleReset = () => {
    const fresh = resetSession();
    setTaxpayerType(fresh.taxpayerType);
    setState(fresh.state);
    const dists = getDistrictsForState(fresh.state);
    setAvailableDistricts(dists);
    setDistrict(dists[0] || '');
    setLegalName('');
    setPan('');
    setEmail('');
    setMobile('');
    setCaptcha('');
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!taxpayerType) newErrors.taxpayerType = 'Please select taxpayer type';
    if (!state) newErrors.state = 'Please select state';
    if (!district) newErrors.district = 'Please select district';
    if (!legalName.trim()) newErrors.legalName = 'Legal Name of Business as per PAN is required';

    if (!pan.trim()) {
      newErrors.pan = 'Permanent Account Number (PAN) is required';
    } else if (!validatePan(pan)) {
      newErrors.pan = 'Invalid PAN format. Must be 10 characters (e.g. ABCDE1234F)';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!validateMobile(mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    const currentSession = getSession();
    if (!captcha.trim()) {
      newErrors.captcha = 'Please enter the characters shown in the CAPTCHA';
    } else if (!validateCaptcha(captcha, currentSession.scenario)) {
      newErrors.captcha = 'Invalid CAPTCHA entered. For demo, use 1234';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Save session state
    const cleanPan = pan.trim().toUpperCase();
    const updated = {
      ...currentSession,
      taxpayerType,
      state,
      district,
      legalName: legalName.trim(),
      pan: cleanPan,
      email: email.trim(),
      mobile: mobile.trim(),
      business: {
        ...currentSession.business,
        legalName: legalName.trim(),
        pan: cleanPan
      }
    };
    saveSession(updated);

    router.push('/registration/new/verify');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PortalHeader
        currentStepTitle="New Registration (Part A)"
        breadcrumbs={[{ label: 'Registration', href: '/registration' }, { label: 'New Registration' }]}
      />

      <div className="max-w-4xl mx-auto w-full px-4 py-6 flex-1">
        
        {/* Page Title & Instructions */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-[#1B365D]">New Registration</h1>
          <p className="text-xs text-slate-600 mt-1">
            Fill the preliminary information below to generate a Temporary Reference Number (TRN).
            Fields marked with an asterisk (<span className="text-red-600 font-bold">*</span>) are mandatory.
          </p>
        </div>

        {/* Informational Guidance Box */}
        <div className="portal-card p-3.5 mb-6 bg-blue-50/70 border-blue-200 text-xs text-blue-950 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Important Instructions for Automation &amp; Applicants:</span>
            <p className="text-slate-600">
              Ensure Legal Name matches the PAN database exactly. Synthetic demo PANs (e.g., <code>ABCDE1234F</code>)
              are fully accepted in this mock environment.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="portal-card p-6 border-t-4 border-t-[#1B365D]">
          <form onSubmit={handleSubmit} noValidate>
            
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2 mb-4">
              Taxpayer Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* 1. Taxpayer Type */}
              <div>
                <label htmlFor="taxpayer-type-select" className="portal-label portal-label-required">
                  I am a
                </label>
                <select
                  id="taxpayer-type-select"
                  data-testid="gst-taxpayer-type"
                  value={taxpayerType}
                  onChange={e => setTaxpayerType(e.target.value)}
                  className="portal-input"
                  required
                >
                  {TAXPAYER_TYPE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.taxpayerType && (
                  <p className="text-xs text-red-600 mt-1">{errors.taxpayerType}</p>
                )}
              </div>

              {/* 2. State */}
              <div>
                <label htmlFor="state-select" className="portal-label portal-label-required">
                  State / UT
                </label>
                <select
                  id="state-select"
                  data-testid="gst-state"
                  value={state}
                  onChange={e => handleStateChange(e.target.value)}
                  className="portal-input"
                  required
                >
                  {INDIAN_STATES.map(s => (
                    <option key={s.code} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-xs text-red-600 mt-1">{errors.state}</p>
                )}
              </div>

              {/* 3. District */}
              <div>
                <label htmlFor="district-select" className="portal-label portal-label-required">
                  District
                </label>
                <select
                  id="district-select"
                  data-testid="gst-district"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="portal-input"
                  required
                >
                  {availableDistricts.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-xs text-red-600 mt-1">{errors.district}</p>
                )}
              </div>

              {/* 4. Legal Name */}
              <div>
                <label htmlFor="legal-name-input" className="portal-label portal-label-required">
                  Legal Name of Business (as per PAN)
                </label>
                <input
                  id="legal-name-input"
                  data-testid="gst-legal-name"
                  type="text"
                  placeholder="e.g. TAXLA DEMO TECHNOLOGIES PVT LTD"
                  value={legalName}
                  onChange={e => setLegalName(e.target.value)}
                  className="portal-input"
                  required
                />
                {errors.legalName && (
                  <p className="text-xs text-red-600 mt-1">{errors.legalName}</p>
                )}
              </div>

              {/* 5. PAN */}
              <div>
                <label htmlFor="pan-input" className="portal-label portal-label-required">
                  Permanent Account Number (PAN)
                </label>
                <input
                  id="pan-input"
                  data-testid="gst-pan"
                  type="text"
                  maxLength={10}
                  placeholder="e.g. ABCDE1234F"
                  value={pan}
                  onChange={e => setPan(e.target.value.toUpperCase())}
                  className="portal-input font-mono uppercase"
                  required
                />
                {errors.pan && (
                  <p className="text-xs text-red-600 mt-1">{errors.pan}</p>
                )}
              </div>

              {/* 6. Email Address */}
              <div>
                <label htmlFor="email-input" className="portal-label portal-label-required">
                  Email Address
                </label>
                <input
                  id="email-input"
                  data-testid="gst-email"
                  type="email"
                  placeholder="e.g. demo@taxla-example.test"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="portal-input"
                  required
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              {/* 7. Mobile Number */}
              <div>
                <label htmlFor="mobile-input" className="portal-label portal-label-required">
                  Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-2.5 bg-slate-100 border border-r-0 border-slate-300 rounded-l text-xs font-semibold text-slate-600">
                    +91
                  </span>
                  <input
                    id="mobile-input"
                    data-testid="gst-mobile"
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={e => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                    className="portal-input rounded-l-none"
                    required
                  />
                </div>
                {errors.mobile && (
                  <p className="text-xs text-red-600 mt-1">{errors.mobile}</p>
                )}
              </div>

            </div>

            {/* 8. Visual CAPTCHA Component */}
            <div className="mt-4">
              <CaptchaBox
                value={captcha}
                onChange={setCaptcha}
                error={errors.captcha}
                testId="gst-captcha"
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="portal-btn-secondary"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>

              <button
                type="submit"
                data-testid="gst-proceed"
                disabled={isSubmitting}
                className="portal-btn-primary"
              >
                <span>{isSubmitting ? 'Validating...' : 'Proceed'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
