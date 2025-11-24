/**
 * Assessment & Placement System
 *
 * This file contains all assessment questions, scoring logic, and placement recommendations
 * for determining a child's starting point in the reading program.
 */

export type AssessmentCategory =
  | "letter-names"
  | "letter-sounds"
  | "phonemic-awareness"
  | "cvc-reading"
  | "sight-words";

export type QuestionType =
  | "letter-identification"
  | "sound-identification"
  | "rhyme-recognition"
  | "first-sound"
  | "sound-counting"
  | "word-reading"
  | "sight-word-recognition";

export interface AssessmentQuestion {
  id: string;
  category: AssessmentCategory;
  type: QuestionType;
  prompt: string; // Spoken/displayed instruction
  audioPrompt?: string; // Optional audio file path
  options?: string[]; // For multiple choice
  correctAnswer: string;
  imagePrompt?: string; // For visual questions
  difficulty: 1 | 2 | 3;
}

export interface AssessmentResult {
  category: AssessmentCategory;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  details: {
    questionId: string;
    correct: boolean;
    timeSpent: number; // seconds
  }[];
}

export interface PlacementRecommendation {
  level: "pre-reading" | "early-phonics" | "phonics" | "advanced-phonics" | "fluency";
  startPath: string;
  startUnit: number;
  rationale: string;
  strengths: string[];
  areasToWatch: string[];
  parentGuidance: string;
}

export interface ComprehensiveAssessment {
  userId: string;
  date: Date;
  results: AssessmentResult[];
  placement: PlacementRecommendation;
  overallScore: number; // 0-100
  completionTime: number; // minutes
}

// Assessment Questions Database

export const LETTER_NAME_QUESTIONS: AssessmentQuestion[] = [
  // Sample of 10 letters - full assessment would have all 26
  {
    id: "ln-01",
    category: "letter-names",
    type: "letter-identification",
    prompt: "What is the name of this letter?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    imagePrompt: "/assets/letters/uppercase-a.png",
    difficulty: 1,
  },
  {
    id: "ln-02",
    category: "letter-names",
    type: "letter-identification",
    prompt: "What is the name of this letter?",
    options: ["M", "N", "H", "W"],
    correctAnswer: "M",
    imagePrompt: "/assets/letters/uppercase-m.png",
    difficulty: 1,
  },
  {
    id: "ln-03",
    category: "letter-names",
    type: "letter-identification",
    prompt: "What is the name of this letter?",
    options: ["S", "Z", "C", "G"],
    correctAnswer: "S",
    imagePrompt: "/assets/letters/uppercase-s.png",
    difficulty: 1,
  },
  {
    id: "ln-04",
    category: "letter-names",
    type: "letter-identification",
    prompt: "What is the name of this letter?",
    options: ["T", "I", "L", "F"],
    correctAnswer: "T",
    imagePrompt: "/assets/letters/uppercase-t.png",
    difficulty: 1,
  },
  {
    id: "ln-05",
    category: "letter-names",
    type: "letter-identification",
    prompt: "What is the name of this letter?",
    options: ["P", "R", "B", "D"],
    correctAnswer: "P",
    imagePrompt: "/assets/letters/uppercase-p.png",
    difficulty: 2,
  },
  {
    id: "ln-06",
    category: "letter-names",
    type: "letter-identification",
    prompt: "What is the name of this letter?",
    options: ["b", "d", "p", "q"],
    correctAnswer: "b",
    imagePrompt: "/assets/letters/lowercase-b.png",
    difficulty: 2,
  },
  {
    id: "ln-07",
    category: "letter-names",
    type: "letter-identification",
    prompt: "What is the name of this letter?",
    options: ["n", "u", "h", "m"],
    correctAnswer: "n",
    imagePrompt: "/assets/letters/lowercase-n.png",
    difficulty: 2,
  },
  {
    id: "ln-08",
    category: "letter-names",
    type: "letter-identification",
    prompt: "What is the name of this letter?",
    options: ["g", "q", "j", "y"],
    correctAnswer: "g",
    imagePrompt: "/assets/letters/lowercase-g.png",
    difficulty: 3,
  },
  {
    id: "ln-09",
    category: "letter-names",
    type: "letter-identification",
    prompt: "What is the name of this letter?",
    options: ["V", "Y", "X", "W"],
    correctAnswer: "X",
    imagePrompt: "/assets/letters/uppercase-x.png",
    difficulty: 3,
  },
  {
    id: "ln-10",
    category: "letter-names",
    type: "letter-identification",
    prompt: "What is the name of this letter?",
    options: ["q", "g", "p", "y"],
    correctAnswer: "q",
    imagePrompt: "/assets/letters/lowercase-q.png",
    difficulty: 3,
  },
];

