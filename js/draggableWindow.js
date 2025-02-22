function makeDraggable(windowEl) {
    const titleBar = windowEl.querySelector(".draggable");
    if (!titleBar) return;

    let startX, startY, initialLeft, initialTop;

    titleBar.style.cursor = "move";
    titleBar.addEventListener("mousedown", dragMouseDown);

    function dragMouseDown(e) {
        e.preventDefault();
        const computedStyle = getComputedStyle(windowEl);
        // Use the computed left/top, or fallback to bounding rect values
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
        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;

        windowEl.style.left = newLeft + "px";
        windowEl.style.top = newTop + "px";
    }

    function closeDragElement() {
        document.removeEventListener("mousemove", elementDrag);
        document.removeEventListener("mouseup", closeDragElement);
    }
}

document.querySelectorAll(".window").forEach(makeDraggable);

function windowMinimize(button) {
    const outerContainer = button.closest(".window");
    if (outerContainer) {
        const computedStyle = window.getComputedStyle(outerContainer);
        let currentValue = parseFloat(computedStyle.getPropertyValue("--windowMult")) || 1;
        outerContainer.style.setProperty("--windowMult", currentValue - 0.25);
    }
}
function windowMaximize(button) {
    const outerContainer = button.closest(".window");
    if (outerContainer) {
        const computedStyle = window.getComputedStyle(outerContainer);
        let currentValue = parseFloat(computedStyle.getPropertyValue("--windowMult")) || 1;
        outerContainer.style.setProperty("--windowMult", currentValue + 0.25);
    }
}
function windowClose(button) {
    const outerContainer = button.closest(".window");
    if (outerContainer) {
        outerContainer.style.display = "none";
    }
}
