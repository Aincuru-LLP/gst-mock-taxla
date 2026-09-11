'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { GstApplicationState } from '@/types/gst';

interface ApplicationNavTabsProps {
  session?: GstApplicationState;
}

export const APPLICATION_TABS = [
  { id: 'business', label: 'Business Details', path: '/registration/application/business' },
  { id: 'promoters', label: 'Promoters / Partners', path: '/registration/application/promoters' },
  { id: 'signatory', label: 'Authorized Signatory', path: '/registration/application/signatory' },
  { id: 'principal-place', label: 'Principal Place of Business', path: '/registration/application/principal-place' },
  { id: 'additional-place', label: 'Additional Places of Business', path: '/registration/application/additional-place' },
  { id: 'goods-services', label: 'Goods & Services', path: '/registration/application/goods-services' },
  { id: 'bank', label: 'Bank Accounts', path: '/registration/application/bank' },
  { id: 'state-specific', label: 'State Specific Information', path: '/registration/application/state-specific' },
  { id: 'aadhaar', label: 'Aadhaar Authentication', path: '/registration/application/aadhaar' },
  { id: 'verification', label: 'Verification', path: '/registration/application/verification' },
];

export function ApplicationNavTabs({ session }: ApplicationNavTabsProps) {
  const pathname = usePathname();

  const completedMap = session?.completedTabs || ({} as Record<string, boolean>);

  return (
    <nav aria-label="Registration Steps" className="portal-card mb-6 overflow-hidden">
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs font-semibold text-slate-700">
        <span>Application Progress Steps (1 to 10)</span>
        <span className="text-[11px] text-slate-500 font-normal">
          Click any tab or use Save &amp; Continue
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="flex border-b border-slate-200 min-w-max">
          {APPLICATION_TABS.map((tab, idx) => {
            const isActive = pathname === tab.path;
            const isCompleted = Boolean(completedMap[tab.id as keyof typeof completedMap]);

            return (
              <Link
                key={tab.id}
                href={tab.path}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs border-r border-slate-200 transition-colors ${
                  isActive
                    ? 'bg-[#1B365D] text-white font-bold border-b-2 border-b-[#D97706]'
                    : 'bg-white text-slate-700 hover:bg-slate-50 font-medium'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive
                      ? 'bg-white text-[#1B365D]'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {idx + 1}
                </span>

                <span>{tab.label}</span>

                {isCompleted ? (
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-emerald-300' : 'text-emerald-600'
                    }`}
                  />
                ) : (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? 'bg-amber-300' : 'bg-slate-300'
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
