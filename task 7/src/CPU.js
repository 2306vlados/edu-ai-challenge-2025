import { getRandomInt, getAdjacentCoordinates, formatCoordinate, isValidCoordinate } from './utils.js';
import { BOARD_SIZE, CPU_MODES } from './constants.js';

/**
 * CPU class representing an AI opponent with hunt and target strategies
 */
export class CPU {
  /**
   * Creates a new CPU instance
   * @param {string} name - CPU's name
   */
  constructor(name = 'CPU') {
    this.name = name;
    this.mode = CPU_MODES.HUNT;
    this.targetQueue = [];
    this.guessHistory = [];
    this.hitHistory = [];
  }

  /**
   * Makes a guess using the current AI strategy
   * @param {Set} previousGuesses - Set of previously guessed coordinates
   * @returns {string} Coordinate string for the guess
   */
  makeGuess(previousGuesses = new Set()) {
    let coordinate;
    let attempts = 0;
    const maxAttempts = 1000; // Prevent infinite loops

    do {
      if (this.mode === CPU_MODES.TARGET && this.targetQueue.length > 0) {
        coordinate = this.makeTargetedGuess();
      } else {
        this.mode = CPU_MODES.HUNT;
        coordinate = this.makeHuntGuess();
      }
      attempts++;
    } while (previousGuesses.has(coordinate) && attempts < maxAttempts);

    // Add to guess history
    this.addGuess(coordinate);

    return coordinate;
  }

  /**
   * Makes a random hunt guess
   * @returns {string} Random coordinate string
   */
  makeHuntGuess() {
    const row = getRandomInt(0, BOARD_SIZE);
    const col = getRandomInt(0, BOARD_SIZE);
    return formatCoordinate(row, col);
  }

  /**
   * Makes a targeted guess from the target queue
   * @returns {string} Coordinate string from target queue or random if queue is empty
   */
  makeTargetedGuess() {
    if (this.targetQueue.length === 0) {
      this.mode = CPU_MODES.HUNT;
      return this.makeHuntGuess();
    }

    return this.targetQueue.shift();
  }

  /**
   * Processes the result of a guess and updates AI state
   * @param {string} coordinate - The guessed coordinate
   * @param {boolean} wasHit - Whether the guess was a hit
   * @param {boolean} wasSunk - Whether a ship was sunk
   */
  processGuessResult(coordinate, wasHit, wasSunk) {
    if (wasHit) {
      this.addHit(coordinate);

      if (wasSunk) {
        // Ship was sunk, go back to hunt mode
        this.mode = CPU_MODES.HUNT;
        this.targetQueue = [];
      } else {
        // Hit but not sunk, switch to target mode and add adjacent coordinates
        this.mode = CPU_MODES.TARGET;
        this.addAdjacentTargets(coordinate);
      }
    } else {
      // Miss - if in target mode and no more targets, go back to hunt mode
      if (this.mode === CPU_MODES.TARGET && this.targetQueue.length === 0) {
        this.mode = CPU_MODES.HUNT;
      }
    }
  }

  /**
   * Adds adjacent coordinates to the target queue
   * @param {string} coordinate - The hit coordinate
   */
  addAdjacentTargets(coordinate) {
    const row = parseInt(coordinate[0]);
    const col = parseInt(coordinate[1]);
    
    const adjacentCoords = getAdjacentCoordinates(row, col);
    
    adjacentCoords.forEach(({ row: adjRow, col: adjCol }) => {
      const adjCoordinate = formatCoordinate(adjRow, adjCol);
      
      // Only add if not already in queue and not already guessed
      if (!this.targetQueue.includes(adjCoordinate) && 
          !this.hasGuessed(adjCoordinate)) {
        this.targetQueue.push(adjCoordinate);
      }
    });
  }

  /**
   * Adds a guess to the CPU's history
   * @param {string} coordinate - Coordinate that was guessed
   */
  addGuess(coordinate) {
    if (!this.hasGuessed(coordinate)) {
      this.guessHistory.push({
        coordinate,
        timestamp: new Date(),
        mode: this.mode
      });
    }
  }

  /**
   * Adds a hit to the CPU's hit history
   * @param {string} coordinate - Coordinate that was hit
   */
  addHit(coordinate) {
    this.hitHistory.push({
      coordinate,
      timestamp: new Date()
    });
  }

  /**
   * Checks if the CPU has already guessed a coordinate
   * @param {string} coordinate - Coordinate to check
   * @returns {boolean} True if already guessed
   */
  hasGuessed(coordinate) {
    return this.guessHistory.some(guess => guess.coordinate === coordinate);
  }

  /**
   * Gets the current AI mode
   * @returns {string} Current mode (hunt or target)
   */
  getMode() {
    return this.mode;
  }

  /**
   * Gets the number of coordinates in the target queue
   * @returns {number} Target queue length
   */
  getTargetQueueLength() {
    return this.targetQueue.length;
  }

  /**
   * Gets a copy of the target queue
   * @returns {Array<string>} Copy of target queue
   */
  getTargetQueue() {
    return [...this.targetQueue];
  }

  /**
   * Gets the number of guesses made by the CPU
   * @returns {number} Number of guesses
   */
  getGuessCount() {
    return this.guessHistory.length;
  }

  /**
   * Gets the number of hits made by the CPU
   * @returns {number} Number of hits
   */
  getHitCount() {
    return this.hitHistory.length;
  }

  /**
   * Gets the CPU's hit rate
   * @returns {number} Hit rate as percentage (0-100)
   */
  getHitRate() {
    if (this.getGuessCount() === 0) return 0;
    return (this.getHitCount() / this.getGuessCount()) * 100;
  }

  /**
   * Gets the CPU's guess history
   * @returns {Array} Array of guess objects
   */
  getGuessHistory() {
    return [...this.guessHistory];
  }

  /**
   * Gets the CPU's hit history
   * @returns {Array} Array of hit objects
   */
  getHitHistory() {
    return [...this.hitHistory];
  }

  /**
   * Resets the CPU's state
   */
  reset() {
    this.mode = CPU_MODES.HUNT;
    this.targetQueue = [];
    this.guessHistory = [];
    this.hitHistory = [];
  }

  /**
   * Gets CPU statistics
   * @returns {Object} Statistics object
   */
  getStats() {
    return {
      name: this.name,
      mode: this.mode,
      totalGuesses: this.getGuessCount(),
      totalHits: this.getHitCount(),
      hitRate: this.getHitRate(),
      targetQueueLength: this.getTargetQueueLength()
    };
  }

  /**
   * Gets the CPU's name
   * @returns {string} CPU name
   */
  getName() {
    return this.name;
  }

  /**
   * Sets the CPU's name
   * @param {string} name - New name for the CPU
   */
  setName(name) {
    this.name = name || 'CPU';
  }

  /**
   * Returns a string representation of the CPU
   * @returns {string} CPU info string
   */
  toString() {
    return `CPU: ${this.name} (Mode: ${this.mode}, Guesses: ${this.getGuessCount()}, Hits: ${this.getHitCount()})`;
  }
} 