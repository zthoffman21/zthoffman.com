// Upon page load, the api is called loading a joke
document.addEventListener("DOMContentLoaded", function () {
    // Fetch request
    fetch(
        "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&format=txt"
    )
        // Converting response to text
        .then((response) => response.text())
        // Rendering the data to the webpage
        .then((data) => {
            var joke = document.getElementById("joke");
            joke.textContent = data;
            joke.style.fontStyle = "italic";
        })
        // In case of error, display error message to console
        .catch((error) => {
            console.error("Error:", error);
        });
});