'use client';

import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { useMiniApp } from '@neynar/react';

type ErrorState = {
  message: string;
  code?: string;
  showReload?: boolean;
};

export function WalletErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<ErrorState | null>(null);
  const { context } = useMiniApp();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Handle Farcaster wallet errors
      if (
        event.error?.message?.includes('Farcaster wallet not found') ||
        event.error?.code === 'FARCASTER_WALLET_NOT_INSTALLED' ||
        event.error?.message?.includes('MiniKit')
      ) {
        setError({
          message: 'Farcaster Wallet Required',
          code: event.error?.code,
          showReload: true
        });
        event.preventDefault();
      }
    };

    // Listen for unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason?.message?.includes('Farcaster') ||
        event.reason?.message?.includes('wallet') ||
        event.reason?.message?.includes('MiniKit')
      ) {
        setError({
          message: 'Wallet Error',
          code: event.reason?.code,
          showReload: true
        });
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection as EventListener);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection as EventListener);
    };
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full border border-border">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-destructive/10 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-destructive"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" x2="12" y1="8" y2="12"></line>
                <line x1="12" x2="12.01" y1="16" y2="16"></line>
              </svg>
            </div>
            <h2 className="text-2xl font-bold">{error.message}</h2>
            <p className="text-muted-foreground">
              {error.code === 'FARCASTER_WALLET_NOT_INSTALLED'
                ? 'Please install the Farcaster mobile app and try again.'
                : 'An error occurred while connecting to your wallet.'}
            </p>
            {error.showReload && (
              <Button 
                onClick={handleReload}
                className="mt-4"
                variant="outline"
              >
                Reload Page
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
