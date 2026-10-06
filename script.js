gsap.registerPlugin(ScrollTrigger);

// ==========================================================================
// 1. Lenis Smooth Scroll Setup
// ==========================================================================
const lenis = new Lenis({
    autoRaf: false,
    smoothTouch: false,
    touchMultiplier: 1.5,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ==========================================================================
// 2. Preloader & Hero Entrance
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    let counterElement = document.querySelector('.preloader-counter');
    let preloader = document.querySelector('.preloader');
    
    let count = 0;
    let interval = setInterval(() => {
        count += Math.floor(Math.random() * 10) + 1;
        if(count > 100) count = 100;
        counterElement.textContent = count + '%';
        
        if(count === 100) {
            clearInterval(interval);
            
            // Slide up preloader
            gsap.to(preloader, {
                y: "-100%",
                duration: 1,
                ease: "power4.inOut",
                onComplete: () => {
                    preloader.style.display = 'none';
                    initHeroAnimations();
                }
            });
        }
    }, 30);
});

// Split text utility for hero
function splitText(selector) {
    const el = document.querySelector(selector);
    if(!el) return;
    const words = el.querySelectorAll('.title-word');
    if (words.length > 0) {
        words.forEach(word => {
            const text = word.textContent;
            word.innerHTML = '';
            text.split('').forEach(char => {
                let span = document.createElement('span');
                span.className = 'char';
                span.textContent = char;
                word.appendChild(span);
            });
        });
    } else {
        const text = el.textContent;
        el.innerHTML = '';
        text.split('').forEach(char => {
            let span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            el.appendChild(span);
        });
    }
}

function initHeroAnimations() {
    splitText('#hero-title');
    
    const tl = gsap.timeline();
    
    tl.fromTo('.hero-title .char', 
        { y: 100, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.05, ease: "power4.out" }
    )
    .fromTo('.hero-subtitle', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 
        "-=0.5"
    )
    .fromTo('.hero-actions', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 
        "-=0.6"
    )
    .fromTo('.hero-top', 
        { opacity: 0 }, 
        { opacity: 1, duration: 1 }, 
        "-=0.8"
    );
}

// ==========================================================================
// 3. Magnetic Cursor
// ==========================================================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot follows exactly
    gsap.set(cursorDot, { x: mouseX, y: mouseY });
});

// Outline uses lerp
gsap.ticker.add(() => {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    gsap.set(cursorOutline, { x: outlineX, y: outlineY });
});

// Hover effect for interactive elements
const magneticElements = document.querySelectorAll('[data-magnetic]');
magneticElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursorOutline, { scale: 1.5, duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursorOutline, { scale: 1, duration: 0.3 });
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    });
    
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const elCenterX = rect.left + rect.width / 2;
        const elCenterY = rect.top + rect.height / 2;
        
        const distX = (e.clientX - elCenterX) * 0.3;
        const distY = (e.clientY - elCenterY) * 0.3;
        
        gsap.to(el, { x: distX, y: distY, duration: 0.2 });
    });
});

// ==========================================================================
// 4. Spotlight Card Illumination
// ==========================================================================
const cards = document.querySelectorAll('.project-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ==========================================================================
// 5. Section Titles Split Text Scroll Reveal
// ==========================================================================
document.querySelectorAll('.split-text').forEach(title => {
    const text = title.textContent;
    title.innerHTML = '';
    text.split(' ').forEach((word, i) => {
        let span = document.createElement('span');
        span.style.display = 'inline-block';
        span.style.overflow = 'hidden';
        
        let innerSpan = document.createElement('span');
        innerSpan.style.display = 'inline-block';
        innerSpan.textContent = word + (i !== text.split(' ').length - 1 ? '\u00A0' : '');
        innerSpan.className = 'word-inner';
        
        span.appendChild(innerSpan);
        title.appendChild(span);
    });

    gsap.from(title.querySelectorAll('.word-inner'), {
        scrollTrigger: {
            trigger: title,
            start: "top 80%"
        },
        y: "100%",
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
    });
});

// ==========================================================================
// 6. Horizontal Scroll Gallery
// ==========================================================================
const workGalleryWrapper = document.querySelector('.work__gallery-wrapper');
const workGallery = document.querySelector('.work__gallery');

if (workGalleryWrapper && workGallery) {
    gsap.to(workGallery, {
        x: () => -(workGallery.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
            trigger: workGalleryWrapper,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            end: () => "+=" + (workGallery.scrollWidth - window.innerWidth)
        }
    });
}

// ==========================================================================
// 7. 3D Card Tilt
// ==========================================================================
const isFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
if (isFinePointer) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 800,
                duration: 0.4,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    });
}

// ==========================================================================
// 8. Parallax Depth Layers (Hero Orbs)
// ==========================================================================
gsap.to('.orb-1', {
    yPercent: 30,
    ease: "none",
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});
gsap.to('.orb-2', {
    yPercent: -20,
    ease: "none",
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// ==========================================================================
// 9. Scroll Reveal Animations
// ==========================================================================
gsap.utils.toArray('.scroll-reveal').forEach(el => {
    gsap.to(el, {
        scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleClass: "active"
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
    });
});

// ==========================================================================
// 10. Metric Counters
// ==========================================================================
gsap.utils.toArray('.counter').forEach(counter => {
    const target = parseFloat(counter.getAttribute('data-target'));
    
    ScrollTrigger.create({
        trigger: counter,
        start: "top 85%",
        once: true,
        onEnter: () => {
            gsap.to(counter, {
                innerHTML: target,
                duration: 2,
                ease: "power2.out",
                snap: { innerHTML: target % 1 === 0 ? 1 : 0.01 },
                onUpdate: function() {
                    counter.innerHTML = (target % 1 === 0) ? Math.round(this.targets()[0].innerHTML) : parseFloat(this.targets()[0].innerHTML).toFixed(2);
                }
            });
        }
    });
});

// ==========================================================================
// 11. Theme Toggle
// ==========================================================================
const themeToggle = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

// Initialize theme — strictly Dark by default (reset legacy light preference)
let currentTheme = localStorage.getItem('theme_v2') || 'dark';
htmlEl.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    currentTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme_v2', currentTheme);
    playInteractionSound();
});

// ==========================================================================
// 12. Sound Toggle & Synthesized Sounds
// ==========================================================================
const soundToggle = document.getElementById('sound-toggle');
let soundEnabled = localStorage.getItem('sound') !== 'false';
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function updateSoundIcon() {
    if (soundEnabled) {
        soundToggle.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
    } else {
        soundToggle.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
    }
}
updateSoundIcon();

soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('sound', soundEnabled);
    updateSoundIcon();
    if(audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
});

function playInteractionSound() {
    if (!soundEnabled) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

// Add sound to all links and buttons
document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', playInteractionSound);
});

// ==========================================================================
// 13. Live Clock
// ==========================================================================
function updateClock() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;
    
    const now = new Date();
    // Convert to IST
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    
    let hours = istTime.getHours().toString().padStart(2, '0');
    let minutes = istTime.getMinutes().toString().padStart(2, '0');
    let seconds = istTime.getSeconds().toString().padStart(2, '0');
    
    clockEl.textContent = `${hours}:${minutes}:${seconds} IST`;
}
setInterval(updateClock, 1000);
updateClock();

