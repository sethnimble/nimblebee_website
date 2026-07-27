**General**
- [ ] Mobile responsiveness
- [ ] eyebrow text needs to be larger

Nav
- [x] add a nav menu with some of the key sections (all would be too many)
- [x] consider pushing logo and CTA button outside 1200px - full screen instead with reasonable padding

Hero
- [ ] reuse the old hex line graphic in another section

The Problem
- [x] add graphic

What we do
- [ ] title too long?
- [ ] graphic should overlap text in desktop

Why NimbleBee 
- [x] add partner logos
- [ ] try graphic left + text right or centred layout for variation

Who it's for
- [ ] the unselected cards flicker on hover

How it works
- [x] Before - change the placeholder cards for hexes with icons
- [ ] add texture graphic in background

social proof
- [ ] add some more relevant data
- [ ] link cards to case studies
- [x] change section name to 'case studies'
- [ ] add a view button to case studies cards to open video or direct link

Lets talk
- [x] mailto: seth@nimblebee.co.za 
- [ ] change graphic to a better background texture
- [ ] add an inline "prefer WhatsApp?" link next to the Let's Talk button, alongside the existing floating widget
- [ ] replace raw mailto CTA with a small form (name / email / "what's going on") using guiding placeholder text, that builds and opens a pre-filled mailto: link on submit — no backend needed
- [ ] (post-launch, not part of current build) — evolve the form into a guided "how can we help" questionnaire: focuses the visitor on the support they actually need, filters out people NimbleBee can't help, and hands Seth useful starting context for the follow-up call

Footer
- [ ] what policies do i need?
- [ ] add contact info
- [x] Add whatsapp widget

**RESPONSIVE SNAGS**

