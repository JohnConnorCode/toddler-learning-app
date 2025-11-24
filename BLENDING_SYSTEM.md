# Mentava-Style Blending System

## 🎯 Overview

This app implements a complete, scientifically-backed reading curriculum system based on Mentava-style principles. It teaches young children (ages 3-5) to blend phonemes into words using spaced repetition and adaptive difficulty.

## 🏗️ Architecture

### Core Components

#### 1. **Session Flow Manager** (`src/lib/session-flow.ts`)
Controls the learning experience with two modes:

- **Auto-flow Mode (Guided)**:
  - 10-step structured sessions
  - Warm-up → Practice → Challenge → Cool-down
  - Progress tracking with visual indicators
  - Recommended for beginners

- **Menu Mode (Free Choice)**:
  - User selects activities independently
  - Great for confident learners
  - Returns to hub after each activity

#### 2. **Word Scheduler with SRS** (`src/lib/word-scheduler.ts`)
Implements spaced repetition system (SM-2 algorithm):

- **Smoothness Tracking**: Measures how quickly child blends sounds (< 700ms = smooth)
- **Interval Calculation**: Determines when to review each word
- **Mastery Threshold**: 10 successful smooth reviews = mastered
- **Adaptive Difficulty**: Adjusts based on performance

#### 3. **Blending Words Database** (`src/lib/blending-words-data.ts`)
- 200+ CVC words organized by phonics unit
- Progressive difficulty levels (1-3)
- Unit-based filtering for age-appropriate content

#### 4. **Four Blending Activities**

**Tap to Blend** (`src/components/blending/TapToBlend.tsx`)
- Tap letters quickly to "snap blocks together"
- Real-time timing analysis (< 700ms between taps = smooth)
- Visual feedback with smoothness score

**Sound Segmenting** (`src/components/blending/SoundSegmenting.tsx`)
- Drag letter blocks to correct positions
- Hear segmented phonemes
- Mistake tracking with hint system

**Blending Slider** (`src/components/blending/BlendingSlider.tsx`)
- Drag knob smoothly across letters
- Continuous sound blending
- Connection tracking

**Decodable Sentences** (`src/components/blending/DecodableSentence.tsx`)
- Read simple sentences using known sounds
- Independent reading tracking
- Unit-appropriate vocabulary

#### 5. **Parent Dashboard** (`src/app/parent-dashboard/page.tsx`)
Complete analytics:
- Mastered words count
- In-progress tracking
- Top performing words
- Words needing practice
- Recent activity log
- Export progress data

## 📊 Data Flow

```
User starts session
    ↓
SessionFlow determines mode (auto/menu)
    ↓
Word Scheduler selects optimal words
    ↓
60% review + 30% in-progress + 10% new
    ↓
Activities measure smoothness (0-1 scale)
    ↓
Word Scheduler records performance
    ↓
SRS calculates next review interval
    ↓
Parent Dashboard displays analytics
```

## 🎮 User Journey

### For Children

1. **Homepage** → Click "Blending Practice"
2. **Mode Selection** → Choose "Guided Mode" or "Free Choice"
3. **Guided Session** (Auto-flow):
   - Activity 1/10: Tap "CAT" (Warm-up)
   - Activity 2/10: Tap "DOG" (Warm-up)
   - Activity 3/10: Build "SAT" (Practice)
   - Activity 4/10: Build "MAT" (Practice)
   - Activity 5/10: Build "HAT" (Practice)
   - Activity 6/10: Slide "PAN" (Challenge)
   - Activity 7/10: Slide "CAN" (Challenge)
   - Activity 8/10: Read sentence (Application)
   - Activity 9/10: Tap "BIN" (Cool-down)
   - Activity 10/10: Tap "PIN" (Cool-down)
4. **Completion** → Celebration screen with stats
5. **Options** → "Practice More" or "All Done"

### For Parents

1. **Homepage** → Click purple chart icon (bottom)
2. **Dashboard** shows:
   - Overall progress
   - Mastered words
   - Words needing practice
   - Smoothness trends
   - Review schedule
3. **Export** progress data as JSON

## 🧪 How SRS Works

### Algorithm Details

```javascript
// Initial state
interval = 0 (review immediately)
easeFactor = 1.3
smoothnessThreshold = 0.7

// On success (smoothness >= 0.7)
if (interval === 0) {
  interval = 1 day
} else {
  interval = interval * easeFactor
}

// Adjust ease factor
if (smoothness >= 0.9) {
  easeFactor += 0.15 // Very smooth
} else if (smoothness >= 0.7) {
  easeFactor += 0.05 // Smooth
}

// On failure (smoothness < 0.7)
interval = 0 // Review again soon
easeFactor -= 0.2
easeFactor = max(0.5, easeFactor)

// Cap intervals for young children
interval = min(7, interval) // Max 1 week
```

### Smoothness Calculation

**Tap to Blend**:
```javascript
score = 1.0
if (maxGap > 700ms) score -= penalty
if (totalTime > 2500ms) score -= penalty
if (inconsistent) score -= penalty
score = max(0, min(1, score))
```

