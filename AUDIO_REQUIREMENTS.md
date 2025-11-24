# Audio File Requirements

This document outlines all audio files needed for the Toddler Learning App to function properly.

## Directory Structure

```
public/
  audio/
    words/          # Word pronunciations
    phonemes/       # Individual sound pronunciations
    letters/        # Letter names and sounds
    instructions/   # Activity instructions
```

## Phase 2: Pre-Reading Skills - Required Audio Files

### Individual Phoneme Sounds
Location: `/public/audio/phonemes/`

These are isolated sound files (NOT letter names, just the sounds):
- `s.mp3` - /s/ sound (like in "sun")
- `m.mp3` - /m/ sound (like in "moon")
- `f.mp3` - /f/ sound (like in "fish")
- `k.mp3` - /k/ sound (like in "cat")
- `h.mp3` - /h/ sound (like in "hat")
- `b.mp3` - /b/ sound (like in "bat")
- `d.mp3` - /d/ sound (like in "dog")
- `l.mp3` - /l/ sound (like in "log")
- `t.mp3` - /t/ sound (like in "tree")
- `n.mp3` - /n/ sound (like in "sun")
- `r.mp3` - /r/ sound (like in "car")
- `g.mp3` - /g/ sound (like in "dog")
- `ee.mp3` - /ee/ sound (like in "tree")
- `sh.mp3` - /sh/ sound (like in "fish")

### Word Pronunciations
Location: `/public/audio/words/`

Words used in phonemic awareness activities:
- `sun.mp3`
- `sock.mp3`
- `snake.mp3`
- `moon.mp3`
- `mouse.mp3`
- `milk.mp3`
- `cat.mp3`
- `hat.mp3`
- `bat.mp3`
- `dog.mp3`
- `frog.mp3`
- `log.mp3`
- `car.mp3`
- `tree.mp3`
- `fish.mp3`

## Phase 1: Assessment - Required Audio Files

### Assessment Instructions
Location: `/public/audio/instructions/`

Optional instruction audio for assessment questions:
- `letter-identification.mp3` - "What is the name of this letter?"
- `letter-sound.mp3` - "What sound does this letter make?"
- `rhyme-recognition.mp3` - "Do these words rhyme?"
- `read-word.mp3` - "Can you read this word?"

## Creating Audio Files

### Best Practices

1. **Format**: MP3, 128kbps or higher
2. **Sample Rate**: 44.1kHz
3. **Mono or Stereo**: Mono preferred to reduce file size
4. **Voice**: Clear, friendly, age-appropriate voice
5. **Pace**: Slow and clear for young children
6. **Background**: No background music or noise

### Phoneme Sounds

- **Duration**: 0.5-1 second per sound
- **Continuous sounds** (s, m, f, etc.): Hold for about 1 second
- **Stop sounds** (t, p, k, etc.): Quick, sharp sound
- **NO letter names**: Say only the sound, not "ess" but /s/

Example:
- ✅ Correct: /sssss/ (continuous hissing sound)
- ❌ Wrong: "ess" (the letter name)

### Word Pronunciations

- **Duration**: 1-2 seconds per word
- **Natural pace**: Not too slow, but clear
- **Pronunciation**: Standard, clear pronunciation
- **Emotion**: Warm, encouraging tone

## Temporary Development Solution

For development and testing, you can:

1. **Use Text-to-Speech**: Generate temporary audio using online TTS tools
2. **Record yourself**: Use a microphone to record clear pronunciations
3. **Placeholder files**: Create silent MP3 files as placeholders

### Generate Placeholder Files (macOS)

```bash
# Create directories
mkdir -p public/audio/words
mkdir -p public/audio/phonemes
mkdir -p public/audio/letters
mkdir -p public/audio/instructions

# Generate 1-second silent MP3 files for testing
for word in sun sock snake moon mouse milk cat hat bat dog frog log car tree fish owl fox goat lamb crab pig; do
  ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 1 -q:a 9 -acodec libmp3lame "public/audio/words/$word.mp3"
done
```

## Future Audio Needs

As we expand to Phases 3-10, additional audio will be needed for:
- All letter sounds (a-z)
- Letter names (A-Z)
- Digraphs (ch, sh, th, wh, ph, etc.)
- Blending examples
- Decodable reader narration
- Sight word pronunciations
- Word family examples

## Professional Recording

For production-quality audio, consider:
- Hiring a voice actor experienced with children's content
- Recording in a professional studio
- Having multiple voices (child-friendly adult voice)
- Creating batch recordings for efficiency

## Attribution

If using commercial audio or voice actors, maintain attribution in:
- `public/audio/CREDITS.md`
- Include licensing information
- Respect copyright and usage rights
