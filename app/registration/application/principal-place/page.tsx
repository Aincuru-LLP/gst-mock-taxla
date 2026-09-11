'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { ApplicationHeader } from '@/components/application/ApplicationHeader';
import { ApplicationNavTabs } from '@/components/application/ApplicationNavTabs';
import { getSession, saveSession } from '@/lib/state/session-store';
import { INDIAN_STATES, getDistrictsForState } from '@/lib/data/locations';
import { PlaceDetails } from '@/types/gst';
import { MapPin, Save, ArrowRight, ArrowLeft, Building, Upload } from 'lucide-react';

export default function PrincipalPlacePage() {
  const router = useRouter();
  const [session, setSession] = useState(getSession());

  // Address fields
  const [door, setDoor] = useState<string>('Plot No. 42');
  const [building, setBuilding] = useState<string>('Tech Crest Tower');
  const [floor, setFloor] = useState<string>('3rd Floor');
  const [street, setStreet] = useState<string>('100 Feet Road');
  const [road, setRoad] = useState<string>('Indiranagar Main');
  const [area, setArea] = useState<string>('HAL 2nd Stage');
  const [locality, setLocality] = useState<string>('Indiranagar');
  const [city, setCity] = useState<string>('Bengaluru');
  const [state, setState] = useState<string>('Karnataka');
  const [district, setDistrict] = useState<string>('Bengaluru Urban');
  const [pin, setPin] = useState<string>('560038');

  // Contact
  const [officeEmail, setOfficeEmail] = useState<string>('office@demo-taxla.test');
  const [officeMobile, setOfficeMobile] = useState<string>('9876543210');

  // Premises & Proof
  const [premisesType, setPremisesType] = useState<PlaceDetails['premisesType']>('Rented/Leased');
  const [possessionNature, setPossessionNature] = useState<string>('Rent Agreement with Electricity Bill');
  const [addressProofType, setAddressProofType] = useState<string>('Rent / Lease Agreement');
  const [addressProofFileName, setAddressProofFileName] = useState<string>('rent-agreement-sample.pdf');

  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const s = getSession();
    setSession(s);
    if (s.principalPlace) {
      setDoor(s.principalPlace.door || 'Plot No. 42');
      setBuilding(s.principalPlace.building || 'Tech Crest Tower');
      setFloor(s.principalPlace.floor || '3rd Floor');
      setStreet(s.principalPlace.street || '100 Feet Road');
      setRoad(s.principalPlace.road || 'Indiranagar Main');
      setArea(s.principalPlace.area || 'HAL 2nd Stage');
      setLocality(s.principalPlace.locality || 'Indiranagar');
      setCity(s.principalPlace.city || 'Bengaluru');
      setState(s.principalPlace.state || s.state || 'Karnataka');
      setDistrict(s.principalPlace.district || s.district || 'Bengaluru Urban');
      setPin(s.principalPlace.pin || '560038');
      setOfficeEmail(s.principalPlace.officeEmail || s.email || 'office@demo-taxla.test');
      setOfficeMobile(s.principalPlace.officeMobile || s.mobile || '9876543210');
      setPremisesType(s.principalPlace.premisesType || 'Rented/Leased');
      setPossessionNature(s.principalPlace.possessionNature || 'Rent Agreement with Electricity Bill');
      setAddressProofType(s.principalPlace.addressProofType || 'Rent / Lease Agreement');
      setAddressProofFileName(s.principalPlace.addressProofFileName || 'rent-agreement-sample.pdf');

      setAvailableDistricts(getDistrictsForState(s.principalPlace.state || s.state || 'Karnataka'));
    } else {
      setAvailableDistricts(getDistrictsForState('Karnataka'));
    }
  }, []);

  const handleStateChange = (selectedState: string) => {
    setState(selectedState);
    const dists = getDistrictsForState(selectedState);
    setAvailableDistricts(dists);
    setDistrict(dists[0] || '');
  };

  const handleSaveAndContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!door.trim() || !building.trim() || !city.trim() || !pin.trim()) {
      setError('Door/Building, City, and PIN Code are mandatory.');
      return;
    }

    const placeData: PlaceDetails = {
      door: door.trim(),
      building: building.trim(),
      floor: floor.trim(),
      street: street.trim(),
      road: road.trim(),
      area: area.trim(),
      locality: locality.trim(),
      city: city.trim(),
      state,
      district,
      pin: pin.trim(),
      officeEmail: officeEmail.trim(),
      officeMobile: officeMobile.trim(),
      premisesType,
      possessionNature,
      addressProofType,
      addressProofFileName,
      activities: ['Retail Business', 'Office / Management', 'Service Provision']
    };

    const updated = {
      ...session,
      principalPlace: placeData,
      state,
      district,
      completedTabs: {
        ...session.completedTabs,
        'principal-place': true
      }
    };

    saveSession(updated);
    router.push('/registration/application/additional-place');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PortalHeader
        currentStepTitle="Principal Place of Business"
        breadcrumbs={[
          { label: 'Registration', href: '/registration' },
          { label: 'Application', href: '/registration/application' },
          { label: 'Principal Place' }
        ]}
      />

      <div className="max-w-6xl mx-auto w-full px-4 py-6 flex-1">
        <ApplicationHeader session={session} />
        <ApplicationNavTabs session={session} />

        <div className="portal-card p-6 border-t-4 border-t-[#1B365D]">
          
          <div className="border-b border-slate-200 pb-3 mb-5">
            <h2 className="text-base font-bold text-[#1B365D] flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Tab 4: Principal Place of Business
            </h2>
            <p className="text-xs text-slate-600">
              Address where the primary books of account and business records are maintained.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSaveAndContinue}>
            
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2 mb-4">
              Address Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              
              {/* Door */}
              <div>
                <label htmlFor="principal-door" className="portal-label portal-label-required">
                  Building / Flat / Door Number
                </label>
                <input
                  id="principal-door"
                  data-testid="gst-principal-door"
                  type="text"
                  value={door}
                  onChange={e => setDoor(e.target.value)}
                  className="portal-input"
                  required
                />
              </div>

              {/* Building Name */}
              <div>
                <label htmlFor="principal-building" className="portal-label portal-label-required">
                  Building Name / Premises
                </label>
                <input
                  id="principal-building"
                  data-testid="gst-principal-building"
                  type="text"
                  value={building}
                  onChange={e => setBuilding(e.target.value)}
                  className="portal-input"
                  required
                />
              </div>

              {/* Floor */}
              <div>
                <label htmlFor="principal-floor" className="portal-label">
                  Floor Number
                </label>
                <input
                  id="principal-floor"
                  type="text"
                  value={floor}
                  onChange={e => setFloor(e.target.value)}
                  className="portal-input"
                />
              </div>

              {/* Street */}
              <div>
                <label htmlFor="principal-street" className="portal-label portal-label-required">
                  Street / Road
                </label>
                <input
                  id="principal-street"
                  data-testid="gst-principal-street"
                  type="text"
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  className="portal-input"
                  required
                />
              </div>

              {/* Area / Locality */}
              <div>
                <label htmlFor="principal-area" className="portal-label">
                  Area / Locality / Sector
                </label>
                <input
                  id="principal-area"
                  type="text"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  className="portal-input"
                />
              </div>

              {/* City */}
              <div>
                <label htmlFor="principal-city" className="portal-label portal-label-required">
                  City / Town / Village
                </label>
                <input
                  id="principal-city"
                  data-testid="gst-principal-city"
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="portal-input"
                  required
                />
              </div>

              {/* State */}
              <div>
                <label htmlFor="principal-state" className="portal-label portal-label-required">
                  State
                </label>
                <select
                  id="principal-state"
                  data-testid="gst-principal-state"
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
              </div>

              {/* District */}
              <div>
                <label htmlFor="principal-district" className="portal-label portal-label-required">
                  District
                </label>
                <select
                  id="principal-district"
                  data-testid="gst-principal-district"
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
              </div>

              {/* PIN */}
              <div>
                <label htmlFor="principal-pin" className="portal-label portal-label-required">
                  PIN Code
                </label>
                <input
                  id="principal-pin"
                  data-testid="gst-principal-pin"
                  type="text"
                  maxLength={6}
                  value={pin}
                  onChange={e => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                  className="portal-input font-mono"
                  required
                />
              </div>

            </div>

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2 mb-4">
              Premises Possession &amp; Supporting Proof
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              
              {/* Premises Type */}
              <div>
                <label htmlFor="premises-type" className="portal-label portal-label-required">
                  Nature of Possession of Premises
                </label>
                <select
                  id="premises-type"
                  data-testid="gst-premises-type"
                  value={premisesType}
                  onChange={e => setPremisesType(e.target.value as PlaceDetails['premisesType'])}
                  className="portal-input"
                  required
                >
                  <option value="Owned">Owned</option>
                  <option value="Rented/Leased">Rented / Leased</option>
                  <option value="Consent/Shared">Consent / Shared</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Proof Type */}
              <div>
                <label htmlFor="address-proof-type" className="portal-label portal-label-required">
                  Document Type for Principal Place
                </label>
                <select
                  id="address-proof-type"
                  value={addressProofType}
                  onChange={e => setAddressProofType(e.target.value)}
                  className="portal-input"
                >
                  {premisesType === 'Owned' ? (
                    <>
                      <option value="Property Tax Receipt">Property Tax Receipt</option>
                      <option value="Municipal Khata Copy">Municipal Khata Copy</option>
                      <option value="Electricity Bill">Electricity Bill</option>
                      <option value="Legal Ownership Document">Legal Ownership Document</option>
                    </>
                  ) : premisesType === 'Rented/Leased' ? (
                    <>
                      <option value="Rent / Lease Agreement">Rent / Lease Agreement</option>
                      <option value="Rent Agreement with Electricity Bill">Rent Agreement with Electricity Bill</option>
                      <option value="Rent Receipt with NOC">Rent Receipt with NOC</option>
                    </>
                  ) : (
                    <>
                      <option value="Consent Letter from Owner">Consent Letter from Owner</option>
                      <option value="Shared Premises Agreement">Shared Premises Agreement</option>
                    </>
                  )}
                </select>
              </div>

              {/* Document Upload */}
              <div>
                <label htmlFor="address-proof" className="portal-label portal-label-required">
                  Upload Address Proof
                </label>
                <input
                  id="address-proof"
                  data-testid="gst-address-proof"
                  type="file"
                  onChange={e => {
                    if (e.target.files?.[0]) setAddressProofFileName(e.target.files[0].name);
                  }}
                  className="portal-input text-xs"
                />
                <span className="text-[11px] text-slate-500 block mt-1">
                  Attached: <strong>{addressProofFileName}</strong>
                </span>
              </div>

            </div>

            {/* Navigation Actions */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => router.push('/registration/application/signatory')}
                className="portal-btn-secondary"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back (Signatory)</span>
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
