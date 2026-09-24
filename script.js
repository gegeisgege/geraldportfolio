'use strict';

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isApple = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');

// ==================== THEME ====================
const themeBtn = document.getElementById('theme-btn');

function syncThemeColor() {
  const dark = root.getAttribute('data-theme') === 'dark';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#12151a' : '#eeefe9');
}

function toggleTheme() {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
  syncThemeColor();
}

themeBtn?.addEventListener('click', toggleTheme);
syncThemeColor();

// ==================== TOAST + CLIPBOARD ====================
const toastEl = document.getElementById('toast');
let toastTimer;

function toast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    ta.remove();
    return ok;
  }
}

document.querySelectorAll('[data-copy]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const ok = await copyText(btn.dataset.copy);
    toast(ok ? 'Email address copied' : 'Could not copy, please select it manually');
    if (ok) {
      const original = btn.textContent;
      btn.textContent = 'Copied';
      setTimeout(() => { btn.textContent = original; }, 1600);
    }
  });
});

// ==================== NAV: SCROLL STATE + PROGRESS ====================
const nav = document.getElementById('nav');
const progress = document.getElementById('progress');
let scrollTicking = false;

function onScroll() {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    nav?.classList.toggle('scrolled', y > 50);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    scrollTicking = false;
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ==================== MOBILE MENU ====================
const menuBtn = document.getElementById('menuBtn');
const navDrawer = document.getElementById('navDrawer');

function setMenu(open) {
  navDrawer?.classList.toggle('open', open);
  menuBtn?.setAttribute('aria-expanded', String(open));
}

menuBtn?.addEventListener('click', () => setMenu(!navDrawer.classList.contains('open')));
navDrawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

// ==================== SMOOTH SCROLL ====================
function goTo(hash) {
  if (!hash || hash === '#') return false;
  const target = document.querySelector(hash);
  if (!target) return false;
  const top = hash === '#home' ? 0 : target.getBoundingClientRect().top + window.scrollY - 64;
  window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  return true;
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    if (goTo(anchor.getAttribute('href'))) e.preventDefault();
  });
});

// ==================== NAV SCROLLSPY ====================
const spyLinks = document.querySelectorAll('.nav-links a');
const spyMap = new Map(Array.from(spyLinks).map(a => [a.getAttribute('href').slice(1), a]));

const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    spyLinks.forEach(l => l.classList.remove('active'));
    spyMap.get(entry.target.id)?.classList.add('active');
  });
}, { rootMargin: '-45% 0px -50% 0px' });

['home', 'about', 'experience', 'projects', 'research', 'contact'].forEach(id => {
  const el = document.getElementById(id);
  if (el) spy.observe(el);
});

// ==================== SKILL TABS + DENDROGRAM ====================
const dendroBranches = document.querySelectorAll('.dendro-branch');

function setActiveSkillTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === `tab-${tab}`));
  dendroBranches.forEach(g => g.classList.toggle('active', g.dataset.tab === tab));
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => setActiveSkillTab(btn.dataset.tab));
});

document.querySelectorAll('.dendro-leaf-label').forEach(label => {
  label.addEventListener('click', () => setActiveSkillTab(label.dataset.tab));
});

setActiveSkillTab('prog');

// ==================== EXPERIENCE TABS ====================
document.querySelectorAll('.exp-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const exp = btn.dataset.exp;
    document.querySelectorAll('.exp-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.exp-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`exp-${exp}`)?.classList.add('active');
  });
});

// ==================== PROJECT FILTER ====================
const filterBtns = document.querySelectorAll('.filter-btn');
const projCards = document.querySelectorAll('.proj-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.dataset.filter;
    filterBtns.forEach(b => {
      const on = b === btn;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    projCards.forEach(card => {
      card.hidden = !(group === 'all' || card.dataset.group === group);
    });
  });
});

