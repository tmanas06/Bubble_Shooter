'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNeynarUser } from '@/hooks/useNeynarUser';
import { useEffect, useRef, useState } from 'react';

// Hardcoded leaderboard data
const leaderboardData = [
  { id: 1, username: 'vitalik.eth', score: 1280, pfp: '/assets/leaderboard/1.png' },
  { id: 2, username: 'farcaster', score: 980, pfp: '/assets/leaderboard/2.png' },
  { id: 3, username: 'dwr.eth', score: 845, pfp: '/assets/leaderboard/3.png' },
  { id: 4, username: 'danromero', score: 720, pfp: '/assets/leaderboard/4.png' },
  { id: 5, username: 'jessepollak', score: 680, pfp: '/assets/leaderboard/5.png' },
  { id: 6, username: 'greg', score: 540, pfp: '/assets/leaderboard/6.png' },
  { id: 7, username: 'varunsrin', score: 490, pfp: '/assets/leaderboard/7.png' },
  { id: 8, username: 'brianobush', score: 420, pfp: '/assets/leaderboard/8.png' },
  { id: 9, username: 'alex', score: 380, pfp: '/assets/leaderboard/9.png' },
  { id: 10, username: 'sarah', score: 350, pfp: '/assets/leaderboard/10.png' },
];

export default function Leaderboard() {
  const router = useRouter();
  const { user } = useNeynarUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userRank = 4; // Hardcoded user rank for demo

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
              href="/" 
              className="block px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              🏠 Home
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
        </div>

        {/* Leaderboard content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="pt-16 px-8">
            <Link href="/" className="text-white text-2xl font-bold mb-6 inline-block">
              ← Back
            </Link>
            <h1 className="text-white text-3xl font-bold mb-8">Leaderboard</h1>
          </div>

          {/* Leaderboard list */}
          <div className="flex-1 overflow-y-auto px-6 pb-24">
            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6">
              {/* Top 3 */}
              <div className="flex justify-center items-end mb-8 -mt-4">
                {/* 2nd place */}
                <div className="flex flex-col items-center mx-1">
                  <div className="w-16 h-16 rounded-full bg-white/20 mb-2 flex items-center justify-center text-white font-bold text-xl">2</div>
                  <div className="w-20 h-20 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-t-lg flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/50"></div>
                  </div>
                  <span className="text-white text-sm mt-2">@farcaster</span>
                  <span className="text-white font-bold">980</span>
                </div>
                
                {/* 1st place */}
                <div className="flex flex-col items-center mx-2">
                  <div className="w-20 h-20 rounded-full bg-white/20 mb-2 flex items-center justify-center text-white font-bold text-2xl">1</div>
                  <div className="w-24 h-28 bg-gradient-to-b from-gray-300 to-gray-500 rounded-t-lg flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/50"></div>
                  </div>
                  <span className="text-white text-sm mt-2">@vitalik.eth</span>
                  <span className="text-white font-bold">1280</span>
                </div>
                
                {/* 3rd place */}
                <div className="flex flex-col items-center mx-1">
                  <div className="w-14 h-14 rounded-full bg-white/20 mb-2 flex items-center justify-center text-white font-bold text-lg">3</div>
                  <div className="w-16 h-16 bg-gradient-to-b from-amber-700 to-amber-900 rounded-t-lg flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/50"></div>
                  </div>
                  <span className="text-white text-sm mt-2">@dwr.eth</span>
                  <span className="text-white font-bold">845</span>
                </div>
              </div>

              {/* Leaderboard entries */}
              <div className="space-y-2">
                {leaderboardData.slice(3).map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`flex items-center justify-between py-3 px-4 rounded-xl ${index === userRank - 4 ? 'bg-white/30' : 'bg-white/20'} backdrop-blur-sm`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 text-center font-bold ${index === userRank - 4 ? 'text-white' : 'text-white/70'}`}>
                        {index + 4}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/30 ml-3 overflow-hidden">
                        <img 
                          src={item.pfp} 
                          alt={item.username} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/default-avatar.png';
                          }}
                        />
                      </div>
                      <span className={`ml-3 font-medium ${index === userRank - 4 ? 'text-white' : 'text-white/90'}`}>
                        {item.username}
                        {index === userRank - 4 && (
                          <span className="ml-2 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">You</span>
                        )}
                      </span>
                    </div>
                    <div className={`font-bold ${index === userRank - 4 ? 'text-white' : 'text-white/90'}`}>
                      {item.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
