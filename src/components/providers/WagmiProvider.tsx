import React, { useEffect, useState, Suspense, Component, ErrorInfo, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, http, WagmiProvider as WagmiCoreProvider, type Config as WagmiConfig } from 'wagmi';
import { mainnet, base, sepolia, arbitrum, optimism, celo } from 'wagmi/chains';
import { createConnector } from 'wagmi';
import type { Connector } from 'wagmi';
import type { EIP1193Provider } from 'viem';
import { FarcasterMiniAppSDK } from '@farcaster/miniapp-sdk';

// Extend window with Farcaster provider
declare global {
  interface Window {
    farcaster?: {
      wallet?: {
        getEthereumProvider: () => Promise<FarcasterProvider>;
      };
    };
  }
}

// Type for the Farcaster provider
type FarcasterProvider = EIP1193Provider & {
  on?: (event: string, listener: (...args: any[]) => void) => void;
  off?: (event: string, listener: (...args: any[]) => void) => void;
  removeListener?: (event: string, listener: (...args: any[]) => void) => void;
  isFarcaster?: boolean;
};

// Type for the connector config
type ConnectorConfig = {
  chains: readonly any[]; // Using any[] since Chain type isn't directly available
  emitter: any; // Using any as the exact type isn't exported from wagmi
};