// ==========================================================================
// 14. Navbar hide on scroll & Back to Top
// ==========================================================================
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('back-to-top');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Navbar styling
    if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Navbar hide/show
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
        navbar.classList.add('hidden');
    } else {
        navbar.classList.remove('hidden');
    }
    
    // Back to top visibility
    if (currentScrollY > window.innerHeight) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
    
    lastScrollY = currentScrollY;
});

backToTop.addEventListener('click', () => {
    lenis.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        closeMobileMenu();

        if (typeof lenis !== 'undefined') {
            lenis.scrollTo(targetId, { 
                duration: 1.2, 
                offset: -80 
            });
        } else {
            const targetEl = document.querySelector(targetId);
            if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ==========================================================================
// 15. Mobile Menu
// ==========================================================================
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function closeMobileMenu() {
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        gsap.to(mobileLinks, {
            y: 20,
            opacity: 0,
            duration: 0.25
        });
        document.body.style.overflow = '';
    }
}

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('active');
        if (!isOpen) {
            mobileMenu.classList.add('active');
            gsap.to(mobileLinks, {
                y: 0,
                opacity: 1,
                duration: 0.4,
                stagger: 0.08,
                ease: "power2.out",
                delay: 0.15
            });
            document.body.style.overflow = 'hidden';
        } else {
            closeMobileMenu();
        }
        playInteractionSound();
    });
}

// ==========================================================================
// 16. Technical Architecture Drawer Modal
// ==========================================================================
const projectDetails = {
    tejas: {
        number: "01",
        title: "Tejas — AI Learning OS",
        subtitle: "Unified AI-Powered Learning Workspace & Adaptive Exam Preparation",
        tags: ["AI/LLM", "Next.js 14", "Gemini 1.5", "Supabase", "Webhooks"],
        architecture: [
            { step: "01", title: "PDF / Syllabus Ingestion", desc: "User uploads syllabus, notes, or past papers into client edge buffer." },
            { step: "02", title: "Chunking & Vectorization", desc: "Text extraction & semantic vector embedding with Supabase pgvector." },
            { step: "03", title: "Gemini 1.5 Context Engine", desc: "Context-aware prompt orchestration generates calibrated mock tests & roadmaps." },
            { step: "04", title: "Client Adaptive Feedback", desc: "Real-time state synchronization maps knowledge gaps & revision schedules." }
        ],
        hurdles: [
            "Achieved context response speeds under 1.1s for dense academic topics (UPSC, JEE, NEET) without triggering serverless timeouts.",
            "Eliminated LLM hallucinations in quantitative problem sets by enforcing strict structured JSON schema outputs.",
            "Designed automated daily roadmap recalculation that adapts dynamically based on student mock exam accuracy."
        ],
        metrics: [
            { value: "< 1.1s", label: "Context Latency" },
            { value: "100%", label: "Client Cache Hits" },
            { value: "UPSC/JEE", label: "Multi-Exam Scope" }
        ],
        liveUrl: "https://tejas-web-blond.vercel.app",
        githubUrl: "https://github.com/SCHANDER2/Tejas"
    },
    interv: {
        number: "02",
        title: "InterV — AI Interview Platform",
        subtitle: "Full-Stack Conversational AI Technical Mock Interview Simulator",
        tags: ["React", "FastAPI", "MongoDB", "WebSockets", "JWT Rotation"],
        architecture: [
            { step: "01", title: "Audio & Chat Ingestion", desc: "Captures candidate voice & code submissions over a full-duplex WebSocket stream." },
            { step: "02", title: "FastAPI Async Pipeline", desc: "Async Python backend validates sessions with rotating JWT authentication." },
            { step: "03", title: "Evaluation LLM Model", desc: "Streams response tokens in parallel while evaluating code correctness & tone." },
            { step: "04", title: "Granular Scorecard", desc: "Computes per-question scorecards, peer percentile benchmarks, and roadmaps." }
        ],
        hurdles: [
            "Engineered bi-directional streaming over WebSockets, dropping interview conversational turnaround latency below 1.2s.",
            "Built resilient JWT refresh token rotation with MongoDB multi-tenant session isolation preventing connection leaks.",
            "Implemented dynamic difficulty scaling that adjusts follow-up questions in real time based on candidate answers."
        ],
        metrics: [
            { value: "200+", label: "Completed Mocks" },
            { value: "< 1.2s", label: "Stream Turnaround" },
            { value: "Real-Time", label: "Voice & Chat Feedback" }
        ],
        liveUrl: "https://interv.in",
        githubUrl: "https://github.com/SCHANDER2/InterV"
    },
    choudhary: {
        number: "03",
        title: "Choudhary Property",
        subtitle: "Hyper-Localized Verified Real Estate Platform for Rural Rajasthan",
        tags: ["Next.js", "CSS Modules", "WhatsApp Business API", "Vercel"],
        architecture: [
            { step: "01", title: "Catalog Discovery UI", desc: "Ultra-fast Next.js localized property search optimized for rural 4G networks." },
            { step: "02", title: "Verified Title Verification", desc: "Direct legal title verification metadata stored with high security." },
            { step: "03", title: "WhatsApp Direct Bridge", desc: "Instant deep-link generator connecting buyers directly to property owners." },
            { step: "04", title: "Zero-Broker Ecosystem", desc: "Completely eliminates middleman broker commissions for local farmers & families." }
        ],
        hurdles: [
            "Optimized asset delivery and image rendering to achieve a 98% Lighthouse performance score on low-bandwidth rural connections.",
            "Constructed automated WhatsApp messaging payloads embedding verified title IDs directly into owner chat links.",
            "Built 100% verified property listing workflows to prevent fraudulent and duplicated land listings."
        ],
        metrics: [
            { value: "98%", label: "Lighthouse Score" },
            { value: "0%", label: "Broker Commission" },
            { value: "0.4s", label: "First Contentful Paint" }
        ],
        liveUrl: "https://real-estate-peach-phi.vercel.app",
        githubUrl: "https://github.com/SCHANDER2/Real-Estate"
    },
    zenlift: {
        number: "04",
        title: "ZenLift.in — Digital Growth Agency",
        subtitle: "Modern Web Development, Workflow Automation & Online Presence Scaling",
        tags: ["Web Dev", "Automation", "CRM Integrations", "Business Growth"],
        architecture: [
            { step: "01", title: "Client Assessment", desc: "Automated business audit analyzing digital bottlenecks and conversion opportunities." },
            { step: "02", title: "High-Performance Build", desc: "Crafting bespoke, sub-second web applications tailored for modern brand identity." },
            { step: "03", title: "Automation & Workflows", desc: "Connecting lead capture, automated CRM routing, and customer communication channels." },
            { step: "04", title: "Growth & Retention", desc: "Continuous conversion optimization, analytics reporting, and scaling." }
        ],
        hurdles: [
            "Delivered complete modern web transformations for small businesses at affordable unit economics without sacrificing craft.",
            "Implemented end-to-end client inquiry automations that trigger real-time notifications across multi-platform webhooks.",
            "Engineered ultra-lean, SEO-dominant landing pages maintaining sub-second load times globally."
        ],
        metrics: [
            { value: "< 800ms", label: "Global TTFB" },
            { value: "3x", label: "Average Lead Velocity" },
            { value: "100%", label: "Responsive Delivery" }
        ],
        liveUrl: "https://zenlift.in",
        githubUrl: "https://github.com/SCHANDER2/Express"
    },
    quantumlearn: {
        number: "05",
        title: "QuantumLearn",
        subtitle: "Interactive Quantum Computing Simulation & Visual Learning Platform",
        tags: ["Quantum Computing", "TypeScript", "Three.js", "State Vectors"],
        architecture: [
            { step: "01", title: "Circuit Builder Canvas", desc: "Interactive drag-and-drop workspace for quantum logic gates (Hadamard, CNOT, Pauli)." },
            { step: "02", title: "State Vector Engine", desc: "Client-side matrix multiplication calculating superposition & qubit state evolution." },
            { step: "03", title: "Probability Measurement", desc: "Simulates quantum measurement collapse into classical probabilistic bit registers." },
            { step: "04", title: "Educational Curriculum", desc: "Structured learning modules built for JCBUST YMCA engineering students." }
        ],
        hurdles: [
            "Implemented client-side complex number linear algebra in JavaScript, running circuit simulations at 60 FPS without external servers.",
            "Designed intuitive visual representations of multi-qubit Bloch spheres and phase interference for beginner engineers.",
            "Architected modular circuit export formats compatible with popular quantum programming toolkits."
        ],
        metrics: [
            { value: "60 FPS", label: "Circuit Rendering" },
            { value: "100%", label: "Client-Side Execution" },
            { value: "JCBUST", label: "University Adoption" }
        ],
        liveUrl: "https://qc-lilac-mu.vercel.app",
        githubUrl: "https://github.com/SCHANDER2/QC"
    }
};

