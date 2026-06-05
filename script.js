// ==================== THEME ====================
const html = document.documentElement;
const themeBtn = document.getElementById('theme-btn');

const savedTheme = localStorage.getItem('theme') || 'dark';
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

// ==================== SKILL TABS ====================
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${tab}`)?.classList.add('active');
  });
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
const statData = [
  { target: 3.57,   decimals: 2, suffix: '',  format: null },
  { target: 400000, decimals: 0, suffix: '+', format: 'comma' },
  { target: 20,    decimals: 0, suffix: '+', format: null },
  { target: 3,      decimals: 0, suffix: '',  format: null },
];

function animateCounter(el, data) {
  const { target, decimals, suffix, format } = data;
  const duration = 1400;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val = ease * target;
    let str = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString();
    if (format === 'comma') str = parseInt(str).toLocaleString('en-US');
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
      hsEls.forEach((hs, i) => {
        const numEl = hs.querySelector('.hs-num');
        if (numEl && statData[i]) animateCounter(numEl, statData[i]); // <-- was statData[i].display
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

// ==================== RADAR CHART ====================
function drawRadar() {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const r = Math.min(W, H) * 0.38;

  const labels = ['ML / Data', 'Programming', 'Design', 'Systems', 'Research', '  Communication'];
  const values = [0.88, 0.82, 0.75, 0.72, 0.78, 0.85];
  const n = labels.length;
  const isDark = html.getAttribute('data-theme') !== 'light';
  const accent = isDark ? '#00e6c8' : '#00a896';
  const textCol = isDark ? 'rgba(232,234,240,0.7)' : 'rgba(17,19,24,0.6)';
  const gridCol = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  ctx.clearRect(0, 0, W, H);

  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i, val) => ({
    x: cx + Math.cos(angle(i)) * r * val,
    y: cy + Math.sin(angle(i)) * r * val,
  });

  // Grid rings
  [0.25, 0.5, 0.75, 1].forEach(ring => {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const p = pt(i, ring);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.strokeStyle = gridCol;
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Spokes
  for (let i = 0; i < n; i++) {
    const p = pt(i, 1);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = gridCol;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Data fill
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const p = pt(i, values[i]);
    i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  }
  ctx.closePath();
  ctx.fillStyle = isDark ? 'rgba(0,230,200,0.12)' : 'rgba(0,168,150,0.12)';
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Dots
  for (let i = 0; i < n; i++) {
    const p = pt(i, values[i]);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.fill();
  }

  // Labels
  ctx.font = '500 10px DM Mono, monospace';
  ctx.fillStyle = textCol;
  ctx.textAlign = 'center';
  for (let i = 0; i < n; i++) {
    const p = pt(i, 1.22);
    ctx.fillText(labels[i], p.x, p.y + 4);
  }
}

drawRadar();
themeBtn?.addEventListener('click', () => setTimeout(drawRadar, 50));

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

for (let i = 0; i < 12; i++) setTimeout(spawnCat, i * 200);

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

runDecode();