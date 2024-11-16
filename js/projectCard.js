// Card rotate and light logic
document.querySelectorAll('.projectCardContainer').forEach((card) => {
  const lightEffect = document.createElement('div');
  lightEffect.classList.add('lightEffect');
  card.appendChild(lightEffect);

  card.addEventListener('mousemove', (e) => {  
    e.preventDefault();
    
    const rect = card.getBoundingClientRect();
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;
    const centerX = rect.left + cardWidth / 2;
    const centerY = rect.top + cardHeight / 2;
    
    // Calculate the mouse position relative to the card's center
    const offsetX = e.clientX - centerX;
    const offsetY = e.clientY - centerY;

    // Normalize the mouse position relative to the card dimensions
    const rotateX = (offsetY / (cardHeight / 2)) * 10; // Vertical rotation
    const rotateY = (offsetX / (cardWidth / 2)) * -10;   // Horizontal rotation

    // Apply the rotation and scale
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;

    // Position the light effect
    const lightX = ((e.clientX - rect.left) / cardWidth) * 100;
    const lightY = ((e.clientY - rect.top) / cardHeight) * 100;

    // Update the light effect position
    lightEffect.style.background = `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255, 255, 255, 0.5), transparent 60%)`;
  });

  card.addEventListener('mouseleave', () => {
    // Reset the transformation and light effect when the mouse leaves
    card.style.transform = 'rotateX(0) rotateY(0) scale(1)';
    lightEffect.style.background = 'none';
  });
});

// Load animation
$(document).ready(function() {
  // Fade in projectListContainer (the div that holds all project cards)
  $("#projectListContainer").animate({ opacity: 1 }, 800);

  // For each project card: Fade in, rotate to 0, apply default transition settings
  $(".projectCardContainer").each(function(index) {
      // Fade in each card staggering the delay to its index, then applying defauly transition settings once finished
      $(this).delay(index * 500).animate({ opacity: 1 }, 500, function() {
          $(this).css({"transition": "transform 0.1s ease, box-shadow 0.3s ease, background 0.3s ease"});
      });

      // Using setTimeout to sync the rotate with the fade in
      setTimeout(() => {
          $(this).css("transform", "rotate(0deg)");
      }, index * 500); // This delay matches the delay of it fading in
  });

  // Show the click card note after all cards are shown
  setTimeout(() => {
      $("#clickCardNote").animate({opacity: 1}, 300);
  }, $(".projectCardContainer").length * 500);
});