const projectDrawer = document.getElementById('projectDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const drawerCloseBtn = document.getElementById('drawerCloseBtn');

function openProjectDrawer(projectId) {
    const data = projectDetails[projectId];
    if (!data) return;

    document.getElementById('drawerIndex').textContent = data.number;
    document.getElementById('drawerTitle').textContent = data.title;
    document.getElementById('drawerSubtitle').textContent = data.subtitle;

    // Tags
    const tagsContainer = document.getElementById('drawerTags');
    tagsContainer.innerHTML = data.tags.map(t => `<span>${t}</span>`).join('');

    // Architecture Flow
    const flowContainer = document.getElementById('drawerArchitectureFlow');
    flowContainer.innerHTML = data.architecture.map(s => `
        <div class="flow-step">
            <div class="flow-step-header">
                <span class="flow-step-number">STEP ${s.step}</span>
                <span class="flow-step-title">${s.title}</span>
            </div>
            <p class="flow-step-desc">${s.desc}</p>
        </div>
    `).join('');

    // Hurdles
    const hurdlesContainer = document.getElementById('drawerHurdlesList');
    hurdlesContainer.innerHTML = data.hurdles.map(h => `<li>${h}</li>`).join('');

    // Metrics
    const metricsContainer = document.getElementById('drawerMetricsGrid');
    metricsContainer.innerHTML = data.metrics.map(m => `
        <div class="drawer-metric-card">
            <span class="drawer-metric-val">${m.value}</span>
            <span class="drawer-metric-label">${m.label}</span>
        </div>
    `).join('');

    // Action Buttons
    const liveBtn = document.getElementById('drawerLiveBtn');
    liveBtn.href = data.liveUrl;

    const githubBtn = document.getElementById('drawerGithubBtn');
    if (data.githubUrl) {
        githubBtn.href = data.githubUrl;
        githubBtn.style.display = 'inline-block';
    } else {
        githubBtn.style.display = 'none';
    }

    // Initialize Interactive Playground and Code Snippets for this project
    if (typeof renderDrawerPlayground === 'function') {
        renderDrawerPlayground(projectId);
    }
    if (typeof renderDrawerCodeInspector === 'function') {
        renderDrawerCodeInspector(projectId);
    }

    // Show drawer
    projectDrawer.classList.add('active');
    drawerOverlay.classList.add('active');
    projectDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lenis.stop();
    playInteractionSound();
}

function closeProjectDrawer() {
    projectDrawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
    projectDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lenis.start();
    playInteractionSound();
}

// Event Listeners for Drawer Triggers
document.querySelectorAll('[data-open-project]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const projectId = btn.getAttribute('data-open-project');
        openProjectDrawer(projectId);
    });
});

if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeProjectDrawer);
if (drawerOverlay) drawerOverlay.addEventListener('click', closeProjectDrawer);

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectDrawer.classList.contains('active')) {
        closeProjectDrawer();
    }
});

// ==========================================================================
// 17. Dual-Action Contact Inquiry Selector
// ==========================================================================
const inquiryChips = document.querySelectorAll('.inquiry-chip');
const inquiryInput = document.getElementById('inquiryType');

inquiryChips.forEach(chip => {
    chip.addEventListener('click', () => {
        inquiryChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        if (inquiryInput) inquiryInput.value = chip.getAttribute('data-inquiry');
        playInteractionSound();
    });
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const inquiry = inquiryInput ? inquiryInput.value : "Inquiry";
        const message = document.getElementById('message').value;

        const subject = encodeURIComponent(`[${inquiry}] from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nInquiry Type: ${inquiry}\n\nMessage:\n${message}`);

        window.location.href = `mailto:lakshaybana404@gmail.com?subject=${subject}&body=${body}`;
        playInteractionSound();
    });
}

// ==========================================================================
// 18. Tactile Mechanical Sound Synthesizer
// ==========================================================================
function playKeyClickSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const now = audioCtx.currentTime;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(850, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.025);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.025);
    } catch (e) {}
}

// ==========================================================================
// 19. Raycast / Linear Style Command Palette (Cmd+K / Ctrl+K)
// ==========================================================================
const cmdOverlay = document.getElementById('cmdOverlay');
const commandPalette = document.getElementById('commandPalette');
const cmdSearchInput = document.getElementById('cmdSearchInput');
const cmdResultsList = document.getElementById('cmdResultsList');
const cmdCloseBtn = document.getElementById('cmdCloseBtn');
const navCmdTrigger = document.getElementById('navCmdTrigger');

