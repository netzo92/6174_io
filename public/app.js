/**
 * Portfolio App - Interactive Elements
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initAnimations();
    initWavyCracks();
    initGitHubStats();
    initTimeDisplay();
});

/**
 * GitHub Stats Tab Switching
 */
function initGitHubStats() {
    const tabs = document.querySelectorAll('.stats-tab');
    const views = document.querySelectorAll('.stats-view');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active view
            views.forEach(view => {
                view.classList.remove('active');
                if (view.id === `${targetTab}-view`) {
                    view.classList.add('active');
                }
            });
        });
    });
}

/**
 * Top-Down 2D RPG Style Grass Effect
 */
function initWavyCracks() {
    const canvas = document.createElement('canvas');
    canvas.id = 'rpg-grass';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
    `;
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    let grassTufts = [];
    let time = 0;
    const TILE_SIZE = 32;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        generateGrassTufts();
    }

    function generateGrassTufts() {
        grassTufts = [];
        const cols = Math.ceil(canvas.width / TILE_SIZE) + 1;
        const rows = Math.ceil(canvas.height / TILE_SIZE) + 1;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // Add 1-3 grass tufts per tile with some randomness
                const numTufts = Math.floor(Math.random() * 3) + 1;
                for (let t = 0; t < numTufts; t++) {
                    grassTufts.push({
                        x: col * TILE_SIZE + Math.random() * TILE_SIZE,
                        y: row * TILE_SIZE + Math.random() * TILE_SIZE,
                        size: Math.random() * 6 + 4,
                        blades: Math.floor(Math.random() * 3) + 2,
                        phase: Math.random() * Math.PI * 2,
                        speed: Math.random() * 0.2 + 0.1,
                        colorVariant: Math.floor(Math.random() * 4)
                    });
                }
            }
        }
    }

    function getGrassColors(variant) {
        const palettes = [
            { dark: '#2d5a27', mid: '#3d7a37', light: '#4d9a47' },  // Forest green
            { dark: '#2a6b2a', mid: '#3a8b3a', light: '#5aab5a' },  // Bright green
            { dark: '#3a6a30', mid: '#4a8a40', light: '#6aaa60' },  // Lime green
            { dark: '#286028', mid: '#388038', light: '#58a058' },  // Deep green
        ];
        return palettes[variant % palettes.length];
    }

    // Draw a single top-down grass tuft (like Pokemon/Zelda style)
    function drawGrassTuft(tuft) {
        const { x, y, size, blades, phase, speed, colorVariant } = tuft;
        const colors = getGrassColors(colorVariant);
        const sway = Math.sin(time * speed + phase) * 2;

        for (let i = 0; i < blades; i++) {
            const angle = (i / blades) * Math.PI - Math.PI / 2;
            const bladeLength = size * (0.7 + Math.random() * 0.3);
            const bladeSway = sway * (i % 2 === 0 ? 1 : -1);

            // Draw blade shadow
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.moveTo(x + 1, y + 1);
            ctx.lineTo(
                x + Math.cos(angle) * bladeLength + bladeSway + 1,
                y + Math.sin(angle) * bladeLength * 0.6 + 1
            );
            ctx.stroke();

            // Draw dark base of blade
            ctx.beginPath();
            ctx.strokeStyle = colors.dark;
            ctx.lineWidth = 3;
            ctx.moveTo(x, y);
            ctx.lineTo(
                x + Math.cos(angle) * bladeLength * 0.4,
                y + Math.sin(angle) * bladeLength * 0.3
            );
            ctx.stroke();

            // Draw mid section
            ctx.beginPath();
            ctx.strokeStyle = colors.mid;
            ctx.lineWidth = 2;
            ctx.moveTo(
                x + Math.cos(angle) * bladeLength * 0.3,
                y + Math.sin(angle) * bladeLength * 0.2
            );
            ctx.lineTo(
                x + Math.cos(angle) * bladeLength * 0.7 + bladeSway * 0.5,
                y + Math.sin(angle) * bladeLength * 0.45
            );
            ctx.stroke();

            // Draw light tip
            ctx.beginPath();
            ctx.strokeStyle = colors.light;
            ctx.lineWidth = 1.5;
            ctx.moveTo(
                x + Math.cos(angle) * bladeLength * 0.6 + bladeSway * 0.5,
                y + Math.sin(angle) * bladeLength * 0.4
            );
            ctx.lineTo(
                x + Math.cos(angle) * bladeLength + bladeSway,
                y + Math.sin(angle) * bladeLength * 0.6
            );
            ctx.stroke();
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.008;
        grassTufts.forEach(tuft => drawGrassTuft(tuft));
    }

    function animate() {
        draw();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}

/**
 * Navigation functionality
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        // Add scrolled class for background
        if (currentScroll > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink?.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
}

/**
 * Scroll-triggered effects
 */
function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Intersection Observer for animations
 */
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animateElements = document.querySelectorAll(
        '.skill-category, .project-card, .about-content, .contact-content'
    );

    animateElements.forEach(el => {
        el.classList.add('animate-ready');
        observer.observe(el);
    });

    // Add animation styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .animate-ready {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .skill-category.animate-ready,
        .project-card.animate-ready {
            transition-delay: calc(var(--index, 0) * 0.1s);
        }
    `;
    document.head.appendChild(style);

    // Set stagger delay index
    document.querySelectorAll('.skill-category').forEach((el, i) => {
        el.style.setProperty('--index', i);
    });

    document.querySelectorAll('.project-card').forEach((el, i) => {
        el.style.setProperty('--index', i);
    });
}

/**
 * Time Display - Mountain and Pacific Time
 */
function initTimeDisplay() {
    // Create time display element
    const timeDisplay = document.createElement('div');
    timeDisplay.id = 'time-display';
    timeDisplay.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 16px;
        background: rgba(20, 20, 30, 0.8);
        border: 1px solid rgba(61, 122, 55, 0.3);
        border-radius: 8px;
        backdrop-filter: blur(10px);
        font-family: 'Inter', sans-serif;
        font-size: 0.75rem;
        color: #a0a0b5;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 4px;
        opacity: 0;
        animation: fadeIn 0.6s ease forwards;
        animation-delay: 1s;
    `;
    document.body.appendChild(timeDisplay);

    function updateTime() {
        const now = new Date();

        // Format time for Mountain Time (America/Denver for MST/MDT)
        const mountainTime = now.toLocaleTimeString('en-US', {
            timeZone: 'America/Denver',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        // Format time for Pacific Time (America/Los_Angeles for PST/PDT)
        const pacificTime = now.toLocaleTimeString('en-US', {
            timeZone: 'America/Los_Angeles',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        timeDisplay.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #4d9a47;">⛰️</span>
                <span style="color: #f0f0f5; font-weight: 500;">MT:</span>
                <span style="font-family: monospace;">${mountainTime}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #00d4ff;">🌊</span>
                <span style="color: #f0f0f5; font-weight: 500;">PT:</span>
                <span style="font-family: monospace;">${pacificTime}</span>
            </div>
        `;
    }

    // Update immediately and then every second
    updateTime();
    setInterval(updateTime, 1000);
}

/**
 * Track download button clicks (optional analytics)
 */
document.querySelector('a[download]')?.addEventListener('click', () => {
    console.log('Resume downloaded');
});
