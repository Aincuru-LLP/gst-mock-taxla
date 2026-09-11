'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { ApplicationHeader } from '@/components/application/ApplicationHeader';
import { ApplicationNavTabs } from '@/components/application/ApplicationNavTabs';
import { getSession, saveSession } from '@/lib/state/session-store';
import { searchHsnSac, HsnSacItem } from '@/lib/data/hsn-catalog';
import { GoodsServiceItem } from '@/types/gst';
import { Search, Plus, Trash2, Save, ArrowRight, ArrowLeft, Layers, Check } from 'lucide-react';

export default function GoodsServicesPage() {
  const router = useRouter();
  const [session, setSession] = useState(getSession());

  const [activeType, setActiveType] = useState<'SERVICES' | 'GOODS'>('SERVICES');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<HsnSacItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HsnSacItem | null>(null);
  const [classification, setClassification] = useState<'Main' | 'Additional'>('Main');

  const [selectedItems, setSelectedItems] = useState<GoodsServiceItem[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const s = getSession();
    setSession(s);
    const combined = [...(s.services || []), ...(s.goods || [])];
    if (combined.length > 0) {
      setSelectedItems(combined);
    } else {
      // Default sample item
      setSelectedItems([
        {
          id: 'item-1',
          type: 'SERVICES',
          code: '998314',
          description: 'Information technology (IT) design and development services',
          classification: 'Main'
        }
      ]);
    }
  }, []);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    const res = searchHsnSac(q, activeType);
    setSearchResults(res);
  };

  const handleSelectResult = (item: HsnSacItem) => {
    setSelectedItem(item);
    setSearchQuery(item.code + ' - ' + item.description.slice(0, 40));
    setSearchResults([]);
  };

  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedItem) {
      // Fallback: if user typed a custom code directly in search box
      if (searchQuery.trim()) {
        const fallbackItem: GoodsServiceItem = {
          id: `item-${Date.now()}`,
          type: activeType,
          code: searchQuery.trim().slice(0, 6),
          description: searchQuery.trim(),
          classification
        };
        setSelectedItems([...selectedItems, fallbackItem]);
        setSearchQuery('');
        setSelectedItem(null);
        setError('');
        return;
      }
      setError('Please search and select an HSN/SAC code to add.');
      return;
    }

    const newItem: GoodsServiceItem = {
      id: `item-${Date.now()}`,
      type: selectedItem.type,
      code: selectedItem.code,
      description: selectedItem.description,
      classification
    };

    setSelectedItems([...selectedItems, newItem]);
    setSelectedItem(null);
    setSearchQuery('');
    setError('');
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems(selectedItems.filter(i => i.id !== id));
  };

  const handleSaveAndContinue = () => {
    if (selectedItems.length === 0) {
      setError('Please add at least one Goods or Services classification code.');
      return;
    }

    const goodsList = selectedItems.filter(i => i.type === 'GOODS');
    const servicesList = selectedItems.filter(i => i.type === 'SERVICES');

    const updated = {
      ...session,
      goods: goodsList,
      services: servicesList,
      completedTabs: {
        ...session.completedTabs,
        'goods-services': true
      }
    };

    saveSession(updated);
    router.push('/registration/application/bank');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PortalHeader
        currentStepTitle="Goods &amp; Services"
        breadcrumbs={[
          { label: 'Registration', href: '/registration' },
          { label: 'Application', href: '/registration/application' },
          { label: 'Goods & Services' }
        ]}
      />

      <div className="max-w-6xl mx-auto w-full px-4 py-6 flex-1">
        <ApplicationHeader session={session} />
        <ApplicationNavTabs session={session} />

        <div className="portal-card p-6 border-t-4 border-t-[#1B365D]">
          
          <div className="border-b border-slate-200 pb-3 mb-5">
            <h2 className="text-base font-bold text-[#1B365D] flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Tab 6: Goods and Services Supplied by Business
            </h2>
            <p className="text-xs text-slate-600">
              Specify the top 5 Goods (HSN) or Services (SAC) supplied by your business.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded">
              {error}
            </div>
          )}

          {/* Type Toggle: Goods vs Services */}
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
              <input
                type="radio"
                name="itemType"
                checked={activeType === 'SERVICES'}
                onChange={() => {
                  setActiveType('SERVICES');
                  setSearchQuery('');
                  setSearchResults([]);
                  setSelectedItem(null);
                }}
                className="w-4 h-4 text-[#1B365D]"
              />
              <span>Services (SAC Codes)</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
              <input
                type="radio"
                name="itemType"
                checked={activeType === 'GOODS'}
                onChange={() => {
                  setActiveType('GOODS');
                  setSearchQuery('');
                  setSearchResults([]);
                  setSelectedItem(null);
                }}
                className="w-4 h-4 text-[#1B365D]"
              />
              <span>Goods (HSN Codes)</span>
            </label>
          </div>

          {/* Search Box */}
          <div className="bg-slate-50 border border-slate-200 rounded p-4 mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Search &amp; Add {activeType === 'SERVICES' ? 'Service (SAC)' : 'Good (HSN)'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              
              <div className="md:col-span-2 relative">
                <label htmlFor="hsn-search" className="portal-label portal-label-required">
                  Search by Code or Description (e.g. 998314 or IT consulting)
                </label>
                <div className="relative">
                  <input
                    id="hsn-search"
                    data-testid="gst-hsn-search"
                    type="text"
                    placeholder="Search HSN / SAC..."
                    value={searchQuery}
                    onChange={e => handleSearch(e.target.value)}
                    className="portal-input pl-8"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                {/* Dropdown search results */}
                {searchResults.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-300 rounded shadow-lg max-h-56 overflow-y-auto">
                    {searchResults.map(item => (
                      <div
                        key={item.code}
                        data-testid="gst-hsn-result"
                        onClick={() => handleSelectResult(item)}
                        className="p-2.5 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-b-0 text-xs"
                      >
                        <span className="font-mono font-bold text-blue-900 mr-2">{item.code}</span>
                        <span className="text-slate-700">{item.description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="hsn-classification" className="portal-label">Classification</label>
                <select
                  id="hsn-classification"
                  value={classification}
                  onChange={e => setClassification(e.target.value as 'Main' | 'Additional')}
                  className="portal-input"
                >
                  <option value="Main">Main Activity</option>
                  <option value="Additional">Additional Activity</option>
                </select>
              </div>

              <div>
                <button
                  type="button"
                  data-testid="gst-add-hsn"
                  onClick={handleAddItem}
                  className="portal-btn-primary w-full text-xs py-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </div>

            </div>

            <p className="text-[11px] text-slate-500 mt-2">
              Suggestions available: <strong>998314</strong> (IT Development), <strong>998313</strong> (IT Consulting), <strong>847130</strong> (Laptops), <strong>851713</strong> (Smartphones).
            </p>
          </div>

          {/* Selected Goods & Services Table */}
          <div className="border border-slate-200 rounded overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Selected Commodities &amp; Services ({selectedItems.length})</span>
              <span className="text-[11px] font-normal text-slate-500">Up to 5 top commodities recommended</span>
            </div>

            {selectedItems.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No Goods or Services added yet. Please use the search box above to add codes.
              </div>
            ) : (
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Code</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Classification</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedItems.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-600">{idx + 1}</td>
                      <td className="p-3">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                          {item.type}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-[#1B365D]">{item.code}</td>
                      <td className="p-3 text-slate-800">{item.description}</td>
                      <td className="p-3">
                        <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-medium">
                          {item.classification}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Navigation Actions */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push('/registration/application/additional-place')}
              className="portal-btn-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back (Additional Places)</span>
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
