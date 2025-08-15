import { PlayScene } from "@/lib/bubbleType";

export function preloadAssets(scene: PlayScene) {
  console.log('preloadAssets called');
  
  // Underwater background
  console.log('Loading underwater_bg...');
  scene.load.image('underwater_bg', '/assets/backgrounds/underwaterbg.svg');
  
  // Game elements
  console.log('Loading game elements...');
  scene.load.image('cannon', '/assets/game_assest/cannon.png');
  scene.load.image('aim', '/assets/game_assest/aim.png');
  
  // Bubbles with character designs
  console.log('Loading bubble assets...');
  const bubblePaths = [
    { key: 'b1', path: '/assets/bubbles/bubble1.png' },
    { key: 'b2', path: '/assets/bubbles/bubble2.png' },
    { key: 'b3', path: '/assets/bubbles/bubble3.png' },
    { key: 'b4', path: '/assets/bubbles/bubble4.png' }
  ];
  
  bubblePaths.forEach(bubble => {
    console.log(`Loading ${bubble.key} from ${bubble.path}`);
    scene.load.image(bubble.key, bubble.path);
  });
  
  // Add error handler for loading
  scene.load.on('loaderror', (file: any) => {
    console.error('Error loading file:', file.key, file.state, file.error);
  });
  
  // Log when all assets are loaded
  scene.load.on('complete', () => {
    console.log('All assets loaded successfully');
    console.log('Textures in cache:', Object.keys(scene.textures.list));
  });
  
  // Shipwreck silhouette
  console.log('Loading shipwreck...');
  scene.load.image('shipwreck', '/assets/game_assest/cannon.png'); // Using existing asset as placeholder
  
  console.log('preloadAssets completed');
}