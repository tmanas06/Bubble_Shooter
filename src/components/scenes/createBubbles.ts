import { PlayScene } from '@/lib/bubbleType';
import { generateBubbleConfigs } from '@/lib/functions';

export function createBubbles(scene: PlayScene) {
  scene.bubbles = scene.physics.add.group({ collideWorldBounds: false, allowGravity: false });

  const bubbleConfigs = generateBubbleConfigs(6, 5, 10, 70, 10);

  bubbleConfigs.forEach((config, index) => {
    // Scale positions relative to canvas size (for responsiveness)
    const scaledX = (config.x / 390) * scene.scale.width;
    const scaledY = (config.y / 844) * scene.scale.height;
    const scaledWidth = (config.width / 390) * scene.scale.width;
    const scaledHeight = (config.height / 844) * scene.scale.height;

    const bubbleType = `b${(index % 4) + 1}`;
    const bubble = scene.bubbles.create(scaledX, scaledY, bubbleType) as Phaser.Physics.Arcade.Image & { meta?: any };
    
    bubble.displayWidth = scaledWidth;
    bubble.displayHeight = scaledHeight;
    bubble.setOrigin(0.5);
    
    if (config.rotation !== 0) {
      bubble.setRotation(Phaser.Math.DegToRad(config.rotation));
    }
    
    bubble.meta = {
      creatorName: ['alpha', 'bravo', 'charlie', 'delta'][index % 4],
      scoreValue: Phaser.Math.RND.pick([10, 20])
    };
    
    const radius = Math.min(scaledWidth, scaledHeight) / 2;
    bubble.setCircle(radius);
    bubble.setImmovable(true);
  });
}