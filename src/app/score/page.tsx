'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useRef } from 'react';
import Image from 'next/image';
import { useNeynarUser } from '@/hooks/useNeynarUser';
import { publishCast } from '@/lib/neynar';
import Link from 'next/link';

export default function ScorePage() {
  const sp = useSearchParams();
  const router = useRouter();
  const { user } = useNeynarUser();
  const score = useMemo(() => Number(sp.get('s') || 0), [sp]);
  const lives = useMemo(() => Number(sp.get('l') || 0), [sp]);
  const pops = useMemo(() => Number(sp.get('p') || 0), [sp]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
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

  const save = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fid: user.fid,
          username: user.username,
          score,
          pops,
          livesUsed: Math.max(0, 5 - lives)
        })
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const share = async () => {
    const text = `I scored ${score} in Bubble Shooters `;
    try { 
      // TODO: Get signerUuid from user context or configuration
      const signerUuid = process.env.NEXT_PUBLIC_NEYNAR_SIGNER_UUID || '';
      if (signerUuid) {
        await publishCast(signerUuid, text);
      }
    } catch (error) {
      console.error('Failed to publish cast:', error);
    }
  };

  return (
    <div className="relative min-h-screen p-4 bg-[#0B3E84] flex items-center justify-center">
      <div className="relative w-full max-w-[390px] h-[844px] bg-[#0B3E84] rounded-3xl shadow-2xl overflow-hidden">
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
        
        <div className="absolute inset-0 p-6 flex flex-col items-center">
          <div className="mt-10 text-white text-2xl font-bold">Score</div>
          <div className="mt-4 text-white/90 text-5xl font-extrabold">{score}</div>
          
          <div className="mt-8 w-full">
            <div className="flex justify-between text-white/80 mb-2">
              <span>Bubbles Popped:</span>
              <span className="font-semibold">{pops}</span>
            </div>
            <div className="flex justify-between text-white/80 mb-6">
              <span>Lives Remaining:</span>
              <span className="font-semibold">{lives}</span>
            </div>
          </div>

          <div className="mt-auto w-full space-y-4">
            {user && (
              <button
                onClick={save}
                disabled={saving || saved}
                className="w-full py-3 rounded-full bg-white/90 text-[#0B3E84] font-semibold disabled:opacity-50 hover:bg-white transition-colors"
              >
                {saving ? 'Saving...' : saved ? 'Score Saved!' : 'Save Score'}
              </button>
            )}
            
            <button
              onClick={share}
              className="w-full py-3 rounded-full border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Share on Farcaster
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 text-white/80 hover:text-white transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
