/**
 * Interest-Based Theme System
 *
 * Provides themed content for children's interests:
 * robots, dinosaurs, lizards, cars, rockets, spaceships
 */

// ============ TYPES ============

export type InterestThemeId = 'robots' | 'dinosaurs' | 'lizards' | 'cars' | 'rockets' | 'spaceships';
export type MascotId = 'owl' | 'robot' | 'dinosaur' | 'lizard' | 'car' | 'rocket' | 'spaceship';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  accent: string;
  gradient: string;
}

export interface InterestTheme {
  id: InterestThemeId;
  name: string;
  icon: string;
  emojis: string[];
  colors: ThemeColors;
  mascot: MascotId;
  celebrationEmojis: string[];
  description: string;
}

export interface MascotMessages {
  happy: string[];
  excited: string[];
  encouraging: string[];
  celebrating: string[];
  thinking: string[];
  greeting: string[];
}

export interface MascotConfig {
  id: MascotId;
  name: string;
  emoji: string;
  personality: string;
  tagline: string;
  messages: MascotMessages;
  relatedThemes: InterestThemeId[];
}

// ============ THEME REGISTRY ============

export const INTEREST_THEMES: Record<InterestThemeId, InterestTheme> = {
  robots: {
    id: 'robots',
    name: 'Robots',
    icon: '🤖',
    emojis: ['🤖', '⚙️', '🔧', '🦾', '🔩'],
    colors: {
      primary: '#6366F1',     // Indigo
      secondary: '#818CF8',   // Light indigo
      background: '#EEF2FF',  // Very light indigo
      accent: '#F59E0B',      // Amber for contrast
      gradient: 'from-indigo-400 via-violet-400 to-purple-400',
    },
    mascot: 'robot',
    celebrationEmojis: ['🤖', '⚡', '🎉', '✨', '🦾'],
    description: 'Beep boop! Learn with cool robots!',
  },
  dinosaurs: {
    id: 'dinosaurs',
    name: 'Dinosaurs',
    icon: '🦕',
    emojis: ['🦕', '🦖', '🦴', '🥚', '🌋'],
    colors: {
      primary: '#22C55E',     // Green
      secondary: '#4ADE80',   // Light green
      background: '#F0FDF4',  // Very light green
      accent: '#F97316',      // Orange for contrast
      gradient: 'from-green-400 via-emerald-400 to-teal-400',
    },
    mascot: 'dinosaur',
    celebrationEmojis: ['🦕', '🦖', '🎉', '⭐', '🌟'],
    description: 'ROAR! Dino-mite learning adventures!',
  },
  lizards: {
    id: 'lizards',
    name: 'Lizards',
    icon: '🦎',
    emojis: ['🦎', '🐊', '🐢', '🐍', '🦜'],
    colors: {
      primary: '#14B8A6',     // Teal
      secondary: '#2DD4BF',   // Light teal
      background: '#F0FDFA',  // Very light teal
      accent: '#EC4899',      // Pink for contrast
      gradient: 'from-teal-400 via-cyan-400 to-emerald-400',
    },
    mascot: 'lizard',
    celebrationEmojis: ['🦎', '🐢', '🎉', '💚', '✨'],
    description: 'Sssuper cool reptile learning!',
  },
  cars: {
    id: 'cars',
    name: 'Cars',
    icon: '🚗',
    emojis: ['🚗', '🚙', '🏎️', '🚕', '🚓'],
    colors: {
      primary: '#EF4444',     // Red
      secondary: '#F87171',   // Light red
      background: '#FEF2F2',  // Very light red
      accent: '#3B82F6',      // Blue for contrast
      gradient: 'from-red-400 via-orange-400 to-yellow-400',
    },
    mascot: 'car',
    celebrationEmojis: ['🚗', '🏎️', '🎉', '🏁', '⭐'],
    description: 'VROOM! Fast and fun learning!',
  },
  rockets: {
    id: 'rockets',
    name: 'Rockets',
    icon: '🚀',
    emojis: ['🚀', '🛸', '🌙', '⭐', '🌍'],
    colors: {
      primary: '#3B82F6',     // Blue
      secondary: '#60A5FA',   // Light blue
      background: '#EFF6FF',  // Very light blue
      accent: '#F59E0B',      // Amber for contrast
      gradient: 'from-blue-400 via-indigo-400 to-violet-400',
    },
    mascot: 'rocket',
    celebrationEmojis: ['🚀', '🌟', '🎉', '✨', '🌙'],
    description: 'Blast off to learning adventures!',
  },
  spaceships: {
    id: 'spaceships',
    name: 'Spaceships',
    icon: '🛸',
    emojis: ['🛸', '🚀', '👽', '🛰️', '🌌'],
    colors: {
      primary: '#8B5CF6',     // Purple
      secondary: '#A78BFA',   // Light purple
      background: '#F5F3FF',  // Very light purple
      accent: '#10B981',      // Emerald for contrast
      gradient: 'from-purple-400 via-fuchsia-400 to-pink-400',
    },
    mascot: 'spaceship',
    celebrationEmojis: ['🛸', '👽', '🎉', '🌟', '✨'],
    description: 'Explore the universe of learning!',
  },
};

