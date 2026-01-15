/**
 * Portfolio App - Interactive Elements
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initAnimations();
    initWavyCracks();
});

/**
 * Wavy Cartoony Grass Effect
 */
function initWavyCracks() {
    // Create canvas overlay
    const canvas = document.createElement('canvas');
    canvas.id = 'wavy-grass';
    canvas.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 200px;
        pointer-events: none;
        z-index: 1;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let grassBlades = [];
    let time = 0;

    // Resize handler
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = 200;
        generateGrass();
    }

    // Generate grass blades
    function generateGrass() {
        grassBlades = [];
        const bladeCount = Math.floor(canvas.width / 4);

        for (let i = 0; i < bladeCount; i++) {
            grassBlades.push({
                x: (i / bladeCount) * canvas.width + (Math.random() - 0.5) * 8,
                height: Math.random() * 60 + 40,
                width: Math.random() * 4 + 2,
                curve: Math.random() * 0.3 + 0.1,
                speed: Math.random() * 1.5 + 0.5,
                phase: Math.random() * Math.PI * 2,
                color: getGrassColor(),
                layer: Math.floor(Math.random() * 3)
            });
        }
        grassBlades.sort((a, b) => a.layer - b.layer);
    }

    function getGrassColor() {
        const colors = [
            { h: 120, s: 80, l: 55 },
            { h: 130, s: 75, l: 60 },
            { h: 110, s: 85, l: 65 },
            { h: 125, s: 90, l: 70 },
            { h: 100, s: 90, l: 75 },
            { h: 115, s: 95, l: 80 },
            { h: 90, s: 85, l: 65 },
            { h: 80, s: 90, l: 70 },
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function drawBlade(blade, windOffset) {
        const { x, height, width, curve, color, layer } = blade;
        const baseY = canvas.height;
        const sway = Math.sin(time * blade.speed + blade.phase) * (15 + layer * 5) + windOffset;
        const opacity = 0.9 + layer * 0.05;

        ctx.beginPath();
        ctx.strokeStyle = `hsla(${color.h}, ${color.s}%, ${color.l}%, ${opacity})`;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.moveTo(x, baseY);

        const cpX = x + sway * curve * 2;
        const cpY = baseY - height * 0.6;
        const endX = x + sway;
        const endY = baseY - height;

        ctx.quadraticCurveTo(cpX, cpY, endX, endY);
        ctx.stroke();

        if (layer === 2 && Math.random() > 0.7) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${color.h}, ${color.s}%, ${color.l + 20}%, 0.3)`;
            ctx.lineWidth = width * 0.5;
            ctx.moveTo(x + 1, baseY - height * 0.3);
            ctx.quadraticCurveTo(cpX + 1, cpY, endX + 1, endY);
            ctx.stroke();
        }
    }

    function drawGrass() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.02;
        const globalWind = Math.sin(time * 0.5) * 5;

        const groundGradient = ctx.createLinearGradient(0, canvas.height - 30, 0, canvas.height);
        groundGradient.addColorStop(0, 'rgba(60, 140, 60, 0.95)');
        groundGradient.addColorStop(1, 'rgba(45, 100, 45, 1)');
        ctx.fillStyle = groundGradient;
        ctx.fillRect(0, canvas.height - 25, canvas.width, 25);

        grassBlades.forEach(blade => drawBlade(blade, globalWind));
        drawFlowers();
    }

    function drawFlowers() {
        const flowerPositions = [
            { x: canvas.width * 0.15, y: canvas.height - 70 },
            { x: canvas.width * 0.4, y: canvas.height - 85 },
            { x: canvas.width * 0.65, y: canvas.height - 65 },
            { x: canvas.width * 0.85, y: canvas.height - 80 },
        ];
        const sway = Math.sin(time * 0.8) * 3;
        const flowerColors = ['#FFB6C1', '#FFD700', '#87CEEB', '#DDA0DD'];

        flowerPositions.forEach((pos, i) => {
            ctx.beginPath();
            ctx.strokeStyle = '#228B22';
            ctx.lineWidth = 2;
            ctx.moveTo(pos.x, canvas.height - 20);
            ctx.quadraticCurveTo(pos.x + sway, pos.y + 20, pos.x + sway * 1.5, pos.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.fillStyle = flowerColors[i % flowerColors.length];
            ctx.arc(pos.x + sway * 1.5, pos.y, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = '#FFD700';
            ctx.arc(pos.x + sway * 1.5, pos.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function animate() {
        drawGrass();
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
 * Track download button clicks (optional analytics)
 */
document.querySelector('a[download]')?.addEventListener('click', () => {
    console.log('Resume downloaded');
});
