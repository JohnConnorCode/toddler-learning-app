#!/bin/bash

# Generate missing themed audio files using macOS TTS
# Usage: bash scripts/generate-missing-audio.sh

echo "Generating missing themed word audio..."
echo ""

VOICE="Samantha"
mkdir -p public/audio/words public/audio/sentences

# Themed words that need audio
declare -a words=(
    # Vehicles
    "van" "taxi" "train" "plane" "wheel"
    # Space
    "space" "earth" "alien" "rocket" "planet"
    # Technology
    "bot" "beep" "gear" "robot" "power" "metal"
    # Dinosaurs
    "dino" "bone" "roar" "tail" "claw" "fossil"
    # Reptiles
    "snap" "cold" "bask" "scale" "shell"
)

# Sentences from words-data.ts
declare -A sentences=(
    # Vehicles
    ["van"]="The van can carry lots of people"
    ["taxi"]="The taxi takes us places"
    ["train"]="The train goes choo choo"
    ["plane"]="The plane flies high in the sky"
    ["wheel"]="The wheel goes round and round"
    # Space
    ["space"]="Rockets fly into space"
    ["earth"]="We live on planet Earth"
    ["alien"]="Is there an alien on Mars"
    ["rocket"]="The rocket blasts off"
    ["planet"]="Mars is a red planet"
    # Technology
    ["bot"]="The bot can help us"
    ["beep"]="The robot says beep"
    ["gear"]="The gear turns around"
    ["robot"]="The robot can dance"
    ["power"]="The robot needs power"
    ["metal"]="Robots are made of metal"
    # Dinosaurs
    ["dino"]="The dino is big"
    ["bone"]="We found a dinosaur bone"
    ["roar"]="The T-Rex says roar"
    ["tail"]="The dinosaur wags its tail"
    ["claw"]="The dinosaur has sharp claws"
    ["fossil"]="We found a fossil"
    # Reptiles
    ["snap"]="The crocodile can snap"
    ["cold"]="Reptiles are cold blooded"
    ["bask"]="Lizards bask in the sun"
    ["scale"]="Snakes have smooth scales"
    ["shell"]="The turtle hides in its shell"
)

count=0
total=${#words[@]}

for word in "${words[@]}"; do
    upper=$(echo "$word" | tr '[:lower:]' '[:upper:]')
    ((count++))

    echo "[$count/$total] Generating: $upper"

    # 1. Word pronunciation
    say -v "$VOICE" -r 160 -o "public/audio/words/${word}.aiff" "$upper"
    afconvert -f mp4f -d aac "public/audio/words/${word}.aiff" "public/audio/words/${word}.mp3"
    rm "public/audio/words/${word}.aiff"

    # 2. Sentence
    sentence="${sentences[$word]}"
    if [ -n "$sentence" ]; then
        say -v "$VOICE" -r 170 -o "public/audio/sentences/${word}.aiff" "$sentence"
        afconvert -f mp4f -d aac "public/audio/sentences/${word}.aiff" "public/audio/sentences/${word}.mp3"
        rm "public/audio/sentences/${word}.aiff"
    fi
done

echo ""
echo "Done! Generated $total word files + $total sentence files"
echo "Files saved to public/audio/words/ and public/audio/sentences/"
