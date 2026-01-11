# 🚀 Kana Space Adventure

A touch-first Progressive Web App (PWA) for teaching English-speaking elementary school children how to read and write Japanese Hiragana and Katakana through interactive tracing, free writing, and vocabulary learning.

## ✨ Features

### 🎓 Learning Features
- **Dual Script Support**: Learn both Hiragana and Katakana
- **3 Difficulty Levels**: Beginner, Intermediate, and Advanced word sets
- **Interactive Writing**: Trace mode with guides and free-write mode
- **Automatic Evaluation**: Kid-friendly scoring system that encourages effort
- **Audio Pronunciation**: TTS for both English and Japanese words
- **Rich Vocabulary**: 37+ words across categories (animals, food, colors, everyday objects)

### 🎮 Gamification
- **Streak Tracking**: Daily practice streaks with fire emoji 🔥
- **XP & Levels**: Earn experience points and level up
- **Collectibles**: Unlock space-themed stickers and badges
- **Progress Dashboard**: Visual kana mastery grid

### 🌍 Bilingual UI
- Full support for English and Japanese (日本語)
- Instant language switching
- All UI strings localized

### 🎨 Design
- **Cute Space Theme**: Cosmic colors, stars, planets, and friendly mascots
- **Kid-Friendly**: Large buttons, high contrast, rounded corners
- **Touch-Optimized**: 44px minimum tap targets, smooth interactions
- **Responsive**: Works on phone, tablet, and desktop

### 💾 Privacy & Offline
- **Local Storage Only**: All data stored in IndexedDB
- **No Backend Required**: Runs entirely in the browser
- **PWA Support**: Install to home screen, works offline
- **Multi-Profile**: Support for multiple kids (planned)

---

## 🚀 Quick Start

### Installation

1. **Clone or download the project**
   ```bash
   cd C:\Users\ir835\.gemini\antigravity\scratch\kana-space-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the URL shown in the terminal)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` folder, ready to deploy to any static hosting service.

---

## 📁 Project Structure

```
kana-space-app/
├── index.html              # Main HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite + PWA configuration
├── public/
│   └── images/             # Vocabulary images
│       ├── cat.webp
│       ├── dog.webp
│       ├── apple.webp
│       └── ...
└── src/
    ├── main.js             # Application entry point
    ├── router.js           # Client-side routing
    ├── styles/
    │   ├── design-system.css   # Design tokens and components
    │   └── global.css          # Global styles and utilities
    ├── i18n/
    │   ├── localization.js     # Localization system
    │   └── strings.js          # English/Japanese strings
    ├── data/
    │   ├── kana-data.js        # Hiragana/Katakana characters
    │   └── word-data.js        # Vocabulary database
    ├── storage/
    │   └── storage.js          # IndexedDB wrapper for persistence
    ├── evaluation/
    │   ├── stroke-capture.js   # Canvas drawing capture
    │   └── template-matcher.js # Writing evaluation algorithm
    ├── components/
    │   └── AudioPlayer.js      # Web Speech API wrapper
    └── screens/
        ├── HomeScreen.js       # Landing page
        ├── SettingsScreen.js   # Settings and preferences
        ├── PracticeScreen.js   # Word card display
        ├── WritingScreen.js    # Interactive writing canvas
        ├── ResultsScreen.js    # Feedback and rewards
        └── ProgressScreen.js   # Stats and achievements
```

---

## 📊 Data Model

### Kana Data

Each kana character includes:
- `char`: The character (e.g., "あ", "ア")
- `romaji`: Romanization (e.g., "a", "ka")
- `strokes`: Number of strokes for evaluation

### Word Data

Each vocabulary word includes:
- `id`: Unique identifier
- `category`: 'animals', 'food', 'colors', 'numbers', 'everyday'
- `level`: 'beginner', 'intermediate', 'advanced'
- `english`: English meaning
- `romaji`: Romanized pronunciation
- `hiragana`: Hiragana reading
- `katakana`: Katakana reading
- `imageAsset`: Filename of the image
- `kanaFocus[]`: Array of kana to practice

**Example:**
```javascript
{
  id: 'word_001',
  category: 'animals',
  level: 'beginner',
  english: 'cat',
  romaji: 'neko',
  hiragana: 'ねこ',
  katakana: 'ネコ',
  imageAsset: 'cat.webp',
  kanaFocus: ['ね', 'こ', 'ネ', 'コ']
}
```

---

## 🧮 Writing Evaluation Algorithm