export const LETTER_SOUND_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "ls-01",
    category: "letter-sounds",
    type: "sound-identification",
    prompt: "What sound does this letter make?",
    audioPrompt: "/audio/prompts/what-sound.mp3",
    options: ["/s/", "/z/", "/sh/", "/ch/"],
    correctAnswer: "/s/",
    imagePrompt: "/assets/letters/uppercase-s.png",
    difficulty: 1,
  },
  {
    id: "ls-02",
    category: "letter-sounds",
    type: "sound-identification",
    prompt: "What sound does this letter make?",
    options: ["/m/", "/n/", "/ng/", "/w/"],
    correctAnswer: "/m/",
    imagePrompt: "/assets/letters/uppercase-m.png",
    difficulty: 1,
  },
  {
    id: "ls-03",
    category: "letter-sounds",
    type: "sound-identification",
    prompt: "What sound does this letter make?",
    options: ["/a/", "/e/", "/i/", "/o/"],
    correctAnswer: "/a/",
    imagePrompt: "/assets/letters/uppercase-a.png",
    difficulty: 1,
  },
  {
    id: "ls-04",
    category: "letter-sounds",
    type: "sound-identification",
    prompt: "What sound does this letter make?",
    options: ["/t/", "/d/", "/k/", "/p/"],
    correctAnswer: "/t/",
    imagePrompt: "/assets/letters/uppercase-t.png",
    difficulty: 1,
  },
  {
    id: "ls-05",
    category: "letter-sounds",
    type: "sound-identification",
    prompt: "What sound does this letter make?",
    options: ["/p/", "/b/", "/d/", "/t/"],
    correctAnswer: "/p/",
    imagePrompt: "/assets/letters/uppercase-p.png",
    difficulty: 2,
  },
  {
    id: "ls-06",
    category: "letter-sounds",
    type: "sound-identification",
    prompt: "What sound does this letter make?",
    options: ["/i/", "/e/", "/a/", "/u/"],
    correctAnswer: "/i/",
    imagePrompt: "/assets/letters/lowercase-i.png",
    difficulty: 2,
  },
  {
    id: "ls-07",
    category: "letter-sounds",
    type: "sound-identification",
    prompt: "What sound does this letter make?",
    options: ["/g/", "/j/", "/k/", "/c/"],
    correctAnswer: "/g/",
    imagePrompt: "/assets/letters/lowercase-g.png",
    difficulty: 2,
  },
  {
    id: "ls-08",
    category: "letter-sounds",
    type: "sound-identification",
    prompt: "What sound does this letter make?",
    options: ["/v/", "/f/", "/b/", "/w/"],
    correctAnswer: "/v/",
    imagePrompt: "/assets/letters/lowercase-v.png",
    difficulty: 3,
  },
  {
    id: "ls-09",
    category: "letter-sounds",
    type: "sound-identification",
    prompt: "What sound does this letter make?",
    options: ["/y/", "/i/", "/j/", "/w/"],
    correctAnswer: "/y/",
    imagePrompt: "/assets/letters/lowercase-y.png",
    difficulty: 3,
  },
  {
    id: "ls-10",
    category: "letter-sounds",
    type: "sound-identification",
    prompt: "What sound does this letter make?",
    options: ["/qu/", "/k/", "/kw/", "/w/"],
    correctAnswer: "/kw/",
    imagePrompt: "/assets/letters/lowercase-q.png",
    difficulty: 3,
  },
];

