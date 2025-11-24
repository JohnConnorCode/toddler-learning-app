# Google Cloud Text-to-Speech Setup

## Why Use Google Cloud TTS?

The letter sounds in your app were generated using **Google Cloud Text-to-Speech API** with the high-quality `en-US-Neural2-F` neural voice. This provides:

- **Professional quality** - Natural, clear pronunciation
- **Child-friendly voice** - Warm, engaging tone
- **Consistency** - All audio matches in quality and voice
- **Better than macOS TTS** - Much more natural than the `say` command

## Setup Instructions

### 1. Install Google Cloud SDK

**macOS:**
```bash
brew install --cask google-cloud-sdk
```

**Or download from:** https://cloud.google.com/sdk/docs/install

### 2. Initialize and Authenticate

```bash
# Initialize gcloud
gcloud init

# Authenticate for application default credentials
gcloud auth application-default login
```

This will open your browser to sign in with your Google account.

### 3. Enable the Text-to-Speech API

Visit: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com

Click **"Enable"** to enable the API for your project.

### 4. Check Your Setup

```bash
# Verify credentials are set up
gcloud auth application-default print-access-token
```

If you see a long token, you're ready!

### 5. Generate the Audio Files

```bash
# Generate high-quality phoneme sounds
npx tsx scripts/generate-phonemes-google-tts.ts
```

This will create 14 phoneme sounds + 1 missing word, all matching the quality of your letter sounds.

## Pricing

Google Cloud TTS pricing (as of 2025):
- **Standard voices**: $4 per 1 million characters
- **Neural voices**: $16 per 1 million characters
- **Free tier**: 1 million characters per month for standard, 4 million for WaveNet/Neural

For this app:
- 14 phonemes + 1 word = ~50 characters
- **Cost**: Essentially free (well within free tier)
- Your existing 250+ letter/word audio files were also free

## Alternative: Use Existing macOS TTS

If you prefer not to set up Google Cloud (or want to work offline):

```bash
# Use the existing macOS-based script
bash generate-audio.sh
```

**Trade-offs:**
- ✅ Free and works offline
- ✅ No setup required
- ❌ Lower quality (robotic sound)
- ❌ Doesn't match your letter sounds
- ❌ Less child-friendly

## Recommendation

**Use Google Cloud TTS** for the best user experience. The setup takes 5 minutes and the result is professional-quality audio that matches your existing letter sounds perfectly.
