// Sight words are high-frequency words that children should recognize instantly
// without having to sound them out. These don't always follow phonetic rules.

export type SightWord = {
    word: string;
    sentence: string; // Example sentence using the word
    difficulty: 1 | 2 | 3 | 4 | 5; // Dolch word list levels (Pre-K through 3rd grade)
    category: string; // Dolch category
};

export const SIGHT_WORDS_DATA: SightWord[] = [
    // Pre-Kindergarten (Difficulty 1) - 40 words
    { word: "A", sentence: "I see a cat.", difficulty: 1, category: "Pre-K" },
    { word: "AND", sentence: "I have a cat and a dog.", difficulty: 1, category: "Pre-K" },
    { word: "AWAY", sentence: "The bird flew away.", difficulty: 1, category: "Pre-K" },
    { word: "BIG", sentence: "The elephant is big.", difficulty: 1, category: "Pre-K" },
    { word: "BLUE", sentence: "The sky is blue.", difficulty: 1, category: "Pre-K" },
    { word: "CAN", sentence: "I can jump high.", difficulty: 1, category: "Pre-K" },
    { word: "COME", sentence: "Come and play with me.", difficulty: 1, category: "Pre-K" },
    { word: "DOWN", sentence: "The ball rolled down the hill.", difficulty: 1, category: "Pre-K" },
    { word: "FIND", sentence: "Can you find the toy?", difficulty: 1, category: "Pre-K" },
    { word: "FOR", sentence: "This gift is for you.", difficulty: 1, category: "Pre-K" },
    { word: "FUNNY", sentence: "The clown is funny.", difficulty: 1, category: "Pre-K" },
    { word: "GO", sentence: "Let's go to the park.", difficulty: 1, category: "Pre-K" },
    { word: "HELP", sentence: "Can you help me?", difficulty: 1, category: "Pre-K" },
    { word: "HERE", sentence: "Come here, please.", difficulty: 1, category: "Pre-K" },
    { word: "I", sentence: "I like to play.", difficulty: 1, category: "Pre-K" },
    { word: "IN", sentence: "The toy is in the box.", difficulty: 1, category: "Pre-K" },
    { word: "IS", sentence: "The cat is happy.", difficulty: 1, category: "Pre-K" },
    { word: "IT", sentence: "Look at it!", difficulty: 1, category: "Pre-K" },
    { word: "JUMP", sentence: "I can jump very high.", difficulty: 1, category: "Pre-K" },
    { word: "LITTLE", sentence: "I have a little puppy.", difficulty: 1, category: "Pre-K" },
    { word: "LOOK", sentence: "Look at the rainbow!", difficulty: 1, category: "Pre-K" },
    { word: "MAKE", sentence: "Let's make a cake.", difficulty: 1, category: "Pre-K" },
    { word: "ME", sentence: "Give the ball to me.", difficulty: 1, category: "Pre-K" },
    { word: "MY", sentence: "This is my toy.", difficulty: 1, category: "Pre-K" },
    { word: "NOT", sentence: "I am not tired.", difficulty: 1, category: "Pre-K" },
    { word: "ONE", sentence: "I have one apple.", difficulty: 1, category: "Pre-K" },
    { word: "PLAY", sentence: "I like to play outside.", difficulty: 1, category: "Pre-K" },
    { word: "RED", sentence: "The apple is red.", difficulty: 1, category: "Pre-K" },
    { word: "RUN", sentence: "I can run fast.", difficulty: 1, category: "Pre-K" },
    { word: "SAID", sentence: "Mom said we can go.", difficulty: 1, category: "Pre-K" },
    { word: "SEE", sentence: "I see a bird.", difficulty: 1, category: "Pre-K" },
    { word: "THE", sentence: "The dog is big.", difficulty: 1, category: "Pre-K" },
    { word: "THREE", sentence: "I have three cookies.", difficulty: 1, category: "Pre-K" },
    { word: "TO", sentence: "I go to school.", difficulty: 1, category: "Pre-K" },
    { word: "TWO", sentence: "I have two hands.", difficulty: 1, category: "Pre-K" },
    { word: "UP", sentence: "The balloon went up.", difficulty: 1, category: "Pre-K" },
    { word: "WE", sentence: "We are friends.", difficulty: 1, category: "Pre-K" },
    { word: "WHERE", sentence: "Where is my hat?", difficulty: 1, category: "Pre-K" },
    { word: "YELLOW", sentence: "The sun is yellow.", difficulty: 1, category: "Pre-K" },
    { word: "YOU", sentence: "I like you.", difficulty: 1, category: "Pre-K" },

    // Kindergarten (Difficulty 2) - Selected high-frequency words
    { word: "ALL", sentence: "All the kids are playing.", difficulty: 2, category: "Kindergarten" },
    { word: "AM", sentence: "I am happy today.", difficulty: 2, category: "Kindergarten" },
    { word: "ARE", sentence: "You are my friend.", difficulty: 2, category: "Kindergarten" },
    { word: "AT", sentence: "Look at the stars.", difficulty: 2, category: "Kindergarten" },
    { word: "ATE", sentence: "I ate an apple.", difficulty: 2, category: "Kindergarten" },
    { word: "BE", sentence: "I want to be a pilot.", difficulty: 2, category: "Kindergarten" },
    { word: "BLACK", sentence: "The cat is black.", difficulty: 2, category: "Kindergarten" },
    { word: "BROWN", sentence: "The bear is brown.", difficulty: 2, category: "Kindergarten" },
    { word: "BUT", sentence: "I like it, but it's big.", difficulty: 2, category: "Kindergarten" },
    { word: "CAME", sentence: "My friend came to visit.", difficulty: 2, category: "Kindergarten" },
    { word: "DID", sentence: "Did you see that?", difficulty: 2, category: "Kindergarten" },
    { word: "DO", sentence: "I can do it!", difficulty: 2, category: "Kindergarten" },
    { word: "EAT", sentence: "Let's eat lunch.", difficulty: 2, category: "Kindergarten" },
    { word: "FOUR", sentence: "I have four crayons.", difficulty: 2, category: "Kindergarten" },
    { word: "GET", sentence: "Can you get the ball?", difficulty: 2, category: "Kindergarten" },
    { word: "GOOD", sentence: "That tastes good!", difficulty: 2, category: "Kindergarten" },
    { word: "HAVE", sentence: "I have a new toy.", difficulty: 2, category: "Kindergarten" },
    { word: "HE", sentence: "He is my brother.", difficulty: 2, category: "Kindergarten" },
    { word: "INTO", sentence: "The cat went into the house.", difficulty: 2, category: "Kindergarten" },
    { word: "LIKE", sentence: "I like ice cream.", difficulty: 2, category: "Kindergarten" },
    { word: "MUST", sentence: "We must be quiet.", difficulty: 2, category: "Kindergarten" },
    { word: "NEW", sentence: "I got a new bike.", difficulty: 2, category: "Kindergarten" },
    { word: "NO", sentence: "No, thank you.", difficulty: 2, category: "Kindergarten" },
    { word: "NOW", sentence: "Let's go now.", difficulty: 2, category: "Kindergarten" },
    { word: "ON", sentence: "The book is on the table.", difficulty: 2, category: "Kindergarten" },
    { word: "OUR", sentence: "This is our classroom.", difficulty: 2, category: "Kindergarten" },
    { word: "OUT", sentence: "Let's go out and play.", difficulty: 2, category: "Kindergarten" },
    { word: "PLEASE", sentence: "Please pass the milk.", difficulty: 2, category: "Kindergarten" },
    { word: "PRETTY", sentence: "The flower is pretty.", difficulty: 2, category: "Kindergarten" },
    { word: "RAN", sentence: "The dog ran fast.", difficulty: 2, category: "Kindergarten" },
    { word: "RIDE", sentence: "I can ride a bike.", difficulty: 2, category: "Kindergarten" },
    { word: "SAW", sentence: "I saw a rainbow.", difficulty: 2, category: "Kindergarten" },
    { word: "SAY", sentence: "What did you say?", difficulty: 2, category: "Kindergarten" },
    { word: "SHE", sentence: "She is my sister.", difficulty: 2, category: "Kindergarten" },
    { word: "SO", sentence: "I am so happy!", difficulty: 2, category: "Kindergarten" },
    { word: "SOON", sentence: "Dinner will be ready soon.", difficulty: 2, category: "Kindergarten" },
    { word: "THAT", sentence: "I like that toy.", difficulty: 2, category: "Kindergarten" },
    { word: "THERE", sentence: "Put it over there.", difficulty: 2, category: "Kindergarten" },
    { word: "THEY", sentence: "They are playing.", difficulty: 2, category: "Kindergarten" },
    { word: "THIS", sentence: "This is my book.", difficulty: 2, category: "Kindergarten" },
    { word: "TOO", sentence: "I want to come too!", difficulty: 2, category: "Kindergarten" },
    { word: "UNDER", sentence: "The ball is under the bed.", difficulty: 2, category: "Kindergarten" },
    { word: "WANT", sentence: "I want some water.", difficulty: 2, category: "Kindergarten" },
    { word: "WAS", sentence: "Yesterday was fun.", difficulty: 2, category: "Kindergarten" },
    { word: "WELL", sentence: "I feel well today.", difficulty: 2, category: "Kindergarten" },
    { word: "WENT", sentence: "We went to the zoo.", difficulty: 2, category: "Kindergarten" },
    { word: "WHAT", sentence: "What is your name?", difficulty: 2, category: "Kindergarten" },
    { word: "WHITE", sentence: "The snow is white.", difficulty: 2, category: "Kindergarten" },
    { word: "WHO", sentence: "Who is that?", difficulty: 2, category: "Kindergarten" },
    { word: "WILL", sentence: "I will help you.", difficulty: 2, category: "Kindergarten" },
    { word: "WITH", sentence: "Come with me.", difficulty: 2, category: "Kindergarten" },
    { word: "YES", sentence: "Yes, I would like that.", difficulty: 2, category: "Kindergarten" },
];

// Helper functions
export function getSightWordsByDifficulty(difficulty: 1 | 2 | 3 | 4 | 5): SightWord[] {
    return SIGHT_WORDS_DATA.filter(word => word.difficulty === difficulty);
}

export function getSightWordsByCategory(category: string): SightWord[] {
    return SIGHT_WORDS_DATA.filter(word => word.category === category);
}

export function isSightWord(word: string): boolean {
    return SIGHT_WORDS_DATA.some(sw => sw.word === word.toUpperCase());
}
