import { describe, it, expect } from 'vitest';
import {
  INTEREST_THEMES,
  MASCOTS,
  getInterestThemeIds,
  getMascotIds,
  getTheme,
  getMascot,
  getMascotsForInterests,
  getRandomMascotMessage,
  getCountingEmojis,
  getRandomThemeEmoji,
  getThemeColorVars,
  DEFAULT_THEME_ID,
  DEFAULT_MASCOT_ID,
  type InterestThemeId,
  type MascotId,
} from '../theme-data';

describe('theme-data', () => {
  describe('INTEREST_THEMES', () => {
    it('should have 6 interest themes', () => {
      expect(Object.keys(INTEREST_THEMES)).toHaveLength(6);
    });

    it('should have required theme IDs', () => {
      const expectedThemes: InterestThemeId[] = [
        'robots',
        'dinosaurs',
        'lizards',
        'cars',
        'rockets',
        'spaceships',
      ];
      expectedThemes.forEach((themeId) => {
        expect(INTEREST_THEMES[themeId]).toBeDefined();
      });
    });

    it('each theme should have required properties', () => {
      Object.values(INTEREST_THEMES).forEach((theme) => {
        expect(theme.id).toBeDefined();
        expect(theme.name).toBeDefined();
        expect(theme.icon).toBeDefined();
        expect(theme.emojis).toBeInstanceOf(Array);
        expect(theme.emojis.length).toBeGreaterThanOrEqual(5);
        expect(theme.colors).toBeDefined();
        expect(theme.colors.primary).toBeDefined();
        expect(theme.colors.secondary).toBeDefined();
        expect(theme.colors.background).toBeDefined();
        expect(theme.colors.accent).toBeDefined();
        expect(theme.colors.gradient).toBeDefined();
        expect(theme.mascot).toBeDefined();
        expect(theme.celebrationEmojis).toBeInstanceOf(Array);
        expect(theme.description).toBeDefined();
      });
    });
  });

  describe('MASCOTS', () => {
    it('should have 7 mascots', () => {
      expect(Object.keys(MASCOTS)).toHaveLength(7);
    });

    it('should have required mascot IDs', () => {
      const expectedMascots: MascotId[] = [
        'owl',
        'robot',
        'dinosaur',
        'lizard',
        'car',
        'rocket',
        'spaceship',
      ];
      expectedMascots.forEach((mascotId) => {
        expect(MASCOTS[mascotId]).toBeDefined();
      });
    });

    it('each mascot should have required properties', () => {
      Object.values(MASCOTS).forEach((mascot) => {
        expect(mascot.id).toBeDefined();
        expect(mascot.name).toBeDefined();
        expect(mascot.emoji).toBeDefined();
        expect(mascot.personality).toBeDefined();
        expect(mascot.tagline).toBeDefined();
        expect(mascot.relatedThemes).toBeInstanceOf(Array);
        expect(mascot.messages).toBeDefined();
        expect(mascot.messages.happy).toBeInstanceOf(Array);
        expect(mascot.messages.excited).toBeInstanceOf(Array);
        expect(mascot.messages.encouraging).toBeInstanceOf(Array);
        expect(mascot.messages.celebrating).toBeInstanceOf(Array);
        expect(mascot.messages.thinking).toBeInstanceOf(Array);
        expect(mascot.messages.greeting).toBeInstanceOf(Array);
      });
    });
  });

  describe('getInterestThemeIds', () => {
    it('should return all theme IDs', () => {
      const ids = getInterestThemeIds();
      expect(ids).toHaveLength(6);
      expect(ids).toContain('robots');
      expect(ids).toContain('dinosaurs');
    });
  });

  describe('getMascotIds', () => {
    it('should return all mascot IDs', () => {
      const ids = getMascotIds();
      expect(ids).toHaveLength(7);
      expect(ids).toContain('owl');
      expect(ids).toContain('robot');
    });
  });

  describe('getTheme', () => {
    it('should return the correct theme by ID', () => {
      const theme = getTheme('robots');
      expect(theme.id).toBe('robots');
      expect(theme.name).toBe('Robots');
      expect(theme.icon).toBe('🤖');
    });
  });

  describe('getMascot', () => {
    it('should return the correct mascot by ID', () => {
      const mascot = getMascot('owl');
      expect(mascot.id).toBe('owl');
      expect(mascot.name).toBe('Ollie');
      expect(mascot.emoji).toBe('🦉');
    });
  });

  describe('getMascotsForInterests', () => {
    it('should always include owl mascot', () => {
      const mascots = getMascotsForInterests([]);
      expect(mascots.some((m) => m.id === 'owl')).toBe(true);
    });

    it('should include related mascots for selected interests', () => {
      const mascots = getMascotsForInterests(['robots', 'dinosaurs']);
      const ids = mascots.map((m) => m.id);
      expect(ids).toContain('owl');
      expect(ids).toContain('robot');
      expect(ids).toContain('dinosaur');
    });
  });

  describe('getRandomMascotMessage', () => {
    it('should return a string message', () => {
      const message = getRandomMascotMessage('owl', 'happy');
      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });

    it('should return message from correct category', () => {
      const message = getRandomMascotMessage('owl', 'greeting');
      const greetings = MASCOTS.owl.messages.greeting;
      expect(greetings).toContain(message);
    });
  });

  describe('getCountingEmojis', () => {
    it('should return emojis for a theme', () => {
      const emojis = getCountingEmojis('robots');
      expect(emojis).toBeInstanceOf(Array);
      expect(emojis.length).toBeGreaterThanOrEqual(5);
      expect(emojis).toContain('🤖');
    });
  });

  describe('getRandomThemeEmoji', () => {
    it('should return an emoji from the theme', () => {
      const emoji = getRandomThemeEmoji('dinosaurs');
      const themeEmojis = INTEREST_THEMES.dinosaurs.emojis;
      expect(themeEmojis).toContain(emoji);
    });
  });

  describe('getThemeColorVars', () => {
    it('should return CSS variables object', () => {
      const vars = getThemeColorVars('robots');
      expect(vars['--theme-primary']).toBe(INTEREST_THEMES.robots.colors.primary);
      expect(vars['--theme-secondary']).toBe(INTEREST_THEMES.robots.colors.secondary);
      expect(vars['--theme-background']).toBe(INTEREST_THEMES.robots.colors.background);
      expect(vars['--theme-accent']).toBe(INTEREST_THEMES.robots.colors.accent);
    });
  });

  describe('defaults', () => {
    it('DEFAULT_THEME_ID should be robots', () => {
      expect(DEFAULT_THEME_ID).toBe('robots');
    });

    it('DEFAULT_MASCOT_ID should be owl', () => {
      expect(DEFAULT_MASCOT_ID).toBe('owl');
    });
  });
});
