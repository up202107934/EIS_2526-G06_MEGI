/* ============================================================
   SORTING (rating/price)
   ============================================================ */

const itemsContainer = document.querySelector(".collection-items");
const sortSelect = document.getElementById("sortSelect");

// só corre sorting se existir container
if (itemsContainer) {
  // guardar ordem original
  const originalOrder = [...itemsContainer.children].map((el, idx) => {
    el.dataset.__index = idx;
    return el;
  });

  // aplica ordenação guardada
  const savedSort = localStorage.getItem("collectionSort") || "default";
  if (sortSelect) sortSelect.value = savedSort;
  applySort(savedSort);

  if (sortSelect) {
    sortSelect.addEventListener("change", () => applySort(sortSelect.value));
  }

  function applySort(mode) {
    const cards = [...itemsContainer.querySelectorAll(".item-card")];
    let sorted = cards.slice();

    const byNum = (getter, dir = 1) => (a, b) => (getter(a) - getter(b)) * dir;

    switch (mode) {
      case "ratingDesc":
        sorted.sort(byNum(el => Number(el.dataset.rating) || 0, -1));
        break;
      case "priceAsc":
        sorted.sort(byNum(el => Number(el.dataset.price) || 0, 1));
        break;
      case "priceDesc":
        sorted.sort(byNum(el => Number(el.dataset.price) || 0, -1));
        break;
      case "ratingAsc":
        sorted.sort(byNum(el => Number(el.dataset.rating) || 0, 1));
        break;
      case "weightAsc":
        sorted.sort(byNum(el => Number(el.dataset.weight) || 0, 1));
        break;
      case "weightDesc":
        sorted.sort(byNum(el => Number(el.dataset.weight) || 0, -1));
        break;
      default:
        sorted.sort(byNum(el => Number(el.dataset.__index), 1));
        break;
    }

    const frag = document.createDocumentFragment();
    sorted.forEach(el => frag.appendChild(el));
    itemsContainer.appendChild(frag);

    localStorage.setItem("collectionSort", mode);
  }
}

/* ============================================================
   CATEGORY FILTER
   ============================================================ */

const categorySelect = document.getElementById("categoryFilter");

if (categorySelect) {
  categorySelect.addEventListener("change", () => {
    const selected = categorySelect.value;
    const cards = document.querySelectorAll(".item-card");

    cards.forEach(card => {
      const cat = card.dataset.category || "uncategorized";

      if (selected === "all" || cat === selected) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  });
}

/* ============================================================
   VIEW TOGGLE (Grid / List)
   ============================================================ */

const viewButtons = document.querySelectorAll(".btn-view");

if (itemsContainer) {
  const savedView = localStorage.getItem("collectionView") || "grid";
  applyView(savedView);

  viewButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      applyView(view);
      localStorage.setItem("collectionView", view);
    });
  });

  function applyView(view) {
    if (view === "list") {
      itemsContainer.classList.remove("grid-view");
      itemsContainer.classList.add("list-view");
    } else {
      itemsContainer.classList.remove("list-view");
      itemsContainer.classList.add("grid-view");
    }

    viewButtons.forEach(b => {
      b.setAttribute("aria-pressed", b.dataset.view === view);
    });
  }
}

/* ============================================================
   ADD ITEM MODAL + UPLOAD + CRIAÇÃO DE CARDS
   ============================================================ */

const addItemBtn = document.querySelector(".add-item-btn");
const modal = document.getElementById("addItemModal");

