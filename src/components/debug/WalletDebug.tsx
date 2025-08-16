'use client';

import { useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';

export function WalletDebug() {
  const { address, isConnected, connector } = useAccount();
  const { connectors, error } = useConnect();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Safe access for Farcaster wallet in all possible locations
      let farcaster = undefined;
      let windowFarcaster = false;
      let parentFarcaster = false;
      let openerFarcaster = false;
      
      try {
        windowFarcaster = !!(window as any).farcaster;
        if ((window as any).farcaster) farcaster = (window as any).farcaster;
      } catch (e) {
        windowFarcaster = false;
      }
      
      try {
        parentFarcaster = !!(window as any).parent?.farcaster;
        if (!farcaster && (window as any).parent?.farcaster) farcaster = (window as any).parent.farcaster;
      } catch (e) {
        parentFarcaster = false;
      }
      
      try {
        openerFarcaster = !!(window as any).opener?.farcaster;
        if (!farcaster && (window as any).opener?.farcaster) farcaster = (window as any).opener.farcaster;
      } catch (e) {
        openerFarcaster = false;
      }

      const walletInfo = {
        'window.farcaster exists': windowFarcaster,
        'window.parent.farcaster exists': parentFarcaster,
        'window.opener.farcaster exists': openerFarcaster,
        'farcaster.wallet exists': !!farcaster?.wallet,
        'farcaster.wallet.getEthereumProvider exists': !!farcaster?.wallet?.getEthereumProvider,
        'isConnected': isConnected,
        'connectedAddress': address,
        'activeConnector': connector?.name || 'None',
        'availableConnectors': connectors.map(c => c.name).join(', '),
        'error': error?.message || 'None'
      };

      // Log wallet info to console
      console.group('Wallet Debug Info');
      Object.entries(walletInfo).forEach(([key, value]) => {
        console.log(`${key}:`, value);
      });
      console.groupEnd();
      
      if (error) {
        console.error('Wallet connection error:', error);
      }
    }
  }, [isConnected, address, connector, connectors, error]);

  // Don't render anything
  return null;
}
