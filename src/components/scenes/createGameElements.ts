import { PlayScene } from "@/lib/bubbleType";

export function createGameElements(scene: PlayScene) {
  scene.cannon = scene.add.image(scene.scale.width / 2, scene.scale.height - 84, 'cannon').setOrigin(0.5).setScale(0.9);
  scene.crosshair = scene.add.image(scene.scale.width / 2, scene.scale.height / 2, 'aim').setAlpha(0.9).setScale(0.7);
}