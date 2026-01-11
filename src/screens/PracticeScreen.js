// Practice Screen - Main learning flow with word cards and writing practice

import { i18n } from '../i18n/localization.js';
import { storage } from '../storage/storage.js';
import { wordData, getWordsByLevel } from '../data/word-data.js';
import { audioPlayer } from '../components/AudioPlayer.js';

export class PracticeScreen {
  constructor(router, mode = 'daily') {
    this.router = router;
    this.mode = mode; // 'daily' or 'custom'
    this.words = [];
    this.currentIndex = 0;
    this.kanaSet = 'hiragana';
    this.wordLevel = 'beginner';
  }

  async loadSettings() {
    this.kanaSet = await storage.getSetting('kanaSet', 'hiragana');
    this.wordLevel = await storage.getSetting('wordLevel', 'beginner');
  }

  async loadWords() {
    const allWords = getWordsByLevel(this.wordLevel);

    if (this.mode === 'daily') {
      // Daily practice: 5-10 random words
      const count = Math.min(5, allWords.length);
      this.words = this.shuffleArray(allWords).slice(0, count);
    } else {
      // Custom practice: all words at current level
      this.words = this.shuffleArray(allWords);
    }
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  render() {
    const screen = document.createElement('div');
    screen.className = 'screen p-xl';
    screen.id = 'practice-screen';
    screen.style.maxWidth = '800px';
    screen.style.margin = '0 auto';

    // Header with progress
    const header = document.createElement('div');
    header.className = 'flex items-center justify-between mb-xl';
    header.innerHTML = `
      <h2 data-i18n="practice_title">${i18n.t('practice_title')}</h2>
      <div class="text-lg">
        <span id="current-index">0</span> / <span id="total-words">0</span>
      </div>
      <button class="btn btn-icon btn-secondary" id="back-btn">←</button>
    `;

    // Word card container
    const cardContainer = document.createElement('div');
    cardContainer.id = 'word-card-container';
    cardContainer.className = 'animate-slide-up';

    screen.appendChild(header);
    screen.appendChild(cardContainer);

    return screen;
  }

  async onEnter() {
    await this.loadSettings();
    await this.loadWords();

    // Update header
    document.getElementById('total-words').textContent = this.words.length;
    document.getElementById('back-btn').onclick = () => this.router.goBack();

    // Show first word
    if (this.words.length > 0) {
      this.showCurrentWord();
    } else {
      this.showNoWords();
    }
  }

  showNoWords() {
    const container = document.getElementById('word-card-container');
    container.innerHTML = `
      <div class="card text-center p-xl">
        <h3>${i18n.t('practice_loading')}</h3>
      </div>
    `;
  }

  showCurrentWord() {
    const word = this.words[this.currentIndex];
    const container = document.getElementById('word-card-container');

    // Update progress
    document.getElementById('current-index').textContent = this.currentIndex + 1;

    // Word card
    const card = document.createElement('div');
    card.className = 'card card-gradient p-xl text-center animate-slide-up';

    // Image display
    const image = document.createElement('div');
    image.className = 'mb-lg';

    // Create img element for vocabulary image
    const img = document.createElement('img');
    img.src = `/images/${word.imageAsset}`;
    img.alt = word.english;
    img.style.width = '250px';
    img.style.height = '250px';
    img.style.objectFit = 'contain';
    img.style.margin = '0 auto';
    img.style.display = 'block';
    img.style.borderRadius = 'var(--radius-lg)';

    // Fallback: If image fails to load, show emoji based on category
    img.onerror = () => {
      const fallbackEmojis = {
        'animals': '🐾',
        'food': '🍎',
        'colors': '🎨',
        'numbers': '🔢',
        'everyday': '📦',
        'nature': '🌳',
        'body': '✋'
      };
      const emoji = fallbackEmojis[word.category] || '📖';
      img.style.display = 'none';
      const fallback = document.createElement('div');
      fallback.style.fontSize = '100px';
      fallback.textContent = emoji;
      image.appendChild(fallback);
    };

    image.appendChild(img);

    // Word details
    const details = document.createElement('div');
    details.className = 'flex-col gap-md mb-lg';

    const kanaReading = this.kanaSet === 'hiragana' ? word.hiragana : word.katakana;

    details.innerHTML = `
      <div class="text-3xl font-bold">${word.english}</div>
      <div class="text-xl text-secondary">${word.romaji}</div>
      <div class="text-kana japanese" style="font-size: 4rem;">${kanaReading}</div>
    `;

    // Audio buttons
    const audioButtons = document.createElement('div');
    audioButtons.className = 'flex gap-md justify-center mb-lg';
    audioButtons.innerHTML = `
      <button class="btn btn-secondary" id="play-english">
        🔊 <span data-i18n="practice_playEnglish">${i18n.t('practice_playEnglish')}</span>
      </button>
      <button class="btn btn-secondary" id="play-japanese">
        🔊 <span data-i18n="practice_playJapanese">${i18n.t('practice_playJapanese')}</span>
      </button>
    `;

    // Practice button
    const practiceButton = document.createElement('button');
    practiceButton.className = 'btn btn-large btn-primary';
    practiceButton.innerHTML = `✏️ <span data-i18n="practice_practiceWriting">${i18n.t('practice_practiceWriting')}</span>`;
    practiceButton.onclick = () => this.goToWriting(word, kanaReading);

    card.appendChild(image);
    card.appendChild(details);
    card.appendChild(audioButtons);
    card.appendChild(practiceButton);

    container.innerHTML = '';
    container.appendChild(card);

    // Add audio button handlers
    document.getElementById('play-english').onclick = () => {
      audioPlayer.playEnglish(word.english);
    };

    document.getElementById('play-japanese').onclick = () => {
      audioPlayer.playJapanese(kanaReading);
    };
  }

  async goToWriting(word, kanaReading) {
    const { WritingScreen } = await import('./WritingScreen.js');
    this.router.navigateTo(new WritingScreen(this.router, word, kanaReading, this.kanaSet, this));
  }

  nextWord() {
    this.currentIndex++;

    if (this.currentIndex >= this.words.length) {
      this.showComplete();
    } else {
      this.showCurrentWord();
    }
  }

  showComplete() {
    const container = document.getElementById('word-card-container');
    container.innerHTML = `
      <div class="card card-gradient text-center p-xl animate-slide-up">
        <div style="font-size: 80px;" class="mb-lg">🎉</div>
        <h2 data-i18n="practice_complete" class="mb-lg">${i18n.t('practice_complete')}</h2>
        <button class="btn btn-large btn-success" id="finish-btn">
          ${i18n.t('results_finish')}
        </button>
      </div>
    `;

    document.getElementById('finish-btn').onclick = () => this.router.goBack();
  }
}