const commandItems = [
    // Navigation
    { id: 'nav-home', title: 'Go to Home', group: 'Navigation', icon: '⌂', action: () => scrollToSection('#home') },
    { id: 'nav-work', title: 'Go to Selected Work', group: 'Navigation', icon: '⚡', action: () => scrollToSection('#work') },
    { id: 'nav-about', title: 'Go to About Me', group: 'Navigation', icon: '👤', action: () => scrollToSection('#about') },
    { id: 'nav-skills', title: 'Go to Skills & Stack', group: 'Navigation', icon: '🛠', action: () => scrollToSection('#skills') },
    { id: 'nav-exp', title: 'Go to Experience', group: 'Navigation', icon: '⏱', action: () => scrollToSection('#experience') },
    { id: 'nav-contact', title: 'Go to Contact', group: 'Navigation', icon: '✉', action: () => scrollToSection('#contact') },

    // Projects
    { id: 'proj-tejas', title: 'Tejas · AI Learning OS', group: 'Projects', badge: 'Live App', icon: '01', action: () => window.open('https://tejas-web-blond.vercel.app', '_blank') },
    { id: 'proj-tejas-arch', title: 'Tejas · Architecture Deep-Dive', group: 'Projects', badge: 'Deep-Dive', icon: '01', action: () => openProjectDrawer('tejas') },
    { id: 'proj-interv', title: 'InterV · AI Interview Platform', group: 'Projects', badge: 'Live App', icon: '02', action: () => window.open('https://interv.in', '_blank') },
    { id: 'proj-interv-arch', title: 'InterV · Architecture Deep-Dive', group: 'Projects', badge: 'Deep-Dive', icon: '02', action: () => openProjectDrawer('interv') },
    { id: 'proj-choudhary', title: 'Choudhary Property · Real Estate', group: 'Projects', badge: 'Live App', icon: '03', action: () => window.open('https://real-estate-peach-phi.vercel.app', '_blank') },
    { id: 'proj-zenlift', title: 'ZenLift.in · Digital Agency', group: 'Projects', badge: 'Live Site', icon: '04', action: () => window.open('https://zenlift.in', '_blank') },
    { id: 'proj-qc', title: 'QuantumLearn · Quantum Simulation', group: 'Projects', badge: 'Interactive', icon: '05', action: () => openProjectDrawer('quantumlearn') },

    // Quick Actions
    { id: 'act-ai', title: 'Ask Lakshay\'s AI Assistant', group: 'Quick Actions', badge: 'AI Tool', icon: '🤖', action: () => openAiModal('ai') },
    { id: 'act-cli', title: 'Launch Interactive Hacker CLI Terminal', group: 'Quick Actions', badge: 'CLI', icon: '💻', action: () => openAiModal('cli') },
    { id: 'act-email', title: 'Copy Email: lakshaybana83@gmail.com', group: 'Quick Actions', badge: 'Clipboard', icon: '📋', action: () => copyToClipboard('lakshaybana83@gmail.com', 'Email copied to clipboard!') },
    { id: 'act-phone', title: 'Copy Phone: +91 9729864010', group: 'Quick Actions', badge: 'Clipboard', icon: '📞', action: () => copyToClipboard('+91 9729864010', 'Phone number copied to clipboard!') },
    { id: 'act-resume', title: 'Download Resume (PDF)', group: 'Quick Actions', badge: 'PDF', icon: '📄', action: () => window.open('resume.pdf', '_blank') },
    { id: 'act-theme', title: 'Toggle Light / Dark Theme', group: 'Quick Actions', badge: 'Theme', icon: '🌗', action: () => { const btn = document.getElementById('theme-toggle'); if (btn) btn.click(); } },
    { id: 'act-sound', title: 'Toggle Audio & Micro-Haptics', group: 'Quick Actions', badge: 'Sound', icon: '🔊', action: () => { const btn = document.getElementById('sound-toggle'); if (btn) btn.click(); } },
];

let selectedCmdIndex = 0;
let filteredCommands = [...commandItems];

function scrollToSection(selector) {
    closeCommandPalette();
    const el = document.querySelector(selector);
    if (el) {
        if (typeof lenis !== 'undefined') {
            lenis.scrollTo(el, { offset: -60 });
        } else {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

function copyToClipboard(text, successMsg) {
    navigator.clipboard.writeText(text).then(() => {
        showGlobalToast(successMsg);
    }).catch(() => {
        showGlobalToast('Copied: ' + text);
    });
    closeCommandPalette();
}

function showGlobalToast(msg) {
    let toast = document.getElementById('globalToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'globalToast';
        toast.style.position = 'fixed';
        toast.style.bottom = '30px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%) translateY(30px)';
        toast.style.background = '#191428';
        toast.style.border = '1px solid #C6F0E4';
        toast.style.color = '#f0f0f5';
        toast.style.padding = '0.75rem 1.25rem';
        toast.style.borderRadius = '30px';
        toast.style.fontSize = '0.88rem';
        toast.style.fontFamily = 'var(--font-code)';
        toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.7), 0 0 15px rgba(198,240,228,0.3)';
        toast.style.zIndex = '11000';
        toast.style.opacity = '0';
        toast.style.pointerEvents = 'none';
        toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2500);
}

function renderCommandResults() {
    if (!cmdResultsList) return;
    cmdResultsList.innerHTML = '';

    if (filteredCommands.length === 0) {
        cmdResultsList.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-tertiary); font-family: var(--font-code); font-size: 0.85rem;">No commands found. Try "work", "tejas", "email", or "skills".</div>';
        return;
    }

    let currentGroup = '';
    filteredCommands.forEach((cmd, idx) => {
        if (cmd.group !== currentGroup) {
            currentGroup = cmd.group;
            const groupEl = document.createElement('div');
            groupEl.className = 'cmd-group-label';
            groupEl.textContent = currentGroup;
            cmdResultsList.appendChild(groupEl);
        }

        const itemEl = document.createElement('div');
        itemEl.className = 'cmd-item ' + (idx === selectedCmdIndex ? 'selected' : '');
        itemEl.innerHTML = `
            <div class="cmd-item-left">
                <span class="cmd-item-icon">${cmd.icon}</span>
                <span>${cmd.title}</span>
            </div>
            ${cmd.badge ? `<span class="cmd-item-badge">${cmd.badge}</span>` : ''}
        `;

        itemEl.addEventListener('mouseenter', () => {
            selectedCmdIndex = idx;
            updateCmdSelection();
        });

        itemEl.addEventListener('click', () => {
            cmd.action();
            playInteractionSound();
        });

        cmdResultsList.appendChild(itemEl);
    });

    scrollSelectedIntoView();
}

function updateCmdSelection() {
    const items = cmdResultsList.querySelectorAll('.cmd-item');
    items.forEach((el, idx) => {
        el.classList.toggle('selected', idx === selectedCmdIndex);
    });
    scrollSelectedIntoView();
}

function scrollSelectedIntoView() {
    const selectedEl = cmdResultsList.querySelector('.cmd-item.selected');
    if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
    }
}

function openCommandPalette() {
    if (!cmdOverlay) return;
    cmdOverlay.classList.add('active');
    cmdOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    filteredCommands = [...commandItems];
    selectedCmdIndex = 0;
    renderCommandResults();
    setTimeout(() => {
        if (cmdSearchInput) {
            cmdSearchInput.value = '';
            cmdSearchInput.focus();
        }
    }, 50);
    playInteractionSound();
}

function closeCommandPalette() {
    if (!cmdOverlay) return;
    cmdOverlay.classList.remove('active');
    cmdOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

if (navCmdTrigger) {
    navCmdTrigger.addEventListener('click', openCommandPalette);
}
if (cmdCloseBtn) {
    cmdCloseBtn.addEventListener('click', closeCommandPalette);
}
if (cmdOverlay) {
    cmdOverlay.addEventListener('click', (e) => {
        if (e.target === cmdOverlay) closeCommandPalette();
    });
}

// Global Keyboard Shortcut listener (Cmd+K / Ctrl+K and /)
window.addEventListener('keydown', (e) => {
    // Cmd+K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (cmdOverlay && cmdOverlay.classList.contains('active')) {
            closeCommandPalette();
        } else {
            openCommandPalette();
        }
        return;
    }

    // / key when not typing in an input
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    const isInputActive = activeTag === 'input' || activeTag === 'textarea';

    if (e.key === '/' && !isInputActive && !(cmdOverlay && cmdOverlay.classList.contains('active'))) {
        e.preventDefault();
        openAiModal('ai');
        return;
    }

    // Escape closes palette, drawer, or AI modal
    if (e.key === 'Escape') {
        if (cmdOverlay && cmdOverlay.classList.contains('active')) {
            closeCommandPalette();
            return;
        }
        const aiModal = document.getElementById('aiModal');
        if (aiModal && aiModal.classList.contains('active')) {
            closeAiModal();
            return;
        }
    }

    // Palette navigation
    if (cmdOverlay && cmdOverlay.classList.contains('active')) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            playKeyClickSound();
            selectedCmdIndex = (selectedCmdIndex + 1) % Math.max(1, filteredCommands.length);
            updateCmdSelection();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            playKeyClickSound();
            selectedCmdIndex = (selectedCmdIndex - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length);
            updateCmdSelection();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredCommands[selectedCmdIndex]) {
                filteredCommands[selectedCmdIndex].action();
                playInteractionSound();
            }
        }
    }
});

