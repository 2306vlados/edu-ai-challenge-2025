import { SHIP_LENGTH } from './constants.js';

/**
 * Ship class representing a battleship with its locations and hit status
 */
export class Ship {
  /**
   * Creates a new Ship instance
   * @param {Array<string>} locations - Array of coordinate strings where the ship is located
   */
  constructor(locations = []) {
    this.locations = [...locations];
    this.hits = new Array(this.locations.length).fill(false);
  }

  /**
   * Attempts to hit the ship at a given coordinate
   * @param {string} coordinate - Coordinate string to hit
   * @returns {boolean} True if the coordinate hits this ship
   */
  hit(coordinate) {
    const index = this.locations.indexOf(coordinate);
    if (index >= 0 && !this.hits[index]) {
      this.hits[index] = true;
      return true;
    }
    return false;
  }

  /**
   * Checks if the ship has been hit at a specific coordinate
   * @param {string} coordinate - Coordinate string to check
   * @returns {boolean} True if the ship has been hit at this coordinate
   */
  isHitAt(coordinate) {
    const index = this.locations.indexOf(coordinate);
    return index >= 0 && this.hits[index];
  }

  /**
   * Checks if the ship contains a specific coordinate
   * @param {string} coordinate - Coordinate string to check
   * @returns {boolean} True if the ship is at this coordinate
   */
  hasLocation(coordinate) {
    return this.locations.includes(coordinate);
  }

  /**
   * Checks if the ship is completely sunk (all locations hit)
   * @returns {boolean} True if the ship is sunk
   */
  isSunk() {
    return this.hits.every(hit => hit);
  }

  /**
   * Gets the number of hits on this ship
   * @returns {number} Number of hits
   */
  getHitCount() {
    return this.hits.filter(hit => hit).length;
  }

  /**
   * Gets the ship's health (remaining unhit locations)
   * @returns {number} Number of unhit locations
   */
  getHealth() {
    return this.locations.length - this.getHitCount();
  }

  /**
   * Creates a copy of the ship
   * @returns {Ship} New Ship instance with the same data
   */
  clone() {
    const clonedShip = new Ship(this.locations);
    clonedShip.hits = [...this.hits];
    return clonedShip;
  }

  /**
   * Returns a string representation of the ship
   * @returns {string} Ship status string
   */
  toString() {
    const status = this.isSunk() ? 'SUNK' : `${this.getHealth()}/${this.locations.length}`;
    return `Ship[${this.locations.join(',')}] - ${status}`;
  }
} 