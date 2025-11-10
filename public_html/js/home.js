/* * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

// === TUDO ACONTECE DEPOIS DE A PÁGINA CARREGAR ===
document.addEventListener("DOMContentLoaded", () => {

  // ----- 1. CÓDIGO DO DARK MODE -----
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) { 
    const currentTheme = localStorage.getItem("theme");
  
    if (currentTheme === "dark") {
      document.body.classList.add("dark-mode");
      themeToggle.textContent = "☀️";
    }
  
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      themeToggle.textContent = isDark ? "☀️" : "🌙";
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }
  
  // ----- 3. CÓDIGO DO CARROSSEL -----
  document.querySelectorAll('.mini-track').forEach(track => {
    const clone = track.innerHTML;
    track.insertAdjacentHTML('beforeend', clone);
  });

  // ----- 4. CÓDIGO DO BOTÃO EXPLORAR -----
  const heroBtn = document.querySelector('.hero-btn');
  if (heroBtn) { 
    heroBtn.addEventListener('click', function(e) {
      e.preventDefault(); 
      const target = document.querySelector('#collections');
      if (!target) return;
  
      const targetY = target.getBoundingClientRect().top + window.scrollY;
      const duration = 1200; 
      const startY = window.scrollY;
      const diff = targetY - startY;
      let start;
  
      function smoothScroll(timestamp) {
        if (!start) start = timestamp;
        const time = timestamp - start;
        const percent = Math.min(time / duration, 1);
        window.scrollTo(0, startY + diff * percent);
        if (time < duration) requestAnimationFrame(smoothScroll);
      }
  
      requestAnimationFrame(smoothScroll);
    });
  }

  // ----- 5. CÓDIGO DA BARRA DE PESQUISA -----
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const collectionCards = document.querySelectorAll(".collection-card");

  if (searchForm && searchInput && collectionCards.length > 0) { 
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault(); 
      const query = searchInput.value.trim().toLowerCase();
  
      if (query === "") {
        collectionCards.forEach(card => card.style.display = "flex");
        return;
      }
  
      let found = false;
  
      collectionCards.forEach(card => {
        const title = card.querySelector("h2").textContent.trim().toLowerCase();
        if (title.includes(query)) {
          card.style.display = "flex";
          found = true;
        } else {
          card.style.display = "none";
        }
      });
  
      if (!found) {
        alert("No collections found with that name 😔");
      }
    });
  
    searchInput.addEventListener("input", function() {
      if (this.value.trim() === "") {
        collectionCards.forEach(card => card.style.display = "flex");
      }
    });
  }

 
 

}); // <-- FIM DO "DOMContentLoaded"