#!/bin/bash

# Free Audio Generation using macOS 'say' command
# No API keys needed - works immediately on Mac
#
# Usage: bash scripts/generate-audio-macos.sh

echo "🎤 Generating audio using macOS Text-to-Speech..."
echo ""

# Best macOS voice for children: Samantha (female, clear)
VOICE="Samantha"
# Alternative voices: Karen, Victoria, Alex

# Create directories
mkdir -p public/audio/letters public/audio/words public/audio/sentences

echo "🔤 Generating letter sounds..."
echo ""

# Letters array
declare -a letters=("a" "b" "c" "d" "e" "f" "g" "h" "i" "j" "k" "l" "m" "n" "o" "p" "q" "r" "s" "t" "u" "v" "w" "x" "y" "z")

# Letter examples (from your phonics data)
declare -A examples=(
    ["a"]="Apple" ["b"]="Bear" ["c"]="Cat" ["d"]="Dog"
    ["e"]="Elephant" ["f"]="Fish" ["g"]="Giraffe" ["h"]="Horse"
    ["i"]="Igloo" ["j"]="Jellyfish" ["k"]="Kite" ["l"]="Lion"
    ["m"]="Monkey" ["n"]="Nest" ["o"]="Octopus" ["p"]="Penguin"
    ["q"]="Queen" ["r"]="Rabbit" ["s"]="Snake" ["t"]="Tiger"
    ["u"]="Umbrella" ["v"]="Van" ["w"]="Whale" ["x"]="Xylophone"
    ["y"]="Yak" ["z"]="Zebra"
)

# Generate letter sounds
for letter in "${letters[@]}"; do
    upper=$(echo "$letter" | tr '[:lower:]' '[:upper:]')

    # 1. Phonics sound (pure letter sound)
    say -v "$VOICE" -r 150 -o "public/audio/letters/${letter}-phonics.aiff" "$letter"
    afconvert -f mp4f -d aac "public/audio/letters/${letter}-phonics.aiff" "public/audio/letters/${letter}-phonics.mp3"
    rm "public/audio/letters/${letter}-phonics.aiff"

    # 2. Letter name
    say -v "$VOICE" -r 180 -o "public/audio/letters/${letter}-name.aiff" "$upper"
    afconvert -f mp4f -d aac "public/audio/letters/${letter}-name.aiff" "public/audio/letters/${letter}-name.mp3"
    rm "public/audio/letters/${letter}-name.aiff"

    # 3. Example (e.g., "A is for Apple")
    example="${examples[$letter]}"
    say -v "$VOICE" -r 180 -o "public/audio/letters/${letter}-example.aiff" "$upper is for $example"
    afconvert -f mp4f -d aac "public/audio/letters/${letter}-example.aiff" "public/audio/letters/${letter}-example.mp3"
    rm "public/audio/letters/${letter}-example.aiff"

    echo "✓ Generated sounds for $upper"
done

echo ""
echo "✅ Letter sounds generated!"
echo ""
echo "📝 Generating word sounds..."
echo ""

# Sample words (you can add more from WORDS_DATA)
declare -a words=("cat" "dog" "pig" "fox" "owl" "bee" "bug" "bat" "egg" "jam" "nut" "pie" "bun" "tea" "bus" "hat" "box" "bed" "cup" "pen" "bag" "toy" "key" "sun" "sky" "sea" "log" "run" "sit" "hop")

declare -A sentences=(
    ["cat"]="The cat drinks milk"
    ["dog"]="The dog wags its tail"
    ["pig"]="The pig rolls in mud"
    ["fox"]="The red fox is clever"
    ["owl"]="The owl hoots at night"
    ["bee"]="The bee makes honey"
    ["bug"]="I saw a bug on the leaf"
    ["bat"]="The bat flies at night"
    ["egg"]="I ate an egg for breakfast"
    ["jam"]="I spread jam on my toast"
    ["nut"]="Squirrels love to eat nuts"
    ["pie"]="Apple pie tastes yummy"
    ["bun"]="I like a burger on a bun"
    ["tea"]="Mom drinks hot tea"
    ["bus"]="I ride the bus to school"
    ["hat"]="I wear a hat in the sun"
    ["box"]="The toys are in the box"
    ["bed"]="I sleep in my bed"
    ["cup"]="I drink from a cup"
    ["pen"]="I write with a pen"
    ["bag"]="I carry my bag to school"
    ["toy"]="This is my favorite toy"
    ["key"]="Use the key to open the door"
    ["sun"]="The sun is bright and warm"
    ["sky"]="The sky is blue"
    ["sea"]="We swim in the sea"
    ["log"]="The frog sat on a log"
    ["run"]="I can run very fast"
    ["sit"]="Please sit on the chair"
    ["hop"]="Rabbits hop on the grass"
)

for word in "${words[@]}"; do
    upper=$(echo "$word" | tr '[:lower:]' '[:upper:]')

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

    echo "✓ Generated sound for $upper"
done

echo ""
echo "✅ Word sounds generated!"
echo ""
echo "🎉 Done! Generated audio files:"
echo "  - 78 letter sound files (26 x 3)"
echo "  - 60 word/sentence files (30 x 2)"
echo ""
echo "All files saved to public/audio/"
echo ""
echo "Note: To generate ALL words, update the script with your full WORDS_DATA"