export const PHONEMIC_AWARENESS_QUESTIONS: AssessmentQuestion[] = [
  // Rhyme Recognition
  {
    id: "pa-01",
    category: "phonemic-awareness",
    type: "rhyme-recognition",
    prompt: "Do these words rhyme? Cat... Hat",
    audioPrompt: "/audio/assessment/rhyme-cat-hat.mp3",
    options: ["Yes", "No"],
    correctAnswer: "Yes",
    difficulty: 1,
  },
  {
    id: "pa-02",
    category: "phonemic-awareness",
    type: "rhyme-recognition",
    prompt: "Do these words rhyme? Dog... Frog",
    audioPrompt: "/audio/assessment/rhyme-dog-frog.mp3",
    options: ["Yes", "No"],
    correctAnswer: "Yes",
    difficulty: 1,
  },
  {
    id: "pa-03",
    category: "phonemic-awareness",
    type: "rhyme-recognition",
    prompt: "Do these words rhyme? Sun... Cat",
    audioPrompt: "/audio/assessment/rhyme-sun-cat.mp3",
    options: ["Yes", "No"],
    correctAnswer: "No",
    difficulty: 1,
  },
  // First Sound Identification
  {
    id: "pa-04",
    category: "phonemic-awareness",
    type: "first-sound",
    prompt: "What sound do you hear at the beginning of 'sun'?",
    audioPrompt: "/audio/assessment/first-sun.mp3",
    options: ["/s/", "/n/", "/u/", "/t/"],
    correctAnswer: "/s/",
    difficulty: 2,
  },
  {
    id: "pa-05",
    category: "phonemic-awareness",
    type: "first-sound",
    prompt: "What sound do you hear at the beginning of 'mat'?",
    audioPrompt: "/audio/assessment/first-mat.mp3",
    options: ["/m/", "/a/", "/t/", "/s/"],
    correctAnswer: "/m/",
    difficulty: 2,
  },
  {
    id: "pa-06",
    category: "phonemic-awareness",
    type: "first-sound",
    prompt: "What sound do you hear at the beginning of 'pig'?",
    audioPrompt: "/audio/assessment/first-pig.mp3",
    options: ["/p/", "/b/", "/i/", "/g/"],
    correctAnswer: "/p/",
    difficulty: 2,
  },
  // Sound Counting
  {
    id: "pa-07",
    category: "phonemic-awareness",
    type: "sound-counting",
    prompt: "How many sounds do you hear in 'cat'?",
    audioPrompt: "/audio/assessment/count-cat.mp3",
    options: ["2", "3", "4", "5"],
    correctAnswer: "3",
    difficulty: 2,
  },
  {
    id: "pa-08",
    category: "phonemic-awareness",
    type: "sound-counting",
    prompt: "How many sounds do you hear in 'dog'?",
    audioPrompt: "/audio/assessment/count-dog.mp3",
    options: ["2", "3", "4", "1"],
    correctAnswer: "3",
    difficulty: 2,
  },
  {
    id: "pa-09",
    category: "phonemic-awareness",
    type: "sound-counting",
    prompt: "How many sounds do you hear in 'it'?",
    audioPrompt: "/audio/assessment/count-it.mp3",
    options: ["1", "2", "3", "4"],
    correctAnswer: "2",
    difficulty: 3,
  },
  {
    id: "pa-10",
    category: "phonemic-awareness",
    type: "sound-counting",
    prompt: "How many sounds do you hear in 'jump'?",
    audioPrompt: "/audio/assessment/count-jump.mp3",
    options: ["3", "4", "5", "2"],
    correctAnswer: "4",
    difficulty: 3,
  },
];

export const CVC_READING_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "cvc-01",
    category: "cvc-reading",
    type: "word-reading",
    prompt: "Can you read this word?",
    correctAnswer: "cat",
    imagePrompt: "/assets/words/cat-text.png", // Shows "cat" in large text
    difficulty: 1,
  },
  {
    id: "cvc-02",
    category: "cvc-reading",
    type: "word-reading",
    prompt: "Can you read this word?",
    correctAnswer: "dog",
    imagePrompt: "/assets/words/dog-text.png",
    difficulty: 1,
  },
  {
    id: "cvc-03",
    category: "cvc-reading",
    type: "word-reading",
    prompt: "Can you read this word?",
    correctAnswer: "sun",
    imagePrompt: "/assets/words/sun-text.png",
    difficulty: 1,
  },
  {
    id: "cvc-04",
    category: "cvc-reading",
    type: "word-reading",
    prompt: "Can you read this word?",
    correctAnswer: "pig",
    imagePrompt: "/assets/words/pig-text.png",
    difficulty: 2,
  },
  {
    id: "cvc-05",
    category: "cvc-reading",
    type: "word-reading",
    prompt: "Can you read this word?",
    correctAnswer: "mat",
    imagePrompt: "/assets/words/mat-text.png",
    difficulty: 2,
  },
  {
    id: "cvc-06",
    category: "cvc-reading",
    type: "word-reading",
    prompt: "Can you read this word?",
    correctAnswer: "sit",
    imagePrompt: "/assets/words/sit-text.png",
    difficulty: 2,
  },
  {
    id: "cvc-07",
    category: "cvc-reading",
    type: "word-reading",
    prompt: "Can you read this word?",
    correctAnswer: "nap",
    imagePrompt: "/assets/words/nap-text.png",
    difficulty: 2,
  },
  {
    id: "cvc-08",
    category: "cvc-reading",
    type: "word-reading",
    prompt: "Can you read this word?",
    correctAnswer: "run",
    imagePrompt: "/assets/words/run-text.png",
    difficulty: 3,
  },
  {
    id: "cvc-09",
    category: "cvc-reading",
    type: "word-reading",
    prompt: "Can you read this word?",
    correctAnswer: "hop",
    imagePrompt: "/assets/words/hop-text.png",
    difficulty: 3,
  },
  {
    id: "cvc-10",
    category: "cvc-reading",
    type: "word-reading",
    prompt: "Can you read this word?",
    correctAnswer: "mud",
    imagePrompt: "/assets/words/mud-text.png",
    difficulty: 3,
  },
];

