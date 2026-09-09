// Techfest landing page — interactivity

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sticky nav shadow on scroll ---------- */
  const nav = document.querySelector('nav');
  const onScroll = () => {
    if (window.scrollY > 12) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal-on-scroll for sections ---------- */
  const revealTargets = document.querySelectorAll(
    '.event-card, .day, .stat, .section-head'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    revealTargets.forEach(el => el.classList.add('in-view'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(el => observer.observe(el));
  }

  /* ---------- Animated stat counters ---------- */
  const stats = document.querySelectorAll('.stat .num');

  function animateCount(el) {
    const raw = el.dataset.value;
    if (!raw) return;
    const match = raw.match(/^([\d,.]+)(\D*)$/);
    if (!match) return;

    const target = parseFloat(match[1].replace(/,/g, ''));
    const suffix = match[2] || '';
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(target * eased);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    }
    requestAnimationFrame(tick);
  }

  if (prefersReducedMotion) {
    // Leave static values as-is
  } else {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    stats.forEach(el => {
      // store the display value, then blank it before animating
      el.dataset.value = el.textContent.trim();
      statObserver.observe(el);
    });
  }

});
