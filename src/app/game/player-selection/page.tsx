'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Carousel coins
const coins = [
  { id: 1, name: 'Bubble Coin', image: '/assets/bubbles/bubble1.png' },
  { id: 2, name: 'Silver Coin', image: '/assets/bubbles/bubble2.png' },
  { id: 3, name: 'Gold Coin', image: '/assets/bubbles/bubble3.png' },
];

export default function ModeSelection() {
  const router = useRouter();
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % coins.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    router.push('/game/play');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Main container with exact dimensions matching homepage */}
      <div className="absolute w-[419px] h-[892px] left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2">
        {/* Background image */}
        <div className="absolute inset-0 bg-cover bg-center" 
             style={{ backgroundImage: "url('/assets/backgrounds/screen.png')" }}>
          {/* White panel */}
          <div className="absolute inset-4 rounded-3xl p-6 overflow-hidden">
            {/* Custom scroll/card image background */}
            <Image
              src="/assets/coins/image.png"
              alt="Card background"
              fill
              className="absolute -top-10 left-0 w-full h-full object-contain z-0 select-none pointer-events-none"
              style={{ borderRadius: '1.5rem' }}
            />

            {/* Card content - centered in the white panel */}
            <div className="relative w-full h-full flex flex-col items-center justify-center z-10 px-5 pt-16 pb-8">
          {/* Banner */}
          {/* <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-400 rounded-b-xl px-7 py-2 drop-shadow font-bold text-white text-base tracking-wide"
            style={{ letterSpacing: '0.05em' }}>
            Coins
          </div> */}
          
          {/* Carousel */}
          <div className="mb-8 mt-12 flex items-center justify-center h-20 w-full overflow-hidden">
            <div className="relative w-32 h-20 flex items-center justify-center">
              {coins.map((coin, i) => (
                <Image
                  key={coin.id}
                  src={coin.image}
                  alt={coin.name}
                  width={60}
                  height={60}
                  className={`absolute transition-all duration-700 ${
                    i === carouselIndex
                      ? 'opacity-100 scale-110 z-10'
                      : 'opacity-20 scale-90 z-0'
                  } left-1/2 -translate-x-1/2`}
                />
              ))}
            </div>
          </div>

          {/* Play & Earn */}
          {/* <div className="w-full bg-white bg-opacity-75 rounded-xl py-6 mb-6 flex flex-col items-center shadow">
            <div className="text-xl font-semibold text-[#414141] mb-1 text-center">
              Play & earn
            </div>
            <div className="text-xs text-[#8b8b8b] text-center mt-2">
              earn &amp; creator token
            </div>
          </div> */}

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="mt-2 w-40 py-3 bg-gradient-to-r from-[#35A5F7] to-[#152E92] text-white text-xl font-extrabold rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            START
          </button>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
