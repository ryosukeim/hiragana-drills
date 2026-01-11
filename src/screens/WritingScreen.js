// WritingScreen.js
// Supports writing multiple characters on one screen simultaneously

import { i18n } from '../i18n/localization.js';
import { storage } from '../storage/storage.js';
import { StrokeCapture } from '../evaluation/stroke-capture.js';
import { templateMatcher } from '../evaluation/template-matcher.js';
import { audioPlayer } from '../components/AudioPlayer.js';
import { getKanaByChar } from '../data/kana-data.js';

export class WritingScreen {
  constructor(router, word, kanaReading, kanaSet, practiceScreen) {
    this.router = router;
    this.word = word;
    this.kanaReading = kanaReading; // e.g. "neko" -> "ねこ"
    this.kanaSet = kanaSet;
    this.practiceScreen = practiceScreen;
    this.mode = 'trace'; // 'trace' or 'freeWrite'

    // Array to hold capture instances for each character
    this.captures = [];
    this.hintMode = 'normal';
  }

  async loadSettings() {
    this.hintMode = await storage.getSetting('hintMode', 'normal');
  }

  render() {
    const screen = document.createElement('div');
    screen.className = 'screen p-md';
    screen.style.maxWidth = '1000px'; // Wider to fit multiple chars
    screen.style.margin = '0 auto';

    // Header
    const header = document.createElement('div');
    header.className = 'flex items-center justify-between mb-md';
    header.innerHTML = `
      <h2 data-i18n="writing_title">${i18n.t('writing_title')}</h2>
      <button class="btn btn-icon btn-secondary" id="back-btn">←</button>
    `;

    // Word reference
    const wordRef = document.createElement('div');
    wordRef.className = 'card card-gradient p-sm mb-md text-center';
    wordRef.innerHTML = `
      <div class="flex items-center justify-center gap-md">
        <div class="text-xl font-bold">${this.word.english}</div>
        <div class="text-lg text-secondary">(${this.word.romaji})</div>
        <button class="btn btn-icon btn-secondary" id="replay-audio">🔊</button>
      </div>
    `;

    // Mode toggle
    const modeToggle = document.createElement('div');
    modeToggle.className = 'flex gap-sm mb-md justify-center';
    modeToggle.innerHTML = `
      <button class="btn btn-primary" id="trace-mode-btn" style="width: 120px;">
        <span data-i18n="writing_trace">${i18n.t('writing_trace')}</span>
      </button>
      <button class="btn btn-secondary" id="freewrite-mode-btn" style="width: 120px;">
        <span data-i18n="writing_freeWrite">${i18n.t('writing_freeWrite')}</span>
      </button>
    `;

    // Canvases Container
    const canvasesContainer = document.createElement('div');
    canvasesContainer.className = 'flex flex-wrap justify-center gap-md mb-lg';
    canvasesContainer.id = 'canvases-container';

    // Generate a canvas for each character
    const chars = this.kanaReading.split('');
    chars.forEach((char, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'flex-col items-center';

      // Character label
      const label = document.createElement('div');
      label.className = 'text-lg font-bold mb-xs text-center';
      label.innerText = (index + 1);

      // Canvas wrapper card
      const card = document.createElement('div');
      card.className = 'card p-xs';
      card.style.background = 'var(--bg-card)';

      const canvas = document.createElement('canvas');
      canvas.id = `writing-canvas-${index}`;
      // Responsive size: smaller on mobile, larger on desktop
      // We'll use CSS classes or fixed responsive size for simplicity
      // Approx 250px is good for writing a single char
      canvas.width = 250;
      canvas.height = 250;
      canvas.style.width = '250px';
      canvas.style.height = '250px';
      canvas.style.background = 'var(--color-space-deep)';
      canvas.style.borderRadius = 'var(--radius-sm)';
      canvas.style.cursor = 'crosshair';
      canvas.style.touchAction = 'none';
      canvas.style.border = '2px solid var(--border-color)';

      card.appendChild(canvas);

      // Individual feedback/score area
      const feedback = document.createElement('div');
      feedback.id = `feedback-${index}`;
      feedback.style.height = '20px'; // Placeholder height
      feedback.className = 'text-center mt-xs text-sm font-bold';

      wrapper.appendChild(label);
      wrapper.appendChild(card);
      wrapper.appendChild(feedback);
      canvasesContainer.appendChild(wrapper);
    });

    // Action buttons
    const actions = document.createElement('div');
    actions.className = 'flex gap-md justify-center';
    actions.innerHTML = `
      <button class="btn btn-secondary" id="clear-btn">
        🗑️ <span data-i18n="writing_clear">${i18n.t('writing_clear')}</span>
      </button>
      <button class="btn btn-primary btn-large" id="submit-btn" style="min-width: 200px;">
        ✓ <span data-i18n="writing_submit">${i18n.t('writing_submit')}</span>
      </button>
    `;

    screen.appendChild(header);
    screen.appendChild(wordRef);
    screen.appendChild(modeToggle);
    screen.appendChild(canvasesContainer);
    screen.appendChild(actions);

    return screen;
  }

