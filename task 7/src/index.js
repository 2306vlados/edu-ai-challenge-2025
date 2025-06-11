#!/usr/bin/env node

import { Game } from './Game.js';

/**
 * Main entry point for the Sea Battle game
 */
async function main() {
  const game = new Game();
  
  try {
    await game.start();
  } catch (error) {
    console.error('An error occurred while running the game:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nGame interrupted. Thanks for playing!');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\nGame terminated. Thanks for playing!');
  process.exit(0);
});

// Start the game
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 