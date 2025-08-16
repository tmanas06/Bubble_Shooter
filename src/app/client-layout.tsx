'use client';

import { useEffect, useState } from 'react';
import { Providers } from './providers';
import FontAwesomeProvider from './font-awesome-provider';
import { WalletDebugWrapper } from '~/components/debug/WalletDebugWrapper';

function ClientBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10 w-full h-full">
      <img 
        src="/assets/backgrounds/every.png" 
        alt="background"
        className="w-full h-full object-cover"
        loading="eager"
      />
    </div>
  );
}

export default function ClientLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen relative">
        <ClientBackground />
        <div className="relative z-10">
          <Providers session={session}>
            <FontAwesomeProvider>
              {children}
              <WalletDebugWrapper />
            </FontAwesomeProvider>
          </Providers>
        </div>
      </body>
    </html>
  );
}
