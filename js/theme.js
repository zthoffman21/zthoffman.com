const themeButton = document.getElementById("themeButton");
const themes = ["default", "starWars", "pumpkin", "blue", "christmas"];
var currentTheme = 0;

// Set theme on them button press
if (themeButton) {
    themeButton.addEventListener("click", function () {
        currentTheme = (currentTheme + 1) % themes.length; // Circular iteration
        document.documentElement.setAttribute("data-theme", themes[currentTheme]);

        // Save the theme name and index to local storage
        localStorage.setItem("theme", currentTheme);
        localStorage.setItem("themeName", themes[currentTheme]);
    });
}

// Retrieve the theme index on page load
document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("theme")) {
        currentTheme = parseInt(localStorage.getItem("theme"), 10);
    }
});