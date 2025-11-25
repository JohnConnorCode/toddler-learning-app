/**
 * Sound Effects System for Toddler Learning App
 *
 * Provides playful audio feedback for interactions and successes.
 * Uses Web Audio API for low-latency playback.
 */

type SoundEffect = 'pop' | 'snap' | 'chime' | 'fanfare' | 'whoosh' | 'success' | 'celebrate';

// Sound effect library using data URIs for instant playback (no file loading)
// These are generated tones - can be replaced with actual sound files later
class SoundEffectsManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Web Audio API not supported');
      }
    }
  }

  /**
   * Enable or disable sound effects
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * Play a sound effect
   */
  play(effect: SoundEffect) {
    if (!this.enabled || !this.audioContext) return;

    try {
      switch (effect) {
        case 'pop':
          this.playPop();
          break;
        case 'snap':
          this.playSnap();
          break;
        case 'chime':
          this.playChime();
          break;
        case 'fanfare':
          this.playFanfare();
          break;
        case 'whoosh':
          this.playWhoosh();
          break;
        case 'success':
          this.playSuccess();
          break;
        case 'celebrate':
          this.playCelebrate();
          break;
      }
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }

  /**
   * Pop sound - quick, satisfying tap feedback
   */
  private playPop() {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  /**
   * Snap sound - blocks connecting together
   */
  private playSnap() {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.05);
  }

  /**
   * Chime sound - gentle positive feedback
   */
  private playChime() {
    if (!this.audioContext) return;

    const notes = [523.25, 659.25, 783.99]; // C, E, G

    notes.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.frequency.setValueAtTime(freq, this.audioContext!.currentTime);

      const startTime = this.audioContext!.currentTime + (index * 0.1);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);
    });
  }

  /**
   * Fanfare - celebration for completing activity
   */
  private playFanfare() {
    if (!this.audioContext) return;

    const melody = [
      { freq: 523.25, time: 0 },    // C
      { freq: 659.25, time: 0.15 },  // E
      { freq: 783.99, time: 0.3 },   // G
      { freq: 1046.5, time: 0.45 },  // C (high)
    ];

    melody.forEach(({ freq, time }) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.frequency.setValueAtTime(freq, this.audioContext!.currentTime);

      const startTime = this.audioContext!.currentTime + time;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.2);
    });
  }

  /**
   * Whoosh - sliding or dragging sound
   */
  private playWhoosh() {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  /**
   * Success - positive achievement sound
   */
  private playSuccess() {
    if (!this.audioContext) return;

    const notes = [659.25, 783.99, 1046.5]; // E, G, C

    notes.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.frequency.setValueAtTime(freq, this.audioContext!.currentTime);

      const startTime = this.audioContext!.currentTime + (index * 0.08);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.4);
    });
  }

  /**
   * Celebrate - big celebration sound
   */
  private playCelebrate() {
    if (!this.audioContext) return;

    // Play fanfare then success
    this.playFanfare();
    setTimeout(() => this.playSuccess(), 300);
  }

  /**
   * Play a sequence of sounds
   */
  playSequence(effects: SoundEffect[], delay: number = 100) {
    effects.forEach((effect, index) => {
      setTimeout(() => this.play(effect), index * delay);
    });
  }
}

// Create singleton instance
const soundEffects = new SoundEffectsManager();

// Export functions
export function playSound(effect: SoundEffect) {
  soundEffects.play(effect);
}

export function playSoundSequence(effects: SoundEffect[], delay?: number) {
  soundEffects.playSequence(effects, delay);
}

export function setSoundEnabled(enabled: boolean) {
  soundEffects.setEnabled(enabled);
}

// Haptic feedback for mobile devices
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' = 'light') {
  if (typeof window === 'undefined') return;

  try {
    if ('vibrate' in navigator) {
      const duration = type === 'light' ? 10 : type === 'medium' ? 20 : 50;
      navigator.vibrate(duration);
    }
  } catch (error) {
    // Haptics not supported, silently fail
  }
}

// Combined sound + haptic feedback
export function playFeedback(effect: SoundEffect, haptic: 'light' | 'medium' | 'heavy' = 'light') {
  playSound(effect);
  triggerHaptic(haptic);
}
