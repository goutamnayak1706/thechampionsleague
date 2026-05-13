/* ══════════════════════════════════════════════
   TCL 2026 — Champions Cricket League
   main.js  |  Dynamic interactions
   ══════════════════════════════════════════════ */

/* ── Navbar scroll effect ── */
(function () {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Hamburger / mobile menu ── */
(function () {
  const btn  = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('active', open);
    btn.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
      btn.classList.remove('active');
    }
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ── Scroll-reveal ── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

/* ── Scroll-to-top button ── */
(function () {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 300), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── Countdown timer ── */
(function () {
  const daysEl   = document.getElementById('cd-days');
  const hoursEl  = document.getElementById('cd-hours');
  const minsEl   = document.getElementById('cd-mins');
  const secsEl   = document.getElementById('cd-secs');
  const targetEl = document.getElementById('cd-target');
  const wrap     = document.querySelector('.countdown-digits');
  const started  = document.querySelector('.countdown-started');

  if (!daysEl) return;

  const TARGET     = new Date(2026, 4, 30, 8, 30, 0);
  const END_TARGET = new Date(2026, 4, 30, 21, 15, 0);

  function pad(n) { return String(n).padStart(2, '0'); }

  function flipNum(el, val) {
    const s = pad(val);
    if (el.textContent !== s) {
      el.classList.remove('flip');
      void el.offsetWidth;
      el.classList.add('flip');
      el.textContent = s;
    }
  }

  function tick() {
    const now = Date.now();
    if (now >= END_TARGET.getTime()) {
      if (wrap)     wrap.style.display = 'none';
      if (targetEl) targetEl.style.display = 'none';
      if (started) {
        started.innerHTML = '<i class="bi bi-trophy-fill"></i>&nbsp; Tournament has ended for ' + END_TARGET.getFullYear();
        started.style.display = 'block';
      }
      return;
    }
    const diff = TARGET.getTime() - now;
    if (diff <= 0) {
      if (wrap)     wrap.style.display = 'none';
      if (targetEl) targetEl.style.display = 'none';
      if (started) {
        started.innerHTML = '<i class="bi bi-trophy-fill"></i>&nbsp; Tournament Has Begun!';
        started.style.display = 'block';
      }
      return;
    }
    const totalSecs = Math.floor(diff / 1000);
    const d = Math.floor(totalSecs / 86400);
    const h = Math.floor((totalSecs % 86400) / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    flipNum(daysEl,  d);
    flipNum(hoursEl, h);
    flipNum(minsEl,  m);
    flipNum(secsEl,  s);
  }

  tick();
  const timer = setInterval(() => {
    tick();
    if (Date.now() >= END_TARGET.getTime()) clearInterval(timer);
  }, 1000);
})();

/* ── Schedule tabs ── */
(function () {
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  if (!tabBtns.length) return;
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b   => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });
})();

/* ── Schedule date tabs (inline bar) ── */
(function () {
  function switchScheduleDate(date) {
    document.querySelectorAll('.schedule-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.date === date);
    });
    document.querySelectorAll('.schedule-tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === 'panel-' + date);
    });
    document.querySelectorAll('.schedule-date-navlink').forEach(link => {
      link.classList.toggle('active', link.dataset.date === date);
    });
    const heading = document.getElementById('schedule');
    if (heading) heading.innerHTML = '<i class="bi bi-calendar3"></i> Match Schedule';
  }

  document.querySelectorAll('.schedule-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      clearTeamFilter(false);
      switchScheduleDate(btn.dataset.date);
      document.getElementById('schedule').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.querySelectorAll('.schedule-date-navlink').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      clearTeamFilter(false);
      const date = link.dataset.date;
      switchScheduleDate(date);
      const section = document.getElementById('schedule');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.querySelectorAll('.mobile-schedule-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      clearTeamFilter(false);
      const date = link.dataset.date;
      switchScheduleDate(date);
      const section = document.getElementById('schedule');
      if (section) setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    });
  });

  switchScheduleDate('may30');
})();

