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

  // ----- 6. CÓDIGO DO MODAL "CREATE COLLECTION" (Abrir/Fechar) -----
  const createBtn = document.querySelector('.create-collection');
  const createModal = document.getElementById('createCollectionModal');
  const cancelBtn = document.getElementById('cancelCreate');
  const closeBtn = document.getElementById('closeCreateModal');

  if (createBtn && createModal && cancelBtn && closeBtn) {
    
    // Abrir o modal
    createBtn.addEventListener('click', (e) => {
      e.preventDefault(); 
      createModal.classList.add('show');
    });
    
    // Fechar no botão "Cancel"
    cancelBtn.addEventListener('click', () => {
      createModal.classList.remove('show');
    });

    // Fechar no 'X'
    closeBtn.addEventListener('click', () => {
      createModal.classList.remove('show');
    });
  }

  // ----- 7. CÓDIGO DO BOTÃO "SAVE COLLECTION" (NOVO CÓDIGO) -----
  const saveBtn = document.getElementById('saveCollectionBtn');
  const collectionsContainer = document.querySelector('.collections-container');

  if (saveBtn && collectionsContainer && createModal) {
    
    saveBtn.addEventListener('click', () => {
      // 1. Obter os valores do formulário
      const name = document.getElementById('collectionName').value.trim();
      const desc = document.getElementById('collectionDesc').value.trim(); // Nota: A descrição não está a ser usada no cartão, mas é bom tê-la.
      const imageUrl = document.getElementById('collectionImage').value.trim();

      // 2. Validação simples
      if (!name) {
        alert("Please enter a collection name.");
        return;
      }
      
      // 3. Usar uma imagem "placeholder" se nenhuma for fornecida
      // (Certifica-te que tens uma imagem 'img/collection-placeholder.jpg' ou altera o caminho)
      const finalImageUrl = imageUrl || 'img/collection-placeholder.jpg'; 

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
      document.getElementById('collectionDesc').value = '';
      document.getElementById('collectionImage').value = '';
      
      createModal.classList.remove('show');
    });
  }

}); // <-- FIM DO "DOMContentLoaded"