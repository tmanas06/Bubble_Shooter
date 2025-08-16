'use client';

import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function WalletDebug() {
  const [walletInfo, setWalletInfo] = useState<Record<string, any>>({});
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
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

    setWalletInfo({
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
    });
  }, [isConnected, address, connector, connectors, error]);

  const farcasterConnector = connectors.find(c => c.id === 'farcaster');

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h3 className="font-bold mb-2">Wallet Debug Info</h3>
      <div className="space-y-1">
        {Object.entries(walletInfo).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-gray-300">{key}:</span>
            <span className={typeof value === 'boolean' ? (value ? 'text-green-400' : 'text-red-400') : ''}>
              {typeof value === 'boolean' ? value.toString() : value}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-700">
        {!isConnected && farcasterConnector && (
          <button
            onClick={async () => {
              setIsConnecting(true);
              try {
                await connect({ connector: farcasterConnector });
              } finally {
                setIsConnecting(false);
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded mr-2"
            disabled={isPending || isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Farcaster'}
          </button>
        )}
        {isConnected && (
          <button
            onClick={() => disconnect()}
            className="bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
          >
            Disconnect
          </button>
        )}
      </div>
      
      {error && (
        <div className="mt-2 p-2 bg-red-900 text-red-100 rounded text-xs">
          {error.message}
        </div>
      )}
    </div>
  );
}
