/* * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


  // ----- SORTING (rating/price) -----
  const itemsContainer = document.querySelector('.collection-items');
  const sortSelect = document.getElementById('sortSelect');

  // guardar ordem original para "Default"
  const originalOrder = [...itemsContainer.children].map((el, idx) => {
    el.dataset.__index = idx;  // índice estável
    return el;
  });

  // aplica ordenação guardada (ou default)
  const savedSort = localStorage.getItem('collectionSort') || 'default';
  if (sortSelect) sortSelect.value = savedSort;
  applySort(savedSort);

  if (sortSelect) {
    sortSelect.addEventListener('change', () => applySort(sortSelect.value));
  }

  function applySort(mode){
    const cards = [...itemsContainer.querySelectorAll('.item-card')];
    let sorted = cards.slice();

    const byNum = (getter, dir=1) => (a,b) => (getter(a)-getter(b))*dir;

    switch(mode){
        case 'ratingDesc':
          sorted.sort(byNum(el => Number(el.dataset.rating) || 0, -1));
          break;
        case 'priceAsc':
          sorted.sort(byNum(el => Number(el.dataset.price) || 0, +1));
          break;
        case 'priceDesc':
          sorted.sort(byNum(el => Number(el.dataset.price) || 0, -1));
          break;
        default: // ordem original
          sorted.sort(byNum(el => Number(el.dataset.__index), +1));
          break;
        case 'ratingAsc':
          sorted.sort(byNum(el => Number(el.dataset.rating) || 0, +1));
          break;

        case 'weightAsc':
          sorted.sort(byNum(el => Number(el.dataset.weight) || 0, +1));
          break;

        case 'weightDesc':
          sorted.sort(byNum(el => Number(el.dataset.weight) || 0, -1));
          break;

    }

    const frag = document.createDocumentFragment();
    sorted.forEach(el => frag.appendChild(el));
    itemsContainer.appendChild(frag);

    localStorage.setItem('collectionSort', mode);
  }


// ----- VIEW TOGGLE (Grid / List) -----
const viewButtons = document.querySelectorAll('.btn-view');
const itemsSection = document.querySelector('.collection-items');

// guardar a vista escolhida no localStorage
const savedView = localStorage.getItem('collectionView') || 'grid';
applyView(savedView);

viewButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const view = btn.dataset.view;
    applyView(view);
    localStorage.setItem('collectionView', view);
  });
});

function applyView(view) {
  // alternar classes
  if (view === 'list') {
    itemsSection.classList.remove('grid-view');
    itemsSection.classList.add('list-view');
  } else {
    itemsSection.classList.remove('list-view');
    itemsSection.classList.add('grid-view');
  }

  // atualizar aparência dos botões
  viewButtons.forEach(b => {
    b.setAttribute('aria-pressed', b.dataset.view === view);
  });
}

// CRIAR UM ITEM NOVO
// ======== LÓGICA DO FORMULÁRIO ========
const addItemBtn = document.querySelector('.add-item-btn');
const modal = document.getElementById('addItemModal');
const cancelBtn = document.getElementById('cancelItem');
const saveBtn = document.getElementById('saveItem');
const collection = document.querySelector('.collection-items'); // 'collection' é o mesmo que 'itemsContainer'

/* --- ️UPLOAD DA IMAGEM--- */
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('itemImage');
let uploadedImageURL = "img/default.jpg";

// clicar na zona abre o seletor de ficheiro
dropZone.addEventListener('click', () => fileInput.click());

// quando o ficheiro é selecionado
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      uploadedImageURL = e.target.result; // guarda a imagem em base64
      dropZone.innerHTML = `<img src="${uploadedImageURL}" alt="Preview" style="max-width:100%; border-radius:8px;">`;
    };
    reader.readAsDataURL(file);
  }
});