if (cmdSearchInput) {
    cmdSearchInput.addEventListener('input', (e) => {
        playKeyClickSound();
        const q = e.target.value.toLowerCase().trim();
        if (!q) {
            filteredCommands = [...commandItems];
        } else {
            filteredCommands = commandItems.filter(item => 
                item.title.toLowerCase().includes(q) || 
                item.group.toLowerCase().includes(q) ||
                (item.badge && item.badge.toLowerCase().includes(q))
            );
        }
        selectedCmdIndex = 0;
        renderCommandResults();
    });
}

// ==========================================================================
// 20. Floating Dual-Mode AI Assistant & Hacker Terminal CLI Widget
// ==========================================================================
const aiDockBtn = document.getElementById('aiDockBtn');
const aiModal = document.getElementById('aiModal');
const aiModalOverlay = document.getElementById('aiModalOverlay');
const tabBtnAi = document.getElementById('tabBtnAi');
const tabBtnCli = document.getElementById('tabBtnCli');
const aiChatPane = document.getElementById('aiChatPane');
const aiCliPane = document.getElementById('aiCliPane');
const aiModalClose = document.getElementById('aiModalClose');
const aiModalMinimize = document.getElementById('aiModalMinimize');
const aiChatForm = document.getElementById('aiChatForm');
const aiChatInput = document.getElementById('aiChatInput');
const aiChatMessages = document.getElementById('aiChatMessages');
const cliForm = document.getElementById('cliForm');
const cliInput = document.getElementById('cliInput');
const cliOutput = document.getElementById('cliOutput');

function openAiModal(mode = 'ai') {
    if (!aiModal) return;
    aiModal.classList.add('active');
    if (aiModalOverlay) aiModalOverlay.classList.add('active');
    switchAiMode(mode);
    playInteractionSound();
}

function closeAiModal() {
    if (!aiModal) return;
    aiModal.classList.remove('active');
    if (aiModalOverlay) aiModalOverlay.classList.remove('active');
}

function switchAiMode(mode) {
    if (mode === 'ai') {
        if (tabBtnAi) tabBtnAi.classList.add('active');
        if (tabBtnCli) tabBtnCli.classList.remove('active');
        if (aiChatPane) aiChatPane.classList.add('active');
        if (aiCliPane) aiCliPane.classList.remove('active');
        setTimeout(() => { if (aiChatInput) aiChatInput.focus(); }, 100);
    } else {
        if (tabBtnCli) tabBtnCli.classList.add('active');
        if (tabBtnAi) tabBtnAi.classList.remove('active');
        if (aiCliPane) aiCliPane.classList.add('active');
        if (aiChatPane) aiChatPane.classList.remove('active');
        setTimeout(() => { if (cliInput) cliInput.focus(); }, 100);
    }
}

if (aiDockBtn) aiDockBtn.addEventListener('click', () => openAiModal('ai'));
if (aiModalClose) aiModalClose.addEventListener('click', closeAiModal);
if (aiModalMinimize) aiModalMinimize.addEventListener('click', closeAiModal);
if (aiModalOverlay) aiModalOverlay.addEventListener('click', closeAiModal);

if (tabBtnAi) tabBtnAi.addEventListener('click', () => { switchAiMode('ai'); playInteractionSound(); });
if (tabBtnCli) tabBtnCli.addEventListener('click', () => { switchAiMode('cli'); playInteractionSound(); });

// Quick prompt chips
document.querySelectorAll('#aiPromptChips .chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const prompt = btn.getAttribute('data-prompt');
        if (prompt && aiChatInput) {
            aiChatInput.value = prompt;
            handleAiChatSubmit(prompt);
        }
    });
});

// AI Knowledge Base Engine
function getAiResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('tejas') || q.includes('exam') || q.includes('roadmap') || q.includes('pdf')) {
        return "Tejas is Lakshay's AI Learning OS. It allows students to upload raw syllabus PDFs or notes, vectorizes them with Supabase pgvector, and orchestrates Gemini 1.5 to compile customized daily study roadmaps, flashcards, and diagnostic mock tests with adaptive spaced repetition.";
    }
    if (q.includes('quantum') || q.includes('qc') || q.includes('bloch') || q.includes('gate') || q.includes('simulator')) {
        return "QuantumLearn is an interactive quantum computing simulation platform. Lakshay engineered client-side complex matrix multiplication in TypeScript and Three.js to simulate quantum logic gates (Hadamard, Pauli-X, CNOT) and 3D Bloch sphere state collapse at a rock-solid 60 FPS without server latency.";
    }
    if (q.includes('interv') || q.includes('interview') || q.includes('mock')) {
        return "InterV is a real-time conversational AI simulator for tech interview prep. Built with React, FastAPI, and WebSockets, it conducts live voice and chat mock interviews, evaluating code structure and communication with instant rubric feedback.";
    }
    if (q.includes('choudhary') || q.includes('real estate') || q.includes('property')) {
        return "Choudhary Property is a hyper-localized real estate platform for rural Rajasthan, designed for low-bandwidth 4G connections. It eliminates middleman fees with a 0% broker commission model and connects buyers directly to verified landowners via WhatsApp deep-links.";
    }
    if (q.includes('zenlift') || q.includes('agency')) {
        return "ZenLift.in is Lakshay's digital growth agency helping small businesses scale online. Lakshay builds sub-second load time web applications with automated CRM webhook integrations, yielding 3x higher lead conversion velocity.";
    }
    if (q.includes('stack') || q.includes('tech') || q.includes('language') || q.includes('skills')) {
        return "Lakshay's core stack covers: Languages: Java, C, Python, SQL, TypeScript, Bash; Frontend: React, Next.js 14, Tailwind, Three.js; Backend: Node.js, FastAPI, Express; AI/ML: PyTorch, RAG, Supabase pgvector, LLM APIs; Tools: Docker, Git, Linux, VS Code.";
    }
    if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('reach') || q.includes('phone')) {
        return "You can reach Lakshay directly at lakshaybana83@gmail.com or by phone at +91 9729864010. You can also connect on LinkedIn (linkedin.com/in/lakshay-bana-9b4191245) or GitHub (github.com/SCHANDER2).";
    }
    if (q.includes('who') || q.includes('about') || q.includes('background') || q.includes('college') || q.includes('education')) {
        return "Lakshay Bana is an engineering student at JCBUST YMCA (Faridabad, India) specializing in AI Systems and modern web architectures. He blends clean UI engineering with complex AI pipelines.";
    }

    return "Lakshay is a software engineer specializing in AI-driven systems and high-performance web applications. You can explore his flagship projects (Tejas, InterV, QuantumLearn), inspect his skills, or click 'Let's Talk' to start a project together!";
}

