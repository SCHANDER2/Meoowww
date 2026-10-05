gsap.registerPlugin(ScrollTrigger);

// ==========================================================================
// 1. Lenis Smooth Scroll Setup
// ==========================================================================
const lenis = new Lenis({
    autoRaf: false,
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
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 800,
            duration: 0.5,
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
        
        lenis.scrollTo(targetId, { 
            duration: 1.2, 
            offset: -100 
        });
        
        // Close mobile menu if open
        if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
    });
});

// ==========================================================================
// 15. Mobile Menu
// ==========================================================================
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    
    if (mobileMenu.classList.contains('active')) {
        gsap.to(mobileLinks, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.2
        });
        document.body.style.overflow = 'hidden';
    } else {
        gsap.to(mobileLinks, {
            y: 20,
            opacity: 0,
            duration: 0.3
        });
        document.body.style.overflow = '';
    }
    playInteractionSound();
});

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
        githubUrl: null
    },
    quantumlearn: {
        number: "05",
        title: "QuantumLearn",
        subtitle: "Interactive Quantum Computing Simulation & Visual Learning Platform",
        tags: ["Quantum Computing", "Interactive Canvas", "Python State Vectors", "Vercel"],
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
        githubUrl: null
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
// 18. Interactive Spacetime Gravitational Well & Relativistic Warp Engine
// ==========================================================================
class SpacetimeEngine {
    constructor() {
        this.bgCanvas = document.getElementById('bg-spacetime-canvas');
        this.fgCanvas = document.getElementById('fg-spacetime-canvas');

        if (!this.bgCanvas || !this.fgCanvas) return;

        this.bgCtx = this.bgCanvas.getContext('2d', { alpha: true });
        this.fgCtx = this.fgCanvas.getContext('2d', { alpha: true });

        // Brand Color Palettes with pre-calculated RGB
        this.palette = [
            { r: 198, g: 240, b: 228 }, // #C6F0E4 (Bright Mint)
            { r: 167, g: 232, b: 215 }, // #A7E8D7 (Soft Aqua Mint)
            { r: 138, g: 23,  b: 110 }, // #8A176E (Vibrant Electric Plum)
            { r: 100, g: 22,  b: 93  }  // #64165D (Deep Regal Plum)
        ];

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);

        // Physics State
        this.particles = [];
        this.embers = [];
        this.photons = [];

        // Singularity / Cursor Coordinates
        this.mouse = {
            x: this.width * 0.5,
            y: this.height * 0.5,
            targetX: this.width * 0.5,
            targetY: this.height * 0.5,
            vx: 0,
            vy: 0,
            active: false,
            radius: 190,
            innerCore: 22
        };

        // Autonomous Mobile / Inactive Attractor (Lissajous path)
        this.autoAttractor = {
            angle: 0,
            x: this.width * 0.5,
            y: this.height * 0.5
        };

        // Relativistic Scroll Coupling
        this.scrollVelocity = 0;
        this.targetScrollVelocity = 0;

        this.isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
        this.isRunning = false;
        this.rafId = null;

        // Automatic Frame Governor & Performance Budget (Locked 60 FPS Guarantee)
        this.frameHistory = [];
        this.throttleTier = 1; // 1 = full 60fps fidelity, 2 = throttled calculation
        this.lastGovernorCheck = performance.now();

        this.init();
    }

    init() {
        this.handleResize();
        this.initParticles();
        this.bindEvents();
        this.start();
    }

    handleResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);

        [this.bgCanvas, this.fgCanvas].forEach(canvas => {
            canvas.width = Math.floor(this.width * this.dpr);
            canvas.height = Math.floor(this.height * this.dpr);
            canvas.style.width = `${this.width}px`;
            canvas.style.height = `${this.height}px`;
        });

        this.bgCtx.scale(this.dpr, this.dpr);
        this.fgCtx.scale(this.dpr, this.dpr);
    }

    initParticles() {
        this.particles = [];
        this.embers = [];
        this.photons = [];

        // Adaptive particle count for silky 60fps on all devices
        const bgCount = this.isCoarsePointer || this.width < 768 ? 120 : 260;
        const fgCount = this.isCoarsePointer || this.width < 768 ? 16 : 36;

        // Background Continuum Particles (Stars / Quantum Grid Nodes)
        for (let i = 0; i < bgCount; i++) {
            const col = this.palette[Math.floor(Math.random() * this.palette.length)];
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                originX: Math.random() * this.width,
                originY: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                baseRadius: Math.random() * 1.6 + 0.6,
                color: col,
                alpha: Math.random() * 0.5 + 0.25,
                baseAlpha: Math.random() * 0.5 + 0.25,
                pulseSpeed: Math.random() * 0.02 + 0.005,
                pulseAngle: Math.random() * Math.PI * 2,
                orbitVelocity: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.02 + 0.015)
            });
        }

        // Foreground Soft Luminous Embers
        for (let i = 0; i < fgCount; i++) {
            const col = this.palette[Math.floor(Math.random() * 2)]; // Highlight in mint hues
            this.embers.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.35,
                vy: -Math.random() * 0.45 - 0.2, // Slow upward buoyancy
                radius: Math.random() * 4.5 + 2.5,
                color: col,
                alpha: Math.random() * 0.4 + 0.2,
                baseAlpha: Math.random() * 0.4 + 0.2,
                phase: Math.random() * Math.PI * 2,
                phaseSpeed: Math.random() * 0.015 + 0.008
            });
        }
    }

    spawnPhotonSpark(x, y, vx, vy, color) {
        if (this.photons.length > 40) return; // Pool limit
        this.photons.push({
            x: x,
            y: y,
            vx: vx + (Math.random() - 0.5) * 2.5,
            vy: vy + (Math.random() - 0.5) * 2.5,
            life: 1.0,
            decay: Math.random() * 0.04 + 0.025,
            color: color || this.palette[0],
            radius: Math.random() * 1.8 + 0.8
        });
    }

    bindEvents() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
                this.initParticles();
            }, 180);
        });

        // Pointer move updates Singularity target
        window.addEventListener('pointermove', (e) => {
            this.mouse.targetX = e.clientX;
            this.mouse.targetY = e.clientY;
            this.mouse.active = true;
        }, { passive: true });

        // Touch interaction
        window.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) {
                this.mouse.targetX = e.touches[0].clientX;
                this.mouse.targetY = e.touches[0].clientY;
                this.mouse.active = true;
            }
        }, { passive: true });

        window.addEventListener('pointerleave', () => {
            this.mouse.active = false;
        });

        // Relativistic Lenis Scroll Coupling
        if (typeof lenis !== 'undefined') {
            lenis.on('scroll', (e) => {
                this.targetScrollVelocity = (e.velocity || 0) * 0.25;
            });
        }

        // Energy saving: Pause rendering when document hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stop();
            } else {
                this.start();
            }
        });
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        let lastTime = performance.now();

        const loop = (time) => {
            if (!this.isRunning) return;
            const frameMs = time - lastTime;
            const delta = Math.min(frameMs / 1000, 0.1);
            lastTime = time;

            // Frame Governor: Monitor performance over rolling sample window
            this.frameHistory.push(frameMs);
            if (this.frameHistory.length > 40) this.frameHistory.shift();

            // Run check periodically to preserve buttery 60 FPS
            if (time - this.lastGovernorCheck > 1000 && this.frameHistory.length >= 20) {
                this.lastGovernorCheck = time;
                const avgFrameMs = this.frameHistory.reduce((a, b) => a + b, 0) / this.frameHistory.length;
                if (avgFrameMs > 32 && this.throttleTier === 1) {
                    this.throttleTier = 2; // Throttle to maintain responsive UI
                } else if (avgFrameMs < 18 && this.throttleTier === 2) {
                    this.throttleTier = 1; // Restore full fidelity
                }
            }

            this.update(delta);
            this.render();

            this.rafId = requestAnimationFrame(loop);
        };
        this.rafId = requestAnimationFrame(loop);
    }

    stop() {
        this.isRunning = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    update(delta) {
        // Smooth cursor tracking with spring physics
        const prevMx = this.mouse.x;
        const prevMy = this.mouse.y;

        if (this.mouse.active) {
            this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.14;
            this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.14;
        } else {
            // Autonomous orbit (graceful harmonic motion)
            this.autoAttractor.angle += 0.012;
            const cx = this.width * 0.5;
            const cy = this.height * 0.45;
            const rx = Math.min(this.width * 0.28, 260);
            const ry = Math.min(this.height * 0.2, 160);

            const autoX = cx + Math.cos(this.autoAttractor.angle) * rx;
            const autoY = cy + Math.sin(this.autoAttractor.angle * 1.5) * ry;

            this.mouse.x += (autoX - this.mouse.x) * 0.05;
            this.mouse.y += (autoY - this.mouse.y) * 0.05;
        }

        this.mouse.vx = this.mouse.x - prevMx;
        this.mouse.vy = this.mouse.y - prevMy;

        // Smooth scroll velocity decay
        this.scrollVelocity += (this.targetScrollVelocity - this.scrollVelocity) * 0.12;
        this.targetScrollVelocity *= 0.88;

        const mx = this.mouse.x;
        const my = this.mouse.y;
        const pullRadius = this.mouse.radius;
        const coreRadius = this.mouse.innerCore;
        const scrollWarp = Math.min(Math.abs(this.scrollVelocity) * 1.5, 25);

        // 1. Update Background Continuum Particles
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // Ambient cosmic twinkle
            p.pulseAngle += p.pulseSpeed;
            p.alpha = p.baseAlpha + Math.sin(p.pulseAngle) * 0.15;

            // Gravitational Vector to Singularity
            const dx = p.x - mx;
            const dy = p.y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < pullRadius && dist > 1) {
                const pullFactor = (1 - dist / pullRadius);
                
                // Radial attraction toward center
                const force = pullFactor * pullFactor * 1.6;
                const fx = (-dx / dist) * force;
                const fy = (-dy / dist) * force;

                // Tangential orbital accretion swirl
                const swirlForce = pullFactor * 1.8;
                const tx = (-dy / dist) * swirlForce;
                const ty = (dx / dist) * swirlForce;

                p.vx += fx + tx;
                p.vy += fy + ty;

                // Singularity Event Horizon Event: particle reaches the core
                if (dist < coreRadius) {
                    // Emit photon spark into accretion disk
                    this.spawnPhotonSpark(p.x, p.y, p.vx * 1.8, p.vy * 1.8, p.color);

                    // Re-eject into outer perimeter with fresh momentum
                    const respawnAngle = Math.random() * Math.PI * 2;
                    const respawnDist = pullRadius * (0.85 + Math.random() * 0.35);
                    p.x = mx + Math.cos(respawnAngle) * respawnDist;
                    p.y = my + Math.sin(respawnAngle) * respawnDist;
                    p.vx = (Math.random() - 0.5) * 0.8;
                    p.vy = (Math.random() - 0.5) * 0.8;
                }
            }

            // Apply friction damping
            p.vx *= 0.94;
            p.vy *= 0.94;

            // Move particle
            p.x += p.vx;
            p.y += p.vy + (this.scrollVelocity * 0.35);

            // Screen boundary wrap
            if (p.x < -30) p.x = this.width + 30;
            if (p.x > this.width + 30) p.x = -30;
            if (p.y < -30) p.y = this.height + 30;
            if (p.y > this.height + 30) p.y = -30;
        }

        // 2. Update Foreground Luminous Embers
        for (let i = 0; i < this.embers.length; i++) {
            const e = this.embers[i];
            e.phase += e.phaseSpeed;
            e.x += e.vx + Math.sin(e.phase) * 0.35;
            e.y += e.vy + (this.scrollVelocity * 0.6);

            // Gentle repulsion / deflection when near singularity
            const dx = e.x - mx;
            const dy = e.y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < pullRadius * 0.8 && dist > 1) {
                const repulse = (1 - dist / (pullRadius * 0.8)) * 1.2;
                e.vx += (dx / dist) * repulse * 0.3;
                e.vy += (dy / dist) * repulse * 0.3;
            }

            e.vx *= 0.96;

            // Screen wrap
            if (e.x < -50) e.x = this.width + 50;
            if (e.x > this.width + 50) e.x = -50;
            if (e.y < -50) e.y = this.height + 50;
            if (e.y > this.height + 50) e.y = -50;
        }

        // 3. Update Photon Sparks
        for (let i = this.photons.length - 1; i >= 0; i--) {
            const ph = this.photons[i];
            ph.x += ph.vx;
            ph.y += ph.vy + (this.scrollVelocity * 0.5);
            ph.vx *= 0.92;
            ph.vy *= 0.92;
            ph.life -= ph.decay;

            if (ph.life <= 0) {
                this.photons.splice(i, 1);
            }
        }
    }

    render() {
        const bg = this.bgCtx;
        const fg = this.fgCtx;

        bg.clearRect(0, 0, this.width, this.height);
        fg.clearRect(0, 0, this.width, this.height);

        const scrollWarp = this.scrollVelocity * 1.4;
        const absScrollWarp = Math.min(Math.abs(scrollWarp), 35);

        // ----------------------------------------------------
        // Render Background Spacetime Continuum
        // ----------------------------------------------------
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            const { r, g, b } = p.color;

            bg.beginPath();

            if (absScrollWarp > 1.5) {
                // Relativistic Warp Elongation during fast scroll
                const stretch = Math.max(p.baseRadius, p.baseRadius + absScrollWarp * 0.6);
                bg.ellipse(p.x, p.y, p.baseRadius, stretch, 0, 0, Math.PI * 2);
            } else {
                bg.arc(p.x, p.y, p.baseRadius, 0, Math.PI * 2);
            }

            bg.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(0, p.alpha)})`;
            bg.fill();
        }

        // Singularity Accretion Horizon Glow (Subtle celestial aura)
        const mx = this.mouse.x;
        const my = this.mouse.y;

        const horizonGlow = bg.createRadialGradient(mx, my, 0, mx, my, this.mouse.radius);
        horizonGlow.addColorStop(0, 'rgba(198, 240, 228, 0.08)');
        horizonGlow.addColorStop(0.35, 'rgba(138, 23, 110, 0.04)');
        horizonGlow.addColorStop(0.7, 'rgba(100, 22, 93, 0.015)');
        horizonGlow.addColorStop(1, 'rgba(10, 10, 15, 0)');

        bg.fillStyle = horizonGlow;
        bg.beginPath();
        bg.arc(mx, my, this.mouse.radius, 0, Math.PI * 2);
        bg.fill();

        // ----------------------------------------------------
        // Render Foreground Luminous Floating Embers & Photons
        // ----------------------------------------------------
        for (let i = 0; i < this.embers.length; i++) {
            const e = this.embers[i];
            const { r, g, b } = e.color;

            const radGrad = fg.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.radius);
            radGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${e.alpha})`);
            radGrad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${e.alpha * 0.4})`);
            radGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

            fg.fillStyle = radGrad;
            fg.beginPath();
            fg.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
            fg.fill();
        }

        // Render Photon Trails
        for (let i = 0; i < this.photons.length; i++) {
            const ph = this.photons[i];
            const { r, g, b } = ph.color;
            const a = ph.life * 0.8;

            fg.beginPath();
            fg.arc(ph.x, ph.y, ph.radius * ph.life, 0, Math.PI * 2);
            fg.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
            fg.fill();
        }
    }
}

// Instantiate Spacetime Gravitational Well Engine
let spacetimeEngine = null;
window.addEventListener('DOMContentLoaded', () => {
    spacetimeEngine = new SpacetimeEngine();
});

