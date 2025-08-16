'use client';

import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShare, faEllipsisVertical, faHome, faGamepad, faTrophy, faUser } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';
import Image from 'next/image';
import { useNeynarUser } from '@/hooks/useNeynarUser';

export default function CreatorProfilePage() {
  const router = useRouter();
  const { user } = useNeynarUser();

  // Mock data - replace with actual data from your backend
  const creatorStats = {
    gamesPlayed: 128,
    highScore: 2450,
    totalEarned: 1250,
    topRank: 5
  };

  const recentGames = [
    { id: 1, score: 2450, date: '2023-06-15' },
    { id: 2, score: 1980, date: '2023-06-14' },
    { id: 3, score: 2100, date: '2023-06-13' },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-[#0A1C3A] to-[#0F2D5C]">
      {/* Main container with exact dimensions */}
      <div className="absolute w-[419px] h-[892px] left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 overflow-hidden">
        {/* Header */}
        <div className="relative z-20 pt-6 px-6 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-white" />
          </button>
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
              <FontAwesomeIcon icon={faShare} className="text-white" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
              <FontAwesomeIcon icon={faEllipsisVertical} className="text-white" />
            </button>
          </div>
        </div>

        {/* Profile Section */}
        <div className="relative z-10 flex flex-col items-center mt-6 px-6">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#35ACFE] to-[#34B1FC] p-0.5">
              <div className="w-full h-full rounded-full bg-gray-800 overflow-hidden flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {user?.username?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-500 border-2 border-[#0A1C3A] flex items-center justify-center">
              <span className="text-xs font-bold text-white">1</span>
            </div>
          </div>

          {/* Name and Username */}
          <h1 className="text-2xl font-bold text-white">
            {user?.username || 'Creator'}
          </h1>
          <p className="text-blue-300 text-sm mb-4">
            @{user?.username || 'creator'}
          </p>

          {/* Social Links */}
          <div className="flex gap-4 mb-6">
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              <FontAwesomeIcon icon={faTwitter} className="h-5 w-5" />
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              <FontAwesomeIcon icon={faInstagram} className="h-5 w-5" />
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              <FontAwesomeIcon icon={faTiktok} className="h-5 w-5" />
            </a>
          </div>

          {/* Stats */}
          <div className="w-full bg-white/5 rounded-2xl p-4 mb-6 backdrop-blur-md">
            <div className="grid grid-cols-2 gap-4">
              <StatItem value={creatorStats.gamesPlayed} label="Games Played" />
              <StatItem value={creatorStats.highScore} label="High Score" />
              <StatItem value={`$${creatorStats.totalEarned}`} label="Total Earned" />
              <StatItem value={`#${creatorStats.topRank}`} label="Top Rank" />
            </div>
          </div>
        </div>

        {/* Recent Games */}
        <div className="px-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Games</h2>
          <div className="space-y-3">
            {recentGames.map((game) => (
              <div key={game.id} className="bg-white/5 rounded-xl p-4 backdrop-blur-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-medium">Game #{game.id}</h3>
                    <p className="text-blue-300 text-sm">{new Date(game.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 font-bold text-lg">{game.score}</p>
                    <p className="text-blue-300 text-sm">Score</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 pb-6 px-6">
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
              className="flex flex-col items-center text-white"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#35ACFE] to-[#34B1FC] rounded-full flex items-center justify-center -mt-4">
                <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
              </div>
              <span className="text-xs mt-1">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for stats
function StatItem({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-white font-bold text-xl">{value}</p>
      <p className="text-blue-300 text-xs">{label}</p>
    </div>
  );
}