function handleAiChatSubmit(userText) {
    if (!userText || !aiChatMessages) return;

    // Append user message
    const userMsgEl = document.createElement('div');
    userMsgEl.className = 'chat-msg user';
    userMsgEl.innerHTML = `<div class="msg-bubble"><p>${escapeHtml(userText)}</p></div>`;
    aiChatMessages.appendChild(userMsgEl);

    if (aiChatInput) aiChatInput.value = '';
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    playKeyClickSound();

    // Show typing placeholder
    const botMsgEl = document.createElement('div');
    botMsgEl.className = 'chat-msg bot';
    botMsgEl.innerHTML = `
        <div class="bot-avatar">LB</div>
        <div class="msg-bubble"><p><span class="typing-dots">Thinking...</span></p></div>
    `;
    aiChatMessages.appendChild(botMsgEl);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

    // Stream response
    setTimeout(() => {
        const fullResponse = getAiResponse(userText);
        const bubble = botMsgEl.querySelector('.msg-bubble p');
        bubble.textContent = '';
        let i = 0;
        const interval = setInterval(() => {
            bubble.textContent += fullResponse[i];
            i++;
            aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
            if (i >= fullResponse.length) {
                clearInterval(interval);
            }
        }, 12);
    }, 350);
}

if (aiChatForm) {
    aiChatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = aiChatInput.value.trim();
        if (text) handleAiChatSubmit(text);
    });
}

// Hacker CLI Terminal Engine
const cliHistory = [];
let historyIndex = -1;

function printCliLine(htmlText) {
    if (!cliOutput) return;
    const line = document.createElement('div');
    line.className = 'cli-line';
    line.innerHTML = htmlText;
    cliOutput.appendChild(line);
    cliOutput.scrollTop = cliOutput.scrollHeight;
}

function handleCliCommand(cmdStr) {
    const raw = cmdStr.trim();
    if (!raw) return;

    cliHistory.push(raw);
    historyIndex = cliHistory.length;

    printCliLine(`<span class="cli-prompt">lakshay@portfolio:~$</span> ${escapeHtml(raw)}`);

    const parts = raw.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    switch (cmd) {
        case 'help':
            printCliLine(`Available commands:`);
            printCliLine(`  <span class="term-accent">projects</span>       List all flagship engineering projects`);
            printCliLine(`  <span class="term-accent">project &lt;name&gt;</span>  Open project details (tejas, interv, qc, etc.)`);
            printCliLine(`  <span class="term-accent">skills</span>         Display tech stack & engineering tools`);
            printCliLine(`  <span class="term-accent">whoami</span>         Print Lakshay's bio & background`);
            printCliLine(`  <span class="term-accent">contact</span>        Show direct email, phone, and links`);
            printCliLine(`  <span class="term-accent">cat resume</span>     View executive resume summary`);
            printCliLine(`  <span class="term-accent">palette</span>        Open the Cmd+K Command Palette`);
            printCliLine(`  <span class="term-accent">theme</span>          Toggle Light / Dark mode`);
            printCliLine(`  <span class="term-accent">audio</span>          Toggle micro-haptic sound effects`);
            printCliLine(`  <span class="term-accent">clear</span>          Clear the terminal screen`);
            break;

        case 'projects':
            printCliLine(`Lakshay Bana's Projects:`);
            printCliLine(`  [01] <span class="term-accent">tejas</span>         Tejas · AI Learning OS (<a href="https://tejas-web-blond.vercel.app" target="_blank" class="term-link">tejas-web-blond.vercel.app</a>)`);
            printCliLine(`  [02] <span class="term-accent">interv</span>        InterV · AI Interview Prep (<a href="https://interv.in" target="_blank" class="term-link">interv.in</a>)`);
            printCliLine(`  [03] <span class="term-accent">choudhary</span>     Choudhary Property (<a href="https://real-estate-peach-phi.vercel.app" target="_blank" class="term-link">real-estate-peach-phi.vercel.app</a>)`);
            printCliLine(`  [04] <span class="term-accent">zenlift</span>       ZenLift Growth Agency (<a href="https://zenlift.in" target="_blank" class="term-link">zenlift.in</a>)`);
            printCliLine(`  [05] <span class="term-accent">quantumlearn</span>  QuantumLearn Statevector Sim (<a href="https://qc-lilac-mu.vercel.app" target="_blank" class="term-link">qc-lilac-mu.vercel.app</a>)`);
            printCliLine(`Type <span class="term-accent">project tejas</span> or <span class="term-accent">project qc</span> to inspect.`);
            break;

        case 'project':
            if (!arg) {
                printCliLine(`<span class="term-warn">Usage: project &lt;tejas | interv | choudhary | zenlift | qc&gt;</span>`);
            } else if (arg.includes('tejas')) {
                openProjectDrawer('tejas');
                printCliLine(`Opening Tejas architecture deep-dive...`);
            } else if (arg.includes('interv')) {
                openProjectDrawer('interv');
                printCliLine(`Opening InterV architecture deep-dive...`);
            } else if (arg.includes('choudhary')) {
                openProjectDrawer('choudhary');
                printCliLine(`Opening Choudhary Property architecture deep-dive...`);
            } else if (arg.includes('zenlift')) {
                openProjectDrawer('zenlift');
                printCliLine(`Opening ZenLift architecture deep-dive...`);
            } else if (arg.includes('qc') || arg.includes('quantum')) {
                openProjectDrawer('quantumlearn');
                printCliLine(`Opening QuantumLearn architecture deep-dive & simulator...`);
            } else {
                printCliLine(`<span class="term-error">Unknown project "${arg}". Type "projects" to list.</span>`);
            }
            break;

        case 'skills':
            printCliLine(`Languages:   Java, C, Python, SQL, TypeScript, Bash`);
            printCliLine(`Frontend:    React, Next.js 14, Tailwind CSS, Three.js`);
            printCliLine(`Backend:     Node.js, Express, FastAPI, WebSockets`);
            printCliLine(`AI / ML:     PyTorch, RAG Pipelines, Gemini 1.5, Vector DBs`);
            printCliLine(`Databases:   Supabase (pgvector), MySQL, SQLite, MongoDB`);
            printCliLine(`DevOps:      Docker, Git, GitHub Actions, Linux`);
            break;

        case 'whoami':
            printCliLine(`<span class="term-accent">Lakshay Bana</span>`);
            printCliLine(`Location:    Faridabad, Haryana, India`);
            printCliLine(`Education:   JCBUST YMCA, Faridabad (B.Tech)`);
            printCliLine(`Focus:       AI Systems, Vector RAG Workspaces, Modern Web UI`);
            printCliLine(`Status:      Available for opportunities`);
            break;

        case 'contact':
            printCliLine(`Email:       <a href="mailto:lakshaybana83@gmail.com" class="term-link">lakshaybana83@gmail.com</a>`);
            printCliLine(`Phone:       +91 9729864010`);
            printCliLine(`GitHub:      <a href="https://github.com/SCHANDER2" target="_blank" class="term-link">github.com/SCHANDER2</a>`);
            printCliLine(`LinkedIn:    <a href="https://linkedin.com/in/lakshay-bana-9b4191245" target="_blank" class="term-link">linkedin.com/in/lakshay-bana-9b4191245</a>`);
            break;

        case 'cat':
            if (arg.includes('resume')) {
                printCliLine(`================ EXECUTIVE SUMMARY ================`);
                printCliLine(`Name: Lakshay Bana`);
                printCliLine(`Specialization: Fullstack AI & High-Performance Web`);
                printCliLine(`Key Systems: Tejas (AI Learning OS), InterV (Interview Sim), QuantumLearn (Bloch Sphere)`);
                printCliLine(`Download: <a href="resume.pdf" download class="term-link">Download Full PDF Resume &rarr;</a>`);
            } else {
                printCliLine(`cat: ${arg || 'file'}: No such file or directory. Try: <span class="term-accent">cat resume</span>`);
            }
            break;

        case 'palette':
            closeAiModal();
            openCommandPalette();
            break;

        case 'theme':
            const tbtn = document.getElementById('theme-toggle');
            if (tbtn) tbtn.click();
            printCliLine(`Toggled display theme.`);
            break;

        case 'audio':
            const sbtn = document.getElementById('sound-toggle');
            if (sbtn) sbtn.click();
            printCliLine(`Audio feedback toggled.`);
            break;

        case 'clear':
            if (cliOutput) cliOutput.innerHTML = '';
            break;

        default:
            printCliLine(`<span class="term-error">Command not found: "${cmd}". Type <span class="term-accent">help</span> for a list of commands.</span>`);
            break;
    }

    playInteractionSound();
}

