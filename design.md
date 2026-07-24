# NimbleBee — design.md

**Status: Phase 1 baseline (factual extraction) + Phase 2 gradient/depth system (decided). Remaining open items in "Flagged for Phase 2" at the end.**
Version 0.2 · Phase 1 drafted 2026-07-23 from existing brand material · Phase 2 gradient/depth session 2026-07-23 · see Sources at the end.

## Brand foundations

NimbleBee is a digital systems consultancy for small businesses — bringing clarity, structure, and momentum to owners who've become the accidental admin team, customer support, and IT department of their own business.

Feel: bold and contemporary, warm and energetic, confident without being corporate.

Visual metaphor: chaos becoming order — scattered elements organising into coherent, purposeful systems. (This is the conceptual justification for the hexagon motif throughout the system: individual hexagons implying a larger honeycomb/system.)

Tagline: "Ready to go. Built to grow."

## Color system

**Core palette**

| Role | Name | Hex | RGB |
|---|---|---|---|
| Primary Dark / Background | Charcoal | `#2D3748` | 45, 55, 72 |
| Primary Accent | Coral Red | `#FF595E` | 255, 89, 94 |
| Secondary Accent | Emerald Mint | `#10B981` | 16, 185, 129 |
| Primary Light / Background | Warm Off-white | `#FAF8F6` | 250, 248, 246 |

**Neutral scale** (10-step warm-gray, 4px-grid-adjacent naming `neutral-50`…`neutral-900`)

`50 #FAF8F6` · `100 #F3EFEA` · `200 #E8E4DF` · `300 #D4CEC7` · `400 #A8A097` · `500 #78716A` · `600 #565049` · `700 #3D3933` · `800 #2D3748` (= Charcoal) · `900 #1A202C`

**Semantic accents**

- Positive / "Sorted" (mint): surface `#E7F8F1` · base `#10B981` · text `#0B8B62`
- Emphasis / "Joy" (coral): surface `#FFE9EA` · base `#FF595E` · text `#D8474B`

**CSS role tokens** (named in the source system, exact hex not separately documented — map to the palette/neutral scale above; confirm exact assignment before hard-coding)

`--fg-1` primary text · `--fg-2` secondary text · `--fg-3` meta/muted text · `--bg-1` page background · `--bg-2` subtle surface · `--border-1` default hairline

**Secondary accent range** — supplementary only, use sparingly, never as a primary brand color

Warm Amber `#F59E0B` · Cyan Teal `#06B6D4` · Hot Pink `#E11D74` · Burnt Orange `#EA580C`

**Accessibility (WCAG contrast)**

- Off-white on Charcoal — 11.3:1 — AAA, all text sizes
- Emerald on Charcoal — 4.7:1 — AA, all text sizes
- Coral on Charcoal — 3.9:1 — AA, large text only (≥24px)
- Coral on Off-white — 2.9:1 — graphic/decorative use only, not text

## Typography

**Primary typeface: Poppins**

| Weight | Use |
|---|---|
| Bold 700 | Display, CTAs, key data points |
| SemiBold 600 | Section headings, slide titles, brand name |
| Medium 500 | Sub-headings, navigation, UI labels |
| Regular 400 | Body copy, descriptions, captions |
| Light 300 | Long-form copy, supporting text, large pullquotes |

**Type scale** (working UI ladder, size/weight)

H3 `28/500` · H4 `22/500` · Lede `18/400` · Body `16/400` · Small `14/400` · Meta `12/500`

Hero/display sizes in use: `56/500` and `40/500` (Poppins).

**The Cormorant rule (hard rule — one use only)**

Cormorant Garamond appears *only* as an eyebrow/accent label: Light 300, upright — never italic, 24px, Emerald Mint `#10B981`, letter-spacing 3–4px, uppercase. Nowhere else. Never in body copy, never in headings, never in the logo.

⚠️ Flagged conflict: an earlier internal reference (April 2026) shows Cormorant Garamond used as an 88px/300 display headline treatment ("Nimble"), which contradicts this hard rule. The June 2026 guidelines are the more recent, more explicit source and are treated as canonical here — the 88px serif-headline treatment should be considered deprecated, not a current rule. Flag to confirm with Astrid/design if that display treatment should be formally retired or was a one-off.