// ==================== STAT COUNTERS ====================
function animateCounter(el, target, decimals, suffix) {
  const duration = 1400;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val = ease * target;
    el.textContent = (decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString()) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsBlock = document.querySelector('.hero-stats-block');
if (statsBlock && !reduceMotion) {
  let fired = false;
  const statsObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || fired) return;
    fired = true;
    statsBlock.querySelectorAll('.hs').forEach(hs => {
      const numEl = hs.querySelector('.hs-num');
      const target = parseFloat(hs.dataset.target);
      const decimals = parseInt(hs.dataset.decimal || '0', 10);
      const suffix = hs.dataset.suffix || '';
      if (numEl && !Number.isNaN(target)) animateCounter(numEl, target, decimals, suffix);
    });
  }, { threshold: 0.5 });
  statsObserver.observe(statsBlock);
}

// ==================== GRADUATION COUNTDOWN ====================
(function graduation() {
  const chip = document.getElementById('gradCountdown');
  const label = document.getElementById('gradLabel');
  if (!chip) return;
  const grad = new Date(2026, 9, 11); // 11 Oct 2026
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((grad - today) / 86400000);
  if (days > 1) chip.textContent = `in ${days} days`;
  else if (days === 1) chip.textContent = 'tomorrow';
  else if (days === 0) chip.textContent = 'today';
  else if (label) { label.textContent = 'Graduated'; chip.textContent = ''; }
})();

