import { PlayScene } from "@/lib/bubbleType";

export function preloadAssets(scene: PlayScene) {
  console.log('preloadAssets called');
  
  // Backgrounds
  scene.load.image('bg', '/assets/backgrounds/game_bg.png');
  
  // Game elements
  scene.load.image('cannon', '/assets/game_assest/cannon.png');
  scene.load.image('aim', '/assets/game_assest/aim.png');
  
  // Bubbles
  scene.load.image('b1', '/assets/bubbles/bubble1.png');
  scene.load.image('b2', '/assets/bubbles/bubble2.png');
  scene.load.image('b3', '/assets/bubbles/bubble3.png');
  scene.load.image('b4', '/assets/bubbles/bubble4.png');
  
  // UI Elements
  scene.load.image('ability1', '/assets/game_assest/ability1.png');
  scene.load.image('ability2', '/assets/game_assest/ability2.png');
  scene.load.image('bomb', '/assets/game_assest/bomb.png');
  scene.load.image('power', '/assets/game_assest/power.png');
  
  console.log('preloadAssets completed');
}