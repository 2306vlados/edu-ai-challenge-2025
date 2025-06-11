import { parseCoordinate, isValidCoordinate } from './utils.js';
import { BOARD_SIZE, MESSAGES } from './constants.js';

/**
 * Player class representing a human player
 */
export class Player {
  /**
   * Creates a new Player instance
   * @param {string} name - Player's name
   */
  constructor(name = 'Player') {
    this.name = name;
    this.guessHistory = [];
  }

  /**
   * Validates a guess input from the player
   * @param {string} input - Raw input from player
   * @returns {Object} Validation result with isValid, coordinate, and message properties
   */
  validateGuess(input) {
    // Check if input is provided and has correct length
    if (!input || input.length !== 2) {
      return {
        isValid: false,
        coordinate: null,
        message: MESSAGES.INVALID_INPUT
      };
    }

    // Parse coordinates
    const { row, col } = parseCoordinate(input);

    // Check if coordinates are valid numbers
    if (isNaN(row) || isNaN(col)) {
      return {
        isValid: false,
        coordinate: null,
        message: MESSAGES.INVALID_INPUT
      };
    }

    // Check if coordinates are within board boundaries
    if (!isValidCoordinate(row, col)) {
      return {
        isValid: false,
        coordinate: null,
        message: `${MESSAGES.INVALID_COORDINATES} ${BOARD_SIZE - 1}.`
      };
    }

    const coordinate = input;

    // Check if already guessed
    if (this.hasGuessed(coordinate)) {
      return {
        isValid: false,
        coordinate,
        message: MESSAGES.DUPLICATE_GUESS
      };
    }

    return {
      isValid: true,
      coordinate,
      message: 'Valid guess'
    };
  }

  /**
   * Processes a player's guess
   * @param {string} input - Raw input from player
   * @returns {Object} Processing result with success, coordinate, and message properties
   */
  processGuess(input) {
    const validation = this.validateGuess(input);
    
    if (!validation.isValid) {
      return {
        success: false,
        coordinate: validation.coordinate,
        message: validation.message
      };
    }

    // Add to guess history
    this.addGuess(validation.coordinate);

    return {
      success: true,
      coordinate: validation.coordinate,
      message: validation.message
    };
  }

  /**
   * Adds a guess to the player's history
   * @param {string} coordinate - Coordinate that was guessed
   */
  addGuess(coordinate) {
    if (!this.hasGuessed(coordinate)) {
      this.guessHistory.push({
        coordinate,
        timestamp: new Date()
      });
    }
  }

  /**
   * Checks if the player has already guessed a coordinate
   * @param {string} coordinate - Coordinate to check
   * @returns {boolean} True if already guessed
   */
  hasGuessed(coordinate) {
    return this.guessHistory.some(guess => guess.coordinate === coordinate);
  }

  /**
   * Gets the number of guesses made by the player
   * @returns {number} Number of guesses
   */
  getGuessCount() {
    return this.guessHistory.length;
  }

  /**
   * Gets the player's guess history
   * @returns {Array} Array of guess objects
   */
  getGuessHistory() {
    return [...this.guessHistory];
  }

  /**
   * Gets the player's last guess
   * @returns {Object|null} Last guess object or null if no guesses
   */
  getLastGuess() {
    return this.guessHistory.length > 0 
      ? this.guessHistory[this.guessHistory.length - 1] 
      : null;
  }

  /**
   * Resets the player's state
   */
  reset() {
    this.guessHistory = [];
  }

  /**
   * Gets player statistics
   * @returns {Object} Statistics object
   */
  getStats() {
    return {
      name: this.name,
      totalGuesses: this.getGuessCount(),
      guessHistory: this.getGuessHistory()
    };
  }

  /**
   * Gets the player's name
   * @returns {string} Player name
   */
  getName() {
    return this.name;
  }

  /**
   * Sets the player's name
   * @param {string} name - New name for the player
   */
  setName(name) {
    this.name = name || 'Player';
  }

  /**
   * Returns a string representation of the player
   * @returns {string} Player info string
   */
  toString() {
    return `Player: ${this.name} (${this.getGuessCount()} guesses)`;
  }
} 