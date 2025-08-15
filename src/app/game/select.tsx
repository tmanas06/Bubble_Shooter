'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useNeynarUser } from '@/hooks/useNeynarUser';

const creators = [
  { key: 'alpha', name: 'Alpha' },
  { key: 'bravo', name: 'Bravo' },
  { key: 'charlie', name: 'Charlie' },
  { key: 'delta', name: 'Delta' }
];

export default function Select() {
  const router = useRouter();
  const { user } = useNeynarUser();
  const [chosen, setChosen] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('chosenCreator');
    if (saved) setChosen(saved);
  }, []);

  const start = () => {
    if (!chosen) return;
    localStorage.setItem('chosenCreator', chosen);
    router.push('/game');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0B3E84]">
      <div className="w-[390px] h-[844px] relative overflow-hidden rounded-3xl shadow-2xl">
        <Image src="/assets/backgrounds/screen.png" alt="bg" fill className="object-cover" />
        <div className="absolute inset-0 p-6 flex flex-col gap-4">
          <div className="mx-auto mt-4 text-white text-xl font-semibold">Choose a creator</div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {creators.map(c => (
              <button
                key={c.key}
                onClick={() => setChosen(c.key)}
                className={`rounded-2xl p-3 bg-white/90 flex items-center gap-3 ${chosen===c.key?'ring-4 ring-yellow-400':''}`}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                <div className="text-left">
                  <div className="text-[#0B3E84] font-semibold">{c.name}</div>
                  <div className="text-xs text-[#0B3E84]/70">Tap to select</div>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-auto flex flex-col items-center gap-3 pb-6">
            <div className="text-white/80 text-sm">{user?.username ? `Signed in as @${user.username}` : 'Not signed in'}</div>
            <button onClick={start} className="px-8 py-3 rounded-full bg-white text-[#0B3E84] font-semibold">Start</button>
          </div>
        </div>
      </div>
    </main>
  );
}
