const themeButton = document.getElementById("themeButton");
const themes = ["default", "light", "pumpkin", "blue", "christmas"];
var currentTheme = 0;

// Set theme on them button press
if (themeButton) {
    themeButton.addEventListener('click', function() {
        currentTheme = (currentTheme + 1) % themes.length;
        document.documentElement.setAttribute("dataTheme", themes[currentTheme]);
        localStorage.setItem("theme", currentTheme);
    });
}

// Load theme on page load
document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem("theme")) {
        this.documentElement.setAttribute("dataTheme", themes[parseInt(localStorage.getItem("theme"), 10)]);
    }
});