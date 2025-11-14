/* * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
   const collectionId = new URLSearchParams(window.location.search).get("id");
    const allCollections = JSON.parse(localStorage.getItem("collections") || "[]");
    const currentCollection = allCollections.find(c => c.id === collectionId);

    const pageAddBtn = document.querySelector(".add-item-btn");

    if (pageAddBtn && (!currentCollection || !currentCollection.ownedByUser)) {
      pageAddBtn.style.display = "none";
    }

  const itemsContainer = document.querySelector('.collection-items');
  const sortSelect = document.getElementById('sortSelect');

 
  const originalOrder = [...itemsContainer.children].map((el, idx) => {
    el.dataset.__index = idx;  // índice estável
    return el;
  });

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
        default:
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




    /* filtro por categoria */
const categorySelect = document.getElementById("categoryFilter");

if (categorySelect) {
  categorySelect.addEventListener("change", () => {
    const selected = categorySelect.value.toLowerCase();
    const cards = document.querySelectorAll(".item-card");

    cards.forEach(card => {
      const category = (card.dataset.category || "").toLowerCase();

      if (selected === "all" || category === selected) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  });
}









// (Grid / List)
const viewButtons = document.querySelectorAll('.btn-view');
const itemsSection = document.querySelector('.collection-items');

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
  if (view === 'list') {
    itemsSection.classList.remove('grid-view');
    itemsSection.classList.add('list-view');
  } else {
    itemsSection.classList.remove('list-view');
    itemsSection.classList.add('grid-view');
  }

  viewButtons.forEach(b => {
    b.setAttribute('aria-pressed', b.dataset.view === view);
  });
}


// CRIAR UM ITEM NOVO
const addItemBtn = document.querySelector('.add-item-btn');
const modal = document.getElementById('addItemModal');

if (addItemBtn && modal) {
    const cancelBtn = document.getElementById('cancelItem');
    const saveBtn = document.getElementById('saveItem');
    const collection = document.querySelector('.collection-items'); 

    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('itemImage');
    let uploadedImageURL = "img/default.jpg";

    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          uploadedImageURL = e.target.result; 
          dropZone.innerHTML = `<img src="${uploadedImageURL}" alt="Preview" style="max-width:100%; border-radius:8px;">`;
        };
        reader.readAsDataURL(file);
      }
    });

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

    addItemBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
    });

    cancelBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    const form = document.getElementById('addItemForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name   = document.getElementById('itemName').value.trim();
      const desc   = document.getElementById('itemDesc').value.trim();
      const rating = document.getElementById('itemRating').value.trim();
      const price  = document.getElementById('itemPrice').value.trim();
      const weight = document.getElementById('itemWeight').value.trim();
      const date   = document.getElementById('itemDate').value;

      // 1) Verificar se algum está vazio
      if (!name || !desc || !rating || !price || !weight || !date) {
        alert("Please fill in all fields (name, description, rating, price, weight and date).");
        return;
      }

      // 2) Rating 1–10
      const ratingNum = Number(rating);
      if (Number.isNaN(ratingNum) || ratingNum < 1 || ratingNum > 10) {
        alert("Rating must be a number between 1 and 10.");
        return;
      }

      // 3) Preço ≥ 0
      const priceNum = Number(price);
      if (Number.isNaN(priceNum) || priceNum < 0) {
        alert("Price must be a number greater than or equal to 0.");
        return;
      }

      // 4) Peso > 0  
      const weightNum = Number(weight);
      if (Number.isNaN(weightNum) || weightNum <= 0) {
        alert("Weight must be a number greater than 0.");
        return;
      }

      // 5) Imagem obrigatória
      if (!fileInput.files || !fileInput.files.length) {
        alert("Please upload an image for the item.");
        return;
      }

      const newCard = document.createElement('div');
      newCard.classList.add('item-card');
      newCard.dataset.rating  = ratingNum;
      newCard.dataset.price   = priceNum;
      newCard.dataset.weight  = weightNum;
      newCard.dataset.__index = itemsContainer.children.length;

      newCard.innerHTML = `
        <img src="${uploadedImageURL}" alt="${name}">
        <div class="item-details">
          <div class="item-text">
            <h3>${name}</h3>
            <p>${desc}</p>
          </div>
          <div class="item-info">
            <span>⭐ ${ratingNum}/10</span>
            <span>💰 ${priceNum}€</span>
            <span>⚖️ ${weightNum}g</span>
            <span class="like-container">
              <button class="like-btn" type="button" aria-label="Like item">♡</button>
              <span class="like-count">0</span>
            </span>
          </div>
        </div>
        <div class="item-actions">
          <button class="btn-details">View Details</button>
        </div>
      `;

      collection.appendChild(newCard);

      newCard.querySelector('.btn-details').addEventListener('click', () => {
        window.location.href = 'item.html';
      });

      form.reset();
      uploadedImageURL = "img/default.jpg";
      dropZone.innerHTML = '<p>Drag & drop an image here, or click to select</p>';
      modal.style.display = 'none';
    });

    
} 


