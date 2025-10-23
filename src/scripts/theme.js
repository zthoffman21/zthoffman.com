const themeButtons = Array.from(document.querySelectorAll('.themeButton'));
const themes = ["default", "starWars", "christmas"];
let currentTheme = 0;

function cycleTheme() {
  currentTheme = (currentTheme + 1) % themes.length;
  document.documentElement.setAttribute("data-theme", themes[currentTheme]);
  localStorage.setItem("theme", currentTheme.toString());
  localStorage.setItem("themeName", themes[currentTheme]);
}
if (themeButtons.length) {
  themeButtons.forEach(btn => btn.addEventListener('click', cycleTheme));
}

document.addEventListener("DOMContentLoaded", function () {
  const saved = localStorage.getItem("theme");
  if (saved) currentTheme = parseInt(saved, 10);
});

// Music widget behavior (optional if assets exist in /public/music)
const musicButton = document.getElementById("musicButton");
const musicSelector = document.getElementById("musicSelector");
let windowOpen = false;

if (musicButton && musicSelector) {
  musicButton.addEventListener("click", function () {
    musicSelector.style.opacity = window.getComputedStyle(musicSelector).opacity ^ 1;
    windowOpen = !windowOpen;
    if (windowOpen) {
      document.addEventListener("mousedown", clickOutsideToClose, { once: true });
    }
  });
}

function clickOutsideToClose(event) {
  if (musicButton.contains(event.target)) return;
  if (musicSelector.contains(event.target)) {
    document.addEventListener("mousedown", clickOutsideToClose, { once: true });
    return;
  }
  musicSelector.style.opacity = "0";
  windowOpen = false;
}

export function playTrack(trackSrc) {
  const audioPlayer = document.getElementById("audioPlayer");
  if (!audioPlayer) return;
  audioPlayer.src = trackSrc;
  audioPlayer.volume = 0.5;
  audioPlayer.play();
}

// Expose playTrack for inline onclick usage
window.playTrack = playTrack;
