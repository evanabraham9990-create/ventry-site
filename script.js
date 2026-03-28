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

    var colorBases = [
      'rgba(240,242,255,',
      'rgba(196,181,253,',
      'rgba(255,255,255,',
      'rgba(168,156,247,'
    ];

    var count = 38;
    for (var i = 0; i < count; i++) {
      var dot = document.createElement('span');
      dot.className = 'hero-sprinkle';

      var size = (Math.random() * 3.5 + 1.5).toFixed(1);
      var opacity = (Math.random() * 0.45 + 0.45).toFixed(2);
      var blur = (Math.random() * 1.2).toFixed(1);
      var base = colorBases[Math.floor(Math.random() * colorBases.length)];
      var color = base + opacity + ')';

      var x, y;
      // Keep dots in outer bands only — never over the center text
      var zone = Math.random();
      if (zone < 0.30) {
        x = Math.random() * 17;           // left strip
        y = Math.random() * 100;
      } else if (zone < 0.60) {
        x = 83 + Math.random() * 17;      // right strip
        y = Math.random() * 100;
      } else if (zone < 0.80) {
        x = Math.random() * 100;
        y = Math.random() * 16;           // top strip
      } else {
        x = Math.random() * 100;
        y = 84 + Math.random() * 16;      // bottom strip
      }

      var duration = (Math.random() * 5 + 6).toFixed(1);
      var delay = (Math.random() * 10).toFixed(1);

      dot.style.cssText = [
        'width:' + size + 'px',
        'height:' + size + 'px',
        'background:' + color,
        'left:' + x.toFixed(1) + '%',
        'top:' + y.toFixed(1) + '%',
        'filter:blur(' + blur + 'px)',
        'animation-duration:' + duration + 's',
        'animation-delay:-' + delay + 's'
      ].join(';');

      heroBg.appendChild(dot);
    }
  })();

  /* ----------------------------------------------------------
     HERO ENERGY GRID (Canvas)
  ---------------------------------------------------------- */
  (function () {
    var canvas = document.getElementById('hero-grid-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var W, H, cols, rows, cellW, cellH;
    var time = 0;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.scale(dpr, dpr);
      cellW = 90;
      cellH = 90;
      cols = Math.ceil(W / cellW) + 1;
      rows = Math.ceil(H / cellH) + 1;
      initOrbs();
    }

    // Energy orbs that travel along grid lines
    var orbs = [];
    var NUM_ORBS = 10;

    function initOrbs() {
      orbs = [];
      for (var i = 0; i < NUM_ORBS; i++) {
        var col = Math.floor(Math.random() * (cols - 1));
        var row = Math.floor(Math.random() * (rows - 1));
        var dir = Math.random() < 0.5 ? 'h' : 'v'; // horizontal or vertical
        orbs.push({
          x: col * cellW,
          y: row * cellH,
          col: col,
          row: row,
          dir: dir,
          speed: 40 + Math.random() * 45,
          progress: Math.random(),
          alpha: 0.5 + Math.random() * 0.5,
          size: 2.5 + Math.random() * 2
        });
      }
    }

    var nodeFlashes = []; // {x, y, alpha}

    function updateOrbs(dt) {
      for (var i = 0; i < orbs.length; i++) {
        var o = orbs[i];
        o.progress += (o.speed * dt) / (o.dir === 'h' ? cellW : cellH);

        if (o.progress >= 1) {
          o.progress = 0;
          // Flash the node we arrived at
          var nx = o.dir === 'h' ? (o.col + 1) * cellW : o.col * cellW;
          var ny = o.dir === 'h' ? o.row * cellH : (o.row + 1) * cellH;
          nodeFlashes.push({ x: nx, y: ny, alpha: 1 });

          // Move orb to next cell, pick new direction
          if (o.dir === 'h') {
            o.col = Math.min(o.col + 1, cols - 2);
          } else {
            o.row = Math.min(o.row + 1, rows - 2);
          }
          // Bounce at edges
          if (o.col <= 0 || o.col >= cols - 2) o.dir = 'v';
          else if (o.row <= 0 || o.row >= rows - 2) o.dir = 'h';
          else o.dir = Math.random() < 0.5 ? 'h' : 'v';

          o.x = o.col * cellW;
          o.y = o.row * cellH;
        }
      }

      // Decay node flashes
      for (var j = nodeFlashes.length - 1; j >= 0; j--) {
        nodeFlashes[j].alpha -= dt * 2.2;
        if (nodeFlashes[j].alpha <= 0) nodeFlashes.splice(j, 1);
      }
    }

    function draw(ts) {
      var dt = Math.min((ts - (draw._last || ts)) / 1000, 0.05);
      draw._last = ts;
      time += dt;

      ctx.clearRect(0, 0, W, H);

      // Draw grid lines with phase wave
      var phaseSpeedX = 0.18;
      var phaseSpeedY = 0.13;

      // Vertical lines
      for (var c = 0; c < cols; c++) {
        var px = c * cellW;
        var wave = Math.sin(time * phaseSpeedX * Math.PI * 2 - c * 0.4) * 0.5 + 0.5;
        var alpha = 0.04 + wave * 0.13;
        ctx.strokeStyle = 'rgba(124,111,247,' + alpha.toFixed(3) + ')';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, H);
        ctx.stroke();
      }

      // Horizontal lines
      for (var r = 0; r < rows; r++) {
        var py = r * cellH;
        var waveH = Math.sin(time * phaseSpeedY * Math.PI * 2 - r * 0.4) * 0.5 + 0.5;
        var alphaH = 0.04 + waveH * 0.13;
        ctx.strokeStyle = 'rgba(124,111,247,' + alphaH.toFixed(3) + ')';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(W, py);
        ctx.stroke();
      }

      // Draw node flashes
      for (var f = 0; f < nodeFlashes.length; f++) {
        var nf = nodeFlashes[f];
        var a = Math.min(nf.alpha, 1);
        var grad = ctx.createRadialGradient(nf.x, nf.y, 0, nf.x, nf.y, 8);
        grad.addColorStop(0, 'rgba(196,181,253,' + (a * 0.9).toFixed(2) + ')');
        grad.addColorStop(1, 'rgba(124,111,247,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(nf.x, nf.y, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update and draw orbs
      updateOrbs(dt);
      for (var k = 0; k < orbs.length; k++) {
        var o = orbs[k];
        var ox, oy;
        if (o.dir === 'h') {
          ox = o.x + o.progress * cellW;
          oy = o.y;
        } else {
          ox = o.x;
          oy = o.y + o.progress * cellH;
        }

        // Glow halo
        var glow = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.size * 4);
        glow.addColorStop(0, 'rgba(196,181,253,' + (o.alpha * 0.55).toFixed(2) + ')');
        glow.addColorStop(1, 'rgba(196,181,253,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(ox, oy, o.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = 'rgba(220,210,255,' + o.alpha.toFixed(2) + ')';
        ctx.beginPath();
        ctx.arc(ox, oy, o.size, 0, Math.PI * 2);
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
