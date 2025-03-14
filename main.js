import Lenis from '@studio-freight/lenis';

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

// Handle video background with mobile optimization
const initializeVideo = async () => {
    try {
        const video = document.getElementById('bgVideo');
        if (!video) throw new Error('Video element not found');

        // Enhanced mobile detection including tablets
        const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        // Configure video source and settings based on device
        const videoSource = video.querySelector('source');
        if (!videoSource) throw new Error('Video source element not found');

        // Log environment variables state
        console.log('Environment state:', {
            supabaseUrl: process.env.VITE_SUPABASE_URL ? 'present' : 'missing',
            supabasePublicKey: process.env.VITE_SUPABASE_PUBLIC_KEY ? 'present' : 'missing',
            mobileUrl: process.env.VITE_VIDEO_MOBILE_URL ? 'present' : 'missing',
            desktopUrl: process.env.VITE_VIDEO_DESKTOP_URL ? 'present' : 'missing'
        });

        const mobileVideoUrl = process.env.VITE_VIDEO_MOBILE_URL;
        const desktopVideoUrl = process.env.VITE_VIDEO_DESKTOP_URL;

        if (!mobileVideoUrl || !desktopVideoUrl) {
            throw new Error(`Video URLs missing: Mobile=${!!mobileVideoUrl}, Desktop=${!!desktopVideoUrl}. Check Vercel environment variables.`);
        }

        // Debug video configuration
        console.log('Video Configuration:', {
            isMobile,
            mobileUrl: mobileVideoUrl,
            desktopUrl: desktopVideoUrl,
            currentUrl: isMobile ? mobileVideoUrl : desktopVideoUrl
        });

        // Set video source and trigger load
        videoSource.setAttribute('src', isMobile ? mobileVideoUrl : desktopVideoUrl);
        await video.load(); // Explicitly load the new source

        // Apply mobile-specific optimizations
        if (isMobile) {
            video.setAttribute('playsinline', ''); // Ensure inline playback on iOS
            video.setAttribute('preload', 'auto'); // Preload for smoother mobile experience
            video.style.objectFit = 'cover'; // Ensure proper scaling on mobile
        }

        // Enhanced video error handling and debugging
        video.addEventListener('error', (e) => {
            console.error('Video error:', {
                error: e.target.error,
                currentSrc: video.currentSrc,
                readyState: video.readyState,
                networkState: video.networkState
            });
            video.style.display = 'none';
            document.querySelector('.video-background').style.backgroundColor = '#000';
        });

        // Debug video loading states
        ['loadstart', 'loadeddata', 'canplay', 'playing', 'waiting'].forEach(event => {
            video.addEventListener(event, () => console.log(`Video: ${event}`));
        });

        // Optimize video playback and fitting
        const optimizeVideo = () => {
            const windowAspect = window.innerWidth / window.innerHeight;
            const videoAspect = video.videoWidth / video.videoHeight;

            if (windowAspect > videoAspect) {
                video.style.width = '100vw';
                video.style.height = 'auto';
            } else {
                video.style.width = 'auto';
                video.style.height = '100vh';
            }
        };

        // Handle video loading and playback
        video.addEventListener('loadedmetadata', optimizeVideo);
        window.addEventListener('resize', optimizeVideo);

        // Attempt to play the video
        try {
            await video.play();
        } catch (playError) {
            console.warn('Auto-play failed:', playError);
            const playButton = document.createElement('button');
            playButton.textContent = 'Play';
            playButton.className = 'play-button';
            document.body.appendChild(playButton);
            playButton.onclick = () => {
                video.play().catch(console.error);
                playButton.remove();
            };
        }

        // Handle video stalling
        video.addEventListener('stalled', () => {
            video.load();
            video.play().catch(console.warn);
        });

    } catch (error) {
        console.error('Video initialization error:', error);
        document.querySelector('.video-background').style.backgroundColor = '#000';
    }
};

