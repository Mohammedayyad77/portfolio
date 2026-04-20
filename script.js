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

    const hoverTargets = document.querySelectorAll('a, button, .btn, .glass-card, .tags span, .social-icon, .skill-tile, .skills-tab');
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
        constructor() { this.reset(); }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() > 0.5 ? 270 : 40;
            this.saturation = 70 + Math.random() * 30;
            this.lightness = 50 + Math.random() * 20;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
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

    for (let i = 0; i < particleCount; i++) { particles.push(new Particle()); }

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
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ==========================================
    // 4. Navigation Scroll Effect
    // ==========================================
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ==========================================
    // 5. Active nav link highlighting
    // ==========================================
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    function setActiveLink() {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 200) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) link.classList.add('active');
        });
    }
    window.addEventListener('scroll', setActiveLink);

    // ==========================================
    // 6. Intersection Observer for Scroll Animations
    // ==========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const animatedElements = document.querySelectorAll('.fade-in, .zoom-in');
    animatedElements.forEach(el => observer.observe(el));

    // ==========================================
    // 7. Dynamic background blob
    // ==========================================
    const blob = document.getElementById("blob");
    window.addEventListener("pointermove", event => { 
        const { clientX, clientY } = event;
        blob.animate({ left: `${clientX}px`, top: `${clientY}px` }, { duration: 3000, fill: "forwards" });
    });

    // ==========================================
    // 8. Trigger initial animations
    // ==========================================
    setTimeout(() => {
        animatedElements.forEach(el => {
             const rect = el.getBoundingClientRect();
             if (rect.top < window.innerHeight) el.classList.add('appear');
        });
    }, 100);

    // ==========================================
    // 9. Smooth scroll for nav links
    // ==========================================
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ==========================================
    // 10. Typing Animation for Hero Role
    // ==========================================
    const typedElement = document.getElementById('typed-role');
    const roles = ['AI & Computer Science Graduate', 'Data Science Enthusiast', 'Machine Learning Engineer', 'Software Developer', 'Problem Solver'];
    let roleIndex = 0, charIndex = 0, isDeleting = false, typeSpeed = 80;

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
        if (!isDeleting && charIndex === currentRole.length) { typeSpeed = 2000; isDeleting = true; }
        else if (isDeleting && charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; typeSpeed = 400; }
        setTimeout(typeRole, typeSpeed);
    }
    typeRole();

    // ==========================================
    // 11. Skills — Animate progress bars on scroll
    // ==========================================
    const skillBarFills = document.querySelectorAll('.skill-bar-fill');
    const skillBarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const targetW = fill.dataset.w || 0;
                setTimeout(() => { fill.style.width = targetW + '%'; }, 100);
                skillBarObserver.unobserve(fill);
            }
        });
    }, { threshold: 0.3 });

    skillBarFills.forEach(el => skillBarObserver.observe(el));

    // ==========================================
    // 12-13. Career Rail + Panel Navigation
    // ==========================================
    const chtPrev   = document.getElementById('cht-prev');
    const chtNext   = document.getElementById('cht-next');
    const chtFill   = document.getElementById('cht-rail-fill');
    const chtStops  = document.querySelectorAll('.cht-stop');
    const chtPanels = document.querySelectorAll('.cht-panel');

    let activeIdx = 0;
    const totalStops = chtStops.length;

    function activateStop(index) {
        // clamp
        index = Math.max(0, Math.min(index, totalStops - 1));
        activeIdx = index;

        // Update stops
        chtStops.forEach((s, i) => s.classList.toggle('cht-stop--active', i === index));

        // Update panels — hide current, show new
        chtPanels.forEach((p, i) => {
            if (i === index) {
                p.style.display = 'block';
                // Force reflow so transition fires
                p.offsetHeight;
                p.classList.add('cht-panel--active');
            } else {
                p.classList.remove('cht-panel--active');
                // Hide after transition
                p.addEventListener('transitionend', function handler() {
                    if (!p.classList.contains('cht-panel--active')) p.style.display = 'none';
                    p.removeEventListener('transitionend', handler);
                });
            }
        });

        // Update rail fill
        if (chtFill) {
            const pct = totalStops > 1 ? (index / (totalStops - 1)) * 100 : 0;
            chtFill.style.width = pct + '%';
        }

        // Update arrow states
        if (chtPrev) chtPrev.disabled = index === 0;
        if (chtNext) chtNext.disabled = index === totalStops - 1;
    }

    // Wire up stop clicks
    chtStops.forEach((stop, i) => {
        stop.addEventListener('click', () => activateStop(i));
        stop.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') activateStop(i);
        });
    });

    // Wire up arrows
    if (chtPrev) chtPrev.addEventListener('click', () => activateStop(activeIdx - 1));
    if (chtNext) chtNext.addEventListener('click', () => activateStop(activeIdx + 1));

    // Keyboard navigation on the stage
    document.addEventListener('keydown', e => {
        const careerSection = document.getElementById('career');
        if (!careerSection) return;
        const rect = careerSection.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) return;
        if (e.key === 'ArrowRight') activateStop(activeIdx + 1);
        if (e.key === 'ArrowLeft')  activateStop(activeIdx - 1);
    });

    // Initialise first stop
    activateStop(0);


    // ==========================================
    // 15. Counter animation for impact stats (cvt)
    // ==========================================
    const impactNumbers = document.querySelectorAll('.cvt-impact-num');
    
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
            el.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { animateCounter(entry.target); counterObserver.unobserve(entry.target); }
        });
    }, { threshold: 0.5 });

    impactNumbers.forEach(el => counterObserver.observe(el));

    // ==========================================
    // 16. Magnetic effect on buttons
    // ==========================================
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0, 0)'; });
    });

    // ==========================================
    // 17. Glass card 3D tilt on all cards
    // ==========================================
    const allCards = document.querySelectorAll('.glass-card:not(.footer-content)');
    allCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const rotateX = (e.clientY - rect.top - rect.height / 2) / 40;
            const rotateY = (rect.width / 2 - (e.clientX - rect.left)) / 40;
            card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = 'translateY(0)'; });
    });

    // ==========================================
    // 18. Parallax text on section titles
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
    // 19. Skill tile 3D tilt
    // ==========================================
    const skillTileEls = document.querySelectorAll('.skill-tile');
    skillTileEls.forEach(tile => {
        tile.addEventListener('mousemove', e => {
            const rect = tile.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            tile.style.transform = `translateY(-8px) perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
            // Move glow
            const glow = tile.querySelector('.skill-tile__glow');
            if (glow) {
                glow.style.left = `${(e.clientX - rect.left) - rect.width}px`;
                glow.style.top = `${(e.clientY - rect.top) - rect.height}px`;
            }
        });
        tile.addEventListener('mouseleave', () => {
            tile.style.transform = 'translateY(0)';
        });
    });

    // ==========================================
    // 20. Career card expand/collapse (accessible)
    // ==========================================
    const expandBtns = document.querySelectorAll('.cht-expand');
    expandBtns.forEach(btn => {
        function toggleExpand() {
            const card = btn.closest('.cht-card');
            if (card) {
                card.classList.toggle('expanded');
                const isExpanded = card.classList.contains('expanded');
                btn.setAttribute('aria-expanded', isExpanded);
                btn.setAttribute('aria-label', isExpanded ? 'Collapse details' : 'Expand details');
            }
        }
        btn.addEventListener('click', toggleExpand);
        btn.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleExpand();
            }
        });
    });

    // ==========================================
    // 21. Keyboard navigation for career timeline
    // ==========================================
    const chtTrackEl = document.getElementById('cht-track');
    if (chtTrackEl) {
        document.addEventListener('keydown', e => {
            const careerSection = document.getElementById('career');
            if (!careerSection) return;
            const rect = careerSection.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (!inView) return;

            const scrollAmount = 380;
            if (e.key === 'ArrowRight') {
                chtTrackEl.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            } else if (e.key === 'ArrowLeft') {
                chtTrackEl.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            }
        });
    }
});