| Section  | Issue                      | Suggested fix                           | Status |
| -------- | -------------------------- | --------------------------------------- | ------ |
| Nav | menu doesn't fit on mobile | use hamburger menu under a certain size | Done |
| Nav | logo doesn't show at all on mobile | logo gets crowded out by the nav-links grid column; give it a reserved/fixed width (should also resolve once hamburger menu replaces the inline links) | Done — resolved by hamburger fix |
| Nav | 'Let's Talk' button text wraps onto 2 lines on mobile | reduce button font-size and/or padding below a breakpoint so CTA text always stays on one line |        |
| Hero | video crop cuts off the sign graphic's action area (bled off right edge) on mobile aspect ratio | add mobile breakpoint that adjusts `object-position` on the hero video so the crop stays centred on the action area; slightly increase the dark scrim opacity (or add a text-side gradient) for contrast — no new animation needed |        |
| The Problem | 2-column grid never collapses on mobile — text squeezes into a narrow column (wraps word-by-word) and hex animation ends up oddly positioned near the bottom, overlapping the WhatsApp widget | add mobile breakpoint that stacks `.problem-grid` to 1 column (keep current DOM order: eyebrow + heading + paragraph, then animation below) and centre-aligns the text — no markup restructure needed |        |
| What we do | h2 and body copy are left-aligned on mobile (only eyebrow should stay left) | at mobile breakpoint, centre-align the h2 and `.what-body` (add `margin: 0 auto` since they currently use `max-width` without centring); font-size refinement is a separate later pass, not part of this fix |        |
| Why NimbleBee (tools ticker) | On mobile, tapping a ticker item pauses the scroll and shows the caption, but neither ever un-sticks — tapping away doesn't dismiss the caption or resume scrolling. Pause is currently CSS `:hover`-based and the caption is JS `mouseover`/`mouseout`-based, both of which get stuck on touch (no real pointer to "leave"). Also want: keep auto-scroll, but allow manual swipe to move the ticker | needs real touch handling, not just CSS: (1) detect tap on an item — show caption + pause, decouple pause from `:hover` so it's an explicit JS-toggled state; (2) add a document tap-outside / tap-same-item-again listener to dismiss caption + resume scroll; (3) add swipe/drag support on the track (pause auto-scroll on touchstart, apply drag delta as extra transform offset, resume auto-scroll after a short idle delay post-touchend) — same pattern as a draggable auto-scrolling carousel | Needs dev work |
| Who it's for | 3 persona cards (`.persona-cards`, fixed `repeat(3, 1fr)`) don't fit side by side on mobile — get squeezed and cut off | rebuild as full-width swipeable cards using native `scroll-snap` (no custom drag JS) — each card ~90% width so the next one peeks in from the edge as a swipe cue, plus dot indicators below showing position; tap-to-select stays exactly as-is, swiping only browses | Needs dev work |
| Who it's for | before/after panel (`.persona-ba`, fixed `1fr 1fr`) squeezes into 2 narrow columns on mobile | add mobile breakpoint stacking `.persona-ba` to 1 column (Before block above After block) |        |
| How it works | vertical `position: sticky` scroll-jacked layout (`.how-scroll-track`/`.how-sticky`, `js/main.js:456`) completely breaks on mobile — collapses/overlaps, and its scroll-height math bleeds into the "Who it's for" section below | full rewrite: horizontal swipeable "tapestry" — Before/During/After as native `scroll-snap` panels (visual + text stacked per panel, no more 2-column split), horizontal dot rail (tap to jump, coral = current, emerald = visited), continuous opacity/scale feedback as you swipe. Prototype approved by Seth — see artifact https://claude.ai/code/artifact/6b4754df-1db7-4d2b-8097-332502d2a89a. Removes the scroll-jacking entirely, which also fixes the bleed bug | Approved — ready to build |
| Case studies (stats) | h2/subline/body left-aligned on mobile (eyebrow should stay left, rest centred); also want to swap the 3rd stat for two new trust stats | centre-align h2, `.proof-subline` and body paragraph at mobile breakpoint (eyebrow untouched); drop "Systems we use ourselves", add two attributed stats — "86% report working faster with AI" (Anthropic Economic Index, June 2026) and "100M+ people use the tools we build on" (Notion) — with a small source caption under the row; `.proof-stats` becomes a `grid-template-columns: repeat(2, 1fr)` on mobile (stays single-row flex on desktop) |        |
| Case studies (cards) | 3-across `.product-cards` grid doesn't fit on mobile — cards get squeezed/cut off; also needs to support future case studies with mixed media (text always, images usually — sometimes several — video sometimes, hosted on YouTube) | full-bleed section (no `.container` side padding — edge to edge); rebuild as **tap-based** switcher between case studies (tabs/dots, not swipe) to avoid a gesture conflict, with each case study containing its own **swipeable** media gallery (reuses the scroll-snap + dot pattern from the persona picker) so images and a YouTube slide can sit in the same nested carousel; video slides load as a tap-to-play thumbnail rather than an eager iframe embed, to avoid loading YouTube players for slides nobody's scrolled to |        |
| Lets talk | eyebrow ("Let's talk") is centred along with the rest of the section via `.container-center` (`text-align:center` on the whole container) — inconsistent with every other section, where the eyebrow stays left | not breakpoint-specific — applies at all sizes: add `.section-contact .eyebrow { align-self: flex-start; }` to pull just the eyebrow out of the centred flex column while h2, body and CTA stay centred |        |

**NEXT SESSION — implementation kickoff prompt**

> Work through the Responsive Snags table in `NimbleBee website-Snag List.md` one row at a time, top to bottom (Nav → Hero → The Problem → What we do → Why NimbleBee → Who it's for → How it works → Case studies → Lets talk). For each row: implement the fix in `index.html` / `css/main.css` / `js/main.js`, verify it on a mobile viewport (real device or browser preview at ~375–430px width), then mark it done in the Status column (or leave a short note if it's partially done or needs a follow-up decision).
>
> Two rows need special attention rather than a quick CSS tweak:
> - **How it works** — full rewrite to the horizontal swipeable "tapestry" pattern (native `scroll-snap`, dot rail, tap-to-jump). Already prototyped and approved — see the artifact linked in that row before rebuilding it in the real site, to match the approved interaction exactly.
> - **Who it's for** and **Case studies (cards)** — both reuse the same swipeable-card-with-peek-and-dots pattern; **Case studies** additionally needs a tap-based outer switcher (not swipe) wrapping a swipeable inner media gallery, to avoid a nested-swipe gesture conflict — see that row's notes.
>
> Also worth doing alongside this pass, from the General checklist at the top of the file: the "Lets talk" section's mailto-triggering form (replaces the raw `mailto:` link) and the inline WhatsApp CTA link — both were decided in the same session as this responsive audit and fit naturally into the same build pass.
>
> Don't touch the "(post-launch, not part of current build)" questionnaire item — that's deliberately out of scope until Seth confirms the site is live.
