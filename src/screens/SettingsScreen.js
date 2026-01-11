// Settings Screen - Configure app preferences

import { i18n } from '../i18n/localization.js';
import { storage } from '../storage/storage.js';

export class SettingsScreen {
    constructor(router) {
        this.router = router;
        this.settings = {
            kanaSet: 'hiragana',
            wordLevel: 'beginner',
            hintMode: 'normal',
            appLanguage: 'en'
        };
    }

    async loadSettings() {
        this.settings.kanaSet = await storage.getSetting('kanaSet', 'hiragana');
        this.settings.wordLevel = await storage.getSetting('wordLevel', 'beginner');
        this.settings.hintMode = await storage.getSetting('hintMode', 'normal');
        this.settings.appLanguage = i18n.getLang();
    }

    async saveSettings() {
        await storage.setSetting('kanaSet', this.settings.kanaSet);
        await storage.setSetting('wordLevel', this.settings.wordLevel);
        await storage.setSetting('hintMode', this.settings.hintMode);
        i18n.setLang(this.settings.appLanguage);
    }

    render() {
        const screen = document.createElement('div');
        screen.className = 'screen p-xl';
        screen.style.maxWidth = '600px';
        screen.style.margin = '0 auto';

        // Header
        const header = document.createElement('div');
        header.className = 'flex items-center justify-between mb-xl';
        header.innerHTML = `
      <h1 data-i18n="settings_title">${i18n.t('settings_title')}</h1>
      <button class="btn btn-icon btn-secondary" id="back-btn">←</button>
    `;

        // Settings form
        const form = document.createElement('div');
        form.className = 'flex-col gap-lg';

        // Kana Set
        const kanaSetSection = this.createToggleSection(
            'settings_kanaSet',
            ['settings_hiragana', 'settings_katakana'],
            ['hiragana', 'katakana'],
            this.settings.kanaSet,
            (value) => { this.settings.kanaSet = value; this.saveSettings(); }
        );

        // Word Level
        const wordLevelSection = this.createToggleSection(
            'settings_wordLevel',
            ['settings_beginner', 'settings_intermediate', 'settings_advanced'],
            ['beginner', 'intermediate', 'advanced'],
            this.settings.wordLevel,
            (value) => { this.settings.wordLevel = value; this.saveSettings(); }
        );

        // Hint Mode
        const hintModeSection = this.createToggleSection(
            'settings_hintMode',
            ['settings_easy', 'settings_normal', 'settings_hard'],
            ['easy', 'normal', 'hard'],
            this.settings.hintMode,
            (value) => { this.settings.hintMode = value; this.saveSettings(); }
        );

        // App Language
        const languageSection = this.createToggleSection(
            'settings_appLanguage',
            ['settings_english', 'settings_japanese'],
            ['en', 'ja'],
            this.settings.appLanguage,
            (value) => {
                this.settings.appLanguage = value;
                this.saveSettings();
                // Reload screen to update translations
                setTimeout(() => {
                    const { SettingsScreen } = require('./SettingsScreen.js');
                    this.router.navigateTo(new SettingsScreen(this.router));
                }, 100);
            }
        );

        form.appendChild(kanaSetSection);
        form.appendChild(wordLevelSection);
        form.appendChild(hintModeSection);
        form.appendChild(languageSection);

        screen.appendChild(header);
        screen.appendChild(form);

        return screen;
    }

    createToggleSection(titleKey, optionKeys, optionValues, currentValue, onChange) {
        const section = document.createElement('div');
        section.className = 'card p-lg';

        const title = document.createElement('h3');
        title.className = 'mb-md text-lg';
        title.setAttribute('data-i18n', titleKey);
        title.textContent = i18n.t(titleKey);

        const toggleGroup = document.createElement('div');
        toggleGroup.className = 'flex gap-sm';
        toggleGroup.style.flexWrap = 'wrap';

        optionKeys.forEach((key, index) => {
            const value = optionValues[index];
            const button = document.createElement('button');
            button.className = value === currentValue ? 'btn btn-primary' : 'btn btn-secondary';
            button.setAttribute('data-i18n', key);
            button.textContent = i18n.t(key);
            button.style.flex = '1';
            button.style.minWidth = '120px';

            button.onclick = () => {
                // Update all buttons in this group
                Array.from(toggleGroup.children).forEach(btn => {
                    btn.className = 'btn btn-secondary';
                });
                button.className = 'btn btn-primary';
                onChange(value);
            };

            toggleGroup.appendChild(button);
        });

        section.appendChild(title);
        section.appendChild(toggleGroup);

        return section;
    }

    async onEnter() {
        await this.loadSettings();

        // Add back button handler
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.onclick = () => this.router.goBack();
        }
    }
}