The automatic scoring system uses a multi-metric approach designed to be encouraging for children:

### Process:
1. **Stroke Capture**: Record pointer events as sequences of points
2. **Normalization**: 
   - Translate to center
   - Scale to standard size (0-1 range)
   - Smooth using moving average
3. **Evaluation Metrics**:
   - **Stroke Count Score (20%)**: Gentle scoring, allows ±1-2 strokes
   - **Complexity Score (40%)**: Checks path length to avoid scribbles or too-simple strokes
   - **Coverage Score (40%)**: Ensures drawing fills appropriate area

### Parameters:
- **Score Range**: 0-100
- **Encouragement-First**: Even low scores get positive feedback
- **No Strict Matching**: Focuses on effort and general shape, not perfection

### Feedback Tiers:
- 90-100: "Perfect! You're a star!" 🌟
- 80-89: "Excellent work!" ⭐
- 70-79: "Great tracing!" 😊
- 60-69: "Good job!" 👍
- 0-59: "Good try! Let's practice once more!" 💪

---

## 🌐 Localization Strategy

The app uses a centralized localization system:

### Structure:
- All strings are defined in `src/i18n/strings.js`
- Two languages supported: English (`en`) and Japanese (`ja`)
- Each string has a key (e.g., `home_title`, `practice_playEnglish`)

### Usage:
```javascript
import { i18n } from './i18n/localization.js';

// In code:
const text = i18n.t('home_title');

// In HTML:
<button data-i18n="home_dailyPractice">Daily Practice</button>
```

### Language Switching:
```javascript
i18n.setLang('ja'); // Switch to Japanese
```

All elements with the `data-i18n` attribute will automatically update.

---

## 🎯 Future Enhancements

### Content Expansion
- [ ] Add more vocabulary words (target: 100+ words)
- [ ] Include dakuten/handakuten combinations (が, ぱ, etc.)
- [ ] Add small kana practice (ゃ, ゅ, ょ)
- [ ] Recorded native audio (replace TTS)

### Features
- [ ] Review mistakes mode (adaptive practice)
- [ ] Weekly missions and achievements
- [ ] Parent dashboard/gate
- [ ] Export progress reports
- [ ] Multiplayer challenges
- [ ] Custom word lists

### Technical
- [ ] Offline asset caching improvements
- [ ] Better stroke order hints with animations
- [ ] Template-based stroke matching (more accurate)
- [ ] Analytics (local-only, privacy-first)

---

## 🛠️ Technologies Used

- **Vite**: Fast build tool and dev server
- **Vanilla JavaScript**: No framework dependencies
- **CSS Custom Properties**: Design system implementation
- **IndexedDB**: Local data persistence
- **Web Speech API**: Text-to-speech for audio
- **Canvas API**: Drawing and stroke capture
- **Service Workers**: PWA offline support
- **Google Fonts**: Outfit (English) + Noto Sans JP (Japanese)

---

## 📱 PWA Installation

Users can install the app to their home screen for an app-like experience:

### On Mobile (iOS/Android):
1. Open the app in a browser (Safari/Chrome)
2. Tap the share button
3. Select "Add to Home Screen"
4. The app will open in standalone mode (no browser UI)

### On Desktop:
1. Open the app in Chrome/Edge
2. Look for the install icon in the address bar
3. Click "Install"

---

## 🎨 Design Philosophy

### Kid-Friendly Principles:
1. **Large, Clear UI**: Minimum 44px tap targets, high contrast
2. **Joyful Aesthetics**: Vibrant colors, cute mascots, celebration animations
3. **Encouragement First**: Never punitive, always supportive feedback
4. **Short Sessions**: 5-10 minute daily practice recommended
5. **High Success Rate**: Adaptive difficulty, gentle evaluation

### Accessibility:
- Touch-optimized (no hover-dependent interactions)
- No flashing animations
- High color contrast
- Large, readable fonts
- Simple, clear language

---

## 🤝 Contributing

This project is designed for kids learning Japanese. If you'd like to contribute:

1. Add vocabulary words (appropriate for children)
2. Create additional cute illustrations
3. Improve the writing evaluation algorithm
4. Add new gamification features
5. Translate to additional languages

---

## 📄 License

This project is for educational purposes.

---

## 🙏 Acknowledgments

- Japanese vocabulary and kana data
- Kawaii-style illustrations generated for learning
- Space theme inspired by exploration and wonder

---

**Built with ❤️ for young language learners**

🚀✨ Happy learning! がんばって！(Ganbatte - Do your best!)
