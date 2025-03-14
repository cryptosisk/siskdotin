// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // Enable environment variables
  envPrefix: 'VITE_',
  // Configure server
  server: {
    watch: {
      usePolling: true
    },
    hmr: {
      overlay: true
    }
  },
  // Configure build
  build: {
    sourcemap: true,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
});