// suporte a arrastar e largar
dropZone.addEventListener('dragover', e => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = ev => {
      uploadedImageURL = ev.target.result;
      dropZone.innerHTML = `<img src="${uploadedImageURL}" alt="Preview" style="max-width:100%; border-radius:8px;">`;
    };
    reader.readAsDataURL(file);
  }
});

// Abrir modal
addItemBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
});

// Fechar modal
cancelBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Guardar novo item
saveBtn.addEventListener('click', () => {
  const name = document.getElementById('itemName').value.trim();
  const desc = document.getElementById('itemDesc').value.trim();
  const rating = document.getElementById('itemRating').value.trim();
  const price = document.getElementById('itemPrice').value.trim();
  const weight = document.getElementById('itemWeight').value.trim();


  // Verificar campos obrigatórios
  if(!name || !desc){
    alert("Please fill in all required fields.");
    return;
  }

  // Garantir que rating está entre 1 e 10
  const ratingNum = Number(rating);
  if (ratingNum < 1 || ratingNum > 10) {
    alert("Rating must be between 1 and 10.");
    return;
  }

// Criar novo card
const newCard = document.createElement('div');
newCard.classList.add('item-card');
newCard.dataset.rating = rating || 0;
newCard.dataset.price  = price  || 0;
newCard.dataset.weight = weight || 0;

// =======================================================
// ===== CORREÇÃO DO BUG "DEFAULT SORT" ADICIONADA AQUI ====
newCard.dataset.__index = itemsContainer.children.length;
// =======================================================

newCard.innerHTML = `
  <img src="${uploadedImageURL}" alt="${name}">
  <div class="item-details">
    <div class="item-text">
      <h3>${name}</h3>
      <p>${desc}</p>
    </div>
    <div class="item-info">
      <span>⭐ ${rating}/10</span>
      <span>💰 ${price}€</span>
      <span>⚖️ ${weight}g</span>
    </div>
  </div>
  <div class="item-actions">
    <button>View Details</button>
  </div>
`;


  // Adicionar ao ecrã
  collection.appendChild(newCard);
 
  // --- IMPORTANTE ---
  // Adiciona o listener ao novo botão "View Details"
  // Sem isto, o botão no novo item não funciona.
  newCard.querySelector('button').addEventListener('click', () => {
      window.location.href = 'item.html';
  });
  // --- FIM DA ADIÇÃO ---


  // Fechar modal e limpar campos
  modal.style.display = 'none';
  document.querySelectorAll('#addItemModal input').forEach(i => i.value = '');
  uploadedImageURL = "img/default.jpg"; // repõe imagem default
  dropZone.innerHTML = '<p>Drag & drop an image here, or click to select</p>';
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



document.querySelectorAll('.item-card button').forEach(button => {
  button.addEventListener('click', () => {
    window.location.href = 'item.html'; 
  });
});


// --- Mostrar nome do utilizador criador da coleção ---
window.addEventListener("load", () => {
  // espera até TUDO (incluindo data.js) estar carregado
  const params = new URLSearchParams(window.location.search);
  const collectionId = parseInt(params.get("id"));

  if (!collectionId) {
    console.warn("Nenhum ID recebido no URL.");
    return;
  }

  // confirma se as variáveis globais existem
  if (typeof collections === "undefined" || typeof users === "undefined") {
    console.error("data.js ainda não carregado ou com erro.");
    return;
  }

  const collection = collections.find(c => c.id === collectionId);
  if (!collection) {
    console.error("Coleção não encontrada para ID:", collectionId);
    return;
  }

  const user = users.find(u => u.id === collection.userId);
  const infoContainer = document.createElement("div");
  infoContainer.classList.add("collection-info");
  infoContainer.innerHTML = `
    <h2>${collection.name}</h2>
    <p>Criada por: <a href="user_view.html?id=${user.id}">${user.name}</a></p>
  `;

  const header = document.querySelector(".collection-header");
  if (header) header.after(infoContainer);
  else document.body.prepend(infoContainer);
});