// ============ MASCOT REGISTRY ============

export const MASCOTS: Record<MascotId, MascotConfig> = {
  owl: {
    id: 'owl',
    name: 'Ollie',
    emoji: '🦉',
    personality: 'Wise and warm',
    tagline: 'Your wise learning friend!',
    relatedThemes: [],
    messages: {
      happy: [
        "You're doing great!",
        "Wonderful work!",
        "I'm so proud of you!",
        "Keep it up!",
      ],
      excited: [
        "Wow! Amazing!",
        "Hoo-hoo! Fantastic!",
        "Incredible job!",
        "You're a superstar!",
      ],
      encouraging: [
        "You can do it!",
        "Try again, I believe in you!",
        "Almost there!",
        "Don't give up!",
      ],
      celebrating: [
        "Whooo! You did it!",
        "Hoo-ray! Perfect!",
        "You're a genius!",
        "Amazing achievement!",
      ],
      thinking: [
        "Hmm, let me think...",
        "What could it be?",
        "Take your time!",
        "Think carefully!",
      ],
      greeting: [
        "Hello, little learner!",
        "Ready to learn today?",
        "Welcome back, friend!",
        "Let's have fun learning!",
      ],
    },
  },
  robot: {
    id: 'robot',
    name: 'Sparky',
    emoji: '🤖',
    personality: 'Helpful and precise',
    tagline: 'BEEP BOOP! Ready to compute fun!',
    relatedThemes: ['robots'],
    messages: {
      happy: [
        "BEEP! Excellent work!",
        "Systems say: GREAT JOB!",
        "Processing... You're awesome!",
        "BOOP! Well done!",
      ],
      excited: [
        "BEEP BOOP BEEP! Amazing!",
        "Circuits overloading with joy!",
        "ERROR 404: Mistakes not found!",
        "Maximum awesome detected!",
      ],
      encouraging: [
        "Recalculating... Try again!",
        "Powering up your brain!",
        "Processing mode: YOU CAN DO IT!",
        "Reboot and retry!",
      ],
      celebrating: [
        "BEEP BOOP! VICTORY!",
        "Achievement unlocked!",
        "Systems confirm: GENIUS!",
        "Robot dance activated!",
      ],
      thinking: [
        "Processing...",
        "Computing possibilities...",
        "Analyzing...",
        "Running brain.exe...",
      ],
      greeting: [
        "BEEP BOOP! Hello, human friend!",
        "Sparky online! Ready to learn?",
        "Systems activated! Let's go!",
        "Greetings, little genius!",
      ],
    },
  },
  dinosaur: {
    id: 'dinosaur',
    name: 'Rex',
    emoji: '🦕',
    personality: 'Brave and friendly',
    tagline: 'ROAR! Let\'s stomp through learning!',
    relatedThemes: ['dinosaurs'],
    messages: {
      happy: [
        "ROAR! Great job!",
        "Dino-mite work!",
        "Stomp stomp! So good!",
        "You're T-riffic!",
      ],
      excited: [
        "ROOOOAR! Amazing!",
        "Prehistoric-ally awesome!",
        "You're a dino-star!",
        "Mega dino cheers!",
      ],
      encouraging: [
        "Stomp back and try again!",
        "Even T-Rex makes mistakes!",
        "You've got dino-strength!",
        "Keep stomping forward!",
      ],
      celebrating: [
        "ROAR! VICTORY!",
        "Dino-mite champion!",
        "You're the king of learning!",
        "Fossil-ized in the Hall of Fame!",
      ],
      thinking: [
        "Hmm... dino-thinking...",
        "My tiny arms are scratching my head...",
        "Stomp stomp... think think...",
        "What did the clever dino do?",
      ],
      greeting: [
        "ROAR! Hello, little friend!",
        "Rex is here! Let's learn!",
        "Stomp stomp! Ready for fun?",
        "A dino-hello to you!",
      ],
    },
  },
  lizard: {
    id: 'lizard',
    name: 'Leo',
    emoji: '🦎',
    personality: 'Cool and calm',
    tagline: 'Sssuper chill learning vibes!',
    relatedThemes: ['lizards'],
    messages: {
      happy: [
        "Ssssuper work!",
        "Cool as a cucumber!",
        "You're cold-blooded awesome!",
        "Lizard high-five!",
      ],
      excited: [
        "Ssssensational!",
        "Totally scale-tacular!",
        "You're sssso amazing!",
        "Tail-waggling excitement!",
      ],
      encouraging: [
        "Sssslide back and try again!",
        "Stay cool, you've got this!",
        "Slow and steady wins!",
        "Reptile resilience!",
      ],
      celebrating: [
        "Ssssuccess!",
        "You're a scale-star!",
        "Champion of the terrarium!",
        "Lizard legend status!",
      ],
      thinking: [
        "Hmm... basking in thought...",
        "Sssslowly considering...",
        "Let me warm up my brain...",
        "Thinking with reptile wisdom...",
      ],
      greeting: [
        "Sssalutations, friend!",
        "Leo here! Let's chill and learn!",
        "Welcome to reptile school!",
        "Ssso good to see you!",
      ],
    },
  },
  car: {
    id: 'car',
    name: 'Zoom',
    emoji: '🏎️',
    personality: 'Fast and enthusiastic',
    tagline: 'VROOM! Racing toward knowledge!',
    relatedThemes: ['cars'],
    messages: {
      happy: [
        "VROOM! Great driving!",
        "You're in the fast lane!",
        "Turbo-charged success!",
        "Racing to the top!",
      ],
      excited: [
        "VROOOOM! AMAZING!",
        "Checkered flag of awesome!",
        "You're on fire! (Not literally!)",
        "Pole position performance!",
      ],
      encouraging: [
        "Pit stop and try again!",
        "Rev up and retry!",
        "Every racer learns curves!",
        "Fuel up with confidence!",
      ],
      celebrating: [
        "VROOM! VICTORY LAP!",
        "Champion of the raceway!",
        "Gold trophy winner!",
        "Hall of Fame racer!",
      ],
      thinking: [
        "Engine idling... thinking...",
        "Cruising through thoughts...",
        "GPS calculating...",
        "Shifting brain into gear...",
      ],
      greeting: [
        "VROOM! Ready to race?",
        "Zoom here! Buckle up!",
        "Start your engines!",
        "Let's hit the learning highway!",
      ],
    },
  },
  rocket: {
    id: 'rocket',
    name: 'Astro',
    emoji: '🧑‍🚀',
    personality: 'Adventurous and brave',
    tagline: 'Houston, we have a learner!',
    relatedThemes: ['rockets'],
    messages: {
      happy: [
        "Mission success!",
        "Stellar work, astronaut!",
        "You're out of this world!",
        "Orbit achieved!",
      ],
      excited: [
        "3, 2, 1... AMAZING!",
        "Blast off to brilliance!",
        "You're a supernova!",
        "Galactic genius!",
      ],
      encouraging: [
        "Re-entry and try again!",
        "Every astronaut practices!",
        "Mission control believes in you!",
        "Adjust trajectory and retry!",
      ],
      celebrating: [
        "HOUSTON, WE HAVE SUCCESS!",
        "Moon landing level achievement!",
        "You're an intergalactic star!",
        "Space legend status!",
      ],
      thinking: [
        "Calculating trajectory...",
        "Consulting the stars...",
        "Space brain activated...",
        "Orbiting the answer...",
      ],
      greeting: [
        "Mission Control here! Ready?",
        "Astronaut Astro reporting!",
        "T-minus learning time!",
        "Welcome aboard, space cadet!",
      ],
    },
  },
  spaceship: {
    id: 'spaceship',
    name: 'Zorp',
    emoji: '👽',
    personality: 'Curious and funny',
    tagline: 'Greetings, Earth child!',
    relatedThemes: ['spaceships'],
    messages: {
      happy: [
        "Earth child smart!",
        "Zorp impressed!",
        "Human brain good!",
        "You make alien happy!",
      ],
      excited: [
        "ZORP AMAZED!",
        "Better than Zorp's homework!",
        "You genius Earth creature!",
        "Mothership will hear of this!",
      ],
      encouraging: [
        "Even aliens make oopsies!",
        "Try again, brave human!",
        "Zorp believes in you!",
        "Earthlings are resilient!",
      ],
      celebrating: [
        "INTERGALACTIC VICTORY!",
        "Zorp reports: CHAMPION!",
        "Earth hero status!",
        "You famous across galaxies!",
      ],
      thinking: [
        "Zorp thinking with three brains...",
        "Analyzing with alien tech...",
        "Hmm... Earth puzzles interesting...",
        "Processing in alien language...",
      ],
      greeting: [
        "Greetings, Earth child!",
        "Zorp come in peace!",
        "Take me to your learning!",
        "Human friend! Let's explore!",
      ],
    },
  },
};

