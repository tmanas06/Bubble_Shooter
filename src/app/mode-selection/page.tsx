'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useNeynarUser } from '@/hooks/useNeynarUser';

export default function ModeSelection() {
  const router = useRouter();
  const { user } = useNeynarUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Set default creator if not set
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('chosenCreator')) {
      localStorage.setItem('chosenCreator', 'default');
    }
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Hamburger Menu */}
      <div className="absolute top-6 right-6 z-[100]" ref={menuRef}>
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Menu"
          style={{
            backgroundColor: menuOpen ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
          }}
        >
          <div className="w-6 h-6 flex flex-col items-center justify-center">
            <div 
              className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : 'mb-1.5'}`}
            ></div>
            <div 
              className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100 mb-1.5'}`}
            ></div>
            <div 
              className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
            ></div>
          </div>
        </button>
        
        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-lg shadow-xl overflow-hidden border border-white/10 transform transition-all duration-200 origin-top-right">
            <Link 
              href="/profile" 
              className="block px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors border-b border-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              👤 Profile
            </Link>
            <Link 
              href="/leaderboard" 
              className="block px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              🏆 Leaderboard
            </Link>
          </div>
        )}
      </div>

      {/* Main container with exact dimensions */}
      <div className="absolute w-[419px] h-[892px] left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(94.6%_54.54%_at_50%_50%,#35A5F7_0%,#152E92_100%)]">
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
          
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-8">
            <h1 className="text-4xl font-bold text-white mb-12">Choose Your Mode</h1>
            
            <div className="w-full max-w-xs space-y-6">
              {/* Player Button */}
              <button 
                onClick={() => router.push('/game')}
                className="w-full bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">🎮</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Player</h2>
                <p className="text-blue-100 text-sm">Play the game and compete for high scores</p>
              </button>
              
              {/* Creator Button */}
              <button 
                onClick={() => router.push('/creator')}
                className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">✨</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Creator</h2>
                <p className="text-blue-100 text-sm">Create and customize your own levels</p>
              </button>
            </div>
            
            <Link 
              href="/" 
              className="mt-10 text-blue-200 hover:text-white transition-colors flex items-center text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