if (cliForm) {
    cliForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (cliInput) {
            handleCliCommand(cliInput.value);
            cliInput.value = '';
        }
    });
}

// ==========================================================================
// 21. Interactive Drawer Playgrounds & Code Inspector
// ==========================================================================

// Quantum Gate State Simulator State: |ψ⟩ = α|0⟩ + β|1⟩
let qubitAlpha = 1.0; // amplitude of |0>
let qubitBeta = 0.0;  // amplitude of |1>

function renderDrawerPlayground(projectId) {
    const container = document.getElementById('drawerPlaygroundContainer');
    if (!container) return;

    if (projectId === 'quantumlearn') {
        qubitAlpha = 1.0;
        qubitBeta = 0.0;
        container.innerHTML = `
            <div class="quantum-playground">
                <div class="quantum-header">
                    <div>
                        <span style="font-weight: 700; color: #f0f0f5; font-size: 0.95rem;">Qubit State Vector Simulator</span>
                        <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">Apply quantum logic gates to simulate superposition & probability amplitudes.</p>
                    </div>
                    <div class="quantum-state-readout" id="quantumStateReadout">|ψ⟩ = 1.00|0⟩ + 0.00|1⟩</div>
                </div>

                <div class="quantum-gates-row">
                    <button class="q-gate-btn" data-gate="H" title="Hadamard: Creates equal superposition">H (Hadamard)</button>
                    <button class="q-gate-btn" data-gate="X" title="Pauli-X: Bit-flip NOT gate">X (NOT)</button>
                    <button class="q-gate-btn" data-gate="Z" title="Pauli-Z: Phase flip">Z (Phase)</button>
                    <button class="q-gate-btn" data-gate="RESET" title="Reset to ground state">↺ Reset</button>
                </div>

                <div class="quantum-prob-bars">
                    <div class="prob-bar-row">
                        <span style="width: 40px; color: #C6F0E4;">|0⟩</span>
                        <div class="prob-track"><div class="prob-fill" id="probZeroFill" style="width: 100%;"></div></div>
                        <span id="probZeroLabel" style="width: 45px; text-align: right; color: #C6F0E4;">100%</span>
                    </div>
                    <div class="prob-bar-row">
                        <span style="width: 40px; color: #A7E8D7;">|1⟩</span>
                        <div class="prob-track"><div class="prob-fill" id="probOneFill" style="width: 0%;"></div></div>
                        <span id="probOneLabel" style="width: 45px; text-align: right; color: #A7E8D7;">0%</span>
                    </div>
                </div>
            </div>
        `;

        container.querySelectorAll('.q-gate-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const gate = btn.getAttribute('data-gate');
                applyQuantumGate(gate);
                playInteractionSound();
            });
        });

    } else if (projectId === 'tejas') {
        container.innerHTML = `
            <div class="quantum-playground">
                <div class="quantum-header">
                    <div>
                        <span style="font-weight: 700; color: #f0f0f5; font-size: 0.95rem;">AI Syllabus Chunking & Roadmap Compiler</span>
                        <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">Interactive test of the PDF vectorization -> Gemini 1.5 daily targets compiler.</p>
                    </div>
                </div>
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
                    <select id="tejasSubjectSelect" style="background: #191428; border: 1px solid rgba(198,240,228,0.3); color: #C6F0E4; padding: 0.4rem 0.75rem; border-radius: 8px; font-family: var(--font-code); font-size: 0.82rem; outline: none;">
                        <option value="cs">Computer Science (Data Structures & Algos)</option>
                        <option value="ai">Artificial Intelligence & Deep Learning</option>
                        <option value="os">Operating Systems & Kernels</option>
                    </select>
                    <button id="btnCompileTejas" class="q-gate-btn" style="background: linear-gradient(135deg, #8A176E, #64165D);">⚡ Run AI Compilation</button>
                </div>
                <div id="tejasCompilerOutput" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(138,23,110,0.3); border-radius: 8px; padding: 0.85rem; font-family: var(--font-code); font-size: 0.8rem; line-height: 1.5; color: #A7E8D7;">
                    Click "Run AI Compilation" to simulate PDF vector embedding and syllabus roadmap generation.
                </div>
            </div>
        `;

        const btn = document.getElementById('btnCompileTejas');
        const select = document.getElementById('tejasSubjectSelect');
        const output = document.getElementById('tejasCompilerOutput');

        if (btn) {
            btn.addEventListener('click', () => {
                output.innerHTML = '<span style="color: #ffbd2e;">[1/3] Chunking syllabus PDF & extracting semantic topics...</span>';
                playKeyClickSound();
                setTimeout(() => {
                    output.innerHTML = '<span style="color: #A7E8D7;">[2/3] Querying Supabase pgvector cosine similarity...</span>';
                    setTimeout(() => {
                        output.innerHTML = `
                            <span style="color: #27c93f;">✔ [3/3] Gemini 1.5 Context Engine Compiled 7-Day Target:</span><br>
                            &bull; <strong>Day 1-2:</strong> Foundation Concepts & Vector Representations<br>
                            &bull; <strong>Day 3-4:</strong> Algorithmic Complexity & Edge Cases<br>
                            &bull; <strong>Day 5-6:</strong> Diagnostic Mock Exam (25 MCQs generated)<br>
                            &bull; <strong>Day 7:</strong> Spaced-Repetition Knowledge Gap Review
                        `;
                        playInteractionSound();
                    }, 400);
                }, 300);
            });
        }

    } else {
        container.innerHTML = `
            <div class="quantum-playground">
                <span style="font-weight: 700; color: #f0f0f5; font-size: 0.95rem;">System Health & Reliability Metrics</span>
                <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0 0 0.5rem;">Client edge latency, uptime, and deployment status across global CDN edges.</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.5rem; font-family: var(--font-code); font-size: 0.8rem;">
                    <div style="background: rgba(0,0,0,0.4); padding: 0.6rem; border-radius: 6px; border: 1px solid rgba(198,240,228,0.2);">
                        <div style="color: var(--text-tertiary); font-size: 0.7rem;">EDGE STATUS</div>
                        <div style="color: #27c93f; font-weight: bold;">● Operational</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.4); padding: 0.6rem; border-radius: 6px; border: 1px solid rgba(198,240,228,0.2);">
                        <div style="color: var(--text-tertiary); font-size: 0.7rem;">GLOBAL TTFB</div>
                        <div style="color: #C6F0E4; font-weight: bold;">&lt; 350ms</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.4); padding: 0.6rem; border-radius: 6px; border: 1px solid rgba(198,240,228,0.2);">
                        <div style="color: var(--text-tertiary); font-size: 0.7rem;">CDN CACHE</div>
                        <div style="color: #A7E8D7; font-weight: bold;">99.4% Hit</div>
                    </div>
                </div>
            </div>
        `;
    }
}

