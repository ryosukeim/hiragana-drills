// Progress Screen - Display user achievements and statistics

import { i18n } from '../i18n/localization.js';
import { storage } from '../storage/storage.js';
import { hiraganaData, katakanaData } from '../data/kana-data.js';

export class ProgressScreen {
    constructor(router) {
        this.router = router;
        this.gamificationData = null;
    }

    async loadData() {
        this.gamificationData = await storage.getGamificationData();
    }

    render() {
        const screen = document.createElement('div');
        screen.className = 'screen p-xl';
        screen.style.maxWidth = '900px';
        screen.style.margin = '0 auto';

        // Header
        const header = document.createElement('div');
        header.className = 'flex items-center justify-between mb-xl';
        header.innerHTML = `
      <h1 data-i18n="progress_title">${i18n.t('progress_title')}</h1>
      <button class="btn btn-icon btn-secondary" id="back-btn">←</button>
    `;

        // Stats cards
        const statsGrid = document.createElement('div');
        statsGrid.className = 'flex gap-md mb-xl';
        statsGrid.style.flexWrap = 'wrap';

        const streak = this.gamificationData?.streak || 0;
        const level = this.gamificationData?.level || 1;
        const xp = this.gamificationData?.xp || 0;
        const nextLevelXP = level * 100;
        const xpProgress = ((xp % 100) / 100) * 100;

        statsGrid.innerHTML = `
      <!-- Streak Card -->
      <div class="card flex-col items-center gap-sm p-lg" style="flex: 1; min-width: 200px;">
        <div style="font-size: 48px;">🔥</div>
        <div class="text-3xl font-bold">${streak}</div>
        <div class="text-md text-secondary">
          <span data-i18n="progress_streak">${i18n.t('progress_streak')}</span>
          <span data-i18n="progress_days">${i18n.t('progress_days')}</span>
        </div>
      </div>
      
      <!-- Level Card -->
      <div class="card flex-col items-center gap-sm p-lg" style="flex: 1; min-width: 200px;">
        <div style="font-size: 48px;">⭐</div>
        <div class="text-3xl font-bold" data-i18n="progress_level">${i18n.t('progress_level')} ${level}</div>
        <div class="text-md text-secondary">${xp} XP</div>
        <div class="progress-bar mt-sm" style="width: 100%;">
          <div class="progress-fill" style="width: ${xpProgress}%;"></div>
        </div>
        <div class="text-sm text-muted">${xp % 100} / 100 XP</div>
      </div>
    `;

        // Kana Mastery Section
        const kanaMasterySection = document.createElement('div');
        kanaMasterySection.className = 'card p-lg mb-xl';

        const kanaMasteryTitle = document.createElement('h2');
        kanaMasteryTitle.className = 'mb-md';
        kanaMasteryTitle.setAttribute('data-i18n', 'progress_kanaMastery');
        kanaMasteryTitle.textContent = i18n.t('progress_kanaMastery');

        const kanaMasteryGrid = document.createElement('div');
        kanaMasteryGrid.className = 'kana-mastery-grid';
        kanaMasteryGrid.id = 'kana-mastery-grid';
        kanaMasteryGrid.style.display = 'grid';
        kanaMasteryGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(60px, 1fr))';
        kanaMasteryGrid.style.gap = 'var(--space-sm)';

        kanaMasterySection.appendChild(kanaMasteryTitle);
        kanaMasterySection.appendChild(kanaMasteryGrid);

        // Collectibles Section
        const collectiblesSection = document.createElement('div');
        collectiblesSection.className = 'card p-lg';

        const collectiblesTitle = document.createElement('h2');
        collectiblesTitle.className = 'mb-md';
        collectiblesTitle.setAttribute('data-i18n', 'progress_collectibles');
        collectiblesTitle.textContent = i18n.t('progress_collectibles');

        const collectiblesGrid = document.createElement('div');
        collectiblesGrid.style.display = 'grid';
        collectiblesGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(80px, 1fr))';
        collectiblesGrid.style.gap = 'var(--space-md)';

        const collectibles = ['🪐', '🌟', '🚀', '👽', '🌙', '☄️', '🛸', '🌈'];
        const earned = this.gamificationData?.collectibles || [];

        collectibles.forEach((emoji, i) => {
            const item = document.createElement('div');
            item.className = 'card text-center p-md';
            item.style.opacity = earned.includes(`collectible_${i}`) ? '1' : '0.3';
            item.innerHTML = `<div style="font-size: 48px;">${emoji}</div>`;
            collectiblesGrid.appendChild(item);
        });

        collectiblesSection.appendChild(collectiblesTitle);
        collectiblesSection.appendChild(collectiblesGrid);

        screen.appendChild(header);
        screen.appendChild(statsGrid);
        screen.appendChild(kanaMasterySection);
        screen.appendChild(collectiblesSection);

        return screen;
    }

    async onEnter() {
        await this.loadData();

        // Add back button handler
        document.getElementById('back-btn').onclick = () => this.router.goBack();

        // Load kana mastery
        await this.loadKanaMastery();
    }

    async loadKanaMastery() {
        const grid = document.getElementById('kana-mastery-grid');
        if (!grid) return;

        const kanaSet = await storage.getSetting('kanaSet', 'hiragana');
        const kanaData = kanaSet === 'hiragana' ? hiraganaData : katakanaData;

        for (const kana of kanaData) {
            const mastery = await storage.getKanaMastery(kana.char);

            const item = document.createElement('div');
            item.className = 'card text-center p-sm';
            item.style.position = 'relative';

            // Color based on mastery
            let bgColor = 'rgba(255, 255, 255, 0.05)';
            if (mastery >= 80) bgColor = 'rgba(111, 255, 111, 0.2)';
            else if (mastery >= 60) bgColor = 'rgba(255, 211, 61, 0.2)';
            else if (mastery > 0) bgColor = 'rgba(255, 107, 157, 0.2)';

            item.style.background = bgColor;

            item.innerHTML = `
        <div class="japanese text-xl">${kana.char}</div>
        ${mastery > 0 ? `<div class="text-xs text-muted">${mastery}</div>` : ''}
      `;

            grid.appendChild(item);
        }
    }
}
