const themeButton = document.getElementById("themeButton");
const themes = ["default", "light", "pumpkin", "blue", "christmas"];
var currentTheme = 4;

// Set theme on them button press
if (themeButton) {
    themeButton.addEventListener('click', function() {
        currentTheme = (currentTheme + 1) % themes.length;
        document.documentElement.setAttribute("data-theme", themes[currentTheme]);
        localStorage.setItem("theme", currentTheme);
        localStorage.setItem("themeName", themes[currentTheme])
    });
}

// Load theme on page load
document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem("theme")) {
        this.documentElement.setAttribute("data-theme", themes[parseInt(localStorage.getItem("theme"), 10)]);
    }
});