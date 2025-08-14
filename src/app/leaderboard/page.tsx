'use client';

import useSWR from 'swr';
import Image from 'next/image';

const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function Leaderboard() {
  const { data } = useSWR('/api/scores', fetcher, { refreshInterval: 10000 });

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0B3E84]">
      <div className="w-[390px] h-[844px] relative overflow-hidden rounded-3xl shadow-2xl">
        <Image src="/assets/backgrounds/every.png" alt="bg" fill className="object-cover" />
        <div className="absolute inset-0 p-6">
          <div className="text-white text-2xl font-bold mt-4">Leaderboard</div>
          <div className="mt-4 flex flex-col gap-3">
            {(data?.items||[]).map((row: any, i: number) => (
              <div key={row.fid} className="flex items-center justify-between bg-white/90 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 text-[#0B3E84] font-bold">{i+1}</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                  <div className="text-[#0B3E84] font-semibold">@{row.username}</div>
                </div>
                <div className="text-[#0B3E84] font-extrabold">{row.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
