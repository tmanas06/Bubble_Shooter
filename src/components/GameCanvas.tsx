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
    
    // Set background color to match the app theme
    this.cameras.main.setBackgroundColor('#0B3E84');
    
    // Add the game background (every.png) as the bottom layer
    this.bg = this.add.image(
      this.cameras.main.width / 2,  // Center X
      this.cameras.main.height / 2, // Center Y
      'game-bg'
    )
      .setOrigin(0.5)  // Center the image
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height)  // Fill the camera view
      .setScrollFactor(0)
      .setDepth(0); // Ensure it's at the bottom

    // Create a container for game elements
    const gameContainer = this.add.container(0, 0);
    
    // Set up game board and UI elements
    this.setupGameBoard();
    this.setupCannon();
    this.setupUI();
    this.setupInput();
    this.setupInitialBubbles();
    this.createNextBubble();
    
    // Ensure crosshair is on top
    this.crosshair = this.add.circle(0, 0, 5, 0xff0000).setVisible(false).setDepth(100);
    
    // Add all game elements to the container
    if (this.bubblesGroup) {
      // Add all bubbles from the group to the container
      this.bubblesGroup.getChildren().forEach(bubble => {
        gameContainer.add(bubble);
      });
    }
    
    // Add other game elements
    [
      this.cannon,
      this.aim,
      this.scoreText,
      this.livesText,
      this.currentBubble,
      this.nextBubblePreview
    ].filter(Boolean).forEach(element => {
      gameContainer.add(element!);
    });
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
    this.currentBubble.setBounce(0.2, 0.2); // Add slight bounce

    let settled = false;
    const settleBubbleOnce = () => {
      if (settled || !this.currentBubble) return;
      settled = true;
      
      // Small delay to let physics settle
      this.time.delayedCall(50, () => {
        if (this.currentBubble) {
          this.settleBubble(this.currentBubble!);
        }
      });
    };

    // Add collision with other bubbles
    const collider = this.physics.add.collider(
      this.currentBubble, 
      this.bubblesGroup, 
      () => {
        if (!settled) {
          this.time.delayedCall(50, settleBubbleOnce);
        }
        return true;
      },
      undefined,
      this
    );

    this.currentBubble.setCollideWorldBounds(true, 1, 1, true);
    this.currentBubble.body.onWorldBounds = true;

    const onWorldBounds = (body: Phaser.Physics.Arcade.Body) => {
      if (body.gameObject === this.currentBubble) {
        // Settle if bubble hits top or sides near the top
        if (this.currentBubble!.y < this.gridOffsetY + 30) {
          settleBubbleOnce();
        }
      }
    };

    this.physics.world.on('worldbounds', onWorldBounds);

    // Cleanup events after a timeout to prevent leaks
    this.time.delayedCall(2000, () => {
      this.physics.world.off('worldbounds', onWorldBounds);
      if (collider) {
        this.physics.world.removeCollider(collider);
      }
      if (!settled && this.currentBubble) {
        settleBubbleOnce();
      }
    });
  }

  private settleBubble(bubble: Bubble) {
    if (!bubble.active) return;
  
    const { x, y } = bubble;
    let minDist = Infinity, minRow = 0, minCol = 0, foundSpot = false;
    
    // First, find the closest empty cell that's adjacent to existing bubbles
    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        if (this.bubbleGrid[row][col]) continue; // Skip occupied cells
        
        const spot = this.getBubblePosition(row, col);
        const dist = Phaser.Math.Distance.Between(spot.x, spot.y, x, y);
        
        // If this spot is closer and either adjacent or we haven't found any spot yet
        if (dist < minDist && this.isAdjacent(row, col)) {
          minDist = dist;
          minRow = row;
          minCol = col;
          foundSpot = true;
        }
      }
    }
    
    // Fallback to nearest empty cell if no adjacent spot found
    if (!foundSpot) {
      minDist = Infinity;
      for (let row = 0; row < this.gridRows; row++) {
        for (let col = 0; col < this.gridCols; col++) {
          if (this.bubbleGrid[row][col]) continue;
          
          const spot = this.getBubblePosition(row, col);
          const dist = Phaser.Math.Distance.Between(spot.x, spot.y, x, y);
          
          if (dist < minDist) {
            minDist = dist;
            minRow = row;
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
      [-1, 0], [1, 0], [0, -1], [0, 1], // Direct neighbors
      [-1, -1], [-1, 1], [1, -1], [1, 1] // Diagonal neighbors
    ];
    
    // Check all 8 directions
    for (const [dr, dc] of directions) {
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < this.gridRows && c >= 0 && c < this.gridCols) {
        if (this.bubbleGrid[r][c]) return true;
      }
    }
    
    // Top row is always adjacent (bubble can stick there)
    if (row === 0) return true;
    
    // Check if any bubble is close enough to attach to
    const minDistance = this.bubbleRadius * 2.2;
    for (let r = 0; r < this.gridRows; r++) {
      for (let c = 0; c < this.gridCols; c++) {
        if (this.bubbleGrid[r][c]) {
          const dx = Math.abs(c - col);
          const dy = Math.abs(r - row);
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 1.5) return true; // Slightly more than 1 to account for grid offsets
        }
      }
    }
    
    return false;
  }

  private getBubblePosition(row: number, col: number) {
    const bubbleSpacing = this.bubbleRadius * 2.2;
    const verticalSpacing = this.bubbleRadius * 1.87;
    // Add slight randomness to prevent perfect grid alignment issues
    const offsetX = (row % 2 === 0) ? 0 : this.bubbleRadius * 1.1;
    const jitter = 0.98 + Math.random() * 0.04; // 0.98 to 1.02
    return {
      x: (this.gridOffsetX + (col * bubbleSpacing) + offsetX) * jitter,
      y: (this.gridOffsetY + (row * verticalSpacing)) * jitter
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
