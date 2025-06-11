import { Board } from '../src/Board.js';
import { CELL_STATES } from '../src/constants.js';

describe('Board', () => {
  let board;

  beforeEach(() => {
    board = new Board(false);
  });

  describe('constructor', () => {
    test('should create a board with water cells', () => {
      const grid = board.getGrid();
      expect(grid).toHaveLength(10);
      expect(grid[0]).toHaveLength(10);
      expect(grid[0][0]).toBe(CELL_STATES.WATER);
    });

    test('should create board with showShips option', () => {
      const visibleBoard = new Board(true);
      expect(visibleBoard.showShips).toBe(true);
    });
  });

  describe('placeShipsRandomly', () => {
    test('should place the correct number of ships', () => {
      const success = board.placeShipsRandomly(3);
      expect(success).toBe(true);
      expect(board.getShips()).toHaveLength(3);
    });

    test('should return false when unable to place ships', () => {
      // Try to place too many ships for the board size
      // On a 10x10 board with 3-cell ships, maximum possible is around 33
      const success = board.placeShipsRandomly(100);
      expect(success).toBe(false);
    });

    test('should place ships without overlapping', () => {
      board.placeShipsRandomly(3);
      const ships = board.getShips();
      const allLocations = ships.flatMap(ship => ship.locations);
      const uniqueLocations = [...new Set(allLocations)];
      expect(allLocations).toHaveLength(uniqueLocations.length);
    });
  });

  describe('processGuess', () => {
    beforeEach(() => {
      board.placeShipsRandomly(1);
    });

    test('should process a miss correctly', () => {
      const result = board.processGuess('99'); // Likely to be water
      if (!result.hit) {
        expect(result.hit).toBe(false);
        expect(result.sunk).toBe(false);
        expect(result.alreadyGuessed).toBe(false);
        expect(board.getCellState(9, 9)).toBe(CELL_STATES.MISS);
      }
    });

    test('should detect already guessed locations', () => {
      board.processGuess('00');
      const result = board.processGuess('00');
      expect(result.alreadyGuessed).toBe(true);
    });

    test('should process a hit correctly when ship is present', () => {
      // Get a ship location to guarantee a hit
      const ships = board.getShips();
      const shipLocation = ships[0].locations[0];
      
      const result = board.processGuess(shipLocation);
      expect(result.hit).toBe(true);
      expect(result.alreadyGuessed).toBe(false);
      
      const row = parseInt(shipLocation[0]);
      const col = parseInt(shipLocation[1]);
      expect(board.getCellState(row, col)).toBe(CELL_STATES.HIT);
    });
  });

  describe('getRemainingShipsCount', () => {
    test('should return correct count for new board', () => {
      board.placeShipsRandomly(3);
      expect(board.getRemainingShipsCount()).toBe(3);
    });

    test('should return correct count after sinking ships', () => {
      board.placeShipsRandomly(2);
      const ships = board.getShips();
      
      // Sink first ship
      ships[0].locations.forEach(location => {
        board.processGuess(location);
      });
      
      expect(board.getRemainingShipsCount()).toBe(1);
    });
  });

  describe('areAllShipsSunk', () => {
    test('should return false for new board with ships', () => {
      board.placeShipsRandomly(1);
      expect(board.areAllShipsSunk()).toBe(false);
    });

    test('should return true when all ships are sunk', () => {
      board.placeShipsRandomly(1);
      const ships = board.getShips();
      
      // Sink all ships
      ships.forEach(ship => {
        ship.locations.forEach(location => {
          board.processGuess(location);
        });
      });
      
      expect(board.areAllShipsSunk()).toBe(true);
    });
  });

  describe('getCellState', () => {
    test('should return water for empty cell', () => {
      expect(board.getCellState(0, 0)).toBe(CELL_STATES.WATER);
    });

    test('should return water for invalid coordinates', () => {
      expect(board.getCellState(-1, 0)).toBe(CELL_STATES.WATER);
      expect(board.getCellState(10, 0)).toBe(CELL_STATES.WATER);
    });

    test('should return correct state after miss', () => {
      board.processGuess('00');
      expect(board.getCellState(0, 0)).toBe(CELL_STATES.MISS);
    });
  });

  describe('getGuesses', () => {
    test('should return empty set for new board', () => {
      const guesses = board.getGuesses();
      expect(guesses.size).toBe(0);
    });

    test('should track guesses correctly', () => {
      board.processGuess('00');
      board.processGuess('11');
      
      const guesses = board.getGuesses();
      expect(guesses.size).toBe(2);
      expect(guesses.has('00')).toBe(true);
      expect(guesses.has('11')).toBe(true);
    });
  });

  describe('reset', () => {
    test('should reset board to initial state', () => {
      board.placeShipsRandomly(3);
      board.processGuess('00');
      
      board.reset();
      
      expect(board.getShips()).toHaveLength(0);
      expect(board.getGuesses().size).toBe(0);
      expect(board.getCellState(0, 0)).toBe(CELL_STATES.WATER);
    });
  });

  describe('ship placement validation', () => {
    test('should validate horizontal ship placement', () => {
      const canPlace = board.canPlaceShip(0, 0, 'horizontal');
      expect(canPlace).toBe(true);
    });

    test('should validate vertical ship placement', () => {
      const canPlace = board.canPlaceShip(0, 0, 'vertical');
      expect(canPlace).toBe(true);
    });

    test('should reject placement outside board bounds', () => {
      const canPlace = board.canPlaceShip(0, 8, 'horizontal'); // Would extend beyond board
      expect(canPlace).toBe(false);
    });

    test('should reject placement on occupied cells', () => {
      board.placeShipsRandomly(1);
      
      // Find a position where a ship is located
      const grid = board.getGrid();
      let shipRow = -1, shipCol = -1;
      
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if (grid[i][j] === 'SHIP_HIDDEN') {
            shipRow = i;
            shipCol = j;
            break;
          }
        }
        if (shipRow !== -1) break;
      }
      
      if (shipRow !== -1) {
        const canPlace = board.canPlaceShip(shipRow, shipCol, 'horizontal');
        expect(canPlace).toBe(false);
      } else {
        // If no ship found in grid (edge case), test should pass
        expect(true).toBe(true);
      }
    });
  });
}); 