// ==================== SCROLL REVEAL ====================
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ==================== HERO: PARTICLE NAME ====================
// The h1 stays in the DOM (SEO, screen readers) but is transparent while the
// canvas paints the same words as particles. Particles start scattered, settle
// into the letterforms, get pushed around by the cursor and turn rust while
// they are disturbed. Click or tap the hero to scatter them.
(function heroParticles() {
  const hero = document.getElementById('home');
  const canvas = document.getElementById('heroCanvas');
  const title = document.getElementById('heroName');
  const fail = () => root.classList.remove('particles');

  if (!hero || !canvas || !title || reduceMotion || !root.classList.contains('particles')) { fail(); return; }
  const ctx = canvas.getContext('2d');
  if (!ctx) { fail(); return; }

  const MAX_PARTICLES = 7500;
  const colors = { ink: '#171b18', accent: '#2b4a7a', rust: '#b5541f' };

  let W = 0, H = 0, dpr = 1, count = 0;
  let px, py, pvx, pvy, phx, phy, pdl, pln, b0, b1, b2;
  let box = { x0: 0, y0: 0, x1: 0, y1: 0 };
  let sig = '';
  let running = false, visible = true;
  let t0 = 0, lastT = 0, maxDelay = 0;
  const mouse = { x: -9999, y: -9999 };

  function readColors() {
    const cs = getComputedStyle(root);
    colors.ink = cs.getPropertyValue('--ink').trim() || colors.ink;
    colors.accent = cs.getPropertyValue('--accent').trim() || colors.accent;
    colors.rust = cs.getPropertyValue('--rust').trim() || colors.rust;
  }

  function sizeCanvas() {
    const r = hero.getBoundingClientRect();
    W = Math.round(r.width);
    H = Math.round(r.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
  }

  function signature() {
    const hr = hero.getBoundingClientRect();
    const tr = title.getBoundingClientRect();
    return [tr.left - hr.left, tr.top - hr.top, tr.width, tr.height].map(Math.round).join('|');
  }

  function applyLetterSpacing(c, value) {
    if ('letterSpacing' in c) c.letterSpacing = !value || value === 'normal' ? '0px' : value;
  }

  // Render the h1 lines to an offscreen canvas and turn filled pixels into particles.
  function sample(intro) {
    const hr = hero.getBoundingClientRect();
    const lines = Array.from(title.querySelectorAll('.hn-line')).map(el => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        text: el.textContent.trim(),
        x: r.left - hr.left,
        y: r.top - hr.top,
        h: r.height,
        font: `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`,
        ls: cs.letterSpacing,
        accent: el.classList.contains('hn-italic')
      };
    });
    if (!lines.length) return false;

    const measure = document.createElement('canvas').getContext('2d');
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    lines.forEach(l => {
      measure.font = l.font;
      applyLetterSpacing(measure, l.ls);
      l.w = measure.measureText(l.text).width;
      x0 = Math.min(x0, l.x);
      y0 = Math.min(y0, l.y);
      x1 = Math.max(x1, l.x + l.w);
      y1 = Math.max(y1, l.y + l.h);
    });

    const pad = 24;
    const ow = Math.ceil(x1 - x0) + pad * 2;
    const oh = Math.ceil(y1 - y0) + pad * 2;
    const off = document.createElement('canvas');
    off.width = ow;
    off.height = oh;
    const octx = off.getContext('2d', { willReadFrequently: true });
    octx.fillStyle = '#000';
    octx.textBaseline = 'middle';
    octx.textAlign = 'left';
    lines.forEach(l => {
      octx.font = l.font;
      applyLetterSpacing(octx, l.ls);
      octx.fillText(l.text, l.x - x0 + pad, l.y - y0 + pad + l.h / 2);
    });
    const data = octx.getImageData(0, 0, ow, oh).data;

    let gap = window.innerWidth < 700 ? 2.2 : 3;
    let pts;
    for (;;) {
      pts = [];
      for (let y = 0; y < oh; y += gap) {
        const row = Math.floor(y) * ow;
        for (let x = 0; x < ow; x += gap) {
          if (data[(row + Math.floor(x)) * 4 + 3] > 140) pts.push(x, y);
        }
      }
      if (pts.length / 2 <= MAX_PARTICLES) break;
      gap += 0.5;
    }

    count = pts.length / 2;
    px = new Float32Array(count); py = new Float32Array(count);
    pvx = new Float32Array(count); pvy = new Float32Array(count);
    phx = new Float32Array(count); phy = new Float32Array(count);
    pdl = new Float32Array(count); pln = new Uint8Array(count);
    b0 = new Uint32Array(count); b1 = new Uint32Array(count); b2 = new Uint32Array(count);
    maxDelay = 0;

    for (let i = 0; i < count; i++) {
      const hx = pts[i * 2] + x0 - pad + (Math.random() - 0.5) * gap * 0.5;
      const hy = pts[i * 2 + 1] + y0 - pad + (Math.random() - 0.5) * gap * 0.5;
      phx[i] = hx;
      phy[i] = hy;
      for (let k = 0; k < lines.length; k++) {
        if (hy >= lines[k].y && hy < lines[k].y + lines[k].h) { pln[i] = lines[k].accent ? 1 : 0; break; }
      }
      if (intro) {
        px[i] = Math.random() * W;
        py[i] = Math.random() * H;
        pdl[i] = 120 + (hx / Math.max(W, 1)) * 450 + Math.random() * 450;
        if (pdl[i] > maxDelay) maxDelay = pdl[i];
      } else {
        px[i] = hx;
        py[i] = hy;
      }
    }

    box = { x0, y0, x1, y1 };
    t0 = performance.now();
    return count > 0;
  }

  function mouseNearBox() {
    if (mouse.x < -9000) return false;
    const cr = canvas.getBoundingClientRect();
    const mx = mouse.x - cr.left, my = mouse.y - cr.top, m = 130;
    return mx > box.x0 - m && mx < box.x1 + m && my > box.y0 - m && my < box.y1 + m;
  }

  function frame(t) {
    if (!running) return;
    const dt = Math.min((t - lastT) / 16.667, 2.5);
    lastT = t;
    const elapsed = t - t0;
    const cr = canvas.getBoundingClientRect();
    const mx = mouse.x - cr.left, my = mouse.y - cr.top;
    const R = 115, R2 = R * R;
    const K = 0.022 * dt;
    const damp = Math.pow(0.86, dt);
    let n0 = 0, n1 = 0, n2 = 0, energy = 0;

    for (let i = 0; i < count; i++) {
      let x = px[i], y = py[i], vx = pvx[i], vy = pvy[i];
      if (elapsed >= pdl[i]) {
        vx += (phx[i] - x) * K;
        vy += (phy[i] - y) * K;
      }
      const dx = x - mx, dy = y - my, d2 = dx * dx + dy * dy;
      if (d2 < R2 && d2 > 0.01) {
        const d = Math.sqrt(d2), f = 1 - d / R, s = (f * f * 4.5 * dt) / d;
        vx += dx * s;
        vy += dy * s;
      }
      vx *= damp; vy *= damp;
      x += vx * dt; y += vy * dt;
      px[i] = x; py[i] = y; pvx[i] = vx; pvy[i] = vy;

      const sp = vx * vx + vy * vy;
      energy += sp + Math.abs(phx[i] - x) + Math.abs(phy[i] - y);
      if (sp > 3) b2[n2++] = i;
      else if (pln[i]) b1[n1++] = i;
      else b0[n0++] = i;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const S = W < 700 ? 1.6 : 2, h = S / 2;
    ctx.fillStyle = colors.ink;
    for (let j = 0; j < n0; j++) { const i = b0[j]; ctx.fillRect(px[i] - h, py[i] - h, S, S); }
    ctx.fillStyle = colors.accent;
    for (let j = 0; j < n1; j++) { const i = b1[j]; ctx.fillRect(px[i] - h, py[i] - h, S, S); }
    ctx.fillStyle = colors.rust;
    for (let j = 0; j < n2; j++) { const i = b2[j]; ctx.fillRect(px[i] - h, py[i] - h, S, S); }

    const settled = energy / count < 0.05 && elapsed > maxDelay + 300;
    if (!visible || (settled && !mouseNearBox())) { running = false; return; }
    requestAnimationFrame(frame);
  }

  function start() {
    if (running || !visible || !count) return;
    running = true;
    lastT = performance.now();
    requestAnimationFrame(frame);
  }

  function burst(cx, cy) {
    const cr = canvas.getBoundingClientRect();
    const x = cx - cr.left, y = cy - cr.top, R = 340;
    for (let i = 0; i < count; i++) {
      const dx = px[i] - x, dy = py[i] - y, d2 = dx * dx + dy * dy;
      if (d2 < R * R) {
        const d = Math.sqrt(d2) || 1, f = 1 - d / R, m = f * f * 26 + Math.random() * 4;
        pvx[i] += (dx / d) * m;
        pvy[i] += (dy / d) * m;
      }
    }
    start();
  }

  function clearMouse() { mouse.x = -9999; mouse.y = -9999; }

  function bind() {
    window.addEventListener('pointermove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!running && mouseNearBox()) start();
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', clearMouse);
    window.addEventListener('blur', clearMouse);
    window.addEventListener('pointerup', e => { if (e.pointerType === 'touch') setTimeout(clearMouse, 200); });
    window.addEventListener('pointercancel', clearMouse);

    hero.addEventListener('pointerdown', e => {
      if (e.target.closest('a, button')) return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      burst(e.clientX, e.clientY);
    });

    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    }).observe(hero);

    let resizeTimer;
    new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        sizeCanvas();
        const s = signature();
        if (s !== sig) { sig = s; sample(false); }
        start();
      }, 120);
    }).observe(hero);

    new MutationObserver(() => { readColors(); start(); })
      .observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  }

  function init() {
    try {
      readColors();
      sizeCanvas();
      sig = signature();
      if (!sample(true)) { fail(); return; }
      bind();
      start();
    } catch (err) {
      fail();
    }
  }

  const fontsReady = document.fonts && document.fonts.load
    ? Promise.race([
        Promise.all([document.fonts.load('480 100px Fraunces'), document.fonts.load('italic 380 100px Fraunces')]),
        new Promise(resolve => setTimeout(resolve, 1800))
      ])
    : Promise.resolve();

  fontsReady.then(init).catch(fail);
})();

