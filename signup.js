/* ============================================================
   VENTRY AI — signup.js
   Multi-step signup flow controller
   ============================================================ */

(function () {
  'use strict';

  var currentStep = 1;
  var totalSteps = 4;
  var userData = {};

  // Read plan from URL param
  var params = new URLSearchParams(window.location.search);
  var selectedPlan = params.get('plan') || 'starter';

  // Price mapping
  var plans = {
    starter: { name: 'Ventry AI — Starter', price: 149, setup: 1000 },
    growth: { name: 'Ventry AI — Growth', price: 299, setup: 2000 },
  };

  var plan = plans[selectedPlan] || plans.starter;

  // Set order summary values
  var orderPlanName = document.getElementById('order-plan-name');
  var orderPrice = document.getElementById('order-price');
  var orderSetup = document.getElementById('order-setup');
  var renewalNote = document.getElementById('renewal-note');

  if (orderPlanName) orderPlanName.textContent = plan.name;
  if (orderPrice) orderPrice.textContent = '$' + plan.price + '/mo';
  if (orderSetup) orderSetup.textContent = '$' + plan.setup.toLocaleString();
  if (renewalNote) renewalNote.textContent = 'Setup: $' + plan.setup.toLocaleString() + ' one-time. Then $' + plan.price + '/mo after trial.';

  /* ----------------------------------------------------------
     STEP NAVIGATION
  ---------------------------------------------------------- */
  function goToStep(step) {
    if (step < 1 || step > totalSteps) return;
    currentStep = step;

    // Update step panels
    document.querySelectorAll('.step-panel').forEach(function (panel) {
      panel.classList.remove('active');
    });
    var target = document.getElementById('step-' + step);
    if (target) target.classList.add('active');

    // Update info panels
    document.querySelectorAll('.signup-info-content').forEach(function (info) {
      info.classList.remove('active');
    });
    var infoTarget = document.getElementById('info-' + step);
    if (infoTarget) infoTarget.classList.add('active');

    // Update progress bars
    for (var i = 1; i <= totalSteps; i++) {
      var bar = document.getElementById('progress-' + i);
      if (bar) {
        bar.style.background = i <= step ? 'var(--purple-core)' : '';
      }
    }

    // Update step label
    var stepLabel = document.getElementById('step-label');
    if (stepLabel) stepLabel.textContent = 'Step ' + step + ' / ' + totalSteps;

    // Show/hide back button
    var backBtn = document.getElementById('signup-back');
    if (backBtn) backBtn.style.display = step > 1 ? 'flex' : 'none';
  }

  /* ----------------------------------------------------------
     STEP 1: Website URL
  ---------------------------------------------------------- */
  var btnStep1 = document.getElementById('btn-step-1');
  if (btnStep1) {
    btnStep1.addEventListener('click', function () {
      var websiteInput = document.getElementById('signup-website');
      userData.website = websiteInput ? websiteInput.value.trim() : '';
      goToStep(2);
    });
  }

  // Toggle buttons (Website / Google Business)
  var toggleWebsite = document.getElementById('toggle-website');
  var toggleGoogle = document.getElementById('toggle-google');
  if (toggleWebsite && toggleGoogle) {
    toggleWebsite.addEventListener('click', function () {
      toggleWebsite.classList.add('active');
      toggleGoogle.classList.remove('active');
      var input = document.getElementById('signup-website');
      if (input) input.placeholder = 'Enter your company website (www.example.com)';
    });
    toggleGoogle.addEventListener('click', function () {
      toggleGoogle.classList.add('active');
      toggleWebsite.classList.remove('active');
      var input = document.getElementById('signup-website');
      if (input) {
        input.placeholder = 'Enter your Google Business name';
        input.type = 'text';
      }
    });
  }

  // "Use Google Business Profile" link
  var useGoogleLink = document.getElementById('use-google-link');
  if (useGoogleLink && toggleGoogle) {
    useGoogleLink.addEventListener('click', function (e) {
      e.preventDefault();
      toggleGoogle.click();
      var input = document.getElementById('signup-website');
      if (input) input.focus();
    });
  }

  /* ----------------------------------------------------------
     STEP 2: Create Account
  ---------------------------------------------------------- */
  var signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      var errorEl = document.getElementById('signup-error');
      errorEl.style.display = 'none';

      var firstName = document.getElementById('su-first').value.trim();
      var lastName = document.getElementById('su-last').value.trim();
      var email = document.getElementById('su-email').value.trim();
      var phone = document.getElementById('su-phone').value.trim();
      var password = document.getElementById('su-password').value;
      var confirm = document.getElementById('su-confirm').value;
      var terms = document.getElementById('su-terms').checked;

      if (password !== confirm) {
        errorEl.textContent = 'Passwords do not match.';
        errorEl.style.display = 'block';
        return;
      }

      if (!terms) {
        errorEl.textContent = 'Please agree to the Terms of Service and Privacy Policy.';
        errorEl.style.display = 'block';
        return;
      }

      var submitBtn = signupForm.querySelector('.signup-next-btn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating account...';

      userData.firstName = firstName;
      userData.lastName = lastName;
      userData.email = email;
      userData.phone = phone;

      try {
        if (window.__ventryAuth && window.__ventryAuth.client) {
          var supabase = window.__ventryAuth.client;

          var result = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
              data: {
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                website_url: userData.website,
                plan: selectedPlan,
              },
            },
          });

          if (result.error) {
            errorEl.textContent = result.error.message;
            errorEl.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save and continue \u2192';
            return;
          }
        }

        // Update step 3 with user info
        var readyName = document.getElementById('ready-name');
        if (readyName) readyName.textContent = firstName + ' ' + lastName;
        var readyCompany = document.getElementById('ready-company');
        if (readyCompany && userData.website) {
          readyCompany.textContent = 'for ' + userData.website.replace(/^https?:\/\//, '').replace(/\/$/, '');
        }

        goToStep(3);
      } catch (err) {
        errorEl.textContent = 'Something went wrong. Please try again.';
        errorEl.style.display = 'block';
      }

      submitBtn.disabled = false;
      submitBtn.textContent = 'Save and continue \u2192';
    });
  }

  // Password visibility toggles
  document.querySelectorAll('.password-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = btn.previousElementSibling;
      if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
      } else {
        input.type = 'password';
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
      }
    });
  });

  // Password requirements
  var passwordInput = document.getElementById('su-password');
  if (passwordInput) {
    passwordInput.addEventListener('input', function () {
      var val = passwordInput.value;
      var reqLength = document.getElementById('req-length');
      var reqUpper = document.getElementById('req-upper');
      var reqNumber = document.getElementById('req-number');

      if (reqLength) reqLength.classList.toggle('met', val.length >= 8);
      if (reqUpper) reqUpper.classList.toggle('met', /[A-Z]/.test(val));
      if (reqNumber) reqNumber.classList.toggle('met', /\d/.test(val));
    });
  }

  /* ----------------------------------------------------------
     STEP 3: AI Ready
  ---------------------------------------------------------- */
  var btnStep3 = document.getElementById('btn-step-3');
  if (btnStep3) {
    btnStep3.addEventListener('click', function () {
      goToStep(4);
    });
  }

  /* ----------------------------------------------------------
     STEP 4: Book Activation Call
     (Step 4 is now a Cal.com link — no JS handler needed.
      When ready for Stripe, replace the <a> with a button
      and uncomment the checkout logic below.)
  ---------------------------------------------------------- */
  // Future Stripe integration:
  // var btnActivate = document.getElementById('btn-activate');
  // if (btnActivate) {
  //   btnActivate.addEventListener('click', async function () {
  //     btnActivate.disabled = true;
  //     btnActivate.textContent = 'Redirecting to checkout...';
  //     var res = await fetch('/api/create-checkout-session', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ plan: selectedPlan, email: userData.email }),
  //     });
  //     var data = await res.json();
  //     if (data.url) window.location.href = data.url;
  //   });
  // }

  /* ----------------------------------------------------------
     BACK BUTTON
  ---------------------------------------------------------- */
  var backBtn = document.getElementById('signup-back');
  if (backBtn) {
    backBtn.addEventListener('click', function () {
      goToStep(currentStep - 1);
    });
  }
})();