/* ── Team filter ── */
function filterByTeam(teamName) {
  const banner  = document.getElementById('team-filter-banner');
  const nameEl  = document.getElementById('team-filter-name');
  const tabsBar = document.getElementById('schedule-tabs-bar');
  const heading = document.getElementById('schedule');

  document.querySelectorAll('.schedule-tab-panel').forEach(panel => panel.classList.add('active'));
  if (tabsBar) tabsBar.style.display = 'none';

  document.querySelectorAll('.match-card').forEach(card => {
    const teams = (card.dataset.teams || '').split('|').map(t => t.trim());
    card.style.display = teams.includes(teamName) ? '' : 'none';
  });

  document.querySelectorAll('.date-divider').forEach(divider => {
    let sibling = divider.nextElementSibling;
    let hasVisible = false;
    while (sibling && !sibling.classList.contains('date-divider')) {
      if (sibling.classList.contains('match-card') && sibling.style.display !== 'none') {
        hasVisible = true;
        break;
      }
      sibling = sibling.nextElementSibling;
    }
    divider.style.display = hasVisible ? '' : 'none';
  });

  if (heading) heading.innerHTML = '<i class="bi bi-people-fill"></i> Matches &mdash; ' + teamName;
  if (nameEl)  nameEl.textContent = teamName;
  if (banner)  banner.style.display = 'flex';
  if (heading) heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearTeamFilter(scroll) {
  const banner     = document.getElementById('team-filter-banner');
  const tabsBar    = document.getElementById('schedule-tabs-bar');
  const teamSelect = document.getElementById('teamFilterSelect');
  if (teamSelect) teamSelect.value = '';
  if (banner)  banner.style.display = 'none';
  if (tabsBar) tabsBar.style.display = '';

  document.querySelectorAll('.match-card').forEach(card => { card.style.display = ''; });
  document.querySelectorAll('.date-divider').forEach(divider => { divider.style.display = ''; });

  const activeBtn = document.querySelector('.schedule-tab-btn.active');
  if (activeBtn) {
    const date = activeBtn.dataset.date;
    document.querySelectorAll('.schedule-tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === 'panel-' + date);
    });
    const heading = document.getElementById('schedule');
    if (heading) heading.innerHTML = '<i class="bi bi-calendar3"></i> Match Schedule';
  }

  if (scroll) {
    const heading = document.getElementById('schedule');
    if (heading) heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

(function () {
  document.querySelectorAll('.team-filter-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const team = link.dataset.team;
      if (team) filterByTeam(team);
    });
  });

  const teamSelect = document.getElementById('teamFilterSelect');
  if (teamSelect) {
    teamSelect.addEventListener('change', () => {
      const team = teamSelect.value;
      if (team) filterByTeam(team);
      else clearTeamFilter(true);
    });
  }

  const clearBtn = document.getElementById('teamFilterClear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearTeamFilter(true);
      if (teamSelect) teamSelect.value = '';
    });
  }
})();

/* ── Match search ── */
(function () {
  const input     = document.getElementById('matchSearch');
  const noResults = document.querySelector('.no-results');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    let visible = 0;
    document.querySelectorAll('.match-card').forEach(card => {
      const show = !q || card.textContent.toLowerCase().includes(q);
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (noResults) noResults.style.display = (q && visible === 0) ? 'block' : 'none';
  });
})();

