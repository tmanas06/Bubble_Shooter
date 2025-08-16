'use client';
import { createPlayScene } from './scenes/PlayScene';
import React, { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';

type Props = {
  chosenCreator: string;
  onGameOver: (p: { score: number; lives: number; pops: number }) => void;
  playerId?: string;
};

export default function GameCanvas({ chosenCreator, onGameOver, playerId = '1' }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (typeof Phaser === 'undefined') return;

    const container = ref.current;
    const { clientWidth, clientHeight } = container;

    const scene = createPlayScene(chosenCreator, onGameOver, playerId);
    if (!scene) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: clientWidth,
      height: clientHeight,
      parent: container,
      backgroundColor: '#000000',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: clientWidth,
        height: clientHeight,
      },
      physics: {
        default: 'arcade',
        arcade: { debug: false },
      },
      scene: [scene],
    };

    gameRef.current = new Phaser.Game(config);

    // Listen for container resize
    const resizeObserver = new ResizeObserver(() => {
      if (gameRef.current) {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        gameRef.current.scale.resize(newWidth, newHeight);
      }
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [chosenCreator, onGameOver, playerId]);

  return (
    <div className="w-full h-full">
      <div
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          position: 'relative',
        }}
        id="phaser-container"
      />
    </div>
  );
}
