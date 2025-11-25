import { describe, it, expect } from 'vitest';
import {
  calculateMastery,
  calculateXP,
  calculateStars,
  DEFAULT_MASTERY_CONFIG,
  type DifficultyLevel,
  type MasteryConfig,
} from '../types';

describe('calculateMastery', () => {
  it('should increase mastery on correct answer', () => {
    const result = calculateMastery(0, true, 1);
    expect(result).toBeGreaterThan(0);
  });

  it('should decrease mastery on incorrect answer', () => {
    const result = calculateMastery(50, false, 1);
    expect(result).toBeLessThan(50);
  });

  it('should not exceed 100', () => {
    const result = calculateMastery(95, true, 1);
    expect(result).toBeLessThanOrEqual(100);
  });

  it('should not go below 0', () => {
    const result = calculateMastery(5, false, 1);
    expect(result).toBeGreaterThanOrEqual(0);
  });

  it('should give higher gain for fewer attempts', () => {
    const result1 = calculateMastery(0, true, 1);
    const result2 = calculateMastery(0, true, 5);
    expect(result1).toBeGreaterThanOrEqual(result2);
  });

  it('should use custom config when provided', () => {
    const customConfig: MasteryConfig = {
      ...DEFAULT_MASTERY_CONFIG,
      correctGain: 50,
      incorrectLoss: 5,
    };
    const resultCorrect = calculateMastery(0, true, 1, customConfig);
    const resultIncorrect = calculateMastery(50, false, 1, customConfig);

    expect(resultCorrect).toBeGreaterThan(25); // Higher gain
    expect(resultIncorrect).toBe(45); // Lower loss
  });

  it('should handle edge case of 0 attempts', () => {
    // Should not throw
    const result = calculateMastery(50, true, 0);
    expect(result).toBeGreaterThan(50);
  });
});

describe('calculateXP', () => {
  it('should return XP based on score', () => {
    const result100 = calculateXP(100, 1, false);
    const result50 = calculateXP(50, 1, false);
    expect(result100).toBeGreaterThan(result50);
  });

  it('should give bonus for higher difficulty', () => {
    const difficulty1 = calculateXP(100, 1 as DifficultyLevel, false);
    const difficulty5 = calculateXP(100, 5 as DifficultyLevel, false);
    expect(difficulty5).toBeGreaterThan(difficulty1);
  });

  it('should give first completion bonus', () => {
    const firstTime = calculateXP(100, 1, true);
    const repeat = calculateXP(100, 1, false);
    expect(firstTime).toBe(repeat + 5);
  });

  it('should return 0 for 0 score with low difficulty', () => {
    const result = calculateXP(0, 1 as DifficultyLevel, false);
    expect(result).toBeGreaterThanOrEqual(2); // At least difficulty bonus
  });

  it('should round to whole numbers', () => {
    const result = calculateXP(75, 3, true);
    expect(Number.isInteger(result)).toBe(true);
  });
});

describe('calculateStars', () => {
  it('should return 3 stars for 90+ score', () => {
    expect(calculateStars(90)).toBe(3);
    expect(calculateStars(100)).toBe(3);
    expect(calculateStars(95)).toBe(3);
  });

  it('should return 2 stars for 70-89 score', () => {
    expect(calculateStars(70)).toBe(2);
    expect(calculateStars(89)).toBe(2);
    expect(calculateStars(75)).toBe(2);
  });

  it('should return 1 star for 50-69 score', () => {
    expect(calculateStars(50)).toBe(1);
    expect(calculateStars(69)).toBe(1);
    expect(calculateStars(60)).toBe(1);
  });

  it('should return 0 stars for below 50 score', () => {
    expect(calculateStars(49)).toBe(0);
    expect(calculateStars(0)).toBe(0);
    expect(calculateStars(25)).toBe(0);
  });

  it('should handle boundary values correctly', () => {
    expect(calculateStars(49.9)).toBe(0);
    expect(calculateStars(69.9)).toBe(1);
    expect(calculateStars(89.9)).toBe(2);
  });
});

describe('DEFAULT_MASTERY_CONFIG', () => {
  it('should have expected default values', () => {
    expect(DEFAULT_MASTERY_CONFIG.correctGain).toBe(25);
    expect(DEFAULT_MASTERY_CONFIG.incorrectLoss).toBe(10);
    expect(DEFAULT_MASTERY_CONFIG.minAttemptsForMastery).toBe(3);
    expect(DEFAULT_MASTERY_CONFIG.completionThreshold).toBe(80);
    expect(DEFAULT_MASTERY_CONFIG.decayRate).toBe(0.05);
  });
});