/* ── Team color map & match card gradients ── */
(function () {
  const TEAM_COLORS = {
    'Asian Tigers':            '#FF1744',
    'Minnal Blasters':         '#FF6D00',
    'Maratha Challengers':     '#FFD600',
    'Striker':                 '#00E676',
    'Holland Capitals Oranje': '#00E5FF',
    'Power Hitters':           '#AA00FF',
    'Dutch Lords':             '#F50057',
    'Orange Ashes Den Haag':   '#FF9100',
    'GLADIATORS XI':           '#AEEA00',
    'Holland Capitals':        '#2979FF',
    'Kombanz':                 '#651FFF',
    'Dutch Royals':            '#FF3D00',
    'Holland Hellfire':        '#00BFA5',
    'Hoysala':                 '#448AFF',
    'Wild Jaguars':            '#D500F9',
    'Utrecht Challengers':     '#FFC400',
    'Kalinga Warriors':        '#FFAB40',
    'Titans Elite XI':         '#FF4081',
    'Minnal Rockers':          '#76FF03',
    'Smashers XI':             '#0091EA',
    'CB11':                    '#EA80FC',
    'Titans XI':               '#FF6E40',
    'Nieuwegein Sunrisers':    '#7C4DFF',
    'Arnhem Super Kings':      '#26C6DA',
  };

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  document.querySelectorAll('.match-card[data-teams]').forEach(card => {
    const parts  = card.dataset.teams.split('|').map(s => s.trim());
    const colorA = TEAM_COLORS[parts[0]];
    const colorB = TEAM_COLORS[parts[1]];
    if (!colorA || !colorB) return;

    card.style.setProperty('--team-a-color', colorA);
    card.style.setProperty('--team-b-color', colorB);

    // Steep gradient — same shape but muted alpha to reduce eye strain
    card.style.background =
      'linear-gradient(to right,' +
      '  ' + hexToRgba(colorA, 0.45) + ' 0%,' +
      '  ' + hexToRgba(colorA, 0.25) + ' 20%,' +
      '  ' + hexToRgba(colorA, 0.10) + ' 38%,' +
      '  rgba(5,8,18,0.92) 50%,' +
      '  ' + hexToRgba(colorB, 0.10) + ' 62%,' +
      '  ' + hexToRgba(colorB, 0.25) + ' 80%,' +
      '  ' + hexToRgba(colorB, 0.45) + ' 100%)';

    card.style.borderColor = hexToRgba(colorA, 0.40);

    card.addEventListener('mouseenter', () => {
      card.style.borderColor = hexToRgba(colorA, 0.65);
      card.style.boxShadow =
        '0 16px 48px rgba(0,0,0,0.6),' +
        '0 0 28px ' + hexToRgba(colorA, 0.30) + ',' +
        '0 0 28px ' + hexToRgba(colorB, 0.30);
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = hexToRgba(colorA, 0.40);
      card.style.boxShadow = '';
    });

    // White text with subtle team color glow
    const teamSpans = card.querySelectorAll('.match-team');
    if (teamSpans[0]) {
      teamSpans[0].style.color      = '#ffffff';
      teamSpans[0].style.textShadow = '0 1px 4px rgba(0,0,0,0.95), 0 0 10px ' + hexToRgba(colorA, 0.50);
      teamSpans[0].style.fontWeight = '800';
    }
    if (teamSpans[1]) {
      teamSpans[1].style.color      = '#ffffff';
      teamSpans[1].style.textShadow = '0 1px 4px rgba(0,0,0,0.95), 0 0 10px ' + hexToRgba(colorB, 0.50);
      teamSpans[1].style.fontWeight = '800';
    }
  });
})();

