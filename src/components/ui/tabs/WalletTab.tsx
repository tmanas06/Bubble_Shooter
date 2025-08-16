"use client";

import { useState, useEffect } from "react";
import { useAccount, useChainId } from "wagmi";
import { Button } from "../Button";
import { truncateAddress } from "../../../lib/truncateAddress";
import { SignEvmMessage } from "../wallet/SignEvmMessage";
import { SendEth } from "../wallet/SendEth";
import { useMiniApp } from "@neynar/react";

interface WalletStatusProps {
  address?: string;
  chainId?: number;
}

function WalletStatus({ address, chainId }: WalletStatusProps) {
  return (
    <div className="space-y-2 mb-4">
      {address && (
        <div className="text-sm">
          <span className="font-medium">Address:</span> {truncateAddress(address)}
        </div>
      )}
      {chainId && (
        <div className="text-sm">
          <span className="font-medium">Chain ID:</span> {chainId}
        </div>
      )}
    </div>
  );
}

export default function WalletTab() {
  const { address, isConnected, status } = useAccount();
  const chainId = useChainId();
  const { context } = useMiniApp();
  const [mounted, setMounted] = useState(false);

  // Only render on client to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Check if we're in a Farcaster client with wallet support
  const isFarcasterClient = !!context?.client;
  const isWalletConnected = isConnected && !!address;

  if (!isFarcasterClient) {
    return (
      <div className="p-4 text-center">
        <p className="mb-4">Please open this app in Farcaster to access wallet features</p>
        <p className="text-sm text-muted-foreground">
          This app requires Farcaster's built-in wallet to function properly.
        </p>
      </div>
    );
  }

  if (status === 'connecting' || status === 'reconnecting') {
    return (
      <div className="p-4 text-center">
        <p className="mb-4">Connecting to wallet...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    );
  }

  if (!isWalletConnected) {
    return (
      <div className="p-4 text-center">
        <p className="mb-4">Wallet not connected</p>
        <p className="text-sm text-muted-foreground mb-4">
          The wallet connection is managed automatically by Farcaster.
        </p>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-2"
        >
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Wallet Status</h3>
        <WalletStatus address={address} chainId={chainId} />
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Sign Message</h3>
          <SignEvmMessage />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Send ETH</h3>
          <SendEth />
        </div>
      </div>

      {process.env.NODE_ENV === 'development' && context?.user?.fid && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm">
          <h4 className="font-medium mb-2">Debug Info</h4>
          <div>Farcaster User ID: {context.user.fid}</div>
          {context.user.username && <div>Username: {context.user.username}</div>}
        </div>
      )}
    </div>
  );
}