// ----------------------
// Farcaster Connector
// ----------------------
export const farcasterConnector = createConnector((config: ConnectorConfig) => {
  let provider: FarcasterProvider | null = null;
  let cleanup: (() => void) | null = null;
  const emitter = config.emitter;

  // Check if Farcaster wallet is available
  const isFarcasterAvailable = (): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      
      // Check for Farcaster wallet using safe access
      let farcaster;
      try {
        // Try direct access first
        farcaster = (window as any).farcaster;
        
        // Then try parent frame if not found
        if (!farcaster && window !== window.parent) {
          farcaster = safeGetWindowProperty(window.parent, 'farcaster');
        }
        
        // Then try opener if not found
        if (!farcaster && window.opener) {
          farcaster = safeGetWindowProperty(window.opener, 'farcaster');
        }
      } catch (error) {
        console.error('[Farcaster] Error checking for wallet:', error);
        return false;
      }
      
      const hasProvider = !!(farcaster?.wallet?.getEthereumProvider);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[Farcaster] Wallet available:', hasProvider);
        if (!hasProvider) {
          console.log('[Farcaster] Wallet not found. Checking for window.farcaster...');
          console.log('[Farcaster] window.farcaster exists:', !!(window as any).farcaster);
          console.log('[Farcaster] window.parent.farcaster exists:', 
            window !== window.parent ? safeGetWindowProperty(window.parent, 'farcaster') !== undefined : 'same origin');
          console.log('[Farcaster] window.opener.farcaster exists:', 
            window.opener ? safeGetWindowProperty(window.opener, 'farcaster') !== undefined : 'no opener');
        }
      }
      
      return hasProvider;
    } catch (error) {
      console.error('[Farcaster] Error in isFarcasterAvailable:', error);
      return false;
    }
  };

  // Helper: safely access window properties to avoid cross-origin errors
  const safeGetWindowProperty = (win: Window, prop: string): any => {
    try {
      // @ts-ignore
      return win[prop];
    } catch (error) {
      if (error instanceof Error && error.name === 'SecurityError') {
        console.log(`[Farcaster] Cannot access '${prop}' due to security restrictions`);
        return undefined;
      }
      throw error;
    }
  };

  // Helper: get provider
  const getProvider = async (): Promise<FarcasterProvider> => {
    if (!provider) {
      try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          throw new Error('Farcaster wallet not available (not in browser)');
        }
        
        console.log('[Farcaster] Attempting to get provider...');
        
        // Check for Farcaster wallet in a way that won't throw on cross-origin
        let farcaster;
        try {
          // Try direct access first
          farcaster = (window as any).farcaster;
          
          // Then try parent frame if not found
          if (!farcaster && window !== window.parent) {
            farcaster = safeGetWindowProperty(window.parent, 'farcaster');
          }
          
          // Then try opener if not found
          if (!farcaster && window.opener) {
            farcaster = safeGetWindowProperty(window.opener, 'farcaster');
          }
        } catch (error) {
          console.error('[Farcaster] Error accessing window properties:', error);
          throw new Error('Cannot access Farcaster wallet due to security restrictions');
        }
        
        if (!farcaster?.wallet?.getEthereumProvider) {
          const errorMsg = 'Farcaster wallet not found in any of the expected locations';
          console.error('[Farcaster]', errorMsg);
          
          if (process.env.NODE_ENV === 'development') {
            console.log('[Farcaster] Window properties:', Object.keys(window));
            if ((window as any).parent) {
              console.log('[Farcaster] Parent window properties:', Object.keys((window as any).parent));
            }
          }
          
          throw new Error(errorMsg);
        }
        
        console.log('[Farcaster] Found wallet, getting ethereum provider...');
        const p = await farcaster.wallet.getEthereumProvider();
        
        if (!p?.request) {
          const errorMsg = 'Invalid Farcaster provider - missing request method';
          console.error('[Farcaster]', errorMsg, p);
          throw new Error(errorMsg);
        }
        
        // Verify the provider is working by making a simple request
        console.log('[Farcaster] Verifying provider...');
        try {
          const chainId = await p.request({ method: 'eth_chainId' });
          console.log('[Farcaster] Provider initialized successfully. Chain ID:', chainId);
          
          // Set up event listeners for debugging
          p.on?.('accountsChanged', (accounts: string[]) => {
            console.log('[Farcaster] Accounts changed:', accounts);
          });
          
          p.on?.('chainChanged', (chainId: string) => {
            console.log('[Farcaster] Chain changed:', chainId);
          });
          
          provider = p as FarcasterProvider;
          return provider;
          
        } catch (verifyError) {
          const errorMsg = 'Farcaster wallet is not responding to requests';
          console.error('[Farcaster]', errorMsg, verifyError);
          throw new Error(errorMsg);
        }
        
      } catch (error) {
        console.error('[Farcaster] Error getting provider:', error);
        if (error instanceof Error) {
          throw new Error(`Failed to connect to Farcaster wallet: ${error.message}`);
        }
        throw new Error('Failed to connect to Farcaster wallet');
      }
    }
    
    return provider;
  };

  // Event listeners
  const setupEventListeners = (p: FarcasterProvider) => {
    const accountsHandler = (accounts: string[]) => {
      emitter.emit('change', { accounts });
    };
    
    const chainHandler = (chainId: string) => {
      emitter.emit('change', { chainId: parseInt(chainId, 16) });
    };
    
    const disconnectHandler = () => {
      emitter.emit('disconnect');
    };

    p.on?.('accountsChanged', accountsHandler);
    p.on?.('chainChanged', chainHandler);
    p.on?.('disconnect', disconnectHandler);

    cleanup = () => {
      p.off?.('accountsChanged', accountsHandler);
      p.off?.('chainChanged', chainHandler);
      p.off?.('disconnect', disconnectHandler);
    };
  };

  return {
    id: 'farcaster',
    name: 'Farcaster',
    type: 'farcaster',

    async connect() {
      try {
        // First check if Farcaster is available
        if (typeof window === 'undefined' || !window.farcaster?.wallet?.getEthereumProvider) {
          throw new Error('Please install the Farcaster wallet extension to continue');
        }

        const p = await getProvider();
        
        // Request accounts from the wallet
        const accounts = (await p.request({ 
          method: 'eth_requestAccounts' 
        })) as string[];
        
        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts returned from Farcaster wallet');
        }
        
        const chainIdHex = await p.request({ 
          method: 'eth_chainId' 
        }) as string;
        
        const chainId = parseInt(chainIdHex, 16);
        
        // Set up event listeners for account/chain changes
        setupEventListeners(p);

        return { 
          accounts, 
          chainId 
        };
      } catch (error) {
        console.error('Error connecting to Farcaster:', error);
        // Provide more user-friendly error messages
        if (error instanceof Error) {
          if (error.message.includes('user rejected')) {
            throw new Error('Connection to Farcaster wallet was rejected');
          } else if (error.message.includes('not available')) {
            throw new Error('Farcaster wallet not detected. Please install it and try again.');
          }
        }
        throw error;
      }
    },

    async disconnect() {
      cleanup?.();
      provider = null;
      emitter.emit('disconnect');
    },

    async getAccounts() {
      try {
        const p = await getProvider();
        return (await p.request({ 
          method: 'eth_accounts' 
        })) as string[];
      } catch (error) {
        console.error('Error getting accounts:', error);
        return [];
      }
    },

    async getChainId() {
      try {
        const p = await getProvider();
        const chainIdHex = await p.request({ 
          method: 'eth_chainId' 
        }) as string;
        return parseInt(chainIdHex, 16);
      } catch (error) {
        console.error('Error getting chain ID:', error);
        return 1; // Default to mainnet
      }
    },

    async isAuthorized(this: { getAccounts: () => Promise<string[]> }) {
      // First check if Farcaster is available
      if (!isFarcasterAvailable()) {
        return false;
      }
      
      try {
        const accounts = await this.getAccounts();
        return accounts.length > 0;
      } catch (error) {
        console.error('Error checking authorization:', error);
        return false;
      }
    },

    async getProvider() {
      return getProvider();
    },

    onAccountsChanged(handler: (accounts: string[]) => void) {
      emitter.on('accountsChanged', handler);
      return () => emitter.off('accountsChanged', handler);
    },

    onChainChanged(handler: (chainId: string) => void) {
      emitter.on('chainChanged', handler);
      return () => emitter.off('chainChanged', handler);
    },

    onDisconnect(handler: (error: Error) => void) {
      emitter.on('disconnect', handler);
      return () => emitter.off('disconnect', handler);
    },
  } as unknown as Connector; // Type assertion to satisfy the Connector type
});

