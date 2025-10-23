export function initProjectsCarousel() {
  const root = document.getElementById('projectsCarousel'); 
  if (!root) return;
  const slides = Array.from(root.querySelectorAll('.project-slide'));
  const prevBtn = root.querySelector('[data-prev]');
  const nextBtn = root.querySelector('[data-next]');
  const counter = root.querySelector('#carouselCounter');
  if (!slides.length) { console.warn('[ProjectsCarousel] no slides found'); return; }

  let index = 0;

  function update() {
    slides.forEach((el, i) => {
      const active = i === index;
      el.dataset.active = active ? 'true' : 'false';
      el.style.display = active ? 'block' : 'none';
    });
    if (counter) counter.textContent = String(index + 1);
  }

  function next() { index = (index + 1) % slides.length; update(); }
  function prev() { index = (index - 1 + slides.length) % slides.length; update(); }

  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);

  // Keyboard: left/right arrows switch projects
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  });

  update();  
  console.log('[ProjectsCarousel] initialized with', slides.length, 'slides');
  }
if (document.currentScript && document.currentScript.type === 'module') {
  try { initProjectsCarousel(); } catch {}
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjectsCarousel);
} else {
  initProjectsCarousel();
}

