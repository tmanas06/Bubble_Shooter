import { PlayScene } from "@/lib/bubbleType";

export function addBackground(scene: PlayScene) {
  scene.bg = scene.add.image(scene.scale.width / 2, scene.scale.height / 2, 'bg').setDisplaySize(scene.scale.width, scene.scale.height);
}