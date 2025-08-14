import { PlayScene } from "@/lib/bubbleType";

export function setupInput(scene: PlayScene, chosenCreator: string, onGameOver: (p: { score: number; lives: number; pops: number }) => void) {
  // Make crosshair and cannon follow pointer (like bubble shooter aiming)
  scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
    // Constrain crosshair within game bounds
    const constrainedX = Phaser.Math.Clamp(pointer.x, 0, scene.scale.width);
    const constrainedY = Phaser.Math.Clamp(pointer.y, 0, scene.scale.height - 100); // Avoid bottom area
    scene.crosshair.setPosition(constrainedX, constrainedY);

    // Rotate cannon to point towards pointer
    const angle = Phaser.Math.Angle.Between(scene.cannon.x, scene.cannon.y, pointer.x, pointer.y);
    scene.cannon.setRotation(angle + Math.PI / 2); // Adjust rotation offset based on cannon image orientation
  });

  scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
    if (!scene.isShooting || scene.lives <= 0) return;
    const now = scene.time.now;
    if (now - scene.lastTap < 100) return;
    scene.lastTap = now;

    // Use pointer position directly for intersection check (since crosshair follows pointer)
    const target = scene.getIntersectingBubble(pointer.x, pointer.y, 50);
    if (!target) {
      scene.onBubbleMiss(scene);
      return;
    }

    const creatorHit = target.meta?.creatorName === chosenCreator;
    const scoreIncrement = creatorHit ? 50 : (target.meta?.scoreValue || 10);
    scene.score += scoreIncrement;
    scene.lives -= creatorHit ? 0.5 : 1;
    scene.pops += 1;

    scene.popBubble(scene, target, scoreIncrement);
    scene.updateScore(scene);
    scene.updateLives(scene);
    scene.cooldown(scene);
    if (scene.lives <= 0) scene.endGame(scene, onGameOver);
  });
}