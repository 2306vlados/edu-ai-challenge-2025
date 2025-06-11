import { jest } from '@jest/globals';
import { Game } from '../src/Game.js';

// Mock readline to avoid interactive prompts during testing
jest.mock('readline', () => ({
  createInterface: jest.fn(() => ({
    question: jest.fn(),
    close: jest.fn()
  }))
}));

describe('Game', () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  afterEach(() => {
    game.close();
  });

  describe('constructor', () => {
    test('should initialize game with correct initial state', () => {
      expect(game.isGameOver).toBe(false);
      expect(game.winner).toBeNull();
      expect(game.playerBoard).toBeDefined();
      expect(game.cpuBoard).toBeDefined();
      expect(game.player).toBeDefined();
      expect(game.cpu).toBeDefined();
    });
  });

  describe('setupGame', () => {
    test('should successfully setup game', async () => {
      const result = await game.setupGame();
      expect(result).toBe(true);
      expect(game.playerBoard.getShips()).toHaveLength(3);
      expect(game.cpuBoard.getShips()).toHaveLength(3);
    });
  });

  describe('getGameState', () => {
    test('should return correct game state', () => {
      const state = game.getGameState();
      
      expect(state.isGameOver).toBe(false);
      expect(state.winner).toBeNull();
      expect(state.playerBoard).toBeDefined();
      expect(state.cpuBoard).toBeDefined();
      expect(state.playerStats).toBeDefined();
      expect(state.cpuStats).toBeDefined();
    });
  });

  describe('endGame', () => {
    test('should end game with player victory', () => {
      game.gameStartTime = new Date();
      game.endGame(true);
      
      expect(game.isGameOver).toBe(true);
      expect(game.winner).toBe('Player');
      expect(game.gameEndTime).toBeDefined();
    });

    test('should end game with CPU victory', () => {
      game.gameStartTime = new Date();
      game.endGame(false);
      
      expect(game.isGameOver).toBe(true);
      expect(game.winner).toBe('CPU');
      expect(game.gameEndTime).toBeDefined();
    });
  });

  describe('reset', () => {
    test('should reset game to initial state', async () => {
      await game.setupGame();
      game.gameStartTime = new Date();
      game.isGameOver = true;
      game.winner = 'Player';
      
      game.reset();
      
      expect(game.isGameOver).toBe(false);
      expect(game.winner).toBeNull();
      expect(game.gameStartTime).toBeNull();
      expect(game.gameEndTime).toBeNull();
      expect(game.playerBoard.getShips()).toHaveLength(0);
      expect(game.cpuBoard.getShips()).toHaveLength(0);
    });
  });

  describe('getStats', () => {
    test('should return game statistics', async () => {
      await game.setupGame();
      game.gameStartTime = new Date();
      
      const stats = game.getStats();
      
      expect(stats).toHaveProperty('playerShipsRemaining');
      expect(stats).toHaveProperty('cpuShipsRemaining');
      expect(stats).toHaveProperty('playerStats');
      expect(stats).toHaveProperty('cpuStats');
      expect(stats).toHaveProperty('gameDurationMs');
      expect(stats).toHaveProperty('gameDurationSeconds');
    });
  });

  describe('handleCPUTurn', () => {
    test('should handle CPU turn without errors', async () => {
      await game.setupGame();
      
      // Mock console.log to avoid output during tests
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      await game.handleCPUTurn();
      
      expect(game.cpu.getGuessCount()).toBe(1);
      
      consoleSpy.mockRestore();
    });
  });

  describe('game flow validation', () => {
    test('should maintain proper ship counts', async () => {
      await game.setupGame();
      
      const initialPlayerShips = game.playerBoard.getRemainingShipsCount();
      const initialCpuShips = game.cpuBoard.getRemainingShipsCount();
      
      expect(initialPlayerShips).toBe(3);
      expect(initialCpuShips).toBe(3);
    });

    test('should detect game over conditions correctly', async () => {
      await game.setupGame();
      
      // Simulate sinking all CPU ships
      const cpuShips = game.cpuBoard.getShips();
      cpuShips.forEach(ship => {
        ship.locations.forEach(location => {
          game.cpuBoard.processGuess(location);
        });
      });
      
      expect(game.cpuBoard.areAllShipsSunk()).toBe(true);
    });
  });

  describe('board visibility', () => {
    test('should have player board show ships', () => {
      expect(game.playerBoard.showShips).toBe(true);
    });

    test('should have CPU board hide ships', () => {
      expect(game.cpuBoard.showShips).toBe(false);
    });
  });

  describe('player and CPU instances', () => {
    test('should have properly initialized player', () => {
      expect(game.player.getName()).toBe('Player');
      expect(game.player.getGuessCount()).toBe(0);
    });

    test('should have properly initialized CPU', () => {
      expect(game.cpu.getName()).toBe('CPU');
      expect(game.cpu.getGuessCount()).toBe(0);
      expect(game.cpu.getMode()).toBe('hunt');
    });
  });

  describe('game timing', () => {
    test('should track game start time', () => {
      const startTime = new Date();
      game.gameStartTime = startTime;
      
      expect(game.gameStartTime).toBe(startTime);
    });

    test('should calculate game duration correctly', () => {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 60000); // 1 minute later
      
      game.gameStartTime = startTime;
      game.gameEndTime = endTime;
      
      const stats = game.getStats();
      expect(stats.gameDurationMs).toBe(60000);
      expect(stats.gameDurationSeconds).toBe(60);
    });
  });

  describe('error handling', () => {
    test('should handle setup failure gracefully', async () => {
      // Mock placeShipsRandomly to fail
      jest.spyOn(game.playerBoard, 'placeShipsRandomly').mockReturnValue(false);
      
      const result = await game.setupGame();
      expect(result).toBe(false);
    });
  });
}); 