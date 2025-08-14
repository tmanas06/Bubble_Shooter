// Utility function to generate bubble configurations
// export function generateBubbleConfigs(): Array<{
//     x: number;
//     y: number;
//     width: number;
//     height: number;
//     rotation: number;
//   }> {
//     const configs = [
//       // Top-left cluster
//       { x: 50, y: 50, width: 75, height: 75, rotation: 0 },
//       { x: 100, y: 40, width: 65, height: 65, rotation: 10 },
//       { x: 40, y: 100, width: 70, height: 70, rotation: -5 },
      
//       // Top-center cluster
//       { x: 150, y: 30, width: 85, height: 85, rotation: 15 },
//       { x: 200, y: 50, width: 75, height: 75, rotation: -10 },
//       { x: 250, y: 40, width: 65, height: 65, rotation: 5 },
      
//       // Top-right cluster
//       { x: 300, y: 60, width: 80, height: 80, rotation: -15 },
//       { x: 340, y: 100, width: 70, height: 70, rotation: 10 },
      
//       // Middle-left cluster
//       { x: 30, y: 180, width: 90, height: 90, rotation: 20 },
//       { x: 80, y: 200, width: 75, height: 75, rotation: -10 },
//       { x: 40, y: 250, width: 65, height: 65, rotation: 5 },
      
//       // Middle-center cluster
//       { x: 180, y: 200, width: 95, height: 95, rotation: -15 },
//       { x: 230, y: 180, width: 85, height: 85, rotation: 10 },
//       { x: 280, y: 200, width: 75, height: 75, rotation: -5 },
      
//       // Bottom-left cluster
//       { x: 50, y: 320, width: 70, height: 70, rotation: 10 },
//       { x: 100, y: 340, width: 80, height: 80, rotation: -15 },
//       { x: 40, y: 380, width: 65, height: 65, rotation: 5 },
      
//       // Bottom-center cluster
//       { x: 180, y: 350, width: 90, height: 90, rotation: -10 },
//       { x: 230, y: 330, width: 75, height: 75, rotation: 15 },
//       { x: 280, y: 350, width: 65, height: 65, rotation: -5 },
      
//       // Bottom-right cluster
//       { x: 320, y: 320, width: 80, height: 80, rotation: 10 },
//       { x: 350, y: 280, width: 70, height: 70, rotation: -15 }
//     ];
  
//     // Adjust y-positions to be lower on screen
//     configs.forEach(bubble => {
//       bubble.y += 100; // Move all bubbles down
//     });
  
//     return configs;
//   }

// Generates initial bubble grid dynamically
export function generateBubbleConfigs(
    rows: number = 6, // number of rows
    minBubbles: number = 5, // min bubbles in a row
    maxBubbles: number = 10, // max bubbles in a row
    bubbleSize: number = 70, // base bubble size
    ySpacing: number = 10 // space between rows
  ): Array<{ x: number; y: number; width: number; height: number; rotation: number }> {
    
    const configs: Array<{ x: number; y: number; width: number; height: number; rotation: number }> = [];
  
    for (let row = 0; row < rows; row++) {
      const bubbleCount = Math.floor(Math.random() * (maxBubbles - minBubbles + 1)) + minBubbles;
  
      // Calculate row width and offset to center
      const totalRowWidth = bubbleCount * bubbleSize;
      const xOffset = (500 - totalRowWidth) / 2; // Assuming canvas width 500px
  
      for (let col = 0; col < bubbleCount; col++) {
        const randomSize = bubbleSize + Math.floor(Math.random() * 15 - 7); // Slight size variation
        const x = xOffset + col * bubbleSize + Math.random() * 5; // small jitter
        const y = row * (bubbleSize + ySpacing) + Math.random() * 3;
        const rotation = Math.floor(Math.random() * 30 - 15); // -15° to +15°
  
        configs.push({
          x,
          y,
          width: randomSize,
          height: randomSize,
          rotation
        });
      }
    }
  
    return configs;
  }
  
  export function addBubbleRow(
    existingConfigs: Array<{ x: number; y: number; width: number; height: number; rotation: number }>,
    minBubbles: number = 8,
    maxBubbles: number = 10,
    bubbleSize: number = 50
  ): Array<{ x: number; y: number; width: number; height: number; rotation: number }> {
  
    const canvasWidth = 500;
  
    // Shift all existing bubbles down
    existingConfigs.forEach(bubble => {
      bubble.y += (bubbleSize - 5); // Maintain hexagonal packing
    });
  
    const bubbleCount = Math.floor(Math.random() * (maxBubbles - minBubbles + 1)) + minBubbles;
    const rowOffset = (existingConfigs.length > 0 && existingConfigs[0].y % (bubbleSize - 5) !== 0) ? 0 : bubbleSize / 2;
    const totalRowWidth = bubbleCount * bubbleSize;
    const xOffset = (canvasWidth - totalRowWidth) / 2;
  
    // Add new row at top
    for (let col = 0; col < bubbleCount; col++) {
      const x = xOffset + rowOffset + col * bubbleSize;
      const y = 0;
  
      existingConfigs.push({
        x,
        y,
        width: bubbleSize,
        height: bubbleSize,
        rotation: 0
      });
    }
  
    return existingConfigs;
  }
  
  