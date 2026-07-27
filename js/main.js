// NimbleBee — main.js

// --- Icons (lucide, loaded via CDN in index.html) ---
if (window.lucide) {
  lucide.createIcons();
}

// --- Nav: transparent → solid on scroll ---
const nav = document.getElementById('nav');
function updateNav() {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// --- Nav: mobile hamburger toggle ---
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
if (navToggle && navLinks) {
  function closeNavMenu() {
    nav.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNavMenu);
  });
}

// --- Hero video: intro plays once, then crossfades into the loop ---
const heroIntroVideo = document.querySelector('.hero-video--intro');
const heroLoopVideo = document.querySelector('.hero-video--loop');

if (heroIntroVideo && heroLoopVideo) {
  heroIntroVideo.addEventListener('ended', () => {
    heroLoopVideo.play().catch(() => {});
    heroIntroVideo.classList.add('is-hidden');
  });
}

// --- Hero hex animation ---
// Load: scatter → settle into honeycomb (staggered CSS transitions)
// Scroll: honeycomb → converge to centre → brightness pulse → fade out

const heroHexes = document.getElementById('heroHexes');
const hexEls = heroHexes ? Array.from(heroHexes.querySelectorAll('.hero-hex')) : [];

const scatterTransforms = [
  { x:  40,  y:  240, r: -12 },
  { x: 440,  y: -520, r:  38 },
  { x: 680,  y: -240, r: -28 },
  { x: 560,  y:  600, r:  22 },
  { x:-400,  y:  560, r: -40 },
  { x:-640,  y:  120, r:  18 },
  { x:-360,  y: -560, r: -52 },
];

// Offsets from each hex's final CSS position to the centre hex (left:480, top:445).
// delta = (480 - own_left, 445 - own_top)
const convergeOffsets = [
  { x:   0, y:   0 },  // centre — stays put
  { x:-220, y: 380 },  // NE
  { x:-440, y:   0 },  // E
  { x:-220, y:-380 },  // SE
  { x: 220, y:-380 },  // SW
  { x: 440, y:   0 },  // W
  { x: 220, y: 380 },  // NW
];

