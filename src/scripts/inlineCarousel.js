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

    function update(i = index) {
      index = (i + frames.length) % frames.length;
      frames.forEach((el, j) => { el.style.display = j === index ? 'block' : 'none'; });
      dots.forEach((el, j) => { el.dataset.active = String(j === index); });
      if (captionEl) {
        const cap = frames[index]?.getAttribute('data-caption') || '';
        captionEl.textContent = cap;
        captionEl.classList.toggle('hidden', !cap);
      }
    }

    prev?.addEventListener('click', () => update(index - 1));
    next?.addEventListener('click', () => update(index + 1));
    dots.forEach((d, j) => d.addEventListener('click', () => update(j)));
    update(0);
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
