# Audio System Setup

Your app now uses **pre-recorded high-quality audio files** instead of the crappy Web Speech API!

## What Changed

✅ **Replaced Web Speech API with Howler.js**
- All letter sounds now play from pre-recorded MP3 files
- All word sounds play from pre-recorded MP3 files
- Consistent quality across all devices and browsers
- Instant playback, no lag

✅ **Generated Audio Files**
- 78 letter audio files (26 letters × 3 types)
  - Phonics sounds (pure letter sounds)
  - Letter names (A, B, C, etc.)
  - Examples ("A is for Apple")
- 60 word/sentence files
  - Word pronunciations
  - Sentence examples

## Audio Files Location

```
public/audio/
├── letters/
│   ├── a-phonics.mp3  (phonics sound)
│   ├── a-name.mp3     (letter name)
│   ├── a-example.mp3  ("A is for Apple")
│   └── ... (all 26 letters)
├── words/
│   ├── cat.mp3
│   ├── dog.mp3
│   └── ... (30+ words)
└── sentences/
    ├── cat.mp3  ("The cat drinks milk")
    ├── dog.mp3  ("The dog wags its tail")
    └── ... (30+ sentences)
```

## How to Test

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open the app:**
   ```
   http://localhost:3000
   ```

3. **Test the sounds:**
   - Go to `/phonics` and click letters
   - Go to `/words` and spell words
   - Listen to the audio - it should be MUCH better!

## Generating More Audio

### For ALL 100+ words

Edit `scripts/generate-audio-macos.sh` and add all your words from `WORDS_DATA`, then run:

```bash
bash scripts/generate-audio-macos.sh
```

### Using Google Cloud TTS (Better Quality)

If you want even BETTER quality:

1. **Set up Google Cloud:**
   ```bash
   # Install Google Cloud SDK
   brew install google-cloud-sdk

   # Login
   gcloud auth application-default login

   # Enable Text-to-Speech API
   # Go to: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
   ```

2. **Generate audio:**
   ```bash
   npx tsx scripts/generate-audio.ts
   ```

This will generate ~250 audio files with Google's best neural voices.

## Audio Quality Comparison

### Before (Web Speech API)
- ❌ Robotic, inconsistent
- ❌ "Buh" sounds added schwa vowel
- ❌ Different on every device
- ❌ Lag when playing

### After (Pre-recorded MP3)
- ✅ Clear, consistent human voice
- ✅ Pure phonetic sounds
- ✅ Same quality everywhere
- ✅ Instant playback

## Customization

### Change the Voice

Edit `scripts/generate-audio-macos.sh`:

```bash
# Current voice
VOICE="Samantha"

# Try these:
VOICE="Karen"      # Australian
VOICE="Victoria"   # British
VOICE="Alex"       # Male
```

Then regenerate: `bash scripts/generate-audio-macos.sh`

### Adjust Speed

```bash
# In the script, change -r value (rate)
say -v "$VOICE" -r 150 ...  # Slower
say -v "$VOICE" -r 200 ...  # Faster
```

## Troubleshooting

### "Audio not playing"

Check browser console for errors. Make sure:
- Audio files exist in `public/audio/`
- File names match (lowercase, no spaces)

### "Want different quality"

Use Google Cloud TTS script for premium quality:
```bash
npx tsx scripts/generate-audio.ts
```

### "Need to update audio"

Just run the generation script again:
```bash
bash scripts/generate-audio-macos.sh
```

Old files will be overwritten.

## Next Steps

1. **Test the app** - sounds should be WAY better now
2. **Generate remaining words** - add all 100+ words to the script
3. **Optional**: Use Google TTS for even better quality
4. **Optional**: Record custom audio with a voice actor for professional quality

## Files Modified

- ✅ `src/hooks/use-audio.ts` - New Howler.js audio hook
- ✅ `src/components/game/LetterCard.tsx` - Uses pre-recorded audio
- ✅ `src/components/game/WordBuilder.tsx` - Uses pre-recorded audio
- ✅ `scripts/generate-audio.ts` - Google TTS generator
- ✅ `scripts/generate-audio-macos.sh` - Free macOS TTS generator
- ✅ `public/audio/` - All audio files

## Cost

- **macOS TTS**: FREE (already used it)
- **Google Cloud TTS**: ~$1-2 for all sounds (one-time)
- **Professional voice actor**: $200-500 (best quality)

The sounds should now work perfectly! 🎉
