'use client';

import { useMiniApp } from '@neynar/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '../ui/Button';
import { truncateAddress } from '../../lib/truncateAddress';

interface MiniKitWalletProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function MiniKitWallet({ onConnect, onDisconnect }: MiniKitWalletProps) {
  const { context } = useMiniApp();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    if (connectors[0]) {
      connect({ connector: connectors[0] });
      onConnect?.();
    }
  };

  const handleDisconnect = () => {
    disconnect();
    onDisconnect?.();
  };

  if (isConnected && address) {
    return (
      <div className="space-y-2 w-full">
        <div className="text-sm font-medium">Connected Wallet</div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {truncateAddress(address)}
        </div>
        <Button onClick={handleDisconnect} className="w-full">
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2 w-full">
      <Button onClick={handleConnect} className="w-full">
        {context ? 'Connect with Farcaster' : 'Connect Wallet'}
      </Button>
    </div>
  );
}
