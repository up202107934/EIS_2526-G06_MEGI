/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


const form = document.getElementById('userForm');
const statusMsg = document.getElementById('statusMsg');
const photoModal = document.getElementById('photoModal');
const editPhotoBtn = document.getElementById('editPhotoBtn');
const closeModal = document.getElementById('closeModal');
const photoInput = document.getElementById('photoInput');
const profileImage = document.getElementById('profileImage');
const displayName = document.getElementById('displayName');
const displayEmail = document.getElementById('displayEmail');

// Handle form submission
form.addEventListener('submit', e => {
  e.preventDefault();
  const first = document.getElementById('firstName').value.trim();
  const last = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  if(!first || !last || !email){
    alert("Please fill all required fields!");
    return;
  }
  displayName.textContent = first + " " + last;
  displayEmail.textContent = email;
  statusMsg.style.display = "inline";
  setTimeout(() => statusMsg.style.display = "none", 2000);
});

// Modal logic
editPhotoBtn.addEventListener('click', () => photoModal.style.display = 'flex');
closeModal.addEventListener('click', () => photoModal.style.display = 'none');
window.addEventListener('click', e => { if(e.target === photoModal) photoModal.style.display = 'none'; });

// Change photo
photoInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = ev => {
      profileImage.src = ev.target.result;
      localStorage.setItem('profileImage', ev.target.result);
    }
    reader.readAsDataURL(file);
    photoModal.style.display = 'none';
  }
});

// Load saved photo
const savedPhoto = localStorage.getItem('profileImage');
if(savedPhoto) profileImage.src = savedPhoto;


//criar nova colecao
const createBtn = document.getElementById("openModal");
const modal = document.getElementById("createCollectionModal");
const cancelBtn = document.getElementById("cancelCollection");
const saveBtn = document.getElementById("saveCollection");
const dropZone = document.getElementById("dropZoneCollection");
const fileInput = document.getElementById("collectionImage");
const collectionsContainer = document.querySelector(".collections-grid");

// === Abrir modal ===
createBtn.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "flex";
});

// === Fechar modal ===
cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// === Selecionar imagem ===
dropZone.addEventListener("click", () => fileInput.click());
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("drag-over");
});
dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  fileInput.files = e.dataTransfer.files;
  dropZone.classList.remove("drag-over");
});

// === Guardar coleção ===
saveBtn.addEventListener("click", () => {
  const name = document.getElementById("collectionName").value.trim();
  const file = fileInput.files[0];

  if (!name) {
    alert("Please enter a collection name!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const imgSrc = e.target.result || "img/default.jpg";

    const collection = {
      name,
      img: imgSrc,
      items: 0
    };

    // Guardar no localStorage
    const savedCollections = JSON.parse(localStorage.getItem("collections") || "[]");
    savedCollections.push(collection);
    localStorage.setItem("collections", JSON.stringify(savedCollections));

    // Atualizar visualmente
    addCollectionToPage(collection);

    // Fechar modal
    modal.style.display = "none";
    document.getElementById("collectionName").value = "";
    fileInput.value = "";
  };

  if (file) reader.readAsDataURL(file);
  else reader.onload({ target: { result: "img/default.jpg" } });
});

// === Função para adicionar coleção na página ===
function addCollectionToPage(collection) {
  const card = document.createElement("div");
  card.classList.add("collection-card");
  card.innerHTML = `
    <img src="${collection.img}" alt="${collection.name}">
    <h2>${collection.name}</h2>
    <p>0 items</p>
    <a href="new_collection.html?name=${encodeURIComponent(collection.name)}" class="btn-view">View Collection</a>
  `;
  collectionsContainer.appendChild(card);
}

// === Carregar coleções existentes ao abrir página ===
window.addEventListener("DOMContentLoaded", () => {
  const savedCollections = JSON.parse(localStorage.getItem("collections") || "[]");
  savedCollections.forEach(addCollectionToPage);
});