## Spacing & layout

**Spacing scale — 4px base grid**

`sp-1 4px` · `sp-2 8px` · `sp-3 12px` · `sp-4 16px` · `sp-5 24px` · `sp-6 32px` · `sp-7 48px` · `sp-8 64px` · `sp-9 96px` · `sp-10 128px`

**Corner radii**

`--r-sm 2px` · `--r-md 6px` · `--r-lg 12px` · `--r-xl 24px`

Note: this is separate from the hexagon-specific corner radius rule below — don't conflate the two.

**Shadow system**

Charcoal-tinted (not a separate warm-neutral tint — resolved in Phase 2, see below), three steps:

- `--shadow-sm: 0 1px 2px 0 rgba(45,55,72,0.08)`
- `--shadow-md: 0 4px 6px -1px rgba(45,55,72,0.12), 0 2px 4px -2px rgba(45,55,72,0.10)`
- `--shadow-lg: 0 10px 15px -3px rgba(45,55,72,0.14), 0 4px 6px -4px rgba(45,55,72,0.12)`

**Live implementation values** (from the website build log, `project-nimblebee.md`)

- Container max-width: `1120px`
- Section padding: `clamp(5rem, 10vw, 9rem)`
- Section transitions: of the three documented edge-treatment options (Diagonal Cut, Gentle Curve, Stepped Offset), only **Diagonal Cut** is actually built — via `::after` pseudo-elements, 80px height, `clip-path: polygon(...)`, alternating direction per section (↗ ↙). Gentle Curve and Stepped Offset exist as assets but aren't used anywhere on the live site yet.

## Component styling

Sourced from an internal system reference (April 2026) — the current June 2026 brand guidelines cover identity only (logo/color/type/graphics), not components. Flagging the provenance so it's clear this layer hasn't been re-validated as recently as the identity layer above.

**Buttons**
- Primary: solid Charcoal fill, white text, rounded corners (~`--r-md`/`--r-lg` range)
- Secondary (standard): outline only — Charcoal border and text, transparent/white fill
- Secondary (emphasis variant): solid Coral fill, white text — used for the highest-priority CTA on a page (e.g. "Start a project") when you want it to outrank the primary button visually
- Disabled: light neutral-gray fill, muted gray text, no border

**Form fields**
Thin border, rounded corners, generous padding. Helper text in muted gray below the field. Error state: border and helper text switch to coral/red, e.g. "That doesn't look like a full email."

**Content cards**
Off-white/cream surface, subtle border, generous internal padding. Pattern: small uppercase numbered "eyebrow" label (e.g. "01 — DISCOVERY") in muted gray above a bold Charcoal heading, then body copy below.

**Badges & tags**
Badges are small rounded pills, color-coded by status: mint dot + mint text on light mint surface for positive states ("Sorted"), coral/pink surface for warnings ("Overdue"), outline gray for neutral states ("Draft", "Waiting on client"), solid Charcoal fill with white text for "New." Tags are plain outlined rounded rectangles, no color-coding.

**Links & navigation**
Nav links: Charcoal text, coral underline on the active item. Inline links: underlined. "Arrow" links: Charcoal text with a trailing → for forward navigation ("See how it works →"). Emphasis links: coral, underlined, used sparingly for the most important inline CTA.

**Tables**
Hairline row dividers (no heavy borders), tabular (fixed-width) numerals for aligned numbers, status shown via the same badge pills used elsewhere.

## Imagery & iconography

**Logo system** — three marks: Hexmark (standalone icon, app icons/favicons/social avatars, min 32px, min 200×200px as a social avatar), Logomark (hexmark + wordmark combined, the default lockup for headers/proposals/presentations, min 200px wide), Namemark (wordmark alone, used when the icon already appears elsewhere on the page, min 160px wide).

Three color variants per mark: Lite (for charcoal/dark backgrounds), Dark (for off-white/light backgrounds), Transparent (for photography or custom background colors).

