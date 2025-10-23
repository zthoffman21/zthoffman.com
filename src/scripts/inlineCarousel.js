export function initInlineCarousels() {
  const roots = Array.from(document.querySelectorAll('[data-inline-carousel]'));
  roots.forEach((root) => {
    const frames = Array.from(root.querySelectorAll('[data-frame]'));
    const dots = Array.from(root.querySelectorAll('[data-dot]'));
    const prev = root.querySelector('[data-prev]');
    const next = root.querySelector('[data-next]');
    const captionEl = root.querySelector('[data-caption-el]');
    if (!frames.length) return;
    let index = 0;
    const imgs = Array.from(root.querySelectorAll('img'));

    // Ensure eager load for reliability on mobile and set a stable min-height
    try {
      imgs.forEach((img) => { try { img.loading = 'eager'; } catch {} });
    } catch {}

    function setMinHeight() {
      // Use tallest visible/toggled frame height; fallback to image naturalHeight ratio
      const heights = frames.map((f) => f.offsetHeight || 0);
      const maxH = Math.max(0, ...heights);
      if (maxH > 0) {
        root.style.minHeight = maxH + 'px';
      }
    }
    imgs.forEach((img) => img.addEventListener('load', setMinHeight));

    function update(i = index) {
      index = (i + frames.length) % frames.length;
      frames.forEach((el, j) => { el.style.display = j === index ? 'block' : 'none'; });
      dots.forEach((el, j) => { el.dataset.active = String(j === index); });
      if (captionEl) {
        const cap = frames[index]?.getAttribute('data-caption') || '';
        captionEl.textContent = cap;
        captionEl.classList.toggle('hidden', !cap);
      }
      setMinHeight();
    }

    prev?.addEventListener('click', () => update(index - 1));
    next?.addEventListener('click', () => update(index + 1));
    dots.forEach((d, j) => d.addEventListener('click', () => update(j)));
    update(0);
    setMinHeight();
  });
}

if (document.currentScript && document.currentScript.type === 'module') {
  try { initInlineCarousels(); } catch {}
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInlineCarousels);
} else {
  initInlineCarousels();
}
