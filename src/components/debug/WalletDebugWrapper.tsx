'client';

import dynamic from 'next/dynamic';
import { WalletDebug } from './WalletDebug';

export function WalletDebugWrapper() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return <WalletDebug />;
}
