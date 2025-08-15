'use client';
import { createPlayScene } from './scenes/PlayScene';
import React, { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';

type Props = {
  chosenCreator: string;
  onGameOver: (p: { score: number; lives: number; pops: number }) => void;
};

export default function GameCanvas({ chosenCreator, onGameOver }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  
  useEffect(() => {
    console.log('GameCanvas useEffect triggered');
    console.log('ref.current:', ref.current);
    console.log('chosenCreator:', chosenCreator);
    console.log('Phaser available:', typeof Phaser !== 'undefined');
    
    if (!ref.current) {
      console.log('No ref.current, returning');
      return;
    }
    
    if (typeof Phaser === 'undefined') {
      console.error('Phaser is not available');
      return;
    }
    
    try {
      console.log('Creating play scene...');
      const scene = createPlayScene(chosenCreator, onGameOver);
      console.log('Scene created:', scene);
      
      if (!scene) {
        console.error('Failed to create play scene');
        return;
      }
      
      console.log('Creating Phaser config...');
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent: ref.current,
        backgroundColor: '#000000',
        physics: {
          default: 'arcade',
          arcade: { debug: false }
        },
        scene: [scene]
      };

      console.log('Creating Phaser game...');
      gameRef.current = new Phaser.Game(config);
      console.log('Phaser game created:', gameRef.current);

      return () => {
        console.log('Cleaning up game...');
        if (gameRef.current) {
          gameRef.current.destroy(true);
          gameRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing game:', error);
    }
  }, [chosenCreator, onGameOver]);

  return (
    <div ref={ref} className="w-[100vw] h-[100vh] ">
    </div>
  );
}
