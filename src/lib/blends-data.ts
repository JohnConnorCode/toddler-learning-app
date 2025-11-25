/**
 * Consonant Blends Data - Two or three consonants that blend together
 * Each consonant keeps its own sound, but they're pronounced quickly together
 */

export interface BlendItem {
  id: string;
  blend: string;
  type: "initial" | "final";
  category: "l-blend" | "r-blend" | "s-blend" | "final-blend";
  description: string;
  exampleWord: string;
  color: string;
}

export interface BlendWord {
  id: string;
  word: string;
  blendId: string;
  blendPosition: "initial" | "final";
  syllables: string[];
  phonemes: string[];
  difficulty: 1 | 2 | 3;
  imageKeyword: string;
}

// Initial L-Blends
const L_BLENDS: BlendItem[] = [
  {
    id: "bl",
    blend: "bl",
    type: "initial",
    category: "l-blend",
    description: "B and L together, like in 'blue'",
    exampleWord: "blue",
    color: "bg-blue-400",
  },
  {
    id: "cl",
    blend: "cl",
    type: "initial",
    category: "l-blend",
    description: "C and L together, like in 'clap'",
    exampleWord: "clap",
    color: "bg-red-400",
  },
  {
    id: "fl",
    blend: "fl",
    type: "initial",
    category: "l-blend",
    description: "F and L together, like in 'flag'",
    exampleWord: "flag",
    color: "bg-green-400",
  },
  {
    id: "gl",
    blend: "gl",
    type: "initial",
    category: "l-blend",
    description: "G and L together, like in 'glad'",
    exampleWord: "glad",
    color: "bg-yellow-400",
  },
  {
    id: "pl",
    blend: "pl",
    type: "initial",
    category: "l-blend",
    description: "P and L together, like in 'play'",
    exampleWord: "play",
    color: "bg-purple-400",
  },
  {
    id: "sl",
    blend: "sl",
    type: "initial",
    category: "l-blend",
    description: "S and L together, like in 'slide'",
    exampleWord: "slide",
    color: "bg-orange-400",
  },
];

// Initial R-Blends
const R_BLENDS: BlendItem[] = [
  {
    id: "br",
    blend: "br",
    type: "initial",
    category: "r-blend",
    description: "B and R together, like in 'brown'",
    exampleWord: "brown",
    color: "bg-amber-600",
  },
  {
    id: "cr",
    blend: "cr",
    type: "initial",
    category: "r-blend",
    description: "C and R together, like in 'crab'",
    exampleWord: "crab",
    color: "bg-rose-400",
  },
  {
    id: "dr",
    blend: "dr",
    type: "initial",
    category: "r-blend",
    description: "D and R together, like in 'drum'",
    exampleWord: "drum",
    color: "bg-indigo-400",
  },
  {
    id: "fr",
    blend: "fr",
    type: "initial",
    category: "r-blend",
    description: "F and R together, like in 'frog'",
    exampleWord: "frog",
    color: "bg-lime-400",
  },
  {
    id: "gr",
    blend: "gr",
    type: "initial",
    category: "r-blend",
    description: "G and R together, like in 'green'",
    exampleWord: "green",
    color: "bg-emerald-400",
  },
  {
    id: "pr",
    blend: "pr",
    type: "initial",
    category: "r-blend",
    description: "P and R together, like in 'prize'",
    exampleWord: "prize",
    color: "bg-pink-400",
  },
  {
    id: "tr",
    blend: "tr",
    type: "initial",
    category: "r-blend",
    description: "T and R together, like in 'tree'",
    exampleWord: "tree",
    color: "bg-teal-400",
  },
];

// Initial S-Blends
const S_BLENDS: BlendItem[] = [
  {
    id: "sc",
    blend: "sc",
    type: "initial",
    category: "s-blend",
    description: "S and C together, like in 'scar'",
    exampleWord: "scar",
    color: "bg-slate-400",
  },
  {
    id: "sk",
    blend: "sk",
    type: "initial",
    category: "s-blend",
    description: "S and K together, like in 'skip'",
    exampleWord: "skip",
    color: "bg-cyan-400",
  },
  {
    id: "sm",
    blend: "sm",
    type: "initial",
    category: "s-blend",
    description: "S and M together, like in 'smile'",
    exampleWord: "smile",
    color: "bg-fuchsia-400",
  },
  {
    id: "sn",
    blend: "sn",
    type: "initial",
    category: "s-blend",
    description: "S and N together, like in 'snow'",
    exampleWord: "snow",
    color: "bg-sky-200",
  },
  {
    id: "sp",
    blend: "sp",
    type: "initial",
    category: "s-blend",
    description: "S and P together, like in 'spot'",
    exampleWord: "spot",
    color: "bg-violet-400",
  },
  {
    id: "st",
    blend: "st",
    type: "initial",
    category: "s-blend",
    description: "S and T together, like in 'star'",
    exampleWord: "star",
    color: "bg-yellow-300",
  },
  {
    id: "sw",
    blend: "sw",
    type: "initial",
    category: "s-blend",
    description: "S and W together, like in 'swim'",
    exampleWord: "swim",
    color: "bg-blue-300",
  },
];

// Final Blends
const FINAL_BLENDS: BlendItem[] = [
  {
    id: "ft",
    blend: "ft",
    type: "final",
    category: "final-blend",
    description: "F and T at the end, like in 'left'",
    exampleWord: "left",
    color: "bg-gray-400",
  },
  {
    id: "lt",
    blend: "lt",
    type: "final",
    category: "final-blend",
    description: "L and T at the end, like in 'salt'",
    exampleWord: "salt",
    color: "bg-stone-400",
  },
  {
    id: "nt",
    blend: "nt",
    type: "final",
    category: "final-blend",
    description: "N and T at the end, like in 'ant'",
    exampleWord: "ant",
    color: "bg-red-300",
  },
  {
    id: "pt",
    blend: "pt",
    type: "final",
    category: "final-blend",
    description: "P and T at the end, like in 'kept'",
    exampleWord: "kept",
    color: "bg-neutral-400",
  },
  {
    id: "mp",
    blend: "mp",
    type: "final",
    category: "final-blend",
    description: "M and P at the end, like in 'jump'",
    exampleWord: "jump",
    color: "bg-orange-300",
  },
  {
    id: "nd",
    blend: "nd",
    type: "final",
    category: "final-blend",
    description: "N and D at the end, like in 'and'",
    exampleWord: "and",
    color: "bg-zinc-400",
  },
  {
    id: "nk",
    blend: "nk",
    type: "final",
    category: "final-blend",
    description: "N and K at the end, like in 'pink'",
    exampleWord: "pink",
    color: "bg-pink-300",
  },
  {
    id: "sk-final",
    blend: "sk",
    type: "final",
    category: "final-blend",
    description: "S and K at the end, like in 'ask'",
    exampleWord: "ask",
    color: "bg-blue-200",
  },
  {
    id: "st-final",
    blend: "st",
    type: "final",
    category: "final-blend",
    description: "S and T at the end, like in 'best'",
    exampleWord: "best",
    color: "bg-amber-300",
  },
];

// Combine all blends
export const BLENDS: BlendItem[] = [
  ...L_BLENDS,
  ...R_BLENDS,
  ...S_BLENDS,
  ...FINAL_BLENDS,
];

