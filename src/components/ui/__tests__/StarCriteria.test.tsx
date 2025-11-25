import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StarCriteria, calculateStars } from '../StarCriteria';

describe('StarCriteria', () => {
  describe('full variant', () => {
    it('should render title', () => {
      render(<StarCriteria />);
      expect(screen.getByText('How to Earn Stars')).toBeInTheDocument();
    });

    it('should display default thresholds', () => {
      render(<StarCriteria />);
      expect(screen.getByText('Complete the activity')).toBeInTheDocument();
      expect(screen.getByText('Get 70%+ correct')).toBeInTheDocument();
      expect(screen.getByText('Get 90%+ correct')).toBeInTheDocument();
    });

    it('should display custom thresholds', () => {
      render(
        <StarCriteria
          thresholds={{ oneStar: 0, twoStars: 60, threeStars: 80 }}
        />
      );
      expect(screen.getByText('Get 60%+ correct')).toBeInTheDocument();
      expect(screen.getByText('Get 80%+ correct')).toBeInTheDocument();
    });

    it('should show current score when provided', () => {
      render(<StarCriteria currentScore={85} />);
      expect(screen.getByText('Current Score:')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
    });

    it('should mark achieved criteria with checkmark', () => {
      render(<StarCriteria currentScore={75} />);
      // Should have checkmarks for 1 and 2 stars (included in text with space)
      const checkmarks = screen.getAllByText(/✓/);
      expect(checkmarks.length).toBe(2);
    });
  });

  describe('compact variant', () => {
    it('should render compact view', () => {
      render(<StarCriteria variant="compact" />);
      expect(screen.getByText('Finish')).toBeInTheDocument();
      expect(screen.getByText('70%')).toBeInTheDocument();
      expect(screen.getByText('90%')).toBeInTheDocument();
    });
  });

  describe('tooltip variant', () => {
    it('should render info button', () => {
      render(<StarCriteria variant="tooltip" />);
      expect(screen.getByRole('button', { name: 'How to earn stars' })).toBeInTheDocument();
    });

    it('should show tooltip on hover', () => {
      render(<StarCriteria variant="tooltip" />);
      const button = screen.getByRole('button', { name: 'How to earn stars' });

      fireEvent.mouseEnter(button);
      expect(screen.getByText('Earn Stars:')).toBeInTheDocument();
    });

    it('should hide tooltip on mouse leave', () => {
      render(<StarCriteria variant="tooltip" />);
      const button = screen.getByRole('button', { name: 'How to earn stars' });

      fireEvent.mouseEnter(button);
      expect(screen.getByText('Earn Stars:')).toBeInTheDocument();

      fireEvent.mouseLeave(button);
      expect(screen.queryByText('Earn Stars:')).not.toBeInTheDocument();
    });
  });
});

describe('calculateStars helper', () => {
  it('should return 3 stars for 90+ score', () => {
    expect(calculateStars(90)).toBe(3);
    expect(calculateStars(100)).toBe(3);
  });

  it('should return 2 stars for 70-89 score', () => {
    expect(calculateStars(70)).toBe(2);
    expect(calculateStars(89)).toBe(2);
  });

  it('should return 1 star for below 70 score', () => {
    expect(calculateStars(69)).toBe(1);
    expect(calculateStars(0)).toBe(1);
    expect(calculateStars(50)).toBe(1);
  });

  it('should use custom thresholds', () => {
    const customThresholds = { oneStar: 0, twoStars: 50, threeStars: 75 };
    expect(calculateStars(50, customThresholds)).toBe(2);
    expect(calculateStars(75, customThresholds)).toBe(3);
  });
});
