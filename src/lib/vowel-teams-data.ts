/**
 * Vowel Teams Data - Two vowels that work together to make one sound
 * "When two vowels go walking, the first one does the talking"
 */

export interface VowelTeam {
  id: string;
  team: string;
  sound: string;
  soundType: "long-a" | "long-e" | "long-i" | "long-o" | "long-u" | "diphthong" | "r-controlled" | "other";
  phonemeSpelling: string;
  description: string;
  rule: string;
  exampleWord: string;
  color: string;
}

export interface VowelTeamWord {
  id: string;
  word: string;
  vowelTeamId: string;
  syllables: string[];
  phonemes: string[];
  difficulty: 1 | 2 | 3;
  imageKeyword: string;
}

// Core Vowel Teams
export const VOWEL_TEAMS: VowelTeam[] = [
  // Long A teams
  {
    id: "ai",
    team: "ai",
    sound: "eɪ",
    soundType: "long-a",
    phonemeSpelling: "ay",
    description: "A and I together say 'ay'",
    rule: "When A and I walk together, A says its name",
    exampleWord: "rain",
    color: "bg-blue-400",
  },
  {
    id: "ay",
    team: "ay",
    sound: "eɪ",
    soundType: "long-a",
    phonemeSpelling: "ay",
    description: "A and Y at the end say 'ay'",
    rule: "AY usually comes at the end of words",
    exampleWord: "play",
    color: "bg-yellow-400",
  },

  // Long E teams
  {
    id: "ee",
    team: "ee",
    sound: "iː",
    soundType: "long-e",
    phonemeSpelling: "ee",
    description: "Two E's together say 'ee'",
    rule: "Double E always says 'ee'",
    exampleWord: "tree",
    color: "bg-green-400",
  },
  {
    id: "ea",
    team: "ea",
    sound: "iː",
    soundType: "long-e",
    phonemeSpelling: "ee",
    description: "E and A together usually say 'ee'",
    rule: "EA usually says long E, like in 'eat'",
    exampleWord: "read",
    color: "bg-teal-400",
  },

  // Long O teams
  {
    id: "oa",
    team: "oa",
    sound: "oʊ",
    soundType: "long-o",
    phonemeSpelling: "oh",
    description: "O and A together say 'oh'",
    rule: "When O and A walk together, O says its name",
    exampleWord: "boat",
    color: "bg-orange-400",
  },
  {
    id: "ow-long",
    team: "ow",
    sound: "oʊ",
    soundType: "long-o",
    phonemeSpelling: "oh",
    description: "O and W can say 'oh'",
    rule: "OW at the end often says long O",
    exampleWord: "snow",
    color: "bg-sky-300",
  },

  // OO sounds (two different sounds)
  {
    id: "oo-long",
    team: "oo",
    sound: "uː",
    soundType: "other",
    phonemeSpelling: "oo",
    description: "Double O says 'oo' like in 'moon'",
    rule: "OO can say 'oo' (moon) or 'uh' (book)",
    exampleWord: "moon",
    color: "bg-purple-400",
  },
  {
    id: "oo-short",
    team: "oo",
    sound: "ʊ",
    soundType: "other",
    phonemeSpelling: "uh",
    description: "Double O can say 'uh' like in 'book'",
    rule: "Some OO words say 'uh' instead",
    exampleWord: "book",
    color: "bg-amber-400",
  },

  // Diphthongs (gliding vowel sounds)
  {
    id: "ou",
    team: "ou",
    sound: "aʊ",
    soundType: "diphthong",
    phonemeSpelling: "ow",
    description: "O and U together say 'ow'",
    rule: "OU makes the 'ouch' sound",
    exampleWord: "house",
    color: "bg-red-400",
  },
  {
    id: "ow-diphthong",
    team: "ow",
    sound: "aʊ",
    soundType: "diphthong",
    phonemeSpelling: "ow",
    description: "O and W can say 'ow' like in 'cow'",
    rule: "OW can make the 'ouch' sound too",
    exampleWord: "cow",
    color: "bg-pink-400",
  },
  {
    id: "oi",
    team: "oi",
    sound: "ɔɪ",
    soundType: "diphthong",
    phonemeSpelling: "oy",
    description: "O and I together say 'oy'",
    rule: "OI makes the 'oy' sound in the middle",
    exampleWord: "coin",
    color: "bg-yellow-500",
  },
  {
    id: "oy",
    team: "oy",
    sound: "ɔɪ",
    soundType: "diphthong",
    phonemeSpelling: "oy",
    description: "O and Y at the end say 'oy'",
    rule: "OY makes the 'oy' sound at the end",
    exampleWord: "toy",
    color: "bg-lime-400",
  },
];

