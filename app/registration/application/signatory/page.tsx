'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { ApplicationHeader } from '@/components/application/ApplicationHeader';
import { ApplicationNavTabs } from '@/components/application/ApplicationNavTabs';
import { getSession, saveSession } from '@/lib/state/session-store';
import { SignatoryDetails } from '@/types/gst';
import { UserCheck, Save, ArrowRight, ArrowLeft, Upload, FileText, CheckCircle2 } from 'lucide-react';

export default function SignatoryPage() {
  const router = useRouter();
  const [session, setSession] = useState(getSession());

  const [isPrimarySignatory, setIsPrimarySignatory] = useState<boolean>(true);
  const [name, setName] = useState<string>('RAMESH KUMAR SHARMA');
  const [pan, setPan] = useState<string>('ABCDE1234F');
  const [aadhaar, setAadhaar] = useState<string>('234567890123');
  const [designation, setDesignation] = useState<string>('Proprietor');
  const [mobile, setMobile] = useState<string>('9876543210');
  const [email, setEmail] = useState<string>('ramesh.sharma@demo-taxla.test');
  const [proofType, setProofType] = useState<string>('Letter of Authorization');
  const [proofFileName, setProofFileName] = useState<string>('loa-document.pdf');
  const [photoFileName, setPhotoFileName] = useState<string>('signatory-photo.jpg');

  const [error, setError] = useState<string>('');

  useEffect(() => {
    const s = getSession();
    setSession(s);
    if (s.signatory) {
      setName(s.signatory.name || s.legalName || 'RAMESH KUMAR SHARMA');
      setPan(s.signatory.pan || s.pan || 'ABCDE1234F');
      setAadhaar(s.signatory.aadhaar || '234567890123');
      setDesignation(s.signatory.designation || 'Proprietor');
      setMobile(s.signatory.mobile || s.mobile || '9876543210');
      setEmail(s.signatory.email || s.email || 'ramesh.sharma@demo-taxla.test');
      setIsPrimarySignatory(s.signatory.isPrimarySignatory ?? true);
      setProofType(s.signatory.proofType || 'Letter of Authorization');
      setProofFileName(s.signatory.proofFileName || 'loa-document.pdf');
      setPhotoFileName(s.signatory.photoFileName || 'signatory-photo.jpg');
    }
  }, []);

  const handleCopyFromPromoter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsPrimarySignatory(checked);
    if (checked && session.promoters && session.promoters.length > 0) {
      const p = session.promoters[0];
      setName(`${p.firstName} ${p.middleName ? p.middleName + ' ' : ''}${p.lastName}`.trim());
      setPan(p.pan);
      setAadhaar(p.aadhaar);
      setDesignation(p.designation);
      setMobile(p.mobile);
      setEmail(p.email);
    }
  };

  const handleSaveAndContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !pan.trim() || !mobile.trim() || !email.trim()) {
      setError('Name, PAN, Mobile, and Email are required for Authorized Signatory.');
      return;
    }

    const signatoryData: SignatoryDetails = {
      isPrimarySignatory,
      name: name.trim().toUpperCase(),
      pan: pan.trim().toUpperCase(),
      aadhaar: aadhaar.trim(),
      designation: designation.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      photoFileName,
      proofType,
      proofFileName
    };

    const updated = {
      ...session,
      signatory: signatoryData,
      verification: {
        ...session.verification,
        signatoryName: signatoryData.name
      },
      completedTabs: {
        ...session.completedTabs,
        signatory: true
      }
    };

    saveSession(updated);
    router.push('/registration/application/principal-place');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PortalHeader
        currentStepTitle="Authorized Signatory"
        breadcrumbs={[
          { label: 'Registration', href: '/registration' },
          { label: 'Application', href: '/registration/application' },
          { label: 'Authorized Signatory' }
        ]}
      />

      <div className="max-w-6xl mx-auto w-full px-4 py-6 flex-1">
        <ApplicationHeader session={session} />
        <ApplicationNavTabs session={session} />

        <div className="portal-card p-6 border-t-4 border-t-[#1B365D]">
          
          <div className="border-b border-slate-200 pb-3 mb-5">
            <h2 className="text-base font-bold text-[#1B365D] flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Tab 3: Authorized Signatory
            </h2>
            <p className="text-xs text-slate-600">
              Details of the person authorized to sign, verify, and submit GST applications on behalf of the business entity.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSaveAndContinue}>
            
            {/* Primary Signatory Checkbox */}
            <div className="mb-5 p-3.5 bg-slate-50 border border-slate-200 rounded flex items-center gap-3">
              <input
                id="is-primary"
                type="checkbox"
                checked={isPrimarySignatory}
                onChange={handleCopyFromPromoter}
                className="w-4 h-4 text-[#1B365D] rounded border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor="is-primary" className="text-xs font-semibold text-slate-800 cursor-pointer">
                Primary Authorized Signatory (Same as Primary Promoter / Proprietor)
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Name */}
              <div>
                <label htmlFor="signatory-name" className="portal-label portal-label-required">
                  Name of Signatory
                </label>
                <input
                  id="signatory-name"
                  data-testid="gst-signatory-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="portal-input"
                  required
                />
              </div>

              {/* Designation */}
              <div>
                <label htmlFor="signatory-designation" className="portal-label portal-label-required">
                  Designation
                </label>
                <input
                  id="signatory-designation"
                  type="text"
                  value={designation}
                  onChange={e => setDesignation(e.target.value)}
                  className="portal-input"
                  required
                />
              </div>

              {/* PAN */}
              <div>
                <label htmlFor="signatory-pan" className="portal-label portal-label-required">
                  PAN of Signatory
                </label>
                <input
                  id="signatory-pan"
                  data-testid="gst-signatory-pan"
                  type="text"
                  maxLength={10}
                  value={pan}
                  onChange={e => setPan(e.target.value.toUpperCase())}
                  className="portal-input font-mono uppercase"
                  required
                />
              </div>

              {/* Aadhaar */}
              <div>
                <label htmlFor="signatory-aadhaar" className="portal-label portal-label-required">
                  Aadhaar Number
                </label>
                <input
                  id="signatory-aadhaar"
                  data-testid="gst-signatory-aadhaar"
                  type="text"
                  maxLength={12}
                  value={aadhaar}
                  onChange={e => setAadhaar(e.target.value.replace(/[^0-9]/g, ''))}
                  className="portal-input font-mono"
                  required
                />
              </div>

              {/* Mobile */}
              <div>
                <label htmlFor="signatory-mobile" className="portal-label portal-label-required">
                  Mobile Number
                </label>
                <input
                  id="signatory-mobile"
                  data-testid="gst-signatory-mobile"
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                  className="portal-input"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="signatory-email" className="portal-label portal-label-required">
                  Email Address
                </label>
                <input
                  id="signatory-email"
                  data-testid="gst-signatory-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="portal-input"
                  required
                />
              </div>

              {/* Proof Type */}
              <div>
                <label htmlFor="signatory-proof-type" className="portal-label portal-label-required">
                  Proof of Details of Authorized Signatory
                </label>
                <select
                  id="signatory-proof-type"
                  value={proofType}
                  onChange={e => setProofType(e.target.value)}
                  className="portal-input"
                >
                  <option value="Letter of Authorization">Letter of Authorization</option>
                  <option value="Copy of Resolution of Managing Committee">Copy of Resolution of Managing Committee</option>
                  <option value="Power of Attorney">Power of Attorney</option>
                  <option value="Proprietorship Declaration">Proprietorship Declaration</option>
                </select>
              </div>

              {/* Proof File Upload */}
              <div>
                <label htmlFor="signatory-proof-file" className="portal-label portal-label-required">
                  Upload Authorization Proof
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="signatory-proof-file"
                    data-testid="gst-signatory-proof"
                    type="file"
                    onChange={e => {
                      if (e.target.files?.[0]) setProofFileName(e.target.files[0].name);
                    }}
                    className="portal-input text-xs"
                  />
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Attached: <strong>{proofFileName}</strong>
                </span>
              </div>

              {/* Photo Upload */}
              <div>
                <label htmlFor="signatory-photo-file" className="portal-label portal-label-required">
                  Photograph of Signatory
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="signatory-photo-file"
                    data-testid="gst-signatory-photo"
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files?.[0]) setPhotoFileName(e.target.files[0].name);
                    }}
                    className="portal-input text-xs"
                  />
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Attached: <strong>{photoFileName}</strong>
                </span>
              </div>

            </div>

            {/* Navigation Actions */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => router.push('/registration/application/promoters')}
                className="portal-btn-secondary"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back (Promoters)</span>
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
