'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { ApplicationHeader } from '@/components/application/ApplicationHeader';
import { ApplicationNavTabs } from '@/components/application/ApplicationNavTabs';
import { getSession, saveSession } from '@/lib/state/session-store';
import { INDIAN_STATES, getDistrictsForState } from '@/lib/data/locations';
import { AdditionalPlaceDetails } from '@/types/gst';
import { MapPin, Plus, Trash2, Save, ArrowRight, ArrowLeft, Building2 } from 'lucide-react';

export default function AdditionalPlacePage() {
  const router = useRouter();
  const [session, setSession] = useState(getSession());

  const [hasAdditionalPlaces, setHasAdditionalPlaces] = useState<boolean>(false);
  const [places, setPlaces] = useState<AdditionalPlaceDetails[]>([]);

  // Form for adding a new additional place
  const [door, setDoor] = useState<string>('');
  const [building, setBuilding] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('Mysuru');
  const [state, setState] = useState<string>('Karnataka');
  const [district, setDistrict] = useState<string>('Mysuru');
  const [pin, setPin] = useState<string>('570001');
  const [premisesType, setPremisesType] = useState<string>('Rented/Leased');
  const [natureOfActivity, setNatureOfActivity] = useState<string>('Warehouse / Depot');

  useEffect(() => {
    const s = getSession();
    setSession(s);
    if (s.additionalPlaces && s.additionalPlaces.length > 0) {
      setPlaces(s.additionalPlaces);
      setHasAdditionalPlaces(true);
    }
  }, []);

  const handleAddPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!building.trim() || !city.trim() || !pin.trim()) {
      return;
    }

    const newPlace: AdditionalPlaceDetails = {
      id: `add-place-${Date.now()}`,
      door: door.trim() || 'Unit 10',
      building: building.trim(),
      street: street.trim() || 'Industrial Estate',
      city: city.trim(),
      state,
      district,
      pin: pin.trim(),
      premisesType,
      addressProofType: 'Rent Agreement',
      natureOfActivity
    };

    const updated = [...places, newPlace];
    setPlaces(updated);
    setBuilding('');
    setDoor('');
    setStreet('');
  };

  const handleRemovePlace = (id: string) => {
    setPlaces(places.filter(p => p.id !== id));
  };

  const handleSaveAndContinue = () => {
    const updated = {
      ...session,
      additionalPlaces: places,
      completedTabs: {
        ...session.completedTabs,
        'additional-place': true
      }
    };
    saveSession(updated);
    router.push('/registration/application/goods-services');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PortalHeader
        currentStepTitle="Additional Places of Business"
        breadcrumbs={[
          { label: 'Registration', href: '/registration' },
          { label: 'Application', href: '/registration/application' },
          { label: 'Additional Places' }
        ]}
      />

      <div className="max-w-6xl mx-auto w-full px-4 py-6 flex-1">
        <ApplicationHeader session={session} />
        <ApplicationNavTabs session={session} />

        <div className="portal-card p-6 border-t-4 border-t-[#1B365D]">
          
          <div className="border-b border-slate-200 pb-3 mb-5">
            <h2 className="text-base font-bold text-[#1B365D] flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Tab 5: Details of Additional Places of Business
            </h2>
            <p className="text-xs text-slate-600">
              Declare additional branches, warehouses, depots, or retail outlets operating under the same PAN within this State.
            </p>
          </div>

          {/* Toggle additional places */}
          <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded flex items-center gap-3">
            <input
              id="has-additional"
              type="checkbox"
              checked={hasAdditionalPlaces}
              onChange={e => {
                setHasAdditionalPlaces(e.target.checked);
                if (!e.target.checked) setPlaces([]);
              }}
              className="w-4 h-4 text-[#1B365D] rounded border-slate-300 focus:ring-blue-500"
            />
            <label htmlFor="has-additional" className="text-xs font-semibold text-slate-800 cursor-pointer">
              Do you have any Additional Place of Business within this State?
            </label>
          </div>

          {hasAdditionalPlaces && (
            <div className="space-y-6">
              
              {/* Add New Additional Place Form */}
              <div className="bg-white border-2 border-dashed border-slate-300 rounded p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-blue-700" />
                  Add New Additional Place of Business
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="additional-door" className="portal-label">Building / Flat Number</label>
                    <input
                      id="additional-door"
                      type="text"
                      placeholder="e.g. Unit 4B"
                      value={door}
                      onChange={e => setDoor(e.target.value)}
                      className="portal-input"
                    />
                  </div>

                  <div>
                    <label htmlFor="additional-building" className="portal-label portal-label-required">Building Name</label>
                    <input
                      id="additional-building"
                      type="text"
                      placeholder="e.g. Logistics Park"
                      value={building}
                      onChange={e => setBuilding(e.target.value)}
                      className="portal-input"
                    />
                  </div>

                  <div>
                    <label htmlFor="additional-street" className="portal-label">Street</label>
                    <input
                      id="additional-street"
                      type="text"
                      placeholder="e.g. Ring Road"
                      value={street}
                      onChange={e => setStreet(e.target.value)}
                      className="portal-input"
                    />
                  </div>

                  <div>
                    <label htmlFor="additional-city" className="portal-label portal-label-required">City</label>
                    <input
                      id="additional-city"
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="portal-input"
                    />
                  </div>

                  <div>
                    <label htmlFor="additional-pin" className="portal-label portal-label-required">PIN Code</label>
                    <input
                      id="additional-pin"
                      type="text"
                      maxLength={6}
                      value={pin}
                      onChange={e => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                      className="portal-input font-mono"
                    />
                  </div>

                  <div>
                    <label htmlFor="additional-nature" className="portal-label portal-label-required">Nature of Activity</label>
                    <select
                      id="additional-nature"
                      value={natureOfActivity}
                      onChange={e => setNatureOfActivity(e.target.value)}
                      className="portal-input"
                    >
                      <option value="Warehouse / Depot">Warehouse / Depot</option>
                      <option value="Retail Outlet">Retail Outlet</option>
                      <option value="Branch Office">Branch Office</option>
                      <option value="Manufacturing Facility">Manufacturing Facility</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
                  <button
                    type="button"
                    data-testid="gst-additional-place"
                    onClick={handleAddPlace}
                    className="portal-btn-secondary text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-700" />
                    <span>ADD PLACE</span>
                  </button>
                </div>
              </div>

              {/* Places List Table */}
              {places.length > 0 && (
                <div className="border border-slate-200 rounded overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Additional Places Added ({places.length})
                  </div>
                  <div className="divide-y divide-slate-200">
                    {places.map((place, idx) => (
                      <div key={place.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50">
                        <div>
                          <div className="font-bold text-xs text-slate-900">
                            {idx + 1}. {place.building}, {place.city} - {place.pin}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Activity: <strong>{place.natureOfActivity}</strong> | State: {place.state}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemovePlace(place.id)}
                          className="portal-btn-danger"
                          title="Remove Place"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>REMOVE PLACE</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Navigation Actions */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push('/registration/application/principal-place')}
              className="portal-btn-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back (Principal Place)</span>
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

        </div>

      </div>
    </div>
  );
}