// ==================== PAPER VIEWER ====================
const drawer = document.getElementById('paperDrawer');
const drawerFrame = document.getElementById('drawerFrame');
const drawerTitle = document.getElementById('drawerTitle');
const drawerOpen = document.getElementById('drawerOpen');
const drawerDl = document.getElementById('drawerDl');
const drawerClose = document.getElementById('drawerClose');
let drawerReturnFocus = null;

function openDrawer(title, src) {
  drawerReturnFocus = document.activeElement;
  drawerTitle.textContent = title;
  drawerOpen.href = src;
  drawerDl.href = src;
  drawerFrame.src = `${src}#view=FitH`;
  drawer.classList.add('open');
  document.body.classList.add('no-scroll');
  drawerClose.focus();
}

function closeDrawer() {
  if (!drawer.classList.contains('open')) return;
  drawer.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!drawer.classList.contains('open')) drawerFrame.removeAttribute('src'); }, 400);
  drawerReturnFocus?.focus?.();
}

drawer?.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeDrawer));
drawerClose?.addEventListener('click', closeDrawer);

// Only reveal "Read the paper" when the PDF actually exists on the server.
// On file:// previews the check is skipped so the buttons still show.
document.querySelectorAll('[data-pdf]').forEach(card => {
  // accept Windows-style paths and spaces in file names
  const src = encodeURI((card.dataset.pdf || '').replace(/\\/g, '/'));
  const btn = card.querySelector('.read-btn');
  if (!btn || !src) return;

  const enable = () => {
    btn.hidden = false;
    btn.addEventListener('click', () => openDrawer(card.dataset.title || 'Paper', src));
  };

  if (location.protocol === 'file:') { enable(); return; }
  fetch(src, { method: 'HEAD' })
    .then(r => { if (r.ok && (r.headers.get('content-type') || '').includes('pdf')) enable(); })
    .catch(() => {});
});

