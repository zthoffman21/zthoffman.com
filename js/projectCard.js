// Card rotate and light logic
document.querySelectorAll(".card").forEach((card) => {
    const lightEffect = card.querySelector(".lightEffect");
    var posX = 0;
    var posY = 0;

    card.addEventListener("click", function () {
        this.classList.toggle("flipped");
        updateLightEffect(posX, posY, card, lightEffect);
    });

    card.addEventListener("mousemove", (event) => {
        if (window.matchMedia("(max-width: 900px)").matches) {
            return;
        }
        event.preventDefault();

        card.classList.remove("idleCard");

        posX = event.clientX;
        posY = event.clientY;

        updateRotation(posX, posY, card);
        updateLightEffect(posX, posY, card, lightEffect);
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = `rotateX(0) rotateY(0) scale(1)`;
        lightEffect.style.background = "none";

        document.querySelectorAll(".card").forEach((card) => {
            card.classList.remove("idleCard");
            void card.offsetWidth; // Forces reflow
            card.classList.add("idleCard");
        });
    });
});

function updateRotation(posX, posY, card) {
    const rect = card.getBoundingClientRect();
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;
    const centerX = rect.left + cardWidth / 2;
    const centerY = rect.top + cardHeight / 2;

    // Calculate the mouse position relative to the card's center
    const offsetX = posX - centerX;
    const offsetY = posY - centerY;

    // Normalize the mouse position relative to the card dimensions
    const rotateX = (offsetY / (cardHeight / 2)) * 10; // Vertical rotation
    const rotateY = (offsetX / (cardWidth / 2)) * -10; // Horizontal rotation

    // Apply the rotation and scale
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
}

function updateLightEffect(posX, posY, card, lightEffect) {
    const rect = card.getBoundingClientRect();
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;

    // Position the light effect
    const lightX = ((posX - rect.left) / cardWidth) * 100;
    const lightY = ((posY - rect.top) / cardHeight) * 100;

    var flippedOffset = card.classList.contains("flipped") ? 100 : 0;

    // Update the light effect position
    lightEffect.style.background = `radial-gradient(circle at ${Math.abs(
        flippedOffset - lightX
    )}% ${lightY}%, rgba(255, 255, 255, 0.5), transparent 60%)`;
}

// Fade in animations
document.addEventListener("DOMContentLoaded", function () {
    const cards = this.querySelectorAll(".card");
    for (let x = 0; x < cards.length; x++) {
        setTimeout(() => {
            cards[x].style.opacity = 1;
            cards[x].classList.remove("initialFlip");
        }, x * 500);
    }
});

// Blocks clicking on the project link toggling the card flip
document.querySelectorAll(".githubButton").forEach((link) => {
    link.addEventListener("click", (event) => {
        event.stopPropagation();
    });
});