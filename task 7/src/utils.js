import { BOARD_SIZE } from './constants.js';

/**
 * Validates if coordinates are within board boundaries
 * @param {number} row - Row coordinate
 * @param {number} col - Column coordinate
 * @returns {boolean} True if coordinates are valid
 */
export const isValidCoordinate = (row, col) => {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
};

/**
 * Formats coordinates as a string
 * @param {number} row - Row coordinate
 * @param {number} col - Column coordinate
 * @returns {string} Formatted coordinate string
 */
export const formatCoordinate = (row, col) => {
  return `${row}${col}`;
};

/**
 * Parses coordinate string into row and column numbers
 * @param {string} coordinateStr - Coordinate string (e.g., "00", "34")
 * @returns {Object} Object with row and col properties
 */
export const parseCoordinate = (coordinateStr) => {
  if (!coordinateStr || coordinateStr.length !== 2) {
    return { row: NaN, col: NaN };
  }
  
  const row = parseInt(coordinateStr[0]);
  const col = parseInt(coordinateStr[1]);
  
  return { row, col };
};

/**
 * Generates adjacent coordinates for a given position
 * @param {number} row - Row coordinate
 * @param {number} col - Column coordinate
 * @returns {Array} Array of adjacent coordinate objects
 */
export const getAdjacentCoordinates = (row, col) => {
  const adjacent = [
    { row: row - 1, col },
    { row: row + 1, col },
    { row, col: col - 1 },
    { row, col: col + 1 }
  ];
  
  return adjacent.filter(coord => isValidCoordinate(coord.row, coord.col));
};

/**
 * Generates a random integer between min (inclusive) and max (exclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * Generates a random boolean value
 * @returns {boolean} Random boolean
 */
export const getRandomBoolean = () => {
  return Math.random() < 0.5;
}; 