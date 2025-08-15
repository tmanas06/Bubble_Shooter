import { PlayScene } from "@/lib/bubbleType";
import { createBubbles } from "./createBubbles";

export function onBubblePop(scene: PlayScene, bubble: Phaser.GameObjects.GameObject) {
  const b = bubble as any;
  scene.popBubble(scene, b, 10); // Fixed increment for abilities
  scene.score += 10;
  scene.pops++;
  scene.updateScore(scene);
  
  // Check if all bubbles are popped
  if (scene.bubbles.getLength() <= 0) {
    // Instead of ending the game, create a new layer of bubbles
    // with a small delay for better UX
    scene.time.delayedCall(500, () => {
      // Create a new layer of bubbles, positioned slightly lower
      createBubbles(scene, 0);
    });
  }
}