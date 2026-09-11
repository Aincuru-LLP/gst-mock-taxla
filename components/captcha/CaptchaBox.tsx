'use client';

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { DISPLAY_CAPTCHA_TEXT, DEMO_CAPTCHA } from '@/lib/validation/rules';

interface CaptchaBoxProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
  testId?: string;
}

export function CaptchaBox({ value, onChange, error, testId = 'gst-captcha' }: CaptchaBoxProps) {
  const [displayText, setDisplayText] = useState<string>(DISPLAY_CAPTCHA_TEXT);

  const handleRefresh = () => {
    // Keep deterministic but allow visual refresh
    setDisplayText(prev => (prev === DISPLAY_CAPTCHA_TEXT ? '8M3X9' : DISPLAY_CAPTCHA_TEXT));
  };

  return (
    <div
      data-testid="checkpoint-captcha"
      data-checkpoint-type="captcha"
      data-checkpoint-status="required"
      className="p-3 bg-slate-50 border border-slate-200 rounded my-3"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <label htmlFor={testId} className="portal-label portal-label-required mb-0">
          Enter Characters Shown Below
        </label>
        <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
          Demo CAPTCHA: {DEMO_CAPTCHA}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Visual CAPTCHA display box */}
        <div className="relative select-none flex items-center justify-center bg-slate-200 border-2 border-slate-400 rounded px-4 py-2 font-mono font-black text-xl tracking-widest text-slate-800 shadow-inner overflow-hidden">
          <span className="line-through decoration-slate-500 decoration-2 italic">
            {displayText}
          </span>
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-slate-300/30 to-transparent pointer-events-none" />
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          title="Refresh CAPTCHA"
          className="p-2 text-slate-600 hover:text-slate-900 border border-slate-300 rounded hover:bg-slate-100 transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* User / Playwright Input */}
        <div className="grow max-w-xs">
          <input
            id={testId}
            data-testid={testId}
            type="text"
            placeholder="Enter CAPTCHA (or 1234)"
            value={value}
            onChange={e => onChange(e.target.value)}
            className={`portal-input uppercase font-mono tracking-wider ${
              error ? 'border-red-500 focus:border-red-500' : ''
            }`}
            maxLength={10}
            autoComplete="off"
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-600 font-medium mt-1.5">{error}</p>}
      <p className="text-[11px] text-slate-500 mt-1">
        Human checkpoint: Automated Playwright tests can fill &quot;1234&quot; or the displayed characters.
      </p>
    </div>
  );
}