// ==================== QUICK NAV (Ctrl/Cmd + K) ====================
const palette = document.getElementById('palette');
const paletteInput = document.getElementById('paletteInput');
const paletteList = document.getElementById('paletteList');
const paletteBtn = document.getElementById('paletteBtn');
const kbdHint = document.getElementById('kbdHint');
if (kbdHint) kbdHint.textContent = isApple ? '\u2318 K' : 'Ctrl K';

const paletteItems = [
  { label: 'About', hint: 'Section', run: () => goTo('#about') },
  { label: 'Experience', hint: 'Section', run: () => goTo('#experience') },
  { label: 'Projects', hint: 'Section', run: () => goTo('#projects') },
  { label: 'Research', hint: 'Section', run: () => goTo('#research') },
  { label: 'Contact', hint: 'Section', run: () => goTo('#contact') },
  { label: 'Download CV', hint: 'Action', run: () => {
      const a = document.createElement('a');
      a.href = 'CV_2026_3.pdf';
      a.download = '';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } },
  { label: 'Copy email address', hint: 'Action', run: async () => {
      const ok = await copyText('gerald.pranaja@gmail.com');
      toast(ok ? 'Email address copied' : 'Could not copy, please select it manually');
    } },
  { label: 'Switch theme', hint: 'Action', run: toggleTheme },
  { label: 'Open GitHub', hint: 'Link', run: () => window.open('https://github.com/gegeisgege', '_blank', 'noopener') },
  { label: 'Open LinkedIn', hint: 'Link', run: () => window.open('https://linkedin.com/in/geraldmpillian', '_blank', 'noopener') },
  { label: 'Back to top', hint: 'Section', run: () => goTo('#home') }
];

