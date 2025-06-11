import { BOARD_SIZE, CELL_STATES, SHIP_LENGTH } from './constants.js';
import { Ship } from './Ship.js';
import { isValidCoordinate, formatCoordinate, getRandomInt, getRandomBoolean } from './utils.js';

/**
 * Board class representing a game board with ships and their states
 */
export class Board {
  /**
   * Creates a new Board instance
   * @param {boolean} showShips - Whether to show ships on the board (for player's own board)
   */
  constructor(showShips = false) {
    this.showShips = showShips;
    this.grid = this.createEmptyGrid();
    this.ships = [];
    this.guesses = new Set();
  }

  /**
   * Creates an empty board grid filled with water
   * @returns {Array<Array<string>>} 2D array representing the board
   */
  createEmptyGrid() {
    return Array(BOARD_SIZE).fill(null).map(() => 
      Array(BOARD_SIZE).fill(CELL_STATES.WATER)
    );
  }

  /**
   * Places ships randomly on the board
   * @param {number} numShips - Number of ships to place
   * @returns {boolean} True if all ships were placed successfully
   */
  placeShipsRandomly(numShips) {
    this.ships = [];
    this.grid = this.createEmptyGrid();
    
    let placedShips = 0;
    let attempts = 0;
    const maxAttempts = 1000; // Prevent infinite loops

    while (placedShips < numShips && attempts < maxAttempts) {
      attempts++;
      
      const orientation = getRandomBoolean() ? 'horizontal' : 'vertical';
      const { startRow, startCol } = this.getRandomStartPosition(orientation);
      
      if (this.canPlaceShip(startRow, startCol, orientation)) {
        const ship = this.createShip(startRow, startCol, orientation);
        this.ships.push(ship);
        this.markShipOnGrid(ship);
        placedShips++;
      }
    }

    return placedShips === numShips;
  }

  /**
   * Gets a random starting position for ship placement
   * @param {string} orientation - 'horizontal' or 'vertical'
   * @returns {Object} Object with startRow and startCol properties
   */
  getRandomStartPosition(orientation) {
    if (orientation === 'horizontal') {
      return {
        startRow: getRandomInt(0, BOARD_SIZE),
        startCol: getRandomInt(0, BOARD_SIZE - SHIP_LENGTH + 1)
      };
    } else {
      return {
        startRow: getRandomInt(0, BOARD_SIZE - SHIP_LENGTH + 1),
        startCol: getRandomInt(0, BOARD_SIZE)
      };
    }
  }

  /**
   * Checks if a ship can be placed at the given position
   * @param {number} startRow - Starting row
   * @param {number} startCol - Starting column
   * @param {string} orientation - 'horizontal' or 'vertical'
   * @returns {boolean} True if ship can be placed
   */
  canPlaceShip(startRow, startCol, orientation) {
    for (let i = 0; i < SHIP_LENGTH; i++) {
      const row = orientation === 'horizontal' ? startRow : startRow + i;
      const col = orientation === 'horizontal' ? startCol + i : startCol;
      
      if (!isValidCoordinate(row, col) || 
          (this.grid[row][col] !== CELL_STATES.WATER)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Creates a new ship at the specified position
   * @param {number} startRow - Starting row
   * @param {number} startCol - Starting column
   * @param {string} orientation - 'horizontal' or 'vertical'
   * @returns {Ship} New Ship instance
   */
  createShip(startRow, startCol, orientation) {
    const locations = [];
    
    for (let i = 0; i < SHIP_LENGTH; i++) {
      const row = orientation === 'horizontal' ? startRow : startRow + i;
      const col = orientation === 'horizontal' ? startCol + i : startCol;
      locations.push(formatCoordinate(row, col));
    }
    
    return new Ship(locations);
  }

  /**
   * Marks a ship's locations on the grid
   * @param {Ship} ship - Ship to mark on the grid
   */
  markShipOnGrid(ship) {
    ship.locations.forEach(location => {
      const row = parseInt(location[0]);
      const col = parseInt(location[1]);
      // Always mark ships internally for collision detection
      if (this.showShips) {
        this.grid[row][col] = CELL_STATES.SHIP;
      } else {
        // Mark as occupied but not visible
        this.grid[row][col] = 'SHIP_HIDDEN';
      }
    });
  }

  /**
   * Processes a guess at the given coordinates
   * @param {string} coordinate - Coordinate string to guess
   * @returns {Object} Result object with hit, sunk, and message properties
   */
  processGuess(coordinate) {
    if (this.guesses.has(coordinate)) {
      return {
        hit: false,
        sunk: false,
        alreadyGuessed: true,
        message: 'Already guessed this location'
      };
    }

    this.guesses.add(coordinate);
    const row = parseInt(coordinate[0]);
    const col = parseInt(coordinate[1]);

    // Check if any ship is hit
    for (const ship of this.ships) {
      if (ship.hasLocation(coordinate)) {
        if (ship.isHitAt(coordinate)) {
          return {
            hit: false,
            sunk: false,
            alreadyGuessed: true,
            message: 'Already hit this location'
          };
        }
        
        ship.hit(coordinate);
        this.grid[row][col] = CELL_STATES.HIT;
        
        return {
          hit: true,
          sunk: ship.isSunk(),
          alreadyGuessed: false,
          message: ship.isSunk() ? 'Ship sunk!' : 'Hit!'
        };
      }
    }

    // Miss
    this.grid[row][col] = CELL_STATES.MISS;
    return {
      hit: false,
      sunk: false,
      alreadyGuessed: false,
      message: 'Miss!'
    };
  }

  /**
   * Gets the number of remaining ships (not sunk)
   * @returns {number} Number of remaining ships
   */
  getRemainingShipsCount() {
    return this.ships.filter(ship => !ship.isSunk()).length;
  }

  /**
   * Checks if all ships are sunk
   * @returns {boolean} True if all ships are sunk
   */
  areAllShipsSunk() {
    return this.getRemainingShipsCount() === 0;
  }

  /**
   * Gets the current state of a cell
   * @param {number} row - Row coordinate
   * @param {number} col - Column coordinate
   * @returns {string} Cell state
   */
  getCellState(row, col) {
    if (!isValidCoordinate(row, col)) {
      return CELL_STATES.WATER;
    }
    return this.grid[row][col];
  }

  /**
   * Gets a copy of the board grid
   * @returns {Array<Array<string>>} Copy of the board grid
   */
  getGrid() {
    return this.grid.map(row => [...row]);
  }

  /**
   * Gets a copy of all ships
   * @returns {Array<Ship>} Copy of all ships
   */
  getShips() {
    return this.ships.map(ship => ship.clone());
  }

  /**
   * Gets all guessed coordinates
   * @returns {Set<string>} Set of guessed coordinates
   */
  getGuesses() {
    return new Set(this.guesses);
  }

  /**
   * Resets the board to initial state
   */
  reset() {
    this.grid = this.createEmptyGrid();
    this.ships = [];
    this.guesses = new Set();
  }
} 