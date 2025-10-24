export function initProjectTimeline() {
  const roots = Array.from(document.querySelectorAll('[data-timeline]'));
  if (!roots.length) {
    console.warn('[Timeline] no [data-timeline] roots found');
    return;
  }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  roots.forEach((root) => {
    const IO_THRESHOLD = 0.02; // keep in sync with IntersectionObserver
    const host = root.querySelector('[data-timeline-host]') || root;
    const container = root.querySelector('#milestones') || root;
    const items = Array.from(container.querySelectorAll('article[id]'));
    const indexNav = document.getElementById('miniIndex');
    const linksMap = new Map();
    indexNav?.querySelectorAll('[data-index-link]').forEach((a) => {
      linksMap.set(a.getAttribute('data-index-link'), a);
    });

    // Start hidden
    items.forEach((el) => el.classList.add('tl-fade'));

    function activate(id) {
      items.forEach((el) => el.classList.toggle('is-active', el.id === id));
      const active = linksMap.get(id);
      if (indexNav) {
        indexNav.querySelectorAll('[data-index-link]')?.forEach((a) => a.classList.remove('is-active'));
        active?.classList.add('is-active');
      }
    }

    const lastVisibleState = new Map(); // element -> { ratio: number, is: boolean }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          lastVisibleState.set(e.target, { ratio: e.intersectionRatio || 0, is: e.isIntersecting });
          if (e.isIntersecting && (e.intersectionRatio ?? 0) >= IO_THRESHOLD) {
            const id = e.target.id;
            activate(id);
            e.target.classList.add('is-visible');
            e.target.classList.remove('tl-fade');
            scheduleSpineUpdate();
          }
        });
        updateLastVisibleCard();
      },
      { rootMargin: '0px 0px -15% 0px', threshold: IO_THRESHOLD }
    );

    items.forEach((el) => io.observe(el));
    updateLastVisibleCard();

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

    // Keyboard navigation within this root
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

    // Set vertical spine height to end at last milestone
    let raf = 0;
    function scheduleSpineUpdate() {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; updateSpineHeight(); updateLastVisibleCard(); });
    }

    function updateSpineHeight() {
      // Compute distance from host's top padding edge to the last card's center
      const last = items[items.length - 1];
      if (!last) return;

      // Try precise layout offsets within the same offsetParent chain
      let y = 0;
      let node = last;
      let foundAncestor = false;
      while (node && node instanceof HTMLElement) {
        if (node === host) { foundAncestor = true; break; }
        y += node.offsetTop;
        node = node.offsetParent;
      }

      if (!foundAncestor) {
        // Fallback to viewport rect math if offsetParent chain doesn't include host
        const hostRect = host.getBoundingClientRect();
        const r = last.getBoundingClientRect();
        y = r.top - hostRect.top;
      }

      const lastCenterOffset = y + (last.offsetHeight / 2);
      const endOffsetPx = 0;
      let h = lastCenterOffset - endOffsetPx;
      const hostH = Math.max(host.scrollHeight, host.clientHeight);
      h = Math.max(0, Math.min(h, hostH));
      root.style.setProperty('--tl-height', `${h}px`);
    }

    function updateLastVisibleCard() {
      let lastIdx = -1;
      for (let i = 0; i < items.length; i++) {
        const st = lastVisibleState.get(items[i]);
        const ok = st && st.is && st.ratio >= IO_THRESHOLD;
        if (ok) lastIdx = i;
      }
      items.forEach((el, idx) => el.classList.toggle('is-last-visible', idx === lastIdx));
    }
    updateSpineHeight();
    window.addEventListener('resize', scheduleSpineUpdate, { passive: true });
    window.addEventListener('scroll', scheduleSpineUpdate, { passive: true });

    // Listen for external requests to recalc (e.g., when carousel changes slides)
    root.addEventListener('timeline:recalc', () => { try { scheduleSpineUpdate(); } catch {} });

    // Recalculate when images/videos load (heights change)
    const media = Array.from(root.querySelectorAll('img, video'));
    media.forEach((m) => {
      m.addEventListener('load', scheduleSpineUpdate, true);
      m.addEventListener('loadedmetadata', scheduleSpineUpdate, true);
    });
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectTimeline);
  } else {
    try { initProjectTimeline(); } catch {}
  }
}
