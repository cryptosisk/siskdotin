// Check both import.meta.env and process.env
console.log('Environment check:', {
    'import.meta.env': {
        VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'present' : 'missing',
        VITE_SUPABASE_PUBLIC_KEY: import.meta.env.VITE_SUPABASE_PUBLIC_KEY ? 'present' : 'missing',
        VITE_VIDEO_DESKTOP_URL: import.meta.env.VITE_VIDEO_DESKTOP_URL ? 'present' : 'missing',
        VITE_VIDEO_MOBILE_URL: import.meta.env.VITE_VIDEO_MOBILE_URL ? 'present' : 'missing',
        mode: import.meta.env.MODE
    },
    'process.env': {
        VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ? 'present' : 'missing',
        VITE_SUPABASE_PUBLIC_KEY: process.env.VITE_SUPABASE_PUBLIC_KEY ? 'present' : 'missing',
        VITE_VIDEO_DESKTOP_URL: process.env.VITE_VIDEO_DESKTOP_URL ? 'present' : 'missing',
        VITE_VIDEO_MOBILE_URL: process.env.VITE_VIDEO_MOBILE_URL ? 'present' : 'missing',
        NODE_ENV: process.env.NODE_ENV
    }
});
