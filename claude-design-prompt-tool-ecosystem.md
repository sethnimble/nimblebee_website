# Prompt for Claude Design — NimbleBee "tool ecosystem" hex graphic

Paste this whole brief in as-is. An attached reference file (`tool-ecosystem-concept.html`) is a rough working prototype of the mechanics described below — open/inspect it for exact geometry and timing, then improve on it rather than starting over.

## What this is for

A graphic for the "The Problem" section of the NimbleBee marketing site (nimblebee.co.za), replacing a placeholder box currently labelled "Tool ecosystem graphic — coming soon." It sits in a square container to the right of this copy:

> You're not short on tools. You're short on clarity.
> It's not the tools. You probably have enough of those. The problem is that nothing fits together — each one solves part of the problem but the gaps between them are filled by you, personally, every single day. The result is a business that works — but only because you're the one holding it all together. That's fine for now. But it's not a system. It's willpower.

The graphic needs to visually argue the opposite of that problem: disparate things, brought together into one coherent, connected system.

## Brand constraints (non-negotiable)

- Colors: charcoal `#2D3748` (primary dark/background), coral `#FF595E` (primary accent — this is the NimbleBee hexmark color and must never be recolored), emerald `#10B981` (secondary accent), warm off-white `#FAF8F6` (primary light background). Neutral warm-gray scale available from `#F3EFEA` down to `#1A202C` if intermediate tones are needed.
- Font: Poppins for all UI/labels (weights 300–700). Cormorant Garamond is reserved solely for section eyebrows elsewhere on the site — don't use it inside this graphic.
- Hexagon rules: always pointy-top orientation (vertex at 12 and 6 o'clock, never rotated/tilted). Every hexagon vertex rounded to 12.5% of the circumradius (R ÷ 8). Never use sharp-cornered hexagons at any scale. The NimbleBee hexmark itself is never recolored — it's coral on every background, always.
- This section of the site is a light/off-white section (background gradient `linear-gradient(135deg, #FAF8F6 0%, #D4CEC7 100%)`), transitioning to a dark section below it — so the graphic needs to read well against a light, warm off-white surface, not a dark one.
- Site stack is plain HTML/CSS/JS, no build step, no frameworks. Whatever comes out of Claude Design ultimately needs to be implementable there — SVG/CSS animation or an exportable format that drops cleanly into a static site (not something that only works as a locked interactive embed).

## Concept: why honeycomb, not a generic hub-and-spoke

We deliberately moved past a plain "circle in the middle, lines radiating out to other circles" diagram — that's the generic SaaS-integrations cliché (Zapier-style). NimbleBee's brand already has a stronger, more specific visual metaphor documented in its design system: "chaos becoming order — scattered elements organising into coherent, purposeful systems," expressed literally as individual hexagons implying a larger honeycomb. So the graphic is a honeycomb, not a spoke diagram: no connector lines, no circles — the NimbleBee hexmark as the center cell, and six more hexagons arranged around it, all the same size, all pointy-top, edges meeting edges.

We also deliberately are NOT showing specific third-party tool logos (no Notion, Google, Xero, etc. logos). The reasoning: naming specific tools risks a prospective client thinking "I don't see my tool there, so these guys can't help me," when the actual pitch is tool-agnostic — "whatever you use, we can tie it together." (Real tool/partner logos will live elsewhere on the page, in a separate scrolling logo ticker — not in this graphic. Don't conflate the two.) So each of the six outer hexagons represents a category of business function, with a simple literal pictogram, not a brand logo.

## The six category hexagons

Center hexagon: the NimbleBee hexmark, coral fill. (The reference HTML file uses a plain coral hex with placeholder "nb" text — replace with the actual hexmark SVG asset.)

The six surrounding hexagons, off-white/white fill with a thin charcoal border, each containing one small icon plus a one-word label underneath:

1. **Web** — represents web design/online presence. Use a browser-window icon (rounded rect + top toolbar line), not a plain globe — a globe reads as "language/region," not "website."
2. **Comms** — represents both communication (mail/messaging) and customer/contact relationships combined into one category. A speech-bubble icon (the reference file uses a bubble with three dots inside).
3. **Automate** — represents workflow automation/integration, the category that most literally matches the "tying processes together" pitch. A refresh/loop icon works well (two arcs forming a cycle).
4. **Finance** — deliberately scoped narrow: this represents invoicing capture and financial dashboards/reporting, NOT full bookkeeping or accounting-system support (we don't want to imply Xero-level support, which carries a support burden we're not taking on). A simple upward bar-chart icon communicates "dashboard" better than a raw dollar sign, which reads more like full accounting.
5. **Projects** — project/task management. A kanban-board icon (a few vertical columns with small bars) rather than a generic checklist.
6. **Files** — document/file management (contracts, quotes, job photos, receipts). A folder icon.

For production, pull these from Lucide (stroke weight 1.75, the same icon set already used for functional UI icons elsewhere on the site) rather than inventing a new icon style — the reference file's icons are hand-drawn placeholders and shouldn't be used as-is.

Geometry note for whoever builds this: for pointy-top hexagons, the six flush neighbors of a center hexagon sit at 60° increments starting at an angle offset 30° from the hexagon's own vertex angles (i.e., centered opposite an edge, not a corner) — this was a bug in an earlier draft (outer hexes lined up with corners) and had to be corrected. At flush/touching distance, center-to-outer distance and outer-to-adjacent-outer distance are both exactly `R × √3` where R is the hexagon's circumradius — get both to match or the tiling won't read as a true, gapless honeycomb.

## Animation — the part that most needs your help

This is the piece we couldn't quite land in HTML/CSS and want your help finishing. Sequence, in order:

1. **Entrance**: the six outer hexagons pop in with a snappy, slightly overshooting scale-up (not a rotate/roll-in, not a scatter-and-settle) — staggered slightly, one after another. They land at first with a small visible gap between each hexagon and the center/each other (not yet touching).
2. **Coming together**: once all six have appeared, they get pulled inward together — a clearly visible motion that closes the gap until every edge lines up flush: the outer hexagons touch the center hexagon and touch each other, with zero gap, forming one seamless honeycomb shape. This should read as a deliberate, satisfying "click into place" moment, not a passive fade.
3. **Unified pulse**: once flush, the entire 7-hexagon honeycomb pulses once as a single rigid object — not each hexagon pulsing individually (we tried that; it broke the "unified object" illusion, since independent per-hex pulsing looks like seven things reacting near each other, not one thing). The whole merged shape should scale up slightly and back down together, as if it were one solid icon. At the same moment, a coral ring/energy line should emanate outward from the surface of the merged shape (not from the small center point) and fade out — like a single pulse of energy radiating from the now-unified system.

Where we got stuck: the reference HTML file implements exactly this three-phase sequence (pop-in → pull-together-to-flush → whole-cluster pulse with emanating ring) and the geometry/mechanics are correct, but the feel isn't fully landing — it doesn't yet read as a fully satisfying "click into place, then breathe as one" moment. Treat the HTML file as a correct mechanical starting point, not a locked spec — you have creative latitude to adjust easing curves, timing, the overshoot amount, whether the pulse includes a subtle shadow/depth change, whether the ring should double-pulse, etc., as long as the three beats above stay in this order and the honeycomb ends up perfectly flush with no gaps.

## Deliverable

A square (1:1) graphic/animation, off-white background (or transparent, to sit on the site's own off-white gradient), suitable for embedding in a static HTML/CSS/JS site. Open to your recommendation on whether this ends up as a CSS/SVG animation, a Lottie file, or another format — flag whichever you think is the best fit given the "plain HTML/CSS/JS, no build step" constraint above.
