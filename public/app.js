/**
 * Portfolio App - Interactive Elements
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initAnimations();
    initTimeOfDayBackground();
    initWavyCracks();
    initGitHubStats();
    initTimeDisplay();
    initMMOChatPopup();
    initScrollTraversal();
    initProjectsModal();
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
 * Time of Day Background - Changes based on Santa Barbara (Pacific) time
 */
function initTimeOfDayBackground() {
    function getTimeOfDayColors() {
        // Get current hour in Santa Barbara (Pacific Time)
        const now = new Date();
        const sbTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
        const hour = sbTime.getHours();
        const minute = sbTime.getMinutes();
        const timeValue = hour + minute / 60;

        // Define time periods and ground colors (not sky!)
        // Ground should look like grass/earth with different lighting conditions

        let groundGradient;

        if (timeValue >= 5 && timeValue < 7) {
            // Dawn - warm golden light starting on grass
            const t = (timeValue - 5) / 2;
            groundGradient = `radial-gradient(ellipse at center, 
                ${lerpColor('#1a2010', '#2a3518', t)} 0%, 
                ${lerpColor('#0f1508', '#1f2812', t)} 50%,
                ${lerpColor('#080a05', '#151a0d', t)} 100%)`;
        } else if (timeValue >= 7 && timeValue < 10) {
            // Morning - brightening grass
            const t = (timeValue - 7) / 3;
            groundGradient = `radial-gradient(ellipse at center, 
                ${lerpColor('#2a3518', '#3a4a28', t)} 0%, 
                ${lerpColor('#1f2812', '#2a3a1c', t)} 50%,
                ${lerpColor('#151a0d', '#1a2510', t)} 100%)`;
        } else if (timeValue >= 10 && timeValue < 16) {
            // Midday - brightest grass, full daylight
            groundGradient = `radial-gradient(ellipse at center, 
                #3d5030 0%, 
                #2d4020 40%,
                #1f3015 70%,
                #152510 100%)`;
        } else if (timeValue >= 16 && timeValue < 18) {
            // Afternoon - golden hour, warm tones on grass
            const t = (timeValue - 16) / 2;
            groundGradient = `radial-gradient(ellipse at center, 
                ${lerpColor('#3d5030', '#3a4525', t)} 0%, 
                ${lerpColor('#2d4020', '#2a351a', t)} 50%,
                ${lerpColor('#152510', '#18200d', t)} 100%)`;
        } else if (timeValue >= 18 && timeValue < 20) {
            // Sunset - dimming light on grass
            const t = (timeValue - 18) / 2;
            groundGradient = `radial-gradient(ellipse at center, 
                ${lerpColor('#3a4525', '#2a3018', t)} 0%, 
                ${lerpColor('#2a351a', '#1f2512', t)} 50%,
                ${lerpColor('#18200d', '#121808', t)} 100%)`;
        } else if (timeValue >= 20 && timeValue < 21) {
            // Dusk - fading light
            const t = (timeValue - 20);
            groundGradient = `radial-gradient(ellipse at center, 
                ${lerpColor('#2a3018', '#1a2010', t)} 0%, 
                ${lerpColor('#1f2512', '#12180a', t)} 50%,
                ${lerpColor('#121808', '#0a0d05', t)} 100%)`;
        } else {
            // Night - dark grass
            groundGradient = `radial-gradient(ellipse at center, 
                #151a12 0%, 
                #0f1208 40%,
                #080a05 70%,
                #050705 100%)`;
        }

        return { groundGradient };
    }

    function lerpColor(color1, color2, t) {
        const hex = (c) => parseInt(c, 16);
        const r1 = hex(color1.slice(1, 3)), g1 = hex(color1.slice(3, 5)), b1 = hex(color1.slice(5, 7));
        const r2 = hex(color2.slice(1, 3)), g2 = hex(color2.slice(3, 5)), b2 = hex(color2.slice(5, 7));
        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    function applyTimeOfDayBackground() {
        const colors = getTimeOfDayColors();

        // Create or update ground overlay
        let groundOverlay = document.getElementById('ground-overlay');
        if (!groundOverlay) {
            groundOverlay = document.createElement('div');
            groundOverlay.id = 'ground-overlay';
            groundOverlay.style.cssText = `
                position: fixed;
                inset: 0;
                z-index: -2;
                pointer-events: none;
                transition: background 60s linear;
            `;
            document.body.insertBefore(groundOverlay, document.body.firstChild);
        }
        groundOverlay.style.background = colors.groundGradient;
    }

    // Apply immediately
    applyTimeOfDayBackground();

    // Update every minute for smooth transitions
    setInterval(applyTimeOfDayBackground, 60000);
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
 * MMO-Style Chat Popup for Resume Download
 */
function initMMOChatPopup() {
    // Create chat popup element
    const chatPopup = document.createElement('div');
    chatPopup.id = 'mmo-chat-popup';
    chatPopup.innerHTML = `
        <div class="chat-header">
            <span class="chat-npc-name">📄 Resume</span>
            <button class="chat-close">×</button>
        </div>
        <div class="chat-body">
            <p class="chat-message">Hello! Would you like to download a copy of my resume?</p>
            <div class="chat-actions">
                <a href="Metehan_Ozten_Resume.docx" class="chat-btn chat-accept" download>Download Resume 📥</a>
                <button class="chat-btn chat-decline">Not Now</button>
            </div>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        #mmo-chat-popup {
            position: fixed;
            left: 20px;
            bottom: 80px;
            width: 280px;
            background: linear-gradient(180deg, rgba(30, 35, 25, 0.95) 0%, rgba(20, 25, 18, 0.98) 100%);
            border: 2px solid #4d9a47;
            border-radius: 8px;
            font-family: 'Inter', sans-serif;
            z-index: 1001;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(77, 154, 71, 0.2);
            transform: translateX(-120%) scale(0.9);
            opacity: 0;
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
        }
        #mmo-chat-popup.visible {
            transform: translateX(0) scale(1);
            opacity: 1;
        }
        .chat-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 12px;
            background: rgba(61, 122, 55, 0.3);
            border-bottom: 1px solid rgba(77, 154, 71, 0.4);
            border-radius: 6px 6px 0 0;
        }
        .chat-npc-name {
            font-size: 0.85rem;
            font-weight: 600;
            color: #7cfc7c;
            text-shadow: 0 0 8px rgba(124, 252, 124, 0.5);
        }
        .chat-close {
            background: none;
            border: none;
            color: #888;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0 4px;
            transition: color 0.2s;
        }
        .chat-close:hover {
            color: #ff6b6b;
        }
        .chat-body {
            padding: 14px;
        }
        .chat-message {
            font-size: 0.82rem;
            color: #d4d4d4;
            line-height: 1.5;
            margin-bottom: 14px;
        }
        .chat-actions {
            display: flex;
            gap: 8px;
        }
        .chat-btn {
            flex: 1;
            padding: 8px 12px;
            font-size: 0.75rem;
            font-weight: 600;
            font-family: inherit;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: center;
            text-decoration: none;
        }
        .chat-accept {
            background: linear-gradient(180deg, #4d9a47 0%, #3d7a37 100%);
            border: 1px solid #5aaa57;
            color: #fff;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .chat-accept:hover {
            background: linear-gradient(180deg, #5daa57 0%, #4d8a47 100%);
            box-shadow: 0 0 12px rgba(77, 154, 71, 0.5);
            transform: translateY(-1px);
        }
        .chat-decline {
            background: rgba(60, 60, 70, 0.6);
            border: 1px solid rgba(100, 100, 110, 0.5);
            color: #999;
        }
        .chat-decline:hover {
            background: rgba(70, 70, 80, 0.8);
            color: #bbb;
        }
        @media (max-width: 520px) {
            #mmo-chat-popup {
                left: 10px;
                right: 10px;
                width: auto;
                bottom: 70px;
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(chatPopup);

    // Show popup after random 2-4 seconds
    const delay = Math.random() * 2000 + 2000; // 2000-4000ms
    setTimeout(() => {
        chatPopup.classList.add('visible');
    }, delay);

    // Close button handler
    chatPopup.querySelector('.chat-close').addEventListener('click', () => {
        chatPopup.classList.remove('visible');
    });

    // Decline button handler
    chatPopup.querySelector('.chat-decline').addEventListener('click', () => {
        chatPopup.classList.remove('visible');
    });

    // Accept button handler - close after click
    chatPopup.querySelector('.chat-accept').addEventListener('click', () => {
        setTimeout(() => chatPopup.classList.remove('visible'), 500);
    });
}

/**
 * Scroll Traversal Effect - Makes it feel like exploring a game world
 */
function initScrollTraversal() {
    const canvas = document.getElementById('rpg-grass');
    if (!canvas) return;

    let scrollOffset = 0;
    let targetScrollOffset = 0;

    // Update target offset on scroll
    window.addEventListener('scroll', () => {
        targetScrollOffset = window.scrollY * 0.3;
    });

    // Smooth interpolation for the grass canvas position
    function updateGrassPosition() {
        scrollOffset += (targetScrollOffset - scrollOffset) * 0.08;
        canvas.style.transform = `translateY(${-scrollOffset}px)`;
        requestAnimationFrame(updateGrassPosition);
    }

    updateGrassPosition();

    // Add scroll indicator style
    const scrollStyle = document.createElement('style');
    scrollStyle.textContent = `
        body::after {
            content: '';
            position: fixed;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 60px;
            background: rgba(77, 154, 71, 0.2);
            border-radius: 2px;
            z-index: 1000;
        }
        body::before {
            content: '';
            position: fixed;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 20px;
            background: rgba(77, 154, 71, 0.6);
            border-radius: 2px;
            z-index: 1001;
            transition: top 0.1s ease;
        }
    `;
    document.head.appendChild(scrollStyle);
}

/**
 * Track download button clicks (optional analytics)
 */
document.querySelector('a[download]')?.addEventListener('click', () => {
    console.log('Resume downloaded');
});

/**
 * Projects Modal Functionality
 */
function initProjectsModal() {
    const modal = document.getElementById('projects-modal');
    const trigger = document.getElementById('projects-trigger');
    const closeBtn = modal?.querySelector('.modal-close');

    if (!modal || !trigger) return;

    // Open modal
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    // Close modal function
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Close on button click
    closeBtn?.addEventListener('click', closeModal);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}
