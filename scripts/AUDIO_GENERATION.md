# Audio Generation for Blending Words

This document explains how to generate audio files for blending practice words.

## Overview

The Mentava-style curriculum uses pre-recorded audio for optimal blending instruction. Each word needs a clear, slow-paced audio file with proper pronunciation.

## Quick Start

### Generate placeholder files:
```bash
npm run generate-audio
```

### Generate for specific word:
```bash
node scripts/generate-audio.js --word cat
```

### Generate for specific unit:
```bash
node scripts/generate-audio.js --unit 3
```

## Audio Requirements

### Technical Specs:
- **Format:** MP3
- **Bitrate:** 128-192 kbps
- **Sample Rate:** 44.1 kHz
- **Duration:** 1-2 seconds per word
- **Volume:** Normalized, consistent levels

### Voice Requirements:
- **Speed:** 0.75x normal (slower for clarity)
- **Pitch:** Slightly higher (child-friendly)
- **Tone:** Warm, encouraging, clear
- **Accent:** Neutral American English
- **Emphasis:** Equal stress on all phonemes

## Production Options

### Option 1: Google Cloud Text-to-Speech
```bash
npm install @google-cloud/text-to-speech
```

**Pros:**
- High quality neural voices
- Good pronunciation
- Affordable at scale

**Cons:**
- Requires Google Cloud account
- May need phonetic adjustments

**Setup:**
1. Create Google Cloud project
2. Enable Text-to-Speech API
3. Download service account key
4. Set GOOGLE_APPLICATION_CREDENTIALS environment variable

### Option 2: Amazon Polly
```bash
npm install @aws-sdk/client-polly
```

**Pros:**
- Excellent neural voices
- Child-friendly options (Joey voice)
- Good for production use

**Cons:**
- Requires AWS account
- Cost per character

**Setup:**
1. Create AWS account
2. Configure AWS credentials
3. Use Polly neural engine with Joey or Joanna voice

### Option 3: Professional Voice Actor (Recommended)

**Pros:**
- Highest quality
- Perfect for young learners
- Full control over pronunciation

**Cons:**
- Higher upfront cost
- Requires coordination

**Process:**
1. Export word list from generate-audio.js
2. Hire voice actor on Fiverr/Upwork
3. Provide pronunciation guide
4. Review and approve recordings
5. Place files in public/audio/words/

## File Structure

```
public/
  audio/
    words/
      cat.mp3
      dog.mp3
      sat.mp3
      ...
```

## Testing Audio

After generating audio files, test them:

1. Visit `/blending-activities`
2. Start any blending activity
3. Verify audio plays correctly
4. Check volume levels are consistent
5. Ensure pronunciation is clear

## Pronunciation Guide

### Phoneme-by-Phoneme:
Words should emphasize individual phonemes without breaking flow:
- "cat" = /k/ /æ/ /t/ (not "kuh-aa-tuh")
- "dog" = /d/ /ɒ/ /g/ (not "duh-oh-guh")

### Blended Words:
Final audio should sound natural when blended smoothly, as if the child is successfully blending the phonemes together.

## Troubleshooting

### Audio not playing:
- Check file path: `public/audio/words/<word>.mp3`
- Verify file format is MP3
- Check browser console for errors

### Audio too fast/slow:
- Adjust speaking rate in TTS settings
- Re-generate with different speed

### Pronunciation issues:
- Use SSML for fine-tuned control
- Add phonetic spelling
- Consider professional recording

## Future Enhancements

- [ ] Batch generation from blending-words-data.ts
- [ ] Automatic quality checking
- [ ] Volume normalization script
- [ ] SSML templates for better pronunciation
- [ ] Support for multiple voices/accents
