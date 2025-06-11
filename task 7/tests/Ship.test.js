import { Ship } from '../src/Ship.js';

describe('Ship', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(['00', '01', '02']);
  });

  describe('constructor', () => {
    test('should create a ship with locations', () => {
      expect(ship.locations).toEqual(['00', '01', '02']);
      expect(ship.hits).toEqual([false, false, false]);
    });

    test('should create an empty ship', () => {
      const emptyShip = new Ship();
      expect(emptyShip.locations).toEqual([]);
      expect(emptyShip.hits).toEqual([]);
    });
  });

  describe('hit', () => {
    test('should successfully hit a ship location', () => {
      const result = ship.hit('01');
      expect(result).toBe(true);
      expect(ship.hits[1]).toBe(true);
    });

    test('should return false for invalid location', () => {
      const result = ship.hit('99');
      expect(result).toBe(false);
    });

    test('should return false when hitting same location twice', () => {
      ship.hit('01');
      const result = ship.hit('01');
      expect(result).toBe(false);
    });
  });

  describe('isHitAt', () => {
    test('should return true for hit location', () => {
      ship.hit('01');
      expect(ship.isHitAt('01')).toBe(true);
    });

    test('should return false for unhit location', () => {
      expect(ship.isHitAt('01')).toBe(false);
    });

    test('should return false for invalid location', () => {
      expect(ship.isHitAt('99')).toBe(false);
    });
  });

  describe('hasLocation', () => {
    test('should return true for valid ship location', () => {
      expect(ship.hasLocation('00')).toBe(true);
      expect(ship.hasLocation('01')).toBe(true);
      expect(ship.hasLocation('02')).toBe(true);
    });

    test('should return false for invalid location', () => {
      expect(ship.hasLocation('03')).toBe(false);
      expect(ship.hasLocation('99')).toBe(false);
    });
  });

  describe('isSunk', () => {
    test('should return false for new ship', () => {
      expect(ship.isSunk()).toBe(false);
    });

    test('should return false for partially hit ship', () => {
      ship.hit('00');
      ship.hit('01');
      expect(ship.isSunk()).toBe(false);
    });

    test('should return true for fully hit ship', () => {
      ship.hit('00');
      ship.hit('01');
      ship.hit('02');
      expect(ship.isSunk()).toBe(true);
    });
  });

  describe('getHitCount', () => {
    test('should return 0 for new ship', () => {
      expect(ship.getHitCount()).toBe(0);
    });

    test('should return correct hit count', () => {
      ship.hit('00');
      expect(ship.getHitCount()).toBe(1);
      
      ship.hit('01');
      expect(ship.getHitCount()).toBe(2);
    });
  });

  describe('getHealth', () => {
    test('should return full health for new ship', () => {
      expect(ship.getHealth()).toBe(3);
    });

    test('should return correct health after hits', () => {
      ship.hit('00');
      expect(ship.getHealth()).toBe(2);
      
      ship.hit('01');
      expect(ship.getHealth()).toBe(1);
      
      ship.hit('02');
      expect(ship.getHealth()).toBe(0);
    });
  });

  describe('clone', () => {
    test('should create an exact copy of the ship', () => {
      ship.hit('00');
      const cloned = ship.clone();
      
      expect(cloned.locations).toEqual(ship.locations);
      expect(cloned.hits).toEqual(ship.hits);
      expect(cloned).not.toBe(ship); // Different object
    });

    test('should create independent copy', () => {
      const cloned = ship.clone();
      ship.hit('00');
      
      expect(ship.isHitAt('00')).toBe(true);
      expect(cloned.isHitAt('00')).toBe(false);
    });
  });

  describe('toString', () => {
    test('should return correct string for healthy ship', () => {
      const result = ship.toString();
      expect(result).toBe('Ship[00,01,02] - 3/3');
    });

    test('should return correct string for damaged ship', () => {
      ship.hit('00');
      const result = ship.toString();
      expect(result).toBe('Ship[00,01,02] - 2/3');
    });

    test('should return correct string for sunk ship', () => {
      ship.hit('00');
      ship.hit('01');
      ship.hit('02');
      const result = ship.toString();
      expect(result).toBe('Ship[00,01,02] - SUNK');
    });
  });
}); 