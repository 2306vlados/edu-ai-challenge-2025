// Game configuration constants
export const BOARD_SIZE = 10;
export const NUM_SHIPS = 3;
export const SHIP_LENGTH = 3;

// Board cell states
export const CELL_STATES = {
  WATER: '~',
  SHIP: 'S',
  HIT: 'X',
  MISS: 'O'
};

// CPU AI modes
export const CPU_MODES = {
  HUNT: 'hunt',
  TARGET: 'target'
};

// Game messages
export const MESSAGES = {
  PLAYER_HIT: 'PLAYER HIT!',
  PLAYER_MISS: 'PLAYER MISS.',
  CPU_HIT: 'CPU HIT',
  CPU_MISS: 'CPU MISS',
  SHIP_SUNK_PLAYER: 'You sunk an enemy battleship!',
  SHIP_SUNK_CPU: 'CPU sunk your battleship!',
  PLAYER_WINS: '*** CONGRATULATIONS! You sunk all enemy battleships! ***',
  CPU_WINS: '*** GAME OVER! The CPU sunk all your battleships! ***',
  INVALID_INPUT: 'Oops, input must be exactly two digits (e.g., 00, 34, 98).',
  INVALID_COORDINATES: 'Oops, please enter valid row and column numbers between 0 and',
  DUPLICATE_GUESS: 'You already guessed that location!',
  ALREADY_HIT: 'You already hit that spot!'
}; 