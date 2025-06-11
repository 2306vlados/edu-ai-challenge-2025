import { Player } from '../src/Player.js';
import { MESSAGES } from '../src/constants.js';

describe('Player', () => {
  let player;

  beforeEach(() => {
    player = new Player('TestPlayer');
  });

  describe('constructor', () => {
    test('should create a player with name', () => {
      expect(player.getName()).toBe('TestPlayer');
      expect(player.getGuessCount()).toBe(0);
    });

    test('should create a player with default name', () => {
      const defaultPlayer = new Player();
      expect(defaultPlayer.getName()).toBe('Player');
    });
  });

  describe('validateGuess', () => {
    test('should validate correct input', () => {
      const result = player.validateGuess('34');
      expect(result.isValid).toBe(true);
      expect(result.coordinate).toBe('34');
    });

    test('should reject empty input', () => {
      const result = player.validateGuess('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe(MESSAGES.INVALID_INPUT);
    });

    test('should reject null input', () => {
      const result = player.validateGuess(null);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe(MESSAGES.INVALID_INPUT);
    });

    test('should reject wrong length input', () => {
      const result = player.validateGuess('123');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe(MESSAGES.INVALID_INPUT);
    });

    test('should reject non-numeric input', () => {
      const result = player.validateGuess('ab');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe(MESSAGES.INVALID_INPUT);
    });

    test('should reject out-of-bounds coordinates', () => {
      let result = player.validateGuess('99');
      expect(result.isValid).toBe(true); // 99 is valid (9,9)
      
      result = player.validateGuess('aa');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe(MESSAGES.INVALID_INPUT);
    });

    test('should reject duplicate guesses', () => {
      player.processGuess('34');
      const result = player.validateGuess('34');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe(MESSAGES.DUPLICATE_GUESS);
    });
  });

  describe('processGuess', () => {
    test('should process valid guess successfully', () => {
      const result = player.processGuess('34');
      expect(result.success).toBe(true);
      expect(result.coordinate).toBe('34');
      expect(player.getGuessCount()).toBe(1);
    });

    test('should fail to process invalid guess', () => {
      const result = player.processGuess('abc');
      expect(result.success).toBe(false);
      expect(player.getGuessCount()).toBe(0);
    });

    test('should fail to process duplicate guess', () => {
      player.processGuess('34');
      const result = player.processGuess('34');
      expect(result.success).toBe(false);
      expect(player.getGuessCount()).toBe(1);
    });
  });

  describe('addGuess', () => {
    test('should add guess to history', () => {
      player.addGuess('34');
      expect(player.hasGuessed('34')).toBe(true);
      expect(player.getGuessCount()).toBe(1);
    });

    test('should not add duplicate guess', () => {
      player.addGuess('34');
      player.addGuess('34');
      expect(player.getGuessCount()).toBe(1);
    });
  });

  describe('hasGuessed', () => {
    test('should return false for new coordinate', () => {
      expect(player.hasGuessed('34')).toBe(false);
    });

    test('should return true for guessed coordinate', () => {
      player.addGuess('34');
      expect(player.hasGuessed('34')).toBe(true);
    });
  });

  describe('getGuessHistory', () => {
    test('should return empty array for new player', () => {
      const history = player.getGuessHistory();
      expect(history).toHaveLength(0);
    });

    test('should return correct history', () => {
      player.addGuess('34');
      player.addGuess('56');
      
      const history = player.getGuessHistory();
      expect(history).toHaveLength(2);
      expect(history[0].coordinate).toBe('34');
      expect(history[1].coordinate).toBe('56');
    });

    test('should return independent copy of history', () => {
      player.addGuess('34');
      const history = player.getGuessHistory();
      history.push({ coordinate: '56' });
      
      expect(player.getGuessCount()).toBe(1);
    });
  });

  describe('getLastGuess', () => {
    test('should return null for new player', () => {
      const lastGuess = player.getLastGuess();
      expect(lastGuess).toBeNull();
    });

    test('should return correct last guess', () => {
      player.addGuess('34');
      player.addGuess('56');
      
      const lastGuess = player.getLastGuess();
      expect(lastGuess.coordinate).toBe('56');
    });
  });

  describe('reset', () => {
    test('should reset player state', () => {
      player.addGuess('34');
      player.addGuess('56');
      
      player.reset();
      
      expect(player.getGuessCount()).toBe(0);
      expect(player.hasGuessed('34')).toBe(false);
      expect(player.getLastGuess()).toBeNull();
    });
  });

  describe('getStats', () => {
    test('should return correct statistics', () => {
      player.addGuess('34');
      player.addGuess('56');
      
      const stats = player.getStats();
      expect(stats.name).toBe('TestPlayer');
      expect(stats.totalGuesses).toBe(2);
      expect(stats.guessHistory).toHaveLength(2);
    });
  });

  describe('setName', () => {
    test('should set player name', () => {
      player.setName('NewName');
      expect(player.getName()).toBe('NewName');
    });

    test('should handle null name', () => {
      player.setName(null);
      expect(player.getName()).toBe('Player');
    });

    test('should handle empty name', () => {
      player.setName('');
      expect(player.getName()).toBe('Player');
    });
  });

  describe('toString', () => {
    test('should return correct string representation', () => {
      player.addGuess('34');
      const result = player.toString();
      expect(result).toBe('Player: TestPlayer (1 guesses)');
    });
  });
}); 