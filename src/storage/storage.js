// Storage layer using IndexedDB for persistent data
// Manages user progress, profiles, settings, and gamification data

const DB_NAME = 'KanaSpaceDB';
const DB_VERSION = 1;

class Storage {
    constructor() {
        this.db = null;
        this.currentProfile = 'default';
    }

    // Initialize IndexedDB
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                this.loadCurrentProfile();
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Settings store
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }

                // Profiles store
                if (!db.objectStoreNames.contains('profiles')) {
                    db.createObjectStore('profiles', { keyPath: 'name' });
                }

                // Progress store (per profile)
                if (!db.objectStoreNames.contains('progress')) {
                    const progressStore = db.createObjectStore('progress', { keyPath: 'id', autoIncrement: true });
                    progressStore.createIndex('profile', 'profile', { unique: false });
                    progressStore.createIndex('wordId', 'wordId', { unique: false });
                }

                // Gamification store (per profile)
                if (!db.objectStoreNames.contains('gamification')) {
                    const gamificationStore = db.createObjectStore('gamification', { keyPath: 'profile' });
                }
            };
        });
    }

    // Get from store
    async get(storeName, key) {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Put into store
    async put(storeName, data) {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Get all from store
    async getAll(storeName) {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // === Settings ===
    async getSetting(key, defaultValue = null) {
        const setting = await this.get('settings', key);
        return setting ? setting.value : defaultValue;
    }

    async setSetting(key, value) {
        await this.put('settings', { key, value });
    }

    // === Profile Management ===
    loadCurrentProfile() {
        const saved = localStorage.getItem('currentProfile');
        if (saved) {
            this.currentProfile = saved;
        }
    }

    setCurrentProfile(profileName) {
        this.currentProfile = profileName;
        localStorage.setItem('currentProfile', profileName);
    }

    async getProfile(profileName = this.currentProfile) {
        let profile = await this.get('profiles', profileName);
        if (!profile) {
            // Create default profile
            profile = {
                name: profileName,
                createdAt: Date.now(),
                lastActiveAt: Date.now()
            };
            await this.put('profiles', profile);
        }
        return profile;
    }

    // === Gamification Data ===
    async getGamificationData(profileName = this.currentProfile) {
        let data = await this.get('gamification', profileName);
        if (!data) {
            // Initialize gamification data
            data = {
                profile: profileName,
                xp: 0,
                level: 1,
                streak: 0,
                lastPracticeDate: null,
                collectibles: [],
                missions: {}
            };
            await this.put('gamification', data);
        }
        return data;
    }

    async updateGamificationData(updates, profileName = this.currentProfile) {
        const data = await this.getGamificationData(profileName);
        const updatedData = { ...data, ...updates };
        await this.put('gamification', updatedData);
        return updatedData;
    }

    // === Progress Tracking ===
    async saveWordProgress(wordId, kanaChar, score, mode) {
        const progressEntry = {
            profile: this.currentProfile,
            wordId,
            kanaChar,
            score,
            mode,
            timestamp: Date.now()
        };
        await this.put('progress', progressEntry);
    }

    async getWordProgress(wordId) {
        const allProgress = await this.getAll('progress');
        return allProgress.filter(p => p.profile === this.currentProfile && p.wordId === wordId);
    }

    async getKanaMastery(kanaChar) {
        const allProgress = await this.getAll('progress');
        const kanaProgress = allProgress.filter(
            p => p.profile === this.currentProfile && p.kanaChar === kanaChar
        );

        if (kanaProgress.length === 0) return 0;

        // Calculate average score
        const avgScore = kanaProgress.reduce((sum, p) => sum + p.score, 0) / kanaProgress.length;
        return Math.round(avgScore);
    }

    // === Streak Management ===
    async updateStreak() {
        const gamification = await this.getGamificationData();
        const today = new Date().toDateString();
        const lastPractice = gamification.lastPracticeDate ? new Date(gamification.lastPracticeDate).toDateString() : null;

        let newStreak = gamification.streak;

        if (lastPractice === today) {
            // Already practiced today, no change
            return gamification;
        } else if (lastPractice === new Date(Date.now() - 86400000).toDateString()) {
            // Practiced yesterday, increment streak
            newStreak += 1;
        } else {
            // Streak broken, reset to 1
            newStreak = 1;
        }

        return await this.updateGamificationData({
            streak: newStreak,
            lastPracticeDate: Date.now()
        });
    }

    // === XP and Levels ===
    async addXP(amount) {
        const gamification = await this.getGamificationData();
        const newXP = gamification.xp + amount;
        const newLevel = Math.floor(newXP / 100) + 1; // Level up every 100 XP
        const leveledUp = newLevel > gamification.level;

        const updated = await this.updateGamificationData({
            xp: newXP,
            level: newLevel
        });

        return { ...updated, leveledUp };
    }

    // === Collectibles ===
    async addCollectible(collectibleId) {
        const gamification = await this.getGamificationData();
        if (!gamification.collectibles.includes(collectibleId)) {
            gamification.collectibles.push(collectibleId);
            await this.put('gamification', gamification);
        }
    }

    async hasCollectible(collectibleId) {
        const gamification = await this.getGamificationData();
        return gamification.collectibles.includes(collectibleId);
    }
}

// Export singleton instance
export const storage = new Storage();
