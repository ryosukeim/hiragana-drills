import { strings } from './strings.js';

class Localization {
    constructor() {
        this.currentLang = 'en';
        this.loadLanguage();
    }

    // Load saved language preference
    loadLanguage() {
        const saved = localStorage.getItem('appLanguage');
        if (saved && (saved === 'en' || saved === 'ja')) {
            this.currentLang = saved;
        }
    }

    // Save language preference
    saveLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('appLanguage', lang);
    }

    // Get current language
    getLang() {
        return this.currentLang;
    }

    // Set language and update UI
    setLang(lang) {
        if (lang !== 'en' && lang !== 'ja') {
            console.warn(`Unsupported language: ${lang}, defaulting to 'en'`);
            lang = 'en';
        }
        this.saveLanguage(lang);
        this.updateDOM();
    }

    // Translate a key
    t(key) {
        const translation = strings[this.currentLang][key];
        if (!translation) {
            console.warn(`Missing translation for key: ${key} in language: ${this.currentLang}`);
            return key;
        }
        return translation;
    }

    // Update all elements with data-i18n attribute
    updateDOM() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            // Update text content or placeholder
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
    }

    // Helper to create translated element
    createElement(tag, key, className = '') {
        const element = document.createElement(tag);
        element.setAttribute('data-i18n', key);
        element.textContent = this.t(key);
        if (className) {
            element.className = className;
        }
        return element;
    }
}

// Export singleton instance
export const i18n = new Localization();
