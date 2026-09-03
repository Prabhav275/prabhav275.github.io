# 🌌 Prabhav Pandey — Portfolio

Minimal, classy portfolio website built with pure HTML, CSS, and JavaScript. Inspired by awwwards-winning animation design and the Paul Kalkbrenner aesthetic.

## ✨ Features

### 🎨 Design
- **Dark-first theme** with warm amber accent palette
- **Light/Dark mode toggle** — persists via localStorage, respects system preference
- **Subtle grain texture** overlay for depth
- **Responsive layout** — mobile, tablet, desktop
- **JetBrains Mono** for labels, **Syne** for display, **Instrument Sans** for body

### 🚀 Animations
- **Split-letter hero** — staggered character reveal on load
- **Scroll reveals** — IntersectionObserver-based fade-up transitions
- **Space starfield background** — full-screen Canvas with:
  - 200+ twinkling stars with parallax depth
  - 3 planets on scroll-driven orbits with radial gradients & crescent shadows
  - 1 Saturn-like planet with ring (transformed ellipse)
  - 4 big stars with cross-flare sparkle
  - Periodic comet with 60-point gradient trail
  - 3 nebula color blobs that shift with scroll
  - Colors evolve from warm amber → cool blue as you scroll
- **Hover effects** — project cards, skill badges lift, experience rows shift
- **Pulsing status dot** — illustrates availability
- **Sweep line** on the scroll indicator

### 🧭 Sections
| # | Section | Details |
|---|---------|---------|
| 01 | **About** | Bio, education, key stats |
| 02 | **Experience** | Data Engineer @ Bluecopa, App Dev Intern @ Yhills |
| 03 | **Education** | M.Tech & B.Tech @ Gautam Buddha University |
| 04 | **Skills** | 19 colourful logo badges across Languages, Frameworks, Tools, Databases |
| 05 | **Projects** | Instagram Clone, Wallpaper Hub — with descriptions & tech tags |
| 06 | **Achievements** | 150+ DSA problems, ML research paper |
| 07 | **Contact** | Email, phone, GitHub, LinkedIn |

### 🛠️ Tech Stack
- **No frameworks** — pure HTML5 / CSS3 / Vanilla JS
- **Canvas API** — custom starfield, planets, comet rendering
- **CSS Custom Properties** — full theme token system
- **IntersectionObserver** — scroll-triggered reveals
- **prefers-reduced-motion** — fully respected
- **Google Fonts** — Syne, Instrument Sans, JetBrains Mono
- **SVG** — inline brand logos for skills
- **GitHub Pages** — ready for deployment

### 📁 File Structure
```
portfolio.html   — entire site (single file, ~975 lines)
```

## 🚀 Quick Start
```bash
# Serve locally
python3 -m http.server 8080
# Open http://localhost:8080/portfolio.html
```

## 📬 Contact
- **Email:** pandeyprabhav27@gmail.com
- **GitHub:** [Prabhav275](https://github.com/Prabhav275)
- **LinkedIn:** [prabhavpandey](https://www.linkedin.com/in/prabhavpandey/)
