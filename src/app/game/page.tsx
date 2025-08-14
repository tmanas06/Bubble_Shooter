'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

const GameCanvas = dynamic(() => import('@/components/GameCanvas'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-white">Loading game...</div>
    </div>
  )
});

interface GameOverParams {
  score: number;
  lives: number;
  pops: number;
}

export default function GamePage() {
  const router = useRouter();
  const [creator, setCreator] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameOver, setGameOver] = useState<GameOverParams | null>(null);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    // Default to a creator if none is set
    const c = localStorage.getItem('chosenCreator') || 'default';
    setCreator(c);
    setIsLoading(false);
  }, []);

  const onGameOver = useCallback(({ score, lives = 0, pops = 0 }: GameOverParams) => {
    setGameOver({ score, lives, pops });
    setShowScore(true);
  }, []);

  const handlePlayAgain = useCallback(() => {
    setShowScore(false);
    setGameOver(null);
    // Reset game by forcing a re-render with a new key
    setCreator(prev => prev);
  }, []);

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
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background gradient matching homepage */}
      <div className="absolute inset-0 bg-[radial-gradient(94.6%_54.54%_at_50%_50%,#35A5F7_0%,#152E92_100%)]">
        {/* Bubble effects matching homepage */}
        <div className="absolute w-[406px] h-[406px] left-[-224px] top-[-159px] bg-gradient-to-b from-[#226ED8] to-[rgba(35,136,242,0)] opacity-70 rounded-full blur-[2.9px]"></div>
        <div className="absolute w-[100px] h-[100px] left-[334px] top-[119px] bg-gradient-to-b from-[rgba(44,155,244,0.28)] to-[rgba(48,158,245,0.098)] backdrop-blur-[13.1px] rounded-full"></div>
        <div className="absolute w-[100px] h-[100px] left-[-21px] top-[580px] bg-gradient-to-b from-[rgba(44,155,244,0.28)] to-[rgba(48,158,245,0.098)] backdrop-blur-[13.1px] rounded-full"></div>
      </div>

      {/* Main container */}
      <div className="absolute w-[419px] h-[892px] left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2">
        {/* Game Canvas Container */}
        <div className="relative w-full h-full overflow-hidden">
          {creator && <GameCanvas chosenCreator={creator} onGameOver={onGameOver} />}
          
          {/* Back Button */}
          <button 
            onClick={() => router.back()}
            className="absolute top-6 left-6 z-20 text-white text-2xl font-bold"
          >
            ← Back
          </button>
          
          {/* Score Dialog */}
          {showScore && gameOver && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-gradient-to-b from-[#35A5F7] to-[#152E92] rounded-3xl p-8 max-w-md w-full mx-4 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                
                <div className="relative z-10 text-center">
                  <h2 className="text-3xl font-bold text-white mb-2">Game Over!</h2>
                  <p className="text-white/80 mb-6">Your score</p>
                  
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
                    <div className="text-5xl font-bold text-white mb-1">{gameOver.score}</div>
                    <div className="text-white/70 text-sm">Bubbles Popped: {gameOver.pops}</div>
                    <div className="text-white/70 text-sm">Lives Remaining: {gameOver.lives}</div>
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
                  
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-white/60 text-sm">Share your score</p>
                    <div className="flex justify-center space-x-4 mt-3">
                      <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                        <span className="text-white">X</span>
                      </button>
                      <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                        <span className="text-white">F</span>
                      </button>
                      <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                        <span className="text-white">T</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
