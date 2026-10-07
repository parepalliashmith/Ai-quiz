/* AIQUIZ accounts — Google Sign-In + cloud sync + global leaderboard.
   Self-contained: degrades silently when the server has accounts disabled.
   Exposes window.AIQUIZAuth. */
(function () {
  'use strict';
  const TOKEN_KEY = 'aiquiz_token';
  const USER_KEY = 'aiquiz_user';
  const $ = (id) => document.getElementById(id);

  let state = {
    enabled: false,
    clientId: '',
    token: localStorage.getItem(TOKEN_KEY) || '',
    user: safeParse(localStorage.getItem(USER_KEY)),
  };

  function safeParse(s) { try { return s ? JSON.parse(s) : null; } catch { return null; } }
  function authHeaders() { return state.token ? { Authorization: 'Bearer ' + state.token } : {}; }

  function setSession(token, user) {
    state.token = token || '';
    state.user = user || null;
    if (token) localStorage.setItem(TOKEN_KEY, token); else localStorage.removeItem(TOKEN_KEY);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user)); else localStorage.removeItem(USER_KEY);
    renderUser();
    refreshLeaderboard();
  }

  // ---- UI: top-right sign-in area ----
  function renderUser() {
    const chip = $('userChip'), gBtn = $('gBtn');
    if (!chip) return;
    if (state.user) {
      chip.hidden = false;
      if (gBtn) gBtn.style.display = 'none';
      const pic = $('userPic'), nm = $('userName');
      if (pic) { if (state.user.picture) { pic.src = state.user.picture; pic.hidden = false; } else pic.hidden = true; }
      if (nm) nm.textContent = (state.user.name || 'You').split(' ')[0];
    } else {
      chip.hidden = true;
      if (gBtn) gBtn.style.display = '';
    }
  }

  // ---- Google Identity Services ----
  function initGoogle() {
    if (!state.enabled || !window.google || !google.accounts || !google.accounts.id) return;
    google.accounts.id.initialize({
      client_id: state.clientId,
      callback: onCredential,
      auto_select: false,
    });
    const gBtn = $('gBtn');
    if (gBtn && !state.user) {
      gBtn.innerHTML = '';
      google.accounts.id.renderButton(gBtn, { theme: 'outline', size: 'medium', shape: 'pill', text: 'signin' });
    }
  }

  function loadGoogleScript() {
    if (window.google && google.accounts) return initGoogle();
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true; s.defer = true;
    s.onload = initGoogle;
    document.head.appendChild(s);
  }

  async function onCredential(resp) {
    try {
      const r = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: resp.credential }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Sign-in failed');
      setSession(data.token, data.user);
      toast('Signed in as ' + ((data.user && data.user.name) || 'you'));
    } catch (e) { toast(e.message || 'Sign-in failed', true); }
  }

  function signOut() {
    try { if (window.google && google.accounts) google.accounts.id.disableAutoSelect(); } catch {}
    setSession('', null);
    initGoogle(); // re-render the sign-in button
    toast('Signed out');
  }

  // ---- Cloud sync ----
  async function saveResult(payload) {
    if (!state.enabled || !state.token) return; // only for signed-in users
    try {
      const r = await fetch('/api/results', {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders()),
        body: JSON.stringify(payload),
      });
      if (r.status === 401) { setSession('', null); return; }
      const data = await r.json();
      if (r.ok && data.user) { state.user = Object.assign({}, state.user, data.user); localStorage.setItem(USER_KEY, JSON.stringify(state.user)); }
    } catch {}
  }

  // ---- Global leaderboard ----
  async function refreshLeaderboard() {
    const panel = $('globalLbPanel');
    if (!panel) return;
    if (!state.enabled) { panel.hidden = true; return; }
    panel.hidden = false;
    try {
      const r = await fetch('/api/leaderboard?limit=50', { headers: authHeaders() });
      const data = await r.json();
      renderGlobal((data && data.entries) || [], data && data.me);
    } catch {
      renderGlobal([], null);
    }
  }

  function renderGlobal(entries, me) {
    const list = $('globalList');
    if (!list) return;
    const medals = ['🥇', '🥈', '🥉'];
    if (!entries.length) {
      list.innerHTML = '<p class="page-intro" style="text-align:center">Be the first on the board — sign in and finish a quiz!</p>';
    } else {
      list.innerHTML = entries.map((e, i) => {
        const rank = medals[i] || '<span class="lb-num">' + (i + 1) + '</span>';
        const mine = me && e.id === me.id ? ' mine' : '';
        const pic = e.picture
          ? '<img class="lb-pic" src="' + e.picture + '" alt="">'
          : '<span class="lb-pic ph">' + ((e.name || '?')[0] || '?').toUpperCase() + '</span>';
        return '<div class="lb-row' + (i < 3 ? ' top' : '') + mine + '">' +
          '<div class="lb-rank">' + rank + '</div>' + pic +
          '<div class="lb-mid"><div class="lb-topic">' + escapeHtml(e.name || 'Student') + '</div>' +
          '<div class="h-meta">' + e.quizzes + ' quizzes · ' + e.accuracy + '% acc</div></div>' +
          '<div class="lb-score good">' + e.points + '<span class="h-meta"> pts</span></div></div>';
      }).join('');
    }
    const myRow = $('myRankRow');
    if (myRow) {
      if (me) { myRow.hidden = false; myRow.innerHTML = 'Your rank: <b>#' + (me.rank || '—') + '</b> · ' + me.points + ' pts · ' + me.quizzes + ' quizzes'; }
      else { myRow.hidden = false; myRow.textContent = 'Sign in to join the global leaderboard and compete with other students.'; }
    }
  }

  function escapeHtml(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

  function toast(msg, isErr) {
    if (typeof window.banner === 'function') { window.banner(msg, isErr ? 'error' : 'success'); return; }
    // minimal fallback toast
    const d = document.createElement('div');
    d.textContent = msg;
    d.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:' +
      (isErr ? '#e11d48' : '#16a34a') + ';color:#fff;padding:10px 16px;border-radius:12px;z-index:9999;font:600 14px system-ui';
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 2600);
  }

  // ---- Boot ----
  async function boot() {
    const so = $('signOutBtn');
    if (so) so.onclick = signOut;
    renderUser();
    try {
      const r = await fetch('/api/auth/config');
      const cfg = await r.json();
      state.enabled = !!cfg.accounts;
      state.clientId = cfg.googleClientId || '';
    } catch { state.enabled = false; }

    const area = $('authArea');
    if (!state.enabled) {
      if (area) area.hidden = true; // hide sign-in UI until the server is configured
      const panel = $('globalLbPanel');
      if (panel) panel.hidden = true;
      return;
    }
    if (area) area.hidden = false;
    loadGoogleScript();
    // If we already have a token, confirm it's still valid.
    if (state.token) {
      try {
        const r = await fetch('/api/me', { headers: authHeaders() });
        if (r.ok) { const d = await r.json(); setSession(state.token, d.user); }
        else if (r.status === 401) setSession('', null);
      } catch {}
    }
  }

  window.AIQUIZAuth = { saveResult, refreshLeaderboard, signOut, get user() { return state.user; }, get enabled() { return state.enabled; } };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
