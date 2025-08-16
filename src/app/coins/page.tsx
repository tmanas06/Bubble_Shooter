'use client';

import dynamic from 'next/dynamic';

// Dynamically import the CoinPage component with no SSR
const CoinPage = dynamic(() => import('@/components/CoinPage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Loading coins...</div>
    </div>
  ),
});

export default function CoinsPage() {
  return <CoinPage />;
}