// ~100 words organized by vowel team
export const VOWEL_TEAM_WORDS: VowelTeamWord[] = [
  // AI words (10)
  { id: "ai-rain", word: "rain", vowelTeamId: "ai", syllables: ["rain"], phonemes: ["r", "ai", "n"], difficulty: 1, imageKeyword: "rain" },
  { id: "ai-mail", word: "mail", vowelTeamId: "ai", syllables: ["mail"], phonemes: ["m", "ai", "l"], difficulty: 1, imageKeyword: "mail letter" },
  { id: "ai-tail", word: "tail", vowelTeamId: "ai", syllables: ["tail"], phonemes: ["t", "ai", "l"], difficulty: 1, imageKeyword: "tail animal" },
  { id: "ai-nail", word: "nail", vowelTeamId: "ai", syllables: ["nail"], phonemes: ["n", "ai", "l"], difficulty: 1, imageKeyword: "nail" },
  { id: "ai-pail", word: "pail", vowelTeamId: "ai", syllables: ["pail"], phonemes: ["p", "ai", "l"], difficulty: 1, imageKeyword: "pail bucket" },
  { id: "ai-train", word: "train", vowelTeamId: "ai", syllables: ["train"], phonemes: ["t", "r", "ai", "n"], difficulty: 2, imageKeyword: "train" },
  { id: "ai-brain", word: "brain", vowelTeamId: "ai", syllables: ["brain"], phonemes: ["b", "r", "ai", "n"], difficulty: 2, imageKeyword: "brain" },
  { id: "ai-paint", word: "paint", vowelTeamId: "ai", syllables: ["paint"], phonemes: ["p", "ai", "n", "t"], difficulty: 2, imageKeyword: "paint" },
  { id: "ai-wait", word: "wait", vowelTeamId: "ai", syllables: ["wait"], phonemes: ["w", "ai", "t"], difficulty: 1, imageKeyword: "wait" },
  { id: "ai-snail", word: "snail", vowelTeamId: "ai", syllables: ["snail"], phonemes: ["s", "n", "ai", "l"], difficulty: 2, imageKeyword: "snail" },

  // AY words (10)
  { id: "ay-play", word: "play", vowelTeamId: "ay", syllables: ["play"], phonemes: ["p", "l", "ay"], difficulty: 1, imageKeyword: "play" },
  { id: "ay-day", word: "day", vowelTeamId: "ay", syllables: ["day"], phonemes: ["d", "ay"], difficulty: 1, imageKeyword: "day sun" },
  { id: "ay-say", word: "say", vowelTeamId: "ay", syllables: ["say"], phonemes: ["s", "ay"], difficulty: 1, imageKeyword: "say talk" },
  { id: "ay-way", word: "way", vowelTeamId: "ay", syllables: ["way"], phonemes: ["w", "ay"], difficulty: 1, imageKeyword: "way path" },
  { id: "ay-may", word: "may", vowelTeamId: "ay", syllables: ["may"], phonemes: ["m", "ay"], difficulty: 1, imageKeyword: "may" },
  { id: "ay-stay", word: "stay", vowelTeamId: "ay", syllables: ["stay"], phonemes: ["s", "t", "ay"], difficulty: 2, imageKeyword: "stay" },
  { id: "ay-gray", word: "gray", vowelTeamId: "ay", syllables: ["gray"], phonemes: ["g", "r", "ay"], difficulty: 2, imageKeyword: "gray color" },
  { id: "ay-spray", word: "spray", vowelTeamId: "ay", syllables: ["spray"], phonemes: ["s", "p", "r", "ay"], difficulty: 2, imageKeyword: "spray water" },
  { id: "ay-today", word: "today", vowelTeamId: "ay", syllables: ["to", "day"], phonemes: ["t", "o", "d", "ay"], difficulty: 3, imageKeyword: "today" },
  { id: "ay-birthday", word: "birthday", vowelTeamId: "ay", syllables: ["birth", "day"], phonemes: ["b", "ir", "th", "d", "ay"], difficulty: 3, imageKeyword: "birthday" },

  // EE words (10)
  { id: "ee-tree", word: "tree", vowelTeamId: "ee", syllables: ["tree"], phonemes: ["t", "r", "ee"], difficulty: 1, imageKeyword: "tree" },
  { id: "ee-bee", word: "bee", vowelTeamId: "ee", syllables: ["bee"], phonemes: ["b", "ee"], difficulty: 1, imageKeyword: "bee" },
  { id: "ee-see", word: "see", vowelTeamId: "ee", syllables: ["see"], phonemes: ["s", "ee"], difficulty: 1, imageKeyword: "see eye" },
  { id: "ee-feet", word: "feet", vowelTeamId: "ee", syllables: ["feet"], phonemes: ["f", "ee", "t"], difficulty: 1, imageKeyword: "feet" },
  { id: "ee-keep", word: "keep", vowelTeamId: "ee", syllables: ["keep"], phonemes: ["k", "ee", "p"], difficulty: 1, imageKeyword: "keep" },
  { id: "ee-sleep", word: "sleep", vowelTeamId: "ee", syllables: ["sleep"], phonemes: ["s", "l", "ee", "p"], difficulty: 2, imageKeyword: "sleep" },
  { id: "ee-green", word: "green", vowelTeamId: "ee", syllables: ["green"], phonemes: ["g", "r", "ee", "n"], difficulty: 2, imageKeyword: "green color" },
  { id: "ee-teeth", word: "teeth", vowelTeamId: "ee", syllables: ["teeth"], phonemes: ["t", "ee", "th"], difficulty: 2, imageKeyword: "teeth" },
  { id: "ee-wheel", word: "wheel", vowelTeamId: "ee", syllables: ["wheel"], phonemes: ["wh", "ee", "l"], difficulty: 2, imageKeyword: "wheel" },
  { id: "ee-cheese", word: "cheese", vowelTeamId: "ee", syllables: ["cheese"], phonemes: ["ch", "ee", "se"], difficulty: 2, imageKeyword: "cheese" },

  // EA words (10)
  { id: "ea-read", word: "read", vowelTeamId: "ea", syllables: ["read"], phonemes: ["r", "ea", "d"], difficulty: 1, imageKeyword: "read book" },
  { id: "ea-eat", word: "eat", vowelTeamId: "ea", syllables: ["eat"], phonemes: ["ea", "t"], difficulty: 1, imageKeyword: "eat food" },
  { id: "ea-beach", word: "beach", vowelTeamId: "ea", syllables: ["beach"], phonemes: ["b", "ea", "ch"], difficulty: 2, imageKeyword: "beach" },
  { id: "ea-team", word: "team", vowelTeamId: "ea", syllables: ["team"], phonemes: ["t", "ea", "m"], difficulty: 1, imageKeyword: "team" },
  { id: "ea-seat", word: "seat", vowelTeamId: "ea", syllables: ["seat"], phonemes: ["s", "ea", "t"], difficulty: 1, imageKeyword: "seat chair" },
  { id: "ea-leaf", word: "leaf", vowelTeamId: "ea", syllables: ["leaf"], phonemes: ["l", "ea", "f"], difficulty: 1, imageKeyword: "leaf" },
  { id: "ea-clean", word: "clean", vowelTeamId: "ea", syllables: ["clean"], phonemes: ["c", "l", "ea", "n"], difficulty: 2, imageKeyword: "clean" },
  { id: "ea-dream", word: "dream", vowelTeamId: "ea", syllables: ["dream"], phonemes: ["d", "r", "ea", "m"], difficulty: 2, imageKeyword: "dream" },
  { id: "ea-peach", word: "peach", vowelTeamId: "ea", syllables: ["peach"], phonemes: ["p", "ea", "ch"], difficulty: 2, imageKeyword: "peach fruit" },
  { id: "ea-teach", word: "teach", vowelTeamId: "ea", syllables: ["teach"], phonemes: ["t", "ea", "ch"], difficulty: 2, imageKeyword: "teach" },

  // OA words (10)
  { id: "oa-boat", word: "boat", vowelTeamId: "oa", syllables: ["boat"], phonemes: ["b", "oa", "t"], difficulty: 1, imageKeyword: "boat" },
  { id: "oa-coat", word: "coat", vowelTeamId: "oa", syllables: ["coat"], phonemes: ["c", "oa", "t"], difficulty: 1, imageKeyword: "coat" },
  { id: "oa-road", word: "road", vowelTeamId: "oa", syllables: ["road"], phonemes: ["r", "oa", "d"], difficulty: 1, imageKeyword: "road" },
  { id: "oa-soap", word: "soap", vowelTeamId: "oa", syllables: ["soap"], phonemes: ["s", "oa", "p"], difficulty: 1, imageKeyword: "soap" },
  { id: "oa-goat", word: "goat", vowelTeamId: "oa", syllables: ["goat"], phonemes: ["g", "oa", "t"], difficulty: 1, imageKeyword: "goat" },
  { id: "oa-toad", word: "toad", vowelTeamId: "oa", syllables: ["toad"], phonemes: ["t", "oa", "d"], difficulty: 1, imageKeyword: "toad frog" },
  { id: "oa-toast", word: "toast", vowelTeamId: "oa", syllables: ["toast"], phonemes: ["t", "oa", "s", "t"], difficulty: 2, imageKeyword: "toast bread" },
  { id: "oa-float", word: "float", vowelTeamId: "oa", syllables: ["float"], phonemes: ["f", "l", "oa", "t"], difficulty: 2, imageKeyword: "float water" },
  { id: "oa-coach", word: "coach", vowelTeamId: "oa", syllables: ["coach"], phonemes: ["c", "oa", "ch"], difficulty: 2, imageKeyword: "coach" },
  { id: "oa-roast", word: "roast", vowelTeamId: "oa", syllables: ["roast"], phonemes: ["r", "oa", "s", "t"], difficulty: 2, imageKeyword: "roast" },

  // OW long O words (8)
  { id: "ow-snow", word: "snow", vowelTeamId: "ow-long", syllables: ["snow"], phonemes: ["s", "n", "ow"], difficulty: 1, imageKeyword: "snow" },
  { id: "ow-grow", word: "grow", vowelTeamId: "ow-long", syllables: ["grow"], phonemes: ["g", "r", "ow"], difficulty: 1, imageKeyword: "grow" },
  { id: "ow-bowl", word: "bowl", vowelTeamId: "ow-long", syllables: ["bowl"], phonemes: ["b", "ow", "l"], difficulty: 1, imageKeyword: "bowl" },
  { id: "ow-low", word: "low", vowelTeamId: "ow-long", syllables: ["low"], phonemes: ["l", "ow"], difficulty: 1, imageKeyword: "low" },
  { id: "ow-show", word: "show", vowelTeamId: "ow-long", syllables: ["show"], phonemes: ["sh", "ow"], difficulty: 1, imageKeyword: "show" },
  { id: "ow-blow", word: "blow", vowelTeamId: "ow-long", syllables: ["blow"], phonemes: ["b", "l", "ow"], difficulty: 2, imageKeyword: "blow" },
  { id: "ow-throw", word: "throw", vowelTeamId: "ow-long", syllables: ["throw"], phonemes: ["th", "r", "ow"], difficulty: 2, imageKeyword: "throw" },
  { id: "ow-window", word: "window", vowelTeamId: "ow-long", syllables: ["win", "dow"], phonemes: ["w", "i", "n", "d", "ow"], difficulty: 3, imageKeyword: "window" },

  // OO long words (10)
  { id: "oo-moon", word: "moon", vowelTeamId: "oo-long", syllables: ["moon"], phonemes: ["m", "oo", "n"], difficulty: 1, imageKeyword: "moon" },
  { id: "oo-food", word: "food", vowelTeamId: "oo-long", syllables: ["food"], phonemes: ["f", "oo", "d"], difficulty: 1, imageKeyword: "food" },
  { id: "oo-room", word: "room", vowelTeamId: "oo-long", syllables: ["room"], phonemes: ["r", "oo", "m"], difficulty: 1, imageKeyword: "room" },
  { id: "oo-zoo", word: "zoo", vowelTeamId: "oo-long", syllables: ["zoo"], phonemes: ["z", "oo"], difficulty: 1, imageKeyword: "zoo" },
  { id: "oo-spoon", word: "spoon", vowelTeamId: "oo-long", syllables: ["spoon"], phonemes: ["s", "p", "oo", "n"], difficulty: 2, imageKeyword: "spoon" },
  { id: "oo-pool", word: "pool", vowelTeamId: "oo-long", syllables: ["pool"], phonemes: ["p", "oo", "l"], difficulty: 1, imageKeyword: "pool" },
  { id: "oo-school", word: "school", vowelTeamId: "oo-long", syllables: ["school"], phonemes: ["s", "ch", "oo", "l"], difficulty: 2, imageKeyword: "school" },
  { id: "oo-tooth", word: "tooth", vowelTeamId: "oo-long", syllables: ["tooth"], phonemes: ["t", "oo", "th"], difficulty: 2, imageKeyword: "tooth" },
  { id: "oo-balloon", word: "balloon", vowelTeamId: "oo-long", syllables: ["bal", "loon"], phonemes: ["b", "a", "l", "oo", "n"], difficulty: 3, imageKeyword: "balloon" },
  { id: "oo-cartoon", word: "cartoon", vowelTeamId: "oo-long", syllables: ["car", "toon"], phonemes: ["c", "ar", "t", "oo", "n"], difficulty: 3, imageKeyword: "cartoon" },

  // OO short words (8)
  { id: "oo-book", word: "book", vowelTeamId: "oo-short", syllables: ["book"], phonemes: ["b", "oo", "k"], difficulty: 1, imageKeyword: "book" },
  { id: "oo-look", word: "look", vowelTeamId: "oo-short", syllables: ["look"], phonemes: ["l", "oo", "k"], difficulty: 1, imageKeyword: "look see" },
  { id: "oo-foot", word: "foot", vowelTeamId: "oo-short", syllables: ["foot"], phonemes: ["f", "oo", "t"], difficulty: 1, imageKeyword: "foot" },
  { id: "oo-good", word: "good", vowelTeamId: "oo-short", syllables: ["good"], phonemes: ["g", "oo", "d"], difficulty: 1, imageKeyword: "good thumbs up" },
  { id: "oo-wood", word: "wood", vowelTeamId: "oo-short", syllables: ["wood"], phonemes: ["w", "oo", "d"], difficulty: 1, imageKeyword: "wood" },
  { id: "oo-cook", word: "cook", vowelTeamId: "oo-short", syllables: ["cook"], phonemes: ["c", "oo", "k"], difficulty: 1, imageKeyword: "cook" },
  { id: "oo-hook", word: "hook", vowelTeamId: "oo-short", syllables: ["hook"], phonemes: ["h", "oo", "k"], difficulty: 1, imageKeyword: "hook" },
  { id: "oo-cookie", word: "cookie", vowelTeamId: "oo-short", syllables: ["cook", "ie"], phonemes: ["c", "oo", "k", "ie"], difficulty: 3, imageKeyword: "cookie" },

  // OU words (8)
  { id: "ou-house", word: "house", vowelTeamId: "ou", syllables: ["house"], phonemes: ["h", "ou", "se"], difficulty: 1, imageKeyword: "house" },
  { id: "ou-mouse", word: "mouse", vowelTeamId: "ou", syllables: ["mouse"], phonemes: ["m", "ou", "se"], difficulty: 1, imageKeyword: "mouse" },
  { id: "ou-out", word: "out", vowelTeamId: "ou", syllables: ["out"], phonemes: ["ou", "t"], difficulty: 1, imageKeyword: "out" },
  { id: "ou-loud", word: "loud", vowelTeamId: "ou", syllables: ["loud"], phonemes: ["l", "ou", "d"], difficulty: 1, imageKeyword: "loud" },
  { id: "ou-cloud", word: "cloud", vowelTeamId: "ou", syllables: ["cloud"], phonemes: ["c", "l", "ou", "d"], difficulty: 2, imageKeyword: "cloud" },
  { id: "ou-count", word: "count", vowelTeamId: "ou", syllables: ["count"], phonemes: ["c", "ou", "n", "t"], difficulty: 2, imageKeyword: "count numbers" },
  { id: "ou-ground", word: "ground", vowelTeamId: "ou", syllables: ["ground"], phonemes: ["g", "r", "ou", "n", "d"], difficulty: 2, imageKeyword: "ground" },
  { id: "ou-around", word: "around", vowelTeamId: "ou", syllables: ["a", "round"], phonemes: ["a", "r", "ou", "n", "d"], difficulty: 3, imageKeyword: "around" },

  // OW diphthong words (8)
  { id: "ow-cow", word: "cow", vowelTeamId: "ow-diphthong", syllables: ["cow"], phonemes: ["c", "ow"], difficulty: 1, imageKeyword: "cow" },
  { id: "ow-how", word: "how", vowelTeamId: "ow-diphthong", syllables: ["how"], phonemes: ["h", "ow"], difficulty: 1, imageKeyword: "how question" },
  { id: "ow-now", word: "now", vowelTeamId: "ow-diphthong", syllables: ["now"], phonemes: ["n", "ow"], difficulty: 1, imageKeyword: "now" },
  { id: "ow-down", word: "down", vowelTeamId: "ow-diphthong", syllables: ["down"], phonemes: ["d", "ow", "n"], difficulty: 1, imageKeyword: "down arrow" },
  { id: "ow-town", word: "town", vowelTeamId: "ow-diphthong", syllables: ["town"], phonemes: ["t", "ow", "n"], difficulty: 1, imageKeyword: "town" },
  { id: "ow-crown", word: "crown", vowelTeamId: "ow-diphthong", syllables: ["crown"], phonemes: ["c", "r", "ow", "n"], difficulty: 2, imageKeyword: "crown" },
  { id: "ow-brown", word: "brown", vowelTeamId: "ow-diphthong", syllables: ["brown"], phonemes: ["b", "r", "ow", "n"], difficulty: 2, imageKeyword: "brown color" },
  { id: "ow-flower", word: "flower", vowelTeamId: "ow-diphthong", syllables: ["flow", "er"], phonemes: ["f", "l", "ow", "er"], difficulty: 3, imageKeyword: "flower" },

  // OI words (6)
  { id: "oi-coin", word: "coin", vowelTeamId: "oi", syllables: ["coin"], phonemes: ["c", "oi", "n"], difficulty: 1, imageKeyword: "coin" },
  { id: "oi-join", word: "join", vowelTeamId: "oi", syllables: ["join"], phonemes: ["j", "oi", "n"], difficulty: 1, imageKeyword: "join" },
  { id: "oi-oil", word: "oil", vowelTeamId: "oi", syllables: ["oil"], phonemes: ["oi", "l"], difficulty: 1, imageKeyword: "oil" },
  { id: "oi-boil", word: "boil", vowelTeamId: "oi", syllables: ["boil"], phonemes: ["b", "oi", "l"], difficulty: 1, imageKeyword: "boil water" },
  { id: "oi-point", word: "point", vowelTeamId: "oi", syllables: ["point"], phonemes: ["p", "oi", "n", "t"], difficulty: 2, imageKeyword: "point finger" },
  { id: "oi-voice", word: "voice", vowelTeamId: "oi", syllables: ["voice"], phonemes: ["v", "oi", "ce"], difficulty: 2, imageKeyword: "voice" },

  // OY words (6)
  { id: "oy-toy", word: "toy", vowelTeamId: "oy", syllables: ["toy"], phonemes: ["t", "oy"], difficulty: 1, imageKeyword: "toy" },
  { id: "oy-boy", word: "boy", vowelTeamId: "oy", syllables: ["boy"], phonemes: ["b", "oy"], difficulty: 1, imageKeyword: "boy" },
  { id: "oy-joy", word: "joy", vowelTeamId: "oy", syllables: ["joy"], phonemes: ["j", "oy"], difficulty: 1, imageKeyword: "joy happy" },
  { id: "oy-enjoy", word: "enjoy", vowelTeamId: "oy", syllables: ["en", "joy"], phonemes: ["e", "n", "j", "oy"], difficulty: 3, imageKeyword: "enjoy" },
  { id: "oy-royal", word: "royal", vowelTeamId: "oy", syllables: ["roy", "al"], phonemes: ["r", "oy", "a", "l"], difficulty: 3, imageKeyword: "royal" },
  { id: "oy-destroy", word: "destroy", vowelTeamId: "oy", syllables: ["de", "stroy"], phonemes: ["d", "e", "s", "t", "r", "oy"], difficulty: 3, imageKeyword: "destroy" },
];