export const SIGHT_WORD_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "sw-01",
    category: "sight-words",
    type: "sight-word-recognition",
    prompt: "Can you read this word?",
    correctAnswer: "the",
    imagePrompt: "/assets/sight-words/the-text.png",
    difficulty: 1,
  },
  {
    id: "sw-02",
    category: "sight-words",
    type: "sight-word-recognition",
    prompt: "Can you read this word?",
    correctAnswer: "and",
    imagePrompt: "/assets/sight-words/and-text.png",
    difficulty: 1,
  },
  {
    id: "sw-03",
    category: "sight-words",
    type: "sight-word-recognition",
    prompt: "Can you read this word?",
    correctAnswer: "a",
    imagePrompt: "/assets/sight-words/a-text.png",
    difficulty: 1,
  },
  {
    id: "sw-04",
    category: "sight-words",
    type: "sight-word-recognition",
    prompt: "Can you read this word?",
    correctAnswer: "to",
    imagePrompt: "/assets/sight-words/to-text.png",
    difficulty: 1,
  },
  {
    id: "sw-05",
    category: "sight-words",
    type: "sight-word-recognition",
    prompt: "Can you read this word?",
    correctAnswer: "is",
    imagePrompt: "/assets/sight-words/is-text.png",
    difficulty: 1,
  },
  {
    id: "sw-06",
    category: "sight-words",
    type: "sight-word-recognition",
    prompt: "Can you read this word?",
    correctAnswer: "you",
    imagePrompt: "/assets/sight-words/you-text.png",
    difficulty: 2,
  },
  {
    id: "sw-07",
    category: "sight-words",
    type: "sight-word-recognition",
    prompt: "Can you read this word?",
    correctAnswer: "said",
    imagePrompt: "/assets/sight-words/said-text.png",
    difficulty: 2,
  },
  {
    id: "sw-08",
    category: "sight-words",
    type: "sight-word-recognition",
    prompt: "Can you read this word?",
    correctAnswer: "was",
    imagePrompt: "/assets/sight-words/was-text.png",
    difficulty: 2,
  },
  {
    id: "sw-09",
    category: "sight-words",
    type: "sight-word-recognition",
    prompt: "Can you read this word?",
    correctAnswer: "have",
    imagePrompt: "/assets/sight-words/have-text.png",
    difficulty: 3,
  },
  {
    id: "sw-10",
    category: "sight-words",
    type: "sight-word-recognition",
    prompt: "Can you read this word?",
    correctAnswer: "where",
    imagePrompt: "/assets/sight-words/where-text.png",
    difficulty: 3,
  },
];

// Scoring and Placement Logic

export function calculateAssessmentResults(
  answers: Map<string, { correct: boolean; timeSpent: number }>
): AssessmentResult[] {
  const results: AssessmentResult[] = [];

  // Group by category
  const categories: AssessmentCategory[] = [
    "letter-names",
    "letter-sounds",
    "phonemic-awareness",
    "cvc-reading",
    "sight-words",
  ];

  categories.forEach((category) => {
    const questions = getAllQuestionsByCategory(category);
    const categoryAnswers = Array.from(answers.entries()).filter(([id]) =>
      questions.some((q) => q.id === id)
    );

    const correctCount = categoryAnswers.filter(([, answer]) => answer.correct).length;
    const percentage = (correctCount / questions.length) * 100;

    results.push({
      category,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      percentage: Math.round(percentage),
      details: categoryAnswers.map(([questionId, answer]) => ({
        questionId,
        correct: answer.correct,
        timeSpent: answer.timeSpent,
      })),
    });
  });

  return results;
}

