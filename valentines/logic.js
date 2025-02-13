const no_button = document.getElementById("no_button");
const yes_button = document.getElementById("yes_button");

no_button.addEventListener("click", function(){
    yes_button.style.width  = yes_button.offsetWidth * 1.2 + "px";
    yes_button.style.height  = yes_button.offsetHeight * 1.2 + "px"
    yes_button.style.fontSize = (yes_button.offsetWidth/75) + "em"

    no_button.style.position = "absolute";
    no_button.style.left = Math.round(Math.random() * window.innerWidth) + "px";
    no_button.style.top = Math.round(Math.random() * window.innerHeight) + "px";
});

yes_button.addEventListener("click", function(){
    window.location.href =  "response.html";
});