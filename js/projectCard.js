// Card rotate and light logic
document.querySelectorAll(".projectCardContainer").forEach((card) => {
    const lightEffect = document.createElement("div");
    lightEffect.classList.add("lightEffect");
    card.appendChild(lightEffect);

    card.addEventListener("mousemove", (event) => {
        if (flipping || window.matchMedia("(max-width: 768px)").matches) { return; }
        event.preventDefault();

        const rect = card.getBoundingClientRect();
        const cardWidth = card.offsetWidth;
        const cardHeight = card.offsetHeight;
        const centerX = rect.left + cardWidth / 2;
        const centerY = rect.top + cardHeight / 2;

        // Calculate the mouse position relative to the card's center
        const offsetX = event.clientX - centerX;
        const offsetY = event.clientY - centerY;

        // Normalize the mouse position relative to the card dimensions
        const rotateX = (offsetY / (cardHeight / 2)) * 10; // Vertical rotation
        const rotateY = (offsetX / (cardWidth / 2)) * -10; // Horizontal rotation

        // Apply the rotation and scale
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;

        // Position the light effect
        const lightX = ((event.clientX - rect.left) / cardWidth) * 100;
        const lightY = ((event.clientY - rect.top) / cardHeight) * 100;

        // Update the light effect position
        lightEffect.style.background = `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255, 255, 255, 0.5), transparent 60%)`;
    });

    card.addEventListener("mouseleave", () => {
        // Reset the transformation and light effect when the mouse leaves
        card.style.transform = "rotateX(0) rotateY(0) scale(1)";
        lightEffect.style.background = "none";
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const cards = this.getElementsByClassName("projectCardContainer");

    for (let x = 0; x < cards.length; x++) {
        // Fade in each card and rotate
        setTimeout(() => {
            cards[x].style.opacity = 1;
            cards[x].style.transform = "rotateX(0) rotateY(0) scale(1)";
        }, x * 800); // Delay increases for each card

        // Return each card's transition to its default setting
        setTimeout(() => {
            cards[x].style.transition =
                "transform 0.1s ease, box-shadow 0.3s ease, background 0.3s ease";
        }, x * 800 + 1000); // x * 800 -> Delay between each card fading in, + 1000 -> each cards transition is 1000 ms
    }

    // Fade in the click card note
    setTimeout(() => {
        this.getElementById("clickCardNote").style.opacity = 1;
    }, cards.length * 800); // Delay is set to after all the cards fade in
});


var flipping = false;

function flipCard(event) {
    // Get the clicked element
    const clickedElement = event.target;
    
    // If they clicked the back-link, let it navigate
    if (clickedElement.classList.contains('backLink')) {
        return;
    }
    
    event.preventDefault();

    // Setting card data
    const card = event.currentTarget;
    const cardContent = card.querySelector('.projectCardContent');
    const isFlipped = card.dataset.flipped === 'true';

    // Flipping animations
    card.style.transform = "rotateX(0) rotateY(180deg) scale(1)";
    flipping = true;
    setTimeout(() => { card.style.transform = "rotateX(0) rotateY(0) scale(1)"; }, 100);
    setTimeout(() => { flipping = false; }, 200);
    
    if (!isFlipped) {
        cardContent.innerHTML = `
            <div class="backContent">
                <img src="${card.dataset.backImage}" alt="project details" />
                <h1>This is a test</h1>
                <a href="${card.dataset.projectLink}" class="backLink" target="_blank">Github</a>
            </div>
        `;
        card.dataset.flipped = 'true';
    } else {
        cardContent.innerHTML = `
            <img src="${card.dataset.frontImage}" alt="project preview" />
        `;
        card.dataset.flipped = 'false';
    }
}