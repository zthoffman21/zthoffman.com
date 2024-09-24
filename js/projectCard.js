document.querySelectorAll('.projectCardContent').forEach((card) => {
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
    const rotateX = (offsetY / (cardHeight / 2)) * -10; // Vertical rotation
    const rotateY = (offsetX / (cardWidth / 2)) * 10;   // Horizontal rotation

    // Apply the rotation and scale
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
  });

  card.addEventListener('mouseleave', () => {
    // Reset the transformation when the mouse leaves
    card.style.transform = 'rotateX(0) rotateY(0) scale(1)';
  });
});