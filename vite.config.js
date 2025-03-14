// vite.config.js
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
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
  },
  // Define environment variables
  define: {
    'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
    'process.env.VITE_SUPABASE_PUBLIC_KEY': JSON.stringify(env.VITE_SUPABASE_PUBLIC_KEY),
    'process.env.VITE_VIDEO_DESKTOP_URL': JSON.stringify(env.VITE_VIDEO_DESKTOP_URL),
    'process.env.VITE_VIDEO_MOBILE_URL': JSON.stringify(env.VITE_VIDEO_MOBILE_URL)
  }
  };
});
