import React, { createContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { sdk } from '@farcaster/miniapp-sdk';

const FarcasterSolanaProvider = dynamic(
  () => import('@farcaster/mini-app-solana')
    .then(mod => {
      console.log('FarcasterSolanaProvider module loaded:', mod);
      if (!mod.FarcasterSolanaProvider) {
        throw new Error('FarcasterSolanaProvider export not found in @farcaster/mini-app-solana');
      }
      return mod.FarcasterSolanaProvider;
    })
    .catch(error => {
      console.error('Error loading FarcasterSolanaProvider:', error);
      throw error;
    }),
  { 
    ssr: false,
    loading: () => {
      console.log('Loading FarcasterSolanaProvider...');
      return null;
    }
  }
);

type SafeFarcasterSolanaProviderProps = {
  endpoint: string;
  children: React.ReactNode;
};

const SolanaProviderContext = createContext<{ hasSolanaProvider: boolean }>({ hasSolanaProvider: false });

export function SafeFarcasterSolanaProvider({ endpoint, children }: SafeFarcasterSolanaProviderProps) {
  const isClient = typeof window !== "undefined";
  const [hasSolanaProvider, setHasSolanaProvider] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    if (!isClient) return;
    // NOTE: If you ever need to access window.parent or window.opener for provider detection,
    // always use try/catch and check for cross-origin SecurityError.
    let cancelled = false;
    console.log('Checking for Solana provider...');
    (async () => {
      try {
        console.log('Calling sdk.wallet.getSolanaProvider()...');
        const provider = await sdk.wallet.getSolanaProvider();
        console.log('Got Solana provider:', provider ? 'available' : 'not available');
        if (!cancelled) {
          setHasSolanaProvider(!!provider);
        }
      } catch (error) {
        console.error('Error getting Solana provider:', error);
        if (!cancelled) {
          setHasSolanaProvider(false);
        }
      } finally {
        if (!cancelled) {
          console.log('Provider check complete');
          setChecked(true);
        }
      }
    })();
    return () => {
      console.log('Cleaning up Solana provider check');
      cancelled = true;
    };
  }, [isClient]);

  useEffect(() => {
    let errorShown = false;
    const origError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("WalletConnectionError: could not get Solana provider")
      ) {
        if (!errorShown) {
          origError(...args);
          errorShown = true;
        }
        return;
      }
      origError(...args);
    };
    return () => {
      console.error = origError;
    };
  }, []);

  if (!isClient) {
    console.log('Not rendering FarcasterSolanaProvider: not in browser');
    return null;
  }
  if (!checked) {
    console.log('Not rendering FarcasterSolanaProvider: provider check not complete');
    return null;
  }

  return (
    <SolanaProviderContext.Provider value={{ hasSolanaProvider }}>
      {hasSolanaProvider ? (
        <FarcasterSolanaProvider endpoint={endpoint}>
          {children}
        </FarcasterSolanaProvider>
      ) : (
        <>{children}</>
      )}
    </SolanaProviderContext.Provider>
  );
}

export function useHasSolanaProvider() {
  return React.useContext(SolanaProviderContext).hasSolanaProvider;
}
