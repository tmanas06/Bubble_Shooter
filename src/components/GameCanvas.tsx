'use client';

import React, { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';

type BubbleType = 'b1' | 'b2' | 'b3' | 'b4';

interface Bubble extends Phaser.Physics.Arcade.Sprite {
  row: number;
  col: number;
  type: BubbleType;
  getData: <T = any>(key: string) => T;
  setData: (key: string, value: any) => this;
}

interface GameCanvasProps {
  chosenCreator: string;
  onGameOver: (result: { score: number; lives: number; pops: number }) => void;
}

class PlayScene extends Phaser.Scene {
  private gridCols = 8;
  private gridRows = 12;
  private bubbleTypes: BubbleType[] = ['b1', 'b2', 'b3', 'b4'];
  private bubbleRadius = 14;
  private bubbleScale = 0.5;
  private gridOffsetX = 30;
  private gridOffsetY = 60;
  private bubbleGrid: (Bubble | null)[][] = [];
  private gameWidth = 390;
  private gameHeight = 844;

  private bubblesGroup!: Phaser.Physics.Arcade.Group;
  private cannon!: Phaser.GameObjects.Sprite;
  private aim!: Phaser.GameObjects.Sprite;
  private crosshair!: Phaser.GameObjects.Arc;
  private bg!: Phaser.GameObjects.Image;
  private currentBubble: Bubble | null = null;
  private nextBubbleType: BubbleType = 'b1';
  private nextBubblePreview!: Phaser.GameObjects.Sprite;
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private score = 0;
  private lives = 3;
  private isShooting = false;
  private pops = 0;
  private placing = false;

  constructor() {
    super({ key: 'PlayScene' });
  }

  preload() {
    this.load.image('game-bg', '/assets/backgrounds/every.png');
    this.load.image('cannon', '/assets/game_assest/cannon.png');
    this.load.image('aim', '/assets/game_assest/aim.png');
    this.load.image('b1', '/assets/bubbles/bubble1.png');
    this.load.image('b2', '/assets/bubbles/bubble2.png');
    this.load.image('b3', '/assets/bubbles/bubble3.png');
    this.load.image('b4', '/assets/bubbles/bubble4.png');
  }

  create() {
    this.physics.world.setBounds(0, 0, this.gameWidth, this.gameHeight);
    this.bg = this.add.image(0, 0, 'game-bg')
      .setOrigin(0, 0)
      .setDisplaySize(this.gameWidth, this.gameHeight)
      .setScrollFactor(0);

    this.setupGameBoard();
    this.setupCannon();
    this.setupUI();
    this.setupInput();
    this.setupInitialBubbles();
    this.createNextBubble();

    this.crosshair = this.add.circle(0, 0, 5, 0xff0000).setVisible(false);
  }

  private setupGameBoard() {
    for (let row = 0; row < this.gridRows; row++) {
      this.bubbleGrid[row] = [];
      for (let col = 0; col < this.gridCols; col++) {
        this.bubbleGrid[row][col] = null;
      }
    }
    this.bubblesGroup = this.physics.add.group();
  }

  private setupCannon() {
    this.cannon = this.add.sprite(this.gameWidth / 2, this.gameHeight - 18, 'cannon');
    this.cannon.setOrigin(0.5, 1);
    this.cannon.setScale(0.7);
    this.cannon.setAngle(-90);

    this.aim = this.add.sprite(this.cannon.x, this.cannon.y, 'aim');
    this.aim.setOrigin(0.5, 1);
    this.aim.setScale(0.6);
    this.aim.setAngle(-90);
  }

  private setupUI() {
    this.scoreText = this.add.text(20, 20, `Score: ${this.score}`, {
      fontSize: '24px', fontFamily: 'Arial',
      color: '#ffffff', stroke: '#000000', strokeThickness: 4
    });
    this.livesText = this.add.text(20, 60, `Lives: ${this.lives}`, {
      fontSize: '24px', fontFamily: 'Arial',
      color: '#ffffff', stroke: '#000000', strokeThickness: 4
    });
  }

  private setupInput() {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.isShooting && this.currentBubble) {
        let angle = Phaser.Math.Angle.Between(
          this.cannon.x, this.cannon.y, pointer.x, pointer.y
        );
        angle = Phaser.Math.Clamp(angle, -2.25, -0.9);
        this.shootBubble(angle);
      }
    });
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.crosshair.setPosition(pointer.x, pointer.y);
    });
  }

  private setupInitialBubbles() {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        if (Math.random() > 0.3) {
          const type = Phaser.Utils.Array.GetRandom(this.bubbleTypes) as BubbleType;
          this.createBubble(col, row, type);
        }
      }
    }
  }

  private createBubble(col: number, row: number, type: BubbleType): Bubble {
    const bubbleSpacing = this.bubbleRadius * 2.2;
    const verticalSpacing = this.bubbleRadius * 1.87;
    const offsetX = (row % 2 === 0) ? 0 : this.bubbleRadius * 1.1;
    const x = this.gridOffsetX + (col * bubbleSpacing) + offsetX;
    const y = this.gridOffsetY + (row * verticalSpacing);

    const bubble = this.physics.add.sprite(x, y, type) as unknown as Bubble;
    bubble.row = row; bubble.col = col; bubble.type = type;
    bubble.setData('type', type);
    bubble.setCircle(this.bubbleRadius);
    bubble.setScale(this.bubbleScale);
    bubble.setImmovable(true);

    if (row >= 0 && row < this.gridRows && col >= 0 && col < this.gridCols) {
      this.bubbleGrid[row][col] = bubble;
    }
    this.bubblesGroup.add(bubble);
    return bubble;
  }

  private createNextBubble() {
    if (this.nextBubblePreview) this.nextBubblePreview.destroy();
    this.nextBubbleType = Phaser.Utils.Array.GetRandom(this.bubbleTypes) as BubbleType;
    this.nextBubblePreview = this.add.sprite(
      this.cannon.x + 31, this.cannon.y - 25, this.nextBubbleType
    ).setScale(0.35);
    this.nextBubblePreview.setDepth(20);
    if (this.currentBubble) this.currentBubble.destroy();
    this.currentBubble = this.physics.add.sprite(
      this.cannon.x, this.cannon.y - 40, this.nextBubbleType
    ) as unknown as Bubble;
    this.currentBubble.setScale(this.bubbleScale);
    this.currentBubble.setData('type', this.nextBubbleType);
    this.currentBubble.setImmovable(false);
    this.isShooting = true;
    this.placing = false;
  }

  private shootBubble(angle: number) {
    if (!this.currentBubble || !this.isShooting) return;
    this.isShooting = false;
    const speed = 900;
    this.currentBubble.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    this.currentBubble.setData('isMoving', true);

    let settled = false;
    const settleBubbleOnce = () => {
      if (settled) return;
      settled = true;
      this.settleBubble(this.currentBubble!);
    };

    this.physics.add.collider(this.currentBubble, this.bubblesGroup, settleBubbleOnce);

    this.currentBubble.setCollideWorldBounds(true);
    this.currentBubble.body.onWorldBounds = true;

    const onWorldBounds = (body: Phaser.Physics.Arcade.Body) => {
      if (body.gameObject === this.currentBubble) {
        // Only settle if bubble at or close to top boundary
        if (this.currentBubble!.y < this.gridOffsetY + 15) {
          settleBubbleOnce();
        }
      }
    };

    this.physics.world.on('worldbounds', onWorldBounds);

    // Cleanup event after a timeout to prevent leaks
    this.time.delayedCall(1500, () => {
      this.physics.world.off('worldbounds', onWorldBounds);
      if (!settled && this.currentBubble) {
        settleBubbleOnce();
      }
    });
  }

  private settleBubble(bubble: Bubble) {
    if (!bubble.active) return;
  
    let { x, y } = bubble;
    let minDist = Infinity, minRow = 0, minCol = 0, foundAdj = false;
    // First, search for empty cell adjacent to others
    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        const spot = this.getBubblePosition(row, col);
        const dist = Phaser.Math.Distance.Between(spot.x, spot.y, x, y);
        if (dist < minDist && !this.bubbleGrid[row][col] && this.isAdjacent(row, col)) {
          minDist = dist;
          minRow = row;
          minCol = col;
          foundAdj = true;
        }
      }
    }
    // Fallback to nearest empty in top row
    if (!foundAdj) {
      minDist = Infinity;
      for (let col = 0; col < this.gridCols; col++) {
        if (!this.bubbleGrid[0][col]) {
          const spot = this.getBubblePosition(0, col);
          const dist = Phaser.Math.Distance.Between(spot.x, spot.y, x, y);
          if (dist < minDist) {
            minDist = dist;
            minRow = 0;
            minCol = col;
          }
        }
      }
    }
  
    if (this.bubbleGrid[minRow][minCol]) {
      bubble.destroy();
      this.createNextBubble();
      return;
    }
  
    bubble.x = this.getBubblePosition(minRow, minCol).x;
    bubble.y = this.getBubblePosition(minRow, minCol).y;
    bubble.setVelocity(0, 0);
    bubble.setImmovable(true);
    bubble.setData('isMoving', false);
    bubble.row = minRow;
    bubble.col = minCol;
    this.bubbleGrid[minRow][minCol] = bubble;
  
    const cluster = this.findCluster(minRow, minCol, bubble.getData('type'));
    if (cluster.length >= 3) {
      this.popBubbles(cluster);
    }
    this.createNextBubble();
  }
  

  private isAdjacent(row: number, col: number): boolean {
    // Check if grid cell is adjacent to at least one occupied cell
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1]
    ];
    for (const [dr, dc] of directions) {
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < this.gridRows && c >= 0 && c < this.gridCols) {
        if (this.bubbleGrid[r][c]) return true;
      }
    }
    // Top row is always adjacent (bubble can stick there)
    if (row === 0) return true;
    return false;
  }

  private getBubblePosition(row: number, col: number) {
    const bubbleSpacing = this.bubbleRadius * 2.2;
    const verticalSpacing = this.bubbleRadius * 1.87;
    const offsetX = (row % 2 === 0) ? 0 : this.bubbleRadius * 1.1;
    return {
      x: this.gridOffsetX + (col * bubbleSpacing) + offsetX,
      y: this.gridOffsetY + (row * verticalSpacing)
    };
  }

  private findCluster(row: number, col: number, type: string): Bubble[] {
    const stack = [{ row, col }];
    const visited = new Set<string>();
    const cluster: Bubble[] = [];
    while (stack.length > 0) {
      const { row, col } = stack.pop()!;
      if (row < 0 || row >= this.gridRows || col < 0 || col >= this.gridCols) continue;
      if (visited.has(`${row},${col}`)) continue;
      const b = this.bubbleGrid[row][col];
      if (!b || b.getData('type') !== type) continue;
      cluster.push(b);
      visited.add(`${row},${col}`);
      stack.push({ row: row + 1, col });
      stack.push({ row: row - 1, col });
      stack.push({ row, col: col + 1 });
      stack.push({ row, col: col - 1 });
    }
    return cluster;
  }

  private popBubbles(cluster: Bubble[]) {
    cluster.forEach(bubble => {
      if (bubble.row >= 0 && bubble.col >= 0) this.bubbleGrid[bubble.row][bubble.col] = null;
      this.tweens.add({
        targets: bubble,
        scale: 0,
        duration: 180,
        onComplete: () => { bubble.destroy(); this.pops++; }
      });
    });
    this.score += cluster.length * 10;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  update() {
    const pointer = this.input.activePointer;
    let angle = -Math.PI / 2;
    if (pointer.isDown) {
      angle = Phaser.Math.Angle.Between(this.cannon.x, this.cannon.y, pointer.x, pointer.y);
      angle = Phaser.Math.Clamp(angle, -2.25, -0.9);
      this.cannon.setAngle(Phaser.Math.RadToDeg(angle) + 90);
      this.aim.setAngle(Phaser.Math.RadToDeg(angle) + 90);
    } else {
      this.cannon.setAngle(-90);
      this.aim.setAngle(-90);
    }
    if (this.nextBubblePreview) {
      this.nextBubblePreview.x = this.cannon.x + 31;
      this.nextBubblePreview.y = this.cannon.y - 25;
    }
    if (this.currentBubble && !this.currentBubble.getData('isMoving')) {
      this.currentBubble.x = this.cannon.x;
      this.currentBubble.y = this.cannon.y - 40;
    }
  }
}

const GameCanvas: React.FC<GameCanvasProps> = ({ chosenCreator, onGameOver }) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!gameContainerRef.current || hasInitialized.current) return;
    hasInitialized.current = true;
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameContainerRef.current,
      width: 390,
      height: 844,
      backgroundColor: '#000000',
      physics: {
        default: 'arcade',
        arcade: { gravity: { x: 0, y: 0 }, debug: false, fps: 60 },
      },
      scene: PlayScene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 390, height: 844,
      },
      input: {
        activePointers: 2, keyboard: true, mouse: true, touch: true,
      },
      render: { pixelArt: false, antialias: true },
    };

    try {
      gameRef.current = new Phaser.Game(config);
      const handleResize = () => { if (gameRef.current) gameRef.current.scale.refresh(); };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        if (gameRef.current) {
          gameRef.current.destroy(true);
          gameRef.current = null;
        }
        hasInitialized.current = false;
      };
    } catch (error) {
      console.error('Error initializing game:', error);
    }
  }, [chosenCreator, onGameOver]);

  return (
    <div
      ref={gameContainerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
      }}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};

export default GameCanvas;
