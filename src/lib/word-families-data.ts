export type WordFamily = {
    pattern: string; // The common ending, e.g., "-at"
    name: string; // Display name, e.g., "AT Family"
    words: string[]; // Words in this family
    color: string; // Theme color for UI
    difficulty: 1 | 2 | 3; // Difficulty level
    image?: string; // Optional representative image
};

export const WORD_FAMILIES_DATA: WordFamily[] = [
    // Difficulty 1: Simple 3-letter CVC patterns
    {
        pattern: "-at",
        name: "AT Family",
        words: ["CAT", "HAT", "BAT", "RAT", "MAT", "SAT", "PAT", "FAT"],
        color: "bg-red-400",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop"
    },
    {
        pattern: "-an",
        name: "AN Family",
        words: ["CAN", "MAN", "PAN", "RAN", "FAN", "TAN", "VAN"],
        color: "bg-blue-400",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=400&h=400&fit=crop"
    },
    {
        pattern: "-ap",
        name: "AP Family",
        words: ["CAP", "MAP", "TAP", "NAP", "GAP", "LAP", "ZAP"],
        color: "bg-yellow-400",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1588731257617-521ff1fbf08c?w=400&h=400&fit=crop"
    },
    {
        pattern: "-ag",
        name: "AG Family",
        words: ["BAG", "TAG", "RAG", "WAG", "SAG", "LAG"],
        color: "bg-green-400",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1544816565-aa8a0f2ab1ec?w=400&h=400&fit=crop"
    },
    {
        pattern: "-en",
        name: "EN Family",
        words: ["PEN", "TEN", "HEN", "DEN", "MEN"],
        color: "bg-purple-400",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1527305585912-bc87bf2f5ebd?w=400&h=400&fit=crop"
    },
    {
        pattern: "-et",
        name: "ET Family",
        words: ["PET", "WET", "NET", "GET", "SET", "JET", "LET", "MET"],
        color: "bg-orange-400",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop"
    },
    {
        pattern: "-ig",
        name: "IG Family",
        words: ["PIG", "BIG", "DIG", "WIG", "FIG", "JIG"],
        color: "bg-pink-400",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&h=400&fit=crop"
    },
    {
        pattern: "-in",
        name: "IN Family",
        words: ["PIN", "BIN", "WIN", "FIN", "TIN", "SIN"],
        color: "bg-teal-400",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop"
    },
    {
        pattern: "-ip",
        name: "IP Family",
        words: ["DIP", "HIP", "LIP", "SIP", "TIP", "ZIP", "RIP"],
        color: "bg-indigo-400",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop"
    },
    {
        pattern: "-it",
        name: "IT Family",
        words: ["SIT", "HIT", "BIT", "FIT", "PIT", "LIT", "KIT"],
        color: "bg-rose-400",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=400&fit=crop"
    },
    {
        pattern: "-op",
        name: "OP Family",
        words: ["TOP", "HOP", "MOP", "POP", "COP", "BOP"],
        color: "bg-cyan-400",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1519340333755-56e9c1d9e3b7?w=400&h=400&fit=crop"
    },
    {
        pattern: "-ot",
        name: "OT Family",
        words: ["HOT", "POT", "DOT", "COT", "GOT", "NOT", "LOT"],
        color: "bg-amber-400",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1585154344227-6bba6783a31a?w=400&h=400&fit=crop"
    },
    {
        pattern: "-og",
        name: "OG Family",
        words: ["DOG", "LOG", "FOG", "HOG", "JOG"],
        color: "bg-lime-400",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop"
    },
    {
        pattern: "-ug",
        name: "UG Family",
        words: ["BUG", "HUG", "MUG", "RUG", "TUG", "JUG", "DUG"],
        color: "bg-emerald-400",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1563485881241-e62b1a5a27fb?w=400&h=400&fit=crop"
    },
    {
        pattern: "-un",
        name: "UN Family",
        words: ["RUN", "SUN", "FUN", "BUN", "GUN"],
        color: "bg-sky-400",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1523464862212-d6631d073194?w=400&h=400&fit=crop"
    },

    // Difficulty 2: Slightly more complex patterns
    {
        pattern: "-ack",
        name: "ACK Family",
        words: ["BACK", "PACK", "SACK", "RACK", "TACK", "JACK"],
        color: "bg-violet-400",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"
    },
    {
        pattern: "-ock",
        name: "OCK Family",
        words: ["ROCK", "SOCK", "LOCK", "DOCK", "CLOCK", "BLOCK"],
        color: "bg-fuchsia-400",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1609740501808-52138807e52a?w=400&h=400&fit=crop"
    },
    {
        pattern: "-ick",
        name: "ICK Family",
        words: ["KICK", "PICK", "STICK", "TRICK", "THICK", "QUICK"],
        color: "bg-red-400",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=400&fit=crop"
    },
    {
        pattern: "-uck",
        name: "UCK Family",
        words: ["DUCK", "LUCK", "TRUCK", "STUCK", "CLUCK"],
        color: "bg-blue-400",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1558842841-6ed29e39b5c7?w=400&h=400&fit=crop"
    },
    {
        pattern: "-ing",
        name: "ING Family",
        words: ["RING", "SING", "KING", "WING", "BRING", "STRING"],
        color: "bg-yellow-400",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop"
    },
    {
        pattern: "-ank",
        name: "ANK Family",
        words: ["BANK", "TANK", "RANK", "SANK", "THANK"],
        color: "bg-green-400",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=400&h=400&fit=crop"
    },
    {
        pattern: "-ink",
        name: "INK Family",
        words: ["PINK", "WINK", "SINK", "DRINK", "THINK"],
        color: "bg-purple-400",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1520990269312-9b1597ba4eb7?w=400&h=400&fit=crop"
    },

    // Difficulty 3: More advanced patterns
    {
        pattern: "-all",
        name: "ALL Family",
        words: ["BALL", "CALL", "FALL", "TALL", "WALL", "SMALL"],
        color: "bg-orange-400",
        difficulty: 3,
        image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=400&h=400&fit=crop"
    },
    {
        pattern: "-ell",
        name: "ELL Family",
        words: ["BELL", "WELL", "TELL", "SELL", "SHELL", "SMELL"],
        color: "bg-pink-400",
        difficulty: 3,
        image: "https://images.unsplash.com/photo-1598974357801-cbce51d82e48?w=400&h=400&fit=crop"
    },
    {
        pattern: "-ill",
        name: "ILL Family",
        words: ["HILL", "BILL", "FILL", "WILL", "STILL", "SPILL"],
        color: "bg-teal-400",
        difficulty: 3,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop"
    },
    {
        pattern: "-ame",
        name: "AME Family",
        words: ["GAME", "NAME", "SAME", "CAME", "FRAME"],
        color: "bg-indigo-400",
        difficulty: 3,
        image: "https://images.unsplash.com/photo-1511882150382-421056c89033?w=400&h=400&fit=crop"
    },
    {
        pattern: "-ake",
        name: "AKE Family",
        words: ["CAKE", "MAKE", "TAKE", "LAKE", "BAKE", "SNAKE"],
        color: "bg-rose-400",
        difficulty: 3,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop"
    },
];

// Helper function to get word families by difficulty
export function getWordFamiliesByDifficulty(difficulty: 1 | 2 | 3): WordFamily[] {
    return WORD_FAMILIES_DATA.filter(family => family.difficulty === difficulty);
}

// Helper function to get all words from a specific family
export function getWordsInFamily(pattern: string): string[] {
    const family = WORD_FAMILIES_DATA.find(f => f.pattern === pattern);
    return family ? family.words : [];
}

// Helper function to find which family a word belongs to
export function findWordFamily(word: string): WordFamily | undefined {
    return WORD_FAMILIES_DATA.find(family =>
        family.words.includes(word.toUpperCase())
    );
}
