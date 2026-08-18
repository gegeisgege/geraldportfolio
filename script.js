// ==================== THEME ====================
const html = document.documentElement;
const themeBtn = document.getElementById('theme-btn');

const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeBtn?.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ==================== NAV SCROLL ====================
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ==================== MOBILE MENU ====================
const menuBtn = document.getElementById('menuBtn');
const navDrawer = document.getElementById('navDrawer');

menuBtn?.addEventListener('click', () => {
  navDrawer.classList.toggle('open');
});

navDrawer?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navDrawer.classList.remove('open'));
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({ top: target.offsetTop - 64, behavior: 'smooth' });
    }
  });
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

// ==================== STAT COUNTERS ====================
// Values mirror each .hs element's own data-target/data-decimal/data-suffix,
// read directly off the markup so the two never drift out of sync.
function animateCounter(el, target, decimals, suffix) {
  const duration = 1400;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val = ease * target;
    const str = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString();
    el.textContent = str + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsBlock = document.querySelector('.hero-stats-block');
if (statsBlock) {
  const hsEls = statsBlock.querySelectorAll('.hs');
  let fired = false;
  const statsObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !fired) {
      fired = true;
      hsEls.forEach(hs => {
        const numEl = hs.querySelector('.hs-num');
        const target = parseFloat(hs.dataset.target);
        const decimals = parseInt(hs.dataset.decimal || '0', 10);
        const suffix = hs.dataset.suffix || '';
        if (numEl && !Number.isNaN(target)) animateCounter(numEl, target, decimals, suffix);
      });
    }
  }, { threshold: 0.5 });
  statsObserver.observe(statsBlock);
}

// ==================== SCROLL REVEAL ====================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ==================== FLOATING CATS ====================
const catsLayer = document.getElementById('cats-layer');
const catNames = ['akukiku_cat2', 'Bumba_dog1', 'Cebi_cat1', 'koboy_dog2', 'landi_dog3', 'lyra_cat3'];
let totalCatClicks = 0;

function spawnCat() {
  const img = document.createElement('img');
  img.src = `assets/cats/${catNames[Math.floor(Math.random() * catNames.length)]}.png`;
  img.classList.add('floating-cat');
  img.style.width = `${70 + Math.random() * 50}px`;

  const startX = Math.random() * (window.innerWidth - 120);
  const startY = Math.random() * (window.innerHeight - 120);
  img.style.left = `${startX}px`;
  img.style.top = `${startY}px`;

  catsLayer?.appendChild(img);
  requestAnimationFrame(() => img.classList.add('visible'));

  moveCat(img, startX, startY);

  img.addEventListener('click', () => {
    totalCatClicks++;
    img.style.transform = 'scale(1.3) rotate(-8deg)';
    img.style.opacity = '0.7';
    setTimeout(() => { img.style.transform = ''; img.style.opacity = ''; }, 350);
    if (totalCatClicks % 5 === 0) spawnCat();
  });
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

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
        const bust = setInterval(() => {
          scLetters.forEach(el => el.textContent = randChar());
          bursts++;
          if (bursts > 4) {
            clearInterval(bust);
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

if (scLetters.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  runDecode();
}