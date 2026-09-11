'use client';

import React, { useEffect, useState } from 'react';
import { getActiveSessionId, getSession, resetSession, populateDemoData } from '@/lib/state/session-store';
import { RefreshCw, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

export function DemoBar() {
  const [sessionId, setSessionId] = useState<string>('');
  const [scenario, setScenario] = useState<string>('success');
  const [status, setStatus] = useState<string>('DRAFT');

  useEffect(() => {
    // Check if reset requested in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('resetDemo') === 'true') {
      const fresh = resetSession();
      setSessionId(fresh.applicationId);
      setStatus(fresh.status);
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    const currentId = getActiveSessionId();
    setSessionId(currentId);
    const session = getSession(currentId);
    setStatus(session.status);

    const sc = params.get('scenario');
    if (sc) setScenario(sc);
  }, []);

  const handleReset = () => {
    const fresh = resetSession();
    setSessionId(fresh.applicationId);
    setStatus(fresh.status);
    window.location.href = '/registration/new';
  };

  const handleFillDemo = () => {
    populateDemoData(sessionId);
    window.location.reload();
  };

  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSc = e.target.value;
    setScenario(newSc);
    const url = new URL(window.location.href);
    url.searchParams.set('scenario', newSc);
    window.location.href = url.toString();
  };

  return (
    <aside aria-label="Demo Automation Controls" className="bg-amber-100 border-b border-amber-300 text-amber-950 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-3">
        <span className="font-bold uppercase tracking-wider flex items-center gap-1 text-amber-900">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
          TAXLA Automation Controls
        </span>
        <span className="bg-white/80 border border-amber-300 px-2 py-0.5 rounded font-mono text-slate-800">
          Session ID: <strong className="text-blue-900">{sessionId || 'Loading...'}</strong>
        </span>
        <span className="hidden sm:inline bg-white/80 border border-amber-300 px-2 py-0.5 rounded text-slate-700">
          Status: <strong>{status}</strong>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1 font-medium">
          <span>Scenario:</span>
          <select
            value={scenario}
            onChange={handleScenarioChange}
            className="bg-white border border-amber-300 rounded px-1.5 py-0.5 font-medium text-slate-800 outline-none text-xs"
          >
            <option value="success">success (default)</option>
            <option value="otp-failure">otp-failure</option>
            <option value="captcha-failure">captcha-failure</option>
            <option value="validation-error">validation-error</option>
            <option value="processing-delay">processing-delay</option>
          </select>
        </label>

        <button
          type="button"
          onClick={handleFillDemo}
          title="Fill mock data for quick testing"
          className="bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-1 font-medium transition cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-amber-600" />
          <span className="hidden md:inline">Fill Demo Data</span>
        </button>

        <button
          type="button"
          onClick={handleReset}
          title="Reset demo session completely"
          className="bg-red-700 hover:bg-red-800 text-white px-2 py-0.5 rounded flex items-center gap-1 font-medium transition cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Demo</span>
        </button>
      </div>
    </aside>
  );
}
