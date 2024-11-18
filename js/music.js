// Saving the music state before leaving the page
window.addEventListener("beforeunload", () => {
    const audio = document.getElementById("currentAudio");
    localStorage.setItem("audioSrc", audio.src);             // Save current track
    localStorage.setItem("audioTime", audio.currentTime);     // Save current time
    localStorage.setItem("audioPlaying", !audio.paused);      // Save play/pause state
});

// Restoring the music state on page load
window.addEventListener("load", () => {
    const audio = document.getElementById("currentAudio");
    const savedSrc = localStorage.getItem("audioSrc");
    const savedTime = localStorage.getItem("audioTime");
    const isPlaying = localStorage.getItem("audioPlaying") === "true";

    if (savedSrc) {
        audio.src = savedSrc;
        audio.currentTime = savedTime ? parseFloat(savedTime) : 0;
        if (isPlaying) {
        audio.play();
        }
    }
});

function playMusic(selection) {
    const audio = document.getElementById("currentAudio");
    audio.src = selection;
    audio.play();
}