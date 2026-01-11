// Simple client-side router for screen navigation

class Router {
    constructor() {
        this.currentScreen = null;
        this.container = null;
    }

    init(containerElement) {
        this.container = containerElement;
    }

    navigateTo(screen) {
        if (this.currentScreen && this.currentScreen.onLeave) {
            this.currentScreen.onLeave();
        }

        this.currentScreen = screen;
        this.container.innerHTML = '';

        if (screen.render) {
            const element = screen.render();
            this.container.appendChild(element);

            if (screen.onEnter) {
                screen.onEnter();
            }
        }
    }

    goBack() {
        // Simple back navigation - in a real app you'd maintain history
        // For now, just go to home
        import('./screens/HomeScreen.js').then(module => {
            this.navigateTo(new module.HomeScreen(this));
        });
    }
}

export const router = new Router();
