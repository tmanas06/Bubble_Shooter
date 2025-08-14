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

      preload() {
        this.load.image('bg', '/assets/backgrounds/game_bg.png');
        this.load.image('cannon', '/assets/game_assest/cannon.png');
        this.load.image('aim', '/assets/game_assest/aim.png');
        this.load.image('b1', '/assets/bubbles/bubble1.png');
        this.load.image('b2', '/assets/bubbles/bubble2.png');
        this.load.image('b3', '/assets/bubbles/bubble3.png');
        this.load.image('b4', '/assets/bubbles/bubble4.png');
      }

      create() {
        this.add.image(195, 422, 'bg');
        this.cannon = this.add.image(195, 760, 'cannon').setOrigin(0.5).setScale(0.9);
        this.crosshair = this.add.image(195, 520, 'aim').setAlpha(0.9).setScale(0.7);
        this.bubbles = this.physics.add.group({ collideWorldBounds: false, allowGravity: false });

        for (let r = 0; r < 5; r++) {
          for (let c = 0; c < 8; c++) {
            const k = ['b1','b2','b3','b4'][Phaser.Math.Between(0,3)];
            const x = 40 + c*42 + (r%2===0?0:20);
            const y = 120 + r*42;
            const b = this.bubbles.create(x, y, k) as Phaser.Physics.Arcade.Image & { meta?: any };
            b.setImmovable(true);
            b.meta = {
              creatorName: ['alpha','bravo','charlie','delta'][Phaser.Math.Between(0,3)],
              scoreValue: Phaser.Math.RND.pick([10,20])
            };
            b.setCircle(Math.floor(Math.min(b.width,b.height)/2));
          }
        }

        this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
          if (!this.isShooting) return;
          if (this.lives < 0.5) return this.end();
          const now = this.time.now;
          if (now - this.lastTap < 100) return;
          this.lastTap = now;
          const target = this.getIntersectingBubble(this.crosshair.x, this.crosshair.y, 50);
          if (!target) {
            this.lives -= 1;
            this.cooldown();
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
