let __zWindowCounter = 100;

function makeDraggable(windowEl) {
  const titleBar = windowEl.querySelector(".draggable");
  if (!titleBar) return;

  let startX, startY, initialLeft, initialTop;

  titleBar.style.cursor = "move";
  titleBar.addEventListener("mousedown", dragMouseDown);

  function dragMouseDown(e) {
    e.preventDefault();
    // bring to front on grab
    windowEl.style.zIndex = String(++__zWindowCounter);
    const computedStyle = getComputedStyle(windowEl);

    initialLeft = parseFloat(computedStyle.left) || windowEl.getBoundingClientRect().left;
    initialTop = parseFloat(computedStyle.top) || windowEl.getBoundingClientRect().top;

    startX = e.clientX;
    startY = e.clientY;

    document.addEventListener("mousemove", elementDrag);
    document.addEventListener("mouseup", closeDragElement);
  }

  function elementDrag(e) {
    e.preventDefault();
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const newLeft = initialLeft + dx;
    const newTop = initialTop + dy;

    windowEl.style.position = "absolute";
    windowEl.style.left = newLeft + "px";
    windowEl.style.top = newTop + "px";
  }

  function closeDragElement() {
    document.removeEventListener("mousemove", elementDrag);
    document.removeEventListener("mouseup", closeDragElement);
  }
}

if (!window.matchMedia("(max-width: 900px)").matches) {
  document.querySelectorAll(".window").forEach(makeDraggable);
}

window.windowMinimize = function(button) {
  const outerContainer = button.closest(".window");
  if (!outerContainer) return;
  const computedStyle = window.getComputedStyle(outerContainer);
  const currentValue = parseFloat(computedStyle.getPropertyValue("--windowMult")) || 1;
  outerContainer.style.setProperty("--windowMult", (currentValue - 0.25).toString());
}

window.windowMaximize = function(button) {
  const outerContainer = button.closest(".window");
  if (!outerContainer) return;
  const computedStyle = window.getComputedStyle(outerContainer);
  const currentValue = parseFloat(computedStyle.getPropertyValue("--windowMult")) || 1;
  outerContainer.style.setProperty("--windowMult", (currentValue + 0.25).toString());
}

window.windowClose = function(button) {
  const outerContainer = button.closest(".window");
  if (outerContainer) outerContainer.style.display = "none";
}