// ============ HELPER FUNCTIONS ============

/**
 * Get all available interest theme IDs
 */
export function getInterestThemeIds(): InterestThemeId[] {
  return Object.keys(INTEREST_THEMES) as InterestThemeId[];
}

/**
 * Get all available mascot IDs
 */
export function getMascotIds(): MascotId[] {
  return Object.keys(MASCOTS) as MascotId[];
}

/**
 * Get theme by ID
 */
export function getTheme(id: InterestThemeId): InterestTheme {
  return INTEREST_THEMES[id];
}

/**
 * Get mascot by ID
 */
export function getMascot(id: MascotId): MascotConfig {
  return MASCOTS[id];
}

/**
 * Get mascots related to specific interests
 */
export function getMascotsForInterests(interests: InterestThemeId[]): MascotConfig[] {
  const relatedMascots = new Set<MascotId>();

  // Always include owl as default option
  relatedMascots.add('owl');

  // Add mascots related to selected interests
  interests.forEach(interest => {
    const theme = INTEREST_THEMES[interest];
    relatedMascots.add(theme.mascot);
  });

  return Array.from(relatedMascots).map(id => MASCOTS[id]);
}

/**
 * Get a random message from a mascot
 */
export function getRandomMascotMessage(
  mascotId: MascotId,
  type: keyof MascotMessages
): string {
  const mascot = MASCOTS[mascotId];
  const messages = mascot.messages[type];
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Get counting emojis for a theme
 */
export function getCountingEmojis(themeId: InterestThemeId): string[] {
  return INTEREST_THEMES[themeId].emojis;
}

/**
 * Get a random emoji from a theme
 */
export function getRandomThemeEmoji(themeId: InterestThemeId): string {
  const emojis = INTEREST_THEMES[themeId].emojis;
  return emojis[Math.floor(Math.random() * emojis.length)];
}

/**
 * Get theme colors as CSS variables object
 */
export function getThemeColorVars(themeId: InterestThemeId): Record<string, string> {
  const colors = INTEREST_THEMES[themeId].colors;
  return {
    '--theme-primary': colors.primary,
    '--theme-secondary': colors.secondary,
    '--theme-background': colors.background,
    '--theme-accent': colors.accent,
  };
}

/**
 * Default theme ID for new users
 */
export const DEFAULT_THEME_ID: InterestThemeId = 'robots';

/**
 * Default mascot ID for new users
 */
export const DEFAULT_MASCOT_ID: MascotId = 'owl';
