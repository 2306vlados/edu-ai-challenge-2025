import { CPU } from '../src/CPU.js';
import { CPU_MODES } from '../src/constants.js';

describe('CPU', () => {
  let cpu;

  beforeEach(() => {
    cpu = new CPU('TestCPU');
  });

  describe('constructor', () => {
    test('should create CPU with correct initial state', () => {
      expect(cpu.getName()).toBe('TestCPU');
      expect(cpu.getMode()).toBe(CPU_MODES.HUNT);
      expect(cpu.getTargetQueueLength()).toBe(0);
      expect(cpu.getGuessCount()).toBe(0);
      expect(cpu.getHitCount()).toBe(0);
    });

    test('should create CPU with default name', () => {
      const defaultCpu = new CPU();
      expect(defaultCpu.getName()).toBe('CPU');
    });
  });

  describe('makeGuess', () => {
    test('should make a valid guess', () => {
      const guess = cpu.makeGuess();
      expect(guess).toMatch(/^[0-9][0-9]$/);
      expect(cpu.getGuessCount()).toBe(1);
    });

    test('should avoid previous guesses', () => {
      const previousGuesses = new Set(['00', '11', '22']);
      const guess = cpu.makeGuess(previousGuesses);
      expect(previousGuesses.has(guess)).toBe(false);
    });

    test('should make targeted guess when in target mode', () => {
      cpu.mode = CPU_MODES.TARGET;
      cpu.targetQueue = ['23', '45'];
      
      const guess = cpu.makeGuess();
      expect(guess).toBe('23');
      expect(cpu.getTargetQueueLength()).toBe(1);
    });
  });

  describe('processGuessResult', () => {
    test('should handle hit result correctly', () => {
      cpu.processGuessResult('44', true, false);
      
      expect(cpu.getMode()).toBe(CPU_MODES.TARGET);
      expect(cpu.getHitCount()).toBe(1);
      expect(cpu.getTargetQueueLength()).toBeGreaterThan(0);
    });

    test('should handle sunk ship correctly', () => {
      cpu.mode = CPU_MODES.TARGET;
      cpu.targetQueue = ['12', '34'];
      
      cpu.processGuessResult('44', true, true);
      
      expect(cpu.getMode()).toBe(CPU_MODES.HUNT);
      expect(cpu.getTargetQueueLength()).toBe(0);
      expect(cpu.getHitCount()).toBe(1);
    });

    test('should handle miss in hunt mode', () => {
      cpu.processGuessResult('44', false, false);
      
      expect(cpu.getMode()).toBe(CPU_MODES.HUNT);
      expect(cpu.getHitCount()).toBe(0);
    });

    test('should handle miss in target mode', () => {
      cpu.mode = CPU_MODES.TARGET;
      cpu.targetQueue = [];
      
      cpu.processGuessResult('44', false, false);
      
      expect(cpu.getMode()).toBe(CPU_MODES.HUNT);
    });
  });

  describe('addAdjacentTargets', () => {
    test('should add valid adjacent coordinates', () => {
      cpu.addAdjacentTargets('44');
      
      const targetQueue = cpu.getTargetQueue();
      expect(targetQueue.length).toBeGreaterThan(0);
      expect(targetQueue).toContain('34');
      expect(targetQueue).toContain('54');
      expect(targetQueue).toContain('43');
      expect(targetQueue).toContain('45');
    });

    test('should not add invalid adjacent coordinates', () => {
      cpu.addAdjacentTargets('00');
      
      const targetQueue = cpu.getTargetQueue();
      expect(targetQueue).toContain('10');     // Valid coordinate
      expect(targetQueue).toContain('01');     // Valid coordinate
      expect(targetQueue).toHaveLength(2);     // Only 2 valid adjacent for corner
    });

    test('should not add already guessed coordinates', () => {
      cpu.addGuess('34');
      cpu.addAdjacentTargets('44');
      
      const targetQueue = cpu.getTargetQueue();
      expect(targetQueue).not.toContain('34');
    });
  });

  describe('hasGuessed', () => {
    test('should return false for new coordinate', () => {
      expect(cpu.hasGuessed('44')).toBe(false);
    });

    test('should return true for guessed coordinate', () => {
      cpu.addGuess('44');
      expect(cpu.hasGuessed('44')).toBe(true);
    });
  });

  describe('getHitRate', () => {
    test('should return 0 for no guesses', () => {
      expect(cpu.getHitRate()).toBe(0);
    });

    test('should calculate correct hit rate', () => {
      cpu.addGuess('00');
      cpu.addGuess('11');
      cpu.addHit('00');
      
      expect(cpu.getHitRate()).toBe(50);
    });

    test('should handle 100% hit rate', () => {
      cpu.addGuess('00');
      cpu.addHit('00');
      
      expect(cpu.getHitRate()).toBe(100);
    });
  });

  describe('getStats', () => {
    test('should return correct statistics', () => {
      cpu.addGuess('00');
      cpu.addHit('00');
      
      const stats = cpu.getStats();
      expect(stats.name).toBe('TestCPU');
      expect(stats.mode).toBe(CPU_MODES.HUNT);
      expect(stats.totalGuesses).toBe(1);
      expect(stats.totalHits).toBe(1);
      expect(stats.hitRate).toBe(100);
      expect(stats.targetQueueLength).toBe(0);
    });
  });

  describe('reset', () => {
    test('should reset CPU to initial state', () => {
      cpu.mode = CPU_MODES.TARGET;
      cpu.targetQueue = ['12', '34'];
      cpu.addGuess('00');
      cpu.addHit('00');
      
      cpu.reset();
      
      expect(cpu.getMode()).toBe(CPU_MODES.HUNT);
      expect(cpu.getTargetQueueLength()).toBe(0);
      expect(cpu.getGuessCount()).toBe(0);
      expect(cpu.getHitCount()).toBe(0);
    });
  });

  describe('setName', () => {
    test('should set CPU name', () => {
      cpu.setName('NewCPU');
      expect(cpu.getName()).toBe('NewCPU');
    });

    test('should handle null name', () => {
      cpu.setName(null);
      expect(cpu.getName()).toBe('CPU');
    });
  });

  describe('toString', () => {
    test('should return correct string representation', () => {
      cpu.addGuess('00');
      cpu.addHit('00');
      
      const result = cpu.toString();
      expect(result).toBe('CPU: TestCPU (Mode: hunt, Guesses: 1, Hits: 1)');
    });
  });

  describe('guess history tracking', () => {
    test('should track guess history with timestamps and modes', () => {
      cpu.mode = CPU_MODES.HUNT;
      cpu.addGuess('00');
      
      cpu.mode = CPU_MODES.TARGET;
      cpu.addGuess('11');
      
      const history = cpu.getGuessHistory();
      expect(history).toHaveLength(2);
      expect(history[0].coordinate).toBe('00');
      expect(history[0].mode).toBe(CPU_MODES.HUNT);
      expect(history[1].coordinate).toBe('11');
      expect(history[1].mode).toBe(CPU_MODES.TARGET);
    });

    test('should track hit history with timestamps', () => {
      cpu.addHit('00');
      cpu.addHit('11');
      
      const hitHistory = cpu.getHitHistory();
      expect(hitHistory).toHaveLength(2);
      expect(hitHistory[0].coordinate).toBe('00');
      expect(hitHistory[1].coordinate).toBe('11');
      expect(hitHistory[0].timestamp).toBeInstanceOf(Date);
    });
  });

  describe('target queue management', () => {
    test('should return copy of target queue', () => {
      cpu.targetQueue = ['12', '34'];
      const queue = cpu.getTargetQueue();
      
      queue.push('56');
      expect(cpu.getTargetQueueLength()).toBe(2);
    });

    test('should handle empty target queue', () => {
      cpu.mode = CPU_MODES.TARGET;
      const guess = cpu.makeTargetedGuess();
      
      expect(cpu.getMode()).toBe(CPU_MODES.HUNT);
      expect(guess).toMatch(/^[0-9][0-9]$/);
    });
  });
}); 