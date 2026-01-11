// Audio player using Web Speech API for text-to-speech

export class AudioPlayer {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.loadVoices();

        // Load voices when they become available
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this.loadVoices();
        }
    }

    loadVoices() {
        this.voices = this.synth.getVoices();
    }

    // Get best voice for language
    getVoice(lang) {
        // Prefer voices that match the language
        const matchingVoices = this.voices.filter(voice => voice.lang.startsWith(lang));

        if (matchingVoices.length > 0) {
            // Prefer non-system voices if available
            const nonSystem = matchingVoices.find(v => !v.localService);
            return nonSystem || matchingVoices[0];
        }

        // Fallback to first available voice
        return this.voices[0];
    }

    // Play English text
    playEnglish(text) {
        return this.speak(text, 'en-US');
    }

    // Play Japanese text
    playJapanese(text) {
        return this.speak(text, 'ja-JP');
    }

    // Generic speak function
    speak(text, lang) {
        return new Promise((resolve, reject) => {
            // Cancel any ongoing speech
            this.synth.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = 0.9; // Slightly slower for kids
            utterance.pitch = 1.1; // Slightly higher pitch (friendly)

            const voice = this.getVoice(lang);
            if (voice) {
                utterance.voice = voice;
            }

            utterance.onend = () => resolve();
            utterance.onerror = (error) => {
                console.error('Speech synthesis error:', error);
                reject(error);
            };

            this.synth.speak(utterance);
        });
    }

    // Stop current speech
    stop() {
        this.synth.cancel();
    }
}

// Export singleton
export const audioPlayer = new AudioPlayer();
