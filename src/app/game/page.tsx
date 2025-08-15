'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, ComponentType } from 'react';
import Link from 'next/link';

// Import components with dynamic loading
const HamburgerMenu = (await import('@/components/HamburgerMenu')).default;
const GameCanvas = (await import('@/components/GameCanvas')).default;


interface GameOverParams {
  score: number;
  lives: number;
  pops: number;
}

// Disable SSR for this page to avoid Next.js auth issues
export const dynamic = 'force-dynamic';

export default function GamePage() {
  const router = useRouter();
  const [creator, setCreator] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameOver, setGameOver] = useState<GameOverParams | null>(null);
  const [showScore, setShowScore] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const c = localStorage.getItem('chosenCreator') || 'default';
      setCreator(c);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const onGameOver = useCallback(
    ({ score, lives = 0, pops = 0 }: GameOverParams) => {
      setGameOver({ score, lives, pops });
      setShowScore(true);
    },
    []
  );

  const handlePlayAgain = useCallback(() => {
    setShowScore(false);
    setGameOver(null);
  }, []);

  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B3E84]">
        <div className="text-white">Loading game...</div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/assets/backgrounds/every.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Hamburger Menu */}
      <HamburgerMenu />
      {/* Outer fixed-size game container */}
      <div
        className="relative w-full max-w-4xl h-[80vh] max-h-[90vh] bg-white/90 rounded-2xl overflow-hidden flex items-center justify-center"
        style={{
          margin: '0 auto',
        }}
      >
        {/* Background with white overlay */}
        <div className="absolute inset-0 w-full h-full bg-white/90"></div>

        {/* Game fill area */}
        {creator && (
          <div className="relative w-full h-full">
<div style={{
              width: '100%',
              height: '100%',
              display: 'block',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <GameCanvas
                chosenCreator={creator}
                onGameOver={onGameOver}
              />
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {showScore && gameOver && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-[#35A5F7] to-[#152E92] rounded-3xl p-8 max-w-md w-full mx-4 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>

              <div className="relative z-10 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Game Over!</h2>
                <p className="text-white/80 mb-6">Your score</p>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
                  <div className="text-5xl font-bold text-white mb-1">
                    {gameOver.score}
                  </div>
                  <div className="text-white/70 text-sm">
                    Bubbles Popped: {gameOver.pops}
                  </div>
                  <div className="text-white/70 text-sm">
                    Lives Remaining: {gameOver.lives}
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  <button
                    onClick={handlePlayAgain}
                    className="w-full py-3 bg-white/90 hover:bg-white text-[#152E92] font-bold rounded-xl transition-colors"
                  >
                    Play Again
                  </button>
                  <Link
                    href="/"
                    className="block w-full py-3 bg-transparent hover:bg-white/10 text-white font-bold border border-white/30 rounded-xl transition-colors text-center"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
