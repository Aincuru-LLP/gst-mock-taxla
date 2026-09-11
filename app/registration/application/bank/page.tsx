'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { ApplicationHeader } from '@/components/application/ApplicationHeader';
import { ApplicationNavTabs } from '@/components/application/ApplicationNavTabs';
import { getSession, saveSession } from '@/lib/state/session-store';
import { BankAccountDetails } from '@/types/gst';
import { Landmark, Plus, Trash2, Save, ArrowRight, ArrowLeft } from 'lucide-react';

export default function BankAccountsPage() {
  const router = useRouter();
  const [session, setSession] = useState(getSession());

  const [bankAccounts, setBankAccounts] = useState<BankAccountDetails[]>([]);

  // Form fields
  const [bankName, setBankName] = useState<string>('HDFC Bank');
  const [accountNumber, setAccountNumber] = useState<string>('50100234567890');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState<string>('50100234567890');
  const [ifsc, setIfsc] = useState<string>('HDFC0001234');
  const [accountType, setAccountType] = useState<BankAccountDetails['accountType']>('Current');
  const [branch, setBranch] = useState<string>('Indiranagar, Bengaluru');

  const [error, setError] = useState<string>('');

  useEffect(() => {
    const s = getSession();
    setSession(s);
    if (s.bankAccounts && s.bankAccounts.length > 0) {
      setBankAccounts(s.bankAccounts);
      const first = s.bankAccounts[0];
      setBankName(first.bankName);
      setAccountNumber(first.accountNumber);
      setConfirmAccountNumber(first.confirmAccountNumber);
      setIfsc(first.ifsc);
      setAccountType(first.accountType);
      setBranch(first.branch);
    } else {
      const defaultAccount: BankAccountDetails = {
        id: 'bank-1',
        bankName: 'HDFC Bank',
        accountNumber: '50100234567890',
        confirmAccountNumber: '50100234567890',
        ifsc: 'HDFC0001234',
        accountType: 'Current',
        branch: 'Indiranagar, Bengaluru'
      };
      setBankAccounts([defaultAccount]);
    }
  }, []);

  const handleAddAccount = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!bankName.trim() || !accountNumber.trim() || !ifsc.trim()) {
      setError('Bank Name, Account Number, and IFSC are mandatory.');
      return;
    }

    if (accountNumber.trim() !== confirmAccountNumber.trim()) {
      setError('Account Number and Confirm Account Number must match.');
      return;
    }

    const newAcc: BankAccountDetails = {
      id: `bank-${Date.now()}`,
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      confirmAccountNumber: confirmAccountNumber.trim(),
      ifsc: ifsc.trim().toUpperCase(),
      accountType,
      branch: branch.trim() || 'Main Branch'
    };

    setBankAccounts([...bankAccounts, newAcc]);
    setError('');
  };

  const handleRemoveAccount = (id: string) => {
    setBankAccounts(bankAccounts.filter(b => b.id !== id));
  };

  const handleSaveAndContinue = () => {
    if (bankAccounts.length === 0) {
      setError('Please add at least one Bank Account.');
      return;
    }

    const updated = {
      ...session,
      bankAccounts,
      completedTabs: {
        ...session.completedTabs,
        bank: true
      }
    };

    saveSession(updated);
    router.push('/registration/application/state-specific');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PortalHeader
        currentStepTitle="Bank Accounts"
        breadcrumbs={[
          { label: 'Registration', href: '/registration' },
          { label: 'Application', href: '/registration/application' },
          { label: 'Bank Accounts' }
        ]}
      />

      <div className="max-w-6xl mx-auto w-full px-4 py-6 flex-1">
        <ApplicationHeader session={session} />
        <ApplicationNavTabs session={session} />

        <div className="portal-card p-6 border-t-4 border-t-[#1B365D]">
          
          <div className="border-b border-slate-200 pb-3 mb-5">
            <h2 className="text-base font-bold text-[#1B365D] flex items-center gap-2">
              <Landmark className="w-5 h-5" />
              Tab 7: Bank Accounts Maintained for Business
            </h2>
            <p className="text-xs text-slate-600">
              Provide details of the bank accounts used for conducting business transactions.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded">
              {error}
            </div>
          )}

          {/* Form to add or update account */}
          <div className="bg-slate-50 border border-slate-200 rounded p-4 mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Bank Account Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Bank Name */}
              <div>
                <label htmlFor="bank-name" className="portal-label portal-label-required">
                  Bank Name
                </label>
                <input
                  id="bank-name"
                  data-testid="gst-bank-name"
                  type="text"
                  placeholder="e.g. HDFC Bank, ICICI Bank, SBI"
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  className="portal-input"
                  required
                />
              </div>

              {/* Account Number */}
              <div>
                <label htmlFor="bank-account" className="portal-label portal-label-required">
                  Account Number
                </label>
                <input
                  id="bank-account"
                  data-testid="gst-bank-account"
                  type="text"
                  placeholder="Enter Bank Account Number"
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  className="portal-input font-mono font-semibold"
                  required
                />
              </div>

              {/* Confirm Account Number */}
              <div>
                <label htmlFor="bank-account-confirm" className="portal-label portal-label-required">
                  Confirm Account Number
                </label>
                <input
                  id="bank-account-confirm"
                  data-testid="gst-bank-account-confirm"
                  type="text"
                  placeholder="Re-enter Bank Account Number"
                  value={confirmAccountNumber}
                  onChange={e => setConfirmAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  className="portal-input font-mono font-semibold"
                  required
                />
              </div>

              {/* IFSC */}
              <div>
                <label htmlFor="bank-ifsc" className="portal-label portal-label-required">
                  IFSC Code
                </label>
                <input
                  id="bank-ifsc"
                  data-testid="gst-bank-ifsc"
                  type="text"
                  maxLength={11}
                  placeholder="e.g. HDFC0001234"
                  value={ifsc}
                  onChange={e => setIfsc(e.target.value.toUpperCase())}
                  className="portal-input font-mono uppercase"
                  required
                />
              </div>

              {/* Account Type */}
              <div>
                <label htmlFor="bank-account-type" className="portal-label portal-label-required">
                  Type of Account
                </label>
                <select
                  id="bank-account-type"
                  value={accountType}
                  onChange={e => setAccountType(e.target.value as BankAccountDetails['accountType'])}
                  className="portal-input"
                >
                  <option value="Current">Current Account</option>
                  <option value="Savings">Savings Account</option>
                  <option value="Cash Credit">Cash Credit Account</option>
                </select>
              </div>

              {/* Branch */}
              <div>
                <label htmlFor="bank-branch" className="portal-label">
                  Branch Address
                </label>
                <input
                  id="bank-branch"
                  type="text"
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
                  className="portal-input"
                />
              </div>

            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                data-testid="gst-add-bank"
                onClick={handleAddAccount}
                className="portal-btn-secondary text-xs"
              >
                <Plus className="w-3.5 h-3.5 text-blue-700" />
                <span>Add Bank Account</span>
              </button>
            </div>
          </div>

          {/* Table of added bank accounts */}
          <div className="border border-slate-200 rounded overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              Bank Accounts Added ({bankAccounts.length})
            </div>

            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Bank Name</th>
                  <th className="p-3">Account Number</th>
                  <th className="p-3">Account Type</th>
                  <th className="p-3">IFSC</th>
                  <th className="p-3">Branch</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {bankAccounts.map((acc, idx) => (
                  <tr key={acc.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-600">{idx + 1}</td>
                    <td className="p-3 font-semibold text-slate-900">{acc.bankName}</td>
                    <td className="p-3 font-mono font-bold text-[#1B365D]">{acc.accountNumber}</td>
                    <td className="p-3">{acc.accountType}</td>
                    <td className="p-3 font-mono uppercase">{acc.ifsc}</td>
                    <td className="p-3 text-slate-600">{acc.branch}</td>
                    <td className="p-3 text-right">
                      {bankAccounts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAccount(acc.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Navigation Actions */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push('/registration/application/goods-services')}
              className="portal-btn-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back (Goods &amp; Services)</span>
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
