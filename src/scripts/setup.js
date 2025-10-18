function setAbsolutePositions() {
  const container = document.getElementById("mainContainer");
  if (!container) return;
  const windows = Array.from(document.querySelectorAll(".window")).filter(w => w.dataset.modal !== 'true');

  // Lock the container height to prevent layout shift when windows become absolute
  const containerRect = container.getBoundingClientRect();
  container.style.height = containerRect.height + "px";

  windows.forEach((win) => {
    const rect = win.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    win.style.left = rect.left + scrollLeft + "px";
    win.style.top = rect.top + scrollTop + "px";
  });

  windows.forEach((win) => {
    win.style.position = "absolute";
  });
}

function onReady() {
  if (!window.matchMedia("(max-width: 900px)").matches) {
    setAbsolutePositions();
  }
  const footer = document.getElementById('footer');
  if (footer) footer.style.opacity = '1';
}

// Run after full load to ensure fonts/images settle layout
window.addEventListener("load", onReady);

// Recompute on resize (debounced) to avoid layout jumps
let resizeTimer;
window.addEventListener("resize", () => {
  if (window.matchMedia("(max-width: 900px)").matches) return;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(setAbsolutePositions, 120);
});

// Export for potential manual reflow triggers
window.setAbsolutePositions = setAbsolutePositions;
