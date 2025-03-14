// Handle video background with mobile optimization
const video = document.getElementById('bgVideo');

// Enhanced mobile detection including tablets
const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// Configure video source and settings based on device
const videoSource = video.querySelector('source');
const mobileVideoUrl = import.meta.env.VITE_VIDEO_MOBILE_URL;
const desktopVideoUrl = import.meta.env.VITE_VIDEO_DESKTOP_URL;

// Verify environment variables
console.log('Environment check:', {
    isMobile,
    videoSource: isMobile ? mobileVideoUrl : desktopVideoUrl
});

videoSource.src = isMobile ? mobileVideoUrl : desktopVideoUrl;

// Apply mobile-specific optimizations
if (isMobile) {
    video.setAttribute('playsinline', ''); // Ensure inline playback on iOS
    video.setAttribute('preload', 'auto'); // Preload for smoother mobile experience
    video.style.objectFit = 'cover'; // Ensure proper scaling on mobile
}

// Load video with error handling
try {
    video.load();
} catch (e) {
    console.warn('Video loading failed:', e);
    // Fallback to static background if video fails
    video.style.display = 'none';
    document.querySelector('.video-background').style.backgroundColor = '#000';
}

// Optimize video playback and fitting
const optimizeVideo = () => {
  const windowAspect = window.innerWidth / window.innerHeight;
  const videoAspect = video.videoWidth / video.videoHeight;

  // Ensure video always covers the full viewport
  if (windowAspect > videoAspect) {
    const scale = window.innerWidth / video.videoWidth;
    video.style.width = '100vw';
    video.style.height = 'auto';
  } else {
    const scale = window.innerHeight / video.videoHeight;
    video.style.width = 'auto';
    video.style.height = '100vh';
  }
};

// Handle video loading and playback
video.addEventListener('loadedmetadata', optimizeVideo);
window.addEventListener('resize', optimizeVideo);

// Ensure video plays properly
video.addEventListener('loadeddata', () => {
  video.play().catch(e => {
    console.warn('Auto-play failed:', e);
    // Add play button if autoplay fails
    const playButton = document.createElement('button');
    playButton.textContent = 'Play';
    playButton.className = 'play-button';
    document.body.appendChild(playButton);
    playButton.onclick = () => {
      video.play();
      playButton.remove();
    };
  });
});

// Handle video stalling
video.addEventListener('stalled', () => {
  video.load();
  video.play().catch(console.warn);
});

// Morphing text effect configuration
const MORPH_TIME = 2.25;
const COOLDOWN_TIME = 0.1;

class MorphingText {
  constructor(texts) {
    this.texts = texts;
    this.textIndex = 0;
    this.morph = 0;
    this.cooldown = 0;
    this.time = new Date();

    this.text1 = document.querySelector('.text1');
    this.text2 = document.querySelector('.text2');

    if (!this.text1 || !this.text2) return;

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setStyles(fraction) {
    // Apply blur and opacity to both texts
    this.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    this.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    const invertedFraction = 1 - fraction;
    this.text1.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`;
    this.text1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;

    // Update text content
    this.text1.textContent = this.texts[this.textIndex % this.texts.length];
    this.text2.textContent = this.texts[(this.textIndex + 1) % this.texts.length];
  }

  doMorph() {
    this.morph -= this.cooldown;
    this.cooldown = 0;

    let fraction = this.morph / MORPH_TIME;

    if (fraction > 1) {
      this.cooldown = COOLDOWN_TIME;
      fraction = 1;
    }

    this.setStyles(fraction);

    if (fraction === 1) {
      this.textIndex++;
    }
  }

  doCooldown() {
    this.morph = 0;

    this.text2.style.filter = 'none';
    this.text2.style.opacity = '100%';
    this.text1.style.filter = 'none';
    this.text1.style.opacity = '0%';
  }

  animate() {
    requestAnimationFrame(this.animate);

    const newTime = new Date();
    const dt = (newTime.getTime() - this.time.getTime()) / 1000;
    this.time = newTime;

    this.cooldown -= dt;

    if (this.cooldown <= 0) {
      this.doMorph();
    } else {
      this.doCooldown();
    }
  }
}

// Initialize morphing text with words
new MorphingText([
  'Max Siskin',
  'Sisk',
  'Tinkerer',
  'Web Designer',
  'Writer',
  'Techno-Optimist'
]);

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
    return `
      <div class="post">
        ${post.isHeader ? 
          `<span>${post.text}</span>` : 
          `<a href="${post.link}" target="_blank" rel="noopener noreferrer">${post.text}</a>
           <span style="margin-left: 1rem; opacity: 0.7;">${post.date}</span>`
        }
      </div>
    `;
  }

  init() {
    const contents = document.querySelectorAll('.marquee-content');
    contents.forEach(content => {
      content.innerHTML = this.posts.map(post => this.createPostElement(post)).join('');
    });
  }

  // Future enhancement: Add real-time X posts fetching
  async fetchPosts() {
    // This would require backend implementation with X API
    // For now, using static content
  }
}

// Initialize X posts marquee
new XMarquee();

// Initialize smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  smooth: true,
});

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
    lenis.scrollTo(target);
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Add fade-in class to elements
const sections = document.querySelectorAll('section');
sections.forEach(section => {
  section.classList.add('fade-in');
  observer.observe(section);
});

// Sample work data - replace with your actual projects
const workData = [
  {
    title: 'Project 1',
    description: 'Description of project 1',
    image: 'path/to/image1.jpg',
    link: '#'
  },
  {
    title: 'Project 2',
    description: 'Description of project 2',
    image: 'path/to/image2.jpg',
    link: '#'
  },
  // Add more projects as needed
];

// Populate work section
const workGrid = document.querySelector('.work-grid');
workData.forEach(project => {
  const projectElement = document.createElement('div');
  projectElement.className = 'project fade-in';
  projectElement.innerHTML = `
    <h3>${project.title}</h3>
    <p>${project.description}</p>
    <a href="${project.link}">View Project</a>
  `;
  workGrid.appendChild(projectElement);
  observer.observe(projectElement);
});

// Add cursor effects (simplified version first)
const cursor = {
  x: 0,
  y: 0,
  target: { x: 0, y: 0 }
};

document.addEventListener('mousemove', (e) => {
  cursor.target.x = e.clientX;
  cursor.target.y = e.clientY;
});

// Simple animation loop for cursor effects
function animate() {
  // Smooth cursor movement
  cursor.x += (cursor.target.x - cursor.x) * 0.1;
  cursor.y += (cursor.target.y - cursor.y) * 0.1;
  
  // Update interactive elements based on cursor position
  const interactiveElements = document.querySelectorAll('.nav-link, .project');
  interactiveElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const distX = cursor.x - (rect.left + rect.width / 2);
    const distY = cursor.y - (rect.top + rect.height / 2);
    const distance = Math.sqrt(distX * distX + distY * distY);
    
    if (distance < 100) {
      const scale = 1 + (1 - distance / 100) * 0.1;
      el.style.transform = `scale(${scale})`;
    } else {
      el.style.transform = 'scale(1)';
    }
  });
  
  requestAnimationFrame(animate);
}

animate();