let paletteMatches = paletteItems;
let paletteSel = 0;
let paletteReturnFocus = null;

function renderPalette() {
  const q = paletteInput.value.trim().toLowerCase();
  paletteMatches = paletteItems.filter(i => i.label.toLowerCase().includes(q));
  paletteSel = Math.min(paletteSel, Math.max(paletteMatches.length - 1, 0));
  paletteList.innerHTML = '';
  if (!paletteMatches.length) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'Nothing matches that. Try "projects" or "cv".';
    paletteList.appendChild(li);
    return;
  }
  paletteMatches.forEach((item, idx) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.id = `pal-${idx}`;
    li.className = idx === paletteSel ? 'sel' : '';
    li.innerHTML = '<span></span><small></small>';
    li.firstChild.textContent = item.label;
    li.lastChild.textContent = item.hint;
    li.addEventListener('mousemove', () => { if (paletteSel !== idx) { paletteSel = idx; markPalette(); } });
    li.addEventListener('click', () => runPalette(idx));
    paletteList.appendChild(li);
  });
  markPalette();
}

function markPalette() {
  Array.from(paletteList.children).forEach((li, idx) => li.classList.toggle('sel', idx === paletteSel));
  paletteInput.setAttribute('aria-activedescendant', paletteMatches.length ? `pal-${paletteSel}` : '');
  paletteList.children[paletteSel]?.scrollIntoView?.({ block: 'nearest' });
}

function openPalette() {
  paletteReturnFocus = document.activeElement;
  paletteInput.value = '';
  paletteSel = 0;
  palette.hidden = false;
  renderPalette();
  paletteInput.focus();
}

function closePalette(restoreFocus = true) {
  if (palette.hidden) return;
  palette.hidden = true;
  if (restoreFocus) paletteReturnFocus?.focus?.();
}

function runPalette(idx) {
  const item = paletteMatches[idx];
  if (!item) return;
  closePalette(false);
  item.run();
}

paletteBtn?.addEventListener('click', openPalette);
palette?.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', () => closePalette()));
paletteInput?.addEventListener('input', () => { paletteSel = 0; renderPalette(); });
paletteInput?.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') { e.preventDefault(); if (paletteMatches.length) { paletteSel = (paletteSel + 1) % paletteMatches.length; markPalette(); } }
  else if (e.key === 'ArrowUp') { e.preventDefault(); if (paletteMatches.length) { paletteSel = (paletteSel - 1 + paletteMatches.length) % paletteMatches.length; markPalette(); } }
  else if (e.key === 'Enter') { e.preventDefault(); runPalette(paletteSel); }
  else if (e.key === 'Tab') { e.preventDefault(); }
});

document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (palette.hidden) openPalette(); else closePalette();
    return;
  }
  if (e.key === 'Escape') {
    if (!palette.hidden) closePalette();
    else if (drawer?.classList.contains('open')) closeDrawer();
    else setMenu(false);
  }
});

