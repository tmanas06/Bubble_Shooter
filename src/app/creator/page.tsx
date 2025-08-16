'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNeynarUser } from '@/hooks/useNeynarUser';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faCirclePlus, 
  faHome, 
  faGamepad, 
  faTrophy,
  faUser 
} from '@fortawesome/free-solid-svg-icons';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';

export default function CreatorPage() {
  const router = useRouter();
  const { user } = useNeynarUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click (unchanged)
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
      {/* Main container with exact dimensions */}
      <div className="absolute w-[419px] h-[892px] left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(94.6%_54.54%_at_50%_50%,#35A5F7_0%,#152E92_100%)]">
          {/* White panel */}
          <div className="absolute inset-4 rounded-3xl p-6 overflow-hidden">
            {/* Header */}
            <div className="relative z-20 pt-2 px-2">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Creator Dashboard</h1>
                
                {/* Hamburger Menu */}
                <div className="relative" ref={menuRef}>
                  <button 
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
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
                      <div 
                        className="block px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors border-b border-gray-100 cursor-pointer"
                        onClick={() => {
                          router.push('/creator/profile');
                          setMenuOpen(false);
                        }}
                      >
                        👤 Creator Profile
                      </div>
                      <div 
                        className="block px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => {
                          router.push('/creator/leaderboard');
                          setMenuOpen(false);
                        }}
                      >
                        📊 Creator Stats
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Bubble effects */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Row 1 */}
            <div className="absolute w-[123px] h-[123px] left-[48px] top-[281px] bg-gradient-to-b from-[rgba(53,172,254,0.82)] to-[rgba(52,177,252,0.82)] rounded-full blur-[3.65px]"></div>
            <div className="absolute w-[123px] h-[123px] left-[171px] top-[331px] bg-gradient-to-b from-[#35ACFE] to-[#34B1FC] rounded-full blur-[3.65px]"></div>
            <div className="absolute w-[123px] h-[123px] left-[259px] top-[313px] bg-gradient-to-b from-[#35ACFE] to-[#34B1FC] rounded-full blur-[3.65px]"></div>
            
            {/* Row 2 */}
            <div className="absolute w-[123px] h-[123px] left-[5px] top-[351px] bg-gradient-to-b from-[rgba(53,172,254,0.82)] to-[rgba(52,177,252,0.82)] rounded-full blur-[3.65px]"></div>
            <div className="absolute w-[123px] h-[123px] left-[90px] top-[374px] bg-gradient-to-b from-[#35ACFE] to-[#34B1FC] rounded-full blur-[3.65px]"></div>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col w-full h-full">
          {/* Main content area */}
          <div className="flex-1 flex flex-col items-center justify-center px-7 relative z-10">
            {/* Back button */}
            <div className="w-full flex items-center justify-start mb-4">
              <button
                className="text-white text-xl p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
                onClick={() => router.back()}
                aria-label="Back"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
              </button>
            </div>

            {/* Creator content */}
            <div className="w-full max-w-xs bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
              {/* Avatar + Plus */}
              <div className="flex items-center justify-center -mt-12 mb-4">
                <div className="bg-gradient-to-br from-[#35ACFE] to-[#34B1FC] p-1 rounded-full">
                  <div className="bg-white/20 p-3 rounded-full">
                    <FontAwesomeIcon icon={faCirclePlus} className="text-white text-4xl" />
                  </div>
                </div>
              </div>
              
              {/* Heading & subheading */}
              <div className="mb-6 text-center">
                <h1 className="text-white text-2xl font-bold mb-2">Link your Socials</h1>
                <p className="text-blue-100 text-sm">
                  Adding your social accounts makes it easier to get discovered
                </p>
              </div>

              {/* Social cards GRID */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Zora Card */}
                <button className="bg-white/10 hover:bg-white/20 transition-all duration-300 flex flex-col items-center py-4 px-2 rounded-xl shadow-lg border border-white/5 hover:border-white/20">
                  <div className="mb-2 w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <Image
                      src="/assets/zora.png"
                      alt="Zora"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                  <span className="text-white text-sm font-medium">Add Zora</span>
                </button>
                
                {/* X Card */}
                <div className="bg-white/10 backdrop-blur-sm flex flex-col items-center py-4 px-2 rounded-xl shadow-lg border border-white/5">
                  <div className="mb-2 w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faXTwitter} className="text-black text-2xl" />
                  </div>
                  <span className="text-white font-medium text-sm">@bubblebanger</span>
                  <button className="mt-1 text-xs text-blue-200 hover:text-red-400 transition-colors">
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM NAVIGATION *** */}
          <div className="pb-4 px-4">
            <div className="w-full flex justify-around items-center px-8 py-3 bg-white/10 rounded-full shadow-2xl backdrop-blur-lg">
              <button 
                className="flex flex-col items-center text-blue-200 hover:text-white transition-colors"
                onClick={() => router.push('/creator')}
              >
                <FontAwesomeIcon icon={faHome} className="h-6 w-6 mb-1" />
                <span className="text-xs">Home</span>
              </button>
              <button 
                className="flex flex-col items-center text-blue-200 hover:text-white transition-colors"
                onClick={() => router.push('/creator/game')}
              >
                <FontAwesomeIcon icon={faGamepad} className="h-6 w-6 mb-1" />
                <span className="text-xs">Game</span>
              </button>
              <button 
                className="flex flex-col items-center text-blue-200 hover:text-white transition-colors"
                onClick={() => router.push('/creator/leaderboard')}
              >
                <FontAwesomeIcon icon={faTrophy} className="h-6 w-6 mb-1" />
                <span className="text-xs">Stats</span>
              </button>
              <button 
                className="flex flex-col items-center text-blue-200 hover:text-white transition-colors"
                onClick={() => router.push('/creator/profile')}
              >
                <FontAwesomeIcon icon={faUser} className="h-6 w-6 mb-1" />
                <span className="text-xs">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
