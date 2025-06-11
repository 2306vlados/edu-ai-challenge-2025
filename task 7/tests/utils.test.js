import {
  isValidCoordinate,
  formatCoordinate,
  parseCoordinate,
  getAdjacentCoordinates,
  getRandomInt,
  getRandomBoolean
} from '../src/utils.js';

describe('Utils', () => {
  describe('isValidCoordinate', () => {
    test('should return true for valid coordinates', () => {
      expect(isValidCoordinate(0, 0)).toBe(true);
      expect(isValidCoordinate(5, 5)).toBe(true);
      expect(isValidCoordinate(9, 9)).toBe(true);
    });

    test('should return false for invalid coordinates', () => {
      expect(isValidCoordinate(-1, 0)).toBe(false);
      expect(isValidCoordinate(0, -1)).toBe(false);
      expect(isValidCoordinate(10, 0)).toBe(false);
      expect(isValidCoordinate(0, 10)).toBe(false);
      expect(isValidCoordinate(15, 15)).toBe(false);
    });
  });

  describe('formatCoordinate', () => {
    test('should format coordinates correctly', () => {
      expect(formatCoordinate(0, 0)).toBe('00');
      expect(formatCoordinate(3, 4)).toBe('34');
      expect(formatCoordinate(9, 8)).toBe('98');
    });
  });

  describe('parseCoordinate', () => {
    test('should parse valid coordinate strings', () => {
      expect(parseCoordinate('00')).toEqual({ row: 0, col: 0 });
      expect(parseCoordinate('34')).toEqual({ row: 3, col: 4 });
      expect(parseCoordinate('98')).toEqual({ row: 9, col: 8 });
    });

    test('should return NaN for invalid coordinate strings', () => {
      expect(parseCoordinate('')).toEqual({ row: NaN, col: NaN });
      expect(parseCoordinate('0')).toEqual({ row: NaN, col: NaN });
      expect(parseCoordinate('abc')).toEqual({ row: NaN, col: NaN });
      expect(parseCoordinate('123')).toEqual({ row: NaN, col: NaN });
      expect(parseCoordinate(null)).toEqual({ row: NaN, col: NaN });
    });
  });

  describe('getAdjacentCoordinates', () => {
    test('should return all adjacent coordinates for center position', () => {
      const adjacent = getAdjacentCoordinates(5, 5);
      expect(adjacent).toHaveLength(4);
      expect(adjacent).toContainEqual({ row: 4, col: 5 });
      expect(adjacent).toContainEqual({ row: 6, col: 5 });
      expect(adjacent).toContainEqual({ row: 5, col: 4 });
      expect(adjacent).toContainEqual({ row: 5, col: 6 });
    });

    test('should return only valid adjacent coordinates for corner position', () => {
      const adjacent = getAdjacentCoordinates(0, 0);
      expect(adjacent).toHaveLength(2);
      expect(adjacent).toContainEqual({ row: 1, col: 0 });
      expect(adjacent).toContainEqual({ row: 0, col: 1 });
    });

    test('should return only valid adjacent coordinates for edge position', () => {
      const adjacent = getAdjacentCoordinates(0, 5);
      expect(adjacent).toHaveLength(3);
      expect(adjacent).toContainEqual({ row: 1, col: 5 });
      expect(adjacent).toContainEqual({ row: 0, col: 4 });
      expect(adjacent).toContainEqual({ row: 0, col: 6 });
    });
  });

  describe('getRandomInt', () => {
    test('should return a number within the specified range', () => {
      for (let i = 0; i < 100; i++) {
        const result = getRandomInt(0, 10);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(10);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    test('should handle single value range', () => {
      const result = getRandomInt(5, 6);
      expect(result).toBe(5);
    });
  });

  describe('getRandomBoolean', () => {
    test('should return a boolean value', () => {
      for (let i = 0; i < 10; i++) {
        const result = getRandomBoolean();
        expect(typeof result).toBe('boolean');
      }
    });

    test('should return both true and false over multiple calls', () => {
      const results = [];
      for (let i = 0; i < 100; i++) {
        results.push(getRandomBoolean());
      }
      expect(results).toContain(true);
      expect(results).toContain(false);
    });
  });
}); 