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
    let animationId;
    let cracks = [];
    let time = 0;

    // Resize handler
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        generateCracks();
    }

    // Generate crack patterns
    function generateCracks() {
        cracks = [];
        const numCracks = Math.floor(Math.random() * 4) + 3; // 3-6 cracks

        for (let i = 0; i < numCracks; i++) {
            const crack = {
                points: [],
                color: getRandomCrackColor(),
                lineWidth: Math.random() * 2 + 1.5,
                wobbleSpeed: Math.random() * 0.02 + 0.01,
                wobbleAmount: Math.random() * 3 + 2
            };

            // Random starting position (edges or random spots)
            let x, y;
            const startEdge = Math.random();
            if (startEdge < 0.25) {
                x = 0; y = Math.random() * canvas.height;
            } else if (startEdge < 0.5) {
                x = canvas.width; y = Math.random() * canvas.height;
            } else if (startEdge < 0.75) {
                x = Math.random() * canvas.width; y = 0;
            } else {
                x = Math.random() * canvas.width; y = canvas.height;
            }

            // Generate wavy crack path
            const segments = Math.floor(Math.random() * 8) + 5;
            let angle = Math.random() * Math.PI * 2;

            for (let j = 0; j < segments; j++) {
                crack.points.push({
                    x: x,
                    y: y,
                    baseX: x,
                    baseY: y,
                    phase: Math.random() * Math.PI * 2
                });

                // Wavy direction changes
                angle += (Math.random() - 0.5) * 1.2;
                const length = Math.random() * 80 + 40;
                x += Math.cos(angle) * length;
                y += Math.sin(angle) * length;

                // Add random branches
                if (Math.random() < 0.3 && j > 1) {
                    const branch = {
                        points: [],
                        color: crack.color,
                        lineWidth: crack.lineWidth * 0.6,
                        wobbleSpeed: crack.wobbleSpeed * 1.2,
                        wobbleAmount: crack.wobbleAmount * 0.8
                    };

                    let bx = crack.points[crack.points.length - 1].baseX;
                    let by = crack.points[crack.points.length - 1].baseY;
                    let bAngle = angle + (Math.random() - 0.5) * Math.PI;

                    for (let k = 0; k < 3; k++) {
                        branch.points.push({
                            x: bx, y: by, baseX: bx, baseY: by,
                            phase: Math.random() * Math.PI * 2
                        });
                        const bLen = Math.random() * 40 + 20;
                        bAngle += (Math.random() - 0.5) * 0.8;
                        bx += Math.cos(bAngle) * bLen;
                        by += Math.sin(bAngle) * bLen;
                    }
                    cracks.push(branch);
                }
            }
            cracks.push(crack);
        }
    }

    function getRandomCrackColor() {
        const colors = [
            'rgba(147, 112, 219, 0.4)',  // Purple
            'rgba(100, 149, 237, 0.4)',  // Cornflower blue
            'rgba(72, 209, 204, 0.4)',   // Turquoise
            'rgba(255, 182, 193, 0.35)', // Pink
            'rgba(144, 238, 144, 0.35)', // Light green
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Draw cartoon-style wavy cracks
    function drawCracks() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.016;

        cracks.forEach(crack => {
            if (crack.points.length < 2) return;

            // Update wobble positions
            crack.points.forEach(point => {
                const wobble = Math.sin(time * crack.wobbleSpeed * 60 + point.phase);
                point.x = point.baseX + wobble * crack.wobbleAmount;
                point.y = point.baseY + wobble * crack.wobbleAmount * 0.5;
            });

            // Draw main crack line with cartoon style
            ctx.beginPath();
            ctx.strokeStyle = crack.color;
            ctx.lineWidth = crack.lineWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Smooth curve through points
            ctx.moveTo(crack.points[0].x, crack.points[0].y);

            for (let i = 1; i < crack.points.length - 1; i++) {
                const xc = (crack.points[i].x + crack.points[i + 1].x) / 2;
                const yc = (crack.points[i].y + crack.points[i + 1].y) / 2;
                ctx.quadraticCurveTo(crack.points[i].x, crack.points[i].y, xc, yc);
            }

            if (crack.points.length > 1) {
                const last = crack.points[crack.points.length - 1];
                ctx.lineTo(last.x, last.y);
            }

            ctx.stroke();

            // Draw cartoony outline effect
            ctx.strokeStyle = crack.color.replace('0.4', '0.15').replace('0.35', '0.1');
            ctx.lineWidth = crack.lineWidth + 3;
            ctx.stroke();
        });
    }

    // Animation loop
    function animate() {
        drawCracks();
        animationId = requestAnimationFrame(animate);
    }

    // Initialize
    window.addEventListener('resize', resize);
    resize();
    animate();

    // Regenerate cracks occasionally for variety
    setInterval(() => {
        generateCracks();
    }, 15000);
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
