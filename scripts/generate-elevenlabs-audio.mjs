#!/usr/bin/env node
/**
 * Generate high-quality audio using ElevenLabs API
 * Usage: node scripts/generate-elevenlabs-audio.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'audio');

// ElevenLabs configuration
const API_KEY = process.env.ELEVENLABS_API_KEY || '99aa3375282abe927d88a508a6e002f72eecd9bf8883fc82b209e9436eeffd29';
const VOICE_ID = 'FGY2WhTYpPnrIDTdsKH5'; // Laura - young, sunny, enthusiastic
const MODEL_ID = 'eleven_turbo_v2_5'; // Fast, high quality

// Phonics data - proper phoneme pronunciations for teaching
const LETTER_DATA = {
  a: { phoneme: 'aah', name: 'ay', word: 'Apple', example: 'A is for Apple' },
  b: { phoneme: 'buh', name: 'bee', word: 'Bear', example: 'B is for Bear' },
  c: { phoneme: 'kuh', name: 'see', word: 'Cat', example: 'C is for Cat' },
  d: { phoneme: 'duh', name: 'dee', word: 'Dog', example: 'D is for Dog' },
  e: { phoneme: 'eh', name: 'ee', word: 'Elephant', example: 'E is for Elephant' },
  f: { phoneme: 'fff', name: 'eff', word: 'Fish', example: 'F is for Fish' },
  g: { phoneme: 'guh', name: 'jee', word: 'Giraffe', example: 'G is for Giraffe' },
  h: { phoneme: 'huh', name: 'aych', word: 'Horse', example: 'H is for Horse' },
  i: { phoneme: 'ih', name: 'eye', word: 'Igloo', example: 'I is for Igloo' },
  j: { phoneme: 'juh', name: 'jay', word: 'Jellyfish', example: 'J is for Jellyfish' },
  k: { phoneme: 'kuh', name: 'kay', word: 'Kite', example: 'K is for Kite' },
  l: { phoneme: 'lll', name: 'ell', word: 'Lion', example: 'L is for Lion' },
  m: { phoneme: 'mmm', name: 'em', word: 'Monkey', example: 'M is for Monkey' },
  n: { phoneme: 'nnn', name: 'en', word: 'Nest', example: 'N is for Nest' },
  o: { phoneme: 'oh', name: 'oh', word: 'Octopus', example: 'O is for Octopus' },
  p: { phoneme: 'puh', name: 'pee', word: 'Penguin', example: 'P is for Penguin' },
  q: { phoneme: 'kwuh', name: 'cue', word: 'Queen', example: 'Q is for Queen' },
  r: { phoneme: 'rrr', name: 'are', word: 'Rabbit', example: 'R is for Rabbit' },
  s: { phoneme: 'sss', name: 'ess', word: 'Snake', example: 'S is for Snake' },
  t: { phoneme: 'tuh', name: 'tee', word: 'Tiger', example: 'T is for Tiger' },
  u: { phoneme: 'uh', name: 'you', word: 'Umbrella', example: 'U is for Umbrella' },
  v: { phoneme: 'vvv', name: 'vee', word: 'Van', example: 'V is for Van' },
  w: { phoneme: 'wuh', name: 'double you', word: 'Whale', example: 'W is for Whale' },
  x: { phoneme: 'ks', name: 'ex', word: 'Xylophone', example: 'X is for Xylophone' },
  y: { phoneme: 'yuh', name: 'why', word: 'Yak', example: 'Y is for Yak' },
  z: { phoneme: 'zzz', name: 'zee', word: 'Zebra', example: 'Z is for Zebra' },
};

// Common phonemes for blending practice
const PHONEMES = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'sh', 'ch', 'th', 'wh', 'ph', 'ck', 'ng',
  'ai', 'ee', 'oa', 'oo', 'ar', 'er', 'or', 'ur', 'ow', 'ou', 'oi', 'oy'
];

// Words from the app (extracted from words-data.ts)
const WORDS = [
  'alien', 'apple', 'bag', 'ball', 'bask', 'bat', 'beach', 'bean', 'bear', 'bed',
  'bee', 'beep', 'bell', 'big', 'bike', 'bit', 'boat', 'bone', 'book', 'bot',
  'box', 'brain', 'bread', 'bug', 'bun', 'bus', 'cake', 'call', 'can', 'car',
  'cat', 'chair', 'clap', 'claw', 'clock', 'cloud', 'cold', 'corn', 'crab', 'cup',
  'dig', 'dino', 'dock', 'dog', 'door', 'duck', 'earth', 'egg', 'fall', 'fish',
  'fog', 'foot', 'fossil', 'fox', 'frog', 'gear', 'goat', 'grass', 'hand', 'hat',
  'hen', 'hit', 'hop', 'horse', 'house', 'hug', 'jam', 'jump', 'key', 'kick',
  'king', 'kite', 'knee', 'lake', 'lamb', 'lock', 'log', 'luck', 'make', 'man',
  'metal', 'milk', 'moon', 'mop', 'mouse', 'mug', 'nose', 'nut', 'owl', 'pen',
  'pick', 'pie', 'pig', 'pizza', 'plane', 'planet', 'plant', 'power', 'rag', 'rain',
  'rat', 'rice', 'ring', 'roar', 'robot', 'rock', 'rocket', 'run', 'scale', 'school',
  'sea', 'sell', 'shell', 'sing', 'sit', 'sky', 'snake', 'snap', 'snow', 'sock',
  'space', 'spoon', 'star', 'stick', 'store', 'sun', 'swim', 'table', 'tag', 'tail',
  'take', 'tall', 'taxi', 'tea', 'tell', 'ten', 'tiger', 'top', 'toy', 'train',
  'tree', 'truck', 'van', 'well', 'whale', 'wheel', 'wind', 'wing', 'oops', 'tryagain'
];

// Rate limiting
const DELAY_MS = 300; // ElevenLabs allows ~10 req/sec, we'll be conservative

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateAudio(text, outputPath) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Skip if file already exists and is recent
  if (fs.existsSync(outputPath)) {
    const stats = fs.statSync(outputPath);
    if (stats.size > 1000) { // File exists and has content
      console.log(`  ⏭️  Skipping (exists): ${path.basename(outputPath)}`);
      return true;
    }
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text: text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`  ❌ Error: ${error}`);
      return false;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    console.log(`  ✅ Generated: ${path.basename(outputPath)}`);
    return true;
  } catch (error) {
    console.error(`  ❌ Failed: ${error.message}`);
    return false;
  }
}

async function generateLetterAudio() {
  console.log('\n🔤 Generating letter sounds...\n');

  const letters = Object.keys(LETTER_DATA);
  let generated = 0;

  for (const letter of letters) {
    const data = LETTER_DATA[letter];

    // Phonics sound (the actual letter sound for reading)
    await generateAudio(
      data.phoneme,
      path.join(PUBLIC_DIR, 'letters', `${letter}-phonics.mp3`)
    );
    await sleep(DELAY_MS);

    // Letter name (what we call the letter)
    await generateAudio(
      data.name,
      path.join(PUBLIC_DIR, 'letters', `${letter}-name.mp3`)
    );
    await sleep(DELAY_MS);

    // Example phrase
    await generateAudio(
      data.example,
      path.join(PUBLIC_DIR, 'letters', `${letter}-example.mp3`)
    );
    await sleep(DELAY_MS);

    generated += 3;
    console.log(`  📊 Progress: ${letter.toUpperCase()} complete (${generated}/${letters.length * 3})`);
  }

  console.log(`\n✅ Generated ${generated} letter audio files\n`);
}

async function generatePhonemeAudio() {
  console.log('\n🎵 Generating phoneme sounds...\n');

  // Phoneme pronunciation mapping
  const phonemePronunciations = {
    a: 'aah', b: 'buh', c: 'kuh', d: 'duh', e: 'eh', f: 'fff',
    g: 'guh', h: 'huh', i: 'ih', j: 'juh', k: 'kuh', l: 'lll',
    m: 'mmm', n: 'nnn', o: 'oh', p: 'puh', q: 'kwuh', r: 'rrr',
    s: 'sss', t: 'tuh', u: 'uh', v: 'vvv', w: 'wuh', x: 'ks',
    y: 'yuh', z: 'zzz',
    sh: 'shh', ch: 'chh', th: 'thh', wh: 'wh', ph: 'fff', ck: 'kuh', ng: 'ng',
    ai: 'ay', ee: 'ee', oa: 'oh', oo: 'oo', ar: 'ar', er: 'er',
    or: 'or', ur: 'er', ow: 'ow', ou: 'ow', oi: 'oy', oy: 'oy'
  };

  let generated = 0;

  for (const phoneme of PHONEMES) {
    const pronunciation = phonemePronunciations[phoneme] || phoneme;
    await generateAudio(
      pronunciation,
      path.join(PUBLIC_DIR, 'phonemes', `${phoneme}.mp3`)
    );
    await sleep(DELAY_MS);
    generated++;

    if (generated % 10 === 0) {
      console.log(`  📊 Progress: ${generated}/${PHONEMES.length} phonemes`);
    }
  }

  console.log(`\n✅ Generated ${generated} phoneme audio files\n`);
}

async function generateWordAudio() {
  console.log('\n📝 Generating word sounds...\n');

  let generated = 0;

  for (const word of WORDS) {
    await generateAudio(
      word,
      path.join(PUBLIC_DIR, 'words', `${word}.mp3`)
    );
    await sleep(DELAY_MS);
    generated++;

    if (generated % 10 === 0) {
      console.log(`  📊 Progress: ${generated}/${WORDS.length} words`);
    }
  }

  console.log(`\n✅ Generated ${generated} word audio files\n`);
}

async function main() {
  console.log('🎤 ElevenLabs Audio Generator');
  console.log('============================\n');
  console.log(`Voice: Laura (${VOICE_ID})`);
  console.log(`Model: ${MODEL_ID}`);
  console.log(`Output: ${PUBLIC_DIR}\n`);

  // Ensure directories exist
  ['letters', 'phonemes', 'words'].forEach(dir => {
    const dirPath = path.join(PUBLIC_DIR, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });

  // Generate all audio
  await generateLetterAudio();
  await generatePhonemeAudio();
  await generateWordAudio();

  console.log('\n🎉 All audio generation complete!\n');
}

main().catch(console.error);