// Utility to safely access window properties
function getFarcasterProvider() {
  try {
    // Check if window.parent is accessible and same-origin
    let farcaster;
    if (window.parent && window.parent !== window) {
      try {
        // Only access if same-origin
        if (window.parent.origin === window.origin) {
          farcaster = window.parent.farcaster;
        }
      } catch (err) {
        // Cross-origin, ignore
      }
    }
    // Fallback to window.farcaster
    if (!farcaster && window.farcaster) {
      farcaster = window.farcaster;
    }
    return farcaster || null;
  } catch (err) {
    // Log and return null
    console.warn('[Farcaster] Error accessing provider:', err);
    return null;
  }
}

// ----------------------
// Wagmi Config
// ----------------------
const chains = [mainnet, base, sepolia, arbitrum, optimism, celo] as const;

const transportConfig = {
  [mainnet.id]: http(),
  [base.id]: http(),
  [sepolia.id]: http(),
  [arbitrum.id]: http(),
  [optimism.id]: http(),
  [celo.id]: http(),
};

export const config = createConfig({
  chains: chains as any,
  transports: transportConfig,
  connectors: [farcasterConnector as any],
  // Disable WalletConnect and other default connectors
  multiInjectedProviderDiscovery: false,
  // Disable batch requests to avoid WalletConnect calls
  batch: { multicall: false },
  // Disable server-side rendering for wallet connections
  ssr: false,
  // Add polling for account/chain changes
  pollingInterval: 10_000,
  // Enable debug logging in development
  ...(process.env.NODE_ENV === 'development' ? {
    _internal: {
      debug: true,
    }
  } : {})
});

// ----------------------
// Query Client
// ----------------------
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 min
    },
  },
});

// ----------------------
// Error Boundary
// ----------------------
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error in WagmiProvider:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          <p>Something went wrong loading the wallet provider. Please refresh the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ----------------------
// Loading Spinner
// ----------------------
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    <span className="ml-3 text-lg">Loading wallet...</span>
  </div>
);

// ----------------------
// Wagmi Provider with Query Client
// ----------------------
export function WagmiProviderWithQueryClient({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <WagmiCoreProvider config={config}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </WagmiCoreProvider>
      </Suspense>
    </ErrorBoundary>
  );
}

// ----------------------
// Default Export Provider
// ----------------------
export default function Provider({ children }: { children: React.ReactNode }) {
  return <WagmiProviderWithQueryClient>{children}</WagmiProviderWithQueryClient>;
}
