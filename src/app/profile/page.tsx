'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNeynarUser } from '@/hooks/useNeynarUser';
import { useEffect, useRef, useState } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut } = useNeynarUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('stats');

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

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0B3E84] overflow-x-hidden">
      {/* Background image container */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="/assets/backgrounds/every.png" 
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Main container with responsive dimensions */}
      <div className="relative w-full max-w-[419px] min-h-screen mx-auto">
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

        {/* Header */}
        <div className="relative z-20 pt-6 px-6">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => router.back()} 
              className="text-white text-2xl font-bold"
            >
              ← Back
            </button>
            
            {/* Hamburger Menu */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Menu"
                style={{
                  backgroundColor: menuOpen ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
                }}
              >
                <div className="w-6 h-6 flex flex-col items-center justify-center">
                  <div className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : 'mb-1.5'}`}></div>
                  <div className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100 mb-1.5'}`}></div>
                  <div className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
                </div>
              </button>
              
              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-lg shadow-xl overflow-hidden border border-white/10 transform transition-all duration-200 origin-top-right">
                  <Link 
                    href="/leaderboard" 
                    className="block px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors border-b border-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    🏆 Leaderboard
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-gray-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Profile Content */}
      <div className="relative z-10 pb-8 px-6 pt-4">
        <div className="max-w-full flex flex-col items-center space-y-6">
        {/* Profile Card */}
        <div className="w-full bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6 border border-white/20 shadow-xl">
          <div className="flex flex-col items-center">
            {/* Profile Picture */}
            <div className="w-32 h-32 rounded-full bg-white/20 border-4 border-white/30 mb-6 overflow-hidden shadow-lg">
              {user?.pfpUrl ? (
                <img 
                  src={user.pfpUrl} 
                  alt={user.username || 'Profile'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-white/50">
                  👤
                </div>
              )}
            </div>
            
            {/* User Info */}
            <h1 className="text-2xl font-bold text-white mb-1">
              {user?.username || 'Guest'}
            </h1>
            <p className="text-white/70 mb-6">
              @{user?.username || 'anonymous'}
            </p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="w-full bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6 border border-white/20 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6 text-center">Your Stats</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10 hover:bg-white/10 transition-colors">
              <p className="text-white/70 text-sm mb-1">High Score</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10 hover:bg-white/10 transition-colors">
              <p className="text-white/70 text-sm mb-1">Games Played</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10 hover:bg-white/10 transition-colors">
              <p className="text-white/70 text-sm mb-1">Bubbles Popped</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10 hover:bg-white/10 transition-colors">
              <p className="text-white/70 text-sm mb-1">Accuracy</p>
              <p className="text-2xl font-bold text-white">0%</p>
            </div>
          </div>
        </div>
        
        {/* Game Settings */}
        <div className="w-full bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6 border border-white/20 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6 text-center">Game Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/10">
              <span className="text-white/90">Sound Effects</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/10">
              <span className="text-white/90">Music</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/10">
              <span className="text-white/90">Vibration</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="mt-auto mb-8 w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg"
        >
          Sign Out
        </button>
      </div>
      </div>
      </div>
    </div>
  );
}
