'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const gameModes = [
  {
    id: 'single',
    title: 'Single Player',
    description: 'Play solo and beat your high score',
    icon: '👤',
    path: '/game/player-selection'
  },
  {
    id: 'multiplayer',
    title: 'Multiplayer',
    description: 'Challenge friends in real-time',
    icon: '👥',
    comingSoon: true
  },
  {
    id: 'tournament',
    title: 'Tournament',
    description: 'Compete in daily challenges',
    icon: '🏆',
    comingSoon: true
  }
];

export default function ModeSelection() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0B3E84] to-[#051C3F] p-4">
      <div className="w-full max-w-md relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute w-full h-full bg-gradient-to-b from-blue-900/90 to-blue-950/90 backdrop-blur-sm"></div>
          
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-800 rounded-full mix-blend-screen opacity-30"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-700 rounded-full mix-blend-screen opacity-20"></div>
          
          {/* Roll container */}
          <div className="absolute w-[327px] h-[290px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm rounded-2xl border border-blue-400/20"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Select Game Mode</h1>
            <p className="text-blue-200">Choose how you want to play</p>
          </div>
          
          <div className="space-y-4 mb-8">
            {gameModes.map((mode) => (
              <div 
                key={mode.id}
                className={`p-5 rounded-2xl transition-all duration-200 ${
                  mode.comingSoon 
                    ? 'bg-white/5 border border-dashed border-white/10 cursor-not-allowed' 
                    : 'bg-white/10 hover:bg-white/20 cursor-pointer border border-transparent hover:border-blue-400/30'
                }`}
                onClick={() => !mode.comingSoon && router.push(mode.path as string)}
              >
                <div className="flex items-center">
                  <div className="text-3xl mr-4">{mode.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">
                      {mode.title}
                      {mode.comingSoon && (
                        <span className="ml-2 text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </h3>
                    <p className="text-blue-200 text-sm">{mode.description}</p>
                  </div>
                  {!mode.comingSoon && (
                    <div className="text-blue-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-300 hover:text-white text-sm"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
