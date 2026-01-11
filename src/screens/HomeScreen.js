// Home Screen - Landing page with main navigation

import { i18n } from '../i18n/localization.js';
import { storage } from '../storage/storage.js';

export class HomeScreen {
    constructor(router) {
        this.router = router;
        this.gamificationData = null;
    }

    async loadData() {
        this.gamificationData = await storage.getGamificationData();
    }

    render() {
        const screen = document.createElement('div');
        screen.className = 'screen flex-col items-center justify-center gap-xl p-xl';
        screen.style.minHeight = '100vh';

        // Title with mascot
        const titleSection = document.createElement('div');
        titleSection.className = 'text-center mb-xl';
        titleSection.innerHTML = `
      <div class="mascot-container mb-md animate-float">
        <div style="font-size: 120px;">🚀</div>
      </div>
      <h1 data-i18n="home_title" class="text-primary mb-md">${i18n.t('home_title')}</h1>
    `;

        // Stats display
        const statsSection = document.createElement('div');
        statsSection.className = 'flex gap-lg mb-xl';
        statsSection.innerHTML = `
      <div class="card flex-col items-center gap-sm p-lg">
        <div style="font-size: 32px;">🔥</div>
        <div class="text-2xl font-bold">${this.gamificationData?.streak || 0}</div>
        <div class="text-sm text-secondary" data-i18n="home_streak">${i18n.t('home_streak')}</div>
      </div>
      <div class="card flex-col items-center gap-sm p-lg">
        <div style="font-size: 32px;">⭐</div>
        <div class="text-2xl font-bold">${this.gamificationData?.level || 1}</div>
        <div class="text-sm text-secondary" data-i18n="home_level">${i18n.t('home_level')}</div>
      </div>
    `;

        // Main action buttons
        const buttonsSection = document.createElement('div');
        buttonsSection.className = 'flex-col gap-md';
        buttonsSection.style.width = '100%';
        buttonsSection.style.maxWidth = '400px';

        const dailyPracticeBtn = this.createButton('home_dailyPractice', '⭐', () => this.startDailyPractice());
        const practiceBtn = this.createButton('home_practice', '📝', () => this.goToPractice());
        const progressBtn = this.createButton('home_progress', '📊', () => this.goToProgress());
        const settingsBtn = this.createButton('home_settings', '⚙️', () => this.goToSettings());

        buttonsSection.appendChild(dailyPracticeBtn);
        buttonsSection.appendChild(practiceBtn);
        buttonsSection.appendChild(progressBtn);
        buttonsSection.appendChild(settingsBtn);

        screen.appendChild(titleSection);
        screen.appendChild(statsSection);
        screen.appendChild(buttonsSection);

        return screen;
    }

    createButton(textKey, emoji, onClick) {
        const button = document.createElement('button');
        button.className = 'btn btn-large';
        button.innerHTML = `
      <span style="font-size: 28px;">${emoji}</span>
      <span data-i18n="${textKey}">${i18n.t(textKey)}</span>
    `;
        button.onclick = onClick;
        return button;
    }

    async onEnter() {
        await this.loadData();
        // Update the stats after data loads
        const statsDiv = document.querySelectorAll('.card .text-2xl');
        if (statsDiv.length >= 2) {
            statsDiv[0].textContent = this.gamificationData?.streak || 0;
            statsDiv[1].textContent = this.gamificationData?.level || 1;
        }
    }

    async startDailyPractice() {
        const { PracticeScreen } = await import('./PracticeScreen.js');
        this.router.navigateTo(new PracticeScreen(this.router, 'daily'));
    }

    async goToPractice() {
        const { PracticeScreen } = await import('./PracticeScreen.js');
        this.router.navigateTo(new PracticeScreen(this.router, 'custom'));
    }

    async goToProgress() {
        const { ProgressScreen } = await import('./ProgressScreen.js');
        this.router.navigateTo(new ProgressScreen(this.router));
    }

    async goToSettings() {
        const { SettingsScreen } = await import('./SettingsScreen.js');
        this.router.navigateTo(new SettingsScreen(this.router));
    }
}
