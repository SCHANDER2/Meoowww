'use strict';

/* ============================================================
   Lakshay Bana — Portfolio Script
   Pure vanilla JS · No dependencies · Production-ready
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initNavbar();
  initThemeToggle();
  initScrollReveals();
  initScrollTop();
  initContactForm();
  initYear();
  initParallax();
  initProjectHovers();

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
   6. THEME TOGGLE
   ──────────────────────────────────────────────────────────── */
function initThemeToggle() {
  const btn  = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  const html = document.documentElement;

  if (!btn) return;

  // Restore saved preference
  const saved = localStorage.getItem('theme');
  if (saved) {
    html.setAttribute('data-theme', saved);
    updateIcon(saved);
  }

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') || 'dark';
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon(next);
  });

  function updateIcon(theme) {
    if (!icon) return;
    icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  }
}


/* ────────────────────────────────────────────────────────────
   7. SCROLL REVEAL (IntersectionObserver)
   ──────────────────────────────────────────────────────────── */
function initScrollReveals() {
  const reveals = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right'
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
