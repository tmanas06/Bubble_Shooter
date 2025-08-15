'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50" ref={menuRef}>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors"
        aria-label="Menu"
      >
        <div className="w-6 flex flex-col space-y-1.5">
          <span className={`h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`h-0.5 bg-white transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden">
          <nav className="py-2">
            <Link 
              href="/" 
              className="block px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/game" 
              className="block px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              New Game
            </Link>
            <Link 
              href="/profile" 
              className="block px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            <div className="border-t border-gray-200 my-1"></div>
            <Link 
              href="/leaderboard" 
              className="block px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Leaderboard
            </Link>
            <Link 
              href="/about" 
              className="block px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
