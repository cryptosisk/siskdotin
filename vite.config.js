// vite.config.js
export default {
  // Enable environment variables
  envPrefix: 'VITE_',
  // Log env variables during build
  define: {
    __ENV_CHECK__: JSON.stringify(process.env)
  }
}
