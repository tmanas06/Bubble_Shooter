'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, http, WagmiProvider as WagmiProviderBase } from 'wagmi';
import type { Config } from 'wagmi';
import { base, mainnet } from 'wagmi/chains';
import { useMiniApp } from '@neynar/react';

// Types
type WalletStatus = {
  isConnected: boolean;
  fid?: number;
};

// Create context
const WalletStatusContext = React.createContext<WalletStatus>({
  isConnected: false,
});

// Query client for wagmi
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 min
    },
  },
});

// Wagmi config with only the chains we need
const config: Config = createConfig({
  chains: [mainnet, base],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
  ssr: false, // Disable server-side rendering for wallet connections
});

function WalletStatusProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<WalletStatus>({ isConnected: false });
  const { context } = useMiniApp();

  React.useEffect(() => {
    const fid = context?.user?.fid;
    const isConnected = !!fid;
    
    setStatus({
      isConnected,
      fid: fid ? Number(fid) : undefined
    });
    
    if (process.env.NODE_ENV === 'development') {
      if (fid) {
        console.log('[Farcaster] User FID:', fid);
        console.log('[Farcaster] Wallet connected');
      } else {
        console.log('[Farcaster] Wallet not connected');
      }
    }
  }, [context?.user?.fid]);

  return (
    <WalletStatusContext.Provider value={status}>
      {children}
    </WalletStatusContext.Provider>
  );
}

// Export the hook
export const useWalletStatus = () => React.useContext(WalletStatusContext);

export default function WagmiProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  // Only run on client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProviderBase config={config}>
      <QueryClientProvider client={queryClient}>
        {mounted && (
          <WalletStatusProvider>
            {children}
          </WalletStatusProvider>
        )}
      </QueryClientProvider>
    </WagmiProviderBase>
  );
}
