---
name: project-nimblebee
description: NimbleBee marketing website — build log, design decisions, current state, and next steps
metadata:
  type: project
---

# NimbleBee Marketing Website

**URL:** nimblebee.co.za (not yet live)  
**Codebase:** `/Users/sethferguson/Library/Mobile Documents/com~apple~CloudDocs/MiOS/AI OS/APPS/nimblebee.co.za/`  
**Stack:** Plain HTML / CSS / JS — no frameworks, no build step  
**Dev server:** `node serve.js` on port 3456, managed via Preview MCP using `.claude/launch.json`  
**Last updated:** 2026-06-29

---

## Design System

| Token | Value |
|---|---|
| `--charcoal` | `#2D3748` |
| `--coral` | `#FF595E` |
| `--emerald` | `#10B981` |
| `--offwhite` | `#FAF8F6` |

**Fonts:** Poppins (sans-serif, all body/heading) + Cormorant Garamond (serif, eyebrows only — 300 weight, upright, uppercase, letter-spaced, emerald)  
**Container max-width:** 1120px  
**Section padding:** `clamp(5rem, 10vw, 9rem)`  
**Diagonal cuts:** alternating ↗ ↙ via `::after` pseudo-elements, 80px height, `clip-path: polygon(...)`  

---

## File Structure

```
nimblebee.co.za/
  index.html
  serve.js          ← simple Node static server
  css/
    main.css
  js/
    main.js
  assets/
    brand/
      logomark - trans@2x.svg    ← dark logomark (used in nav)
      logomark - lite@2x.svg     ← light logomark (used in footer)
    icons/
      hex-icon-*.svg             ← hex icons in all colour variants
    Hexagon Background Line Drawings/
      hex-single-offwhite.svg    ← used in hero cluster + contact section
  .claude/
    launch.json                  ← Preview MCP config
```

---

## Section-by-Section Status

### Nav — DONE
- Fixed, offwhite background
- Dark logomark left, coral "Let's Talk" CTA right
- On scroll: 80% opacity + 12px blur backdrop filter + subtle bottom border
- Container: 1120px, aligned

### 01 Hero — DONE
- Dark section (`section-dark`), transitions to light via diagonal
- Left-aligned text: eyebrow → h1 (300 light + 700 bold second line) → body → coral CTA
- Right: hex cluster of 7 SVG hexagons in a 1400×1400px container
  - **Load animation:** hexes scatter from off-screen positions → settle into honeycomb (staggered CSS transitions, 1.4s each, 80ms delay between)
  - **Scroll animation:** hexes converge toward centre hex (which brightens), then cluster fades — completes by ~55% scroll through section
  - After settle, transitions disabled; JS drives scroll animation directly

### 02 The Problem — DONE (partial)
- Light section, transitions to dark
- 2-column grid: text left, square placeholder right
- Placeholder marked "Tool ecosystem graphic — coming soon" (not yet built)

### 03 What We Do — DONE
- Dark section, transitions to light
- Full-width text (eyebrow → h2 → body), h2 and body capped at 620px max-width
- Large radial hex icon (`hex-icon-radial-offwhite.svg`) as background element:
  - 1080×1080px, positioned absolutely, centre aligned to old right-column position (`left: calc(50% + 20px)`)
  - Opacity: 15%
  - Clipped to section top/bottom via `.what-hex-clip` wrapper with `clip-path: inset(0 -200vw 0 0)` — allows right bleed, prevents vertical overflow
  - SVG stroke-width changed from 2 to 0.5 for finer lines at large scale
  - **Scroll animation:** rotates 360° as section traverses the viewport (JS: `translateY(-50%) rotate(Ndeg)`)
  - `overflow-x: hidden` on `html` and `body` prevents the large hex causing a horizontal scrollbar

### 04 Why NimbleBee — DONE (base)
- Light section, transitions to dark
- Eyebrow + h2 ("We use all the tools we recommend.") + body text
- No interactive elements — straightforward copy block

