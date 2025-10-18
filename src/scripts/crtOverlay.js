async function ensurePixi() {
  if (window.PIXI && window.PIXI.filters && window.PIXI.filters.CRTFilter) return;
  await new Promise((resolve, reject) => {
    const s1 = document.createElement('script');
    s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.3.3/pixi.min.js';
    s1.onload = () => resolve();
    s1.onerror = reject;
    document.head.appendChild(s1);
  });
  await new Promise((resolve, reject) => {
    const s2 = document.createElement('script');
    s2.src = 'https://cdn.jsdelivr.net/npm/pixi-filters@3.1.1/dist/pixi-filters.min.js';
    s2.onload = () => resolve();
    s2.onerror = reject;
    document.head.appendChild(s2);
  });
}

async function initCRT() {
  const overlayContainer = document.getElementById('crtOverlay');
  if (!overlayContainer) return;
  await ensurePixi();

  let width = window.innerWidth;
  let height = window.innerHeight;

  const app = new PIXI.Application({
    width,
    height,
    backgroundAlpha: 0,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    antialias: false,
  });

  overlayContainer.innerHTML = '';
  overlayContainer.appendChild(app.view);

  const fullScreenRect = new PIXI.Graphics();
  fullScreenRect.beginFill(0x969580);
  fullScreenRect.drawRect(0, 0, width, height);
  fullScreenRect.endFill();
  app.stage.addChild(fullScreenRect);

  const crtFilter = new PIXI.filters.CRTFilter({
    curvature: 5.0,
    lineWidth: 3.0,
    lineContrast: 0.2,
    noise: 0.1,
    noiseSize: 1.0,
    vignetting: 0.3,
    vignettingAlpha: 1,
    vignettingBlur: 0.3,
    time: 0,
    seed: Math.random(),
  });
  fullScreenRect.filters = [crtFilter];

  app.ticker.add((delta) => {
    crtFilter.time += 0.1 * delta;
    crtFilter.verticalLineAlpha = 0.2 + 0.1 * Math.sin(crtFilter.time * 0.3);
    crtFilter.noise = 0.1 + 0.1 * Math.sin(crtFilter.time * 0.5);
  });

  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    app.renderer.resize(width, height);
    fullScreenRect.clear();
    fullScreenRect.beginFill(0x8c8c8c);
    fullScreenRect.drawRect(0, 0, width, height);
    fullScreenRect.endFill();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCRT);
} else {
  initCRT();
}

