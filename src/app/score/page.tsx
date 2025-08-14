'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useNeynarUser } from '@/hooks/useNeynarUser';
import { publishCast } from '@/lib/neynar';

export default function ScorePage() {
  const sp = useSearchParams();
  const router = useRouter();
  const { user } = useNeynarUser();
  const score = useMemo(() => Number(sp.get('s') || 0), [sp]);
  const lives = useMemo(() => Number(sp.get('l') || 0), [sp]);
  const pops = useMemo(() => Number(sp.get('p') || 0), [sp]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="relative w-full max-w-[390px] h-[844px] bg-[#0B3E84] rounded-3xl shadow-2xl overflow-hidden">
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
