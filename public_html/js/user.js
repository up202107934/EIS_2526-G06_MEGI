/* user.js */

/* =========================
   Constantes & Helpers
========================= */
const STORAGE_KEY = "collections";

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));


const safeJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const getCollections = () => safeJSON(STORAGE_KEY, []);
const saveCollections = (arr) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch (e) {
    console.warn("Failed to save collections:", e);
  }
};

const uid = () => (crypto?.randomUUID?.() || String(Date.now() + Math.random()));

/* =========================
   Perfil: form + foto
========================= */
const form        = document.getElementById('userForm');
const statusMsg   = document.getElementById('statusMsg');
const photoModal  = document.getElementById('photoModal');
const editPhotoBtn = document.getElementById('editPhotoBtn');
const closeModalX = document.getElementById('closeModal');
const photoInput  = document.getElementById('photoInput');
const profileImage = document.getElementById('profileImage');
const displayName = document.getElementById('displayName');
const displayEmail = document.getElementById('displayEmail');

form?.addEventListener('submit', e => {
  e.preventDefault();
  const first = document.getElementById('firstName').value.trim();
  const last  = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  if (!first || !last || !email) {
    alert("Please fill all required fields!");
    return;
  }
  displayName.textContent = `${first} ${last}`;
  displayEmail.textContent = email;
  statusMsg.style.display = "inline";
  setTimeout(() => statusMsg.style.display = "none", 2000);
});

editPhotoBtn?.addEventListener('click', () => { if (photoModal) photoModal.style.display = 'flex'; });
closeModalX?.addEventListener('click', () => { if (photoModal) photoModal.style.display = 'none'; });
window.addEventListener('click', e => { if (e.target === photoModal) photoModal.style.display = 'none'; });

photoInput?.addEventListener('change', e => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = ev => {
      profileImage.src = ev.target.result;
      localStorage.setItem('profileImage', ev.target.result);
    };
    reader.readAsDataURL(file);
    if (photoModal) photoModal.style.display = 'none';
  }
});

const savedPhoto = localStorage.getItem('profileImage');
if (savedPhoto) profileImage.src = savedPhoto;

/* =========================
   Mini-carousel duplicador
========================= */
function initMiniCarousels(root = document) {
  $$(".mini-track", root).forEach(track => {
    if (!track.dataset.cloned) {
      track.insertAdjacentHTML("beforeend", track.innerHTML);
      track.dataset.cloned = "1";
    }
  });
}

