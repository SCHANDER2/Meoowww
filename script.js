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
