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
  // Close menu when a mobile nav link is clicked (but not group labels)
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

  // Tournament start: May 30, 2026, 8:30 AM
  const TARGET = new Date(2026, 4, 30, 8, 30, 0);
  // Tournament end cutoff: 2 hours after Grand Final end (7:15 PM → 9:15 PM)
  const END_TARGET = new Date(2026, 4, 30, 21, 15, 0);

  function pad(n) { return String(n).padStart(2, '0'); }

  function flipNum(el, val) {
    const s = pad(val);
    if (el.textContent !== s) {
      el.classList.remove('flip');
      void el.offsetWidth; // reflow
      el.classList.add('flip');
      el.textContent = s;
    }
  }

  function tick() {
    const now  = Date.now();

    if (now >= END_TARGET.getTime()) {
      // Tournament is over
      if (wrap)    wrap.style.display = 'none';
      if (targetEl) targetEl.style.display = 'none';
      if (started) {
        started.innerHTML = '<i class="bi bi-trophy-fill"></i>&nbsp; Tournament has ended for ' + END_TARGET.getFullYear();
        started.style.display = 'block';
      }
      return;
    }

    const diff = TARGET.getTime() - now;

    if (diff <= 0) {
      // Tournament has started but not yet ended
      if (wrap)    wrap.style.display = 'none';
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
    const m = Math.floor((totalSecs % 3600)  /   60);
    const s = totalSecs % 60;

    flipNum(daysEl,  d);
    flipNum(hoursEl, h);
    flipNum(minsEl,  m);
    flipNum(secsEl,  s);
  }

  tick();
  const timer = setInterval(() => {
    tick();
    if (Date.now() >= END_TARGET.getTime()) {
      clearInterval(timer);
    }
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
    // Toggle tab buttons
    document.querySelectorAll('.schedule-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.date === date);
    });
    // Toggle panels
    document.querySelectorAll('.schedule-tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === 'panel-' + date);
    });
    // Update active state in nav dropdown links
    document.querySelectorAll('.schedule-date-navlink').forEach(link => {
      link.classList.toggle('active', link.dataset.date === date);
    });
    // Update section heading text
    const heading = document.getElementById('schedule');
    if (heading) {
      const labels = {
        may30: '30 May 2026',
        may31: '31 May 2026',
        jun6:  '6 June 2026'
      };
      heading.innerHTML = '<i class="bi bi-calendar3"></i> Match Schedule &mdash; ' + (labels[date] || '');
    }
  }

  // Inline tab bar buttons
  document.querySelectorAll('.schedule-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      clearTeamFilter(false); // clear filter when switching dates
      switchScheduleDate(btn.dataset.date);
      document.getElementById('schedule').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Nav dropdown date links
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

  // Mobile schedule date links
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

  // Default: show may30
  switchScheduleDate('may30');
})();

/* ── Team filter ── */
function filterByTeam(teamName) {
  const banner     = document.getElementById('team-filter-banner');
  const nameEl     = document.getElementById('team-filter-name');
  const tabsBar    = document.getElementById('schedule-tabs-bar');
  const heading    = document.getElementById('schedule');

  // Show all date panels
  document.querySelectorAll('.schedule-tab-panel').forEach(panel => {
    panel.classList.add('active');
  });

  // Hide date tabs bar
  if (tabsBar) tabsBar.style.display = 'none';

  // Filter match cards: show only those containing this team
  document.querySelectorAll('.match-card').forEach(card => {
    const teams = (card.dataset.teams || '').split('|').map(t => t.trim());
    card.style.display = teams.includes(teamName) ? '' : 'none';
  });

  // Update heading
  if (heading) {
    heading.innerHTML = '<i class="bi bi-people-fill"></i> Matches &mdash; ' + teamName;
  }

  // Show banner
  if (nameEl)  nameEl.textContent = teamName;
  if (banner)  banner.style.display = 'flex';

  // Scroll to schedule
  if (heading) heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearTeamFilter(scroll) {
  const banner     = document.getElementById('team-filter-banner');
  const tabsBar    = document.getElementById('schedule-tabs-bar');
  const teamSelect = document.getElementById('teamFilterSelect');
  if (teamSelect) teamSelect.value = '';

  if (banner)  banner.style.display = 'none';
  if (tabsBar) tabsBar.style.display = '';

  // Reset all match cards visibility
  document.querySelectorAll('.match-card').forEach(card => {
    card.style.display = '';
  });

  // Re-apply current active date tab
  const activeBtn = document.querySelector('.schedule-tab-btn.active');
  if (activeBtn) {
    const date = activeBtn.dataset.date;
    document.querySelectorAll('.schedule-tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === 'panel-' + date);
    });
    const heading = document.getElementById('schedule');
    if (heading) {
      const labels = { may30: '30 May 2026', may31: '31 May 2026', jun6: '6 June 2026' };
      heading.innerHTML = '<i class="bi bi-calendar3"></i> Match Schedule &mdash; ' + (labels[date] || '');
    }
  }

  if (scroll) {
    const heading = document.getElementById('schedule');
    if (heading) heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

(function () {
  // Desktop & mobile team filter links
  document.querySelectorAll('.team-filter-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const team = link.dataset.team;
      if (team) filterByTeam(team);
    });
  });

  // Team filter select dropdown
  const teamSelect = document.getElementById('teamFilterSelect');
  if (teamSelect) {
    teamSelect.addEventListener('change', () => {
      const team = teamSelect.value;
      if (team) {
        filterByTeam(team);
      } else {
        clearTeamFilter(true);
      }
    });
  }

  // Clear filter button
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
      const text = card.textContent.toLowerCase();
      const show = !q || text.includes(q);
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (noResults) noResults.style.display = (q && visible === 0) ? 'block' : 'none';
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
