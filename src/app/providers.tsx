'client';

import dynamic from 'next/dynamic';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { MiniAppProvider } from '@neynar/react';
import { ANALYTICS_ENABLED, RETURN_URL } from '~/lib/constants';
import { WalletErrorBoundary } from '~/components/wallet/WalletErrorBoundary';

const WagmiProvider = dynamic(
  () => import('~/components/providers/WagmiProvider'),
  {
    ssr: false,
  }
);

export function Providers({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  return (
    <SessionProvider session={session}>
      <MiniAppProvider
        analyticsEnabled={ANALYTICS_ENABLED}
        backButtonEnabled={true}
        returnUrl={RETURN_URL}
      >
        <WagmiProvider>
          <WalletErrorBoundary>
            {children}
          </WalletErrorBoundary>
        </WagmiProvider>
      </MiniAppProvider>
    </SessionProvider>
  );
}
