/* ============================================================
   VENTRY AI — auth.js
   Supabase auth integration + dynamic nav state
   ============================================================ */

(function () {
  'use strict';

  // Supabase config — anon key is safe to expose (RLS protects data)
  var SUPABASE_URL = window.__VENTRY_SUPABASE_URL || '';
  var SUPABASE_ANON_KEY = window.__VENTRY_SUPABASE_ANON_KEY || '';

  // Skip auth if Supabase is not configured
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('[auth] Supabase not configured — auth features disabled');
    return;
  }

  var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Expose globally for signup.js, dashboard.js
  window.__ventryAuth = {
    client: supabase,

    getSession: function () {
      return supabase.auth.getSession();
    },

    getUser: function () {
      return supabase.auth.getUser();
    },

    signOut: async function () {
      await supabase.auth.signOut();
      window.location.href = '/';
    },

    requireAuth: async function () {
      var result = await supabase.auth.getSession();
      if (!result.data.session) {
        window.location.href = '/login.html';
        return null;
      }
      return result.data.session;
    },
  };

  /* ----------------------------------------------------------
     NAV STATE — swap CTA based on auth status
  ---------------------------------------------------------- */
  async function updateNav() {
    var result = await supabase.auth.getSession();
    var session = result.data.session;

    var navCta = document.getElementById('nav-cta-audit');
    var navAuthLinks = document.getElementById('nav-auth-links');

    if (!navCta && !navAuthLinks) return;

    if (session) {
      // Logged in — show Dashboard + Log Out
      if (navCta) {
        navCta.textContent = 'Dashboard';
        navCta.href = '/dashboard.html';
      }
      if (navAuthLinks) {
        navAuthLinks.innerHTML =
          '<a href="/dashboard.html" class="nav-link">Dashboard</a>' +
          '<a href="#" class="nav-link" id="nav-logout">Log Out</a>';
        var logoutBtn = document.getElementById('nav-logout');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.__ventryAuth.signOut();
          });
        }
      }
    } else {
      // Logged out — show Client Login + Book Free Audit
      if (navAuthLinks) {
        navAuthLinks.innerHTML =
          '<a href="/login.html" class="btn btn-outline-brand btn-sm">Client Login</a>';
      }
      if (navCta) {
        navCta.textContent = 'Book Free Audit';
        navCta.href = 'https://cal.com/evan-abraham-9cfgui/missed-call-audit';
        navCta.target = '_blank';
        navCta.rel = 'noopener noreferrer';
      }
    }
  }

  // Listen for auth state changes (login/logout from other tabs)
  supabase.auth.onAuthStateChange(function () {
    updateNav();
  });

  // Initial nav update
  updateNav();
})();
