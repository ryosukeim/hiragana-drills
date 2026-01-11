import { defineConfig } from 'vite';

export default defineConfig({
  base: '/hiragana-drills/', // Set base path for GitHub Pages
  // Basic configuration - PWA can be added later
  server: {
    port: 5173
  }
});
