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
const previewImg = document.getElementById("collectionPreview");
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

// === Mostrar pré-visualização da imagem e ocultar o dropzone ===
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewImg.style.display = "block";
      dropZone.style.display = "none"; // oculta o retângulo
    };
    reader.readAsDataURL(file);
  } else {
    previewImg.style.display = "none";
    dropZone.style.display = "flex"; // mostra de novo se limpar a imagem
  }
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

  reader.onload = function (e) {
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
    addCollectionToPage(collection, savedCollections.length - 1);

    // Fechar modal e limpar campos
    modal.style.display = "none";
    document.getElementById("collectionName").value = "";
    document.getElementById("collectionDescription").value = "";
    fileInput.value = "";
    previewImg.style.display = "none";
    dropZone.style.display = "flex";
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    // Forçar leitura da imagem padrão
    reader.onload({ target: { result: "img/default.jpg" } });
  }
});

// === Função para adicionar coleção na página ===
function addCollectionToPage(collection, index) {
  const card = document.createElement("div");
  card.classList.add("collection-card");
  card.dataset.index = index;

  card.innerHTML = `
    <img src="${collection.img}" alt="${collection.name}">
    <h2>${collection.name}</h2>
    <p>${collection.items} items</p>
    <div class="card-buttons">
      <a href="new_collection.html?name=${encodeURIComponent(collection.name)}" class="btn-view">View Collection</a>
      <button class="btn-remove">🗑</button>
    </div>
  `;

  // === Evento de remoção ===
  card.querySelector(".btn-remove").addEventListener("click", () => {
    if (confirm(`Are you sure you want to remove "${collection.name}"?`)) {
      removeCollection(index);
      card.remove();
    }
  });

  collectionsContainer.appendChild(card);
}

// === Função para remover coleção do localStorage ===
function removeCollection(index) {
  const savedCollections = JSON.parse(localStorage.getItem("collections") || "[]");
  savedCollections.splice(index, 1);
  localStorage.setItem("collections", JSON.stringify(savedCollections));
}




// === DARK MODE TOGGLE ===
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;

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
});

// === botão "Remove" nas coleções fixas do html da homepage) ===
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".collection-card .btn-remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".collection-card");
      const name = card.querySelector("h3, h2")?.textContent || "this collection";
      if (confirm(`Are you sure you want to remove "${name}"?`)) {
        card.remove();
      }
    });
  });
});