if (heroHexes && hexEls.length) {
  // --- Load animation ---

  // Set scatter state with no transition
  hexEls.forEach((hex, i) => {
    const s = scatterTransforms[i];
    hex.style.transition = 'none';
    hex.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg)`;
    hex.style.opacity = '0';
  });

  void heroHexes.offsetHeight;

  // Settle into honeycomb (staggered)
  setTimeout(() => {
    hexEls.forEach((hex, i) => {
      hex.style.transition = `transform 1.4s ${i * 0.08}s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 1.2s ${i * 0.08}s ease`;
      hex.style.transform = '';
      hex.style.opacity = '';
    });
  }, 120);

  // After all settle transitions finish, switch hexes to direct JS control
  // so scroll handler can set transforms without fighting CSS transitions.
  // Total settle time: 120 + 1400 + (6 * 80) = ~2000ms
  setTimeout(() => {
    hexEls.forEach(hex => { hex.style.transition = 'none'; });
  }, 2100);

  // --- Scroll animation ---

  const hero = document.getElementById('hero');

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function updateHeroScroll() {
    // Use 55% of hero height as full range — animation completes well before hero exits viewport
    const progress = Math.min(window.scrollY / (hero.offsetHeight * 0.55), 1);

    // Convergence: 0 → 0.55 of scroll
    const convergeT = easeInOut(Math.min(progress / 0.55, 1));

    // Brightness pulse: rises toward convergence peak
    const brightnessT = Math.sin(Math.min(progress / 0.55, 1) * Math.PI * 0.5);
    const brightness = 1 + brightnessT * 1.6;

    // Fade: starts at 0.3, fully gone by 1.0
    const fadeT = Math.max(0, (progress - 0.3) / 0.7);
    const opacity = Math.max(0, 1 - fadeT);

    hexEls.forEach((hex, i) => {
      const o = convergeOffsets[i];
      hex.style.transform = `translate(${o.x * convergeT}px, ${o.y * convergeT}px)`;
      // Brighten the centre hex as others converge onto it
      hex.style.filter = i === 0 ? `brightness(${brightness.toFixed(2)})` : '';
    });

    heroHexes.style.transform = 'translateY(-50%)';
    heroHexes.style.opacity = opacity;
  }

  window.addEventListener('scroll', updateHeroScroll, { passive: true });
}

// --- Problem section: tool-ecosystem hex animation ---
// Loops while the graphic is in view, pauses when scrolled away.
// Sequence: six category badges appear one by one (clockwise), the
// NimbleBee hexmark appears, a hold, then the six pop out in unison
// and the hexmark grows to fill the vacated space, holds, fades out,
// and the whole thing loops.
const problemAnimEl = document.getElementById('problemAnim');
const problemHexGroup = document.getElementById('problemHexGroup');

if (problemAnimEl && problemHexGroup) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const problemCx = 350, problemCy = 350;
  const problemR = 108; // 72 * 1.5 — overall diagram scaled up 50%, still clear of the 700x700 viewBox edges
  const problemDTouch = problemR * Math.sqrt(3); // honeycomb-adjacent (flush) distance
  const problemSpokeGap = 10.5; // 7 * 1.5, scaled with problemR to keep the same proportional breathing room
  const problemDSpoke = problemDTouch + problemSpokeGap;
  const problemGrowScale = (problemDSpoke + problemR) / problemR; // hexmark edge lands exactly on the old outer ring edge
  const problemDisplayH = 2 * problemR;

  function problemSpokeAngle(k) { return (-60 + 60 * k) * Math.PI / 180; }
  function problemSpokePos(k) {
    const a = problemSpokeAngle(k);
    return [problemCx + problemDSpoke * Math.cos(a), problemCy + problemDSpoke * Math.sin(a)];
  }

  const problemAssetBase = 'assets/Problem section animation/';
  const problemCategories = [
    { file: problemAssetBase + 'Web gp.png',        nativeW: 184, nativeH: 210 },
    { file: problemAssetBase + 'Comms gp.png',      nativeW: 184, nativeH: 211 },
    { file: problemAssetBase + 'Automation gp.png', nativeW: 184, nativeH: 210 },
    { file: problemAssetBase + 'Finance gp.png',    nativeW: 184, nativeH: 211 },
    { file: problemAssetBase + 'Projects gp.png',   nativeW: 184, nativeH: 210 },
    { file: problemAssetBase + 'Files gp.png',      nativeW: 184, nativeH: 211 },
  ];
  const problemHexmarkFile = problemAssetBase + 'Hexmark - trans@2x.png';

  // Ambient "hovering above a tabletop" shadow: a soft radial-gradient ellipse
  // painted behind everything. Its resting size is based on the ring's max
  // radial reach (dSpoke + R), which — by construction of problemGrowScale —
  // is the SAME value as the grown hexmark's radius. So one static size
  // covers both the scattered-ring phase and the grown-hexmark phase; the
  // shadow only needs to animate in (as the shapes gather) and out (as they
  // do), never resize in between.
  const problemSvg = problemHexGroup.parentNode;
  const problemMaxReach = problemDSpoke + problemR;
  const problemShadowRx = problemMaxReach * 0.62;
  const problemShadowRy = problemR * 0.111;
  const problemShadowExtraGap = 47; // ~30px at the graphic's typical rendered size (448px for a 700-unit viewBox)
  const problemShadowGap = problemR * 0.056 + problemShadowExtraGap;
  const problemShadowCy = problemCy + problemMaxReach + problemShadowGap + problemShadowRy;

  const problemDefs = document.createElementNS(svgNS, 'defs');
  const problemShadowGradient = document.createElementNS(svgNS, 'radialGradient');
  problemShadowGradient.setAttribute('id', 'problemShadowGradient');
  [
    ['0%', '#2D3748', '0.3'],
    ['60%', '#2D3748', '0.14'],
    ['100%', '#2D3748', '0'],
  ].forEach(([offset, color, opacity]) => {
    const stop = document.createElementNS(svgNS, 'stop');
    stop.setAttribute('offset', offset);
    stop.setAttribute('stop-color', color);
    stop.setAttribute('stop-opacity', opacity);
    problemShadowGradient.appendChild(stop);
  });
  problemDefs.appendChild(problemShadowGradient);
  problemSvg.insertBefore(problemDefs, problemHexGroup);

  const problemShadow = document.createElementNS(svgNS, 'ellipse');
  problemShadow.setAttribute('id', 'problemShadow');
  problemShadow.setAttribute('class', 'problem-shadow');
  problemShadow.setAttribute('cx', problemCx);
  problemShadow.setAttribute('cy', problemShadowCy);
  problemShadow.setAttribute('rx', problemShadowRx);
  problemShadow.setAttribute('ry', problemShadowRy);
  problemShadow.setAttribute('fill', 'url(#problemShadowGradient)');
  problemSvg.insertBefore(problemShadow, problemHexGroup);

  const problemSpokeEls = [];
  problemCategories.forEach((cat, k) => {
    const [x, y] = problemSpokePos(k);
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('class', 'spoke');
    const dispH = problemDisplayH;
    const dispW = cat.nativeW * (dispH / cat.nativeH);
    const img = document.createElementNS(svgNS, 'image');
    img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', cat.file);
    img.setAttribute('href', cat.file);
    img.setAttribute('x', x - dispW / 2);
    img.setAttribute('y', y - dispH / 2);
    img.setAttribute('width', dispW);
    img.setAttribute('height', dispH);
    img.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    g.appendChild(img);
    problemHexGroup.appendChild(g);
    problemSpokeEls.push(g);
  });

  const problemHexmark = document.createElementNS(svgNS, 'g');
  problemHexmark.setAttribute('class', 'hexmark-group');
  problemHexmark.style.setProperty('--grow-scale', problemGrowScale.toFixed(4));
  const problemHexmarkImg = document.createElementNS(svgNS, 'image');
  problemHexmarkImg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', problemHexmarkFile);
  problemHexmarkImg.setAttribute('href', problemHexmarkFile);
  problemHexmarkImg.setAttribute('x', problemCx - problemDisplayH / 2);
  problemHexmarkImg.setAttribute('y', problemCy - problemDisplayH / 2);
  problemHexmarkImg.setAttribute('width', problemDisplayH);
  problemHexmarkImg.setAttribute('height', problemDisplayH);
  problemHexmarkImg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  problemHexmark.appendChild(problemHexmarkImg);
  problemHexGroup.appendChild(problemHexmark);

  // timeline (ms) — agreed pacing
  const PROBLEM_STAGGER_INTERVAL   = 150;
  const PROBLEM_SPOKE_POP_DURATION = 450;
  const PROBLEM_PAUSE_AFTER_SPOKES = 200;
  const PROBLEM_HEXMARK_REVEAL     = 350;
  const PROBLEM_HOLD_ALL_SEVEN     = 600;
  const PROBLEM_POP_OUT_DURATION   = 350;
  const PROBLEM_HEXMARK_GROW       = 550;
  const PROBLEM_HOLD_FINAL         = 2500;
  const PROBLEM_EXIT_DURATION      = 500;
  const PROBLEM_GAP_BEFORE_LOOP    = 400;

  let problemTimers = [];
  let problemRunning = false;
  const problemReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function problemClearTimers() {
    problemTimers.forEach(id => clearTimeout(id));
    problemTimers = [];
  }

  function problemReset() {
    problemSpokeEls.forEach(g => g.classList.remove('show', 'pop-out'));
    problemHexmark.classList.remove('show', 'grow', 'exit');
    problemShadow.classList.remove('show');
  }

  function problemSchedule(fn, delay) {
    const id = setTimeout(fn, delay);
    problemTimers.push(id);
    return id;
  }

  function problemPlayOnce() {
    problemReset();
    let t = 0;

    // shadow grows in step with the gather (spokes staggering in + hexmark reveal)
    problemSchedule(() => problemShadow.classList.add('show'), 0);

    // phase 1: clockwise stagger-in
    problemSpokeEls.forEach((g, i) => {
      problemSchedule(() => g.classList.add('show'), i * PROBLEM_STAGGER_INTERVAL);
    });
    t = (problemSpokeEls.length - 1) * PROBLEM_STAGGER_INTERVAL + PROBLEM_SPOKE_POP_DURATION;

    // phase 2: hexmark reveal
    t += PROBLEM_PAUSE_AFTER_SPOKES;
    problemSchedule(() => problemHexmark.classList.add('show'), t);
    t += PROBLEM_HEXMARK_REVEAL;

    // phase 3: hold all seven
    t += PROBLEM_HOLD_ALL_SEVEN;

    // phase 4: unison pop-out of the six
    problemSchedule(() => {
      problemSpokeEls.forEach(g => { g.classList.remove('show'); g.classList.add('pop-out'); });
    }, t);
    t += PROBLEM_POP_OUT_DURATION;

    // phase 5: hexmark grows to fill vacated space
    problemSchedule(() => { problemHexmark.classList.remove('show'); problemHexmark.classList.add('grow'); }, t);
    t += PROBLEM_HEXMARK_GROW;

    // phase 6: hold final state
    t += PROBLEM_HOLD_FINAL;

    // phase 7: exit — fade + slight scale down (shadow fades out with it)
    problemSchedule(() => {
      problemHexmark.classList.remove('grow');
      problemHexmark.classList.add('exit');
      problemShadow.classList.remove('show');
    }, t);
    t += PROBLEM_EXIT_DURATION;

    // loop
    t += PROBLEM_GAP_BEFORE_LOOP;
    problemSchedule(() => { if (problemRunning) problemPlayOnce(); }, t);
  }

  function problemStart() {
    if (problemRunning) return;
    problemRunning = true;
    if (problemReduceMotion) {
      // static fallback: show the resolved end-state only, no animation
      problemReset();
      problemSpokeEls.forEach(g => { g.style.opacity = '0'; g.style.transform = 'scale(0)'; });
      problemHexmark.style.opacity = '1';
      problemHexmark.style.transform = `scale(${problemGrowScale})`;
      problemShadow.style.opacity = '1';
      problemShadow.style.transform = 'scale(1)';
      return;
    }
    problemPlayOnce();
  }

  function problemStop() {
    if (!problemRunning) return;
    problemRunning = false;
    problemClearTimers();
  }

  const problemObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) problemStart();
      else problemStop();
    });
  }, { threshold: 0.3 });
  problemObserver.observe(problemAnimEl);
}

// --- What We Do hex — scroll-driven rotation ---
// Rotates 360° across the full time the section occupies the viewport.
// progress = 0 when section top hits viewport bottom, 1 when section bottom hits viewport top.
const whatSection = document.getElementById('what');
const whatHexIcon = document.getElementById('whatHexIcon');

if (whatSection && whatHexIcon) {
  function updateHexRotation() {
    const rect = whatSection.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = vh + whatSection.offsetHeight;
    const elapsed = vh - rect.top;
    const progress = Math.max(0, Math.min(elapsed / total, 1));
    whatHexIcon.style.transform = `translateY(-50%) rotate(${progress * 360}deg)`;
  }
  window.addEventListener('scroll', updateHexRotation, { passive: true });
  updateHexRotation();
}

// --- Persona picker (Section 05) ---
const personaData = {
  solo: {
    before: [
      'Client onboarding done manually every time',
      'Invoices in one app, comms in another',
      'Proposals scattered across folders',
      'No system for following up on leads',
    ],
    after: [
      'One intake-to-invoice workflow',
      'New clients plug straight in',
      'Proposals, delivery, and billing connected',
      'Follow-ups that happen without you',
    ],
  },
  trades: {
    before: [
      'Quotes sent on WhatsApp and forgotten',
      'Job sheets on paper or in your head',
      'Invoices sent late, payment chased manually',
      'No record of what was agreed',
    ],
    after: [
      'Quotes, jobs, and invoices in one place',
      'Digital job cards, accessible on site',
      'Invoice on completion — payment faster',
      'Everything documented and findable',
    ],
  },
  ngo: {
    before: [
      'Grant tracking buried in spreadsheets',
      'Donor comms scattered across email and WhatsApp',
      'Board reporting done manually every quarter',
      'Volunteer coordination by word of mouth',
    ],
    after: [
      'Grants, donors, and reporting in one system',
      'Comms logged and searchable',
      'Reports that pull from live data',
      'Volunteer hours tracked and acknowledged',
    ],
  },
};

function buildPersonaPanel(key) {
  const d = personaData[key];
  const beforeItems = d.before.map(t => `<li>${t}</li>`).join('');
  const afterItems  = d.after.map(t => `<li>${t}</li>`).join('');
  return `
    <div class="persona-panel-inner">
      <div class="persona-ba">
        <div class="persona-ba-col persona-ba-col--before">
          <span class="persona-ba-col-label">Before</span>
          <ul class="persona-ba-list">${beforeItems}</ul>
        </div>
        <div class="persona-ba-col persona-ba-col--after">
          <span class="persona-ba-col-label">After</span>
          <ul class="persona-ba-list">${afterItems}</ul>
        </div>
      </div>
      <div class="persona-panel-cta">
        <a href="#contact" class="btn btn-coral">This sounds like me &rarr;</a>
      </div>
    </div>`;
}

const personaCards = document.querySelectorAll('.persona-card');
const personaPanel = document.getElementById('personaPanel');

function selectPersona(key, skipAnim) {
  personaCards.forEach(c => {
    const isActive = c.dataset.persona === key;
    c.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  if (skipAnim) {
    personaPanel.innerHTML = buildPersonaPanel(key);
    personaPanel.classList.add('visible');
    return;
  }

  personaPanel.classList.remove('visible');
  setTimeout(() => {
    personaPanel.innerHTML = buildPersonaPanel(key);
    personaPanel.classList.add('visible');
  }, 220);
}

if (personaCards.length && personaPanel) {
  personaCards.forEach(card => {
    card.addEventListener('click', () => selectPersona(card.dataset.persona, false));
  });
  selectPersona('solo', true);
}

// --- Persona cards (mobile): dots track swipe position, not selection ---
// Native scroll-snap handles the swipe itself — no custom drag JS needed —
// this just keeps the dot row in sync with whichever card is in view.
const personaCardsEl = document.querySelector('.persona-cards');
const personaDots = document.querySelectorAll('.persona-dot');

if (personaCardsEl && personaDots.length) {
  personaDots[0].classList.add('is-active');

  const dotObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.intersectionRatio < 0.6) return;
        const index = Array.from(personaCards).indexOf(entry.target);
        personaDots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
      });
    },
    { root: personaCardsEl, threshold: [0.6] }
  );
  personaCards.forEach(card => dotObserver.observe(card));
}

// --- How It Works (desktop) — vertical scroll-driven stage stepper ---
const howSection = document.getElementById('how');
const howStageEls = document.querySelectorAll('.how-desktop .how-stage');
const howVisualEls = document.querySelectorAll('.how-desktop .how-visual');
const howRailFillD = document.getElementById('howRailFill');
const howHintD = document.getElementById('howHint');
const howProcessStepsD = document.querySelectorAll('.how-desktop .how-process-step');

if (howSection && howRailFillD) {
  let currentStage = 0;

  function setHowStage(stage) {
    if (stage === currentStage) return;
    currentStage = stage;

    howStageEls.forEach((el, i) => {
      el.classList.toggle('active', i === stage);
      el.classList.toggle('passed', i < stage);
    });

    howVisualEls.forEach((el, i) => {
      el.classList.toggle('active', i === stage);
    });

    if (stage > 0 && howHintD) howHintD.style.opacity = '0';
  }

  function updateHowScroll() {
    const rect = howSection.getBoundingClientRect();
    const scrollable = howSection.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;

    const progress = Math.max(0, Math.min(-rect.top / scrollable, 1));

    // Rail fill: maps full progress to the height of the rail
    howRailFillD.style.height = `${progress * 100}%`;

    // Three equal stage bands
    let stage;
    if (progress < 0.33) stage = 0;
    else if (progress < 0.66) stage = 1;
    else stage = 2;

    setHowStage(stage);

    // Within the "During" stage, light up process steps progressively
    if (stage === 1) {
      const sub = (progress - 0.33) / 0.33; // 0–1 within stage 1
      howProcessStepsD.forEach((step, i) => {
        step.classList.toggle('active', i <= Math.floor(sub * 3.99));
      });
    } else if (stage === 0) {
      howProcessStepsD.forEach(step => step.classList.remove('active'));
    } else {
      howProcessStepsD.forEach(step => step.classList.add('active'));
    }
  }

  window.addEventListener('scroll', updateHowScroll, { passive: true });
  updateHowScroll();
}

// --- How It Works (mobile) — horizontal tapestry: native scroll-snap track + tap-to-jump dots ---
const howTrack = document.getElementById('howTrack');
const howRailFill = document.getElementById('howRailFillM');
const howHint = document.getElementById('howHintM');

if (howTrack && howRailFill) {
  const howPanels = Array.from(howTrack.querySelectorAll('.how-panel'));
  const howDots = Array.from(document.querySelectorAll('.how-mobile .how-dot'));
  const howLabels = Array.from(document.querySelectorAll('.how-mobile .how-rail-labels span'));
  const howReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const howVisited = howPanels.map((_, i) => i === 0);
  let howHintDismissed = false;
  let howTicking = false;

  // "During" panel: numbers read as coral (unchecked) and flip to emerald one at a
  // time, 3s apart, like someone reading the list and mentally checking each off.
  // Restarts from scratch every time the panel comes back into focus.
  const howProcessNums = Array.from(document.querySelectorAll('.how-mobile .how-process-num'));
  let howDuringTimers = [];
  let howDuringFocused = false;

  function stopDuringAnimation(resetVisual) {
    howDuringTimers.forEach(t => clearTimeout(t));
    howDuringTimers = [];
    if (resetVisual) howProcessNums.forEach(num => num.classList.remove('is-checked'));
  }

  function startDuringAnimation() {
    stopDuringAnimation(true);
    howProcessNums.forEach((num, i) => {
      howDuringTimers.push(setTimeout(() => num.classList.add('is-checked'), (i + 1) * 3000));
    });
  }

  function howFocusIndex(trackRect) {
    let best = 0;
    let bestDist = Infinity;
    howPanels.forEach((panel, i) => {
      const r = panel.getBoundingClientRect();
      const d = Math.abs(r.left - trackRect.left);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  }

  function updateHowTrack() {
    howTicking = false;
    const trackRect = howTrack.getBoundingClientRect();
    const idx = howFocusIndex(trackRect);

    howPanels.forEach((panel, i) => {
      const r = panel.getBoundingClientRect();
      const norm = Math.min(Math.abs(r.left - trackRect.left) / trackRect.width, 1);
      const op = 1 - norm * 0.6;
      panel.style.opacity = op.toFixed(3);
      panel.style.transform = howReducedMotion ? 'none' : `scale(${(1 - norm * 0.08).toFixed(3)})`;
      panel.classList.toggle('is-focus', i === idx);
    });

    howVisited[idx] = true;

    howDots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === idx);
      dot.classList.toggle('is-visited', howVisited[i] && i !== idx);
    });
    howLabels.forEach((label, i) => {
      label.classList.toggle('is-active', i === idx);
    });
    howRailFill.style.width = `${(idx / (howPanels.length - 1)) * 100}%`;

    const duringFocused = idx === 1;
    if (duringFocused && !howDuringFocused) {
      startDuringAnimation();
    } else if (!duringFocused && howDuringFocused) {
      stopDuringAnimation(true);
    }
    howDuringFocused = duringFocused;

    if (!howHintDismissed && idx !== 0 && howHint) {
      howHintDismissed = true;
      howHint.style.opacity = '0';
    }
  }

  howTrack.addEventListener('scroll', () => {
    if (!howHintDismissed && howTrack.scrollLeft > 12 && howHint) {
      howHintDismissed = true;
      howHint.style.opacity = '0';
    }
    if (!howTicking) {
      howTicking = true;
      requestAnimationFrame(updateHowTrack);
    }
  }, { passive: true });

  howDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const i = parseInt(dot.getAttribute('data-i'), 10);
      const panel = howPanels[i];
      const target = panel.getBoundingClientRect().left - howTrack.getBoundingClientRect().left + howTrack.scrollLeft;
      howTrack.scrollTo({ left: target, behavior: howReducedMotion ? 'auto' : 'smooth' });
    });
  });

  updateHowTrack();
}

// --- Scroll reveal ---
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.05 }
);

revealEls.forEach(el => observer.observe(el));

// Immediately reveal anything already in the viewport on load
window.addEventListener('load', () => {
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('is-visible');
      observer.unobserve(el);
    }
  });
});

// --- Count-up stats ---
const countEls = document.querySelectorAll('[data-count-to]');
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.countTo);
      const suffix = el.dataset.suffix || '';
      const duration = 900;
      const t0 = performance.now();
      function step(t) {
        const p = Math.min(1, (t - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.4 }
);
countEls.forEach(el => countObserver.observe(el));

// --- Tools ticker: auto-scroll + hover tooltip + touch support (Why NimbleBee) ---
// Position is driven by rAF (not a CSS keyframe animation) so pause/drag/resume
// can all share one source of truth — touch has no real ":hover" to un-stick,
// so pause has to be explicit JS state rather than CSS.
const tickerEl = document.querySelector('.tools-ticker');
const tickerTrack = document.querySelector('.tools-ticker-track');
const tickerTooltip = document.getElementById('toolsTickerTooltip');

if (tickerEl && tickerTrack && tickerTooltip) {
  const tickerReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const halfWidth = tickerTrack.scrollWidth / 2;
  const TICKER_SPEED = halfWidth / 32000; // px/ms — matches the old 32s CSS loop
  const DRAG_RESUME_DELAY = 600;

  let pos = 0;
  let lastFrame = null;
  let hoverPaused = false;
  let tapPaused = false;
  let dragPaused = false;
  let dragging = false;
  let dragStartX = 0;
  let dragStartPos = 0;
  let resumeTimer = null;
  let activeCaptionItem = null;

  function showTickerCaption(item) {
    const label = item.querySelector('.tools-ticker-label');
    const rect = label.getBoundingClientRect();
    tickerTooltip.textContent = item.dataset.caption;
    const margin = 16;
    const half = tickerTooltip.offsetWidth / 2;
    const center = rect.left + rect.width / 2;
    const clampedCenter = Math.min(
      Math.max(center, half + margin),
      window.innerWidth - half - margin
    );
    tickerTooltip.style.left = `${clampedCenter}px`;
    tickerTooltip.style.top = `${rect.bottom + 12}px`;
    tickerTooltip.classList.add('is-visible');
  }

  function hideTickerCaption() {
    tickerTooltip.classList.remove('is-visible');
  }

  function dismissTapCaption() {
    if (!activeCaptionItem) return;
    activeCaptionItem = null;
    tapPaused = false;
    hideTickerCaption();
  }

  function tick(now) {
    if (lastFrame === null) lastFrame = now;
    const dt = now - lastFrame;
    lastFrame = now;

    if (!dragging && !hoverPaused && !tapPaused && !dragPaused && !tickerReduceMotion) {
      pos -= TICKER_SPEED * dt;
    }
    if (pos <= -halfWidth) pos += halfWidth;
    if (pos > 0) pos -= halfWidth;
    tickerTrack.style.transform = `translateX(${pos}px)`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Desktop mouse: hover an item shows its caption; hovering the ticker pauses.
  tickerEl.addEventListener('mouseover', (e) => {
    const item = e.target.closest('.tools-ticker-item');
    if (!item || !item.dataset.caption) return;
    showTickerCaption(item);
  });

  tickerEl.addEventListener('mouseout', (e) => {
    const item = e.target.closest('.tools-ticker-item');
    if (!item || item.contains(e.relatedTarget)) return;
    hideTickerCaption();
  });

  tickerEl.addEventListener('mouseenter', () => { hoverPaused = true; });
  tickerEl.addEventListener('mouseleave', () => { hoverPaused = false; });

  // Touch: tap an item to pin its caption + pause (tap again, or tap outside,
  // to dismiss). Any touch on the track can also drag it — auto-scroll
  // resumes a short idle delay after the finger lifts.
  tickerEl.addEventListener('touchstart', (e) => {
    const item = e.target.closest('.tools-ticker-item');
    if (item && item.dataset.caption) {
      if (activeCaptionItem === item) {
        dismissTapCaption();
      } else {
        activeCaptionItem = item;
        tapPaused = true;
        showTickerCaption(item);
      }
    }

    dragging = true;
    dragPaused = true;
    if (resumeTimer) { clearTimeout(resumeTimer); resumeTimer = null; }
    dragStartX = e.touches[0].clientX;
    dragStartPos = pos;
  }, { passive: true });

  tickerEl.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    pos = dragStartPos + (e.touches[0].clientX - dragStartX);
    // paint immediately rather than waiting for the next rAF tick, so the
    // track tracks the finger 1:1 with no perceptible lag
    tickerTrack.style.transform = `translateX(${pos}px)`;
  }, { passive: true });

  function endTickerDrag() {
    if (!dragging) return;
    dragging = false;
    resumeTimer = setTimeout(() => {
      dragPaused = false;
      resumeTimer = null;
    }, DRAG_RESUME_DELAY);
  }

  tickerEl.addEventListener('touchend', endTickerDrag);
  tickerEl.addEventListener('touchcancel', endTickerDrag);

  document.addEventListener('touchstart', (e) => {
    if (activeCaptionItem && !tickerEl.contains(e.target)) {
      dismissTapCaption();
    }
  });
}
