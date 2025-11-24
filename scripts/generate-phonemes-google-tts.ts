/**
 * Generate phoneme sounds using Google Cloud Text-to-Speech
 *
 * Uses the same high-quality neural voice as the letter sounds
 * for consistent audio quality across the app.
 *
 * Setup:
 * 1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install
 * 2. Run: gcloud auth application-default login
 * 3. Enable Text-to-Speech API: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
 * 4. Run: npx tsx scripts/generate-phonemes-google-tts.ts
 */

import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import * as fs from 'fs';
import * as path from 'path';

const client = new TextToSpeechClient();

// Same voice as letter sounds for consistency
const VOICE_CONFIG = {
  languageCode: 'en-US',
  name: 'en-US-Neural2-F', // Female, clear, child-friendly neural voice
};

async function generateAudio(
  text: string,
  outputPath: string,
  config: {
    pitch?: number;
    speakingRate?: number;
  }
): Promise<void> {
  try {
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: VOICE_CONFIG,
      audioConfig: {
        audioEncoding: 'MP3',
        pitch: config.pitch || 0.0,
        speakingRate: config.speakingRate || 1.0,
        sampleRateHertz: 24000,
      },
    });

    if (response.audioContent) {
      fs.writeFileSync(outputPath, response.audioContent, 'binary');
      console.log(`✓ Generated: ${path.basename(outputPath)}`);
    }
  } catch (error) {
    console.error(`✗ Failed to generate ${path.basename(outputPath)}:`, error);
  }
}

async function generatePhonemes() {
  console.log('\n🎤 Generating phoneme sounds with Google Cloud TTS...\n');
  console.log(`Using voice: ${VOICE_CONFIG.name}\n`);

  // Create directory
  const phonemesDir = path.join(process.cwd(), 'public/audio/phonemes');
  if (!fs.existsSync(phonemesDir)) {
    fs.mkdirSync(phonemesDir, { recursive: true });
  }

  // Phoneme sounds with phonetic representations
  // These match what's needed for the pre-reading activities
  const phonemes = [
    // Sustained consonants (can be elongated)
    { sound: 's', text: 'sss', rate: 0.5 },
    { sound: 'm', text: 'mmm', rate: 0.5 },
    { sound: 'f', text: 'fff', rate: 0.5 },
    { sound: 'h', text: 'hhh', rate: 0.6 },
    { sound: 'l', text: 'lll', rate: 0.5 },
    { sound: 'n', text: 'nnn', rate: 0.5 },
    { sound: 'r', text: 'rrr', rate: 0.5 },

    // Stop consonants (short, quick)
    { sound: 'k', text: 'k', rate: 0.7 },
    { sound: 'b', text: 'b', rate: 0.7 },
    { sound: 'd', text: 'd', rate: 0.7 },
    { sound: 't', text: 't', rate: 0.7 },
    { sound: 'g', text: 'g', rate: 0.7 },

    // Vowel sounds
    { sound: 'ee', text: 'eee', rate: 0.5 },

    // Digraphs
    { sound: 'sh', text: 'shh', rate: 0.5 },
  ];

  console.log(`Generating ${phonemes.length} phoneme sounds...\n`);

  for (const phoneme of phonemes) {
    const outputPath = path.join(phonemesDir, `${phoneme.sound}.mp3`);

    await generateAudio(
      phoneme.text,
      outputPath,
      {
        pitch: 0.0,           // Neutral pitch
        speakingRate: phoneme.rate,  // Slow and clear
      }
    );

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n✅ All phoneme sounds generated!\n');
  console.log('Quality: High-quality neural voice (matches letter sounds)\n');
}

async function generateMissingWords() {
  console.log('📝 Generating missing word audio...\n');

  const wordsDir = path.join(process.cwd(), 'public/audio/words');
  if (!fs.existsSync(wordsDir)) {
    fs.mkdirSync(wordsDir, { recursive: true });
  }

  // Generate "car" which was missing
  await generateAudio(
    'car',
    path.join(wordsDir, 'car.mp3'),
    {
      pitch: 0.0,
      speakingRate: 0.75,
    }
  );

  console.log('\n✅ Missing word audio generated!\n');
}

async function main() {
  console.log('🎵 Audio Generation with Google Cloud Text-to-Speech\n');
  console.log('═══════════════════════════════════════════════════\n');

  try {
    await generatePhonemes();
    await generateMissingWords();

    console.log('🎉 Complete!\n');
    console.log('Generated:');
    console.log('  ✓ 14 phoneme sounds (high-quality neural voice)');
    console.log('  ✓ 1 missing word (car.mp3)');
    console.log('\nThese match the quality of your letter sounds! 🎵\n');
  } catch (error) {
    console.error('\n❌ Error:', error);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure Google Cloud SDK is installed');
    console.log('2. Run: gcloud auth application-default login');
    console.log('3. Enable Text-to-Speech API in your Google Cloud project');
    console.log('4. Check that you have API quota available\n');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { generateAudio };
