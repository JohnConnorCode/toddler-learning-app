/**
 * Audio File Validation Script
 *
 * Validates that all audio files referenced in the codebase exist.
 * Run with: npm run validate-audio
 */

import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const AUDIO_DIR = path.join(PUBLIC_DIR, 'audio');

interface ValidationResult {
  category: string;
  expected: string[];
  found: string[];
  missing: string[];
}

// Expected audio files based on the codebase
const EXPECTED_AUDIO = {
  letters: [
    // Each letter has: name, phonics, example
    ...['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
        'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
      .flatMap(letter => [
        `${letter}-name.mp3`,
        `${letter}-phonics.mp3`,
        `${letter}-example.mp3`,
      ])
  ],
  words: [
    // Common CVC words and sight words
    'cat.mp3', 'dog.mp3', 'pig.mp3', 'fox.mp3', 'owl.mp3', 'bee.mp3',
    'bug.mp3', 'bat.mp3', 'egg.mp3', 'jam.mp3', 'nut.mp3', 'pie.mp3',
    'bun.mp3', 'tea.mp3', 'bus.mp3', 'hat.mp3', 'box.mp3', 'bed.mp3',
    'cup.mp3', 'pen.mp3', 'bag.mp3', 'toy.mp3', 'key.mp3', 'sun.mp3',
    'sky.mp3', 'sea.mp3', 'log.mp3', 'run.mp3', 'sit.mp3', 'hop.mp3',
    'duck.mp3', 'frog.mp3', 'crab.mp3', 'fish.mp3', 'bear.mp3', 'lamb.mp3',
    'goat.mp3', 'cake.mp3', 'milk.mp3', 'corn.mp3', 'bean.mp3', 'rice.mp3',
    'ball.mp3', 'book.mp3', 'bell.mp3', 'door.mp3', 'sock.mp3', 'bike.mp3',
    'kite.mp3', 'boat.mp3', 'tree.mp3', 'rain.mp3', 'moon.mp3', 'star.mp3',
    'snow.mp3', 'wind.mp3', 'rock.mp3', 'lake.mp3', 'jump.mp3', 'kick.mp3',
    'sing.mp3', 'clap.mp3', 'swim.mp3', 'hand.mp3', 'foot.mp3', 'nose.mp3',
    'knee.mp3', 'horse.mp3', 'mouse.mp3', 'tiger.mp3', 'whale.mp3', 'snake.mp3',
    'bread.mp3', 'apple.mp3', 'pizza.mp3', 'chair.mp3', 'table.mp3', 'truck.mp3',
    'clock.mp3', 'spoon.mp3', 'cloud.mp3', 'grass.mp3', 'plant.mp3', 'beach.mp3',
    'house.mp3', 'store.mp3', 'school.mp3',
    // New themed words
    'car.mp3', 'van.mp3', 'taxi.mp3', 'train.mp3', 'plane.mp3', 'wheel.mp3',
    'space.mp3', 'earth.mp3', 'alien.mp3', 'rocket.mp3', 'planet.mp3',
    'bot.mp3', 'beep.mp3', 'gear.mp3', 'robot.mp3', 'power.mp3', 'metal.mp3',
    'dino.mp3', 'bone.mp3', 'roar.mp3', 'tail.mp3', 'claw.mp3', 'fossil.mp3',
    'snap.mp3', 'cold.mp3', 'bask.mp3', 'scale.mp3', 'shell.mp3',
  ],
  phonemes: [
    'b.mp3', 't.mp3', 'g.mp3', 'f.mp3', 's.mp3', 'd.mp3', 'r.mp3',
    'ee.mp3', 'sh.mp3', 'h.mp3', 'k.mp3', 'n.mp3', 'm.mp3', 'l.mp3',
    'ch.mp3', 'th.mp3', 'ck.mp3', 'ng.mp3', 'ai.mp3', 'oa.mp3',
  ],
};

function getFilesInDirectory(dir: string): string[] {
  try {
    if (!fs.existsSync(dir)) {
      return [];
    }
    return fs.readdirSync(dir).filter(file => file.endsWith('.mp3'));
  } catch {
    return [];
  }
}

function validateCategory(category: string, expected: string[]): ValidationResult {
  const categoryDir = path.join(AUDIO_DIR, category);
  const found = getFilesInDirectory(categoryDir);
  const missing = expected.filter(file => !found.includes(file));

  return {
    category,
    expected,
    found,
    missing,
  };
}

function printResults(results: ValidationResult[]): void {
  console.log('\n========================================');
  console.log('  AUDIO FILE VALIDATION REPORT');
  console.log('========================================\n');

  let totalExpected = 0;
  let totalFound = 0;
  let totalMissing = 0;

  results.forEach(result => {
    const status = result.missing.length === 0 ? '✅' : '⚠️';
    console.log(`${status} ${result.category.toUpperCase()}`);
    console.log(`   Expected: ${result.expected.length}`);
    console.log(`   Found:    ${result.found.length}`);
    console.log(`   Missing:  ${result.missing.length}`);

    if (result.missing.length > 0 && result.missing.length <= 10) {
      result.missing.forEach(file => {
        console.log(`      - ${file}`);
      });
    } else if (result.missing.length > 10) {
      result.missing.slice(0, 5).forEach(file => {
        console.log(`      - ${file}`);
      });
      console.log(`      ... and ${result.missing.length - 5} more`);
    }
    console.log('');

    totalExpected += result.expected.length;
    totalFound += result.found.length;
    totalMissing += result.missing.length;
  });

  console.log('========================================');
  console.log('  SUMMARY');
  console.log('========================================');
  console.log(`  Total Expected:  ${totalExpected}`);
  console.log(`  Total Found:     ${totalFound}`);
  console.log(`  Total Missing:   ${totalMissing}`);
  console.log(`  Coverage:        ${((totalFound / totalExpected) * 100).toFixed(1)}%`);
  console.log('========================================\n');

  // Exit with error code if missing files
  if (totalMissing > 0) {
    console.log('⚠️  Some audio files are missing. Run generate-audio to create them.\n');
    process.exit(1);
  } else {
    console.log('✅ All expected audio files are present!\n');
    process.exit(0);
  }
}

// Run validation
const results: ValidationResult[] = [
  validateCategory('letters', EXPECTED_AUDIO.letters),
  validateCategory('words', EXPECTED_AUDIO.words),
  validateCategory('phonemes', EXPECTED_AUDIO.phonemes),
];

printResults(results);
