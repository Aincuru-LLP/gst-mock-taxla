'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { ApplicationHeader } from '@/components/application/ApplicationHeader';
import { ApplicationNavTabs } from '@/components/application/ApplicationNavTabs';
import { getSession, saveSession } from '@/lib/state/session-store';
import { CONSTITUTION_OPTIONS } from '@/lib/validation/rules';
import { Save, ArrowRight, ArrowLeft } from 'lucide-react';

export default function BusinessDetailsPage() {
  const router = useRouter();
  const [session, setSession] = useState(getSession());

  const [legalName, setLegalName] = useState<string>('');
  const [tradeName, setTradeName] = useState<string>('');
  const [constitution, setConstitution] = useState<string>('Proprietorship');
  const [pan, setPan] = useState<string>('');
  const [incorporationDate, setIncorporationDate] = useState<string>('2024-01-15');
  const [commencementDate, setCommencementDate] = useState<string>('2024-02-01');
  const [reason, setReason] = useState<string>('Crossing the threshold');
  const [existingReg, setExistingReg] = useState<string>('');
  const [rule14a, setRule14a] = useState<'Yes' | 'No'>('No');

  const [error, setError] = useState<string>('');

  useEffect(() => {
    const s = getSession();
    setSession(s);
    setLegalName(s.business?.legalName || s.legalName || 'TAXLA DEMO TECHNOLOGIES PVT LTD');
    setTradeName(s.business?.tradeName || 'TAXLA TECH');
    setConstitution(s.business?.constitution || 'Proprietorship');
    setPan(s.business?.pan || s.pan || 'ABCDE1234F');
    setIncorporationDate(s.business?.incorporationDate || '2024-01-15');
    setCommencementDate(s.business?.commencementDate || '2024-02-01');
    setReason(s.business?.reason || 'Crossing the threshold');
    setExistingReg(s.business?.existingRegistration || '');
    setRule14a(s.business?.rule14a || 'No');
  }, []);

  const handleSaveAndContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!legalName.trim()) {
      setError('Legal Name is mandatory.');
      return;
    }

    const updated = {
      ...session,
      legalName: legalName.trim(),
      pan: pan.trim().toUpperCase(),
      business: {
        legalName: legalName.trim(),
        tradeName: tradeName.trim(),
        constitution,
        pan: pan.trim().toUpperCase(),
        incorporationDate,
        commencementDate,
        reason,
        existingRegistration: existingReg.trim(),
        rule14a
      },
      completedTabs: {
        ...session.completedTabs,
        business: true
      }
    };

    saveSession(updated);
    router.push('/registration/application/promoters');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PortalHeader
        currentStepTitle="Business Details"
        breadcrumbs={[
          { label: 'Registration', href: '/registration' },
          { label: 'Application', href: '/registration/application' },
          { label: 'Business Details' }
        ]}
      />

      <div className="max-w-6xl mx-auto w-full px-4 py-6 flex-1">
        <ApplicationHeader session={session} />
        <ApplicationNavTabs session={session} />

        <div className="portal-card p-6 border-t-4 border-t-[#1B365D]">
          <form onSubmit={handleSaveAndContinue}>
            <div className="border-b border-slate-200 pb-3 mb-5">
              <h2 className="text-base font-bold text-[#1B365D]">Tab 1: Business Details</h2>
              <p className="text-xs text-slate-600">
                Provide the legal constitution, trade name, and commencement details of the business entity.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Legal Name */}
              <div>
                <label htmlFor="business-legal-name" className="portal-label portal-label-required">
                  Legal Name of Business (as per PAN)
                </label>
                <input
                  id="business-legal-name"
                  data-testid="gst-business-legal-name"
                  type="text"
                  value={legalName}
                  onChange={e => setLegalName(e.target.value)}
                  className="portal-input font-medium"
                  required
                />
              </div>

              {/* Trade Name */}
              <div>
                <label htmlFor="business-trade-name" className="portal-label">
                  Trade Name (if different)
                </label>
                <input
                  id="business-trade-name"
                  data-testid="gst-business-trade-name"
                  type="text"
                  placeholder="Trade Name"
                  value={tradeName}
                  onChange={e => setTradeName(e.target.value)}
                  className="portal-input"
                />
              </div>

              {/* Constitution of Business */}
              <div>
                <label htmlFor="business-constitution" className="portal-label portal-label-required">
                  Constitution of Business
                </label>
                <select
                  id="business-constitution"
                  data-testid="gst-constitution"
                  value={constitution}
                  onChange={e => setConstitution(e.target.value)}
                  className="portal-input"
                  required
                >
                  {CONSTITUTION_OPTIONS.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* PAN */}
              <div>
                <label htmlFor="business-pan" className="portal-label portal-label-required">
                  Permanent Account Number (PAN)
                </label>
                <input
                  id="business-pan"
                  type="text"
                  value={pan}
                  onChange={e => setPan(e.target.value.toUpperCase())}
                  className="portal-input font-mono uppercase bg-slate-50"
                  required
                />
              </div>

              {/* Date of Incorporation */}
              <div>
                <label htmlFor="business-incorporation-date" className="portal-label portal-label-required">
                  Date of Incorporation / Registration
                </label>
                <input
                  id="business-incorporation-date"
                  data-testid="gst-incorporation-date"
                  type="date"
                  value={incorporationDate}
                  onChange={e => setIncorporationDate(e.target.value)}
                  className="portal-input"
                  required
                />
              </div>

              {/* Date of Commencement */}
              <div>
                <label htmlFor="business-commencement-date" className="portal-label portal-label-required">
                  Date of Commencement of Business
                </label>
                <input
                  id="business-commencement-date"
                  data-testid="gst-commencement-date"
                  type="date"
                  value={commencementDate}
                  onChange={e => setCommencementDate(e.target.value)}
                  className="portal-input"
                  required
                />
              </div>

              {/* Reason for Registration */}
              <div>
                <label htmlFor="business-reason" className="portal-label portal-label-required">
                  Reason to Obtain Registration
                </label>
                <select
                  id="business-reason"
                  data-testid="gst-reason"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="portal-input"
                  required
                >
                  <option value="Crossing the threshold">Crossing the threshold</option>
                  <option value="Inter-State supply">Inter-State supply</option>
                  <option value="Liability to pay tax as reverse charge">Liability to pay tax as reverse charge</option>
                  <option value="Voluntary Basis">Voluntary Basis</option>
                  <option value="E-Commerce Operator">E-Commerce Operator</option>
                  <option value="Input Service Distributor only">Input Service Distributor only</option>
                </select>
              </div>

              {/* Rule 14A Option */}
              <div>
                <label htmlFor="business-rule-14a" className="portal-label portal-label-required">
                  Opting for Registration under Rule 14A?
                </label>
                <select
                  id="business-rule-14a"
                  data-testid="gst-rule-14a"
                  value={rule14a}
                  onChange={e => setRule14a(e.target.value as 'Yes' | 'No')}
                  className="portal-input"
                  required
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Simplified process option for specified supplier categories.
                </span>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => router.push('/registration/application')}
                className="portal-btn-secondary"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Summary</span>
              </button>

              <button
                type="submit"
                data-testid="gst-business-save"
                className="portal-btn-primary"
              >
                <Save className="w-4 h-4" />
                <span>Save &amp; Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
