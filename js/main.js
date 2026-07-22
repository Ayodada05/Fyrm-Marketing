(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('shown'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('shown');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- mobile nav ---------- */
  function initNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var panel = document.querySelector('[data-nav-panel]');
    if (!toggle || !panel) return;
    toggle.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        panel.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- businesses marquee ---------- */
  function initMarquee() {
    var marquee = document.querySelector('[data-marquee]');
    var track = marquee && marquee.querySelector('[data-marquee-track]');
    if (!marquee || !track) return;

    // duplicate the tiles once for a seamless loop
    track.innerHTML += track.innerHTML;

    var pausedUntil = 0;
    var dragging = false;
    var startX = 0;
    var startScroll = 0;

    function step() {
      var half = track.scrollWidth / 2;
      if (!reduceMotion && !dragging && Date.now() > pausedUntil) {
        marquee.scrollLeft += 0.6;
      }
      if (half > 50 && marquee.scrollLeft >= half) {
        marquee.scrollLeft -= half;
      }
      requestAnimationFrame(step);
    }

    function pause() { pausedUntil = Date.now() + 2500; }

    marquee.addEventListener('wheel', pause, { passive: true });
    marquee.addEventListener('touchmove', pause, { passive: true });

    marquee.addEventListener('mousedown', function (e) {
      dragging = true;
      startX = e.pageX;
      startScroll = marquee.scrollLeft;
      pause();
      marquee.classList.add('dragging');
      e.preventDefault();
    });
    document.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      marquee.scrollLeft = startScroll - (e.pageX - startX);
      pause();
    });
    document.addEventListener('mouseup', function () {
      dragging = false;
      marquee.classList.remove('dragging');
    });

    requestAnimationFrame(step);
  }

  function boot() {
    initReveal();
    initNav();
    initMarquee();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
