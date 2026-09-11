'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { ApplicationHeader } from '@/components/application/ApplicationHeader';
import { ApplicationNavTabs } from '@/components/application/ApplicationNavTabs';
import { getSession, saveSession } from '@/lib/state/session-store';
import { StateSpecificDetails } from '@/types/gst';
import { FileCode2, Save, ArrowRight, ArrowLeft, Info } from 'lucide-react';

export default function StateSpecificPage() {
  const router = useRouter();
  const [session, setSession] = useState(getSession());

  const [ptEcNumber, setPtEcNumber] = useState<string>('PT-EC-29-987654');
  const [ptRcNumber, setPtRcNumber] = useState<string>('PT-RC-29-123456');
  const [stateExciseNumber, setStateExciseNumber] = useState<string>('');
  const [licenseHolderName, setLicenseHolderName] = useState<string>('RAMESH KUMAR SHARMA');

  useEffect(() => {
    const s = getSession();
    setSession(s);
    if (s.stateSpecific) {
      setPtEcNumber(s.stateSpecific.professionalTaxECNumber || 'PT-EC-29-987654');
      setPtRcNumber(s.stateSpecific.professionalTaxRCNumber || 'PT-RC-29-123456');
      setStateExciseNumber(s.stateSpecific.stateExciseLicenseNumber || '');
      setLicenseHolderName(s.stateSpecific.licenseHoldersName || s.legalName || 'RAMESH KUMAR SHARMA');
    }
  }, []);

  const handleSaveAndContinue = (e: React.FormEvent) => {
    e.preventDefault();

    const stateData: StateSpecificDetails = {
      professionalTaxECNumber: ptEcNumber.trim(),
      professionalTaxRCNumber: ptRcNumber.trim(),
      stateExciseLicenseNumber: stateExciseNumber.trim(),
      licenseHoldersName: licenseHolderName.trim()
    };

    const updated = {
      ...session,
      stateSpecific: stateData,
      completedTabs: {
        ...session.completedTabs,
        'state-specific': true
      }
    };

    saveSession(updated);
    router.push('/registration/application/aadhaar');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PortalHeader
        currentStepTitle="State Specific Information"
        breadcrumbs={[
          { label: 'Registration', href: '/registration' },
          { label: 'Application', href: '/registration/application' },
          { label: 'State Specific' }
        ]}
      />

      <div className="max-w-6xl mx-auto w-full px-4 py-6 flex-1">
        <ApplicationHeader session={session} />
        <ApplicationNavTabs session={session} />

        <div className="portal-card p-6 border-t-4 border-t-[#1B365D]">
          
          <div className="border-b border-slate-200 pb-3 mb-5">
            <h2 className="text-base font-bold text-[#1B365D] flex items-center gap-2">
              <FileCode2 className="w-5 h-5" />
              Tab 8: State Specific Information ({session.state || 'Karnataka'})
            </h2>
            <p className="text-xs text-slate-600">
              Provide state regulatory registrations such as Professional Tax Certificate numbers and State Excise particulars if applicable.
            </p>
          </div>

          <div className="portal-card p-3 mb-6 bg-slate-50 border-slate-200 text-xs text-slate-700 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <p>
              These fields are configurable per State authority to prove extensible automation support for state-specific requirements.
            </p>
          </div>

          <form onSubmit={handleSaveAndContinue}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Professional Tax EC */}
              <div>
                <label htmlFor="pt-ec" className="portal-label">
                  Professional Tax Employee Certificate (PT EC) Number
                </label>
                <input
                  id="pt-ec"
                  type="text"
                  placeholder="e.g. PT-EC-29-XXXXXX"
                  value={ptEcNumber}
                  onChange={e => setPtEcNumber(e.target.value)}
                  className="portal-input font-mono"
                />
                <span className="text-[11px] text-slate-500 block mt-1">
                  Optional or state-mandated if employing staff.
                </span>
              </div>

              {/* Professional Tax RC */}
              <div>
                <label htmlFor="pt-rc" className="portal-label">
                  Professional Tax Registration Certificate (PT RC) Number
                </label>
                <input
                  id="pt-rc"
                  type="text"
                  placeholder="e.g. PT-RC-29-XXXXXX"
                  value={ptRcNumber}
                  onChange={e => setPtRcNumber(e.target.value)}
                  className="portal-input font-mono"
                />
              </div>

              {/* State Excise License Number */}
              <div>
                <label htmlFor="state-excise" className="portal-label">
                  State Excise License Number (if applicable)
                </label>
                <input
                  id="state-excise"
                  type="text"
                  placeholder="e.g. EX-2024-998811"
                  value={stateExciseNumber}
                  onChange={e => setStateExciseNumber(e.target.value)}
                  className="portal-input font-mono"
                />
              </div>

              {/* Name of Person in Whose Name Excise License is Held */}
              <div>
                <label htmlFor="license-holder" className="portal-label">
                  Name of Person in Whose Name License is Held
                </label>
                <input
                  id="license-holder"
                  type="text"
                  value={licenseHolderName}
                  onChange={e => setLicenseHolderName(e.target.value)}
                  className="portal-input"
                />
              </div>

            </div>

            {/* Navigation Actions */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => router.push('/registration/application/bank')}
                className="portal-btn-secondary"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back (Bank Accounts)</span>
              </button>

              <button
                type="submit"
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
