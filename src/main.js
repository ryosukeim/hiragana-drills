// Main application entry point

import { router } from './router.js';
import { storage } from './storage/storage.js';
import { i18n } from './i18n/localization.js';
import { HomeScreen } from './screens/HomeScreen.js';

async function initApp() {
    try {
        // Initialize storage
        await storage.init();

        // Initialize router
        const container = document.getElementById('screen-container');
        router.init(container);

        // Load initial screen
        const homeScreen = new HomeScreen(router);
        router.navigateTo(homeScreen);

        console.log('🚀 Kana Space Adventure initialized!');
    } catch (error) {
        console.error('Failed to initialize app:', error);

        // Show error message
        const container = document.getElementById('screen-container');
        container.innerHTML = `
      <div class="card card-gradient text-center p-xl" style="margin: 20px;">
        <h2>Oops! Something went wrong</h2>
        <p>Please refresh the page to try again.</p>
        <p class="text-sm text-muted mt-md">${error.message}</p>
      </div>
    `;
    }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
