function setAbsolutePositions() {
    const container = document.getElementById("mainContainer");
    const windows = document.querySelectorAll(".window");

    container.style.height = container.getBoundingClientRect().height + "px";
    document.getElementById("footer").style.opacity = 1;

    windows.forEach((window) => {
        const rect = window.getBoundingClientRect();
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        window.style.left = rect.left + scrollLeft + "px";
        window.style.top = rect.top + scrollTop + "px";
    });
    windows.forEach((window) => {
        window.style.position = "absolute";
    });
}

const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if (!isMobileDevice) {
  window.addEventListener('resize', function() {
    location.reload();
  });
}

window.addEventListener("DOMContentLoaded", function() {
    if (!window.matchMedia("(max-width: 900px)").matches) {
        setAbsolutePositions();
    } else {
        document.getElementById("footer").style.opacity = 1;
    }
});