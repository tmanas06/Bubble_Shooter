import { PlayScene } from '@/lib/bubbleType';

// Track special bubble state in the scene
function createBubbleLayer(scene: PlayScene & { specialBubbleAdded?: boolean }, yOffset: number = 0) {
  const uiBarHeight = 60;
  const topMargin = uiBarHeight + 60;
  const sideMargin = 40;
  const bubbleSize = 80;
  const minSpacing = bubbleSize * 0.8;
  const maxSpacing = bubbleSize * 1.2;
  
  // Random number of bubbles per row (3-6)
  const numBubbles = Phaser.Math.Between(3, 6);
  const availableWidth = scene.scale.width - sideMargin * 2;
  // Removed erroneous cols and spacingX calculation.
  
  // Calculate dynamic spacing based on number of bubbles
  const spacing = Math.min(maxSpacing, Math.max(minSpacing, availableWidth / (numBubbles + 1)));
  const startX = sideMargin + (availableWidth - ((numBubbles - 1) * spacing + bubbleSize)) / 2;
  const startY = topMargin + yOffset;
  
  // Create bubbles with random positions and types
  for (let i = 0; i < numBubbles; i++) {
    // Random x position within bounds
    const x = startX + i * spacing + Phaser.Math.Between(-10, 10);
    // Slight vertical randomness
    const y = startY + Phaser.Math.Between(-15, 15);
    
    // Choose a random bubble type
    let bubbleType: string;
    const rand = Math.random();
  
    // Check for special golden balloon (every 1000 points)
    if (scene.score > 0 && scene.score % 1000 < 50 && !(scene as any).specialBubbleAdded) {
      bubbleType = 'b5'; // Special golden balloon
      (scene as any).specialBubbleAdded = true;
    } 
    // Normal bubble distribution with equal chance for all types
    else {
      // Equal chance for b1, b2, b3, b4
      const randType = Math.random();
      if (randType < 0.25) bubbleType = 'b1';
      else if (randType < 0.5) bubbleType = 'b2';
      else if (randType < 0.75) bubbleType = 'b3';
      else bubbleType = 'b4';
    }
    
    const bubble = scene.bubbles.create(x, y, bubbleType) as Phaser.Physics.Arcade.Image & { meta?: any, type?: string };
    
    // Slightly randomize bubble size
    const sizeVariation = Phaser.Math.Between(-5, 5);
    const finalSize = bubbleSize + sizeVariation;
    
    bubble.displayWidth = finalSize;
    bubble.displayHeight = finalSize;
    bubble.setOrigin(0.5);
    bubble.setCircle(finalSize / 2);
    bubble.setImmovable(true);
    bubble.type = bubbleType; // Store type for collision detection
    
    bubble.meta = {
      creatorName: ['alpha', 'bravo', 'charlie', 'delta'][Phaser.Math.Between(0, 3)],
      scoreValue: bubbleType === 'b4' ? 100 : Phaser.Math.Between(10, 30),
    };
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

  console.log('All bubble textures are loaded, creating initial bubbles...');

  // Create initial 4 rows
  for (let i = 0; i < 4; i++) {
    createBubbleLayer(scene, yOffset + (i * 60));
  }

  // Set up interval to generate a new layer every 5 seconds at the bottom of existing bubbles
  scene.time.addEvent({
    delay: 7000,
    loop: true,
    callback: () => {
      // Find the y-position of the lowest bubble
      const existingBubbles = scene.bubbles.getChildren() as Phaser.Physics.Arcade.Image[];
      let maxY = 0;
      existingBubbles.forEach(b => {
        if (b.y > maxY) maxY = b.y;
      });

      // Game-over check: if any bubble is at or below the area near the cannon
      const screenHeight = scene.scale.height;
      const bottomThreshold = screenHeight - 110; // Slightly above the cannon
      const bubblesAtBottom = existingBubbles.some(
        b => b.y + b.displayHeight / 2 >= bottomThreshold
      );
      if (bubblesAtBottom) {
        console.log("Game over: bubbles reached the bottom!");
        scene.endGame(scene, scene.onGameOver);
        return;
      }

      // Next layer goes below the current lowest one, or at zero offset if no bubbles
      const nextYOffset = (maxY > 0) ? (maxY - (60 + 60)) + 60 : 0; // 60: row height approx
      createBubbleLayer(scene, nextYOffset);
      console.log('Generated a new bubble layer at yOffset:', nextYOffset);
    }
  });

  console.log('Initial bubbles created. Total bubbles:', scene.bubbles.getLength());
}
