'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleStart = () => {
    // Set a default creator if none exists
    if (typeof window !== 'undefined' && !localStorage.getItem('chosenCreator')) {
      localStorage.setItem('chosenCreator', 'default');
    }
    router.push('/game');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Main container with exact dimensions */}
      <div className="absolute w-[419px] h-[892px] left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2">
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
          
          {/* Bottom large bubble */}
          <div className="absolute w-[406px] h-[406px] left-[17px] top-[713px] bg-gradient-to-b from-[#226ED8] to-[rgba(35,136,242,0)] rounded-full blur-[2.9px]">
            
            {/* Bubble Group 36 */}
            <div className="absolute w-[79px] h-[80.81px] left-[-6px] top-[61px] transform rotate-[-29.11deg]">
              <img src="/assets/bubbles/bubble1.png" alt="" className="w-full h-full object-contain" />
            </div>
            
            {/* Bubble Group 40 */}
            <div className="absolute w-[79px] h-[80.81px] left-[316px] top-[69px] transform rotate-[13.04deg]">
              <img src="/assets/bubbles/bubble2.png" alt="" className="w-full h-full object-contain" />
            </div>
            
            {/* Bubble Group 41 */}
            <div className="absolute w-[79px] h-[80.81px] left-[204.27px] top-[-0.56px] transform rotate-[84.67deg]">
              <img src="/assets/bubbles/bubble3.png" alt="" className="w-full h-full object-contain" />
            </div>
            
            {/* Bubble Group 38 */}
            <div className="absolute w-[79px] h-[78.4px] left-[242px] top-[84px]">
              <img src="/assets/bubbles/bubble4.png" alt="" className="w-full h-full object-contain" />
            </div>
            
            {/* Bubble Group 43 */}
            <div className="absolute w-[79px] h-[78.4px] left-[32px] top-[8px]">
              <img src="/assets/bubbles/bubble1.png" alt="" className="w-full h-full object-contain" />
            </div>
            
            {/* Bubble Group 39 */}
            <div className="absolute w-[81px] h-[81px] left-[62px] top-[61px] transform rotate-[121.87deg]">
              <img src="/assets/bubbles/bubble2.png" alt="" className="w-full h-full object-contain" />
            </div>
            
            {/* Bubble Group 37 */}
            <div className="absolute w-[95px] h-[95px] left-[130px] top-[58px] transform rotate-[21.3deg]">
              <img src="/assets/bubbles/bubble3.png" alt="" className="w-full h-full object-contain" />
            </div>
            
            {/* Bubble Group 42 */}
            <div className="absolute w-[95px] h-[95px] left-[76px] top-[-15px] transform rotate-[21.3deg]">
              <img src="/assets/bubbles/bubble4.png" alt="" className="w-full h-full object-contain" />
            </div>
            
          </div>
        </div>

        {/* Name image */}
        <div className="absolute w-[378px] h-[202.73px] left-1/2 -translate-x-1/2 top-[324px]">
          <img 
            src="/assets/prop/name.png" 
            alt="Bubble Shooter" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Start button */}
        <button 
          onClick={handleStart}
          className="absolute left-1/2 -translate-x-1/2 bottom-[100px] px-12 py-4 bg-white text-[#0B3E84] text-xl font-bold rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
