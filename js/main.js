// NimbleBee — main.js

// --- Nav: transparent → solid on scroll ---
const nav = document.getElementById('nav');
function updateNav() {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

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

// --- How It Works — scroll-driven stage stepper ---
const howSection = document.getElementById('how');
const howStageEls = document.querySelectorAll('.how-stage');
const howVisualEls = document.querySelectorAll('.how-visual');
const howRailFill = document.getElementById('howRailFill');
const howHint = document.getElementById('howHint');
const howProcessSteps = document.querySelectorAll('.how-process-step');

if (howSection && howRailFill) {
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

    if (stage > 0 && howHint) howHint.style.opacity = '0';
  }

  function updateHowScroll() {
    const rect = howSection.getBoundingClientRect();
    const scrollable = howSection.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;

    const progress = Math.max(0, Math.min(-rect.top / scrollable, 1));

    // Rail fill: maps full progress to the height of the rail
    howRailFill.style.height = `${progress * 100}%`;

    // Three equal stage bands
    let stage;
    if (progress < 0.33) stage = 0;
    else if (progress < 0.66) stage = 1;
    else stage = 2;

    setHowStage(stage);

    // Within the "During" stage, light up process steps progressively
    if (stage === 1) {
      const sub = (progress - 0.33) / 0.33; // 0–1 within stage 1
      howProcessSteps.forEach((step, i) => {
        step.classList.toggle('active', i <= Math.floor(sub * 3.99));
      });
    } else if (stage === 0) {
      howProcessSteps.forEach(step => step.classList.remove('active'));
    } else {
      howProcessSteps.forEach(step => step.classList.add('active'));
    }
  }

  window.addEventListener('scroll', updateHowScroll, { passive: true });
  updateHowScroll();
}

// --- Scroll reveal ---
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
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
      el.classList.add('visible');
      observer.unobserve(el);
    }
  });
});
