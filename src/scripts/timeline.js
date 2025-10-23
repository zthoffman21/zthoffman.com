export function initProjectTimeline() {
  const roots = Array.from(document.querySelectorAll('[data-timeline]'));  if (!roots.length) { 
  console.warn('[Timeline] no [data-timeline] roots found'); return; }  
  const root = roots[0];
  const container = root.querySelector('#milestones') || root; 
  console.debug('[Timeline] init root=', root, 'container=', container);
  const items = Array.from(container.querySelectorAll('article[id]'));
  console.debug('[Timeline] items found:', items.length);
  const indexNav = document.getElementById('miniIndex');
  const linksMap = new Map();
  indexNav?.querySelectorAll('[data-index-link]').forEach((a) => {
    linksMap.set(a.getAttribute('data-index-link'), a);
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Enhance items with motion-safe classes
  items.forEach((el, i) => {
    el.classList.add('motion-safe:transition', 'motion-safe:duration-500');
    if (!reduceMotion) {
      const left = i % 2 === 0;
      el.style.opacity = '0';
      el.style.transform = left ? 'translateX(-8px)' : 'translateX(8px)';
    }
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const id = e.target.id;
        activate(id);
        if (!reduceMotion) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateX(0)';
        }
      }
    });
  }, { rootMargin: '-20% 0px -60% 0px', threshold: 0.1 });

  items.forEach((el) => io.observe(el));

  // Index click smooth scroll
  indexNav?.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-index-link]');
    if (!a) return;
    e.preventDefault();
    const id = a.getAttribute('data-index-link');
    const target = document.getElementById(id);
    if (!target) return;
    target.focus?.({ preventScroll: true });
    activate(id);
  });

  // Keyboard navigation
  function focusAt(idx) {
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    const el = items[clamped];
    el.focus?.({ preventScroll: true });
    activate(el.id);
  }

  window.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'j', 'k'].includes(e.key)) {
      e.preventDefault();
      const activeIdx = items.findIndex((el) => el.classList.contains('is-active'));
      switch (e.key) {
        case 'ArrowDown':
        case 'j':
          focusAt((activeIdx === -1 ? 0 : activeIdx) + 1);
          break;
        case 'ArrowUp':
        case 'k':
          focusAt((activeIdx === -1 ? 0 : activeIdx) - 1);
          break;
        case 'Home':
          focusAt(0);
          break;
        case 'End':
          focusAt(items.length - 1);
          break;
      }
    }
  });
}