// ~200 words covering all blends
export const BLEND_WORDS: BlendWord[] = [
  // BL words (10)
  { id: "bl-blue", word: "blue", blendId: "bl", blendPosition: "initial", syllables: ["blue"], phonemes: ["b", "l", "ue"], difficulty: 1, imageKeyword: "blue color" },
  { id: "bl-black", word: "black", blendId: "bl", blendPosition: "initial", syllables: ["black"], phonemes: ["b", "l", "a", "ck"], difficulty: 1, imageKeyword: "black color" },
  { id: "bl-block", word: "block", blendId: "bl", blendPosition: "initial", syllables: ["block"], phonemes: ["b", "l", "o", "ck"], difficulty: 1, imageKeyword: "block toy" },
  { id: "bl-blow", word: "blow", blendId: "bl", blendPosition: "initial", syllables: ["blow"], phonemes: ["b", "l", "ow"], difficulty: 1, imageKeyword: "blow wind" },
  { id: "bl-blank", word: "blank", blendId: "bl", blendPosition: "initial", syllables: ["blank"], phonemes: ["b", "l", "a", "nk"], difficulty: 2, imageKeyword: "blank paper" },
  { id: "bl-blend", word: "blend", blendId: "bl", blendPosition: "initial", syllables: ["blend"], phonemes: ["b", "l", "e", "nd"], difficulty: 2, imageKeyword: "blend mix" },
  { id: "bl-blink", word: "blink", blendId: "bl", blendPosition: "initial", syllables: ["blink"], phonemes: ["b", "l", "i", "nk"], difficulty: 2, imageKeyword: "blink eye" },
  { id: "bl-blob", word: "blob", blendId: "bl", blendPosition: "initial", syllables: ["blob"], phonemes: ["b", "l", "o", "b"], difficulty: 1, imageKeyword: "blob" },
  { id: "bl-blanket", word: "blanket", blendId: "bl", blendPosition: "initial", syllables: ["blan", "ket"], phonemes: ["b", "l", "a", "n", "k", "e", "t"], difficulty: 3, imageKeyword: "blanket" },
  { id: "bl-blizzard", word: "blizzard", blendId: "bl", blendPosition: "initial", syllables: ["bliz", "zard"], phonemes: ["b", "l", "i", "z", "z", "ar", "d"], difficulty: 3, imageKeyword: "blizzard snow" },

  // CL words (10)
  { id: "cl-clap", word: "clap", blendId: "cl", blendPosition: "initial", syllables: ["clap"], phonemes: ["c", "l", "a", "p"], difficulty: 1, imageKeyword: "clap hands" },
  { id: "cl-class", word: "class", blendId: "cl", blendPosition: "initial", syllables: ["class"], phonemes: ["c", "l", "a", "ss"], difficulty: 1, imageKeyword: "class school" },
  { id: "cl-clean", word: "clean", blendId: "cl", blendPosition: "initial", syllables: ["clean"], phonemes: ["c", "l", "ea", "n"], difficulty: 2, imageKeyword: "clean" },
  { id: "cl-climb", word: "climb", blendId: "cl", blendPosition: "initial", syllables: ["climb"], phonemes: ["c", "l", "i", "mb"], difficulty: 2, imageKeyword: "climb" },
  { id: "cl-clock", word: "clock", blendId: "cl", blendPosition: "initial", syllables: ["clock"], phonemes: ["c", "l", "o", "ck"], difficulty: 1, imageKeyword: "clock time" },
  { id: "cl-close", word: "close", blendId: "cl", blendPosition: "initial", syllables: ["close"], phonemes: ["c", "l", "o", "se"], difficulty: 2, imageKeyword: "close door" },
  { id: "cl-cloud", word: "cloud", blendId: "cl", blendPosition: "initial", syllables: ["cloud"], phonemes: ["c", "l", "ou", "d"], difficulty: 2, imageKeyword: "cloud sky" },
  { id: "cl-clown", word: "clown", blendId: "cl", blendPosition: "initial", syllables: ["clown"], phonemes: ["c", "l", "ow", "n"], difficulty: 2, imageKeyword: "clown" },
  { id: "cl-club", word: "club", blendId: "cl", blendPosition: "initial", syllables: ["club"], phonemes: ["c", "l", "u", "b"], difficulty: 1, imageKeyword: "club" },
  { id: "cl-clip", word: "clip", blendId: "cl", blendPosition: "initial", syllables: ["clip"], phonemes: ["c", "l", "i", "p"], difficulty: 1, imageKeyword: "clip" },

  // FL words (10)
  { id: "fl-flag", word: "flag", blendId: "fl", blendPosition: "initial", syllables: ["flag"], phonemes: ["f", "l", "a", "g"], difficulty: 1, imageKeyword: "flag" },
  { id: "fl-flat", word: "flat", blendId: "fl", blendPosition: "initial", syllables: ["flat"], phonemes: ["f", "l", "a", "t"], difficulty: 1, imageKeyword: "flat" },
  { id: "fl-flip", word: "flip", blendId: "fl", blendPosition: "initial", syllables: ["flip"], phonemes: ["f", "l", "i", "p"], difficulty: 1, imageKeyword: "flip" },
  { id: "fl-float", word: "float", blendId: "fl", blendPosition: "initial", syllables: ["float"], phonemes: ["f", "l", "oa", "t"], difficulty: 2, imageKeyword: "float water" },
  { id: "fl-floor", word: "floor", blendId: "fl", blendPosition: "initial", syllables: ["floor"], phonemes: ["f", "l", "oor"], difficulty: 2, imageKeyword: "floor" },
  { id: "fl-flower", word: "flower", blendId: "fl", blendPosition: "initial", syllables: ["flow", "er"], phonemes: ["f", "l", "ow", "er"], difficulty: 3, imageKeyword: "flower" },
  { id: "fl-fly", word: "fly", blendId: "fl", blendPosition: "initial", syllables: ["fly"], phonemes: ["f", "l", "y"], difficulty: 1, imageKeyword: "fly insect" },
  { id: "fl-flop", word: "flop", blendId: "fl", blendPosition: "initial", syllables: ["flop"], phonemes: ["f", "l", "o", "p"], difficulty: 1, imageKeyword: "flop" },
  { id: "fl-flame", word: "flame", blendId: "fl", blendPosition: "initial", syllables: ["flame"], phonemes: ["f", "l", "a", "me"], difficulty: 2, imageKeyword: "flame fire" },
  { id: "fl-flashlight", word: "flashlight", blendId: "fl", blendPosition: "initial", syllables: ["flash", "light"], phonemes: ["f", "l", "a", "sh", "l", "igh", "t"], difficulty: 3, imageKeyword: "flashlight" },

  // GL words (8)
  { id: "gl-glad", word: "glad", blendId: "gl", blendPosition: "initial", syllables: ["glad"], phonemes: ["g", "l", "a", "d"], difficulty: 1, imageKeyword: "glad happy" },
  { id: "gl-glass", word: "glass", blendId: "gl", blendPosition: "initial", syllables: ["glass"], phonemes: ["g", "l", "a", "ss"], difficulty: 1, imageKeyword: "glass" },
  { id: "gl-globe", word: "globe", blendId: "gl", blendPosition: "initial", syllables: ["globe"], phonemes: ["g", "l", "o", "be"], difficulty: 2, imageKeyword: "globe earth" },
  { id: "gl-glove", word: "glove", blendId: "gl", blendPosition: "initial", syllables: ["glove"], phonemes: ["g", "l", "o", "ve"], difficulty: 2, imageKeyword: "glove" },
  { id: "gl-glow", word: "glow", blendId: "gl", blendPosition: "initial", syllables: ["glow"], phonemes: ["g", "l", "ow"], difficulty: 1, imageKeyword: "glow light" },
  { id: "gl-glue", word: "glue", blendId: "gl", blendPosition: "initial", syllables: ["glue"], phonemes: ["g", "l", "ue"], difficulty: 1, imageKeyword: "glue" },
  { id: "gl-glitter", word: "glitter", blendId: "gl", blendPosition: "initial", syllables: ["glit", "ter"], phonemes: ["g", "l", "i", "tt", "er"], difficulty: 3, imageKeyword: "glitter sparkle" },
  { id: "gl-glasses", word: "glasses", blendId: "gl", blendPosition: "initial", syllables: ["glass", "es"], phonemes: ["g", "l", "a", "ss", "e", "s"], difficulty: 3, imageKeyword: "glasses" },

  // PL words (10)
  { id: "pl-play", word: "play", blendId: "pl", blendPosition: "initial", syllables: ["play"], phonemes: ["p", "l", "ay"], difficulty: 1, imageKeyword: "play" },
  { id: "pl-plan", word: "plan", blendId: "pl", blendPosition: "initial", syllables: ["plan"], phonemes: ["p", "l", "a", "n"], difficulty: 1, imageKeyword: "plan" },
  { id: "pl-plane", word: "plane", blendId: "pl", blendPosition: "initial", syllables: ["plane"], phonemes: ["p", "l", "a", "ne"], difficulty: 2, imageKeyword: "plane airplane" },
  { id: "pl-plant", word: "plant", blendId: "pl", blendPosition: "initial", syllables: ["plant"], phonemes: ["p", "l", "a", "nt"], difficulty: 2, imageKeyword: "plant" },
  { id: "pl-plate", word: "plate", blendId: "pl", blendPosition: "initial", syllables: ["plate"], phonemes: ["p", "l", "a", "te"], difficulty: 2, imageKeyword: "plate dish" },
  { id: "pl-please", word: "please", blendId: "pl", blendPosition: "initial", syllables: ["please"], phonemes: ["p", "l", "ea", "se"], difficulty: 2, imageKeyword: "please" },
  { id: "pl-plug", word: "plug", blendId: "pl", blendPosition: "initial", syllables: ["plug"], phonemes: ["p", "l", "u", "g"], difficulty: 1, imageKeyword: "plug electric" },
  { id: "pl-plus", word: "plus", blendId: "pl", blendPosition: "initial", syllables: ["plus"], phonemes: ["p", "l", "u", "s"], difficulty: 1, imageKeyword: "plus sign" },
  { id: "pl-plum", word: "plum", blendId: "pl", blendPosition: "initial", syllables: ["plum"], phonemes: ["p", "l", "u", "m"], difficulty: 1, imageKeyword: "plum fruit" },
  { id: "pl-planet", word: "planet", blendId: "pl", blendPosition: "initial", syllables: ["plan", "et"], phonemes: ["p", "l", "a", "n", "e", "t"], difficulty: 3, imageKeyword: "planet" },

  // SL words (10)
  { id: "sl-slide", word: "slide", blendId: "sl", blendPosition: "initial", syllables: ["slide"], phonemes: ["s", "l", "i", "de"], difficulty: 2, imageKeyword: "slide playground" },
  { id: "sl-slip", word: "slip", blendId: "sl", blendPosition: "initial", syllables: ["slip"], phonemes: ["s", "l", "i", "p"], difficulty: 1, imageKeyword: "slip" },
  { id: "sl-slow", word: "slow", blendId: "sl", blendPosition: "initial", syllables: ["slow"], phonemes: ["s", "l", "ow"], difficulty: 1, imageKeyword: "slow" },
  { id: "sl-sleep", word: "sleep", blendId: "sl", blendPosition: "initial", syllables: ["sleep"], phonemes: ["s", "l", "ee", "p"], difficulty: 2, imageKeyword: "sleep" },
  { id: "sl-sled", word: "sled", blendId: "sl", blendPosition: "initial", syllables: ["sled"], phonemes: ["s", "l", "e", "d"], difficulty: 1, imageKeyword: "sled snow" },
  { id: "sl-slice", word: "slice", blendId: "sl", blendPosition: "initial", syllables: ["slice"], phonemes: ["s", "l", "i", "ce"], difficulty: 2, imageKeyword: "slice" },
  { id: "sl-slim", word: "slim", blendId: "sl", blendPosition: "initial", syllables: ["slim"], phonemes: ["s", "l", "i", "m"], difficulty: 1, imageKeyword: "slim thin" },
  { id: "sl-slap", word: "slap", blendId: "sl", blendPosition: "initial", syllables: ["slap"], phonemes: ["s", "l", "a", "p"], difficulty: 1, imageKeyword: "slap" },
  { id: "sl-slot", word: "slot", blendId: "sl", blendPosition: "initial", syllables: ["slot"], phonemes: ["s", "l", "o", "t"], difficulty: 1, imageKeyword: "slot" },
  { id: "sl-slipper", word: "slipper", blendId: "sl", blendPosition: "initial", syllables: ["slip", "per"], phonemes: ["s", "l", "i", "pp", "er"], difficulty: 3, imageKeyword: "slipper" },

  // BR words (10)
  { id: "br-brown", word: "brown", blendId: "br", blendPosition: "initial", syllables: ["brown"], phonemes: ["b", "r", "ow", "n"], difficulty: 2, imageKeyword: "brown color" },
  { id: "br-bread", word: "bread", blendId: "br", blendPosition: "initial", syllables: ["bread"], phonemes: ["b", "r", "ea", "d"], difficulty: 2, imageKeyword: "bread" },
  { id: "br-bring", word: "bring", blendId: "br", blendPosition: "initial", syllables: ["bring"], phonemes: ["b", "r", "i", "ng"], difficulty: 2, imageKeyword: "bring" },
  { id: "br-brick", word: "brick", blendId: "br", blendPosition: "initial", syllables: ["brick"], phonemes: ["b", "r", "i", "ck"], difficulty: 1, imageKeyword: "brick" },
  { id: "br-brush", word: "brush", blendId: "br", blendPosition: "initial", syllables: ["brush"], phonemes: ["b", "r", "u", "sh"], difficulty: 2, imageKeyword: "brush" },
  { id: "br-brave", word: "brave", blendId: "br", blendPosition: "initial", syllables: ["brave"], phonemes: ["b", "r", "a", "ve"], difficulty: 2, imageKeyword: "brave" },
  { id: "br-brain", word: "brain", blendId: "br", blendPosition: "initial", syllables: ["brain"], phonemes: ["b", "r", "ai", "n"], difficulty: 2, imageKeyword: "brain" },
  { id: "br-break", word: "break", blendId: "br", blendPosition: "initial", syllables: ["break"], phonemes: ["b", "r", "ea", "k"], difficulty: 2, imageKeyword: "break" },
  { id: "br-broom", word: "broom", blendId: "br", blendPosition: "initial", syllables: ["broom"], phonemes: ["b", "r", "oo", "m"], difficulty: 2, imageKeyword: "broom" },
  { id: "br-brother", word: "brother", blendId: "br", blendPosition: "initial", syllables: ["bro", "ther"], phonemes: ["b", "r", "u", "th", "er"], difficulty: 3, imageKeyword: "brother" },

  // CR words (10)
  { id: "cr-crab", word: "crab", blendId: "cr", blendPosition: "initial", syllables: ["crab"], phonemes: ["c", "r", "a", "b"], difficulty: 1, imageKeyword: "crab" },
  { id: "cr-cry", word: "cry", blendId: "cr", blendPosition: "initial", syllables: ["cry"], phonemes: ["c", "r", "y"], difficulty: 1, imageKeyword: "cry" },
  { id: "cr-crib", word: "crib", blendId: "cr", blendPosition: "initial", syllables: ["crib"], phonemes: ["c", "r", "i", "b"], difficulty: 1, imageKeyword: "crib baby" },
  { id: "cr-crop", word: "crop", blendId: "cr", blendPosition: "initial", syllables: ["crop"], phonemes: ["c", "r", "o", "p"], difficulty: 1, imageKeyword: "crop farm" },
  { id: "cr-cross", word: "cross", blendId: "cr", blendPosition: "initial", syllables: ["cross"], phonemes: ["c", "r", "o", "ss"], difficulty: 1, imageKeyword: "cross" },
  { id: "cr-crown", word: "crown", blendId: "cr", blendPosition: "initial", syllables: ["crown"], phonemes: ["c", "r", "ow", "n"], difficulty: 2, imageKeyword: "crown" },
  { id: "cr-cream", word: "cream", blendId: "cr", blendPosition: "initial", syllables: ["cream"], phonemes: ["c", "r", "ea", "m"], difficulty: 2, imageKeyword: "cream" },
  { id: "cr-crayons", word: "crayons", blendId: "cr", blendPosition: "initial", syllables: ["cray", "ons"], phonemes: ["c", "r", "ay", "o", "n", "s"], difficulty: 3, imageKeyword: "crayons" },
  { id: "cr-cricket", word: "cricket", blendId: "cr", blendPosition: "initial", syllables: ["crick", "et"], phonemes: ["c", "r", "i", "ck", "e", "t"], difficulty: 3, imageKeyword: "cricket" },
  { id: "cr-crunch", word: "crunch", blendId: "cr", blendPosition: "initial", syllables: ["crunch"], phonemes: ["c", "r", "u", "n", "ch"], difficulty: 2, imageKeyword: "crunch" },

  // DR words (10)
  { id: "dr-drum", word: "drum", blendId: "dr", blendPosition: "initial", syllables: ["drum"], phonemes: ["d", "r", "u", "m"], difficulty: 1, imageKeyword: "drum" },
  { id: "dr-drop", word: "drop", blendId: "dr", blendPosition: "initial", syllables: ["drop"], phonemes: ["d", "r", "o", "p"], difficulty: 1, imageKeyword: "drop" },
  { id: "dr-dress", word: "dress", blendId: "dr", blendPosition: "initial", syllables: ["dress"], phonemes: ["d", "r", "e", "ss"], difficulty: 1, imageKeyword: "dress" },
  { id: "dr-drink", word: "drink", blendId: "dr", blendPosition: "initial", syllables: ["drink"], phonemes: ["d", "r", "i", "nk"], difficulty: 2, imageKeyword: "drink" },
  { id: "dr-drive", word: "drive", blendId: "dr", blendPosition: "initial", syllables: ["drive"], phonemes: ["d", "r", "i", "ve"], difficulty: 2, imageKeyword: "drive car" },
  { id: "dr-draw", word: "draw", blendId: "dr", blendPosition: "initial", syllables: ["draw"], phonemes: ["d", "r", "aw"], difficulty: 1, imageKeyword: "draw" },
  { id: "dr-dream", word: "dream", blendId: "dr", blendPosition: "initial", syllables: ["dream"], phonemes: ["d", "r", "ea", "m"], difficulty: 2, imageKeyword: "dream" },
  { id: "dr-dry", word: "dry", blendId: "dr", blendPosition: "initial", syllables: ["dry"], phonemes: ["d", "r", "y"], difficulty: 1, imageKeyword: "dry" },
  { id: "dr-dragon", word: "dragon", blendId: "dr", blendPosition: "initial", syllables: ["drag", "on"], phonemes: ["d", "r", "a", "g", "o", "n"], difficulty: 3, imageKeyword: "dragon" },
  { id: "dr-drip", word: "drip", blendId: "dr", blendPosition: "initial", syllables: ["drip"], phonemes: ["d", "r", "i", "p"], difficulty: 1, imageKeyword: "drip water" },

  // FR words (10)
  { id: "fr-frog", word: "frog", blendId: "fr", blendPosition: "initial", syllables: ["frog"], phonemes: ["f", "r", "o", "g"], difficulty: 1, imageKeyword: "frog" },
  { id: "fr-free", word: "free", blendId: "fr", blendPosition: "initial", syllables: ["free"], phonemes: ["f", "r", "ee"], difficulty: 1, imageKeyword: "free" },
  { id: "fr-from", word: "from", blendId: "fr", blendPosition: "initial", syllables: ["from"], phonemes: ["f", "r", "o", "m"], difficulty: 1, imageKeyword: "from" },
  { id: "fr-fresh", word: "fresh", blendId: "fr", blendPosition: "initial", syllables: ["fresh"], phonemes: ["f", "r", "e", "sh"], difficulty: 2, imageKeyword: "fresh" },
  { id: "fr-friend", word: "friend", blendId: "fr", blendPosition: "initial", syllables: ["friend"], phonemes: ["f", "r", "ie", "nd"], difficulty: 2, imageKeyword: "friend" },
  { id: "fr-front", word: "front", blendId: "fr", blendPosition: "initial", syllables: ["front"], phonemes: ["f", "r", "o", "nt"], difficulty: 2, imageKeyword: "front" },
  { id: "fr-fruit", word: "fruit", blendId: "fr", blendPosition: "initial", syllables: ["fruit"], phonemes: ["f", "r", "ui", "t"], difficulty: 2, imageKeyword: "fruit" },
  { id: "fr-fry", word: "fry", blendId: "fr", blendPosition: "initial", syllables: ["fry"], phonemes: ["f", "r", "y"], difficulty: 1, imageKeyword: "fry" },
  { id: "fr-friday", word: "Friday", blendId: "fr", blendPosition: "initial", syllables: ["Fri", "day"], phonemes: ["F", "r", "i", "d", "ay"], difficulty: 3, imageKeyword: "Friday" },
  { id: "fr-frown", word: "frown", blendId: "fr", blendPosition: "initial", syllables: ["frown"], phonemes: ["f", "r", "ow", "n"], difficulty: 2, imageKeyword: "frown" },

  // GR words (10)
  { id: "gr-green", word: "green", blendId: "gr", blendPosition: "initial", syllables: ["green"], phonemes: ["g", "r", "ee", "n"], difficulty: 2, imageKeyword: "green color" },
  { id: "gr-grass", word: "grass", blendId: "gr", blendPosition: "initial", syllables: ["grass"], phonemes: ["g", "r", "a", "ss"], difficulty: 1, imageKeyword: "grass" },
  { id: "gr-grape", word: "grape", blendId: "gr", blendPosition: "initial", syllables: ["grape"], phonemes: ["g", "r", "a", "pe"], difficulty: 2, imageKeyword: "grape" },
  { id: "gr-grow", word: "grow", blendId: "gr", blendPosition: "initial", syllables: ["grow"], phonemes: ["g", "r", "ow"], difficulty: 1, imageKeyword: "grow" },
  { id: "gr-great", word: "great", blendId: "gr", blendPosition: "initial", syllables: ["great"], phonemes: ["g", "r", "ea", "t"], difficulty: 2, imageKeyword: "great" },
  { id: "gr-grin", word: "grin", blendId: "gr", blendPosition: "initial", syllables: ["grin"], phonemes: ["g", "r", "i", "n"], difficulty: 1, imageKeyword: "grin smile" },
  { id: "gr-grab", word: "grab", blendId: "gr", blendPosition: "initial", syllables: ["grab"], phonemes: ["g", "r", "a", "b"], difficulty: 1, imageKeyword: "grab" },
  { id: "gr-gray", word: "gray", blendId: "gr", blendPosition: "initial", syllables: ["gray"], phonemes: ["g", "r", "ay"], difficulty: 1, imageKeyword: "gray color" },
  { id: "gr-ground", word: "ground", blendId: "gr", blendPosition: "initial", syllables: ["ground"], phonemes: ["g", "r", "ou", "nd"], difficulty: 2, imageKeyword: "ground" },
  { id: "gr-grandma", word: "grandma", blendId: "gr", blendPosition: "initial", syllables: ["grand", "ma"], phonemes: ["g", "r", "a", "nd", "m", "a"], difficulty: 3, imageKeyword: "grandma" },

  // PR words (10)
  { id: "pr-prize", word: "prize", blendId: "pr", blendPosition: "initial", syllables: ["prize"], phonemes: ["p", "r", "i", "ze"], difficulty: 2, imageKeyword: "prize" },
  { id: "pr-press", word: "press", blendId: "pr", blendPosition: "initial", syllables: ["press"], phonemes: ["p", "r", "e", "ss"], difficulty: 1, imageKeyword: "press" },
  { id: "pr-pretty", word: "pretty", blendId: "pr", blendPosition: "initial", syllables: ["pret", "ty"], phonemes: ["p", "r", "e", "tt", "y"], difficulty: 3, imageKeyword: "pretty" },
  { id: "pr-print", word: "print", blendId: "pr", blendPosition: "initial", syllables: ["print"], phonemes: ["p", "r", "i", "nt"], difficulty: 2, imageKeyword: "print" },
  { id: "pr-prince", word: "prince", blendId: "pr", blendPosition: "initial", syllables: ["prince"], phonemes: ["p", "r", "i", "n", "ce"], difficulty: 2, imageKeyword: "prince" },
  { id: "pr-princess", word: "princess", blendId: "pr", blendPosition: "initial", syllables: ["prin", "cess"], phonemes: ["p", "r", "i", "n", "c", "e", "ss"], difficulty: 3, imageKeyword: "princess" },
  { id: "pr-problem", word: "problem", blendId: "pr", blendPosition: "initial", syllables: ["prob", "lem"], phonemes: ["p", "r", "o", "b", "l", "e", "m"], difficulty: 3, imageKeyword: "problem" },
  { id: "pr-proud", word: "proud", blendId: "pr", blendPosition: "initial", syllables: ["proud"], phonemes: ["p", "r", "ou", "d"], difficulty: 2, imageKeyword: "proud" },
  { id: "pr-pretzel", word: "pretzel", blendId: "pr", blendPosition: "initial", syllables: ["pret", "zel"], phonemes: ["p", "r", "e", "t", "z", "e", "l"], difficulty: 3, imageKeyword: "pretzel" },
  { id: "pr-prop", word: "prop", blendId: "pr", blendPosition: "initial", syllables: ["prop"], phonemes: ["p", "r", "o", "p"], difficulty: 1, imageKeyword: "prop" },

  // TR words (10)
  { id: "tr-tree", word: "tree", blendId: "tr", blendPosition: "initial", syllables: ["tree"], phonemes: ["t", "r", "ee"], difficulty: 1, imageKeyword: "tree" },
  { id: "tr-truck", word: "truck", blendId: "tr", blendPosition: "initial", syllables: ["truck"], phonemes: ["t", "r", "u", "ck"], difficulty: 1, imageKeyword: "truck" },
  { id: "tr-train", word: "train", blendId: "tr", blendPosition: "initial", syllables: ["train"], phonemes: ["t", "r", "ai", "n"], difficulty: 2, imageKeyword: "train" },
  { id: "tr-trip", word: "trip", blendId: "tr", blendPosition: "initial", syllables: ["trip"], phonemes: ["t", "r", "i", "p"], difficulty: 1, imageKeyword: "trip" },
  { id: "tr-try", word: "try", blendId: "tr", blendPosition: "initial", syllables: ["try"], phonemes: ["t", "r", "y"], difficulty: 1, imageKeyword: "try" },
  { id: "tr-trap", word: "trap", blendId: "tr", blendPosition: "initial", syllables: ["trap"], phonemes: ["t", "r", "a", "p"], difficulty: 1, imageKeyword: "trap" },
  { id: "tr-trash", word: "trash", blendId: "tr", blendPosition: "initial", syllables: ["trash"], phonemes: ["t", "r", "a", "sh"], difficulty: 2, imageKeyword: "trash" },
  { id: "tr-treat", word: "treat", blendId: "tr", blendPosition: "initial", syllables: ["treat"], phonemes: ["t", "r", "ea", "t"], difficulty: 2, imageKeyword: "treat" },
  { id: "tr-triangle", word: "triangle", blendId: "tr", blendPosition: "initial", syllables: ["tri", "an", "gle"], phonemes: ["t", "r", "i", "a", "n", "g", "le"], difficulty: 3, imageKeyword: "triangle" },
  { id: "tr-trick", word: "trick", blendId: "tr", blendPosition: "initial", syllables: ["trick"], phonemes: ["t", "r", "i", "ck"], difficulty: 1, imageKeyword: "trick" },

  // S-blend words (SC, SK, SM, SN, SP, ST, SW - 8 each)
  // SC
  { id: "sc-scar", word: "scar", blendId: "sc", blendPosition: "initial", syllables: ["scar"], phonemes: ["s", "c", "ar"], difficulty: 1, imageKeyword: "scar" },
  { id: "sc-scab", word: "scab", blendId: "sc", blendPosition: "initial", syllables: ["scab"], phonemes: ["s", "c", "a", "b"], difficulty: 1, imageKeyword: "scab" },
  { id: "sc-scan", word: "scan", blendId: "sc", blendPosition: "initial", syllables: ["scan"], phonemes: ["s", "c", "a", "n"], difficulty: 1, imageKeyword: "scan" },
  { id: "sc-scale", word: "scale", blendId: "sc", blendPosition: "initial", syllables: ["scale"], phonemes: ["s", "c", "a", "le"], difficulty: 2, imageKeyword: "scale" },
  { id: "sc-scare", word: "scare", blendId: "sc", blendPosition: "initial", syllables: ["scare"], phonemes: ["s", "c", "are"], difficulty: 2, imageKeyword: "scare" },
  { id: "sc-scarf", word: "scarf", blendId: "sc", blendPosition: "initial", syllables: ["scarf"], phonemes: ["s", "c", "ar", "f"], difficulty: 2, imageKeyword: "scarf" },
  { id: "sc-score", word: "score", blendId: "sc", blendPosition: "initial", syllables: ["score"], phonemes: ["s", "c", "ore"], difficulty: 2, imageKeyword: "score" },
  { id: "sc-scoop", word: "scoop", blendId: "sc", blendPosition: "initial", syllables: ["scoop"], phonemes: ["s", "c", "oo", "p"], difficulty: 2, imageKeyword: "scoop" },

  // SK
  { id: "sk-skip", word: "skip", blendId: "sk", blendPosition: "initial", syllables: ["skip"], phonemes: ["s", "k", "i", "p"], difficulty: 1, imageKeyword: "skip" },
  { id: "sk-skin", word: "skin", blendId: "sk", blendPosition: "initial", syllables: ["skin"], phonemes: ["s", "k", "i", "n"], difficulty: 1, imageKeyword: "skin" },
  { id: "sk-sky", word: "sky", blendId: "sk", blendPosition: "initial", syllables: ["sky"], phonemes: ["s", "k", "y"], difficulty: 1, imageKeyword: "sky" },
  { id: "sk-skate", word: "skate", blendId: "sk", blendPosition: "initial", syllables: ["skate"], phonemes: ["s", "k", "a", "te"], difficulty: 2, imageKeyword: "skate" },
  { id: "sk-skill", word: "skill", blendId: "sk", blendPosition: "initial", syllables: ["skill"], phonemes: ["s", "k", "i", "ll"], difficulty: 2, imageKeyword: "skill" },
  { id: "sk-skirt", word: "skirt", blendId: "sk", blendPosition: "initial", syllables: ["skirt"], phonemes: ["s", "k", "ir", "t"], difficulty: 2, imageKeyword: "skirt" },
  { id: "sk-skull", word: "skull", blendId: "sk", blendPosition: "initial", syllables: ["skull"], phonemes: ["s", "k", "u", "ll"], difficulty: 2, imageKeyword: "skull" },
  { id: "sk-skunk", word: "skunk", blendId: "sk", blendPosition: "initial", syllables: ["skunk"], phonemes: ["s", "k", "u", "nk"], difficulty: 2, imageKeyword: "skunk" },

  // SM
  { id: "sm-smile", word: "smile", blendId: "sm", blendPosition: "initial", syllables: ["smile"], phonemes: ["s", "m", "i", "le"], difficulty: 2, imageKeyword: "smile" },
  { id: "sm-small", word: "small", blendId: "sm", blendPosition: "initial", syllables: ["small"], phonemes: ["s", "m", "a", "ll"], difficulty: 2, imageKeyword: "small" },
  { id: "sm-smell", word: "smell", blendId: "sm", blendPosition: "initial", syllables: ["smell"], phonemes: ["s", "m", "e", "ll"], difficulty: 2, imageKeyword: "smell" },
  { id: "sm-smart", word: "smart", blendId: "sm", blendPosition: "initial", syllables: ["smart"], phonemes: ["s", "m", "ar", "t"], difficulty: 2, imageKeyword: "smart" },
  { id: "sm-smoke", word: "smoke", blendId: "sm", blendPosition: "initial", syllables: ["smoke"], phonemes: ["s", "m", "o", "ke"], difficulty: 2, imageKeyword: "smoke" },
  { id: "sm-smooth", word: "smooth", blendId: "sm", blendPosition: "initial", syllables: ["smooth"], phonemes: ["s", "m", "oo", "th"], difficulty: 2, imageKeyword: "smooth" },
  { id: "sm-smash", word: "smash", blendId: "sm", blendPosition: "initial", syllables: ["smash"], phonemes: ["s", "m", "a", "sh"], difficulty: 2, imageKeyword: "smash" },
  { id: "sm-smock", word: "smock", blendId: "sm", blendPosition: "initial", syllables: ["smock"], phonemes: ["s", "m", "o", "ck"], difficulty: 2, imageKeyword: "smock" },

  // SN
  { id: "sn-snow", word: "snow", blendId: "sn", blendPosition: "initial", syllables: ["snow"], phonemes: ["s", "n", "ow"], difficulty: 1, imageKeyword: "snow" },
  { id: "sn-snack", word: "snack", blendId: "sn", blendPosition: "initial", syllables: ["snack"], phonemes: ["s", "n", "a", "ck"], difficulty: 1, imageKeyword: "snack" },
  { id: "sn-snake", word: "snake", blendId: "sn", blendPosition: "initial", syllables: ["snake"], phonemes: ["s", "n", "a", "ke"], difficulty: 2, imageKeyword: "snake" },
  { id: "sn-snap", word: "snap", blendId: "sn", blendPosition: "initial", syllables: ["snap"], phonemes: ["s", "n", "a", "p"], difficulty: 1, imageKeyword: "snap" },
  { id: "sn-snail", word: "snail", blendId: "sn", blendPosition: "initial", syllables: ["snail"], phonemes: ["s", "n", "ai", "l"], difficulty: 2, imageKeyword: "snail" },
  { id: "sn-sneeze", word: "sneeze", blendId: "sn", blendPosition: "initial", syllables: ["sneeze"], phonemes: ["s", "n", "ee", "ze"], difficulty: 2, imageKeyword: "sneeze" },
  { id: "sn-snore", word: "snore", blendId: "sn", blendPosition: "initial", syllables: ["snore"], phonemes: ["s", "n", "ore"], difficulty: 2, imageKeyword: "snore" },
  { id: "sn-snug", word: "snug", blendId: "sn", blendPosition: "initial", syllables: ["snug"], phonemes: ["s", "n", "u", "g"], difficulty: 1, imageKeyword: "snug" },

  // SP
  { id: "sp-spot", word: "spot", blendId: "sp", blendPosition: "initial", syllables: ["spot"], phonemes: ["s", "p", "o", "t"], difficulty: 1, imageKeyword: "spot" },
  { id: "sp-spin", word: "spin", blendId: "sp", blendPosition: "initial", syllables: ["spin"], phonemes: ["s", "p", "i", "n"], difficulty: 1, imageKeyword: "spin" },
  { id: "sp-spell", word: "spell", blendId: "sp", blendPosition: "initial", syllables: ["spell"], phonemes: ["s", "p", "e", "ll"], difficulty: 2, imageKeyword: "spell" },
  { id: "sp-spoon", word: "spoon", blendId: "sp", blendPosition: "initial", syllables: ["spoon"], phonemes: ["s", "p", "oo", "n"], difficulty: 2, imageKeyword: "spoon" },
  { id: "sp-spider", word: "spider", blendId: "sp", blendPosition: "initial", syllables: ["spi", "der"], phonemes: ["s", "p", "i", "d", "er"], difficulty: 3, imageKeyword: "spider" },
  { id: "sp-space", word: "space", blendId: "sp", blendPosition: "initial", syllables: ["space"], phonemes: ["s", "p", "a", "ce"], difficulty: 2, imageKeyword: "space" },
  { id: "sp-speak", word: "speak", blendId: "sp", blendPosition: "initial", syllables: ["speak"], phonemes: ["s", "p", "ea", "k"], difficulty: 2, imageKeyword: "speak" },
  { id: "sp-speed", word: "speed", blendId: "sp", blendPosition: "initial", syllables: ["speed"], phonemes: ["s", "p", "ee", "d"], difficulty: 2, imageKeyword: "speed" },

  // ST
  { id: "st-star", word: "star", blendId: "st", blendPosition: "initial", syllables: ["star"], phonemes: ["s", "t", "ar"], difficulty: 1, imageKeyword: "star" },
  { id: "st-stop", word: "stop", blendId: "st", blendPosition: "initial", syllables: ["stop"], phonemes: ["s", "t", "o", "p"], difficulty: 1, imageKeyword: "stop" },
  { id: "st-step", word: "step", blendId: "st", blendPosition: "initial", syllables: ["step"], phonemes: ["s", "t", "e", "p"], difficulty: 1, imageKeyword: "step" },
  { id: "st-stick", word: "stick", blendId: "st", blendPosition: "initial", syllables: ["stick"], phonemes: ["s", "t", "i", "ck"], difficulty: 1, imageKeyword: "stick" },
  { id: "st-stone", word: "stone", blendId: "st", blendPosition: "initial", syllables: ["stone"], phonemes: ["s", "t", "o", "ne"], difficulty: 2, imageKeyword: "stone" },
  { id: "st-store", word: "store", blendId: "st", blendPosition: "initial", syllables: ["store"], phonemes: ["s", "t", "ore"], difficulty: 2, imageKeyword: "store" },
  { id: "st-story", word: "story", blendId: "st", blendPosition: "initial", syllables: ["sto", "ry"], phonemes: ["s", "t", "o", "r", "y"], difficulty: 3, imageKeyword: "story" },
  { id: "st-stamp", word: "stamp", blendId: "st", blendPosition: "initial", syllables: ["stamp"], phonemes: ["s", "t", "a", "mp"], difficulty: 2, imageKeyword: "stamp" },

  // SW
  { id: "sw-swim", word: "swim", blendId: "sw", blendPosition: "initial", syllables: ["swim"], phonemes: ["s", "w", "i", "m"], difficulty: 1, imageKeyword: "swim" },
  { id: "sw-swing", word: "swing", blendId: "sw", blendPosition: "initial", syllables: ["swing"], phonemes: ["s", "w", "i", "ng"], difficulty: 2, imageKeyword: "swing" },
  { id: "sw-sweet", word: "sweet", blendId: "sw", blendPosition: "initial", syllables: ["sweet"], phonemes: ["s", "w", "ee", "t"], difficulty: 2, imageKeyword: "sweet" },
  { id: "sw-sweep", word: "sweep", blendId: "sw", blendPosition: "initial", syllables: ["sweep"], phonemes: ["s", "w", "ee", "p"], difficulty: 2, imageKeyword: "sweep" },
  { id: "sw-swan", word: "swan", blendId: "sw", blendPosition: "initial", syllables: ["swan"], phonemes: ["s", "w", "a", "n"], difficulty: 1, imageKeyword: "swan" },
  { id: "sw-swamp", word: "swamp", blendId: "sw", blendPosition: "initial", syllables: ["swamp"], phonemes: ["s", "w", "a", "mp"], difficulty: 2, imageKeyword: "swamp" },
  { id: "sw-switch", word: "switch", blendId: "sw", blendPosition: "initial", syllables: ["switch"], phonemes: ["s", "w", "i", "tch"], difficulty: 2, imageKeyword: "switch" },
  { id: "sw-sword", word: "sword", blendId: "sw", blendPosition: "initial", syllables: ["sword"], phonemes: ["s", "w", "or", "d"], difficulty: 2, imageKeyword: "sword" },

  // Final blends (FT, LT, NT, PT, MP, ND, NK, SK, ST)
  // FT
  { id: "ft-left", word: "left", blendId: "ft", blendPosition: "final", syllables: ["left"], phonemes: ["l", "e", "ft"], difficulty: 1, imageKeyword: "left" },
  { id: "ft-soft", word: "soft", blendId: "ft", blendPosition: "final", syllables: ["soft"], phonemes: ["s", "o", "ft"], difficulty: 1, imageKeyword: "soft" },
  { id: "ft-gift", word: "gift", blendId: "ft", blendPosition: "final", syllables: ["gift"], phonemes: ["g", "i", "ft"], difficulty: 1, imageKeyword: "gift" },
  { id: "ft-lift", word: "lift", blendId: "ft", blendPosition: "final", syllables: ["lift"], phonemes: ["l", "i", "ft"], difficulty: 1, imageKeyword: "lift" },
  { id: "ft-raft", word: "raft", blendId: "ft", blendPosition: "final", syllables: ["raft"], phonemes: ["r", "a", "ft"], difficulty: 1, imageKeyword: "raft" },
  { id: "ft-draft", word: "draft", blendId: "ft", blendPosition: "final", syllables: ["draft"], phonemes: ["d", "r", "a", "ft"], difficulty: 2, imageKeyword: "draft" },

  // LT
  { id: "lt-salt", word: "salt", blendId: "lt", blendPosition: "final", syllables: ["salt"], phonemes: ["s", "a", "lt"], difficulty: 1, imageKeyword: "salt" },
  { id: "lt-melt", word: "melt", blendId: "lt", blendPosition: "final", syllables: ["melt"], phonemes: ["m", "e", "lt"], difficulty: 1, imageKeyword: "melt" },
  { id: "lt-belt", word: "belt", blendId: "lt", blendPosition: "final", syllables: ["belt"], phonemes: ["b", "e", "lt"], difficulty: 1, imageKeyword: "belt" },
  { id: "lt-felt", word: "felt", blendId: "lt", blendPosition: "final", syllables: ["felt"], phonemes: ["f", "e", "lt"], difficulty: 1, imageKeyword: "felt" },
  { id: "lt-built", word: "built", blendId: "lt", blendPosition: "final", syllables: ["built"], phonemes: ["b", "ui", "lt"], difficulty: 2, imageKeyword: "built" },
  { id: "lt-quilt", word: "quilt", blendId: "lt", blendPosition: "final", syllables: ["quilt"], phonemes: ["qu", "i", "lt"], difficulty: 2, imageKeyword: "quilt" },

  // NT
  { id: "nt-ant", word: "ant", blendId: "nt", blendPosition: "final", syllables: ["ant"], phonemes: ["a", "nt"], difficulty: 1, imageKeyword: "ant" },
  { id: "nt-tent", word: "tent", blendId: "nt", blendPosition: "final", syllables: ["tent"], phonemes: ["t", "e", "nt"], difficulty: 1, imageKeyword: "tent" },
  { id: "nt-went", word: "went", blendId: "nt", blendPosition: "final", syllables: ["went"], phonemes: ["w", "e", "nt"], difficulty: 1, imageKeyword: "went" },
  { id: "nt-sent", word: "sent", blendId: "nt", blendPosition: "final", syllables: ["sent"], phonemes: ["s", "e", "nt"], difficulty: 1, imageKeyword: "sent" },
  { id: "nt-plant", word: "plant", blendId: "nt", blendPosition: "final", syllables: ["plant"], phonemes: ["p", "l", "a", "nt"], difficulty: 2, imageKeyword: "plant" },
  { id: "nt-front", word: "front", blendId: "nt", blendPosition: "final", syllables: ["front"], phonemes: ["f", "r", "o", "nt"], difficulty: 2, imageKeyword: "front" },

  // MP
  { id: "mp-jump", word: "jump", blendId: "mp", blendPosition: "final", syllables: ["jump"], phonemes: ["j", "u", "mp"], difficulty: 1, imageKeyword: "jump" },
  { id: "mp-camp", word: "camp", blendId: "mp", blendPosition: "final", syllables: ["camp"], phonemes: ["c", "a", "mp"], difficulty: 1, imageKeyword: "camp" },
  { id: "mp-lamp", word: "lamp", blendId: "mp", blendPosition: "final", syllables: ["lamp"], phonemes: ["l", "a", "mp"], difficulty: 1, imageKeyword: "lamp" },
  { id: "mp-bump", word: "bump", blendId: "mp", blendPosition: "final", syllables: ["bump"], phonemes: ["b", "u", "mp"], difficulty: 1, imageKeyword: "bump" },
  { id: "mp-stamp", word: "stamp", blendId: "mp", blendPosition: "final", syllables: ["stamp"], phonemes: ["s", "t", "a", "mp"], difficulty: 2, imageKeyword: "stamp" },
  { id: "mp-tramp", word: "tramp", blendId: "mp", blendPosition: "final", syllables: ["tramp"], phonemes: ["t", "r", "a", "mp"], difficulty: 2, imageKeyword: "tramp" },

  // ND
  { id: "nd-and", word: "and", blendId: "nd", blendPosition: "final", syllables: ["and"], phonemes: ["a", "nd"], difficulty: 1, imageKeyword: "and" },
  { id: "nd-hand", word: "hand", blendId: "nd", blendPosition: "final", syllables: ["hand"], phonemes: ["h", "a", "nd"], difficulty: 1, imageKeyword: "hand" },
  { id: "nd-sand", word: "sand", blendId: "nd", blendPosition: "final", syllables: ["sand"], phonemes: ["s", "a", "nd"], difficulty: 1, imageKeyword: "sand" },
  { id: "nd-end", word: "end", blendId: "nd", blendPosition: "final", syllables: ["end"], phonemes: ["e", "nd"], difficulty: 1, imageKeyword: "end" },
  { id: "nd-bend", word: "bend", blendId: "nd", blendPosition: "final", syllables: ["bend"], phonemes: ["b", "e", "nd"], difficulty: 1, imageKeyword: "bend" },
  { id: "nd-friend", word: "friend", blendId: "nd", blendPosition: "final", syllables: ["friend"], phonemes: ["f", "r", "ie", "nd"], difficulty: 2, imageKeyword: "friend" },

  // NK
  { id: "nk-pink", word: "pink", blendId: "nk", blendPosition: "final", syllables: ["pink"], phonemes: ["p", "i", "nk"], difficulty: 1, imageKeyword: "pink" },
  { id: "nk-think", word: "think", blendId: "nk", blendPosition: "final", syllables: ["think"], phonemes: ["th", "i", "nk"], difficulty: 2, imageKeyword: "think" },
  { id: "nk-drink", word: "drink", blendId: "nk", blendPosition: "final", syllables: ["drink"], phonemes: ["d", "r", "i", "nk"], difficulty: 2, imageKeyword: "drink" },
  { id: "nk-sink", word: "sink", blendId: "nk", blendPosition: "final", syllables: ["sink"], phonemes: ["s", "i", "nk"], difficulty: 1, imageKeyword: "sink" },
  { id: "nk-bank", word: "bank", blendId: "nk", blendPosition: "final", syllables: ["bank"], phonemes: ["b", "a", "nk"], difficulty: 1, imageKeyword: "bank" },
  { id: "nk-trunk", word: "trunk", blendId: "nk", blendPosition: "final", syllables: ["trunk"], phonemes: ["t", "r", "u", "nk"], difficulty: 2, imageKeyword: "trunk" },

  // Final SK
  { id: "sk-ask", word: "ask", blendId: "sk-final", blendPosition: "final", syllables: ["ask"], phonemes: ["a", "sk"], difficulty: 1, imageKeyword: "ask" },
  { id: "sk-mask", word: "mask", blendId: "sk-final", blendPosition: "final", syllables: ["mask"], phonemes: ["m", "a", "sk"], difficulty: 1, imageKeyword: "mask" },
  { id: "sk-desk", word: "desk", blendId: "sk-final", blendPosition: "final", syllables: ["desk"], phonemes: ["d", "e", "sk"], difficulty: 1, imageKeyword: "desk" },
  { id: "sk-task", word: "task", blendId: "sk-final", blendPosition: "final", syllables: ["task"], phonemes: ["t", "a", "sk"], difficulty: 1, imageKeyword: "task" },
  { id: "sk-risk", word: "risk", blendId: "sk-final", blendPosition: "final", syllables: ["risk"], phonemes: ["r", "i", "sk"], difficulty: 1, imageKeyword: "risk" },
  { id: "sk-dusk", word: "dusk", blendId: "sk-final", blendPosition: "final", syllables: ["dusk"], phonemes: ["d", "u", "sk"], difficulty: 1, imageKeyword: "dusk" },

  // Final ST
  { id: "st-best", word: "best", blendId: "st-final", blendPosition: "final", syllables: ["best"], phonemes: ["b", "e", "st"], difficulty: 1, imageKeyword: "best" },
  { id: "st-test", word: "test", blendId: "st-final", blendPosition: "final", syllables: ["test"], phonemes: ["t", "e", "st"], difficulty: 1, imageKeyword: "test" },
  { id: "st-fast", word: "fast", blendId: "st-final", blendPosition: "final", syllables: ["fast"], phonemes: ["f", "a", "st"], difficulty: 1, imageKeyword: "fast" },
  { id: "st-last", word: "last", blendId: "st-final", blendPosition: "final", syllables: ["last"], phonemes: ["l", "a", "st"], difficulty: 1, imageKeyword: "last" },
  { id: "st-list", word: "list", blendId: "st-final", blendPosition: "final", syllables: ["list"], phonemes: ["l", "i", "st"], difficulty: 1, imageKeyword: "list" },
  { id: "st-first", word: "first", blendId: "st-final", blendPosition: "final", syllables: ["first"], phonemes: ["f", "ir", "st"], difficulty: 2, imageKeyword: "first" },
];

// Helper functions
export function getBlendById(id: string): BlendItem | undefined {
  return BLENDS.find((b) => b.id === id);
}

export function getWordsByBlend(blendId: string): BlendWord[] {
  return BLEND_WORDS.filter((w) => w.blendId === blendId);
}

export function getWordsByCategory(category: BlendItem["category"]): BlendWord[] {
  const blendIds = BLENDS.filter((b) => b.category === category).map((b) => b.id);
  return BLEND_WORDS.filter((w) => blendIds.includes(w.blendId));
}

export function getWordsByDifficulty(difficulty: 1 | 2 | 3): BlendWord[] {
  return BLEND_WORDS.filter((w) => w.difficulty === difficulty);
}

export function getInitialBlends(): BlendItem[] {
  return BLENDS.filter((b) => b.type === "initial");
}

export function getFinalBlends(): BlendItem[] {
  return BLENDS.filter((b) => b.type === "final");
}

export function getRandomBlendWords(count: number, blendId?: string): BlendWord[] {
  let words = blendId ? getWordsByBlend(blendId) : [...BLEND_WORDS];
  const shuffled = words.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