// dark mode
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
    const isScura = document.body.classList.contains("dark-mode");
    themeToggle.textContent = isScura ? "☀️" : "🌙";
    localStorage.setItem("theme", isScura ? "dark" : "light");
  });
});

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

// Mostrar nome do utilizador criador da coleção 
window.addEventListener("load", () => {
  const params = new URLSearchParams(window.location.search);
  const collectionId = parseInt(params.get("id"), 10);

  if (!collectionId) {
    console.warn("Nenhum ID recebido no URL.");
    return;
  }

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
      <div class="collection-info">
  <div class="collection-author-box">
    <div class="collection-author-avatar">
      <img src="img/user.jpg" alt="Ana Silva">
    </div>
    <div class="collection-author-text">
      <span class="collection-author-label">Created by</span>
      <a href="user_view.html?id=123" class="collection-author-name">Ana Silva</a>
    </div>
  </div>
</div>
  `;

  const header = document.querySelector(".collection-header");
  if (header) {
    header.after(infoContainer);
  } else {
    document.body.prepend(infoContainer);
  }
});



/* adicionar a wishlist */
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const collectionIdRaw = params.get("id"); 
  const collectionId = collectionIdRaw ? collectionIdRaw.toString() : null;

  const collectionTitleEl = document.querySelector(".collection-title");
  const collectionName = collectionTitleEl ? collectionTitleEl.textContent.trim() : "default";

  const keySuffix = collectionId ? `${collectionId}` : collectionName.replace(/\s+/g, "_");
  const wishlistKey = `wishlist_col_${keySuffix}`;

  function uidFor(collectionIdOrName, name, img) {
    return encodeURIComponent(`${collectionIdOrName}||${name}||${img}`);
  }
  function load(key){ return JSON.parse(localStorage.getItem(key) || "[]"); }
  function save(key, arr){ localStorage.setItem(key, JSON.stringify(arr)); }

  let wishlist = load(wishlistKey);
  let globalList = load("wishlist");

  
  document.querySelectorAll(".item-card").forEach(card => {
    const name = card.querySelector("h3").textContent;
    const img = card.querySelector("img").src;
    const button = card.querySelector(".like-btn");
    const countSpan = card.querySelector(".like-count");
    const colIdent = collectionId ? `id:${collectionId}` : `name:${collectionName}`;
    const uid = uidFor(colIdent, name, img);
    const found = wishlist.find(i => i.uid === uid);
    if (found) {
      button.textContent = "♥";
      button.style.color = "red";
      countSpan.textContent = typeof found.likes !== "undefined" ? found.likes : 1;
    } else {
      countSpan.textContent = countSpan.textContent || "0";
    }
  });

  const container = document.querySelector(".collection-items");
  container.addEventListener("click", (ev) => {
    if (!ev.target.classList.contains("like-btn")) return;
    const button = ev.target;
    const card = button.closest(".item-card");
    if (!card) return;
    const name = card.querySelector("h3").textContent;
    const img = card.querySelector("img").src;
    const desc = card.querySelector("p") ? card.querySelector("p").textContent : "";
    const countSpan = card.querySelector(".like-count");
    const colIdent = collectionId ? `id:${collectionId}` : `name:${collectionName}`;
    const uid = uidFor(colIdent, name, img);

    const itemObj = {
      uid,
      name,
      desc,
      img,
      rating: card.dataset.rating || "N/A",
      price: card.dataset.price || "N/A",
      weight: card.dataset.weight || "N/A",
      collectionId: collectionId || null,
      collectionName,
      likes: 1
    };

    const idxLocal = wishlist.findIndex(i => i.uid === uid);
    const idxGlobal = globalList.findIndex(i => i.uid === uid);

    if (idxLocal >= 0) {
      wishlist.splice(idxLocal, 1);
      if (idxGlobal >= 0) globalList.splice(idxGlobal, 1);
      button.textContent = "♡";
      button.style.color = "";
      countSpan.textContent = "0";
      console.log("Removed local & global:", itemObj.uid);
    } else {
      wishlist.push(itemObj);
      if (idxGlobal < 0) globalList.push(itemObj);
      button.textContent = "♥";
      button.style.color = "red";
      countSpan.textContent = "1";
      console.log("Added local & global:", itemObj.uid);
    }

    save(wishlistKey, wishlist);
    save("wishlist", globalList);
  });
});



/* ligacao likes e wishlist */
function uidFor(collectionIdOrName, name, img) {
  return encodeURIComponent(`${collectionIdOrName}||${name}||${img}`);
}

const colParams = new URLSearchParams(window.location.search);
const COL_ID_RAW = colParams.get("id");
const COLLECTION_ID = COL_ID_RAW ? COL_ID_RAW.toString() : null;
const COLLECTION_NAME_FOR_KEY = document.querySelector(".collection-title")
  ? document.querySelector(".collection-title").textContent.trim()
  : "default";
const collectionKeySuffix = COLLECTION_ID ? `${COLLECTION_ID}` : COLLECTION_NAME_FOR_KEY.replace(/\s+/g, "_");
const COLLECTION_WISHLIST_KEY = `wishlist_col_${collectionKeySuffix}`;

function updateLikesFromStorage() {
  const localWishlist = JSON.parse(localStorage.getItem(COLLECTION_WISHLIST_KEY) || "[]");
  document.querySelectorAll(".item-card").forEach(card => {
    const name = card.querySelector("h3") ? card.querySelector("h3").textContent : "";
    const img = card.querySelector("img") ? card.querySelector("img").src : "";
    const btn = card.querySelector(".like-btn");
    const countSpan = card.querySelector(".like-count");

    const colIdent = COLLECTION_ID ? `id:${COLLECTION_ID}` : `name:${COLLECTION_NAME_FOR_KEY}`;
    const uid = uidFor(colIdent, name, img);

    const found = localWishlist.find(i => i.uid === uid);
    if (found) {
      if (btn) {
        btn.classList.add("liked");
        btn.textContent = "♥";
        btn.style.color = "red";
      }
      if (countSpan) countSpan.textContent = String(found.likes || 1);
    } else {
      if (btn) {
        btn.classList.remove("liked");
        btn.textContent = "♡";
        btn.style.color = "";
      }
      if (countSpan) countSpan.textContent = "0";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateLikesFromStorage();
});

window.addEventListener("storage", (e) => {
  if (!e.key) return;
  if (e.key === "wishlist" || e.key === "wishlist_update") {
    updateLikesFromStorage();
  }
});


function notifyWishlistChanged() {
  try {
    localStorage.setItem("wishlist_update", String(Date.now()));
  } catch (err) { /* ignore */ }
  updateLikesFromStorage();
}

// search bar

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("q");           
  const btnSearch   = document.getElementById("btn-search");  
  if (!searchInput || !btnSearch) return;

  const getItemCards = () =>
    document.querySelectorAll(".collection-items .item-card");

  const showAll = () => getItemCards().forEach(c => c.classList.remove("hidden"));

  const runFilter = () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) { showAll(); return; }

    let found = false;
    getItemCards().forEach(card => {
      const title = (card.querySelector("h3, .item-title")?.textContent || "")
        .trim().toLowerCase();
      const match = title.includes(q);
      card.classList.toggle("hidden", !match);
      if (match) found = true;
    });
    if (!found) alert("No items found in this collection 😔");
  };

  btnSearch.addEventListener("click", (e) => {
    e.preventDefault();
    runFilter();
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runFilter();
    }
  });

  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") showAll();
  });
});

// eventos em que a colecao aparece
window.addEventListener("load", () => {
  if (!window.events) {
    console.warn("Sem array global 'events'. Verifica se data.js está carregado.");
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const collectionId = Number(params.get("id"));
  if (!collectionId) {
    console.warn("Sem ?id= na URL da coleção.");
    return;
  }

  let currentCollectionName = "";
  if (window.collections) {
    const col = collections.find(c => c.id === collectionId);
    if (col) currentCollectionName = col.name;
  }
  if (!currentCollectionName) {
    // fallback: usa o título da página
    const titleEl = document.querySelector(".collection-title");
    currentCollectionName = titleEl ? titleEl.textContent.trim() : "";
  }

  console.log("Collection id/name:", collectionId, currentCollectionName);

  const upcomingContainer = document.getElementById("eventsUpcoming");
  const pastContainer     = document.getElementById("eventsPast");
  if (!upcomingContainer || !pastContainer) return;

  
  const related = events.filter(ev =>
    Array.isArray(ev.collections) &&
    ev.collections.some(c => c.name === currentCollectionName)
  );

  console.log("Eventos relacionados:", related);

  if (!related.length) {
    upcomingContainer.innerHTML = `<p class="events-empty">
      This collection is not linked to any event (yet).
    </p>`;
    pastContainer.innerHTML = "";
    return;
  }

  const today = new Date();
  const upcoming = [];
  const past = [];

  related.forEach(ev => {
    const d = ev.date ? new Date(ev.date) : null;
    if (d && d >= today) upcoming.push(ev);
    else past.push(ev);
  });

  const renderEventCard = (ev) => `
    <article class="event-card">
      <h4>${ev.name}</h4>
      <p class="event-meta">
        <span>📅 ${ev.date ? new Date(ev.date).toLocaleString() : "TBA"}</span>
        ${ev.location ? `<span>📍 ${ev.location}</span>` : ""}
      </p>
      ${ev.description ? `<p class="event-desc">${ev.description}</p>` : ""}
      <a href="events.html?id=${ev.id}" class="event-link">View event</a>
    </article>
  `;

  upcomingContainer.innerHTML =
    upcoming.length
      ? upcoming.map(renderEventCard).join("")
      : `<p class="events-empty">No upcoming events for this collection.</p>`;

  pastContainer.innerHTML =
    past.length
      ? past.map(renderEventCard).join("")
      : `<p class="events-empty">No past events for this collection.</p>`;
});