### 05 Who It's For — DONE
- Dark section, transitions to light
- Intro text (eyebrow + h2 + body)
- **Interactive persona picker:**
  - 3 cards: Solo Professional / Trades & Construction / Small NGO
  - Cards use offwhite/white background with charcoal text and charcoal icon variants
  - Active card: 4px emerald border, full opacity, white bg, drop shadow, translateY(-3px)
  - Inactive cards: 80% opacity
  - Click → before/after panel animates in (fade + slide, 220ms fade-out → content swap → fade-in)
  - Panel: offwhite bg, 2-column Before (coral bullets) / After (emerald bullets) layout
  - CTA: "This sounds like me →" in emerald (intentional break from site-wide coral CTA pattern)
  - Default: Solo Professional selected on load
  - Icons: charcoal variants of concentric / isometric / topo hex icons

### 06 How It Works — SCAFFOLDED (unstyled)
- Light section, transitions to dark
- Before/During/After cards (white bg, hover lift) — present but basic
- Step 01/02/03 grid — present but basic
- Placeholder for scroll-triggered stepper — NOT yet built
- **Next build target after going live**

### 07 Social Proof — SCAFFOLDED (unstyled)
- Dark section
- Intro text + 3 product cards (Nimble PM / Nimble Content Planner / Nimble CRM)
- Cards have subtle dark border, product icon, h3, tagline in emerald, body text
- Not yet styled beyond base system

### 08 Contact / CTA — SCAFFOLDED
- Dark section
- Centred layout: eyebrow → h2 → body → coral CTA (mailto:hello@nimblebee.co.za)
- Large hex SVG as faint background watermark (opacity 0.04)

### Footer — DONE
- Dark bg, border-top
- Light logomark left, copyright right
- Note: copyright still reads "2025" — update to 2026 before launch

---

## Scroll & Animation System

- **Scroll reveal:** `.reveal` class → `opacity: 0; transform: translateY(28px)` → IntersectionObserver adds `.visible` → transitions to `opacity: 1; translateY(0)` (0.72s ease-out). Fires once then unobserves.
- **Nav scroll:** adds `.scrolled` class at 60px scroll (blur + shadow)
- **Hero hex:** JS-driven via `window.scroll` event, disabled after settle animation completes
- **What We Do hex:** JS-driven rotation, `progress = elapsed / (vh + sectionHeight)`

---

## Known Issues / To Do Before Launch

- [ ] Footer copyright year says 2025 — change to 2026
- [ ] Section 02 placeholder (tool ecosystem graphic) — still a dashed box
- [ ] Sections 06, 07 need visual styling pass
- [ ] Section 06 scroll-triggered stepper — planned but not built
- [ ] Mobile/responsive layout — not started
- [ ] No favicon set

---

## What's Needed to Go Live (Next Session)

The site is ready to share for early feedback despite the unfinished sections. To deploy:

### Step 1 — Initialise Git
```bash
cd "/Users/sethferguson/Library/Mobile Documents/com~apple~CloudDocs/MiOS/AI OS/APPS/nimblebee.co.za"
git init
git add .
git commit -m "Initial build"
```

### Step 2 — Push to GitHub
Create a new repo on GitHub (name: `nimblebee`), then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/nimblebee.git
git push -u origin main
```

### Step 3 — Deploy on Vercel
- vercel.com → Add New → Project → import the GitHub repo
- No framework config needed (static HTML auto-detected)
- Deploy → get a `*.vercel.app` preview URL immediately

### Step 4 — Connect nimblebee.co.za
- Vercel: Project → Settings → Domains → add `nimblebee.co.za` and `www.nimblebee.co.za`
- Vercel provides DNS records (A record + CNAME)
- Add those records at Seth's domain registrar
- SSL auto-provisioned once DNS propagates (15 min – 1 hour)

**Domain registrar:** domains.co.za — this is where the DNS records need to be added in Step 4.

---

## Decisions Made

- No frameworks, no build step — deliberate. Keeps it simple and deployable anywhere.
- Persona picker CTA uses emerald instead of coral — intentional break, justified by the light-on-dark context of the panel.
- Radial hex in Section 03 edited at SVG level (stroke-width 0.5) rather than CSS, because the icon is loaded as `<img>` and CSS cannot reach inside external SVG DOM.
- `overflow-x: hidden` on both `html` and `body` — required because the 1080px hex causes layout overflow even though it's visually clipped.
- Diagonal section transitions use `::after` pseudo-elements rather than SVG or canvas — simpler, works with the existing section structure.