/* ── Knockout match cards (6 June): random gradients + lightning effects ── */
(function () {
  const panel = document.getElementById('panel-jun6');
  if (!panel) return;

  const koCards = panel.querySelectorAll('.match-card');
  if (!koCards.length) return;

  /* Generate a vivid random HSL colour, avoiding near-black/near-white */
  function randColor() {
    const h = Math.floor(Math.random() * 360);
    const s = 70 + Math.floor(Math.random() * 25);  // 70–95%
    const l = 50 + Math.floor(Math.random() * 15);  // 50–65%
    return { h, s, l, css: 'hsl(' + h + ',' + s + '%,' + l + '%)' };
  }

  function hslToRgba(h, s, l, a) {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const a2 = s * Math.min(l, 1 - l);
    const f  = n => l - a2 * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return 'rgba(' + Math.round(f(0)*255) + ',' + Math.round(f(8)*255) + ',' + Math.round(f(4)*255) + ',' + a + ')';
  }

  koCards.forEach(function (card) {
    /* ── 1. Random gradient background ── */
    const cA = randColor();
    const cB = randColor();

    card.style.setProperty('--ko-color-a', cA.css);
    card.style.setProperty('--ko-color-b', cB.css);

    card.style.background =
      'linear-gradient(135deg,' +
      '  ' + hslToRgba(cA.h, cA.s, cA.l, 0.55) + ' 0%,' +
      '  ' + hslToRgba(cA.h, cA.s, cA.l, 0.30) + ' 20%,' +
      '  ' + hslToRgba(cA.h, cA.s, cA.l, 0.10) + ' 38%,' +
      '  rgba(5,8,18,0.90) 50%,' +
      '  ' + hslToRgba(cB.h, cB.s, cB.l, 0.10) + ' 62%,' +
      '  ' + hslToRgba(cB.h, cB.s, cB.l, 0.30) + ' 80%,' +
      '  ' + hslToRgba(cB.h, cB.s, cB.l, 0.55) + ' 100%)';

    card.style.borderColor = hslToRgba(cA.h, cA.s, cA.l, 0.45);

    /* Update the left accent bar colour */
    card.style.setProperty('--team-a-color', cA.css);
    card.style.setProperty('--team-b-color', cB.css);

    /* Hover: brighter border + dual glow */
    card.addEventListener('mouseenter', function () {
      card.style.borderColor = hslToRgba(cA.h, cA.s, cA.l, 0.75);
      card.style.boxShadow =
        '0 16px 48px rgba(0,0,0,0.65),' +
        '0 0 32px ' + hslToRgba(cA.h, cA.s, cA.l, 0.38) + ',' +
        '0 0 32px ' + hslToRgba(cB.h, cB.s, cB.l, 0.38);
    });
    card.addEventListener('mouseleave', function () {
      card.style.borderColor = hslToRgba(cA.h, cA.s, cA.l, 0.45);
      card.style.boxShadow = '';
    });

    /* ── 2. Lightning overlay ── */
    var lightning = document.createElement('div');
    lightning.className = 'knockout-lightning';
    /* Tint the flash with color A so every card has unique lightning colour */
    lightning.style.background =
      'radial-gradient(ellipse at ' + (30 + Math.random() * 40) + '% ' + (20 + Math.random() * 30) + '%,' +
      '  ' + hslToRgba(cA.h, cA.s, 90, 0.90) + ' 0%,' +
      '  ' + hslToRgba(cA.h, cA.s, 80, 0.55) + ' 18%,' +
      '  ' + hslToRgba(cA.h, cA.s, 70, 0.20) + ' 40%,' +
      '  transparent 70%)';
    card.appendChild(lightning);

    /* Schedule random lightning flashes */
    function scheduleFlash() {
      var delay = 2000 + Math.random() * 5000; /* 2–7 s random interval */
      setTimeout(function () {
        lightning.classList.remove('flash');
        void lightning.offsetWidth; /* reflow to restart animation */
        lightning.classList.add('flash');
        /* Remove class after animation so it can re-trigger */
        lightning.addEventListener('animationend', function handler() {
          lightning.classList.remove('flash');
          lightning.removeEventListener('animationend', handler);
          scheduleFlash();
        });
      }, delay);
    }

    /* Stagger initial flash per card so they don't all fire at once */
    setTimeout(scheduleFlash, Math.random() * 3000);
  });
})();

/* ── Active nav link highlight ── */
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === page || (page === '' && href === 'index.html'))) {
      a.classList.add('active');
    }
  });
})();
