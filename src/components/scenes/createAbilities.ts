import { PlayScene } from "@/lib/bubbleType";

export function createAbilities(scene: PlayScene, chosenCreator: string, onGameOver: (p: { score: number; lives: number; pops: number }) => void) {
  const ability1 = scene.add.image(scene.scale.width - 90, 40, 'ability1').setScale(0.8).setInteractive();
  const ability2 = scene.add.image(scene.scale.width - 40, 40, 'ability2').setScale(0.8).setInteractive();
  
  // Add cooldown graphics (placeholders, can be expanded)
  const cooldown1 = scene.add.graphics();
  const cooldown2 = scene.add.graphics();
  
  ability1.on('pointerdown', () => {
    if (!scene.isShooting) return;
    console.log('Bomb ability used');
    // Add bomb effect at center
    const bomb = scene.add.image(scene.scale.width / 2, scene.scale.height / 2 - 100, 'bomb').setScale(0.5);
    scene.tweens.add({
      targets: bomb,
      scale: 2,
      alpha: 0,
      duration: 500,
      onComplete: () => bomb.destroy()
    });
    
    // Destroy nearby bubbles
    scene.bubbles.getChildren().forEach((bubble: any) => {
      const distance = Phaser.Math.Distance.Between(scene.scale.width / 2, scene.scale.height / 2 - 100, bubble.x, bubble.y);
      if (distance < 150) {
        scene.onBubblePop(scene, bubble);
      }
    });
  });
  
  ability2.on('pointerdown', () => {
    if (!scene.isShooting) return;
    console.log('Power shot ability used');
    // Add power shot effect at crosshair
    const power = scene.add.image(scene.crosshair.x, scene.crosshair.y, 'power').setScale(0.7);
    scene.tweens.add({
      targets: power,
      scale: 1.5,
      alpha: 0,
      duration: 400,
      onComplete: () => power.destroy()
    });
    
    // Pop all bubbles in a vertical line near crosshair x
    const bubbles = scene.bubbles.getChildren() as any[];
    for (const bubble of bubbles) {
      if (Math.abs(bubble.x - scene.crosshair.x) < 30) {
        scene.onBubblePop(scene, bubble);
      }
    }
  });
}