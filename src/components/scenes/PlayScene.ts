import * as Phaser from 'phaser';
import { PlayScene } from '@/lib/bubbleType';
import { preloadAssets } from './preloadAssets';
import { addBackground } from './addBackground';
import { createUI } from './createUI';
import { createGameElements } from './createGameElements';
import { createAbilities } from './createAbilities';
import { createBubbles } from './createBubbles';
import { setupInput } from './setupInput';
import { getIntersectingBubble } from './getIntersectingBubble';
import { popBubble } from './popBubble';
import { cooldown } from './cooldown';
import { onBubbleMiss } from './onBubbleMiss';
import { onBubblePop } from './onBubblePop';
import { updateScore } from './updateScore';
import { updateLives } from './updateLives';
import { endGame } from './endGame';

export function createPlayScene(chosenCreator: string, onGameOver: (p: { score: number; lives: number; pops: number }) => void) {
  console.log('createPlayScene called with:', { chosenCreator });
  
  class PlaySceneClass extends Phaser.Scene implements PlayScene{
    bg!: Phaser.GameObjects.Image;
    cannon!: Phaser.GameObjects.Image;
    crosshair!: Phaser.GameObjects.Image;
    bubbles!: Phaser.Physics.Arcade.Group;
    score = 0;
    timerText!: Phaser.GameObjects.Text;
    timeLeft!: number;
    pops = 0;
    isShooting = true;
    lastTap = 0;
    scoreText!: Phaser.GameObjects.Text;
    livesText!: Phaser.GameObjects.Text;
    onGameOver!: (p: { score: number; lives: number; pops: number }) => void;

    getIntersectingBubble!: (x: number, y: number, radius: number) => any;
    popBubble!: (scene: PlayScene, b: any, increment: number) => void;
    cooldown!: (scene: PlayScene) => void;
    onBubbleMiss!: (scene: PlayScene) => void;
    onBubblePop!: (scene: PlayScene, bubble: Phaser.GameObjects.GameObject) => void;
    updateScore!: (scene: PlayScene) => void;
    endGame!: (scene: PlayScene, onGameOver: (p: { score: number; lives: number; pops: number }) => void) => void;

    constructor() {
      super({ key: 'Play' });
      console.log('PlaySceneClass constructor called');
    }

    preload() {
      console.log('PlaySceneClass preload called');
      preloadAssets(this);
    }

    create() {
      console.log('PlaySceneClass create called');
      // Initialize state
      this.score = 0;
      this.timeLeft=60;
      this.pops = 0;
      this.isShooting = true;
      this.lastTap = 0;
      this.onGameOver = onGameOver;

      // Add debug graphics
      const graphics = this.add.graphics();
      graphics.fillStyle(0x00ff00, 0.5);
      graphics.fillRect(0, 0, this.scale.width, this.scale.height);
      
      // Add debug text
      const debugText = this.add.text(10, 10, 'BUBBLE SHOOTER DEBUG', { 
        fontSize: '24px', 
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 },
        fontFamily: 'Arial'
      });
      debugText.setScrollFactor(0);
      debugText.setDepth(1000);

      // Add more debug info
      const debugInfo = this.add.text(10, 50, '', {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#00000080',
        padding: { x: 10, y: 5 },
        fontFamily: 'Arial'
      });
      debugInfo.setScrollFactor(0);
      debugInfo.setDepth(1000);
      
      // Update debug info every second
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          if (debugInfo) {
            debugInfo.setText([
              `Game Time: ${Math.floor(this.time.now / 1000)}s`,
              `Bubbles: ${this.bubbles?.getChildren().length || 0}`,
              `Score: ${this.score}`,
              `Screen: ${this.scale.width}x${this.scale.height}`
            ].join('\n'));
          }
        },
        callbackScope: this,
        loop: true
      });
      
      console.log('Game dimensions:', this.scale.width, 'x', this.scale.height);
      console.log('Game camera:', this.cameras.main);
      
      try {
        // Initialize game components
        addBackground(this);
        createUI(this);
        createGameElements(this);
        
        // Create initial bubbles
        createBubbles(this);
        
        // Setup input handling
        setupInput(this, chosenCreator, onGameOver);
        
        // Log all game objects after creation
        this.time.delayedCall(1000, () => {
          console.log('Game objects after creation:');
          console.log('Bubbles:', this.bubbles?.getChildren().length || 0);
          console.log('All game objects:', this.children.list);
        });
      } catch (error: unknown) {
        console.error('Error in create():', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        debugInfo.setText(`ERROR: ${errorMessage}`);
      }
    }
  }

  // Create instance and assign helper methods
  console.log('Creating PlaySceneClass instance...');
  const scene = new PlaySceneClass();
  console.log('PlaySceneClass instance created:', scene);
  
  // Assign helper methods to the scene object
  scene.getIntersectingBubble = getIntersectingBubble;
  scene.popBubble = popBubble;
  scene.cooldown = cooldown;
  scene.onBubbleMiss = onBubbleMiss;
  scene.onBubblePop = onBubblePop;
  scene.updateScore = updateScore;
  scene.endGame = endGame;

  console.log('Returning scene:', scene);
  return scene;
}