Clear space: minimum clear zone on all sides = the height of the hexmark. Nothing may enter that space.

**Logo do-nots**
- Never rotate or tilt — hexagons are always pointy-top, vertex at 12 and 6 o'clock
- Never use sharp-cornered hexagons — all hexagon vertices must be rounded (see corner radius rule below)
- Never recolor the hexmark — it stays coral on every background
- Never stretch, distort, or change the proportions of any mark
- Never place on a busy image or low-contrast surface without a clear zone
- Never set Cormorant Garamond in or near the logo lockup — Poppins only

**Hexagon corner radius rule** (applies to all hexagon graphic elements, not the spacing-scale radii above): every hexagon vertex must be rounded to 12.5% of the circumradius (R ÷ 8, where R = vertex-to-centre distance). Apply at every scale.

**Class A — Hexagon motifs** (large background graphic elements, stroke only, always pointy-top, 5–8% opacity in code, 2 colourways: charcoal / off-white): Single, Corner Crop, Loose Cluster, Aligned Pair, Repeating Field.

**Class B — Abstract decorative icons** (small accent elements, transparent background, pointy-top, rounded vertices, 4 colourways each — coral / charcoal / emerald / offwhite): Concentric, Diagonal Stripes, Isometric Grid, Radial Lines, Sub-hex Grid, Topographic.

Separately, there's also a **functional UI icon set** built on Lucide, stroke weight 1.75, at 16/20/24px — used for interface/status icons ("Sorted," "Waiting," "Next step," "Handover doc," "Team"), distinct from the decorative hexagon icon system above. Don't conflate the two — Lucide icons are functional/UI, hexagon icons are decorative/brand accents.

**Background textures** (2 colourways each, charcoal/off-white, opacity controlled in code):

| Texture | Size | Target opacity |
|---|---|---|
| Dot Matrix | 800×800px, tileable | 8–12% |
| Connecting Nodes | 1200×800px | 6–10% |
| Noise / Grain | 400×400px PNG, tileable | 3–5% |
| Topographic Lines | 1200×800px | 5–8% |

**Section edge treatments** (3 variants, 2 colourways each, 1440×120px, used at section transitions): Diagonal Cut (sharp, bold/energetic), Gentle Curve (soft, warm/approachable), Stepped Offset (staggered, structural — echoes the grid metaphor).

## Voice principles

Sentence case, direct, no jargon. Short and specific over sweeping and vague. Language of ownership ("yours to edit forever," not "we manage it for you").

**Do**: "Small business systems, properly built." · "Every lead in one place." · "Yours to edit forever."
**Don't**: title case marketing-speak ("Unlock Best-in-Class Business Solutions"), banned filler ("Streamline and empower your workflow"), overpromising with emoji ("Transform your business 🚀").

This matches the live site copy — e.g. "You're not short on tools. You're short on clarity." — plain, sentence case, no jargon, ownership-focused.

## Do / don't summary

- Do keep the hexmark coral on every background. Don't recolor it.
- Do use Cormorant Garamond only as the 24px uppercase eyebrow label. Don't use it in headings, body copy, or the logo.
- Do round every hexagon vertex per the R ÷ 8 rule. Don't use sharp-cornered hexagons at any scale.
- Do write in sentence case with plain, ownership-focused language. Don't use title case, jargon, or emoji-driven overpromising.
- Do keep decorative hexagon textures subtle (5–12% opacity depending on type). Don't let background elements compete with foreground content.

## Gradient & depth system (Phase 2 — decided 2026-07-23)

The current identity is flat by design (see the old Phase 2 flag below, now resolved). This section is a from-zero addition, built strictly from the existing palette — no new brand colors introduced.

**Direction** — every gradient in the system runs at a fixed **135°** (top-left → bottom-right diagonal). Chosen to echo the diagonal-cut section-edge treatment already built on the site (which alternates ↗/↙), rather than introducing an unrelated visual language.

**Section backgrounds**

