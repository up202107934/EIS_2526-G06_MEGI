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

  // ----- 2. CÓDIGO DO DROPDOWN DE PERFIL -----
  const avatarButton = document.getElementById('avatarButton');
  const profileDropdown = document.getElementById('profileDropdown');

  if (avatarButton && profileDropdown) {
    avatarButton.addEventListener('click', (e) => {
      e.stopPropagation(); 
      profileDropdown.classList.toggle('show');
    });

    window.addEventListener('click', (e) => {
      if (profileDropdown.classList.contains('show')) {
        profileDropdown.classList.remove('show');
      }
    });
  }
  
  // ----- 3. CÓDIGO DO CARROSSEL (O TEU CÓDIGO) -----
  // (Este script está no teu HTML, mas se o moveres para aqui, também funciona)
  /*
  document.querySelectorAll('.mini-track').forEach(track => {
    const clone = track.innerHTML;
    track.insertAdjacentHTML('beforeend', clone);
  });
  */

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

  // ==========================================================
  // ----- 6. CÓDIGO DO MODAL "CREATE COLLECTION" (CORRIGIDO) -----
  // ==========================================================
  const createBtn = document.getElementById('openModalHome'); // <--- ID CORRETO DO BOTÃO DE ABRIR
  const createModal = document.getElementById('createCollectionModal');
  const cancelBtn = document.getElementById('cancelCollection'); // <--- ID CORRETO DO BOTÃO DE CANCELAR

  // Verificamos apenas os botões que existem no home.html
  if (createBtn && createModal && cancelBtn) {
    
    // Abrir o modal
    createBtn.addEventListener('click', (e) => {
      e.preventDefault(); // <-- ISTO AGORA VAI IMPEDIR O SALTO
      createModal.classList.add('show');
    });
    
    // Fechar no botão "Cancel"
    cancelBtn.addEventListener('click', () => {
      createModal.classList.remove('show');
    });
  }

  // ----- 7. CÓDIGO DO BOTÃO "SAVE COLLECTION" -----
  const saveBtn = document.getElementById('saveCollection');
  const collectionsContainer = document.querySelector('.collections-container');

  if (saveBtn && collectionsContainer && createModal) {
    
    saveBtn.addEventListener('click', () => {
      // 1. Obter os valores do formulário
      const name = document.getElementById('collectionName').value.trim();
      const desc = document.getElementById('collectionDescription').value.trim();
      const imageUrl = document.getElementById('collectionImage').value.trim(); // (Isto é de um input de texto, não do file upload)

      if (!name) {
        alert("Please enter a collection name.");
        return;
      }
      
      const finalImageUrl = imageUrl || 'img/collection-placeholder.jpg'; // (Placeholder)

      // 4. Criar o novo HTML do cartão
      const newCollectionCard = document.createElement('div');
      newCollectionCard.classList.add('collection-card');
      
      newCollectionCard.innerHTML = `
        <img src="${finalImageUrl}" alt="${name}">
        <h2>${name}</h2>
        <p>items:</p>
        <div class="mini-carousel">
          <div class="mini-track">
            <div class="mini-item"><p>No items yet</p></div>
          </div>
        </div>
        <a href="collection.html?id=new" class="btn">View Collection</a>
      `;

      // 5. Adicionar o novo cartão ao ecrã
      collectionsContainer.appendChild(newCollectionCard);

      // 6. Limpar o formulário e fechar o modal
      document.getElementById('collectionName').value = '';
      document.getElementById('collectionDescription').value = '';
      document.getElementById('collectionImage').value = '';
      
      createModal.classList.remove('show');
    });
  }

}); // <-- FIM DO "DOMContentLoaded"