// Morphing text effect configuration
class MorphingText {
    constructor(texts) {
        this.texts = texts;
        this.textIndex = 0;
        this.morph = 0;
        this.cooldown = 0;
        this.time = new Date();
        this.morphTime = 2.25;
        this.cooldownTime = 0.25;
        this.container = document.querySelector('.morphing-title');
        this.text1 = document.querySelector('.text1');
        this.text2 = document.querySelector('.text2');

        if (!this.text1 || !this.text2 || !this.container) {
            console.error('Morphing text elements not found');
            return;
        }

        // Initialize the first text immediately
        this.text1.textContent = this.texts[0];
        this.text2.textContent = this.texts[1];
        this.text1.style.opacity = '100%';
        this.text2.style.opacity = '0%';
        
        // Show the container after initialization
        requestAnimationFrame(() => {
            this.container.classList.add('initialized');
            this.animate = this.animate.bind(this);
            requestAnimationFrame(this.animate);
        });
    }

    setStyles(fraction) {
        // Apply blur and opacity to text2
        this.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        this.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

        // Apply blur and opacity to text1
        const invertedFraction = 1 - fraction;
        this.text1.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`;
        this.text1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;

        // Update text content only when needed
        if (fraction === 0) {
            this.text1.textContent = this.texts[this.textIndex % this.texts.length];
            this.text2.textContent = this.texts[(this.textIndex + 1) % this.texts.length];
        }
    }

    animate() {
        requestAnimationFrame(this.animate);

        const newTime = new Date();
        const dt = (newTime - this.time) / 1000;
        this.time = newTime;

        this.cooldown > 0 ? this.doCooldown(dt) : this.doMorph(dt);
    }

    doMorph(dt) {
        this.morph += dt;

        const fraction = this.morph / this.morphTime;
        if (fraction > 1) {
            this.cooldown = this.cooldownTime;
            this.textIndex++;
            this.morph = 0;
            this.setStyles(1);
            return;
        }

        this.setStyles(fraction);
    }

    doCooldown(dt) {
        this.cooldown -= dt;
        if (this.cooldown <= 0) {
            this.morph = 0;
            this.setStyles(0);
        }
    }
}

// X Posts Marquee
class XMarquee {
    constructor() {
        this.posts = [
            { text: "sisk's recent X posts:", isHeader: true },
            { text: 'imo windsurf better than cursor. thoughts?', date: 'Just now', link: 'https://x.com/mns' },
            { text: 'RT @78777473: 13', date: '2h ago', link: 'https://x.com/mns' },
            { text: 'The value of that Optimus just tripled', date: '4h ago', link: 'https://x.com/mns' },
            { text: 'everything is computer', date: '6h ago', link: 'https://x.com/mns' }
        ];
        this.init();
    }

    createPostElement(post) {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        
        if (post.isHeader) {
            postElement.textContent = post.text;
            postElement.style.fontWeight = 'bold';
            return postElement;
        }

        const link = document.createElement('a');
        link.href = post.link;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = post.text;

        const date = document.createElement('span');
        date.textContent = post.date;
        date.style.marginLeft = '0.5rem';
        date.style.opacity = '0.7';

        postElement.appendChild(link);
        postElement.appendChild(date);
        return postElement;
    }

    init() {
        const marqueeContents = document.querySelectorAll('.marquee-content');
        if (!marqueeContents.length) {
            console.error('Marquee content elements not found');
            return;
        }

        marqueeContents.forEach(content => {
            this.posts.forEach(post => {
                content.appendChild(this.createPostElement(post));
            });
        });
    }
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    // Initialize video
    initializeVideo();

    // Initialize morphing text
    new MorphingText([
        'Max Siskin',
        'Sisk',
        'Tinkerer',
        'Web Designer',
        'Writer',
        'Techno-Optimist'
    ]);

    // Initialize X posts marquee
    new XMarquee();

    // Initialize smooth scrolling
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Handle navigation clicks
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target, {
                    offset: 0,
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }
        });
    });
});
