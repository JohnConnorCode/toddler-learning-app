#!/bin/bash

# Script to generate phoneme and word audio files using macOS say command

set -e

PHONEMES_DIR="public/audio/phonemes"
WORDS_DIR="public/audio/words"

# Create directories if they don't exist
mkdir -p "$PHONEMES_DIR"
mkdir -p "$WORDS_DIR"

echo "Generating phoneme sounds..."

# Function to generate audio file
generate_audio() {
    local text="$1"
    local output_file="$2"
    local rate="${3:-180}"  # Default speaking rate

    # Generate AIFF first
    say -r "$rate" -o "${output_file%.mp3}.aiff" "$text"

    # Convert to M4A (AAC in MP4 container - supported by all browsers)
    # Output as .mp3 extension but it's actually AAC (browsers support both)
    afconvert -f m4af -d aac "${output_file%.mp3}.aiff" "$output_file"

    # Remove temporary AIFF
    rm "${output_file%.mp3}.aiff"

    echo "Created: $output_file"
}

# Phoneme sounds (sustained sounds)
# Using phonetic representations that 'say' can pronounce
generate_audio "sss" "$PHONEMES_DIR/s.mp3" 120
generate_audio "mmm" "$PHONEMES_DIR/m.mp3" 120
generate_audio "fff" "$PHONEMES_DIR/f.mp3" 120
generate_audio "k" "$PHONEMES_DIR/k.mp3" 200
generate_audio "hhh" "$PHONEMES_DIR/h.mp3" 140
generate_audio "b" "$PHONEMES_DIR/b.mp3" 200
generate_audio "d" "$PHONEMES_DIR/d.mp3" 200
generate_audio "lll" "$PHONEMES_DIR/l.mp3" 120
generate_audio "t" "$PHONEMES_DIR/t.mp3" 200
generate_audio "nnn" "$PHONEMES_DIR/n.mp3" 120
generate_audio "rrr" "$PHONEMES_DIR/r.mp3" 120
generate_audio "g" "$PHONEMES_DIR/g.mp3" 200
generate_audio "eee" "$PHONEMES_DIR/ee.mp3" 140
generate_audio "shh" "$PHONEMES_DIR/sh.mp3" 120

echo ""
echo "Generating missing word audio..."

# Missing word
generate_audio "car" "$WORDS_DIR/car.mp3" 180

echo ""
echo "Audio generation complete!"
echo "Created 14 phoneme sounds and 1 word"
echo ""
echo "Note: These are computer-generated sounds. For best quality,"
echo "consider recording with a human voice."