| Surface | Gradient | Notes |
|---|---|---|
| Charcoal sections | `linear-gradient(135deg, #2D3748 0%, #1A202C 100%)` | Charcoal → neutral-900. Cool-toned, subtle. |
| Off-white sections | `linear-gradient(135deg, #FAF8F6 0%, #D4CEC7 100%)` | Warm Off-white → neutral-300. Deliberately more visible than the charcoal version — compared against neutral-100/-200 and this read best. |

**Content cards**

`linear-gradient(135deg, #FAF8F6 0%, #F3EFEA 100%)` — Warm Off-white → neutral-100. Intentionally subtler than the off-white section-background gradient above: cards are smaller, more content-dense surfaces, so the tonal lift stays barely-there rather than matching full section strength.

**CTA buttons**

| Button | Gradient | Notes |
|---|---|---|
| Coral (secondary-emphasis) | `linear-gradient(135deg, #FF595E 0%, #2D3748 100%)` | Coral → Charcoal, full strength. Tried and rejected: within-family darken to `#D8474B`, opacity-reduced charcoal (55%/27%/10%/5%), and warm-neutral endpoints (`#3D3933`) — all read either too weak or too warm. Full-strength coral-to-charcoal was the best result. |
| Emerald | `linear-gradient(135deg, #10B981 0%, #0B8B62 100%)` | Emerald Mint → darker emerald (the existing "Sorted" semantic text shade), full strength. |

**Shadow tint** — Charcoal-based (`rgba(45,55,72,…)`), not warm-neutral-based. See exact `--shadow-sm/md/lg` values under Spacing & layout above.

**Motion — combined mechanic**

Gradient/depth treatments are not static — they tie into the site's two existing motion patterns:

- **Scroll-reveal** (applies everywhere a section or card already fades + translates in): the gradient angle animates `120° → 135°` over the same duration/easing as the existing fade+translateY, and the shadow lifts from `--shadow-sm` to its resting elevation (`--shadow-md` for cards) in step.
- **Hex watermark sections only**: on top of the scroll-reveal behavior, the background gradient angle additionally drifts `135° → 150°` across the scroll range the watermark rotates over — slower and subtler than the watermark's own rotation, not a 1:1 match. The hero hex scatter/converge sequence is unaffected (no watermark present there).

## Flagged for Phase 2 (resolved this session, unless noted)

1. ~~No gradient system exists.~~ **Resolved** — see "Gradient & depth system" above.
2. ~~Shadow values aren't fully specified.~~ **Resolved** — exact `--shadow-sm/md/lg` values now in the Shadow system section and above.
3. **CSS role tokens** (`--fg-1`, `--bg-1`, etc.) aren't mapped to exact hex values in the source — only their purpose is documented. Still open — fine to leave as-is unless you're handing this to a developer who needs exact values.
4. **The Cormorant-as-display-headline conflict** noted above under Typography — still open, worth a quick explicit decision (deprecated vs. still valid) so it doesn't quietly resurface.
5. ~~Motion.~~ **Resolved** — see "Motion — combined mechanic" above.

## Sources

- `NimbleBee Brand Guildeines v1.0 (Jun 26).pdf` — canonical for brand foundations, color, typography, logo system, graphic elements (hexagon motifs/icons), textures. Most recent source (June 2026).
- `Archive/NimbleBee — design system · print.pdf` — canonical for spacing, corner radii, shadows, components (buttons, forms, cards, badges, links, tables), neutral scale, semantic tokens, voice do/don't. Older (April 2026), filed under Archive, but not superseded by the June doc since the June doc doesn't cover this layer at all.
- `Logo Assets/`, `Hexagon Decorative Icons/`, `Hexagon Background Line Drawings/`, `Background Textures & Treatments/` — SVG source files, used to cross-check exact hex values (`#FAF8F6`, `#2D3748`, `#FF595E`, `#10B981` all confirmed present in the actual asset files, not just the guideline doc).
- `nimblebee.co.za` (live site) — used to confirm current voice/copy is on-brand and to confirm the current visual treatment is flat (no gradients live anywhere on the site today).
- `projects/nimblebee-website/project-nimblebee.md` (MiOS build log) — canonical for live implementation values (container width, section padding, which edge treatment is actually built) and confirms the design token hex values match the guideline docs exactly.
