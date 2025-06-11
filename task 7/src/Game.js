import readline from 'readline';
import { Board } from './Board.js';
import { Player } from './Player.js';
import { CPU } from './CPU.js';
import { Display } from './Display.js';
import { NUM_SHIPS, MESSAGES } from './constants.js';

/**
 * Main Game class that orchestrates the Sea Battle game
 */
export class Game {
  /**
   * Creates a new Game instance
   */
  constructor() {
    this.playerBoard = new Board(true); // Show ships on player's board
    this.cpuBoard = new Board(false);   // Hide ships on CPU's board
    this.player = new Player('Player');
    this.cpu = new CPU('CPU');
    this.gameStartTime = null;
    this.gameEndTime = null;
    this.isGameOver = false;
    this.winner = null;
    
    // Setup readline interface
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Initializes and starts the game
   */
  async start() {
    Display.printWelcome();
    
    if (await this.setupGame()) {
      this.gameStartTime = new Date();
      await this.gameLoop();
    } else {
      Display.printError('Failed to setup the game. Please try again.');
      this.rl.close();
    }
  }

  /**
   * Sets up the game by placing ships on both boards
   * @returns {boolean} True if setup was successful
   */
  async setupGame() {
    Display.printMessage('Setting up the game...');
    
    // Place ships on both boards
    const playerShipsPlaced = this.playerBoard.placeShipsRandomly(NUM_SHIPS);
    const cpuShipsPlaced = this.cpuBoard.placeShipsRandomly(NUM_SHIPS);
    
    if (!playerShipsPlaced || !cpuShipsPlaced) {
      Display.printError('Failed to place ships on the board.');
      return false;
    }
    
    Display.printSuccess(`${NUM_SHIPS} ships placed for both Player and CPU.`);
    Display.printMessage(`Try to sink the ${NUM_SHIPS} enemy ships!`);
    
    return true;
  }

  /**
   * Main game loop
   */
  async gameLoop() {
    while (!this.isGameOver) {
      // Check for game over conditions
      if (this.cpuBoard.areAllShipsSunk()) {
        this.endGame(true); // Player wins
        break;
      }
      
      if (this.playerBoard.areAllShipsSunk()) {
        this.endGame(false); // CPU wins
        break;
      }

      // Display current board state
      Display.printBoards(this.cpuBoard, this.playerBoard);
      
      // Player's turn
      const playerGuessSuccessful = await this.handlePlayerTurn();
      
      if (!playerGuessSuccessful) {
        continue; // Invalid input, try again
      }

      // Check if player won after their turn
      if (this.cpuBoard.areAllShipsSunk()) {
        this.endGame(true);
        break;
      }

      // CPU's turn
      await this.handleCPUTurn();
      
      // Check if CPU won after their turn
      if (this.playerBoard.areAllShipsSunk()) {
        this.endGame(false);
        break;
      }
    }
  }

  /**
   * Handles the player's turn
   * @returns {boolean} True if the turn was successful
   */
  async handlePlayerTurn() {
    return new Promise((resolve) => {
      this.rl.question('Enter your guess (e.g., 00): ', (input) => {
        const playerGuess = this.player.processGuess(input);
        
        if (!playerGuess.success) {
          Display.printError(playerGuess.message);
          resolve(false);
          return;
        }

        // Process the guess on CPU's board
        const result = this.cpuBoard.processGuess(playerGuess.coordinate);
        
        if (result.alreadyGuessed) {
          Display.printWarning(result.message);
          resolve(false);
          return;
        }

        // Display result
        if (result.hit) {
          Display.printSuccess(`${MESSAGES.PLAYER_HIT} at ${playerGuess.coordinate}`);
          if (result.sunk) {
            Display.printSuccess(MESSAGES.SHIP_SUNK_PLAYER);
          }
        } else {
          Display.printMessage(`${MESSAGES.PLAYER_MISS} at ${playerGuess.coordinate}`);
        }

        resolve(true);
      });
    });
  }

  /**
   * Handles the CPU's turn
   */
  async handleCPUTurn() {
    Display.printMessage("\n--- CPU's Turn ---");
    
    // CPU makes a guess
    const cpuGuess = this.cpu.makeGuess(this.playerBoard.getGuesses());
    
    // Process the guess on player's board
    const result = this.playerBoard.processGuess(cpuGuess);
    
    // Update CPU with the result
    this.cpu.processGuessResult(cpuGuess, result.hit, result.sunk);
    
    // Display result
    if (result.hit) {
      Display.printMessage(`${MESSAGES.CPU_HIT} at ${cpuGuess}!`);
      if (result.sunk) {
        Display.printMessage(MESSAGES.SHIP_SUNK_CPU);
      }
    } else {
      Display.printMessage(`${MESSAGES.CPU_MISS} at ${cpuGuess}.`);
    }

    // Show CPU mode for debugging/interest
    const cpuStats = this.cpu.getStats();
    Display.printMessage(`CPU is in ${cpuStats.mode} mode.`);
  }

  /**
   * Ends the game and shows final results
   * @param {boolean} playerWon - Whether the player won
   */
  endGame(playerWon) {
    this.isGameOver = true;
    this.gameEndTime = new Date();
    this.winner = playerWon ? 'Player' : 'CPU';
    
    // Show final board state
    Display.printBoards(this.cpuBoard, this.playerBoard);
    
    // Calculate game duration
    const gameDuration = this.gameEndTime - this.gameStartTime;
    const durationInSeconds = Math.round(gameDuration / 1000);
    
    // Gather final statistics
    const finalStats = {
      playerShipsRemaining: this.playerBoard.getRemainingShipsCount(),
      cpuShipsRemaining: this.cpuBoard.getRemainingShipsCount(),
      playerGuesses: this.player.getGuessCount(),
      cpuGuesses: this.cpu.getGuessCount(),
      gameDuration: `${durationInSeconds} seconds`,
      winner: this.winner,
      cpuHitRate: `${this.cpu.getHitRate().toFixed(1)}%`
    };
    
    // Show game over message and stats
    Display.printGameOver(playerWon, finalStats);
    
    // Close readline interface
    this.rl.close();
  }

  /**
   * Gets the current game state
   * @returns {Object} Current game state
   */
  getGameState() {
    return {
      isGameOver: this.isGameOver,
      winner: this.winner,
      playerBoard: this.playerBoard.getGrid(),
      cpuBoard: this.cpuBoard.getGrid(),
      playerShipsRemaining: this.playerBoard.getRemainingShipsCount(),
      cpuShipsRemaining: this.cpuBoard.getRemainingShipsCount(),
      playerStats: this.player.getStats(),
      cpuStats: this.cpu.getStats(),
      gameStartTime: this.gameStartTime,
      gameEndTime: this.gameEndTime
    };
  }

  /**
   * Resets the game to initial state
   */
  reset() {
    this.playerBoard.reset();
    this.cpuBoard.reset();
    this.player.reset();
    this.cpu.reset();
    this.gameStartTime = null;
    this.gameEndTime = null;
    this.isGameOver = false;
    this.winner = null;
  }

  /**
   * Closes the game and cleans up resources
   */
  close() {
    if (this.rl) {
      this.rl.close();
    }
  }

  /**
   * Gets game statistics
   * @returns {Object} Game statistics
   */
  getStats() {
    const gameTime = this.gameEndTime && this.gameStartTime 
      ? this.gameEndTime - this.gameStartTime 
      : Date.now() - (this.gameStartTime || Date.now());
    
    return {
      ...this.getGameState(),
      gameDurationMs: gameTime,
      gameDurationSeconds: Math.round(gameTime / 1000)
    };
  }
} 