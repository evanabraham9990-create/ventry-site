/* ============================================================
   VENTRY AI — script.js
   - Sticky header scroll state
   - Mobile nav toggle
   - Intersection Observer fade-up animations
   - Staggered child animations
   - FAQ accordion
   - Smooth scroll for anchor links
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     STICKY HEADER
  ---------------------------------------------------------- */
  const header = document.getElementById('site-header');

  function updateHeader() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ----------------------------------------------------------
     MOBILE NAV TOGGLE
  ---------------------------------------------------------- */
  const navToggle = document.querySelector('.nav-toggle');

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      const isOpen = header.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));

      // Animate hamburger → X
      const spans = navToggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close nav on link click
    document.querySelectorAll('.nav-links a, .site-header a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  /* ----------------------------------------------------------
     SCROLL ANIMATIONS — INTERSECTION OBSERVER
  ---------------------------------------------------------- */
  const STAGGER_DELAY = 150; // ms per sibling

  function applyStaggerDelays(entry) {
    var el = entry.target;
    var parent = el.parentElement;
    if (!parent) return;

    // Find siblings with the same animation class
    var selector = el.classList.contains('blur-in') ? '.blur-in' : '.fade-up';
    var siblings = Array.from(parent.querySelectorAll(selector));
    var index = siblings.indexOf(el);

    var explicitDelay = el.getAttribute('data-delay');
    var delay = explicitDelay !== null
      ? parseInt(explicitDelay, 10)
      : index * STAGGER_DELAY;

    el.style.transitionDelay = delay + 'ms';
  }

  var observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        applyStaggerDelays(entry);
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe both blur-in and fade-up elements
  document.querySelectorAll('.blur-in, .fade-up').forEach(function (el) {
    observer.observe(el);
  });

  /* ----------------------------------------------------------
     FAQ ACCORDION
  ---------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!btn || !answer) return;

    btn.addEventListener('click', function () {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      faqItems.forEach(function (other) {
        const otherBtn = other.querySelector('.faq-question');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherBtn && otherAnswer && other !== item) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAnswer.classList.remove('open');
        }
      });

      // Toggle current
      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.classList.toggle('open', !isOpen);
    });
  });

  /* ----------------------------------------------------------
     SMOOTH SCROLL — ANCHOR LINKS
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  /* ----------------------------------------------------------
     LEAD CAPTURE FORM
  ---------------------------------------------------------- */
  const leadForm = document.getElementById('lead-capture-form');
  if (leadForm) {
    leadForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn = leadForm.querySelector('.lead-capture-btn');
      const successEl = document.getElementById('form-success');
      btn.disabled = true;
      btn.textContent = 'Submitting...';

      const data = {
        firstName: leadForm.firstName.value.trim(),
        lastName: leadForm.lastName.value.trim(),
        email: leadForm.email.value.trim(),
        company: leadForm.company.value.trim(),
        phone: leadForm.phone.value.trim(),
      };

      try {
        const res = await fetch('/api/lead-capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          leadForm.style.display = 'none';
          successEl.style.display = 'flex';
        } else {
          btn.textContent = 'Something went wrong — try again';
          btn.disabled = false;
        }
      } catch (err) {
        btn.textContent = 'Something went wrong — try again';
        btn.disabled = false;
      }
    });
  }

  /* ----------------------------------------------------------
     ROI CALCULATOR
  ---------------------------------------------------------- */
  const roiCalls = document.getElementById('roi-calls');
  const roiClose = document.getElementById('roi-close');
  const roiValue = document.getElementById('roi-value');
  const roiMonthly = document.getElementById('roi-monthly');
  const roiYearly = document.getElementById('roi-yearly');

  function updateROI() {
    if (!roiCalls || !roiClose || !roiValue) return;
    const calls = parseFloat(roiCalls.value) || 0;
    const close = (parseFloat(roiClose.value) || 0) / 100;
    const value = parseFloat(roiValue.value) || 0;
    const monthly = Math.round(calls * 4.33 * close * value);
    const yearly = monthly * 12;
    roiMonthly.textContent = '$' + monthly.toLocaleString();
    roiYearly.textContent = '$' + yearly.toLocaleString();
  }

  if (roiCalls) {
    [roiCalls, roiClose, roiValue].forEach(function (input) {
      input.addEventListener('input', updateROI);
    });
    updateROI();
  }

  /* ----------------------------------------------------------
     SCROLL TO TOP BUTTON
  ---------------------------------------------------------- */
  (function () {
    var btn = document.createElement('button');
    btn.id = 'scroll-top-btn';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

})();
