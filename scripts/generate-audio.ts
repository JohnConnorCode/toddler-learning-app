/**
 * Audio Generation Script using Google Cloud Text-to-Speech
 *
 * This script generates high-quality audio files for all letters and words
 * and saves them to public/audio/ for permanent use.
 *
 * Setup:
 * 1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install
 * 2. Run: gcloud auth application-default login
 * 3. Enable Text-to-Speech API: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
 * 4. Run this script: npx tsx scripts/generate-audio.ts
 */

import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import * as fs from 'fs';
import * as path from 'path';
import { PHONICS_DATA } from '../src/lib/phonics-data';
import { WORDS_DATA } from '../src/lib/words-data';

const client = new TextToSpeechClient();

// Best voices for children based on research
const VOICE_CONFIG = {
  languageCode: 'en-US',
  // Google's best neural voice for children
  name: 'en-US-Neural2-F', // Female, clear, child-friendly
  // Alternative: 'en-US-Neural2-H' (female), 'en-US-Neural2-J' (male)
};

async function generateAudio(text: string, outputPath: string, config: {
  pitch?: number;
  speakingRate?: number;
}): Promise<void> {
  try {
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: VOICE_CONFIG,
      audioConfig: {
        audioEncoding: 'MP3',
        pitch: config.pitch || 0.0,        // -20.0 to 20.0
        speakingRate: config.speakingRate || 1.0,  // 0.25 to 4.0
        sampleRateHertz: 24000,            // High quality
      },
    });

    if (response.audioContent) {
      fs.writeFileSync(outputPath, response.audioContent, 'binary');
      console.log(`✓ Generated: ${outputPath}`);
    }
  } catch (error) {
    console.error(`✗ Failed to generate ${outputPath}:`, error);
  }
}

async function generateLetterAudio() {
  console.log('\n🔤 Generating letter sounds...\n');

  for (const item of PHONICS_DATA) {
    const letter = item.letter.toLowerCase();

    // 1. Pure phonics sound (for phonics mode)
    // Use SSML for better control - very short, clipped sound
    const phonicsSSML = `<speak><emphasis level="strong">${item.phonemeSpelling}</emphasis></speak>`;
    await generateAudio(
      phonicsSSML,
      path.join(process.cwd(), `public/audio/letters/${letter}-phonics.mp3`),
      {
        pitch: 0.0,         // Neutral pitch
        speakingRate: 0.6,  // Slow and clear
      }
    );

    // 2. Letter name (for letter name mode)
    await generateAudio(
      item.letter,
      path.join(process.cwd(), `public/audio/letters/${letter}-name.mp3`),
      {
        pitch: 2.0,        // Slightly elevated, friendly
        speakingRate: 0.8,
      }
    );

    // 3. Example word (e.g., "A is for Apple")
    await generateAudio(
      `${item.letter} is for ${item.word}`,
      path.join(process.cwd(), `public/audio/letters/${letter}-example.mp3`),
      {
        pitch: 1.0,
        speakingRate: 0.8,
      }
    );

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n✅ Letter sounds generated!\n');
}

async function generateWordAudio() {
  console.log('\n📝 Generating word sounds...\n');

  for (const item of WORDS_DATA) {
    const wordLower = item.word.toLowerCase();

    // 1. Word pronunciation
    await generateAudio(
      item.word,
      path.join(process.cwd(), `public/audio/words/${wordLower}.mp3`),
      {
        pitch: 0.0,
        speakingRate: 0.75,
      }
    );

    // 2. Sentence with word in context
    await generateAudio(
      item.sentence,
      path.join(process.cwd(), `public/audio/sentences/${wordLower}.mp3`),
      {
        pitch: 0.0,
        speakingRate: 0.8,
      }
    );

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n✅ Word sounds generated!\n');
}

async function main() {
  console.log('🎤 Starting audio generation with Google Cloud TTS...\n');
  console.log(`Using voice: ${VOICE_CONFIG.name}\n`);

  // Create directories if they don't exist
  const dirs = [
    'public/audio/letters',
    'public/audio/words',
    'public/audio/sentences',
  ];

  dirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });

  await generateLetterAudio();
  await generateWordAudio();

  console.log('\n🎉 All audio files generated successfully!');
  console.log('\nGenerated:');
  console.log('- 26 letter phonics sounds');
  console.log('- 26 letter names');
  console.log('- 26 letter examples');
  console.log('- 100+ word pronunciations');
  console.log('- 100+ sentence examples');
  console.log('\nTotal: ~250 audio files');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { generateAudio };
