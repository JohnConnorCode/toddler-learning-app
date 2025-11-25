#!/usr/bin/env node

/**
 * Generate ALL audio files for words using macOS Text-to-Speech
 * This reads directly from words-data.ts and generates audio for every word
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Words data (manually extracted from words-data.ts)
const WORDS = [
  // Difficulty 1
  { word: "CAT", sentence: "The cat drinks milk." },
  { word: "DOG", sentence: "The dog wags its tail." },
  { word: "PIG", sentence: "The pig rolls in mud." },
  { word: "FOX", sentence: "The red fox is clever." },
  { word: "OWL", sentence: "The owl hoots at night." },
  { word: "BEE", sentence: "The bee makes honey." },
  { word: "BUG", sentence: "I saw a bug on the leaf." },
  { word: "BAT", sentence: "The bat flies at night." },
  { word: "EGG", sentence: "I ate an egg for breakfast." },
  { word: "JAM", sentence: "I spread jam on my toast." },
  { word: "NUT", sentence: "Squirrels love to eat nuts." },
  { word: "PIE", sentence: "Apple pie tastes yummy." },
  { word: "BUN", sentence: "I like a burger on a bun." },
  { word: "TEA", sentence: "Mom drinks hot tea." },
  { word: "BUS", sentence: "I ride the bus to school." },
  { word: "HAT", sentence: "I wear a hat in the sun." },
  { word: "BOX", sentence: "The toys are in the box." },
  { word: "BED", sentence: "I sleep in my bed." },
  { word: "CUP", sentence: "I drink from a cup." },
  { word: "PEN", sentence: "I write with a pen." },
  { word: "BAG", sentence: "I carry my bag to school." },
  { word: "TOY", sentence: "This is my favorite toy." },
  { word: "KEY", sentence: "Use the key to open the door." },
  { word: "SUN", sentence: "The sun is bright and warm." },
  { word: "SKY", sentence: "The sky is blue." },
  { word: "SEA", sentence: "We swim in the sea." },
  { word: "LOG", sentence: "The frog sat on a log." },
  { word: "RUN", sentence: "I can run very fast." },
  { word: "SIT", sentence: "Please sit on the chair." },
  { word: "HOP", sentence: "Rabbits hop on the grass." },
  { word: "RAT", sentence: "The rat ran fast." },
  { word: "MAT", sentence: "Wipe your feet on the mat." },
  { word: "SAT", sentence: "The cat sat on the mat." },
  { word: "PAT", sentence: "Pat the dog gently." },
  { word: "TAP", sentence: "Tap your feet to the music." },
  { word: "SAP", sentence: "Sap comes from trees." },
  { word: "MAP", sentence: "Look at the map." },
  { word: "NAP", sentence: "I take a nap after lunch." },
  { word: "CAP", sentence: "Wear a cap on your head." },
  { word: "LAP", sentence: "Sit on my lap." },
  { word: "PIN", sentence: "Use a pin to hold the fabric." },
  { word: "TIN", sentence: "The tin can is empty." },
  { word: "BIN", sentence: "Put trash in the bin." },
  { word: "DIN", sentence: "What a loud din!" },
  { word: "WIN", sentence: "I want to win the game." },
  { word: "FIN", sentence: "Fish swim with their fins." },
  { word: "PAN", sentence: "Cook in the pan." },
  { word: "TAN", sentence: "I got a tan at the beach." },
  { word: "FAN", sentence: "Turn on the fan." },
  { word: "MAN", sentence: "The man is tall." },
  { word: "VAN", sentence: "We drove in a van." },
  { word: "CAN", sentence: "I can do it!" },
  { word: "POP", sentence: "The balloon will pop." },
  { word: "TOP", sentence: "Spin the top." },
  { word: "MOP", sentence: "Mop the floor." },
  { word: "POT", sentence: "Cook soup in a pot." },
  { word: "HOT", sentence: "The soup is hot." },
  { word: "COT", sentence: "Sleep on the cot." },
  { word: "DOT", sentence: "Draw a dot." },
  { word: "GOT", sentence: "I got a present." },
  { word: "NOT", sentence: "Do not run." },
  { word: "CUT", sentence: "Cut the paper." },
  { word: "HUT", sentence: "A small hut in the woods." },
  { word: "MUD", sentence: "Play in the mud." },
  { word: "BUD", sentence: "A flower bud." },
  { word: "DUG", sentence: "The dog dug a hole." },
  { word: "JUG", sentence: "Pour from the jug." },
  { word: "MUG", sentence: "Drink from a mug." },
  { word: "RUG", sentence: "Sit on the rug." },
  { word: "TUG", sentence: "Tug the rope." },
  { word: "HUG", sentence: "Give me a hug." },
  { word: "PUP", sentence: "A cute little pup." },
  { word: "SIP", sentence: "Sip your drink." },
  { word: "TIP", sentence: "The tip of the pen." },
  { word: "RIP", sentence: "Do not rip the paper." },
  { word: "HIP", sentence: "Put your hands on your hips." },
  { word: "ZIP", sentence: "Zip up your jacket." },
  { word: "LIP", sentence: "Bite your lip." },
  { word: "DIP", sentence: "Dip the chip." },
  { word: "WEB", sentence: "A spider web." },
  { word: "WET", sentence: "The grass is wet." },
  { word: "PET", sentence: "I have a pet." },
  { word: "SET", sentence: "Set the table." },
  { word: "GET", sentence: "Get the ball." },
  { word: "LET", sentence: "Let me help you." },
  { word: "MET", sentence: "I met a new friend." },
  { word: "NET", sentence: "Catch with a net." },
  { word: "YET", sentence: "Not yet!" },
  { word: "RED", sentence: "The apple is red." },
  { word: "LED", sentence: "She led the way." },
  { word: "FED", sentence: "I fed the cat." },
  { word: "HEN", sentence: "The hen laid an egg." },
  { word: "DEN", sentence: "The bear's den." },
  { word: "MEN", sentence: "The men are working." },
  { word: "TEN", sentence: "Count to ten." },

  // Difficulty 2
  { word: "DUCK", sentence: "The duck swims in the pond." },
  { word: "FROG", sentence: "The frog jumps in the pond." },
  { word: "CRAB", sentence: "The crab walks sideways." },
  { word: "FISH", sentence: "The fish swims in water." },
  { word: "BEAR", sentence: "The bear is big and strong." },
  { word: "LAMB", sentence: "The lamb is a baby sheep." },
  { word: "GOAT", sentence: "The goat eats grass." },
  { word: "CAKE", sentence: "I love chocolate cake." },
  { word: "MILK", sentence: "I drink cold milk." },
  { word: "CORN", sentence: "We eat corn on the cob." },
  { word: "BEAN", sentence: "Green beans are healthy." },
  { word: "RICE", sentence: "We eat rice with dinner." },
  { word: "BALL", sentence: "I kick the ball." },
  { word: "BOOK", sentence: "I read a fun book." },
  { word: "BELL", sentence: "The bell rings loudly." },
  { word: "DOOR", sentence: "Open the door, please." },
  { word: "SOCK", sentence: "I wear socks on my feet." },
  { word: "BIKE", sentence: "I ride my bike to the park." },
  { word: "KITE", sentence: "The kite flies high in the sky." },
  { word: "BOAT", sentence: "The boat floats on water." },
  { word: "TREE", sentence: "Birds live in the tree." },
  { word: "RAIN", sentence: "The rain falls from clouds." },
  { word: "MOON", sentence: "The moon shines at night." },
  { word: "STAR", sentence: "Stars twinkle in the sky." },
  { word: "SNOW", sentence: "White snow covers the ground." },
  { word: "WIND", sentence: "The wind blows the leaves." },
  { word: "ROCK", sentence: "I found a smooth rock." },
  { word: "LAKE", sentence: "We swim in the lake." },
  { word: "JUMP", sentence: "I can jump really high." },
  { word: "KICK", sentence: "I kick the soccer ball." },
  { word: "SING", sentence: "I love to sing songs." },
  { word: "CLAP", sentence: "Clap your hands together." },
  { word: "SWIM", sentence: "Fish swim in the water." },
  { word: "HAND", sentence: "I wave my hand to say hello." },
  { word: "FOOT", sentence: "I wear shoes on my feet." },
  { word: "NOSE", sentence: "I smell flowers with my nose." },
  { word: "KNEE", sentence: "I bend my knee to sit." },

  // Difficulty 3
  { word: "HORSE", sentence: "The horse runs in the field." },
  { word: "MOUSE", sentence: "The mouse is very small." },
  { word: "TIGER", sentence: "The tiger has stripes." },
  { word: "WHALE", sentence: "The whale lives in the ocean." },
  { word: "SNAKE", sentence: "The snake slithers on the ground." },
  { word: "BREAD", sentence: "I eat bread with butter." },
  { word: "APPLE", sentence: "I eat a red apple." },
  { word: "PIZZA", sentence: "Pizza is my favorite food." },
  { word: "CHAIR", sentence: "Please sit on the chair." },
  { word: "TABLE", sentence: "We eat dinner at the table." },
  { word: "TRUCK", sentence: "The truck carries heavy loads." },
  { word: "CLOCK", sentence: "The clock shows the time." },
  { word: "SPOON", sentence: "I eat soup with a spoon." },
  { word: "CLOUD", sentence: "I see clouds in the sky." },
  { word: "GRASS", sentence: "The grass is green and soft." },
  { word: "PLANT", sentence: "I water the plant every day." },
  { word: "BEACH", sentence: "We play at the beach." },
  { word: "HOUSE", sentence: "I live in a house." },
  { word: "STORE", sentence: "We buy food at the store." },
  { word: "SCHOOL", sentence: "I learn new things at school." },
];

const VOICE = "Samantha"; // Best macOS voice for children
const WORDS_DIR = path.join(__dirname, '../public/audio/words');
const SENTENCES_DIR = path.join(__dirname, '../public/audio/sentences');

console.log(`🎤 Generating audio for ${WORDS.length} words using macOS TTS...\n`);

let generated = 0;
let skipped = 0;

for (const item of WORDS) {
  const wordLower = item.word.toLowerCase();
  const wordFile = path.join(WORDS_DIR, `${wordLower}.mp3`);
  const sentenceFile = path.join(SENTENCES_DIR, `${wordLower}.mp3`);

  try {
    // Generate word pronunciation
    if (!fs.existsSync(wordFile)) {
      console.log(`Generating: ${item.word}`);

      const aiffWord = path.join(WORDS_DIR, `${wordLower}.aiff`);
      execSync(`say -v "${VOICE}" -r 160 -o "${aiffWord}" "${wordLower}"`, { stdio: 'pipe' });
      execSync(`afconvert -f mp4f -d aac "${aiffWord}" "${wordFile}"`, { stdio: 'pipe' });
      fs.unlinkSync(aiffWord);

      generated++;
    } else {
      skipped++;
    }

    // Generate sentence
    if (!fs.existsSync(sentenceFile) && item.sentence) {
      const aiffSentence = path.join(SENTENCES_DIR, `${wordLower}.aiff`);
      execSync(`say -v "${VOICE}" -r 170 -o "${aiffSentence}" "${item.sentence}"`, { stdio: 'pipe' });
      execSync(`afconvert -f mp4f -d aac "${aiffSentence}" "${sentenceFile}"`, { stdio: 'pipe' });
      fs.unlinkSync(aiffSentence);

      generated++;
    }

    if (generated % 10 === 0 && generated > 0) {
      console.log(`  ✓ Generated ${generated} files so far...`);
    }

  } catch (error) {
    console.error(`✗ Failed to generate ${item.word}:`, error.message);
  }
}

console.log(`\n🎉 Audio generation complete!`);
console.log(`  ✓ Generated: ${generated} new files`);
console.log(`  → Skipped: ${skipped} existing files`);
console.log(`  📁 Total words: ${WORDS.length}`);
console.log(`\nAll audio files saved to public/audio/\n`);