/* =========================
   Wishlist
========================= */
(function initWishlist() {
  const container = document.getElementById("wishlist-container");
  if (!container) return;

  function renderWishlist() {
    const wishlist = safeJSON("wishlist", []);
    container.innerHTML = "";

    if (!wishlist.length) {
      container.innerHTML = "<p>No items in your wishlist yet.</p>";
      return;
    }

    wishlist.forEach(item => {
      const card = document.createElement("div");
      card.classList.add("wishlist-item");
      card.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="wishlist-info">
          <h3>${item.name}</h3>
          <p>${item.desc || ""}</p>
          <span>⭐ ${item.rating ?? "-"} /10 | 💰 ${item.price ?? "-"}€ | ⚖️ ${item.weight ?? "-"}g</span>
          <button class="remove-btn">🗑</button>
        </div>
      `;

      card.querySelector(".remove-btn").addEventListener("click", () => {
        // Global wishlist
        let global = safeJSON("wishlist", []);
        if (item.uid) {
          global = global.filter(i => i.uid !== item.uid);
        } else {
          global = global.filter(i => !(i.name === item.name && i.collection === item.collection));
        }
        localStorage.setItem("wishlist", JSON.stringify(global));

        // Wishlist específica da coleção
        const key = `wishlist_${(item.collection || "default").replace(/\s+/g, "_")}`;
        let cList = safeJSON(key, []);
        if (item.uid) {
          cList = cList.filter(i => i.uid !== item.uid);
        } else {
          cList = cList.filter(i => !(i.name === item.name && i.collection === item.collection));
        }
        localStorage.setItem(key, JSON.stringify(cList));

        renderWishlist();
        try { localStorage.setItem("wishlist_update", String(Date.now())); } catch {}
      });

      container.appendChild(card);
    });
  }

  renderWishlist();
  window.addEventListener("storage", (e) => {
    if (!e.key) return;
    if (e.key === "wishlist" || e.key === "wishlist_update") renderWishlist();
  });
})();

/* =========================
   Dark Mode
========================= */
(function initDarkMode() {
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
})();

/* =========================
   Collections (User page)
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("userCollections") || document.querySelector(".collections-grid");

  /* ===== Modal Create (perfil) ===== */
  const createBtn  = document.getElementById("openModal");
  const modal      = document.getElementById("createCollectionModal");
  const cancelBtn  = document.getElementById("cancelCollection");
  const saveBtn    = document.getElementById("saveCollection");
  const dropZone   = document.getElementById("dropZoneCollection");
  const fileInput  = document.getElementById("collectionImage");
  const previewImg = document.getElementById("collectionPreview");
  const nameInput  = document.getElementById("collectionName");
  const descInput  = document.getElementById("collectionDescription");

  const openModal  = (e) => { e?.preventDefault?.(); modal?.classList.add("show"); };
  const closeModal = () => modal?.classList.remove("show");

  createBtn?.addEventListener("click", openModal);
  cancelBtn?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  // Dropzone
  dropZone?.addEventListener("click", () => fileInput?.click());
  dropZone?.addEventListener("dragover", (e) => { e.preventDefault(); dropZone.classList.add("dragover"); });
  dropZone?.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
  dropZone?.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    if (e.dataTransfer?.files?.length && fileInput) {
      fileInput.files = e.dataTransfer.files;
      fileInput.dispatchEvent(new Event("change"));
    }
  });

  // Preview
  fileInput?.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) {
      if (previewImg && dropZone) {
        previewImg.style.display = "none";
        dropZone.style.display = "flex";
      }
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (previewImg && dropZone) {
        previewImg.src = ev.target.result;
        previewImg.style.display = "block";
        dropZone.style.display = "none";
      }
    };
    reader.readAsDataURL(file);
  });

  /* ===== Funções de render ===== */
  function cardHTML(c) {
    const img = c.img || "img/collection-placeholder.jpg";
    const itemCount = Array.isArray(c.items) ? c.items.length : 0;
    return `
      <div class="collection-card" data-id="${c.id}">
        <img src="${img}" alt="${c.name}">
        <h2>${c.name}</h2>
        <p>${itemCount} items</p>

        <div class="mini-carousel">
          <div class="mini-track">
            ${
              itemCount
                ? c.items.map((it, i) => `
                    <div class="mini-item">
                      <img src="${it?.img || img}" alt="${it?.name || `Item ${i+1}`}">
                      <p>${it?.name || ""}</p>
                    </div>
                  `).join("")
                : `<div class="mini-item"><p>No items yet</p></div>`
            }
          </div>
        </div>

        <div style="display:flex; gap:8px; justify-content:center; margin-top:10px;">
          <a href="new_collection.html?id=${encodeURIComponent(c.id)}" class="btn-view">View Collection</a>
          <button class="btn-remove" data-remove="${c.id}">🗑</button>
        </div>
      </div>
    `;
  }

  function renderAll() {
    if (!grid) return;
    const data = getCollections();
    if (!data.length) {
      grid.innerHTML = `<p style="text-align:center; color:#777;">No collections yet.</p>`;
      return;
    }
    grid.innerHTML = data.map(cardHTML).join("");
    initMiniCarousels(grid);
  }

  /* ===== Guardar (no perfil) ===== */
  saveBtn?.addEventListener("click", () => {
    const name = nameInput?.value.trim();
    const desc = (descInput?.value || "").trim();
    if (!name) { alert("Please enter a collection name!"); nameInput?.focus(); return; }

    const imgSrc =
      (previewImg && previewImg.style.display !== "none" && previewImg.src)
        ? previewImg.src
        : "img/collection-placeholder.jpg";

    const all = getCollections();
    all.push({ id: uid(), name, desc, img: imgSrc, items: [] });
    saveCollections(all);

    // limpar & fechar
    if (nameInput) nameInput.value = "";
    if (descInput) descInput.value = "";
    if (fileInput) fileInput.value = "";
    if (previewImg) previewImg.style.display = "none";
    if (dropZone) dropZone.style.display = "flex";
    closeModal();

    renderAll();
  });

  /* ===== Importa cartões estáticos do HTML só 1x (primeira vez) ===== */
  (function maybeImportStatic() {
    if (!grid) return;
    const already = getCollections();
    if (already.length) return;

    const staticCards = $$(".collection-card", grid);
    if (!staticCards.length) return;

    const imported = staticCards.map(card => {
      const name = (card.querySelector("h2,h3")?.textContent || "Untitled").trim();
      const img  = card.querySelector("img")?.getAttribute("src") || "img/collection-placeholder.jpg";
      const itemsText = (card.querySelector("p")?.textContent || "").trim();
      const itemsNum = parseInt(itemsText, 10);
      return {
        id: uid(),
        name,
        desc: "",
        img,
        items: isNaN(itemsNum) ? [] : new Array(itemsNum).fill(null)
      };
    });

    if (imported.length) {
      saveCollections(imported);
    }
  })();

  /* ===== Render inicial & remoção ===== */
  renderAll();

  grid?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove]");
    if (!btn) return;
    const id = btn.getAttribute("data-remove");
    if (!id) return;
    if (!confirm("Remove this collection?")) return;

    const next = getCollections().filter(c => c.id !== id);
    saveCollections(next);
    renderAll();
  });
});


// === DROPDOWN DO PERFIL ===
document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.getElementById("profileBtn");
  const dropdown = document.getElementById("profileDropdown");

  if (!profileBtn || !dropdown) return;

  profileBtn.addEventListener("click", () => {
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

  // fecha ao clicar fora
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && !profileBtn.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
});
