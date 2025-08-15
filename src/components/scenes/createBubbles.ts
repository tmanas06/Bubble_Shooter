import { PlayScene } from '@/lib/bubbleType';


function createBubbleLayer(scene: PlayScene, yOffset: number = 0) {
  const uiBarHeight = 60;          
  const topMargin = uiBarHeight + 60; 
  const sideMargin = 24;        
  const bubbleSize = 80;
  let spacingX = bubbleSize * 0.95;
  const spacingY = bubbleSize * 0.85;

  const rows = 1; // Create one row at a time
  const cols = 5; // Number of bubbles per row

  const availableWidth = scene.scale.width - sideMargin * 2;
  let totalWidth = (cols - 1) * spacingX + bubbleSize;
  if (totalWidth > availableWidth) {
    spacingX = Math.max(4, (availableWidth - bubbleSize) / (cols - 1)); 
    totalWidth = (cols - 1) * spacingX + bubbleSize;
  }

  const startX = sideMargin + (availableWidth - totalWidth) / 2;
  const startY = topMargin + yOffset;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const xOffset = row % 2 === 0 ? 0 : spacingX / 2;
      const x = startX + col * spacingX + xOffset;
      const y = startY + row * spacingY;

      const bubbleType = `b${(row + col) % 4 + 1}`;
      const bubble = scene.bubbles.create(x, y, bubbleType) as Phaser.Physics.Arcade.Image & { meta?: any };

      bubble.displayWidth = bubbleSize;
      bubble.displayHeight = bubbleSize;
      bubble.setOrigin(0.5);
      bubble.setCircle(bubbleSize / 2);
      bubble.setImmovable(true);

      bubble.meta = {
        creatorName: ['alpha', 'bravo', 'charlie', 'delta'][(row + col) % 4],
        scoreValue: Phaser.Math.RND.pick([10, 20]),
      };
    }
  }
}

export function createBubbles(scene: PlayScene, yOffset: number = 0) {
  console.log('createBubbles called with yOffset:', yOffset);
  
  if (!scene.bubbles) {
    console.log('Creating new bubbles group');
    scene.bubbles = scene.physics.add.group({
      collideWorldBounds: false,
      allowGravity: false,
    });
  }
  
  // Check if textures are loaded
  const textures = ['b1', 'b2', 'b3', 'b4'];
  const missingTextures = textures.filter(tex => !scene.textures.exists(tex));
  
  if (missingTextures.length > 0) {
    console.error('Missing textures:', missingTextures);
    return;
  }
  
  console.log('All bubble textures are loaded, creating bubbles...');
  
  // Create initial 5 rows
  for (let i = 0; i < 5; i++) {
    createBubbleLayer(scene, yOffset + (i * 60));
  }
  
  console.log('Bubbles created. Total bubbles:', scene.bubbles.getLength());
}
