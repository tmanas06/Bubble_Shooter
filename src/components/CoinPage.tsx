import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CoinPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-white via-white to-[#060924] relative overflow-hidden">
      {/* Black Diagonal Background Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '-30%',
          left: '65%',
          width: '160%',
          height: '80%',
          transform: 'rotate(25deg)',
          background: 'linear-gradient(180deg, #1c2040 40%, #000 100%)',
          zIndex: 0,
        }}
      />

      <div className="card-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="ribbon">Coins</div>
        <div className="game-box">
          <div className="game-title">BUBBLE POP</div>
          <div className="game-desc">Play &amp; Earn</div>
          <div className="game-note">*earn 6 creator tokens</div>

          <div className="mt-8 flex justify-center">
            <div className="relative w-40 h-40">
              <Image
                src="/assets/bubbles/bubble1.png"
                alt="Coin"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        </div>

        <Link href="/game/player-selection" passHref>
          <button className="start-btn">START</button>
        </Link>

        <div className="card-bottom"></div>
      </div>

      <style jsx>{`
        .card-container {
          background: #fbeedc;
          border-radius: 35px 35px 40px 40px;
          box-shadow: 0 3px 20px rgba(45,25,5,0.10);
          max-width: 350px;
          margin: 120px auto 0 auto;
          padding: 36px 0 24px 0;
          position: relative;
          text-align: center;
        }
        .ribbon {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: #3395ff;
          color: #fff;
          padding: 14px 48px;
          font-size: 26px;
          font-weight: 700;
          border-radius: 10px 10px 20px 20px;
          box-shadow: 0 2px 10px rgba(45,25,5,0.10);
          border: 2px solid #2b63bc;
          letter-spacing: .04em;
        }
        .game-box {
          background: #f9eddc;
          border-radius: 20px 20px 28px 28px;
          box-shadow: 0 2px 6px rgba(45,25,5,0.07);
          padding: 26px 18px 18px 18px;
          margin: 40px auto 0 auto;
          width: 80%;
        }
        .game-title {
          font-size: 26px;
          font-weight: 700;
          color: #dbd1c2;
          letter-spacing: .04em;
          margin-bottom: 8px;
          filter: blur(2px);
        }
        .game-desc {
          font-size: 20px;
          color: #1e2040;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .game-note {
          font-size: 15px;
          color: #95a0b7;
          font-weight: 400;
        }
        .start-btn {
          background: linear-gradient(180deg, #45aaff 80%, #235cd7 100%);
          color: #fff;
          border: none;
          border-radius: 30px;
          padding: 20px 50px;
          font-size: 28px;
          font-weight: bold;
          margin-top: 30px;
          box-shadow: 0 4px 17px rgba(60,90,190,.12);
          cursor: pointer;
          transition: background .2s;
          letter-spacing: .06em;
        }
        .start-btn:hover {
          background: linear-gradient(180deg, #23a5ff 80%, #1647ad 100%);
        }
        .card-bottom {
          position: absolute;
          bottom: -20px;
          left: 0;
          width: 100%;
          height: 38px;
          background: #fbeedc;
          border-radius: 0 0 40px 40px;
          box-shadow: 0 3px 10px rgba(45,25,5,0.1);
        }
      `}</style>
    </div>
  );
};

export default CoinPage;