**Sound Segmenting**:
```javascript
mistakes = 0
0 mistakes → 1.0
1 mistake  → 0.85
2 mistakes → 0.7
3+ mistakes → 0.5
```

**Blending Slider**:
- Measures continuous connection
- Penalizes gaps and backtracking

**Decodable Sentences**:
```javascript
wordsClicked / totalWords
0 words clicked → 1.0 (independent)
All words clicked → 0.5 (needs support)
```

## 🎨 Visual Design

### Color Coding
- **Vowels**: Pink/Red blocks
- **Consonants**: Blue blocks
- **Success**: Green
- **Practice**: Yellow/Orange
- **Mastery**: Gold stars

### Animations
- **Framer Motion** for smooth transitions
- **Building block snap** effect on successful blends
- **Confetti** for independent reading
- **Progress bars** with gradient fills

## 📁 File Structure

```
src/
├── app/
│   ├── blending-activities/     # Main blending hub
│   │   └── page.tsx             # Uses SessionFlow
│   └── parent-dashboard/        # Analytics dashboard
│       └── page.tsx
├── components/
│   ├── blending/
│   │   ├── TapToBlend.tsx       # Activity 1
│   │   ├── SoundSegmenting.tsx  # Activity 2
│   │   ├── BlendingSlider.tsx   # Activity 3
│   │   ├── DecodableSentence.tsx# Activity 4
│   │   └── LetterBlock.tsx      # Reusable block component
│   └── SessionFlow.tsx          # Session orchestrator
├── lib/
│   ├── session-flow.ts          # Session management
│   ├── word-scheduler.ts        # SRS algorithm
│   ├── blending-words-data.ts   # 200+ CVC words
│   └── decodable-sentences-data.ts # 30 sentences
└── hooks/
    ├── use-speech.ts            # Text-to-speech
    └── use-phonics-progress.ts  # Progress tracking
```

## 🚀 Getting Started

### Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

### Testing the System

1. **Complete Unit 1** in Phonics (or disable lock in Settings)
2. **Go to Blending Activities** from homepage
3. **Choose Guided Mode** (recommended first time)
4. **Complete 10-step session**
5. **Check Parent Dashboard** for analytics

### Production

```bash
npm run build
npm start
# Or deploy to Vercel
```

## 🔧 Configuration

### Adjusting SRS Parameters

Edit `src/lib/word-scheduler.ts`:

```typescript
const INITIAL_INTERVAL = 1;      // Days until first review
const SMOOTH_THRESHOLD = 0.7;    // 70% smoothness = success
const MASTERY_THRESHOLD = 10;    // Reviews needed for mastery
const MAX_EASE_FACTOR = 3.0;     // Maximum interval multiplier
const MIN_EASE_FACTOR = 0.5;     // Minimum interval multiplier
```

### Adjusting Smoothness Detection

Edit `src/components/blending/TapToBlend.tsx`:

```typescript
const SMOOTH_THRESHOLD_MS = 700;      // Max gap between taps
const MAX_WORD_DURATION_MS = 2500;    // Max total time
```

### Session Mix

Edit `src/lib/word-scheduler.ts`:

```typescript
// Current: 60% review, 30% in-progress, 10% new
const targetReview = Math.ceil(count * 0.6);
const targetProgress = Math.ceil(count * 0.3);
const targetNew = Math.max(1, count - targetReview - targetProgress);
```

## 📝 Data Storage

### localStorage Keys

- `word-review-schedule`: SRS data for all words
- `current-session`: Active session state
- `phonics-progress`: Completed units
- `app-settings`: User preferences

### Data Export

Parents can export progress data:
1. Go to Parent Dashboard
2. Click "Export Data"
3. Receives JSON file with complete history

## 🎯 Success Metrics

### Per Session
- Activities completed: X/10
- Average smoothness: Y%
- Words mastered: Z
- Time spent: N minutes

### Overall
- Total mastered words
- Total reviews completed
- Average smoothness trend
- Completion rate

## 🐛 Troubleshooting

### Audio Not Working
- Check browser supports Web Speech API
- Ensure volume is up
- Try Chrome/Safari (best support)

### Progress Not Saving
- Check localStorage is enabled
- Clear browser cache if needed
- Check browser console for errors

### Activities Not Unlocking
- Complete Unit 1 in Phonics first
- Or disable "Lock Progression" in Settings

## 📚 Resources

- **Spaced Repetition**: [SM-2 Algorithm](https://en.wikipedia.org/wiki/SuperMemo)
- **Phonics Research**: Science of Reading principles
- **Mentava**: Similar commercial app for reference

## 🤝 Contributing

To add new words:
1. Edit `src/lib/blending-words-data.ts`
2. Add to appropriate unit
3. Run `npm run generate-audio` (optional)
4. Test in blending activities

To add new activities:
1. Create component in `src/components/blending/`
2. Implement `onComplete(smoothnessScore: number)` callback
3. Add to SessionFlow activity types
4. Update session-flow.ts activity selection

## 📄 License

MIT License - Educational purposes

---

**Built with**: Next.js 16, TypeScript, Tailwind CSS, Framer Motion, Zustand
**Optimized for**: Ages 3-5, Touch devices, Parent oversight
