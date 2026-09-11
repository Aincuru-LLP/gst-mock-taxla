'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { ApplicationHeader } from '@/components/application/ApplicationHeader';
import { ApplicationNavTabs } from '@/components/application/ApplicationNavTabs';
import { getSession, saveSession } from '@/lib/state/session-store';
import { PromoterDetails } from '@/types/gst';
import { UserPlus, Trash2, Edit3, Save, ArrowRight, ArrowLeft, Users, Check } from 'lucide-react';

export default function PromotersPage() {
  const router = useRouter();
  const [session, setSession] = useState(getSession());

  const [promoters, setPromoters] = useState<PromoterDetails[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields for active promoter
  const [firstName, setFirstName] = useState<string>('RAMESH');
  const [middleName, setMiddleName] = useState<string>('KUMAR');
  const [lastName, setLastName] = useState<string>('SHARMA');
  const [dob, setDob] = useState<string>('1985-05-12');
  const [gender, setGender] = useState<string>('Male');
  const [pan, setPan] = useState<string>('ABCDE1234F');
  const [aadhaar, setAadhaar] = useState<string>('234567890123');
  const [mobile, setMobile] = useState<string>('9876543210');
  const [email, setEmail] = useState<string>('ramesh.sharma@demo-taxla.test');
  const [designation, setDesignation] = useState<string>('Proprietor');
  const [residentialAddress, setResidentialAddress] = useState<string>(
    'Flat 402, Green Valley Apartments, Indiranagar, Bengaluru, Karnataka - 560038'
  );

  const [error, setError] = useState<string>('');

  useEffect(() => {
    const s = getSession();
    setSession(s);
    if (s.promoters && s.promoters.length > 0) {
      setPromoters(s.promoters);
      const first = s.promoters[0];
      setFirstName(first.firstName);
      setMiddleName(first.middleName || '');
      setLastName(first.lastName);
      setDob(first.dob);
      setGender(first.gender || 'Male');
      setPan(first.pan);
      setAadhaar(first.aadhaar);
      setMobile(first.mobile);
      setEmail(first.email);
      setDesignation(first.designation);
      setResidentialAddress(first.residentialAddress);
      setEditingId(first.id);
    }
  }, []);

  const handleAddOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !pan.trim()) {
      setError('First Name, Last Name, and PAN are mandatory for every promoter.');
      return;
    }

    const currentItem: PromoterDetails = {
      id: editingId || `prom-${Date.now()}`,
      firstName: firstName.trim().toUpperCase(),
      middleName: middleName.trim().toUpperCase(),
      lastName: lastName.trim().toUpperCase(),
      dob,
      gender,
      pan: pan.trim().toUpperCase(),
      aadhaar: aadhaar.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      designation,
      residentialAddress: residentialAddress.trim(),
      photoFileName: 'photo-sample.jpg'
    };

    let updatedList: PromoterDetails[];
    if (editingId) {
      updatedList = promoters.map(p => (p.id === editingId ? currentItem : p));
    } else {
      updatedList = [...promoters, currentItem];
    }

    setPromoters(updatedList);
    setEditingId(currentItem.id);
    setError('');

    // Save session
    const updatedSession = {
      ...session,
      promoters: updatedList,
      completedTabs: {
        ...session.completedTabs,
        promoters: true
      }
    };
    saveSession(updatedSession);
  };

  const handleAddNewBlank = () => {
    setEditingId(null);
    setFirstName('');
    setMiddleName('');
    setLastName('');
    setDob('1990-01-01');
    setGender('Male');
    setPan('');
    setAadhaar('');
    setMobile('');
    setEmail('');
    setDesignation('Partner / Director');
    setResidentialAddress('');
  };

  const handleEdit = (p: PromoterDetails) => {
    setEditingId(p.id);
    setFirstName(p.firstName);
    setMiddleName(p.middleName || '');
    setLastName(p.lastName);
    setDob(p.dob);
    setGender(p.gender);
    setPan(p.pan);
    setAadhaar(p.aadhaar);
    setMobile(p.mobile);
    setEmail(p.email);
    setDesignation(p.designation);
    setResidentialAddress(p.residentialAddress);
  };

  const handleRemove = (id: string) => {
    const remaining = promoters.filter(p => p.id !== id);
    setPromoters(remaining);
    if (editingId === id) {
      if (remaining.length > 0) {
        handleEdit(remaining[0]);
      } else {
        handleAddNewBlank();
      }
    }
    const updatedSession = {
      ...session,
      promoters: remaining,
      completedTabs: {
        ...session.completedTabs,
        promoters: remaining.length > 0
      }
    };
    saveSession(updatedSession);
  };

  const handleSaveAndContinue = () => {
    if (promoters.length === 0) {
      setError('Please add at least one Promoter / Partner / Proprietor record.');
      return;
    }

    const updatedSession = {
      ...session,
      promoters,
      completedTabs: {
        ...session.completedTabs,
        promoters: true
      }
    };
    saveSession(updatedSession);
    router.push('/registration/application/signatory');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PortalHeader
        currentStepTitle="Promoters / Partners"
        breadcrumbs={[
          { label: 'Registration', href: '/registration' },
          { label: 'Application', href: '/registration/application' },
          { label: 'Promoters' }
        ]}
      />

      <div className="max-w-6xl mx-auto w-full px-4 py-6 flex-1">
        <ApplicationHeader session={session} />
        <ApplicationNavTabs session={session} />

        <div className="portal-card p-6 border-t-4 border-t-[#1B365D]">
          
          <div className="border-b border-slate-200 pb-3 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#1B365D] flex items-center gap-2">
                <Users className="w-5 h-5" />
                Tab 2: Details of Promoters / Partners / Proprietor
              </h2>
              <p className="text-xs text-slate-600">
                Enter details for each partner, director, or proprietor having executive interest in the business.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddNewBlank}
              className="portal-btn-secondary text-xs"
            >
              <UserPlus className="w-3.5 h-3.5 text-blue-700" />
              <span>Add Another Promoter</span>
            </button>
          </div>

          {/* Promoters List Cards if any */}
          {promoters.length > 0 && (
            <div className="mb-6 bg-slate-50 border border-slate-200 rounded p-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                Registered Promoters / Partners ({promoters.length})
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {promoters.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`p-3 bg-white border rounded flex items-center justify-between gap-2 ${
                      editingId === p.id ? 'border-[#1B365D] ring-1 ring-[#1B365D]' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900">
                        {idx + 1}. {p.firstName} {p.middleName ? p.middleName + ' ' : ''}{p.lastName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        PAN: {p.pan} | Desig: {p.designation}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEdit(p)}
                        className="p-1 text-blue-700 hover:bg-blue-50 rounded"
                        title="Edit Promoter"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(p.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Remove Promoter"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded">
              {error}
            </div>
          )}

          {/* Active Promoter Edit Form */}
          <form onSubmit={handleAddOrUpdate}>
            <div className="bg-white border border-slate-200 rounded p-4 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                {editingId ? 'Edit Promoter / Partner Details' : 'New Promoter / Partner Information'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* First Name */}
                <div>
                  <label htmlFor="promoter-first-name" className="portal-label portal-label-required">
                    First Name
                  </label>
                  <input
                    id="promoter-first-name"
                    data-testid="gst-promoter-first-name"
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="portal-input"
                    required
                  />
                </div>

                {/* Middle Name */}
                <div>
                  <label htmlFor="promoter-middle-name" className="portal-label">
                    Middle Name
                  </label>
                  <input
                    id="promoter-middle-name"
                    data-testid="gst-promoter-middle-name"
                    type="text"
                    value={middleName}
                    onChange={e => setMiddleName(e.target.value)}
                    className="portal-input"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="promoter-last-name" className="portal-label portal-label-required">
                    Last Name
                  </label>
                  <input
                    id="promoter-last-name"
                    data-testid="gst-promoter-last-name"
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="portal-input"
                    required
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="promoter-dob" className="portal-label portal-label-required">
                    Date of Birth
                  </label>
                  <input
                    id="promoter-dob"
                    data-testid="gst-promoter-dob"
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    className="portal-input"
                    required
                  />
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="promoter-gender" className="portal-label portal-label-required">
                    Gender
                  </label>
                  <select
                    id="promoter-gender"
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="portal-input"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Designation */}
                <div>
                  <label htmlFor="promoter-designation" className="portal-label portal-label-required">
                    Designation / Status
                  </label>
                  <input
                    id="promoter-designation"
                    type="text"
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                    className="portal-input"
                    required
                  />
                </div>

                {/* PAN */}
                <div>
                  <label htmlFor="promoter-pan" className="portal-label portal-label-required">
                    PAN of Promoter
                  </label>
                  <input
                    id="promoter-pan"
                    data-testid="gst-promoter-pan"
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
                  <label htmlFor="promoter-aadhaar" className="portal-label portal-label-required">
                    Aadhaar Number
                  </label>
                  <input
                    id="promoter-aadhaar"
                    data-testid="gst-promoter-aadhaar"
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
                  <label htmlFor="promoter-mobile" className="portal-label portal-label-required">
                    Mobile Number
                  </label>
                  <input
                    id="promoter-mobile"
                    data-testid="gst-promoter-mobile"
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
                  <label htmlFor="promoter-email" className="portal-label portal-label-required">
                    Email Address
                  </label>
                  <input
                    id="promoter-email"
                    data-testid="gst-promoter-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="portal-input"
                    required
                  />
                </div>

                {/* Residential Address */}
                <div className="md:col-span-2">
                  <label htmlFor="promoter-residential-address" className="portal-label portal-label-required">
                    Residential Address
                  </label>
                  <input
                    id="promoter-residential-address"
                    type="text"
                    value={residentialAddress}
                    onChange={e => setResidentialAddress(e.target.value)}
                    className="portal-input"
                    required
                  />
                </div>

              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  data-testid="gst-add-promoter"
                  className="portal-btn-secondary text-xs"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{editingId ? 'Update Promoter Record' : 'Save Promoter to List'}</span>
                </button>
              </div>

            </div>

            {/* Step Navigation Actions */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => router.push('/registration/application/business')}
                className="portal-btn-secondary"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back (Business Details)</span>
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

          </form>

        </div>

      </div>
    </div>
  );
}
