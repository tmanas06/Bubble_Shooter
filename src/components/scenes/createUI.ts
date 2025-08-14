import { PlayScene } from "@/lib/bubbleType";

export function createUI(scene: PlayScene) {
  scene.add.rectangle(scene.scale.width / 2, 40, scene.scale.width * 0.9, 60, 0x000000, 0.5).setOrigin(0.5, 0.5);

  // Score display
  scene.add.text(30, 20, 'SCORE', { 
    fontSize: '16px', 
    color: '#FFFFFF',
    fontFamily: 'Arial, sans-serif'
  });
  
  scene.scoreText = scene.add.text(30, 40, '0', { 
    fontSize: '24px', 
    color: '#FFD700',
    fontFamily: 'Arial, sans-serif',
    fontStyle: 'bold'
  } as Phaser.Types.GameObjects.Text.TextStyle);
  
  // Lives display
  scene.add.text(150, 20, 'LIVES', { 
    fontSize: '16px', 
    color: '#FFFFFF',
    fontFamily: 'Arial, sans-serif'
  });
  
  scene.livesText = scene.add.text(150, 40, '5', { 
    fontSize: '24px', 
    color: '#FF6B6B',
    fontFamily: 'Arial, sans-serif',
    fontStyle: 'bold'
  } as Phaser.Types.GameObjects.Text.TextStyle);
}