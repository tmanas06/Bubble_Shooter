'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNeynarUser } from '@/hooks/useNeynarUser';
import { useEffect, useRef, useState } from 'react';

export default function HomePage() {
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

  const handleStart = () => {
    // Set a default creator if none exists
    if (typeof window !== 'undefined' && !localStorage.getItem('chosenCreator')) {
      localStorage.setItem('chosenCreator', 'default');
    }
    router.push('/mode-selection');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Main container with exact dimensions */}
      <div className="absolute w-[419px] h-[892px] left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(94.6%_54.54%_at_50%_50%,#35A5F7_0%,#152E92_100%)]">
          {/* White panel */}
          <div className="absolute inset-4 rounded-3xl p-6 overflow-hidden">
            {/* Header */}
            <div className="relative z-20 pt-6 px-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800"></h1>
                
                {/* Hamburger Menu */}
                <div className="relative" ref={menuRef}>
                  <button 
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="absolute top-4 right-6 z-50 p-2 rounded-full hover:bg-gray-200 transition-colors"
                    aria-label="Menu"
                    style={{
                      backgroundColor: menuOpen ? 'rgba(0, 0, 0, 0.1)' : 'transparent'
                    }}
                  >
                    <div className="w-6 h-6 flex flex-col items-center justify-center">
                      <div className={`w-5 h-0.5 bg-gray-800 rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : 'mb-1.5'}`}></div>
                      <div className={`w-5 h-0.5 bg-gray-800 rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100 mb-1.5'}`}></div>
                      <div className={`w-5 h-0.5 bg-gray-800 rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
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
              </div>
            </div>
          </div>
          
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
          
          {/* Bottom large bubble */}
          <div className="absolute w-[406px] h-[406px] left-[17px] top-[713px] bg-gradient-to-b from-[#226ED8] to-[rgba(35,136,242,0)] rounded-full blur-[2.9px]">
            
            {/* Bubble Group 36 */}
            <div className="absolute w-[79px] h-[80.81px] left-[-6px] top-[61px] transform rotate-[-29.11deg]">
              <img src="/assets/bubbles/bubble1.png" alt="" className="w-full h-full object-contain" />
            </div>
            
            {/* Bubble Group 40 */}
            <div className="absolute w-[79px] h-[80.81px] left-[316px] top-[69px] transform rotate-[13.04deg]">
              <img src="/assets/bubbles/bubble2.png" alt="" className="w-full h-full object-contain" />
            </div>
            
            {/* Bubble Group 41 */}
            <div className="absolute w-[79px] h-[80.81px] left-[204.27px] top-[-0.56px] transform rotate-[84.67deg]">
              <img src="/assets/bubbles/bubble3.png" alt="" className="w-full h-full object-contain" />
            </div>
            
            {/* Bubble Group 38 */}
            <div className="absolute w-[79px] h-[78.4px] left-[242px] top-[84px]">
              <img src="/assets/bubbles/bubble4.png" alt="" className="w-full h-full object-contain" />
            </div>
            
            {/* Bubble Group 43 */}
            <div className="absolute w-[79px] h-[78.4px] left-[32px] top-[8px]">
              <img src="/assets/bubbles/bubble1.png" alt="" className="w-full h-full object-contain" />
            </div>
            
            {/* Bubble Group 39 */}
            <div className="absolute w-[81px] h-[81px] left-[62px] top-[61px] transform rotate-[121.87deg]">
              <img src="/assets/bubbles/bubble2.png" alt="" className="w-full h-full object-contain" />
            </div>
            
            {/* Bubble Group 37 */}
            <div className="absolute w-[95px] h-[95px] left-[130px] top-[58px] transform rotate-[21.3deg]">
              <img src="/assets/bubbles/bubble3.png" alt="" className="w-full h-full object-contain" />
            </div>
            
            {/* Bubble Group 42 */}
            <div className="absolute w-[95px] h-[95px] left-[76px] top-[-15px] transform rotate-[21.3deg]">
              <img src="/assets/bubbles/bubble4.png" alt="" className="w-full h-full object-contain" />
            </div>
            
          </div>
        </div>

        {/* Name image */}
        <div className="absolute w-[378px] h-[202.73px] left-1/2 -translate-x-1/2 top-[324px]">
          <img 
            src="/assets/prop/name.png" 
            alt="Bubble Shooter" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Start button */}
        <button 
          onClick={handleStart}
          className="absolute left-1/2 -translate-x-1/2 bottom-[100px] px-12 py-4 bg-white text-[#0B3E84] text-xl font-bold rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
