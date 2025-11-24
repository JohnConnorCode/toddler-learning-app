export type PhonicsItem = {
    letter: string;
    word: string;
    exampleWords: string[]; // Multiple example words
    color: string;
    sound: string; // Primary phonetic sound
    soundVariant?: string; // Alternative sound (for vowels: long sound)
    phonemeSpelling: string; // Better pronunciation for speech synthesis
    image: string;
    isVowel?: boolean;
};

export const PHONICS_DATA: PhonicsItem[] = [
    {
        letter: "A",
        word: "Apple",
        exampleWords: ["Apple", "Ant", "Alligator"],
        color: "bg-red-400",
        sound: "æ", // short 'a' as in 'apple'
        soundVariant: "ay", // long 'a' as in 'acorn'
        phonemeSpelling: "aah",
        isVowel: true,
        image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop"
    },
    {
        letter: "B",
        word: "Bear",
        exampleWords: ["Bear", "Ball", "Butterfly"],
        color: "bg-blue-400",
        sound: "b",
        phonemeSpelling: "buh",
        image: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=400&h=400&fit=crop"
    },
    {
        letter: "C",
        word: "Cat",
        exampleWords: ["Cat", "Car", "Cookie"],
        color: "bg-yellow-400",
        sound: "k",
        phonemeSpelling: "kuh",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop"
    },
    {
        letter: "D",
        word: "Dog",
        exampleWords: ["Dog", "Duck", "Dinosaur"],
        color: "bg-green-400",
        sound: "d",
        phonemeSpelling: "duh",
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop"
    },
    {
        letter: "E",
        word: "Elephant",
        exampleWords: ["Elephant", "Egg", "Elbow"],
        color: "bg-purple-400",
        sound: "ɛ", // short 'e' as in 'egg'
        soundVariant: "ee", // long 'e' as in 'eagle'
        phonemeSpelling: "ehh",
        isVowel: true,
        image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=400&fit=crop"
    },
    {
        letter: "F",
        word: "Fish",
        exampleWords: ["Fish", "Frog", "Flower"],
        color: "bg-orange-400",
        sound: "f",
        phonemeSpelling: "fff",
        image: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&h=400&fit=crop"
    },
    {
        letter: "G",
        word: "Giraffe",
        exampleWords: ["Giraffe", "Goat", "Grapes"],
        color: "bg-teal-400",
        sound: "g",
        phonemeSpelling: "guh",
        image: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=400&h=400&fit=crop"
    },
    {
        letter: "H",
        word: "Horse",
        exampleWords: ["Horse", "House", "Hat"],
        color: "bg-indigo-400",
        sound: "h",
        phonemeSpelling: "hhh",
        image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=400&fit=crop"
    },
    {
        letter: "I",
        word: "Igloo",
        exampleWords: ["Igloo", "Insect", "Ink"],
        color: "bg-pink-400",
        sound: "ɪ", // short 'i' as in 'igloo'
        soundVariant: "eye", // long 'i' as in 'ice'
        phonemeSpelling: "ihh",
        isVowel: true,
        image: "https://images.unsplash.com/photo-1516715094483-75da06a7e2cf?w=400&h=400&fit=crop"
    },
    {
        letter: "J",
        word: "Jellyfish",
        exampleWords: ["Jellyfish", "Juice", "Jump"],
        color: "bg-rose-400",
        sound: "dʒ",
        phonemeSpelling: "juh",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop"
    },
    {
        letter: "K",
        word: "Kite",
        exampleWords: ["Kite", "King", "Kangaroo"],
        color: "bg-cyan-400",
        sound: "k",
        phonemeSpelling: "kuh",
        image: "https://images.unsplash.com/photo-1507099985932-87a4520ed1d5?w=400&h=400&fit=crop"
    },
    {
        letter: "L",
        word: "Lion",
        exampleWords: ["Lion", "Leaf", "Lemon"],
        color: "bg-amber-400",
        sound: "l",
        phonemeSpelling: "lll",
        image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&h=400&fit=crop"
    },
    {
        letter: "M",
        word: "Monkey",
        exampleWords: ["Monkey", "Moon", "Mouse"],
        color: "bg-lime-400",
        sound: "m",
        phonemeSpelling: "mmm",
        image: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=400&fit=crop"
    },
    {
        letter: "N",
        word: "Nest",
        exampleWords: ["Nest", "Nose", "Nut"],
        color: "bg-emerald-400",
        sound: "n",
        phonemeSpelling: "nnn",
        image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=400&fit=crop"
    },
    {
        letter: "O",
        word: "Octopus",
        exampleWords: ["Octopus", "Orange", "Otter"],
        color: "bg-sky-400",
        sound: "ɒ", // short 'o' as in 'octopus'
        soundVariant: "oh", // long 'o' as in 'open'
        phonemeSpelling: "ahhh",
        isVowel: true,
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop"
    },
    {
        letter: "P",
        word: "Penguin",
        exampleWords: ["Penguin", "Pig", "Pizza"],
        color: "bg-violet-400",
        sound: "p",
        phonemeSpelling: "puh",
        image: "https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=400&h=400&fit=crop"
    },
    {
        letter: "Q",
        word: "Queen",
        exampleWords: ["Queen", "Quiet", "Quilt"],
        color: "bg-fuchsia-400",
        sound: "kw",
        phonemeSpelling: "kwuh",
        image: "https://images.unsplash.com/photo-1529257414772-1960b7bea4eb?w=400&h=400&fit=crop"
    },
    {
        letter: "R",
        word: "Rabbit",
        exampleWords: ["Rabbit", "Robot", "Rainbow"],
        color: "bg-red-400",
        sound: "r",
        phonemeSpelling: "rrr",
        image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=400&fit=crop"
    },
    {
        letter: "S",
        word: "Snake",
        exampleWords: ["Snake", "Sun", "Star"],
        color: "bg-blue-400",
        sound: "s",
        phonemeSpelling: "sss",
        image: "https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=400&h=400&fit=crop"
    },
    {
        letter: "T",
        word: "Tiger",
        exampleWords: ["Tiger", "Tree", "Turtle"],
        color: "bg-yellow-400",
        sound: "t",
        phonemeSpelling: "tuh",
        image: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&h=400&fit=crop"
    },
    {
        letter: "U",
        word: "Umbrella",
        exampleWords: ["Umbrella", "Uncle", "Unicorn"],
        color: "bg-green-400",
        sound: "ʌ", // short 'u' as in 'umbrella'
        soundVariant: "yoo", // long 'u' as in 'unicorn'
        phonemeSpelling: "uhh",
        isVowel: true,
        image: "https://images.unsplash.com/photo-1503594384566-461fe158e797?w=400&h=400&fit=crop"
    },
    {
        letter: "V",
        word: "Van",
        exampleWords: ["Van", "Violin", "Volcano"],
        color: "bg-purple-400",
        sound: "v",
        phonemeSpelling: "vvv",
        image: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=400&h=400&fit=crop"
    },
    {
        letter: "W",
        word: "Whale",
        exampleWords: ["Whale", "Water", "Window"],
        color: "bg-orange-400",
        sound: "w",
        phonemeSpelling: "wuh",
        image: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=400&h=400&fit=crop"
    },
    {
        letter: "X",
        word: "Xylophone",
        exampleWords: ["Xylophone", "X-ray", "Fox"],
        color: "bg-teal-400",
        sound: "ks",
        phonemeSpelling: "ksss",
        image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&h=400&fit=crop"
    },
    {
        letter: "Y",
        word: "Yak",
        exampleWords: ["Yak", "Yellow", "Yarn"],
        color: "bg-indigo-400",
        sound: "j",
        phonemeSpelling: "yuh",
        image: "https://images.unsplash.com/photo-1551069613-1904dbdcda11?w=400&h=400&fit=crop"
    },
    {
        letter: "Z",
        word: "Zebra",
        exampleWords: ["Zebra", "Zoo", "Zipper"],
        color: "bg-pink-400",
        sound: "z",
        phonemeSpelling: "zzz",
        image: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400&h=400&fit=crop"
    },
];
