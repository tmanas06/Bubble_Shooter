'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const GameCanvas = dynamic(() => import('@/components/GameCanvas'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-white">Loading game...</div>
    </div>
  )
});

export default function GamePage() {
  const router = useRouter();
  const [creator, setCreator] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Default to a creator if none is set
    const c = localStorage.getItem('chosenCreator') || 'default';
    setCreator(c);
    setIsLoading(false);
  }, []);

  interface GameOverParams {
    score: number;
    lives?: number;
    pops?: number;
  }

  const onOver = useCallback(({ score, lives = 0, pops = 0 }: GameOverParams) => {
    const params = new URLSearchParams({
      s: String(score),
      l: String(lives),
      p: String(pops)
    });
    router.push(`/score?${params.toString()}`);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B3E84]">
        <div className="text-white">Loading game...</div>
      </div>
    );
  }

  // Ensure creator is always a string
  const gameCreator = creator || 'default';

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[#0B3E84]">
      <div className="relative w-full max-w-[390px] h-[844px] rounded-3xl overflow-hidden shadow-2xl">
        <GameCanvas chosenCreator={gameCreator} onGameOver={onOver} />
      </div>
    </div>
  );
}
