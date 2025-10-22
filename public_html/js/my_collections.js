/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


// ===== CLONAR CARROSSEL =====
document.querySelectorAll(".mini-track").forEach(track => {
  const clone = track.innerHTML;
  track.insertAdjacentHTML("beforeend", clone);
});

// ===== MODAL FUNCIONALIDADE =====
const modal = document.getElementById("collectionModal");
const openModalBtn = document.getElementById("openModal");
const closeModal = document.querySelector(".close");
const form = document.getElementById("collectionForm");
const container = document.querySelector(".collections-container");

openModalBtn.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "block";
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) modal.style.display = "none";
});

// ===== DRAG & DROP / PREVIEW =====
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('collectionImage');
const previewImage = document.getElementById('previewImage');

dropArea.addEventListener('dragover', (e) => { e.preventDefault(); dropArea.classList.add('hover'); });
dropArea.addEventListener('dragleave', () => dropArea.classList.remove('hover'));
dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.classList.remove('hover');
  const file = e.dataTransfer.files[0];
  fileInput.files = e.dataTransfer.files;
  showPreview(file);
});
fileInput.addEventListener('change', () => showPreview(fileInput.files[0]));

function showPreview(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.src = e.target.result;
    previewImage.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

// ===== CRIAR NOVA COLEÇÃO =====
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("collectionName").value;

  // Pega a imagem do preview
  const imageSrc = previewImage.src || "";

  // Criar novo card
  const card = document.createElement("div");
  card.classList.add("collection-card");

  card.innerHTML = `
    <img src="${imageSrc}" alt="${name}">
    <h2>${name}</h2>
    <p>items:</p>
    <div class="mini-carousel">
      <div class="mini-track">
        <!-- Nenhum item por enquanto -->
      </div>
    </div>
    <a href="collection.html" class="btn">View Collection</a>
  `;

  container.appendChild(card);

  modal.style.display = "none";
  form.reset();
  previewImage.src = "";
  previewImage.style.display = "none";
});