if (addItemBtn && modal) {
  const cancelBtn = document.getElementById("cancelItem");
  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("itemImage");
  let uploadedImageURL = "img/default.jpg";

  addItemBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  /* ==== Upload da imagem ==== */

  dropZone.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        uploadedImageURL = e.target.result;
        dropZone.innerHTML = `
          <img src="${uploadedImageURL}" alt="Preview" style="max-width:100%; border-radius:8px;">
        `;
      };
      reader.readAsDataURL(file);
    }
  });

  dropZone.addEventListener("dragover", e => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
  });

  dropZone.addEventListener("drop", e => {
    e.preventDefault();
    dropZone.classList.remove("dragover");

    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        uploadedImageURL = ev.target.result;
        dropZone.innerHTML = `
          <img src="${uploadedImageURL}" alt="Preview" style="max-width:100%; border-radius:8px;">
        `;
      };
      reader.readAsDataURL(file);
    }
  });

  /* ==== Guardar Item ==== */

  const form = document.getElementById("addItemForm");

  form.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("itemName").value.trim();
    const desc = document.getElementById("itemDesc").value.trim();
    const rating = document.getElementById("itemRating").value.trim();
    const price = document.getElementById("itemPrice").value.trim();
    const weight = document.getElementById("itemWeight").value.trim();
    const category = document.getElementById("itemCategory").value.trim();
    const date = document.getElementById("itemDate").value;

    if (!name || !desc || !rating || !price || !weight || !category || !date) {
  alert("Please fill in all fields.");
  return;
}

    const ratingNum = Number(rating);
    if (ratingNum < 1 || ratingNum > 10) {
      alert("Rating must be 1–10.");
      return;
    }

    const priceNum = Number(price);
    if (priceNum < 0) {
      alert("Price must be ≥ 0.");
      return;
    }

    const weightNum = Number(weight);
    if (weightNum <= 0) {
      alert("Weight must be > 0.");
      return;
    }

    if (!fileInput.files.length) {
      alert("Please upload an image.");
      return;
    }

    const newCard = document.createElement("div");
    newCard.classList.add("item-card");

    newCard.dataset.rating = ratingNum;
    newCard.dataset.price = priceNum;
    newCard.dataset.weight = weightNum;
    newCard.dataset.category = category;
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
          <span>🏷️ ${category}</span> 
          <span class="like-container">
            <button class="like-btn" type="button">♡</button>
            <span class="like-count">0</span>
          </span>
        </div>
      </div>
      <div class="item-actions">
        <button class="btn-details">View Details</button>
      </div>
    `;

    itemsContainer.appendChild(newCard);
    
    if (categorySelect) {
  const selected = categorySelect.value;
  if (selected !== "all" && category !== selected) {
    newCard.style.display = "none";
  }
}

    newCard.querySelector(".btn-details").addEventListener("click", () => {
      window.location.href = "item.html";
    });

    form.reset();
    dropZone.innerHTML = `<p>Drag & drop an image here, or click to select</p>`;
    uploadedImageURL = "img/default.jpg";
    modal.style.display = "none";
  });
}

/* ============================================================
   DARK MODE
   ============================================================ */

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

/* ============================================================
   AVATAR DROPDOWN
   ============================================================ */

const avatarButton = document.getElementById("avatarButton");
const profileDropdown = document.getElementById("profileDropdown");

if (avatarButton && profileDropdown) {
  avatarButton.addEventListener("click", e => {
    e.stopPropagation();
    profileDropdown.classList.toggle("show");
  });

  window.addEventListener("click", () => {
    profileDropdown.classList.remove("show");
  });
}

/* ============================================================
   MOSTRAR AUTOR DA COLEÇÃO (data.js)
   ============================================================ */

window.addEventListener("load", () => {
  const params = new URLSearchParams(window.location.search);
  const collectionId = parseInt(params.get("id"));

  if (!collectionId) return;
  if (typeof collections === "undefined" || typeof users === "undefined") return;

  const collection = collections.find(c => c.id === collectionId);
  if (!collection) return;

  const user = users.find(u => u.id === collection.userId);

  const infoContainer = document.createElement("div");
  infoContainer.classList.add("collection-info");
  infoContainer.innerHTML = `
    <h2>${collection.name}</h2>
    <p>Criada por: <a href="user_view.html?id=${user.id}">${user.name}</a></p>
  `;

  const header = document.querySelector(".collection-header");
  if (header) header.after(infoContainer);
});

/* ============================================================
   WISHLIST (LOCAL + GLOBAL)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const collectionIdRaw = params.get("id");
  const collectionId = collectionIdRaw ? collectionIdRaw.toString() : null;

  const collectionTitleEl = document.querySelector(".collection-title");
  const collectionName = collectionTitleEl
    ? collectionTitleEl.textContent.trim()
    : "default";

  const keySuffix = collectionId
    ? `${collectionId}`
    : collectionName.replace(/\s+/g, "_");

  const wishlistKey = `wishlist_col_${keySuffix}`;

  function uidFor(col, name, img) {
    return encodeURIComponent(`${col}||${name}||${img}`);
  }

  function load(k) {
    return JSON.parse(localStorage.getItem(k) || "[]");
  }
  function save(k, arr) {
    localStorage.setItem(k, JSON.stringify(arr));
  }

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
      countSpan.textContent = found.likes || 1;
    }
  });

  const container = document.querySelector(".collection-items");

  container.addEventListener("click", ev => {
    if (!ev.target.classList.contains("like-btn")) return;

    const button = ev.target;
    const card = button.closest(".item-card");
    const name = card.querySelector("h3").textContent;
    const img = card.querySelector("img").src;
    const desc = card.querySelector("p")?.textContent || "";
    const countSpan = card.querySelector(".like-count");

    const colIdent = collectionId ? `id:${collectionId}` : `name:${collectionName}`;
    const uid = uidFor(colIdent, name, img);

    const itemObj = {
      uid,
      name,
      desc,
      img,
      rating: card.dataset.rating,
      price: card.dataset.price,
      weight: card.dataset.weight,
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
    } else {
      wishlist.push(itemObj);
      if (idxGlobal < 0) globalList.push(itemObj);
      button.textContent = "♥";
      button.style.color = "red";
      countSpan.textContent = "1";
    }

    save(wishlistKey, wishlist);
    save("wishlist", globalList);
  });
});

/* ============================================================
   SYNC WISHLIST
   ============================================================ */

function uidFor(collectionIdOrName, name, img) {
  return encodeURIComponent(`${collectionIdOrName}||${name}||${img}`);
}

const colParams = new URLSearchParams(window.location.search);
const COL_ID_RAW = colParams.get("id");
const COLLECTION_ID = COL_ID_RAW ? COL_ID_RAW.toString() : null;

const COLLECTION_NAME_FOR_KEY = document.querySelector(".collection-title")
  ? document.querySelector(".collection-title").textContent.trim()
  : "default";

const collectionKeySuffix = COLLECTION_ID
  ? `${COLLECTION_ID}`
  : COLLECTION_NAME_FOR_KEY.replace(/\s+/g, "_");

const COLLECTION_WISHLIST_KEY = `wishlist_col_${collectionKeySuffix}`;

function updateLikesFromStorage() {
  const localWishlist = JSON.parse(
    localStorage.getItem(COLLECTION_WISHLIST_KEY) || "[]"
  );

  document.querySelectorAll(".item-card").forEach(card => {
    const name = card.querySelector("h3")?.textContent || "";
    const img = card.querySelector("img")?.src || "";
    const btn = card.querySelector(".like-btn");
    const countSpan = card.querySelector(".like-count");

    const colIdent = COLLECTION_ID
      ? `id:${COLLECTION_ID}`
      : `name:${COLLECTION_NAME_FOR_KEY}`;

    const uid = uidFor(colIdent, name, img);

    const found = localWishlist.find(i => i.uid === uid);

    if (found) {
      btn.classList.add("liked");
      btn.textContent = "♥";
      btn.style.color = "red";
      countSpan.textContent = found.likes || 1;
    } else {
      btn.classList.remove("liked");
      btn.textContent = "♡";
      btn.style.color = "";
      countSpan.textContent = "0";
    }
  });
}

document.addEventListener("DOMContentLoaded", updateLikesFromStorage);

window.addEventListener("storage", e => {
  if (e.key === "wishlist" || e.key === "wishlist_update") {
    updateLikesFromStorage();
  }
});

function notifyWishlistChanged() {
  try {
    localStorage.setItem("wishlist_update", String(Date.now()));
  } catch (err) {}
  updateLikesFromStorage();
}





// =========================
// PESQUISA LOCAL (Search bar)
// =========================

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("q");           // campo da navbar
  const btnSearch   = document.getElementById("btn-search");  // botão 🔎

  if (!searchInput || !btnSearch) return;

  // todos os cards de items
  const getItemCards = () =>
    document.querySelectorAll(".collection-items .item-card");

  // mostrar todos
  const showAll = () =>
    getItemCards().forEach(c => c.classList.remove("hidden"));

  // aplicar filtro
  const runFilter = () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) { showAll(); return; }

    let found = false;

    getItemCards().forEach(card => {
      const title =
        (card.querySelector("h3")?.textContent || "")
        .trim().toLowerCase();

      const match = title.includes(q);
      card.classList.toggle("hidden", !match);

      if (match) found = true;
    });

    if (!found) {
      alert("No items found in this collection 😔");
    }
  };

  // clique na lupa
  btnSearch.addEventListener("click", e => {
    e.preventDefault();
    runFilter();
  });

  // Enter dentro do input
  searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      runFilter();
    }
  });

  // limpar filtro ao apagar texto
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") showAll();
  });
});
