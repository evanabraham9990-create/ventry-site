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
  const STAGGER_DELAY = 80; // ms per child

  function applyStaggerDelays(entry) {
    const el = entry.target;
    // Stagger siblings in the same grid/list parent
    const parent = el.parentElement;
    if (!parent) return;
    const siblings = Array.from(parent.querySelectorAll('.fade-up'));
    const index = siblings.indexOf(el);

    // Use data-delay if explicitly set, otherwise auto-stagger
    const explicitDelay = el.getAttribute('data-delay');
    const delay = explicitDelay !== null
      ? parseInt(explicitDelay, 10)
      : index * STAGGER_DELAY;

    el.style.transitionDelay = delay + 'ms';
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        applyStaggerDelays(entry);
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // fire once
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up').forEach(function (el) {
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
     HERO SPRINKLE DOTS
  ---------------------------------------------------------- */
  (function () {
    var heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;

    var colors = [
      'rgba(240,242,255,VAL)',
      'rgba(196,181,253,VAL)',
      'rgba(255,255,255,VAL)',
      'rgba(168,156,247,VAL)'
    ];

    var count = 38;
    for (var i = 0; i < count; i++) {
      var dot = document.createElement('span');
      dot.className = 'hero-sprinkle';

      var size = (Math.random() * 1.2 + 0.8).toFixed(1);
      var opacity = (Math.random() * 0.2 + 0.25).toFixed(2);
      var color = colors[Math.floor(Math.random() * colors.length)].replace('VAL', opacity);

      // Weight positions toward edges
      var x, y;
      var edge = Math.random();
      if (edge < 0.35) {
        x = Math.random() * 18;
      } else if (edge < 0.70) {
        x = 82 + Math.random() * 18;
      } else {
        x = Math.random() * 100;
      }
      y = Math.random() * 100;

      var duration = (Math.random() * 5 + 6).toFixed(1);
      var delay = (Math.random() * 10).toFixed(1);

      dot.style.cssText = [
        'width:' + size + 'px',
        'height:' + size + 'px',
        'background:' + color,
        'left:' + x.toFixed(1) + '%',
        'top:' + y.toFixed(1) + '%',
        'animation-duration:' + duration + 's',
        'animation-delay:-' + delay + 's'
      ].join(';');

      heroBg.appendChild(dot);
    }
  })();

  /* ----------------------------------------------------------
     VIDEO PLACEHOLDER — PLAY BUTTON
     (Swap with real YouTube embed when URL is available)
  ---------------------------------------------------------- */
  const playBtn = document.querySelector('.play-btn');
  const videoPlaceholder = document.querySelector('.video-placeholder');

  if (playBtn && videoPlaceholder) {
    playBtn.addEventListener('click', function () {
      // Replace with: videoPlaceholder.innerHTML = '<iframe ...></iframe>';
      // when a real YouTube URL is available.
      // For now, provide a visual feedback pulse.
      playBtn.style.transform = 'scale(0.95)';
      setTimeout(function () {
        playBtn.style.transform = '';
      }, 150);
    });
  }

})();
