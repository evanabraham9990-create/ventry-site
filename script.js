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
     GALAXY BACKGROUND (Canvas)
     Stars = lost jobs drifting in space — subtle, fluid, never overlapping
  ---------------------------------------------------------- */
  (function () {
    var canvas = document.getElementById('hero-grid-canvas');
    if (!canvas || window.innerWidth < 768) return;

    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var W, H;
    var stars = [];
    var NUM_STARS = window.innerWidth < 768 ? 80 : 190;
    var MIN_DIST = 12;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
    }

    function initStars() {
      stars = [];
      var attempts = 0;
      var maxAttempts = NUM_STARS * 25;

      while (stars.length < NUM_STARS && attempts < maxAttempts) {
        attempts++;

        var rand = Math.random();
        var size;
        if (rand < 0.58)       size = 0.4 + Math.random() * 0.7;   // tiny
        else if (rand < 0.86)  size = 1.1 + Math.random() * 0.7;   // small
        else if (rand < 0.96)  size = 1.8 + Math.random() * 0.7;   // medium
        else                   size = 2.5 + Math.random() * 0.6;   // rare large

        var x = size + Math.random() * (W - size * 2);
        var y = size + Math.random() * (H - size * 2);

        // Enforce minimum spacing
        var tooClose = false;
        for (var j = 0; j < stars.length; j++) {
          var dx = stars[j].x - x;
          var dy = stars[j].y - y;
          var minD = MIN_DIST + stars[j].size + size;
          if (dx * dx + dy * dy < minD * minD) { tooClose = true; break; }
        }
        if (tooClose) continue;

        // Color palette: cool whites, lavenders, pale blues, rare warm
        var cr = Math.random();
        var r, g, b;
        if (cr < 0.52) {
          r = 215 + Math.floor(Math.random() * 40); g = 220 + Math.floor(Math.random() * 35); b = 255;
        } else if (cr < 0.78) {
          r = 185 + Math.floor(Math.random() * 30); g = 175 + Math.floor(Math.random() * 25); b = 248 + Math.floor(Math.random() * 7);
        } else if (cr < 0.92) {
          r = 175 + Math.floor(Math.random() * 35); g = 200 + Math.floor(Math.random() * 35); b = 255;
        } else {
          r = 255; g = 238 + Math.floor(Math.random() * 17); b = 205 + Math.floor(Math.random() * 35);
        }

        stars.push({
          ox: x, oy: y, x: x, y: y,
          size: size,
          r: r, g: g, b: b,
          baseOpacity: 0.1 + Math.random() * 0.35,
          opacity: 0,
          // Drift — very slow lissajous float
          driftRx: 6 + Math.random() * 16,
          driftRy: 5 + Math.random() * 14,
          driftSpeedX: 0.025 + Math.random() * 0.055,
          driftSpeedY: 0.020 + Math.random() * 0.045,
          driftPhaseX: Math.random() * Math.PI * 2,
          driftPhaseY: Math.random() * Math.PI * 2,
          // Twinkle
          twinkleRange: 0.08 + Math.random() * 0.18,
          twinkleSpeed: 0.18 + Math.random() * 0.40,
          twinklePhase: Math.random() * Math.PI * 2
        });
      }
    }

    var time = 0;
    var lastTs = null;

    function draw(ts) {
      if (lastTs === null) lastTs = ts;
      var dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;
      time += dt;

      ctx.clearRect(0, 0, W, H);

      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];

        // Smooth lissajous drift — no hard cuts, continuous curves
        s.x = s.ox + Math.cos(time * s.driftSpeedX * Math.PI * 2 + s.driftPhaseX) * s.driftRx;
        s.y = s.oy + Math.sin(time * s.driftSpeedY * Math.PI * 2 + s.driftPhaseY) * s.driftRy;

        // Gentle twinkle
        var tw = Math.sin(time * s.twinkleSpeed * Math.PI * 2 + s.twinklePhase) * 0.5 + 0.5;
        s.opacity = s.baseOpacity - s.twinkleRange * 0.25 + tw * s.twinkleRange;
        s.opacity = Math.max(0.03, Math.min(0.62, s.opacity));

        // Soft glow halo for larger stars only
        if (s.size >= 1.4) {
          var gr = s.size * 4;
          var glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, gr);
          glow.addColorStop(0, 'rgba(' + s.r + ',' + s.g + ',' + s.b + ',' + (s.opacity * 0.28).toFixed(3) + ')');
          glow.addColorStop(1, 'rgba(' + s.r + ',' + s.g + ',' + s.b + ',0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(s.x, s.y, gr, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core star
        ctx.fillStyle = 'rgba(' + s.r + ',' + s.g + ',' + s.b + ',' + s.opacity.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    resize();
    if (window.ResizeObserver) {
      new ResizeObserver(resize).observe(canvas.parentElement);
    } else {
      window.addEventListener('resize', resize);
    }
    requestAnimationFrame(draw);
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
