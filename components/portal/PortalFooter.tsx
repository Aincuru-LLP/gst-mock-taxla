import React from 'react';
import Link from 'next/link';

export function PortalFooter() {
  return (
    <footer className="w-full bg-slate-800 text-slate-300 text-xs mt-auto border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-700">
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-2 text-[11px]">
              TAXLA GST AUTOMATION TARGET
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              This environment is an isolated, functional simulation of the GST registration portal built specifically for testing Playwright browser automation workflows in TAXLA.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-2 text-[11px]">
              Compliance & Safety Notice
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              This system does not connect to any government server, GSTN, or live databases. All PAN, TRN, ARN, GSTIN, and Aadhaar numbers are synthetic test fixtures.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-2 text-[11px]">
              Automation Resources
            </h4>
            <ul className="space-y-1 text-[11px]">
              <li>
                <Link href="/health" className="text-blue-300 hover:underline">
                  Service Health Check (/health)
                </Link>
              </li>
              <li>
                <Link href="/registration/new" className="text-blue-300 hover:underline">
                  New Registration (/registration/new)
                </Link>
              </li>
              <li>
                <Link href="/registration/trn-login" className="text-blue-300 hover:underline">
                  TRN Login Portal (/registration/trn-login)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[11px] gap-2">
          <div>
            © {new Date().getFullYear()} TAXLA GST Automation Mock Portal. All rights reserved.
          </div>
          <div className="text-amber-400 font-medium">
            STRICTLY FOR AUTOMATION TESTING & DEMONSTRATION PURPOSES ONLY
          </div>
        </div>
      </div>
    </footer>
  );
}
