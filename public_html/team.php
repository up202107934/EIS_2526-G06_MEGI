<?php
require_once __DIR__ . "/partials/bootstrap.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Our Team | MyCollections</title>
  <link rel="stylesheet" href="css/style.css" />
  
  <script src="js/navbar.js"></script>
</head>

<body>
  <?php require_once __DIR__ . "/partials/navbar.php"; ?>

<!-- team -->
  <section class="team-deck-section">
    <h1 class="deck-title">Meet Our Team</h1>  

    <div class="deck-container">
      <div class="deck-slide" data-index="0">
        <img src="img/joana.jpg" alt="Joana Ferreira">
        <h2>Joana Ferreira</h2>
        <p>Email: <a href="mailto:up202106097@up.pt">up202106097@up.pt</a></p>
        <p>Group 6</p>
        <p>Master in Industrial Engineering and Management</p>
      </div>

      <div class="deck-slide" data-index="1">
        <img src="img/pedro.jpg" alt="Pedro Almeida">
        <h2>Pedro Almeida</h2>
        <p>Email: <a href="mailto:up202105715@up.pt">up202105715@up.pt</a></p>
        <p>Group 6</p>
        <p>Master in Industrial Engineering and Management</p>
      </div>

      <div class="deck-slide" data-index="2">
        <img src="img/raquel.jpg" alt="Raquel Silva">
        <h2>Raquel Silva</h2>
        <p>Email: <a href="mailto:up202107934@up.pt">up202107934@up.pt</a></p>
        <p>Group 6</p>
        <p>Master in Industrial Engineering and Management</p>
      </div>

      <div class="deck-slide" data-index="3">
        <img src="img/rita.jpg" alt="Rita Rodrigues">
        <h2>Rita Rodrigues</h2>
        <p>Email: <a href="mailto:up202105916@up.pt">up202105916@up.pt</a></p>
        <p>Group 6</p>
        <p>Master in Industrial Engineering and Management</p>
      </div>
    </div>
    <div class="deck-dots"></div>
  </section>

  <script>
    const slides = document.querySelectorAll('.deck-slide');
    const dotsContainer = document.querySelector('.deck-dots');
    let currentIndex = 0;

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
        slide.className = 'deck-slide';
        if (idx === currentIndex) slide.classList.add('active');
        else if (idx === (currentIndex - 1 + slides.length) % slides.length) slide.classList.add('prev');
        else if (idx === (currentIndex + 1) % slides.length) slide.classList.add('next');
        else slide.classList.add('hidden');
      });
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active-dot', idx === currentIndex);
      });
    }

    updateDeck();
    setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateDeck();
    }, 3000);
  </script>
  
  <footer class="footer">
    <p>© 2025 MyCollections | All rights reserved.</p>
  </footer>
</body>
</html>