export type WordCategory = "Animals" | "Food" | "Objects" | "Nature" | "Actions" | "Body" | "Places";

export type WordItem = {
    id: string;
    word: string;
    image: string;
    letters: string[];
    category: WordCategory;
    sentence: string; // Example sentence showing word in context
    hint: string; // Contextual hint for the word
    difficulty: 1 | 2 | 3; // 1=Easy (3 letters), 2=Medium (4 letters), 3=Hard (5+ letters)
    relatedWords?: string[]; // Words in the same word family
    isSightWord?: boolean; // Is this a high-frequency sight word?
};

export const WORDS_DATA: WordItem[] = [
    // ========== DIFFICULTY 1: Simple 3-letter words ==========

    // Animals (Difficulty 1)
    {
        id: "1",
        word: "CAT",
        letters: ["C", "A", "T"],
        category: "Animals",
        sentence: "The cat drinks milk.",
        hint: "A furry pet that says meow",
        difficulty: 1,
        relatedWords: ["HAT", "BAT", "RAT", "MAT"],
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop"
    },
    {
        id: "2",
        word: "DOG",
        letters: ["D", "O", "G"],
        category: "Animals",
        sentence: "The dog wags its tail.",
        hint: "A friendly pet that barks",
        difficulty: 1,
        relatedWords: ["LOG", "FOG", "HOG"],
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop"
    },
    {
        id: "3",
        word: "PIG",
        letters: ["P", "I", "G"],
        category: "Animals",
        sentence: "The pig rolls in mud.",
        hint: "A pink farm animal that oinks",
        difficulty: 1,
        relatedWords: ["BIG", "DIG", "WIG"],
        image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&h=400&fit=crop"
    },
    {
        id: "4",
        word: "FOX",
        letters: ["F", "O", "X"],
        category: "Animals",
        sentence: "The red fox is clever.",
        hint: "A wild animal with a bushy tail",
        difficulty: 1,
        relatedWords: ["BOX", "OX"],
        image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400&h=400&fit=crop"
    },
    {
        id: "5",
        word: "OWL",
        letters: ["O", "W", "L"],
        category: "Animals",
        sentence: "The owl hoots at night.",
        hint: "A wise bird that stays up late",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1568526381923-caf3fd520382?w=400&h=400&fit=crop"
    },
    {
        id: "6",
        word: "BEE",
        letters: ["B", "E", "E"],
        category: "Animals",
        sentence: "The bee makes honey.",
        hint: "An insect that buzzes",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1558818498-28c1e002b655?w=400&h=400&fit=crop"
    },
    {
        id: "7",
        word: "BUG",
        letters: ["B", "U", "G"],
        category: "Animals",
        sentence: "I saw a bug on the leaf.",
        hint: "A tiny crawling creature",
        difficulty: 1,
        relatedWords: ["HUG", "MUG", "RUG"],
        image: "https://images.unsplash.com/photo-1563485881241-e62b1a5a27fb?w=400&h=400&fit=crop"
    },
    {
        id: "8",
        word: "BAT",
        letters: ["B", "A", "T"],
        category: "Animals",
        sentence: "The bat flies at night.",
        hint: "An animal with wings that hangs upside down",
        difficulty: 1,
        relatedWords: ["CAT", "HAT", "RAT", "MAT"],
        image: "https://images.unsplash.com/photo-1594403853023-26f7de92bdcf?w=400&h=400&fit=crop"
    },

    // Food (Difficulty 1)
    {
        id: "20",
        word: "EGG",
        letters: ["E", "G", "G"],
        category: "Food",
        sentence: "I ate an egg for breakfast.",
        hint: "Chickens lay these",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop"
    },
    {
        id: "21",
        word: "JAM",
        letters: ["J", "A", "M"],
        category: "Food",
        sentence: "I spread jam on my toast.",
        hint: "Sweet fruit spread",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop"
    },
    {
        id: "22",
        word: "NUT",
        letters: ["N", "U", "T"],
        category: "Food",
        sentence: "Squirrels love to eat nuts.",
        hint: "Small crunchy snack",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=400&h=400&fit=crop"
    },
    {
        id: "23",
        word: "PIE",
        letters: ["P", "I", "E"],
        category: "Food",
        sentence: "Apple pie tastes yummy.",
        hint: "A sweet dessert",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400&h=400&fit=crop"
    },
    {
        id: "24",
        word: "BUN",
        letters: ["B", "U", "N"],
        category: "Food",
        sentence: "I like a burger on a bun.",
        hint: "Soft bread roll",
        difficulty: 1,
        relatedWords: ["RUN", "SUN", "FUN"],
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop"
    },
    {
        id: "25",
        word: "TEA",
        letters: ["T", "E", "A"],
        category: "Food",
        sentence: "Mom drinks hot tea.",
        hint: "A warm drink",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop"
    },

    // Objects (Difficulty 1)
    {
        id: "40",
        word: "BUS",
        letters: ["B", "U", "S"],
        category: "Objects",
        sentence: "I ride the bus to school.",
        hint: "A big yellow vehicle",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=400&fit=crop"
    },
    {
        id: "41",
        word: "HAT",
        letters: ["H", "A", "T"],
        category: "Objects",
        sentence: "I wear a hat in the sun.",
        hint: "You wear this on your head",
        difficulty: 1,
        relatedWords: ["CAT", "BAT", "RAT", "MAT"],
        image: "https://images.unsplash.com/photo-1588731257617-521ff1fbf08c?w=400&h=400&fit=crop"
    },
    {
        id: "42",
        word: "BOX",
        letters: ["B", "O", "X"],
        category: "Objects",
        sentence: "The toys are in the box.",
        hint: "A container for storing things",
        difficulty: 1,
        relatedWords: ["FOX", "OX"],
        image: "https://images.unsplash.com/photo-1544816565-aa8a0f2ab1ec?w=400&h=400&fit=crop"
    },
    {
        id: "43",
        word: "BED",
        letters: ["B", "E", "D"],
        category: "Objects",
        sentence: "I sleep in my bed.",
        hint: "You sleep on this",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop"
    },
    {
        id: "44",
        word: "CUP",
        letters: ["C", "U", "P"],
        category: "Objects",
        sentence: "I drink from a cup.",
        hint: "A container for drinks",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=400&h=400&fit=crop"
    },
    {
        id: "45",
        word: "PEN",
        letters: ["P", "E", "N"],
        category: "Objects",
        sentence: "I write with a pen.",
        hint: "You use this to write",
        difficulty: 1,
        relatedWords: ["TEN", "HEN", "DEN"],
        image: "https://images.unsplash.com/photo-1527305585912-bc87bf2f5ebd?w=400&h=400&fit=crop"
    },
    {
        id: "46",
        word: "BAG",
        letters: ["B", "A", "G"],
        category: "Objects",
        sentence: "I carry my bag to school.",
        hint: "You carry things in this",
        difficulty: 1,
        relatedWords: ["TAG", "RAG", "WAG"],
        image: "https://images.unsplash.com/photo-1544816565-aa8a0f2ab1ec?w=400&h=400&fit=crop"
    },
    {
        id: "47",
        word: "TOY",
        letters: ["T", "O", "Y"],
        category: "Objects",
        sentence: "This is my favorite toy.",
        hint: "Something fun to play with",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1558060370-d3ebc8c143e3?w=400&h=400&fit=crop"
    },
    {
        id: "48",
        word: "KEY",
        letters: ["K", "E", "Y"],
        category: "Objects",
        sentence: "Use the key to open the door.",
        hint: "This opens locks",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=400&fit=crop"
    },

    // Nature (Difficulty 1)
    {
        id: "60",
        word: "SUN",
        letters: ["S", "U", "N"],
        category: "Nature",
        sentence: "The sun is bright and warm.",
        hint: "It shines in the sky during the day",
        difficulty: 1,
        relatedWords: ["RUN", "BUN", "FUN"],
        image: "https://images.unsplash.com/photo-1523464862212-d6631d073194?w=400&h=400&fit=crop"
    },
    {
        id: "61",
        word: "SKY",
        letters: ["S", "K", "Y"],
        category: "Nature",
        sentence: "The sky is blue.",
        hint: "Look up to see this",
        difficulty: 1,
        image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=400&fit=crop"
    },
    {
        id: "62",
        word: "SEA",
        letters: ["S", "E", "A"],
        category: "Nature",
        sentence: "We swim in the sea.",
        hint: "A big body of salty water",
        difficulty: 1,
        isSightWord: true,
        image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=400&fit=crop"
    },
    {
        id: "63",
        word: "LOG",
        letters: ["L", "O", "G"],
        category: "Nature",
        sentence: "The frog sat on a log.",
        hint: "A piece of wood from a tree",
        difficulty: 1,
        relatedWords: ["DOG", "FOG", "HOG"],
        image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&h=400&fit=crop"
    },

    // Actions (Difficulty 1)
    {
        id: "80",
        word: "RUN",
        letters: ["R", "U", "N"],
        category: "Actions",
        sentence: "I can run very fast.",
        hint: "To move quickly on your feet",
        difficulty: 1,
        relatedWords: ["SUN", "BUN", "FUN"],
        isSightWord: true,
        image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=400&fit=crop"
    },
    {
        id: "81",
        word: "SIT",
        letters: ["S", "I", "T"],
        category: "Actions",
        sentence: "Please sit on the chair.",
        hint: "To rest on your bottom",
        difficulty: 1,
        relatedWords: ["HIT", "BIT", "FIT"],
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop"
    },
    {
        id: "82",
        word: "HOP",
        letters: ["H", "O", "P"],
        category: "Actions",
        sentence: "Rabbits hop on the grass.",
        hint: "To jump on one foot",
        difficulty: 1,
        relatedWords: ["TOP", "MOP", "POP"],
        image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=400&h=400&fit=crop"
    },

    // ========== DIFFICULTY 2: 4-letter words ==========

    // Animals (Difficulty 2)
    {
        id: "100",
        word: "DUCK",
        letters: ["D", "U", "C", "K"],
        category: "Animals",
        sentence: "The duck swims in the pond.",
        hint: "A water bird that quacks",
        difficulty: 2,
        relatedWords: ["LUCK", "TRUCK", "STUCK"],
        image: "https://images.unsplash.com/photo-1558842841-6ed29e39b5c7?w=400&h=400&fit=crop"
    },
    {
        id: "101",
        word: "FROG",
        letters: ["F", "R", "O", "G"],
        category: "Animals",
        sentence: "The frog jumps in the pond.",
        hint: "A green animal that hops",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1603941218120-6992a8e6d7f5?w=400&h=400&fit=crop"
    },
    {
        id: "102",
        word: "CRAB",
        letters: ["C", "R", "A", "B"],
        category: "Animals",
        sentence: "The crab walks sideways.",
        hint: "A sea creature with claws",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop"
    },
    {
        id: "103",
        word: "FISH",
        letters: ["F", "I", "S", "H"],
        category: "Animals",
        sentence: "The fish swims in water.",
        hint: "An animal that lives underwater",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&h=400&fit=crop"
    },
    {
        id: "104",
        word: "BEAR",
        letters: ["B", "E", "A", "R"],
        category: "Animals",
        sentence: "The bear is big and strong.",
        hint: "A large furry animal",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=400&h=400&fit=crop"
    },
    {
        id: "105",
        word: "LAMB",
        letters: ["L", "A", "M", "B"],
        category: "Animals",
        sentence: "The lamb is a baby sheep.",
        hint: "A young sheep",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop"
    },
    {
        id: "106",
        word: "GOAT",
        letters: ["G", "O", "A", "T"],
        category: "Animals",
        sentence: "The goat eats grass.",
        hint: "A farm animal with horns",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1533318087102-b3ad366ed041?w=400&h=400&fit=crop"
    },

    // Food (Difficulty 2)
    {
        id: "120",
        word: "CAKE",
        letters: ["C", "A", "K", "E"],
        category: "Food",
        sentence: "I love chocolate cake.",
        hint: "A sweet birthday treat",
        difficulty: 2,
        relatedWords: ["MAKE", "TAKE", "LAKE", "BAKE"],
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop"
    },
    {
        id: "121",
        word: "MILK",
        letters: ["M", "I", "L", "K"],
        category: "Food",
        sentence: "I drink cold milk.",
        hint: "A white drink from cows",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop"
    },
    {
        id: "122",
        word: "CORN",
        letters: ["C", "O", "R", "N"],
        category: "Food",
        sentence: "We eat corn on the cob.",
        hint: "A yellow vegetable",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=400&fit=crop"
    },
    {
        id: "123",
        word: "BEAN",
        letters: ["B", "E", "A", "N"],
        category: "Food",
        sentence: "Green beans are healthy.",
        hint: "A small green vegetable",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1516646762149-32b9e357ec71?w=400&h=400&fit=crop"
    },
    {
        id: "124",
        word: "RICE",
        letters: ["R", "I", "C", "E"],
        category: "Food",
        sentence: "We eat rice with dinner.",
        hint: "Small white grains to eat",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?w=400&h=400&fit=crop"
    },

    // Objects (Difficulty 2)
    {
        id: "140",
        word: "BALL",
        letters: ["B", "A", "L", "L"],
        category: "Objects",
        sentence: "I kick the ball.",
        hint: "A round toy you can throw",
        difficulty: 2,
        relatedWords: ["CALL", "FALL", "TALL", "WALL"],
        image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=400&h=400&fit=crop"
    },
    {
        id: "141",
        word: "BOOK",
        letters: ["B", "O", "O", "K"],
        category: "Objects",
        sentence: "I read a fun book.",
        hint: "You read this",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop"
    },
    {
        id: "142",
        word: "BELL",
        letters: ["B", "E", "L", "L"],
        category: "Objects",
        sentence: "The bell rings loudly.",
        hint: "It makes a ringing sound",
        difficulty: 2,
        relatedWords: ["WELL", "TELL", "SELL", "SHELL"],
        image: "https://images.unsplash.com/photo-1598974357801-cbce51d82e48?w=400&h=400&fit=crop"
    },
    {
        id: "143",
        word: "DOOR",
        letters: ["D", "O", "O", "R"],
        category: "Objects",
        sentence: "Open the door, please.",
        hint: "You walk through this",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=400&h=400&fit=crop"
    },
    {
        id: "144",
        word: "SOCK",
        letters: ["S", "O", "C", "K"],
        category: "Objects",
        sentence: "I wear socks on my feet.",
        hint: "You wear these inside shoes",
        difficulty: 2,
        relatedWords: ["ROCK", "LOCK", "DOCK", "CLOCK"],
        image: "https://images.unsplash.com/photo-1586350977828-d0a82dea0491?w=400&h=400&fit=crop"
    },
    {
        id: "145",
        word: "BIKE",
        letters: ["B", "I", "K", "E"],
        category: "Objects",
        sentence: "I ride my bike to the park.",
        hint: "A two-wheeled vehicle",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop"
    },
    {
        id: "146",
        word: "KITE",
        letters: ["K", "I", "T", "E"],
        category: "Objects",
        sentence: "The kite flies high in the sky.",
        hint: "You fly this in the wind",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1507099985932-87a4520ed1d5?w=400&h=400&fit=crop"
    },
    {
        id: "147",
        word: "BOAT",
        letters: ["B", "O", "A", "T"],
        category: "Objects",
        sentence: "The boat floats on water.",
        hint: "You sail in this",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1583212543558-4dc298a10c5c?w=400&h=400&fit=crop"
    },

    // Nature (Difficulty 2)
    {
        id: "160",
        word: "TREE",
        letters: ["T", "R", "E", "E"],
        category: "Nature",
        sentence: "Birds live in the tree.",
        hint: "A tall plant with leaves",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&h=400&fit=crop"
    },
    {
        id: "161",
        word: "RAIN",
        letters: ["R", "A", "I", "N"],
        category: "Nature",
        sentence: "The rain falls from clouds.",
        hint: "Water drops from the sky",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&h=400&fit=crop"
    },
    {
        id: "162",
        word: "MOON",
        letters: ["M", "O", "O", "N"],
        category: "Nature",
        sentence: "The moon shines at night.",
        hint: "You see this in the night sky",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=400&h=400&fit=crop"
    },
    {
        id: "163",
        word: "STAR",
        letters: ["S", "T", "A", "R"],
        category: "Nature",
        sentence: "Stars twinkle in the sky.",
        hint: "Tiny lights in the night sky",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=400&fit=crop"
    },
    {
        id: "164",
        word: "SNOW",
        letters: ["S", "N", "O", "W"],
        category: "Nature",
        sentence: "White snow covers the ground.",
        hint: "White and cold, falls in winter",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1547754980-3df97fed72a8?w=400&h=400&fit=crop"
    },
    {
        id: "165",
        word: "WIND",
        letters: ["W", "I", "N", "D"],
        category: "Nature",
        sentence: "The wind blows the leaves.",
        hint: "Moving air you can feel",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1504192010706-dd7f569ee2be?w=400&h=400&fit=crop"
    },
    {
        id: "166",
        word: "ROCK",
        letters: ["R", "O", "C", "K"],
        category: "Nature",
        sentence: "I found a smooth rock.",
        hint: "A hard piece of stone",
        difficulty: 2,
        relatedWords: ["SOCK", "LOCK", "DOCK", "CLOCK"],
        image: "https://images.unsplash.com/photo-1609740501808-52138807e52a?w=400&h=400&fit=crop"
    },
    {
        id: "167",
        word: "LAKE",
        letters: ["L", "A", "K", "E"],
        category: "Nature",
        sentence: "We swim in the lake.",
        hint: "A body of fresh water",
        difficulty: 2,
        relatedWords: ["CAKE", "MAKE", "TAKE", "BAKE"],
        image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=400&fit=crop"
    },

    // Actions (Difficulty 2)
    {
        id: "180",
        word: "JUMP",
        letters: ["J", "U", "M", "P"],
        category: "Actions",
        sentence: "I can jump really high.",
        hint: "To leap into the air",
        difficulty: 2,
        isSightWord: true,
        image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=400&h=400&fit=crop"
    },
    {
        id: "181",
        word: "KICK",
        letters: ["K", "I", "C", "K"],
        category: "Actions",
        sentence: "I kick the soccer ball.",
        hint: "To hit with your foot",
        difficulty: 2,
        relatedWords: ["PICK", "STICK", "TRICK"],
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=400&fit=crop"
    },
    {
        id: "182",
        word: "SING",
        letters: ["S", "I", "N", "G"],
        category: "Actions",
        sentence: "I love to sing songs.",
        hint: "To make music with your voice",
        difficulty: 2,
        relatedWords: ["RING", "KING", "WING", "BRING"],
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
    {
        id: "183",
        word: "CLAP",
        letters: ["C", "L", "A", "P"],
        category: "Actions",
        sentence: "Clap your hands together.",
        hint: "To hit your hands together",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1516450137517-162bfbeb8dba?w=400&h=400&fit=crop"
    },
    {
        id: "184",
        word: "SWIM",
        letters: ["S", "W", "I", "M"],
        category: "Actions",
        sentence: "Fish swim in the water.",
        hint: "To move through water",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=400&h=400&fit=crop"
    },

    // Body (Difficulty 2)
    {
        id: "200",
        word: "HAND",
        letters: ["H", "A", "N", "D"],
        category: "Body",
        sentence: "I wave my hand to say hello.",
        hint: "You have five fingers on this",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1516450137517-162bfbeb8dba?w=400&h=400&fit=crop"
    },
    {
        id: "201",
        word: "FOOT",
        letters: ["F", "O", "O", "T"],
        category: "Body",
        sentence: "I wear shoes on my feet.",
        hint: "You walk on these",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?w=400&h=400&fit=crop"
    },
    {
        id: "202",
        word: "NOSE",
        letters: ["N", "O", "S", "E"],
        category: "Body",
        sentence: "I smell flowers with my nose.",
        hint: "You use this to smell",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&h=400&fit=crop"
    },
    {
        id: "203",
        word: "KNEE",
        letters: ["K", "N", "E", "E"],
        category: "Body",
        sentence: "I bend my knee to sit.",
        hint: "The middle of your leg",
        difficulty: 2,
        image: "https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=400&h=400&fit=crop"
    },

    // ========== DIFFICULTY 3: 5+ letter words ==========

    // Animals (Difficulty 3)
    {
        id: "300",
        word: "HORSE",
        letters: ["H", "O", "R", "S", "E"],
        category: "Animals",
        sentence: "The horse runs in the field.",
        hint: "A large animal you can ride",
        difficulty: 3,
        image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=400&fit=crop"
    },
    {
        id: "301",
        word: "MOUSE",
        letters: ["M", "O", "U", "S", "E"],
        category: "Animals",
        sentence: "The mouse is very small.",
        hint: "A tiny animal that squeaks",
        difficulty: 3,
        image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=400&fit=crop"
    },
    {
        id: "302",
        word: "TIGER",
        letters: ["T", "I", "G", "E", "R"],
        category: "Animals",
        sentence: "The tiger has stripes.",
        hint: "A big striped cat",
        difficulty: 3,
        image: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&h=400&fit=crop"
    },
    {
        id: "303",
        word: "WHALE",
        letters: ["W", "H", "A", "L", "E"],
        category: "Animals",
        sentence: "The whale lives in the ocean.",
        hint: "The biggest animal in the sea",
        difficulty: 3,
        image: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=400&h=400&fit=crop"
    },
    {
        id: "304",
        word: "SNAKE",
        letters: ["S", "N", "A", "K", "E"],
        category: "Animals",
        sentence: "The snake slithers on the ground.",
        hint: "A long animal with no legs",
        difficulty: 3,
        relatedWords: ["CAKE", "MAKE", "TAKE", "LAKE"],
        image: "https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=400&h=400&fit=crop"
    },

    // Food (Difficulty 3)
    {
        id: "320",
        word: "BREAD",
        letters: ["B", "R", "E", "A", "D"],
        category: "Food",
        sentence: "I eat bread with butter.",
        hint: "Made from flour, you make toast with it",
        difficulty: 3,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop"
    },
    {
        id: "321",
        word: "APPLE",
        letters: ["A", "P", "P", "L", "E"],
        category: "Food",
        sentence: "I eat a red apple.",
        hint: "A crunchy red or green fruit",
        difficulty: 3,
        image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop"
    },
    {
        id: "322",
        word: "PIZZA",
        letters: ["P", "I", "Z", "Z", "A"],
        category: "Food",
        sentence: "Pizza is my favorite food.",
        hint: "A round food with cheese and toppings",
        difficulty: 3,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop"
    },

    // Objects (Difficulty 3)
    {
        id: "340",
        word: "CHAIR",
        letters: ["C", "H", "A", "I", "R"],
        category: "Objects",
        sentence: "Please sit on the chair.",
        hint: "You sit on this",
        difficulty: 3,
        image: "https://images.unsplash.com/photo-1506326426992-32b61983f2fd?w=400&h=400&fit=crop"
    },
    {
        id: "341",
        word: "TABLE",
        letters: ["T", "A", "B", "L", "E"],
        category: "Objects",
        sentence: "We eat dinner at the table.",
        hint: "You eat meals on this",
        difficulty: 3,
        image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=400&h=400&fit=crop"
    },
    {
        id: "342",
        word: "TRUCK",
        letters: ["T", "R", "U", "C", "K"],
        category: "Objects",
        sentence: "The truck carries heavy loads.",
        hint: "A big vehicle that carries things",
        difficulty: 3,
        relatedWords: ["DUCK", "LUCK", "STUCK"],
        image: "https://images.unsplash.com/photo-1590746330938-481c0c22edc7?w=400&h=400&fit=crop"
    },
    {
        id: "343",
        word: "CLOCK",
        letters: ["C", "L", "O", "C", "K"],
        category: "Objects",
        sentence: "The clock shows the time.",
        hint: "It tells you what time it is",
        difficulty: 3,
        relatedWords: ["ROCK", "SOCK", "LOCK", "DOCK"],
        image: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=400&h=400&fit=crop"
    },
    {
        id: "344",
        word: "SPOON",
        letters: ["S", "P", "O", "O", "N"],
        category: "Objects",
        sentence: "I eat soup with a spoon.",
        hint: "You use this to eat soup",
        difficulty: 3,
        image: "https://images.unsplash.com/photo-1528301721190-6c6c1b3ac085?w=400&h=400&fit=crop"
    },

    // Nature (Difficulty 3)
    {
        id: "360",
        word: "CLOUD",
        letters: ["C", "L", "O", "U", "D"],
        category: "Nature",
        sentence: "I see clouds in the sky.",
        hint: "White fluffy things in the sky",
        difficulty: 3,
        image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=400&fit=crop"
    },
    {
        id: "361",
        word: "GRASS",
        letters: ["G", "R", "A", "S", "S"],
        category: "Nature",
        sentence: "The grass is green and soft.",
        hint: "Green plants that cover the ground",
        difficulty: 3,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"
    },
    {
        id: "362",
        word: "PLANT",
        letters: ["P", "L", "A", "N", "T"],
        category: "Nature",
        sentence: "I water the plant every day.",
        hint: "A green growing thing",
        difficulty: 3,
        image: "https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=400&h=400&fit=crop"
    },
    {
        id: "363",
        word: "BEACH",
        letters: ["B", "E", "A", "C", "H"],
        category: "Nature",
        sentence: "We play at the beach.",
        hint: "Sandy place by the ocean",
        difficulty: 3,
        image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=400&fit=crop"
    },

    // Places (Difficulty 3)
    {
        id: "380",
        word: "HOUSE",
        letters: ["H", "O", "U", "S", "E"],
        category: "Places",
        sentence: "I live in a house.",
        hint: "A building where people live",
        difficulty: 3,
        image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=400&h=400&fit=crop"
    },
    {
        id: "381",
        word: "STORE",
        letters: ["S", "T", "O", "R", "E"],
        category: "Places",
        sentence: "We buy food at the store.",
        hint: "A place where you buy things",
        difficulty: 3,
        image: "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?w=400&h=400&fit=crop"
    },
    {
        id: "382",
        word: "SCHOOL",
        letters: ["S", "C", "H", "O", "O", "L"],
        category: "Places",
        sentence: "I learn new things at school.",
        hint: "A place where you learn",
        difficulty: 3,
        image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=400&fit=crop"
    },
];

// Helper functions
export function getWordsByDifficulty(difficulty: 1 | 2 | 3): WordItem[] {
    return WORDS_DATA.filter(word => word.difficulty === difficulty);
}

export function getWordsByCategory(category: WordCategory): WordItem[] {
    return WORDS_DATA.filter(word => word.category === category);
}

export function getRandomWord(): WordItem {
    return WORDS_DATA[Math.floor(Math.random() * WORDS_DATA.length)];
}

export function getWordById(id: string): WordItem | undefined {
    return WORDS_DATA.find(word => word.id === id);
}
