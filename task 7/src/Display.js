import { BOARD_SIZE } from './constants.js';

/**
 * Display class responsible for rendering the game boards and messages to console
 */
export class Display {
  /**
   * Prints both boards side by side (opponent board and player board)
   * @param {Board} opponentBoard - The opponent's board (hidden ships)
   * @param {Board} playerBoard - The player's board (visible ships)
   */
  static printBoards(opponentBoard, playerBoard) {
    console.log('\n   --- OPPONENT BOARD ---          --- YOUR BOARD ---');
    
    // Print header with column numbers
    const header = this.createHeader();
    console.log(`${header}     ${header}`);

    // Print each row
    for (let i = 0; i < BOARD_SIZE; i++) {
      const opponentRow = this.formatBoardRow(i, opponentBoard.getGrid());
      const playerRow = this.formatBoardRow(i, playerBoard.getGrid());
      console.log(`${opponentRow}    ${playerRow}`);
    }
    console.log('\n');
  }

  /**
   * Creates the header row with column numbers
   * @returns {string} Formatted header string
   */
  static createHeader() {
    let header = '  ';
    for (let i = 0; i < BOARD_SIZE; i++) {
      header += `${i} `;
    }
    return header;
  }

  /**
   * Formats a single board row for display
   * @param {number} rowIndex - The row index
   * @param {Array<Array<string>>} grid - The board grid
   * @returns {string} Formatted row string
   */
  static formatBoardRow(rowIndex, grid) {
    let rowStr = `${rowIndex} `;
    for (let j = 0; j < BOARD_SIZE; j++) {
      // Replace SHIP_HIDDEN with water symbol for display
      const cellDisplay = grid[rowIndex][j] === 'SHIP_HIDDEN' ? '~' : grid[rowIndex][j];
      rowStr += `${cellDisplay} `;
    }
    return rowStr;
  }

  /**
   * Prints a single board
   * @param {Board} board - The board to print
   * @param {string} title - Title for the board
   */
  static printBoard(board, title = 'BOARD') {
    console.log(`\n   --- ${title} ---`);
    
    const header = this.createHeader();
    console.log(header);

    const grid = board.getGrid();
    for (let i = 0; i < BOARD_SIZE; i++) {
      console.log(this.formatBoardRow(i, grid));
    }
    console.log('\n');
  }

  /**
   * Prints a message to the console
   * @param {string} message - Message to print
   */
  static printMessage(message) {
    console.log(message);
  }

  /**
   * Prints an error message to the console
   * @param {string} error - Error message to print
   */
  static printError(error) {
    console.log(`ERROR: ${error}`);
  }

  /**
   * Prints a success message to the console
   * @param {string} success - Success message to print
   */
  static printSuccess(success) {
    console.log(`SUCCESS: ${success}`);
  }

  /**
   * Prints a warning message to the console
   * @param {string} warning - Warning message to print
   */
  static printWarning(warning) {
    console.log(`WARNING: ${warning}`);
  }

  /**
   * Prints game statistics
   * @param {Object} stats - Game statistics object
   */
  static printGameStats(stats) {
    console.log('\n--- GAME STATISTICS ---');
    console.log(`Player Ships Remaining: ${stats.playerShipsRemaining}`);
    console.log(`CPU Ships Remaining: ${stats.cpuShipsRemaining}`);
    console.log(`Player Guesses: ${stats.playerGuesses}`);
    console.log(`CPU Guesses: ${stats.cpuGuesses}`);
    console.log(`Game Duration: ${stats.gameDuration || 'N/A'}`);
    console.log('------------------------\n');
  }

  /**
   * Prints the game welcome message
   */
  static printWelcome() {
    console.log('\n🚢 Welcome to Sea Battle! 🚢');
    console.log('=====================================');
    console.log('Try to sink all enemy ships before they sink yours!');
    console.log('Enter coordinates as two digits (e.g., 00, 34, 98)');
    console.log('~ = Water, S = Your Ship, X = Hit, O = Miss');
    console.log('=====================================\n');
  }

  /**
   * Prints the game over message with final results
   * @param {boolean} playerWon - Whether the player won
   * @param {Object} stats - Final game statistics
   */
  static printGameOver(playerWon, stats = {}) {
    console.log('\n🎮 GAME OVER 🎮');
    console.log('=====================================');
    
    if (playerWon) {
      console.log('🎉 CONGRATULATIONS! You won! 🎉');
      console.log('You sunk all enemy battleships!');
    } else {
      console.log('💥 DEFEAT! 💥');
      console.log('The CPU sunk all your battleships!');
    }
    
    console.log('=====================================');
    
    if (Object.keys(stats).length > 0) {
      this.printGameStats(stats);
    }
  }

  /**
   * Clears the console (works in most terminals)
   */
  static clearScreen() {
    console.clear();
  }

  /**
   * Prints a separator line
   */
  static printSeparator() {
    console.log('-------------------------------------');
  }
} 