export function determinePlacement(results: AssessmentResult[]): PlacementRecommendation {
  const letterNames = results.find((r) => r.category === "letter-names")?.percentage || 0;
  const letterSounds = results.find((r) => r.category === "letter-sounds")?.percentage || 0;
  const phonemicAwareness = results.find((r) => r.category === "phonemic-awareness")?.percentage || 0;
  const cvcReading = results.find((r) => r.category === "cvc-reading")?.percentage || 0;
  const sightWords = results.find((r) => r.category === "sight-words")?.percentage || 0;

  // Determine placement level
  if (phonemicAwareness < 50 || letterNames < 30) {
    return {
      level: "pre-reading",
      startPath: "pre-reading-skills",
      startUnit: 1,
      rationale:
        "Your child will benefit from building phonemic awareness and letter recognition before formal reading instruction.",
      strengths: identifyStrengths(results),
      areasToWatch: ["Letter recognition", "Sound awareness"],
      parentGuidance:
        "Focus on fun, playful activities with sounds and rhymes. No pressure to read yet!",
    };
  }

  if (letterSounds < 60 || phonemicAwareness < 70) {
    return {
      level: "early-phonics",
      startPath: "systematic-phonics",
      startUnit: 1,
      rationale:
        "Your child knows some letters and sounds. Starting with systematic phonics will build a strong foundation.",
      strengths: identifyStrengths(results),
      areasToWatch: ["Letter-sound correspondence", "Blending skills"],
      parentGuidance:
        "Practice letter sounds daily. Use the blending activities alongside phonics lessons.",
    };
  }

  if (cvcReading < 60) {
    return {
      level: "phonics",
      startPath: "systematic-phonics",
      startUnit: Math.floor((letterSounds / 100) * 15) + 1, // Proportional unit placement
      rationale:
        "Your child has good letter knowledge. Focus now on blending sounds to read CVC words.",
      strengths: identifyStrengths(results),
      areasToWatch: ["Blending", "CVC word reading"],
      parentGuidance:
        "Practice blending sounds together. Use decodable texts to apply skills.",
    };
  }

  if (cvcReading >= 60 && sightWords < 60) {
    return {
      level: "advanced-phonics",
      startPath: "advanced-phonics",
      startUnit: 1,
      rationale:
        "Your child can read CVC words! Time to learn more complex phonics patterns.",
      strengths: identifyStrengths(results),
      areasToWatch: ["Advanced patterns", "Sight word recognition"],
      parentGuidance:
        "Continue with decodable readers. Introduce digraphs and vowel teams.",
    };
  }

  return {
    level: "fluency",
    startPath: "fluency-builder",
    startUnit: 1,
    rationale:
      "Your child is reading well! Focus now on speed, accuracy, and expression.",
    strengths: identifyStrengths(results),
    areasToWatch: ["Reading fluency", "Comprehension"],
    parentGuidance:
      "Practice reading aloud daily. Focus on expression and understanding.",
  };
}

function getAllQuestionsByCategory(category: AssessmentCategory): AssessmentQuestion[] {
  switch (category) {
    case "letter-names":
      return LETTER_NAME_QUESTIONS;
    case "letter-sounds":
      return LETTER_SOUND_QUESTIONS;
    case "phonemic-awareness":
      return PHONEMIC_AWARENESS_QUESTIONS;
    case "cvc-reading":
      return CVC_READING_QUESTIONS;
    case "sight-words":
      return SIGHT_WORD_QUESTIONS;
  }
}

function identifyStrengths(results: AssessmentResult[]): string[] {
  const strengths: string[] = [];

  results.forEach((result) => {
    if (result.percentage >= 80) {
      switch (result.category) {
        case "letter-names":
          strengths.push("Excellent letter naming");
          break;
        case "letter-sounds":
          strengths.push("Strong letter-sound knowledge");
          break;
        case "phonemic-awareness":
          strengths.push("Good sound awareness");
          break;
        case "cvc-reading":
          strengths.push("Can read simple words");
          break;
        case "sight-words":
          strengths.push("Recognizes common sight words");
          break;
      }
    }
  });

  if (strengths.length === 0) {
    strengths.push("Ready and motivated to learn!");
  }

  return strengths;
}
