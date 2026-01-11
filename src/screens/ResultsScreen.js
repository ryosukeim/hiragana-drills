// Results Screen - Display writing evaluation feedback and rewards

import { i18n } from '../i18n/localization.js';

export class ResultsScreen {
    constructor(router, evaluationResult, xpEarned, leveledUp, newLevel, practiceScreen) {
        this.router = router;
        this.result = evaluationResult;
        this.xpEarned = xpEarned;
        this.leveledUp = leveledUp;
        this.newLevel = newLevel;
        this.practiceScreen = practiceScreen;
    }

    render() {
        const screen = document.createElement('div');
        screen.className = 'screen p-xl flex-col items-center justify-center';
        screen.style.minHeight = '100vh';

        // Celebration animation
        if (this.result.score >= 70) {
            this.createConfetti();
        }

        // Results card
        const card = document.createElement('div');
        card.className = 'card card-gradient p-xl text-center animate-slide-up';
        card.style.maxWidth = '500px';

        // Emoji and title based on score
        const emoji = this.getEmojiForScore(this.result.score);
        const titleKey = this.getTitleKeyForScore(this.result.score);

        card.innerHTML = `
      <div style="font-size: 100px;" class="mb-lg animate-bounce">${emoji}</div>
      <h2 data-i18n="${titleKey}" class="mb-lg">${i18n.t(titleKey)}</h2>
      
      <!-- Score display -->
      <div class="mb-xl">
        <div class="text-huge font-bold" style="color: var(--color-star-yellow);">${this.result.score}</div>
        <div class="text-lg text-secondary" data-i18n="results_score">${i18n.t('results_score')}</div>
      </div>
      
      <!-- Feedback message -->
      <div class="card p-lg mb-lg" style="background: rgba(255, 255, 255, 0.1);">
        <p data-i18n="${this.result.feedback}" class="text-lg">${i18n.t(this.result.feedback)}</p>
      </div>
      
      <!-- XP earned -->
      <div class="flex items-center justify-center gap-md mb-lg">
        <span style="font-size: 28px;">⭐</span>
        <span class="text-xl">+${this.xpEarned}</span>
        <span class="text-md text-secondary" data-i18n="results_xpEarned">${i18n.t('results_xpEarned')}</span>
      </div>
    `;

        // Level up notification
        if (this.leveledUp) {
            const levelUpBanner = document.createElement('div');
            levelUpBanner.className = 'card p-lg mb-lg animate-pulse';
            levelUpBanner.style.background = 'var(--gradient-success)';
            levelUpBanner.style.color = 'var(--color-space-dark)';
            levelUpBanner.innerHTML = `
        <div class="flex items-center justify-center gap-md">
          <span style="font-size: 32px;">🎉</span>
          <div>
            <div class="font-bold text-xl" data-i18n="results_newLevel">${i18n.t('results_newLevel')}</div>
            <div class="text-lg">${i18n.t('progress_level')} ${this.newLevel}</div>
          </div>
        </div>
      `;
            card.appendChild(levelUpBanner);
        }

        // Action buttons
        const actions = document.createElement('div');
        actions.className = 'flex gap-md mt-lg';
        actions.style.width = '100%';

        if (this.result.score < 70) {
            // Try again button for low scores
            actions.innerHTML = `
        <button class="btn btn-secondary" id="try-again-btn" style="flex: 1;">
          🔄 <span data-i18n="writing_tryAgain">${i18n.t('writing_tryAgain')}</span>
        </button>
        <button class="btn btn-primary" id="next-btn" style="flex: 1;">
          → <span data-i18n="results_next">${i18n.t('results_next')}</span>
        </button>
      `;
        } else {
            // Just next button for good scores
            actions.innerHTML = `
        <button class="btn btn-large btn-success" id="next-btn" style="width: 100%;">
          → <span data-i18n="results_next">${i18n.t('results_next')}</span>
        </button>
      `;
        }

        card.appendChild(actions);
        screen.appendChild(card);

        return screen;
    }

    onEnter() {
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            nextBtn.onclick = () => {
                // Go back to practice screen and show next word
                this.router.navigateTo(this.practiceScreen);
                this.practiceScreen.nextWord();
            };
        }

        const tryAgainBtn = document.getElementById('try-again-btn');
        if (tryAgainBtn) {
            tryAgainBtn.onclick = () => {
                this.router.goBack(); // Go back to writing screen
            };
        }
    }

    getEmojiForScore(score) {
        if (score >= 90) return '🌟';
        if (score >= 80) return '⭐';
        if (score >= 70) return '😊';
        if (score >= 60) return '👍';
        return '💪';
    }

    getTitleKeyForScore(score) {
        if (score >= 90) return 'results_awesome';
        if (score >= 80) return 'results_great';
        if (score >= 70) return 'results_good';
        return 'results_tryAgain';
    }

    createConfetti() {
        const colors = ['#ffd93d', '#ff6b9d', '#6bcfff', '#6fff6f'];

        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                document.body.appendChild(confetti);

                setTimeout(() => confetti.remove(), 3000);
            }, i * 50);
        }
    }
}
