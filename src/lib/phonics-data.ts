// Character story for emotional learning (Ms. Rachel methodology)
export type LetterCharacter = {
    name: string;           // e.g., "Alex the Alligator"
    emotion: 'sad' | 'confused' | 'curious' | 'excited' | 'shy';
    problem: string;        // The character's problem that child helps solve
    celebration: string;    // What they say when helped
    memoryTrick?: string;   // Hand gesture or memory association
};

// Discovery objects for discovery-based learning
export type DiscoveryObject = {
    name: string;
    image: string;
};

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
    // Ms. Rachel methodology additions
    character?: LetterCharacter;
    discoveryObjects?: [DiscoveryObject, DiscoveryObject];
    wrongGuesses?: string[]; // Funny wrong guesses for discovery
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
        image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop",
        character: {
            name: "Alex the Alligator",
            emotion: "curious",
            problem: "I love apples so much! But what letter does Apple start with?",
            celebration: "A! Apple starts with A! And so does my name - Alligator!",
            memoryTrick: "Put your hands up and open like puppet mouths. When you see an alligator, you go 'Ahh!' A says 'ah'!"
        },
        discoveryObjects: [
            { name: "Apple", image: "/images/discovery/apple.png" },
            { name: "Alligator", image: "/images/discovery/alligator.png" }
        ],
        wrongGuesses: [
            "Maybe the alligator is hungry and wants to eat the apple!",
            "Maybe the alligator wants to balance the apple on his head!"
        ]
    },
    {
        letter: "B",
        word: "Bear",
        exampleWords: ["Bear", "Ball", "Butterfly"],
        color: "bg-blue-400",
        sound: "b",
        phonemeSpelling: "buh",
        image: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=400&h=400&fit=crop",
        character: {
            name: "Bella the Bear",
            emotion: "shy",
            problem: "I want to play ball, but I'm too shy to ask. What letter does Ball start with?",
            celebration: "B! Ball starts with B! And Bear starts with B too! Let's play!",
            memoryTrick: "Bounce a pretend ball - buh, buh, buh! B says 'buh'!"
        },
        discoveryObjects: [
            { name: "Bear", image: "/images/discovery/bear.png" },
            { name: "Ball", image: "/images/discovery/ball.png" }
        ],
        wrongGuesses: [
            "Maybe the bear wants to eat the ball!",
            "Maybe the bear is teaching the ball to dance!"
        ]
    },
    {
        letter: "C",
        word: "Cat",
        exampleWords: ["Cat", "Car", "Cookie"],
        color: "bg-yellow-400",
        sound: "k",
        phonemeSpelling: "kuh",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
        character: {
            name: "Cleo the Cat",
            emotion: "curious",
            problem: "I found a cookie! What letter does Cookie start with?",
            celebration: "C! Cookie starts with C! And Cat starts with C too! Yummy!",
            memoryTrick: "Make your hand into a C shape - it's curvy like a cookie! C says 'kuh'!"
        },
        discoveryObjects: [
            { name: "Cat", image: "/images/discovery/cat.png" },
            { name: "Cookie", image: "/images/discovery/cookie.png" }
        ],
        wrongGuesses: [
            "Maybe the cat wants to share the cookie with us!",
            "Maybe the cat is going to hide the cookie!"
        ]
    },
    {
        letter: "D",
        word: "Dog",
        exampleWords: ["Dog", "Duck", "Dinosaur"],
        color: "bg-green-400",
        sound: "d",
        phonemeSpelling: "duh",
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
        character: {
            name: "Danny the Dinosaur",
            emotion: "excited",
            problem: "I want to play with my friend the dog! What letter does Dog start with?",
            celebration: "D! Dog starts with D! And Dinosaur starts with D too! Let's play!",
            memoryTrick: "Make your hand into a D shape and stomp like a dinosaur - duh, duh, duh! D says 'duh'!"
        },
        discoveryObjects: [
            { name: "Dog", image: "/images/discovery/dog.png" },
            { name: "Dinosaur", image: "/images/discovery/dinosaur.png" }
        ],
        wrongGuesses: [
            "Maybe the dinosaur wants to chase the dog!",
            "Maybe they're playing hide and seek!"
        ]
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
        image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=400&fit=crop",
        character: {
            name: "Ellie the Elephant",
            emotion: "curious",
            problem: "I found this egg! What letter does Egg start with?",
            celebration: "E! Egg starts with E! And Elephant starts with E too! I'm so happy!",
            memoryTrick: "Open your mouth wide and make a short 'eh' sound - like you're about to sneeze! E says 'eh'!"
        },
        discoveryObjects: [
            { name: "Elephant", image: "/images/discovery/elephant.png" },
            { name: "Egg", image: "/images/discovery/egg.png" }
        ],
        wrongGuesses: [
            "Maybe the elephant wants to sit on the egg!",
            "Maybe the egg has a baby elephant inside!"
        ]
    },
    {
        letter: "F",
        word: "Fish",
        exampleWords: ["Fish", "Frog", "Flower"],
        color: "bg-orange-400",
        sound: "f",
        phonemeSpelling: "fff",
        image: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&h=400&fit=crop",
        character: {
            name: "Freddy the Frog",
            emotion: "excited",
            problem: "I love swimming with my friend the fish! What letter does Fish start with?",
            celebration: "F! Fish starts with F! And Frog starts with F too! Splash splash!",
            memoryTrick: "Bite your lower lip and blow air - fffff! Like the wind! F says 'fff'!"
        },
        discoveryObjects: [
            { name: "Fish", image: "/images/discovery/fish.png" },
            { name: "Frog", image: "/images/discovery/frog.png" }
        ],
        wrongGuesses: [
            "Maybe the frog wants to race the fish!",
            "Maybe they're playing in the pond!"
        ]
    },
    {
        letter: "G",
        word: "Giraffe",
        exampleWords: ["Giraffe", "Goat", "Grapes"],
        color: "bg-teal-400",
        sound: "g",
        phonemeSpelling: "guh",
        image: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=400&h=400&fit=crop",
        character: {
            name: "Gary the Giraffe",
            emotion: "curious",
            problem: "I want to eat some grapes! What letter does Grapes start with?",
            celebration: "G! Grapes starts with G! And Giraffe starts with G too! Yummy grapes!",
            memoryTrick: "Open your throat and say 'guh' like you're swallowing grapes! G says 'guh'!"
        },
        discoveryObjects: [
            { name: "Giraffe", image: "/images/discovery/giraffe.png" },
            { name: "Grapes", image: "/images/discovery/grapes.png" }
        ],
        wrongGuesses: [
            "Maybe the giraffe wants to juggle the grapes!",
            "Maybe the giraffe is growing a grape vine on his neck!"
        ]
    },
    {
        letter: "H",
        word: "Horse",
        exampleWords: ["Horse", "House", "Hat"],
        color: "bg-indigo-400",
        sound: "h",
        phonemeSpelling: "hhh",
        image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=400&fit=crop",
        character: {
            name: "Henry the Horse",
            emotion: "excited",
            problem: "I found a fancy hat! What letter does Hat start with?",
            celebration: "H! Hat starts with H! And Horse starts with H too! Neigh!",
            memoryTrick: "Breathe out like you're fogging up a window - hhh! H says 'hhh'!"
        },
        discoveryObjects: [
            { name: "Horse", image: "/images/discovery/horse.png" },
            { name: "Hat", image: "/images/discovery/hat.png" }
        ],
        wrongGuesses: [
            "Maybe the horse wants to wear the hat!",
            "Maybe the hat is too small for the horse's head!"
        ]
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
        image: "https://images.unsplash.com/photo-1516715094483-75da06a7e2cf?w=400&h=400&fit=crop",
        character: {
            name: "Izzy the Insect",
            emotion: "shy",
            problem: "I live in this igloo! What letter does Igloo start with?",
            celebration: "I! Igloo starts with I! And Insect starts with I too! It's so cozy!",
            memoryTrick: "Make a short 'ih' sound like you're saying 'it' - ih! I says 'ih'!"
        },
        discoveryObjects: [
            { name: "Igloo", image: "/images/discovery/igloo.png" },
            { name: "Insect", image: "/images/discovery/insect.png" }
        ],
        wrongGuesses: [
            "Maybe the insect is cold and needs the igloo!",
            "Maybe there are lots of insects inside the igloo!"
        ]
    },
    {
        letter: "J",
        word: "Jellyfish",
        exampleWords: ["Jellyfish", "Juice", "Jump"],
        color: "bg-rose-400",
        sound: "dʒ",
        phonemeSpelling: "juh",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop",
        character: {
            name: "Jelly the Jellyfish",
            emotion: "excited",
            problem: "I love drinking juice! What letter does Juice start with?",
            celebration: "J! Juice starts with J! And Jellyfish starts with J too! Yay!",
            memoryTrick: "Jump and say 'juh' when you land! J says 'juh'!"
        },
        discoveryObjects: [
            { name: "Jellyfish", image: "/images/discovery/jellyfish.png" },
            { name: "Juice", image: "/images/discovery/juice.png" }
        ],
        wrongGuesses: [
            "Maybe the jellyfish wants to swim in the juice!",
            "Maybe the jellyfish is making juice with its tentacles!"
        ]
    },
    {
        letter: "K",
        word: "Kite",
        exampleWords: ["Kite", "King", "Kangaroo"],
        color: "bg-cyan-400",
        sound: "k",
        phonemeSpelling: "kuh",
        image: "https://images.unsplash.com/photo-1507099985932-87a4520ed1d5?w=400&h=400&fit=crop",
        character: {
            name: "Katie the Kangaroo",
            emotion: "excited",
            problem: "I want to fly my kite! What letter does Kite start with?",
            celebration: "K! Kite starts with K! And Kangaroo starts with K too! Let's fly!",
            memoryTrick: "Kick your leg like a kangaroo and say 'kuh'! K says 'kuh'!"
        },
        discoveryObjects: [
            { name: "Kangaroo", image: "/images/discovery/kangaroo.png" },
            { name: "Kite", image: "/images/discovery/kite.png" }
        ],
        wrongGuesses: [
            "Maybe the kangaroo will hop with the kite!",
            "Maybe the kite will carry the kangaroo into the sky!"
        ]
    },
    {
        letter: "L",
        word: "Lion",
        exampleWords: ["Lion", "Leaf", "Lemon"],
        color: "bg-amber-400",
        sound: "l",
        phonemeSpelling: "lll",
        image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&h=400&fit=crop",
        character: {
            name: "Leo the Lion",
            emotion: "curious",
            problem: "I found a lemon! What letter does Lemon start with?",
            celebration: "L! Lemon starts with L! And Lion starts with L too! Roar!",
            memoryTrick: "Lift your tongue to the roof of your mouth - lll! L says 'lll'!"
        },
        discoveryObjects: [
            { name: "Lion", image: "/images/discovery/lion.png" },
            { name: "Lemon", image: "/images/discovery/lemon.png" }
        ],
        wrongGuesses: [
            "Maybe the lion thinks the lemon is a ball!",
            "Maybe the lion will make lemonade!"
        ]
    },
    {
        letter: "M",
        word: "Monkey",
        exampleWords: ["Monkey", "Moon", "Mouse"],
        color: "bg-lime-400",
        sound: "m",
        phonemeSpelling: "mmm",
        image: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=400&fit=crop",
        character: {
            name: "Max the Monkey",
            emotion: "curious",
            problem: "I see the moon up in the sky! What letter does Moon start with?",
            celebration: "M! Moon starts with M! And Monkey starts with M too! Ooh ooh ahh ahh!",
            memoryTrick: "Close your lips and hum - mmmm! Like something yummy! M says 'mmm'!"
        },
        discoveryObjects: [
            { name: "Monkey", image: "/images/discovery/monkey.png" },
            { name: "Moon", image: "/images/discovery/moon.png" }
        ],
        wrongGuesses: [
            "Maybe the monkey wants to fly to the moon!",
            "Maybe the monkey is making a wish on the moon!"
        ]
    },
    {
        letter: "N",
        word: "Nest",
        exampleWords: ["Nest", "Nose", "Nut"],
        color: "bg-emerald-400",
        sound: "n",
        phonemeSpelling: "nnn",
        image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=400&fit=crop",
        character: {
            name: "Nina the Nightingale",
            emotion: "shy",
            problem: "I built this nest! What letter does Nest start with?",
            celebration: "N! Nest starts with N! And Nightingale starts with N too! Chirp!",
            memoryTrick: "Hum through your nose - nnn! Like saying 'no no no'! N says 'nnn'!"
        },
        discoveryObjects: [
            { name: "Nest", image: "/images/discovery/nest.png" },
            { name: "Nut", image: "/images/discovery/nut.png" }
        ],
        wrongGuesses: [
            "Maybe the bird hid the nut in the nest!",
            "Maybe the nest is made of nuts!"
        ]
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
        image: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&h=400&fit=crop",
        character: {
            name: "Ollie the Octopus",
            emotion: "curious",
            problem: "I found an orange! What letter does Orange start with?",
            celebration: "O! Orange starts with O! And Octopus starts with O too! Splashy!",
            memoryTrick: "Open your mouth wide like an O and say 'ah'! O says 'ah'!"
        },
        discoveryObjects: [
            { name: "Octopus", image: "/images/discovery/octopus.png" },
            { name: "Orange", image: "/images/discovery/orange.png" }
        ],
        wrongGuesses: [
            "Maybe the octopus will juggle the orange with all eight arms!",
            "Maybe the octopus wants orange juice!"
        ]
    },
    {
        letter: "P",
        word: "Penguin",
        exampleWords: ["Penguin", "Pig", "Pizza"],
        color: "bg-violet-400",
        sound: "p",
        phonemeSpelling: "puh",
        image: "https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=400&h=400&fit=crop",
        character: {
            name: "Penny the Penguin",
            emotion: "shy",
            problem: "I love pizza so much! What letter does Pizza start with?",
            celebration: "P! Pizza starts with P! And Penguin starts with P too! Yummy!",
            memoryTrick: "Pop your lips together like a bubble - puh! P says 'puh'!"
        },
        discoveryObjects: [
            { name: "Penguin", image: "/images/discovery/penguin.png" },
            { name: "Pizza", image: "/images/discovery/pizza.png" }
        ],
        wrongGuesses: [
            "Maybe the penguin wants to deliver the pizza!",
            "Maybe the penguin is having a pizza party!"
        ]
    },
    {
        letter: "Q",
        word: "Queen",
        exampleWords: ["Queen", "Quiet", "Quilt"],
        color: "bg-fuchsia-400",
        sound: "kw",
        phonemeSpelling: "kwuh",
        image: "https://images.unsplash.com/photo-1529257414772-1960b7bea4eb?w=400&h=400&fit=crop",
        character: {
            name: "Queenie the Queen",
            emotion: "shy",
            problem: "I have a cozy quilt! What letter does Quilt start with?",
            celebration: "Q! Quilt starts with Q! And Queen starts with Q too! Royal!",
            memoryTrick: "Q always has a U friend! Say 'kwuh' together! Q says 'kwuh'!"
        },
        discoveryObjects: [
            { name: "Queen", image: "/images/discovery/queen.png" },
            { name: "Quilt", image: "/images/discovery/quilt.png" }
        ],
        wrongGuesses: [
            "Maybe the queen made the quilt herself!",
            "Maybe the quilt has the queen's picture on it!"
        ]
    },
    {
        letter: "R",
        word: "Rabbit",
        exampleWords: ["Rabbit", "Robot", "Rainbow"],
        color: "bg-red-400",
        sound: "r",
        phonemeSpelling: "rrr",
        image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=400&fit=crop",
        character: {
            name: "Ruby the Rabbit",
            emotion: "excited",
            problem: "Look at the beautiful rainbow! What letter does Rainbow start with?",
            celebration: "R! Rainbow starts with R! And Rabbit starts with R too! Hop hop!",
            memoryTrick: "Growl like a pirate - rrr! Or rev like a race car! R says 'rrr'!"
        },
        discoveryObjects: [
            { name: "Rabbit", image: "/images/discovery/rabbit.png" },
            { name: "Rainbow", image: "/images/discovery/rainbow.png" }
        ],
        wrongGuesses: [
            "Maybe the rabbit wants to hop over the rainbow!",
            "Maybe the rainbow has carrots at the end!"
        ]
    },
    {
        letter: "S",
        word: "Snake",
        exampleWords: ["Snake", "Sun", "Star"],
        color: "bg-blue-400",
        sound: "s",
        phonemeSpelling: "sss",
        image: "https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=400&h=400&fit=crop",
        character: {
            name: "Sammy the Snake",
            emotion: "excited",
            problem: "I love looking at stars! What letter does Star start with?",
            celebration: "S! Star starts with S! And Snake starts with S too! Ssssuper!",
            memoryTrick: "Slither like a snake and make the sound - sssss! S says 'sss'!"
        },
        discoveryObjects: [
            { name: "Snake", image: "/images/discovery/snake.png" },
            { name: "Star", image: "/images/discovery/star.png" }
        ],
        wrongGuesses: [
            "Maybe the snake wants to catch the star!",
            "Maybe the snake is wishing on the star!"
        ]
    },
    {
        letter: "T",
        word: "Tiger",
        exampleWords: ["Tiger", "Tree", "Turtle"],
        color: "bg-yellow-400",
        sound: "t",
        phonemeSpelling: "tuh",
        image: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&h=400&fit=crop",
        character: {
            name: "Mr. Turtle",
            emotion: "sad",
            problem: "I don't know what letter my name starts with. Can you help me?",
            celebration: "T! I feel so happy! Turtle starts with T! Thank you for helping me!",
            memoryTrick: "Hold up your pointer finger near your mouth like a toothbrush. Move it away - tuh! T says 'tuh'!"
        },
        discoveryObjects: [
            { name: "Turtle", image: "/images/discovery/turtle.png" },
            { name: "Toothbrush", image: "/images/discovery/toothbrush.png" }
        ],
        wrongGuesses: [
            "Maybe the turtle is sad because he doesn't know how to brush his teeth!",
            "Maybe the turtle wants the toothbrush to tickle him!"
        ]
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
        image: "https://images.unsplash.com/photo-1503594384566-461fe158e797?w=400&h=400&fit=crop",
        character: {
            name: "Uma the Unicorn",
            emotion: "excited",
            problem: "It's raining! I need an umbrella! What letter does Umbrella start with?",
            celebration: "U! Umbrella starts with U! And Unicorn starts with U too! Magical!",
            memoryTrick: "Say 'uh' like you're thinking about something! U says 'uh'!"
        },
        discoveryObjects: [
            { name: "Unicorn", image: "/images/discovery/unicorn.png" },
            { name: "Umbrella", image: "/images/discovery/umbrella.png" }
        ],
        wrongGuesses: [
            "Maybe the unicorn's horn can hold the umbrella!",
            "Maybe it's raining rainbows on the unicorn!"
        ]
    },
    {
        letter: "V",
        word: "Van",
        exampleWords: ["Van", "Violin", "Volcano"],
        color: "bg-purple-400",
        sound: "v",
        phonemeSpelling: "vvv",
        image: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=400&h=400&fit=crop",
        character: {
            name: "Violet the Vulture",
            emotion: "curious",
            problem: "I want to play the violin! What letter does Violin start with?",
            celebration: "V! Violin starts with V! And Vulture starts with V too! Beautiful music!",
            memoryTrick: "Bite your lip gently and hum - vvv! Like a car zooming! V says 'vvv'!"
        },
        discoveryObjects: [
            { name: "Violin", image: "/images/discovery/violin.png" },
            { name: "Volcano", image: "/images/discovery/volcano.png" }
        ],
        wrongGuesses: [
            "Maybe the violin is as loud as a volcano!",
            "Maybe there's a violin concert near the volcano!"
        ]
    },
    {
        letter: "W",
        word: "Whale",
        exampleWords: ["Whale", "Water", "Window"],
        color: "bg-orange-400",
        sound: "w",
        phonemeSpelling: "wuh",
        image: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=400&h=400&fit=crop",
        character: {
            name: "Wally the Whale",
            emotion: "excited",
            problem: "I love swimming in the water! What letter does Water start with?",
            celebration: "W! Water starts with W! And Whale starts with W too! Splash!",
            memoryTrick: "Round your lips like you're blowing a kiss - wuh! W says 'wuh'!"
        },
        discoveryObjects: [
            { name: "Whale", image: "/images/discovery/whale.png" },
            { name: "Water", image: "/images/discovery/water.png" }
        ],
        wrongGuesses: [
            "Maybe the whale is making a waterfall with its spout!",
            "Maybe the whale is splashing in the water!"
        ]
    },
    {
        letter: "X",
        word: "Xylophone",
        exampleWords: ["Xylophone", "X-ray", "Fox"],
        color: "bg-teal-400",
        sound: "ks",
        phonemeSpelling: "ksss",
        image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&h=400&fit=crop",
        character: {
            name: "Xavier the Fox",
            emotion: "curious",
            problem: "I want to play my xylophone! What letter does Xylophone start with?",
            celebration: "X! Xylophone starts with X! And Fox ends with X too! Ding ding!",
            memoryTrick: "X makes a 'ks' sound like in 'box'! X says 'ks'!"
        },
        discoveryObjects: [
            { name: "Xylophone", image: "/images/discovery/xylophone.png" },
            { name: "Fox", image: "/images/discovery/fox.png" }
        ],
        wrongGuesses: [
            "Maybe the fox is playing a song on the xylophone!",
            "Maybe the fox wants to dance to the xylophone music!"
        ]
    },
    {
        letter: "Y",
        word: "Yak",
        exampleWords: ["Yak", "Yellow", "Yarn"],
        color: "bg-indigo-400",
        sound: "j",
        phonemeSpelling: "yuh",
        image: "https://images.unsplash.com/photo-1551069613-1904dbdcda11?w=400&h=400&fit=crop",
        character: {
            name: "Yolanda the Yak",
            emotion: "excited",
            problem: "I love playing with yellow yarn! What letter does Yellow start with?",
            celebration: "Y! Yellow starts with Y! And Yak starts with Y too! Yippee!",
            memoryTrick: "Say 'yes yes yes!' - yuh! Y says 'yuh'!"
        },
        discoveryObjects: [
            { name: "Yak", image: "/images/discovery/yak.png" },
            { name: "Yarn", image: "/images/discovery/yarn.png" }
        ],
        wrongGuesses: [
            "Maybe the yak wants to knit with the yarn!",
            "Maybe the yarn is tangled in the yak's fur!"
        ]
    },
    {
        letter: "Z",
        word: "Zebra",
        exampleWords: ["Zebra", "Zoo", "Zipper"],
        color: "bg-pink-400",
        sound: "z",
        phonemeSpelling: "zzz",
        image: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400&h=400&fit=crop",
        character: {
            name: "Ziggy the Zebra",
            emotion: "excited",
            problem: "I live at the zoo! What letter does Zoo start with?",
            celebration: "Z! Zoo starts with Z! And Zebra starts with Z too! Stripes are cool!",
            memoryTrick: "Buzz like a bee - zzz! Or pretend you're sleeping! Z says 'zzz'!"
        },
        discoveryObjects: [
            { name: "Zebra", image: "/images/discovery/zebra.png" },
            { name: "Zipper", image: "/images/discovery/zipper.png" }
        ],
        wrongGuesses: [
            "Maybe the zebra's stripes look like a zipper!",
            "Maybe we can zip up the zebra's pajamas!"
        ]
    },
];