// Helper functions
export function getVowelTeamById(id: string): VowelTeam | undefined {
  return VOWEL_TEAMS.find((vt) => vt.id === id);
}

export function getWordsByVowelTeam(vowelTeamId: string): VowelTeamWord[] {
  return VOWEL_TEAM_WORDS.filter((w) => w.vowelTeamId === vowelTeamId);
}

export function getVowelTeamsBySoundType(soundType: VowelTeam["soundType"]): VowelTeam[] {
  return VOWEL_TEAMS.filter((vt) => vt.soundType === soundType);
}

export function getWordsByDifficulty(difficulty: 1 | 2 | 3): VowelTeamWord[] {
  return VOWEL_TEAM_WORDS.filter((w) => w.difficulty === difficulty);
}

export function getRandomVowelTeamWords(count: number, vowelTeamId?: string): VowelTeamWord[] {
  let words = vowelTeamId ? getWordsByVowelTeam(vowelTeamId) : [...VOWEL_TEAM_WORDS];
  const shuffled = words.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getLongVowelTeams(): VowelTeam[] {
  return VOWEL_TEAMS.filter((vt) =>
    ["long-a", "long-e", "long-i", "long-o", "long-u"].includes(vt.soundType)
  );
}

export function getDiphthongTeams(): VowelTeam[] {
  return VOWEL_TEAMS.filter((vt) => vt.soundType === "diphthong");
}
