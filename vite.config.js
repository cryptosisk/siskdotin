// vite.config.js
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Enable environment variables
    envPrefix: 'VITE_',
    // Make env variables available
    define: {
      __ENV__: JSON.stringify(env)
    },
    // Log configuration
    server: {
      watch: {
        ignored: ['!**/node_modules/**']
      }
    }
  };
});