  async onEnter() {
    await this.loadSettings();

    // Initialize captures for each canvas
    this.captures = [];
    const chars = this.kanaReading.split('');

    chars.forEach((char, index) => {
      const canvas = document.getElementById(`writing-canvas-${index}`);
      // Explicitly set dimensions to avoid scaling issues
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const capture = new StrokeCapture(canvas);
      this.captures.push({
        instance: capture,
        char: char,
        index: index
      });
    });

    // Set initial mode & guides
    this.setMode('trace');

    // Event handlers
    document.getElementById('back-btn').onclick = () => this.router.goBack();
    document.getElementById('replay-audio').onclick = () => {
      audioPlayer.playJapanese(this.kanaReading);
    };
    document.getElementById('trace-mode-btn').onclick = () => this.setMode('trace');
    document.getElementById('freewrite-mode-btn').onclick = () => this.setMode('freeWrite');

    document.getElementById('clear-btn').onclick = () => this.clearAll();
    document.getElementById('submit-btn').onclick = () => this.submitAll();
  }

  setMode(mode) {
    this.mode = mode;

    // Update button styles
    const traceBtn = document.getElementById('trace-mode-btn');
    const freeWriteBtn = document.getElementById('freewrite-mode-btn');

    if (mode === 'trace') {
      traceBtn.className = 'btn btn-primary';
      freeWriteBtn.className = 'btn btn-secondary';
    } else {
      traceBtn.className = 'btn btn-secondary';
      freeWriteBtn.className = 'btn btn-primary';
    }

    this.clearAll();
  }

  clearAll() {
    this.captures.forEach(item => {
      item.instance.clear();
      // Clear feedback
      const fb = document.getElementById(`feedback-${item.index}`);
      if (fb) fb.innerText = '';

      if (this.mode === 'trace') {
        item.instance.drawGuide(item.char);
      }
    });
  }

  async submitAll() {
    let totalScore = 0;
    let allPassed = true;
    let completedCount = 0;
    const results = [];

    // Evaluate each character
    for (const item of this.captures) {
      const strokes = item.instance.getStrokes();
      const feedbackEl = document.getElementById(`feedback-${item.index}`);

      // Skip empty canvases? No, we should mark them as 0 or ask to fill
      if (strokes.length === 0) {
        feedbackEl.innerHTML = '<span style="color:red">Empty!</span>';
        feedbackEl.className = 'text-center mt-xs text-sm font-bold animate-shake';
        allPassed = false;
        continue;
      }

      completedCount++;

      // Evaluate
      const normalized = item.instance.normalizeStrokes();
      const smoothed = item.instance.smoothStrokes(normalized);

      const kanaData = getKanaByChar(item.char, this.kanaSet === 'katakana');
      const expectedStrokes = kanaData ? kanaData.strokes : 0;

      const result = templateMatcher.evaluate(smoothed, item.char, expectedStrokes);
      results.push(result);

      totalScore += result.score;

      // Visual feedback per char
      if (result.score >= 50) {
        feedbackEl.innerHTML = `<span style="color:var(--color-success)">Good! (${Math.round(result.score)})</span>`;
        // Save progress per char
        await storage.saveWordProgress(this.word.id, item.char, result.score, this.mode);
      } else {
        feedbackEl.innerHTML = `<span style="color:orange">Try again (${Math.round(result.score)})</span>`;
        allPassed = false; // Even one failure means no perfect pass
      }
    }

    if (completedCount < this.captures.length) {
      // Not all filled
      // alert('Please write all characters!');
      return;
    }

    // Aggregate
    const avgScore = Math.round(totalScore / this.captures.length);

    // Show result screen if overall performance is decent or just finish
    if (allPassed || avgScore >= 50) { // Lenient pass: if average is good
      await this.finishWord(avgScore);
    } else {
      // Maybe allow retry without leaving
      // alert('Some characters need improvement. Try again!');
    }
  }

  async finishWord(avgScore) {
    const totalXP = Math.round(avgScore * this.captures.length / 2);

    await storage.updateStreak();
    const gamificationResult = await storage.addXP(totalXP);

    const compositeResult = {
      score: avgScore,
      feedback: "Great job practicing the whole word!",
      match: avgScore >= 60
    };

    const { ResultsScreen } = await import('./ResultsScreen.js');
    this.router.navigateTo(new ResultsScreen(
      this.router,
      compositeResult, // Use composite
      totalXP,
      gamificationResult.leveledUp,
      gamificationResult.level,
      this.practiceScreen
    ));
  }
}
