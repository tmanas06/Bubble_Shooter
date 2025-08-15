'use client';

import dynamicImport from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, ComponentType } from 'react';
import Link from 'next/link';

const GameCanvas = dynamicImport(
  () => import('@/components/GameCanvas').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-white">Loading game...</div>
      </div>
    )
  }
) as ComponentType<any>;

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
    // Ensure we're on the client side
    setIsClient(true);
    
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const c = localStorage.getItem('chosenCreator') || 'default';
      setCreator(c);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
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

  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B3E84]">
        <div className="text-white">Loading game...</div>
      </div>
    );
  }

  // Ensure creator is always a string
  const gameCreator = creator || 'default';

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0B3E84]">
      {/* Background image container */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="/assets/backgrounds/every.png" 
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Game content container with exact dimensions */}
      <div className="absolute w-[419px] h-[892px] left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 overflow-hidden">
        {/* Game canvas container */}
        <div className="relative w-full h-full">
          {/* Large background bubbles */}
          <div className="absolute w-[406px] h-[406px] left-[-224px] top-[-159px] bg-gradient-to-b from-[#226ED8] to-[rgba(35,136,242,0)] opacity-70 rounded-full blur-[2.9px]"></div>
          
          {/* Top right bubble */}
          <div className="absolute w-[100px] h-[100px] left-[334px] top-[119px] bg-gradient-to-b from-[rgba(44,155,244,0.28)] to-[rgba(48,158,245,0.098)] backdrop-blur-[13.1px] rounded-full"></div>
          
          {/* Bottom left bubble */}
          <div className="absolute w-[100px] h-[100px] left-[-21px] top-[580px] bg-gradient-to-b from-[rgba(44,155,244,0.28)] to-[rgba(48,158,245,0.098)] backdrop-blur-[13.1px] rounded-full"></div>
          
          {/* Bubble cluster */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Row 1 */}
            <div className="absolute w-[123px] h-[123px] left-[48px] top-[281px] bg-gradient-to-b from-[rgba(53,172,254,0.82)] to-[rgba(52,177,252,0.82)] rounded-full blur-[3.65px]"></div>
            <div className="absolute w-[123px] h-[123px] left-[171px] top-[331px] bg-gradient-to-b from-[#35ACFE] to-[#34B1FC] rounded-full blur-[3.65px]"></div>
            <div className="absolute w-[123px] h-[123px] left-[259px] top-[313px] bg-gradient-to-b from-[#35ACFE] to-[#34B1FC] rounded-full blur-[3.65px]"></div>
            
            {/* Row 2 */}
            <div className="absolute w-[123px] h-[123px] left-[5px] top-[351px] bg-gradient-to-b from-[rgba(53,172,254,0.82)] to-[rgba(52,177,252,0.82)] rounded-full blur-[3.65px]"></div>
            <div className="absolute w-[123px] h-[123px] left-[90px] top-[374px] bg-gradient-to-b from-[#35ACFE] to-[#34B1FC] rounded-full blur-[3.65px]"></div>
            
            {/* Row 3 */}
            <div className="absolute w-[123px] h-[123px] left-[97px] top-[412px] bg-gradient-to-b from-[rgba(53,172,254,0.82)] to-[rgba(52,177,252,0.82)] rounded-full blur-[3.65px]"></div>
            <div className="absolute w-[123px] h-[123px] left-[171px] top-[425px] bg-gradient-to-b from-[#35ACFE] to-[#34B1FC] rounded-full blur-[3.65px]"></div>
            <div className="absolute w-[123px] h-[123px] left-[261px] top-[404px] bg-gradient-to-b from-[#35ACFE] to-[#34B1FC] rounded-full blur-[3.65px]"></div>
            
            {/* Bottom row */}
            <div className="absolute w-[123px] h-[123px] left-[17px] top-[404px] bg-gradient-to-b from-[rgba(53,172,254,0.82)] to-[rgba(52,177,252,0.82)] rounded-full blur-[3.65px]"></div>
          </div>

          {/* Game Canvas Container */}
          <div className="relative z-10 w-full h-full overflow-hidden">
            {/* Back Button */}
            <button 
              onClick={() => router.back()}
              className="absolute top-6 left-6 z-20 text-white text-xl font-bold bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-2 transition-colors"
              aria-label="Back to previous page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            
            {creator && (
              <div className="w-full h-full">
                <GameCanvas 
                  key={creator}
                  chosenCreator={creator} 
                  onGameOver={onGameOver} 
                />
              </div>
            )}
          
            {/* Score Dialog */}
            {showScore && gameOver && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-b from-[#35A5F7] to-[#152E92] rounded-3xl p-8 max-w-md w-full mx-4 relative overflow-hidden border-2 border-white/20">
                  {/* Decorative elements */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                  
                  <div className="relative z-10 text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Game Over!</h2>
                    <p className="text-white/80 mb-6">Your score</p>
                    
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
                      <div className="text-5xl font-bold text-white mb-1">{gameOver.score}</div>
                      <div className="text-white/70 text-sm">Bubbles Popped: {gameOver.pops}</div>
                      <div className="text-white/70 text-sm">Lives Remaining: {gameOver.lives}</div>
                    </div>
                    
                    <div className="flex flex-col space-y-3">
                      <button
                        onClick={handlePlayAgain}
                        className="w-full py-3 bg-white/90 hover:bg-white text-[#152E92] font-bold rounded-xl transition-all duration-300 transform hover:scale-105"
                      >
                        Play Again
                      </button>
                      <Link 
                        href="/mode-selection"
                        className="block w-full py-3 bg-transparent hover:bg-white/10 text-white font-bold border border-white/30 rounded-xl transition-all duration-300 transform hover:scale-105 text-center"
                      >
                        Back to Modes
                      </Link>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <p className="text-white/60 text-sm mb-3">Share your score</p>
                      <div className="flex justify-center space-x-4">
                        <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        </button>
                        <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                          </svg>
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
      </div>
  );
}
