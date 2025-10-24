const starThemes = ["default", "starWars", "blue"];
const snowThemes = ["christmas"];

async function ensureTsParticles() {
  if (window.tsParticles) return;
  await new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/tsparticles@2/tsparticles.bundle.min.js';
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function setParticles() {
  await ensureTsParticles();
  const theme = localStorage.getItem('themeName') || 'default';

  // Destroy existing instances
  let instances = tsParticles.dom();
  while (instances.length > 0) {
    instances.forEach((i) => i.destroy());
    instances = tsParticles.dom();
  }

  if (starThemes.includes(theme)) {
    // Background stars
    tsParticles.load({
      particles: {
        number: { value: 235, density: { enable: true, value_area: 800 } },
        color: { value: '#ffffff' },
        shape: { type: 'star' },
        opacity: { value: 0.3, random: true, anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: true } },
        size: { value: 1.75, random: true, anim: { enable: false } },
        move: { enable: true, speed: 0.2, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: {
        events: { onhover: { enable: true, mode: 'repulse' } },
        modes: { repulse: { distance: 75, duration: 1, speed: 0.015 } }
      }
    });
    // Shooting stars
    tsParticles.load({
      particles: {
        number: { value: 1, density: { enable: true, value_area: 800 } },
        color: { value: '#ffffff' },
        shape: { type: 'star' },
        opacity: { value: 0.4, random: true },
        size: { value: 2, random: true },
        move: { enable: true, speed: { min: 1, max: 10 }, random: true, straight: true, out_mode: 'out' }
      },
      interactivity: {
        events: { onhover: { enable: true, mode: 'repulse' } },
        modes: { repulse: { distance: 75, duration: 1, speed: 0.01 } }
      }
    });
  } else if (snowThemes.includes(theme)) {
    tsParticles.load({
      particles: {
        number: { value: 200, density: { enable: true, value_area: 800 } },
        color: { value: '#ffffff' },
        shape: { type: 'circle' },
        opacity: { value: 0.4, random: true, anim: { enable: false } },
        size: { value: 3, random: true, anim: { enable: false } },
        move: { enable: true, speed: 1, direction: 'bottom', random: true, straight: false, out_mode: 'out', bounce: false, drift: { enable: true, x: 1 } }
      }
    });
  }
}

function initParticles() {
  setParticles();
  const themeObserver = new MutationObserver(() => setParticles());
  themeObserver.observe(document.documentElement, { attributeFilter: ['data-theme'] });
}

function scheduleParticles() {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;
  const run = () => {
    if (document.visibilityState === 'hidden') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') initParticles();
      }, { once: true });
      return;
    }
    initParticles();
  };
  if ('requestIdleCallback' in window) {
    requestIdleCallback(run, { timeout: 3000 });
  } else {
    setTimeout(run, 0);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleParticles);
} else {
  scheduleParticles();
}
