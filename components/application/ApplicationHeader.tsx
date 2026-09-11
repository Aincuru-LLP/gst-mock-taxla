import React from 'react';
import { GstApplicationState } from '@/types/gst';
import { Building2, MapPin, Hash, CheckCircle2 } from 'lucide-react';

interface ApplicationHeaderProps {
  session: GstApplicationState;
}

export function ApplicationHeader({ session }: ApplicationHeaderProps) {
  return (
    <div className="portal-card p-4 mb-4 border-l-4 border-l-[#1B365D]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Entity details */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {session.taxpayerType || 'Taxpayer'}
            </span>
            <span className="text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              Status: {session.status}
            </span>
          </div>

          <h1 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#1B365D]" />
            {session.legalName || session.business?.legalName || 'TAXLA DEMO ENTERPRISE'}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1 font-mono">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              PAN: <strong>{session.pan || session.business?.pan || 'ABCDE1234F'}</strong>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {session.district || 'Bengaluru Urban'}, {session.state || 'Karnataka'}
            </span>
          </div>
        </div>

        {/* References */}
        <div className="flex flex-row lg:flex-col items-start lg:items-end justify-between border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-200 gap-2 text-xs">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded text-left lg:text-right">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Temporary Ref Number (TRN)</span>
            <span className="font-mono font-bold text-sm text-[#1B365D]">
              {session.trn || 'TRN202609012345'}
            </span>
          </div>

          <div className="text-[11px] text-slate-500 text-left lg:text-right">
            Application ID: <span className="font-mono text-slate-700 font-semibold">{session.applicationId}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
