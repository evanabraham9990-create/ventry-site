/* ============================================================
   VENTRY AI — dashboard.js
   Dashboard page logic — profile, call logs, billing
   ============================================================ */

(function () {
  'use strict';

  async function init() {
    // Require auth — redirect to login if no session
    if (!window.__ventryAuth) {
      window.location.href = '/login.html';
      return;
    }

    var session = await window.__ventryAuth.requireAuth();
    if (!session) return;

    var supabase = window.__ventryAuth.client;
    var user = session.user;
    var meta = user.user_metadata || {};

    // Populate account info
    var dashName = document.getElementById('dash-name');
    var dashEmail = document.getElementById('dash-email');
    var dashCompany = document.getElementById('dash-company');
    var dashPhone = document.getElementById('dash-phone');
    var dashGreeting = document.getElementById('dash-greeting');

    if (dashName) dashName.textContent = (meta.first_name || '') + ' ' + (meta.last_name || '') || '—';
    if (dashEmail) dashEmail.textContent = user.email || '—';
    if (dashCompany) dashCompany.textContent = meta.website_url || '—';
    if (dashPhone) dashPhone.textContent = meta.phone || '—';
    if (dashGreeting) dashGreeting.textContent = 'Welcome back, ' + (meta.first_name || 'there');

    // Try to load profile from profiles table
    try {
      var profileResult = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileResult.data) {
        var profile = profileResult.data;
        if (dashCompany && profile.company) dashCompany.textContent = profile.company;
        if (dashPhone && profile.phone) dashPhone.textContent = profile.phone;

        // Plan info
        var dashPlan = document.getElementById('dash-plan');
        if (dashPlan && profile.plan) {
          var planName = profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1);
          dashPlan.innerHTML = '<span class="plan-badge">' + planName + '</span>';
        }

        // Trial end date
        var dashTrialEnds = document.getElementById('dash-trial-ends');
        if (dashTrialEnds && profile.trial_ends_at) {
          var trialDate = new Date(profile.trial_ends_at);
          dashTrialEnds.textContent = trialDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          });
        }
      }
    } catch (err) {
      // Profiles table may not exist yet — use user_metadata fallback
    }

    // Load call logs
    try {
      var logsResult = await supabase
        .from('calls')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (logsResult.data && logsResult.data.length > 0) {
        var logs = logsResult.data;
        var emptyEl = document.getElementById('call-log-empty');
        var tableEl = document.getElementById('call-log-table');
        var tbody = document.getElementById('call-log-body');

        if (emptyEl) emptyEl.style.display = 'none';
        if (tableEl) tableEl.style.display = 'table';

        // Stats — use booked boolean field
        var totalCalls = logs.length;
        var bookedCount = logs.filter(function (l) { return l.booked === true; }).length;
        var totalDuration = logs.reduce(function (sum, l) { return sum + (l.duration_seconds || 0); }, 0);
        var avgDuration = Math.round(totalDuration / totalCalls);

        var statTotal = document.getElementById('stat-total');
        var statBooked = document.getElementById('stat-booked');
        var statAvg = document.getElementById('stat-avg');
        var statRate = document.getElementById('stat-rate');

        if (statTotal) statTotal.textContent = totalCalls;
        if (statBooked) statBooked.textContent = bookedCount;
        if (statAvg) statAvg.textContent = avgDuration + 's';
        if (statRate) statRate.textContent = Math.round((bookedCount / totalCalls) * 100) + '%';

        // Populate table
        var outcomeEmoji = { booked: '📅', qualified: '✅', lost: '❌', spam: '🚫' };
        if (tbody) {
          logs.forEach(function (log) {
            var tr = document.createElement('tr');
            var date = new Date(log.created_at);
            var caller = log.caller_name || log.caller_phone || 'Unknown';
            var outcome = log.outcome ? (outcomeEmoji[log.outcome] || '') + ' ' + log.outcome : '—';
            tr.innerHTML =
              '<td>' + caller + '</td>' +
              '<td>' + (log.duration_seconds || 0) + 's</td>' +
              '<td>' + (log.summary || outcome) + '</td>' +
              '<td>' + date.toLocaleDateString() + '</td>';
            tbody.appendChild(tr);
          });
        }
      }
    } catch (err) {
      // calls table may not exist yet — create it in Supabase using docs/backend-actions.md schema
    }

    // Manage billing button
    var billingBtn = document.getElementById('manage-billing-btn');
    if (billingBtn) {
      billingBtn.addEventListener('click', async function () {
        billingBtn.disabled = true;
        billingBtn.textContent = 'Loading...';

        try {
          var res = await fetch('/api/create-portal-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + session.access_token,
            },
            body: JSON.stringify({}),
          });

          var data = await res.json();
          if (data.url) {
            window.location.href = data.url;
          } else {
            billingBtn.textContent = 'Unable to load billing portal';
            billingBtn.disabled = false;
          }
        } catch (err) {
          billingBtn.textContent = 'Unable to load billing portal';
          billingBtn.disabled = false;
        }
      });
    }

    // Logout button
    var logoutBtn = document.getElementById('dashboard-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.__ventryAuth.signOut();
      });
    }
  }

  init();
})();
