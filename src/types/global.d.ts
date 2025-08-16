// Extend the Window interface to include the ethereum property
declare interface Window {
  ethereum?: {
    isFarcaster?: boolean;
    // Add other ethereum provider properties if needed
  };
}
