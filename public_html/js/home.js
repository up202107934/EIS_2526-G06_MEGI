/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

  document.querySelectorAll('.mini-track').forEach(track => {
    const clone = track.innerHTML;
    track.insertAdjacentHTML('beforeend', clone);
  });


// === DARK MODE TOGGLE ===
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return; // segurança

  const currentTheme = localStorage.getItem("theme");

  // aplica o tema guardado
  if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
  }

  // alterna entre claro/escuro
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});

// botao de explorar deslizar para baixo
document.querySelector('.hero-btn').addEventListener('click', function(e) {
  e.preventDefault(); 
  const target = document.querySelector('#collections');
  if (!target) return;

  // posição de destino
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


//barra de pesquisa
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const collectionCards = document.querySelectorAll(".collection-card");

searchForm.addEventListener("submit", function (e) {
  e.preventDefault(); // impede reload da página

  const query = searchInput.value.trim().toLowerCase();

  // se o campo estiver vazio, mostra tudo outra vez
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

  // se nenhuma coleção corresponder, podes mostrar uma mensagem opcional
  if (!found) {
    alert("No collections found with that name 😔");
  }
});
searchInput.addEventListener("input", function() {
  if (this.value.trim() === "") {
    collectionCards.forEach(card => card.style.display = "flex");
  }
});

