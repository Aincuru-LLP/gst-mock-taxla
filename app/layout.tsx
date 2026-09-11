import type { Metadata } from 'next';
import './globals.css';
import { DemoBar } from '@/components/portal/DemoBar';
import { PortalFooter } from '@/components/portal/PortalFooter';

export const metadata: Metadata = {
  title: 'TAXLA GST AUTOMATION — Mock GST Registration Portal',
  description: 'Dedicated functional mock GST registration portal for TAXLA Playwright browser automation.',
  robots: 'noindex, nofollow'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 antialiased">
        <DemoBar />
        <main className="grow flex flex-col">
          {children}
        </main>
        <PortalFooter />
      </body>
    </html>
  );
}
