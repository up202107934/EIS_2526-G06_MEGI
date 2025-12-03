// js/team.js

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // LOGICA DO CARROSSEL (Deck Slide)
    // ==========================================
    const slides = document.querySelectorAll('.deck-slide');
    const dotsContainer = document.querySelector('.deck-dots');
    
    // Se não houver slides, sai da função para não dar erro
    if (!slides.length || !dotsContainer) return;

    let currentIndex = 0;

    // Criar os pontinhos (dots)
    slides.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      dot.addEventListener('click', () => {
        currentIndex = idx;
        updateDeck();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateDeck() {
      slides.forEach((slide, idx) => {
        slide.className = 'deck-slide'; // Reseta as classes
        
        if (idx === currentIndex) {
            slide.classList.add('active');
        } else if (idx === (currentIndex - 1 + slides.length) % slides.length) {
            slide.classList.add('prev');
        } else if (idx === (currentIndex + 1) % slides.length) {
            slide.classList.add('next');
        } else {
            slide.classList.add('hidden');
        }
      });

      dots.forEach((dot, idx) => {
        dot.classList.toggle('active-dot', idx === currentIndex);
      });
    }

    // Iniciar
    updateDeck();

    // Rotação automática a cada 3 segundos
    setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateDeck();
    }, 3000);

});