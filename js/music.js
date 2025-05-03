const musicButton = document.getElementById("musicButton");
const musicSelector = document.getElementById("musicSelector");
let windowOpen = false;

musicButton.addEventListener("click", function (event) {
    musicSelector.style.opacity = window.getComputedStyle(musicSelector).opacity ^ 1;
    windowOpen = windowOpen ? false : true;
    if (windowOpen) {
        document.addEventListener("mousedown", clickOutsideToClose, { once: true });
    }
});

function clickOutsideToClose(event) {
    if (musicButton.contains(event.target)) {
        return;
    }
    if (musicSelector.contains(event.target)) {
        document.addEventListener("mousedown", clickOutsideToClose, { once: true });
        return;
    }
    musicSelector.style.opacity = "0";
    windowOpen = false;
}

function playTrack(trackSrc) {
    const audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.src = trackSrc;
    audioPlayer.play();
}
const audioPlayer = document.getElementById("audioPlayer");
audioPlayer.volume = 0.5;