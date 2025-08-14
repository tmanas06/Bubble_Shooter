'use client';

import { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';

type Props = {
  chosenCreator: string;
  onGameOver: (p: { score: number; lives: number; pops: number }) => void;
};

export default function GameCanvas({ chosenCreator, onGameOver }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    class Play extends Phaser.Scene {
      bg!: Phaser.GameObjects.Image;
      cannon!: Phaser.GameObjects.Image;
      aim!: Phaser.GameObjects.Image;
      bubbles!: Phaser.Physics.Arcade.Group;
      crosshair!: Phaser.GameObjects.Image;
      score = 0;
      lives = 5;
      pops = 0;
      isShooting = true;
      lastTap = 0;
      scoreText!: Phaser.GameObjects.Text;
      livesText!: Phaser.GameObjects.Text;

      preload() {
        // Backgrounds
        this.load.image('bg', '/assets/backgrounds/game_bg.png');
        
        // Game elements
        this.load.image('cannon', '/assets/game_assest/cannon.png');
        this.load.image('aim', '/assets/game_assest/aim.png');
        
        // Bubbles
        this.load.image('b1', '/assets/bubbles/bubble1.png');
        this.load.image('b2', '/assets/bubbles/bubble2.png');
        this.load.image('b3', '/assets/bubbles/bubble3.png');
        this.load.image('b4', '/assets/bubbles/bubble4.png');
        
        // UI Elements
        this.load.image('ability1', '/assets/game_assest/ability1.png');
        this.load.image('ability2', '/assets/game_assest/ability2.png');
        this.load.image('bomb', '/assets/game_assest/bomb.png');
        this.load.image('power', '/assets/game_assest/power.png');
      }

      create() {
        // Add background
        this.add.image(195, 422, 'bg');
        
        // Add UI elements
        this.add.rectangle(195, 40, 350, 60, 0x000000, 0.5).setOrigin(0.5);
        
        // Score display
        this.add.text(30, 20, 'SCORE', { 
          fontSize: '16px', 
          color: '#FFFFFF',
          fontFamily: 'Arial, sans-serif'
        });
        
        this.scoreText = this.add.text(30, 40, '0', { 
          fontSize: '24px', 
          color: '#FFD700',
          fontFamily: 'Arial, sans-serif',
          fontStyle: 'bold'
        } as Phaser.Types.GameObjects.Text.TextStyle);
        
        // Lives display
        this.add.text(150, 20, 'LIVES', { 
          fontSize: '16px', 
          color: '#FFFFFF',
          fontFamily: 'Arial, sans-serif'
        });
        
        this.livesText = this.add.text(150, 40, '5', { 
          fontSize: '24px', 
          color: '#FF6B6B',
          fontFamily: 'Arial, sans-serif',
          fontStyle: 'bold'
        } as Phaser.Types.GameObjects.Text.TextStyle);
        
        // Game elements
        this.cannon = this.add.image(195, 760, 'cannon').setOrigin(0.5).setScale(0.9);
        this.crosshair = this.add.image(195, 520, 'aim').setAlpha(0.9).setScale(0.7);
        
        // Ability buttons with cooldown indicators
        const ability1 = this.add.image(300, 40, 'ability1').setScale(0.8).setInteractive();
        const ability2 = this.add.image(350, 40, 'ability2').setScale(0.8).setInteractive();
        
        // Add cooldown graphics
        const cooldown1 = this.add.graphics();
        const cooldown2 = this.add.graphics();
        
        ability1.on('pointerdown', () => {
          // Handle ability 1 (Bomb)
          if (this.isShooting) {
            console.log('Bomb ability used');
            // Add bomb effect
            const bomb = this.add.image(195, 300, 'bomb').setScale(0.5);
            this.tweens.add({
              targets: bomb,
              scale: 2,
              alpha: 0,
              duration: 500,
              onComplete: () => bomb.destroy()
            });
            
            // Destroy nearby bubbles
            this.bubbles.getChildren().forEach((bubble: any) => {
              const distance = Phaser.Math.Distance.Between(195, 300, bubble.x, bubble.y);
              if (distance < 150) {
                this.onBubblePop(bubble);
              }
            });
          }
        });
        
        ability2.on('pointerdown', () => {
          // Handle ability 2 (Power Shot)
          if (this.isShooting) {
            console.log('Power shot ability used');
            // Add power shot effect
            const power = this.add.image(this.crosshair.x, this.crosshair.y, 'power').setScale(0.7);
            this.tweens.add({
              targets: power,
              scale: 1.5,
              alpha: 0,
              duration: 400,
              onComplete: () => power.destroy()
            });
            
            // Pop all bubbles in a line
            const bubbles = this.bubbles.getChildren() as any[];
            for (const bubble of bubbles) {
              if (Math.abs(bubble.x - this.crosshair.x) < 30) {
                this.onBubblePop(bubble);
              }
            }
          }
        });
        
        this.bubbles = this.physics.add.group({ collideWorldBounds: false, allowGravity: false });

        // Bubble configurations based on reference image
        const bubbleConfigs = [
          // Top-left cluster
          { x: 50, y: 50, width: 75, height: 75, rotation: 0 },
          { x: 100, y: 40, width: 65, height: 65, rotation: 10 },
          { x: 40, y: 100, width: 70, height: 70, rotation: -5 },
          
          // Top-center cluster
          { x: 150, y: 30, width: 85, height: 85, rotation: 15 },
          { x: 200, y: 50, width: 75, height: 75, rotation: -10 },
          { x: 250, y: 40, width: 65, height: 65, rotation: 5 },
          
          // Top-right cluster
          { x: 300, y: 60, width: 80, height: 80, rotation: -15 },
          { x: 340, y: 100, width: 70, height: 70, rotation: 10 },
          
          // Middle-left cluster
          { x: 30, y: 180, width: 90, height: 90, rotation: 20 },
          { x: 80, y: 200, width: 75, height: 75, rotation: -10 },
          { x: 40, y: 250, width: 65, height: 65, rotation: 5 },
          
          // Middle-center cluster
          { x: 180, y: 200, width: 95, height: 95, rotation: -15 },
          { x: 230, y: 180, width: 85, height: 85, rotation: 10 },
          { x: 280, y: 200, width: 75, height: 75, rotation: -5 },
          
          // Bottom-left cluster
          { x: 50, y: 320, width: 70, height: 70, rotation: 10 },
          { x: 100, y: 340, width: 80, height: 80, rotation: -15 },
          { x: 40, y: 380, width: 65, height: 65, rotation: 5 },
          
          // Bottom-center cluster
          { x: 180, y: 350, width: 90, height: 90, rotation: -10 },
          { x: 230, y: 330, width: 75, height: 75, rotation: 15 },
          { x: 280, y: 350, width: 65, height: 65, rotation: -5 },
          
          // Bottom-right cluster
          { x: 320, y: 320, width: 80, height: 80, rotation: 10 },
          { x: 350, y: 280, width: 70, height: 70, rotation: -15 }
        ];
        
        // Adjust y-positions to be lower on screen
        bubbleConfigs.forEach(bubble => {
          bubble.y += 100; // Move all bubbles down
        });

        // Create bubbles at specified positions
        bubbleConfigs.forEach((config, index) => {
          // Use different bubble types in sequence
          const bubbleType = `b${(index % 4) + 1}`;
          const bubble = this.bubbles.create(config.x, config.y, bubbleType) as Phaser.Physics.Arcade.Image & { meta?: any };
          
          // Set size and scale based on the config
          bubble.displayWidth = config.width;
          bubble.displayHeight = config.height;
          bubble.setOrigin(0.5);
          
          // Apply rotation if specified
          if (config.rotation !== 0) {
            bubble.setRotation(Phaser.Math.DegToRad(config.rotation));
          }
          
          // Set bubble metadata
          bubble.meta = {
            creatorName: ['alpha', 'bravo', 'charlie', 'delta'][index % 4],
            scoreValue: Phaser.Math.RND.pick([10, 20])
          };
          
          // Set collision circle (use the smaller dimension for radius)
          const radius = Math.min(config.width, config.height) / 2;
          bubble.setCircle(radius);
          bubble.setImmovable(true);
        });

        this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
          if (!this.isShooting) return;
          if (this.lives < 0.5) return this.end();
          const now = this.time.now;
          if (now - this.lastTap < 100) return;
          this.lastTap = now;
          const target = this.getIntersectingBubble(this.crosshair.x, this.crosshair.y, 50);
          if (!target) {
            this.onBubbleMiss();
            return;
          }
          const creatorHit = target.meta?.creatorName === chosenCreator;
          if (creatorHit) {
            this.score += 50;
            this.lives -= 0.5;
            this.pops += 1;
          } else {
            this.score += target.meta?.scoreValue || 10;
            this.lives -= 1;
            this.pops += 1;
          }
          this.pop(target);
          this.cooldown();
          if (this.lives < 0.5) this.end();
        });

        this.tweens.add({
          targets: this.crosshair,
          y: 300,
          duration: 900,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.inOut'
        });
      }

      getIntersectingBubble(x: number, y: number, radius: number) {
        let hit: any = null;
        const children = this.bubbles.getChildren() as any[];
        for (const b of children) {
          const dx = b.x - x;
          const dy = b.y - y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d <= radius) { hit = b; break; }
        }
        return hit;
      }

      pop(b: any) {
        this.tweens.add({
          targets: b,
          scale: 1.3,
          duration: 80,
          yoyo: true,
          onComplete: () => b.destroy()
        });
        const txt = this.add.text(b.x, b.y, `+${Math.round(this.score)}`, { fontSize: '14px', color: '#fff' }).setOrigin(0.5);
        this.tweens.add({ targets: txt, y: b.y - 30, alpha: 0, duration: 600, onComplete: () => txt.destroy() });
      }

      cooldown() {
        this.isShooting = false;
        this.crosshair.setAlpha(0.4);
        this.time.delayedCall(500, () => { this.isShooting = true; this.crosshair.setAlpha(0.9); });
      }

      onBubbleMiss() {
        this.lives--;
        this.cooldown();
        
        // Update lives display
        this.livesText.setText(this.lives.toString());
        
        // Flash effect when losing a life
        this.cameras.main.flash(200, 255, 0, 0, false, (camera: any, progress: number) => {
          if (progress === 1) {
            // Reset camera effects after flash
            this.cameras.main.resetFX();
          }
        });
        
        if (this.lives <= 0) {
          this.end();
        }
      }
      
      onBubblePop(bubble: Phaser.GameObjects.GameObject) {
        bubble.destroy();
        this.score += 10;
        this.pops++;
        this.scoreText.setText(this.score.toString());
        
        // Check for game over condition
        if (this.bubbles.getLength() <= 0) {
          this.end();
        }
      }
      
      updateScore() {
        this.scoreText.setText(this.score.toString());
      }
      
      updateLives() {
        this.livesText.setText(this.lives.toString());
        
        // Flash effect when losing a life
        this.cameras.main.flash(200, 255, 0, 0, false, (camera: any, progress: number) => {
          if (progress === 1) {
            // Reset camera effects after flash
            this.cameras.main.resetFX();
          }
        });
      }
      
      end() {
        this.isShooting = false;
        this.time.delayedCall(300, () => {
          onGameOver({ score: Math.round(this.score), lives: Math.max(this.lives, 0), pops: this.pops });
        });
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 390,
      height: 844,
      parent: ref.current,
      backgroundColor: '#000000',
      physics: { default: 'arcade', arcade: { debug: false } },
      scene: [Play]
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [chosenCreator, onGameOver]);

  return <div ref={ref} className="w-full h-full" />;
}