// ==================== FLOATING CATS ====================
  const catsLayer = document.getElementById('cats-layer');
  const catNames = ['akukiku_cat2', 'Bumba_dog1', 'Cebi_cat1', 'koboy_dog2', 'landi_dog3', 'lyra_cat3'];
  const MAX_CATS = 36;
  let totalCatClicks = 0;
  let catCount = 0;

  function spawnCat() {
    if (catCount >= MAX_CATS) return;
    catCount++;
    const img = document.createElement('img');
    img.src = `assets/cats/${catNames[Math.floor(Math.random() * catNames.length)]}.png`;
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.classList.add('floating-cat');
    img.style.width = `${70 + Math.random() * 50}px`;

    const startX = Math.random() * (window.innerWidth - 120);
    const startY = Math.random() * (window.innerHeight - 120);
    img.style.left = `${startX}px`;
    img.style.top = `${startY}px`;

    catsLayer?.appendChild(img);
    requestAnimationFrame(() => img.classList.add('visible'));

    moveCat(img, startX, startY);
  }

  function moveCat(img, x, y) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 200 + Math.random() * 300;
    let tx = x + Math.cos(angle) * dist;
    let ty = y + Math.sin(angle) * dist;
    tx = Math.max(0, Math.min(window.innerWidth - 120, tx));
    ty = Math.max(0, Math.min(window.innerHeight - 120, ty));
    const duration = 20000 + Math.random() * 15000;

    img.style.transition = `left ${duration}ms linear, top ${duration}ms linear`;
    requestAnimationFrame(() => {
      img.style.left = `${tx}px`;
      img.style.top = `${ty}px`;
    });

    setTimeout(() => moveCat(img, tx, ty), duration);
  }

  // Cats ignore the pointer so links and buttons stay usable. Hovers and clicks
  // are matched against each cat's current on-screen box instead.
  const INTERACTIVE = 'a, button, input, textarea, select, label, summary, iframe, [role="button"], .drawer, .palette, #nav';

  function catAt(x, y, target) {
    if (target && target.closest && target.closest(INTERACTIVE)) return null;
    const cats = catsLayer ? catsLayer.children : [];
    for (let i = cats.length - 1; i >= 0; i--) {
      const r = cats[i].getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return cats[i];
    }
    return null;
  }

  let hoveredCat = null;
  let hoverTick = false;

  window.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch' || hoverTick) return;
    hoverTick = true;
    const { clientX: x, clientY: y, target } = e;
    requestAnimationFrame(() => {
      hoverTick = false;
      const cat = catAt(x, y, target);
      if (cat !== hoveredCat) {
        hoveredCat?.classList.remove('hovered');
        cat?.classList.add('hovered');
        hoveredCat = cat;
        root.classList.toggle('cat-hover', !!cat);
      }
    });
  }, { passive: true });

  document.addEventListener('click', e => {
    if (e.detail === 0) return; // ignore keyboard-triggered clicks
    const cat = catAt(e.clientX, e.clientY, e.target);
    if (!cat) return;
    totalCatClicks++;
    cat.style.transform = 'scale(1.3) rotate(-8deg)';
    cat.style.opacity = '0.7';
    setTimeout(() => { cat.style.transform = ''; cat.style.opacity = ''; }, 350);
    if (totalCatClicks % 5 === 0) spawnCat();
  });

  if (!reduceMotion) {
    for (let i = 0; i < 12; i++) setTimeout(spawnCat, i * 200);
  }

// ==================== SCROLL CUE DECODE ====================
const WORD = 'scroll';
const NOISE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234!@#%&';
const scLetters = document.querySelectorAll('.sc-letter');

function randChar() {
  return NOISE[Math.floor(Math.random() * NOISE.length)];
}

function runDecode() {
  scLetters.forEach(el => {
    el.textContent = randChar();
    el.className = 'sc-letter';
  });

  let resolved = 0;

  function resolveNext() {
    if (resolved >= WORD.length) {
      setTimeout(() => {
        let bursts = 0;
        const burst = setInterval(() => {
          scLetters.forEach(el => { el.textContent = randChar(); });
          bursts++;
          if (bursts > 4) {
            clearInterval(burst);
            setTimeout(runDecode, 200);
          }
        }, 60);
      }, 1800);
      return;
    }

    const el = scLetters[resolved];
    let scrambles = 0;
    el.classList.add('active');

    const scramble = setInterval(() => {
      el.textContent = randChar();
      scrambles++;
      if (scrambles >= 6) {
        clearInterval(scramble);
        el.textContent = WORD[resolved];
        el.classList.remove('active');
        el.classList.add('resolved');
        resolved++;
        setTimeout(resolveNext, 90);
      }
    }, 40);
  }

  setTimeout(resolveNext, 300);
}

if (scLetters.length && !reduceMotion) runDecode();