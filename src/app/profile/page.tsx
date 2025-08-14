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
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(94.6%_54.54%_at_50%_50%,#35A5F7_0%,#152E92_100%)]">
        {/* Bubble effects matching homepage */}
        <div className="absolute w-[406px] h-[406px] left-[-224px] top-[-159px] bg-gradient-to-b from-[#226ED8] to-[rgba(35,136,242,0)] opacity-70 rounded-full blur-[2.9px]"></div>
        <div className="absolute w-[100px] h-[100px] left-[334px] top-[119px] bg-gradient-to-b from-[rgba(44,155,244,0.28)] to-[rgba(48,158,245,0.098)] backdrop-blur-[13.1px] rounded-full"></div>
        <div className="absolute w-[100px] h-[100px] left-[-21px] top-[580px] bg-gradient-to-b from-[rgba(44,155,244,0.28)] to-[rgba(48,158,245,0.098)] backdrop-blur-[13.1px] rounded-full"></div>
      </div>

      {/* Main container */}
      <div className="absolute w-[419px] h-[892px] left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2">

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
      <div className="relative z-10 h-full flex flex-col items-center px-6 pt-8">
        {/* Profile Picture */}
        <div className="w-32 h-32 rounded-full bg-white/20 border-4 border-white/30 mb-6 overflow-hidden shadow-lg">
          {user?.pfpUrl ? (
            <img 
              src={user.pfpUrl} 
              alt={user.displayName || 'Profile'} 
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
          {user?.displayName || 'Guest'}
        </h1>
        <p className="text-white/70 mb-8">
          @{user?.username || 'anonymous'}
        </p>
        
        {/* Stats */}
        <div className="w-full bg-white/20 backdrop-blur-md rounded-3xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-6">Your Stats</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-white/70 text-sm">High Score</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-white/70 text-sm">Games Played</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-white/70 text-sm">Bubbles Popped</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-white/70 text-sm">Accuracy</p>
              <p className="text-2xl font-bold text-white">0%</p>
            </div>
          </div>
        </div>
        
        {/* Game Settings */}
        <div className="w-full bg-white/20 backdrop-blur-md rounded-3xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Game Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white/90">Sound Effects</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white/90">Music</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
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
          className="mt-auto mb-8 w-full py-4 bg-red-600/90 hover:bg-red-700 text-white font-medium rounded-xl transition-colors shadow-lg"
        >
          Sign Out
        </button>
      </div>
      </div>
    </div>
  );
}