function applyQuantumGate(gate) {
    if (gate === 'RESET') {
        qubitAlpha = 1.0;
        qubitBeta = 0.0;
    } else if (gate === 'X') {
        const temp = qubitAlpha;
        qubitAlpha = qubitBeta;
        qubitBeta = temp;
    } else if (gate === 'H') {
        const invSqrt2 = 1 / Math.SQRT2;
        const newAlpha = (qubitAlpha + qubitBeta) * invSqrt2;
        const newBeta = (qubitAlpha - qubitBeta) * invSqrt2;
        qubitAlpha = newAlpha;
        qubitBeta = newBeta;
    } else if (gate === 'Z') {
        qubitBeta = -qubitBeta;
    }

    const prob0 = Math.min(100, Math.max(0, Math.round(qubitAlpha * qubitAlpha * 100)));
    const prob1 = 100 - prob0;

    const readout = document.getElementById('quantumStateReadout');
    const fill0 = document.getElementById('probZeroFill');
    const fill1 = document.getElementById('probOneFill');
    const label0 = document.getElementById('probZeroLabel');
    const label1 = document.getElementById('probOneLabel');

    if (readout) {
        readout.textContent = `|ψ⟩ = ${qubitAlpha.toFixed(2)}|0⟩ ${qubitBeta >= 0 ? '+' : '-'} ${Math.abs(qubitBeta).toFixed(2)}|1⟩`;
    }
    if (fill0) fill0.style.width = `${prob0}%`;
    if (fill1) fill1.style.width = `${prob1}%`;
    if (label0) label0.textContent = `${prob0}%`;
    if (label1) label1.textContent = `${prob1}%`;
}

// Architecture Code Snippets
const projectCodeSnippets = {
    tejas: [
        {
            lang: 'TypeScript (Next.js)',
            code: `// Tejas: Supabase pgvector Embedding & Context Retrieval
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function matchSyllabusChunks(embedding: number[], matchCount = 5) {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
  const { data, error } = await supabase.rpc('match_syllabus_sections', {
    query_embedding: embedding,
    match_threshold: 0.78,
    match_count: matchCount,
  });
  if (error) throw new Error(error.message);
  return data;
}`
        },
        {
            lang: 'Python (FastAPI)',
            code: `# Tejas: Adaptive Mock Generator Pipeline
from fastapi import FastAPI, BackgroundTasks
import google.generativeai as genai

app = FastAPI()

@app.post("/api/generate-roadmap")
async def generate_daily_roadmap(syllabus_id: str, days_remaining: int):
    model = genai.GenerativeModel("gemini-1.5-pro-latest")
    prompt = f"Deconstruct syllabus {syllabus_id} into {days_remaining} calibrated milestones..."
    response = await model.generate_content_async(prompt)
    return {"roadmap": response.text, "status": "compiled"}`
        }
    ],
    quantumlearn: [
        {
            lang: 'TypeScript (Sim Engine)',
            code: `// QuantumLearn: Complex Number Linear Algebra Gate Simulator
export class QuantumRegister {
  private state: [number, number][]; // [real, imag] amplitude pairs

  constructor(public numQubits: number) {
    this.state = Array.from({ length: 1 << numQubits }, (_, i) => [i === 0 ? 1 : 0, 0]);
  }

  public applyHadamard(targetQubit: number): void {
    const invSqrt2 = 1 / Math.SQRT2;
    // Tensor product matrix multiplication across state vector
    for (let i = 0; i < this.state.length; i += (1 << (targetQubit + 1))) {
      for (let j = 0; j < (1 << targetQubit); j++) {
        const idx0 = i + j;
        const idx1 = idx0 + (1 << targetQubit);
        const [r0, i0] = this.state[idx0];
        const [r1, i1] = this.state[idx1];
        this.state[idx0] = [(r0 + r1) * invSqrt2, (i0 + i1) * invSqrt2];
        this.state[idx1] = [(r0 - r1) * invSqrt2, (i0 - i1) * invSqrt2];
      }
    }
  }
}`
        }
    ],
    interv: [
        {
            lang: 'Python (WebSockets)',
            code: `# InterV: Real-time Interview Speech & Code Feedback Loop
from fastapi import WebSocket, WebSocketDisconnect

@app.websocket("/ws/interview/{session_id}")
async def interview_stream_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    try:
        while True:
            audio_frame = await websocket.receive_bytes()
            transcription = await speech_to_text(audio_frame)
            evaluation = evaluate_response_rubric(transcription)
            await websocket.send_json({"feedback": evaluation})
    except WebSocketDisconnect:
        pass`
        }
    ]
};

function renderDrawerCodeInspector(projectId) {
    const tabsContainer = document.getElementById('drawerCodeTabs');
    const codeBlock = document.getElementById('drawerCodeContent');
    const btnCopy = document.getElementById('btnCopyCode');
    const copyText = document.getElementById('copyCodeText');

    if (!tabsContainer || !codeBlock) return;

    const snippets = projectCodeSnippets[projectId] || [
        {
            lang: 'TypeScript / React',
            code: `// Clean Modular Component Pattern\nexport default function SystemModule() {\n  return <div className="border border-plum/30 rounded-xl p-4">Clean Architecture</div>;\n}`
        }
    ];

    tabsContainer.innerHTML = '';
    snippets.forEach((s, idx) => {
        const tabBtn = document.createElement('button');
        tabBtn.className = 'code-tab-btn ' + (idx === 0 ? 'active' : '');
        tabBtn.textContent = s.lang;
        tabBtn.addEventListener('click', () => {
            tabsContainer.querySelectorAll('.code-tab-btn').forEach(b => b.classList.remove('active'));
            tabBtn.classList.add('active');
            codeBlock.textContent = s.code;
            playKeyClickSound();
        });
        tabsContainer.appendChild(tabBtn);
    });

    codeBlock.textContent = snippets[0].code;

    if (btnCopy) {
        btnCopy.onclick = () => {
            navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                if (copyText) copyText.textContent = 'Copied!';
                setTimeout(() => { if (copyText) copyText.textContent = 'Copy'; }, 2000);
            });
            playInteractionSound();
        };
    }
}

function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}
