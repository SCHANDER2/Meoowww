# Project: Lakshay Bana Portfolio Upgrade

## Architecture

Static single-page portfolio site — pure HTML/CSS/Vanilla JS + GSAP (no build tools, no frameworks).

- **index.html** — Single-page structure with sections: Hero, Work, About, Capabilities, Journey, Contact
- **style.css** — Complete design system with CSS custom properties, dark/light themes
- **script.js** — Vanilla JS: loader, cursor, navbar, theme toggle, scroll reveals, contact form, parallax
- **Images**: hero_bg.png, profile_avatar.png, project_*.png (4 project images)
- **Deployed at**: https://meoowww-rajenderbana83-4133s-projects.vercel.app

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | SEO + Structured Data + Static Files | R1 (SEO meta tags, OG/Twitter, canonical, JSON-LD, semantic HTML, alt attrs, aria-labels, theme-color) + R4 (robots.txt, sitemap.xml) | none | PLANNED |
| 2 | Performance Optimization | R2 (img width/height, lazy loading, preloads, dns-prefetch, defer scripts, CSS animation audit) | M1 | PLANNED |
| 3 | GSAP Integration | R3 (GSAP CDN load, hero entrance, horizontal scroll gallery, parallax, section reveals, capability card tilt, progress bar, counter animation, text scramble) + CSS changes for horizontal scroll + JS rewrite | M2 | PLANNED |

## Interface Contracts

### M1 → M2 (SEO → Performance)
- M1 adds meta tags and structured data to `<head>`. M2 adds preload/prefetch links to `<head>`.
- M1 ensures semantic HTML (single h1, h2s, h3s). M2 adds width/height to images.

### M2 → M3 (Performance → GSAP)
- M2 ensures all images have width/height and loading attrs. M3 must NOT remove these.
- M2 adds defer to script tags. M3 adds GSAP CDN scripts (should also use defer where appropriate).
- M3 replaces IntersectionObserver reveals with GSAP ScrollTrigger but must preserve: theme toggle, mobile menu, contact form, smooth scroll, custom cursor.

## Code Layout

```
c:\Users\G4\OneDrive\Desktop\MEOOWWW\
├── index.html          (main page — SEO, perf, GSAP changes)
├── style.css           (CSS — animation audit, horizontal scroll styles)
├── script.js           (JS — GSAP animations replace IntersectionObserver)
├── robots.txt          (NEW — M1)
├── sitemap.xml         (NEW — M1)
├── hero_bg.png         (existing)
├── profile_avatar.png  (existing)
├── project_*.png       (existing project images)
└── .agents/            (agent metadata only)
```

## Key Constraints
- Pure HTML/CSS/Vanilla JS + GSAP — no build tools, no frameworks
- All absolute URLs: https://meoowww-rajenderbana83-4133s-projects.vercel.app
- Existing functionality MUST be preserved: theme toggle, mobile menu, contact form, smooth scroll, custom cursor
- Mobile responsive (375px, 768px)
- GSAP enhances, does not replace existing behavior
