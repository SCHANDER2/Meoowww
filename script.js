'use strict';

/* ============================================================
   Lakshay Bana — Portfolio Script
   Pure vanilla JS · No dependencies · Production-ready
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP ScrollTrigger if available
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  initLoader();
  initCursor();
  initNavbar();
  initScrollReveals();
  initScrollTop();
  initContactForm();
  initYear();
  initParallax();
  initProjectHovers();

  if (window.gsap && window.ScrollTrigger) {
    initGsapScrollProgress();
    initHorizontalProjects();
    initCounterAnimation();
    initCapabilityHovers();
  }

  // Allow CSS transitions to kick in after paint
  setTimeout(() => document.body.classList.remove('no-transition'), 100);
});


/* ────────────────────────────────────────────────────────────
   1. LOADER
   ──────────────────────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const bar = loader.querySelector('.loader-bar');
  let progress = 0;

  // Lock scroll while loading
  document.body.style.overflow = 'hidden';

  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5;

    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);

      if (bar) bar.style.width = '100%';

      setTimeout(() => {
        loader.classList.add('loaded');
        document.body.style.overflow = '';
        animateHeroEntrance();
      }, 400);
    }

    if (bar) bar.style.width = progress + '%';
  }, 100);
}


/* ────────────────────────────────────────────────────────────
   2. HERO ENTRANCE ANIMATION
   ──────────────────────────────────────────────────────────── */
