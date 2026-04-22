document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. Theme Toggle
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');

    function setTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        localStorage.setItem('theme', theme);
    }

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (!systemPrefersDark) {
        setTheme('light');
    }

    themeToggleBtn.addEventListener('click', () => {
        const isLight = document.documentElement.hasAttribute('data-theme');
        setTheme(isLight ? 'dark' : 'light');
    });

    // ==========================================
    // 1. Custom Cursor
    // ==========================================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX - 4 + 'px';
        cursorDot.style.top = mouseY - 4 + 'px';
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        cursorRing.style.left = ringX - 20 + 'px';
        cursorRing.style.top = ringY - 20 + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Cursor hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .btn, .glass-card, .tags span, .social-icon');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });

    // ==========================================
    // 2. Scroll Progress Bar
    // ==========================================
    const scrollProgress = document.getElementById('scroll-progress');
    
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', updateScrollProgress);

    // ==========================================
    // 3. Particle Background
    // ==========================================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 80;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            // Purple or gold particle
            this.hue = Math.random() > 0.5 ? 270 : 40;
            this.saturation = 70 + Math.random() * 30;
            this.lightness = 50 + Math.random() * 20;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Gentle attraction toward mouse
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                this.x += dx * 0.001;
                this.y += dy * 0.001;
                this.opacity = Math.min(0.8, this.opacity + 0.01);
            } else {
                this.opacity = Math.max(0.1, this.opacity - 0.005);
            }

            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ==========================================
    // 4. Navigation Scroll Effect
    // ==========================================
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // ==========================================
    // 5. Active nav link highlighting
    // ==========================================
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    function setActiveLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);

    // ==========================================
    // 6. Intersection Observer for Scroll Animations
    // ==========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .zoom-in');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // ==========================================
    // 7. Dynamic background blob
    // ==========================================
    const blob = document.getElementById("blob");
    
    window.addEventListener("pointermove", event => { 
        const { clientX, clientY } = event;
        blob.animate({
            left: `${clientX}px`,
            top: `${clientY}px`
        }, { duration: 3000, fill: "forwards" });
    });

    // ==========================================
    // 8. Trigger initial animations for visible elements
    // ==========================================
    setTimeout(() => {
        animatedElements.forEach(el => {
             const rect = el.getBoundingClientRect();
             if (rect.top < window.innerHeight) {
                 el.classList.add('appear');
             }
        });
    }, 100);

    // ==========================================
    // 9. Smooth scroll for nav links
    // ==========================================
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ==========================================
    // 10. Typing Animation for Hero Role
    // ==========================================
    const typedElement = document.getElementById('typed-role');
    const roles = [
        'AI & Computer Science Graduate',
        'Data Science Enthusiast',
        'Machine Learning Engineer',
        'Software Developer',
        'Problem Solver'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function typeRole() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typedElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            typedElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 400; // Pause before next word
        }

        setTimeout(typeRole, typeSpeed);
    }
    typeRole();

    // ==========================================
    // 11. Career timeline line animation
    // ==========================================
    const timelineLine = document.querySelector('.career-timeline__line');
    if (timelineLine) {
        const lineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    timelineLine.style.animation = 'lineGrow 1.2s ease forwards';
                    lineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        lineObserver.observe(timelineLine);
    }

    // ==========================================
    // 12. Career cards — 3D tilt on hover
    // ==========================================
    const careerCards = document.querySelectorAll('.career-card');
    careerCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;
            
            card.style.transform = `translateY(-6px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) perspective(800px) rotateX(0) rotateY(0)';
        });
    });

    // ==========================================
    // 13. Magnetic effect on buttons
    // ==========================================
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });

    // ==========================================
    // 14. Counter animation for impact stats
    // ==========================================
    const impactNumbers = document.querySelectorAll('.impact-stat__number');
    
    function animateCounter(el) {
        const text = el.textContent.trim();
        const numMatch = text.match(/^(\d+)/);
        
        if (!numMatch) return;
        
        const target = parseInt(numMatch[1]);
        const suffix = text.replace(numMatch[1], '');
        const duration = 1500;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);
            
            el.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    impactNumbers.forEach(el => {
        counterObserver.observe(el);
    });

    // ==========================================
    // 15. Glass card 3D tilt on all cards
    // ==========================================
    const allCards = document.querySelectorAll('.glass-card:not(.career-card):not(.footer-content)');
    allCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 40;
            const rotateY = (centerX - x) / 40;
            
            card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // ==========================================
    // 16. Parallax text on section titles
    // ==========================================
    const sectionTitles = document.querySelectorAll('.section-title');
    window.addEventListener('scroll', () => {
        sectionTitles.forEach(title => {
            const rect = title.getBoundingClientRect();
            const scrollPercent = rect.top / window.innerHeight;
            if (scrollPercent > -0.5 && scrollPercent < 1.5) {
                title.style.transform = `translateY(${scrollPercent * 15}px)`;
            }
        });
    });

    // ==========================================
    // 17. Skill chip progress bar animation
    // ==========================================
    const skillFills = document.querySelectorAll('.skill-chip__fill');
    const skillFillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                skillFillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillFills.forEach(el => {
        skillFillObserver.observe(el);
    });

    // ==========================================
    // 18. Skill ring SVG stroke animation
    // ==========================================
    const skillRings = document.querySelectorAll('.skill-ring');
    const ringObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const ring = entry.target;
                const fill = ring.querySelector('.skill-ring__fill');
                const percent = parseInt(ring.dataset.percent) || 0;
                const circumference = 2 * Math.PI * 52; // r=52
                const offset = circumference - (circumference * percent) / 100;
                
                // Start from no fill
                fill.style.strokeDasharray = circumference;
                fill.style.strokeDashoffset = circumference;
                
                // Animate to target 
                requestAnimationFrame(() => {
                    fill.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.4, 0, 0.2, 1)';
                    fill.style.strokeDashoffset = offset;
                });

                ringObserver.unobserve(ring);
            }
        });
    }, { threshold: 0.3 });

    skillRings.forEach(ring => {
        // Initialize rings hidden
        const fill = ring.querySelector('.skill-ring__fill');
        const circumference = 2 * Math.PI * 52;
        fill.style.strokeDasharray = circumference;
        fill.style.strokeDashoffset = circumference;
        ringObserver.observe(ring);
    });

    // ==========================================
    // 19. Stagger bento card children animation
    // ==========================================
    const bentoCards = document.querySelectorAll('.bento-card');
    bentoCards.forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.08}s`;
    });
});
