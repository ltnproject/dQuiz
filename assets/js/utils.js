// ── TOAST ──────────────────────────────────────────────────────
export function toast(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icons[type] || ''}</span><span>${msg}</span>`;
  container.appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 300);
  }, 3200);
}

// ── LOADER ─────────────────────────────────────────────────────
export function showLoader() {
  let l = document.getElementById('page-loader');
  if (!l) {
    l = document.createElement('div');
    l.id = 'page-loader';
    l.className = 'page-loader';
    l.innerHTML = `<div style="text-align:center">
      <div style="width:52px;height:52px;background:linear-gradient(135deg,#6C5CE7,#00D2FF);border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:24px;">⚡</div>
      <div class="dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
    </div>`;
    document.body.appendChild(l);
  }
  l.classList.remove('hidden');
}
export function hideLoader() {
  const l = document.getElementById('page-loader');
  if (l) l.classList.add('hidden');
}

// ── AUTH GUARD ─────────────────────────────────────────────────
export function requireAuth(auth, redirectTo = '/auth/login.html') {
  return new Promise((resolve, reject) => {
    showLoader();
    const unsub = auth.onAuthStateChanged(user => {
      unsub();
      if (!user) {
        window.location.href = redirectTo;
        reject();
      } else {
        hideLoader();
        resolve(user);
      }
    });
  });
}

export function redirectIfAuthed(auth, redirectTo = '/dashboard.html') {
  auth.onAuthStateChanged(user => {
    if (user) window.location.href = redirectTo;
  });
}

// ── NAVBAR ─────────────────────────────────────────────────────
export function initNavbar(auth, db, activeLink = '') {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  navbar.innerHTML = `
    <a href="/index.html" class="navbar-brand">
      <div class="navbar-logo">⚡</div>
      <span class="navbar-title gradient-text">dQuiz</span>
    </a>
    <nav class="navbar-links">
      <a href="/dashboard.html" ${activeLink==='dashboard'?'class="active"':''}>Dashboard</a>
      <a href="/quiz/my-quizzes.html" ${activeLink==='quizzes'?'class="active"':''}>My Quizzes</a>
      <a href="/discover.html" ${activeLink==='discover'?'class="active"':''}>Discover</a>
      <a href="/leaderboard.html" ${activeLink==='leaderboard'?'class="active"':''}>Leaderboard</a>
    </nav>
    <div class="navbar-actions">
      <a href="/quiz/create.html" class="btn btn-primary btn-sm" style="gap:6px"><span>＋</span> Create Quiz</a>
      <div id="navbar-user-area"></div>
      <button class="hamburger" id="hamburger" aria-label="Menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
    </div>
  `;

  // Mobile nav
  const mobileNav = document.createElement('div');
  mobileNav.className = 'mobile-nav';
  mobileNav.id = 'mobile-nav';
  mobileNav.innerHTML = `
    <a href="/dashboard.html">Dashboard</a>
    <a href="/quiz/my-quizzes.html">My Quizzes</a>
    <a href="/discover.html">Discover</a>
    <a href="/leaderboard.html">Leaderboard</a>
    <a href="/quiz/create.html" style="color:#A29BFE">+ Create Quiz</a>
    <a href="/game/join.html" style="color:#00B894">Join Game</a>
    <div class="separator"></div>
    <a href="/auth/logout.html" style="color:#FF4757">Sign Out</a>
  `;
  document.body.insertBefore(mobileNav, document.body.firstChild);

  document.getElementById('hamburger')?.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });

  // User area
  auth.onAuthStateChanged(async user => {
    const area = document.getElementById('navbar-user-area');
    if (!area) return;
    if (user) {
      let profile = null;
      try {
        const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) profile = snap.data();
      } catch(e) {}
      const initial = (profile?.username || user.displayName || user.email || '?')[0].toUpperCase();
      const photoURL = profile?.photoURL || user.photoURL || '';
      area.innerHTML = `
        <a href="/dashboard.html" class="navbar-user">
          <div class="navbar-avatar">${photoURL ? `<img src="${photoURL}" alt="">` : initial}</div>
          <div>
            <div class="navbar-username">${profile?.username || user.displayName || 'Player'}</div>
            <div class="navbar-xp">Lv ${profile?.level||1} · ${(profile?.xp||0).toLocaleString()} XP</div>
          </div>
        </a>
      `;
    } else {
      area.innerHTML = `
        <a href="/auth/login.html" class="btn btn-ghost btn-sm">Sign In</a>
        <a href="/auth/signup.html" class="btn btn-primary btn-sm">Sign Up</a>
      `;
    }
  });
}

// ── XP / LEVEL ─────────────────────────────────────────────────
export function xpForNextLevel(level) { return level * 500; }
export function xpProgress(xp, level) {
  const start = (level - 1) * 500;
  const end = level * 500;
  return Math.min(((xp - start) / (end - start)) * 100, 100);
}

// ── FORMAT ─────────────────────────────────────────────────────
export function timeAgo(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}
export function plural(n, word) { return `${n} ${word}${n !== 1 ? 's' : ''}`; }

// ── MODAL ──────────────────────────────────────────────────────
export function openModal(id) { document.getElementById(id)?.classList.remove('hidden'); }
export function closeModal(id) { document.getElementById(id)?.classList.add('hidden'); }

// ── ACHIEVEMENTS ───────────────────────────────────────────────
export const ACHIEVEMENTS = [
  { id: 'first_win',    icon: '🏆', title: 'First Win',       desc: 'Win your first game' },
  { id: 'quiz_creator', icon: '✏️',  title: 'Quiz Creator',    desc: 'Create your first quiz' },
  { id: 'ten_wins',     icon: '🥇', title: '10 Wins',         desc: 'Win 10 games' },
  { id: 'veteran',      icon: '⚡',  title: 'Veteran',         desc: 'Play 100 games' },
  { id: 'top_3',        icon: '🎖️', title: 'Podium Finisher', desc: 'Finish top 3' },
  { id: 'streak_5',     icon: '🔥', title: 'On Fire',         desc: '5-answer streak' },
  { id: 'speed_demon',  icon: '💨', title: 'Speed Demon',     desc: 'Answer in under 2s' },
  { id: 'host_10',      icon: '🎮', title: 'Game Host',       desc: 'Host 10 games' },
];