function animateHeroEntrance() {
  if (window.gsap) {
    const tl = gsap.timeline();
    
    // Force visibility classes so element isn't hidden by default styles
    const selectors = [
      '.hero-badge', '.hero-title', '.hero-tagline', 
      '.hero-cta', '.hero-socials', '.hero-image-wrap', '.hero-scroll-hint'
    ];
    selectors.forEach(sel => {
      const el = document.querySelector(sel);
      if (el) el.classList.add('visible');
    });

    tl.from('.hero-badge', { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' })
      .from('.hero-title .title-line', { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.4')
      .from('.hero-title .title-name', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
      .from('.hero-tagline', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5')
      .from('.hero-cta .btn', { y: 15, opacity: 0, duration: 0.5, stagger: 0.15, ease: 'power3.out' }, '-=0.4')
      .from('.hero-socials .social-link', { y: 15, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, '-=0.4')
      .from('.hero-image-wrap', { scale: 0.9, opacity: 0, duration: 1.2, ease: 'elastic.out(1, 0.75)' }, '-=0.9')
      .from('.hero-scroll-hint', { y: -10, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.8');
  } else {
    const stagger = [
      { selector: '.hero-badge',       delay: 200  },
      { selector: '.hero-title',       delay: 400  },
      { selector: '.hero-tagline',     delay: 600  },
      { selector: '.hero-cta',         delay: 800  },
      { selector: '.hero-socials',     delay: 1000 },
      { selector: '.hero-image-wrap',  delay: 800  },
      { selector: '.hero-scroll-hint', delay: 1200 },
    ];

    stagger.forEach(({ selector, delay }) => {
      const el = document.querySelector(selector);
      if (el) {
        setTimeout(() => el.classList.add('visible'), delay);
      }
    });
  }
}


/* ────────────────────────────────────────────────────────────
   3. CUSTOM CURSOR
   ──────────────────────────────────────────────────────────── */
function initCursor() {
  // Skip on touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0;
  let mouseY = 0;
  let followerX = 0;
  let followerY = 0;

  // Instant dot follows the mouse
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth trailing ring via rAF
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Expand on interactive elements
  const interactives = document.querySelectorAll(
    'a, button, .project-card, .capability-card, input, select, textarea'
  );

  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('active');
      follower.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
      follower.classList.remove('active');
    });
  });

  // Click pulse
  document.addEventListener('mousedown', () => cursor.classList.add('click'));
  document.addEventListener('mouseup',   () => cursor.classList.remove('click'));
}


/* ────────────────────────────────────────────────────────────
   4. NAVBAR
   ──────────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const menuBtn   = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks  = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections  = document.querySelectorAll('section[id]');

  /* ---- Scroll: add 'scrolled' class ---- */
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (navbar) {
      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    lastScroll = currentScroll;
  }, { passive: true });

  /* ---- Mobile menu toggle ---- */
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow =
        mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
  }

  /* ---- Close mobile menu on link click ---- */
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (menuBtn)   menuBtn.classList.remove('open');
      if (mobileMenu) mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---- Active link tracking on scroll ---- */
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 200;

    sections.forEach((section) => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });

  /* ---- Smooth scroll for anchor links ---- */
  initSmoothScroll();
}


/* ────────────────────────────────────────────────────────────
   5. SMOOTH SCROLL
   ──────────────────────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}



/* ────────────────────────────────────────────────────────────
   7. SCROLL REVEAL (IntersectionObserver)
   ──────────────────────────────────────────────────────────── */
function initScrollReveals() {
  if (window.gsap && window.ScrollTrigger) {
    // Reveal section tags
    const sectionTags = document.querySelectorAll('.section-tag');
    sectionTags.forEach(tag => {
      gsap.from(tag, {
        opacity: 0,
        y: 15,
        duration: 0.6,
        scrollTrigger: {
          trigger: tag,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Reveal section titles character reveal simulation
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
      const originalText = title.innerHTML;
      title.innerHTML = `<span class="gsap-reveal-text"><span>${originalText}</span></span>`;
      const innerSpan = title.querySelector('.gsap-reveal-text span');
      
      gsap.fromTo(innerSpan, 
        { y: '105%' }, 
        {
          y: '0%',
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Reveal capability cards
    const capabilityCards = document.querySelectorAll('.capability-card');
    if (capabilityCards.length) {
      gsap.from(capabilityCards, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.capabilities-grid',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }

    // Reveal timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
      const direction = index % 2 === 0 ? -40 : 40;
      gsap.from(item, {
        x: direction,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  // Always run IntersectionObserver for general reveals, excluding elements animated by GSAP above
  const reveals = document.querySelectorAll(
    'section:not(#home) .reveal:not(.capability-card), ' +
    'section:not(#home) .reveal-left:not(.timeline-item), ' +
    'section:not(#home) .reveal-right:not(.timeline-item)'
  );

  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;

          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay * 100);

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  reveals.forEach((el) => observer.observe(el));
}


/* ────────────────────────────────────────────────────────────
   8. SCROLL-TO-TOP BUTTON
   ──────────────────────────────────────────────────────────── */
function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ────────────────────────────────────────────────────────────
   9. CONTACT FORM
   ──────────────────────────────────────────────────────────── */
function initContactForm() {
  const form      = document.getElementById('contact-form');
  const success   = document.getElementById('form-success');
  const submitBtn = document.getElementById('form-submit');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name    = form.querySelector('#contact-name');
    const email   = form.querySelector('#contact-email');
    const message = form.querySelector('#contact-message');

    if (!name || !email || !message) return;

    const nameVal    = name.value.trim();
    const emailVal   = email.value.trim();
    const messageVal = message.value.trim();

    if (!nameVal || !emailVal || !messageVal) return;

    // Disable & show spinner
    if (submitBtn) {
      submitBtn.disabled  = true;
      submitBtn.innerHTML =
        '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
    }

    // Simulate network delay
    setTimeout(() => {
      form.reset();

      if (success) success.style.display = 'flex';

      if (submitBtn) {
        submitBtn.disabled  = false;
        submitBtn.innerHTML =
          '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
      }

      // Auto-hide success toast
      setTimeout(() => {
        if (success) success.style.display = 'none';
      }, 4000);
    }, 1500);
  });
}


/* ────────────────────────────────────────────────────────────
   10. FOOTER YEAR
   ──────────────────────────────────────────────────────────── */
function initYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}


/* ────────────────────────────────────────────────────────────
   11. PARALLAX HERO
   ──────────────────────────────────────────────────────────── */
function initParallax() {
  if (window.gsap && window.ScrollTrigger) {
    gsap.to('.hero-content', {
      y: 120,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '#home',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    gsap.to('.hero-image-wrap', {
      y: 60,
      ease: 'none',
      scrollTrigger: {
        trigger: '#home',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    const ring1 = document.querySelector('.hero-ring-1');
    const ring2 = document.querySelector('.hero-ring-2');
    
    if (ring1) {
      gsap.to(ring1, {
        y: -40,
        x: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: '#home',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    if (ring2) {
      gsap.to(ring2, {
        y: 40,
        x: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: '#home',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  } else {
    const heroContent = document.querySelector('.hero-content');
    const heroImage   = document.querySelector('.hero-image-wrap');

    if (!heroContent && !heroImage) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;

      // Only apply while hero is in view
      if (scrolled < window.innerHeight) {
        const rate    = scrolled * 0.3;
        const opacity = 1 - scrolled / (window.innerHeight * 0.8);

        if (heroContent) {
          heroContent.style.transform = 'translateY(' + rate + 'px)';
          heroContent.style.opacity   = Math.max(0, opacity);
        }

        if (heroImage) {
          heroImage.style.transform = 'translateY(' + (rate * 0.5) + 'px)';
        }
      }
    }, { passive: true });
  }
}


/* ────────────────────────────────────────────────────────────
   12. PROJECT CARD TILT
   ──────────────────────────────────────────────────────────── */
function initProjectHovers() {
  const visuals = document.querySelectorAll('.project-visual');

  if (!visuals.length) return;

  visuals.forEach((visual) => {
    visual.addEventListener('mousemove', (e) => {
      const rect = visual.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)  / rect.height - 0.5;

      visual.style.transform =
        'perspective(1000px) rotateY(' + (x * 5) + 'deg) rotateX(' + (-y * 5) + 'deg) scale(1.02)';
    });

    visual.addEventListener('mouseleave', () => {
      visual.style.transform =
        'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
    });
  });
}


/* ────────────────────────────────────────────────────────────
   13. GSAP NEW FEATURE INITIALIZERS
   ──────────────────────────────────────────────────────────── */

function initGsapScrollProgress() {
  if (!window.gsap || !window.ScrollTrigger) return;
  
  gsap.to('#scroll-progress', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true
    }
  });
}

function initHorizontalProjects() {
  if (!window.gsap || !window.ScrollTrigger) return;
  
  const showcase = document.getElementById('project-showcase');
  const workSection = document.getElementById('work');
  
  if (!showcase || !workSection) return;
  
  const mediaQuery = window.matchMedia('(min-width: 992px)');
  let scrollTriggerInstance = null;
  
  function setupAnimation() {
    if (mediaQuery.matches) {
      workSection.classList.add('horizontal-scroll-mode');
      showcase.classList.add('horizontal-active');
      
      const showcaseWidth = showcase.scrollWidth;
      const windowWidth = window.innerWidth;
      const xScrollAmount = -(showcaseWidth - windowWidth);
      
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: workSection,
        pin: true,
        start: 'top top',
        end: () => `+=${showcaseWidth - windowWidth}`,
        scrub: 1,
        invalidateOnRefresh: true,
        animation: gsap.to(showcase, {
          x: xScrollAmount,
          ease: 'none'
        })
      });
    } else {
      workSection.classList.remove('horizontal-scroll-mode');
      showcase.classList.remove('horizontal-active');
      
      gsap.set(showcase, { clearProps: 'transform,x' });
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
        scrollTriggerInstance = null;
      }
    }
  }
  
  setupAnimation();
  mediaQuery.addEventListener('change', setupAnimation);
}

function initCounterAnimation() {
  if (!window.gsap || !window.ScrollTrigger) return;
  
  const countEl = document.querySelector('.exp-number');
  if (!countEl) return;
  
  const originalText = countEl.textContent.trim();
  const numericValue = parseInt(originalText, 10);
  
  // Skip if it contains non-numeric data like "AI"
  if (isNaN(numericValue)) return;
  
  const countObj = { val: 0 };
  
  gsap.to(countObj, {
    val: numericValue,
    duration: 2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: countEl,
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    onUpdate: () => {
      countEl.textContent = Math.floor(countObj.val) + (originalText.includes('+') ? '+' : '');
    }
  });
}

function initCapabilityHovers() {
  if (!window.gsap) return;
  
  const cards = document.querySelectorAll('.capability-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      
      const angleX = -(y - yc) / 10;
      const angleY = (x - xc) / 10;
      
      const moveX = (x - xc) * 0.08;
      const moveY = (y - yc) * 0.08;
      
      gsap.to(card, {
        rotationX: angleX,
        rotationY: angleY,
        x: moveX,
        y: moveY,
        ease: 'power2.out',
        duration: 0.4,
        transformPerspective: 800,
        overwrite: 'auto'
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        x: 0,
        y: 0,
        ease: 'power2.out',
        duration: 0.6,
        overwrite: 'auto'
      });
    });
  });
}
