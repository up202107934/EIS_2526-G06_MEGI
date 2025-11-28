// home.js (Sprint 2 - com backend)

// Já não usamos localStorage para coleções globais.
// Vamos buscar ao backend.
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function applyCategoryFilter() {
  const selected = document.getElementById("categoryFilter")?.value || "all";
  const cards = document.querySelectorAll(".collection-card");

  cards.forEach(card => {
    const badge = card.querySelector(".category-badge");
    const cardCategory = badge ? badge.textContent.trim() : "";

    if (selected === "all" || cardCategory === selected) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {

  // Top collections
  const topGrid      = document.getElementById("topCollectionsGrid");
  const topChips     = document.querySelectorAll(".chip-top");
  const topSubtitle  = document.getElementById("topSubtitle");

  // Dark mode
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

  // perfil dropdown
  const avatarButton = document.getElementById("avatarButton");
  const profileDropdown = document.getElementById("profileDropdown");
  const navbarUser = document.querySelector(".navbar-user");

  if (avatarButton && profileDropdown) {
    avatarButton.addEventListener("click", (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle("show");
    });

    profileDropdown.addEventListener("click", (e) => e.stopPropagation());
    navbarUser?.addEventListener("click", (e) => e.stopPropagation());

    document.addEventListener("click", () => {
      profileDropdown.classList.remove("show");
    });
  }

  // scroll smooth para coleções
  const heroBtn = document.querySelector(".hero-btn");
  if (heroBtn) {
    heroBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector("#collections");
      if (!target) return;

      const startY = window.scrollY;
      const targetY = target.getBoundingClientRect().top + window.scrollY;
      const diff = targetY - startY;
      const duration = 1200;
      let start;

      function smoothScroll(ts) {
        if (!start) start = ts;
        const t = ts - start;
        const p = Math.min(t / duration, 1);
        window.scrollTo(0, startY + diff * p);
        if (t < duration) requestAnimationFrame(smoothScroll);
      }
      requestAnimationFrame(smoothScroll);
    });
  }

  // mini-carousels (por agora só clona os que existirem)
  function initMiniCarousels(root = document) {
    $$(".mini-track", root).forEach((track) => {
      if (!track.dataset.cloned) {
        track.insertAdjacentHTML("beforeend", track.innerHTML);
        track.dataset.cloned = "1";
      }
    });
  }

  // ==========================
  // BACKEND: carregar coleções
  // ==========================

  async function fetchCollections(mode = "featured") {
    const url =
      mode === "recent"
        ? "controllers/collections.php?mine=1"   // quando login estiver feito
        : "controllers/collections.php";        // global

    const res = await fetch(url);
    return await res.json();
  }

  function collectionCardHTML(c) {
    const img = "img/collection-placeholder.jpg"; // depois ligamos imagem real

    return `
      <div class="collection-card">
        <img src="${img}" alt="${c.name}">
        <h2>${c.name}</h2>
        <span class="category-badge">${c.category_name || "Uncategorized"}</span>

        <p><b>Owner:</b> ${c.owner_name || ""}</p>

        <div class="mini-carousel">
          <div class="mini-track">
            <div class="mini-item">
              <p>Items will load here soon…</p>
            </div>
          </div>
        </div>

        <a href="collection.php?id=${c.id_collection}" class="btn">View Collection</a>
      </div>
    `;
  }

  async function renderTopCollections(mode = "featured") {
    if (!topGrid) return;

    try {
      const cols = await fetchCollections(mode);

      if (topSubtitle) {
        topSubtitle.textContent =
          mode === "featured"
            ? "Global featured collections from the whole site."
            : "Your last 5 created collections (only from your account).";
      }

      if (!cols || !cols.length) {
        topGrid.innerHTML = `
          <p style="text-align:center; color:#777; padding:20px;">
            No collections found.
          </p>`;
        return;
      }

      topGrid.innerHTML = cols
        .slice(0, 5)
        .map(collectionCardHTML)
        .join("");

      initMiniCarousels(topGrid);
      applyCategoryFilter();

    } catch (err) {
      console.error(err);
      topGrid.innerHTML = `
        <p style="text-align:center; color:#c00; padding:20px;">
          Error loading collections from server.
        </p>`;
    }
  }

  topChips.forEach(chip => {
    chip.addEventListener("click", () => {
      topChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");

      const mode = chip.dataset.mode || "featured";
      renderTopCollections(mode);
    });
  });

  // primeira renderização
  renderTopCollections("featured");

  const catFilter = document.getElementById("categoryFilter");
  catFilter?.addEventListener("change", applyCategoryFilter);

  // search bar (funciona agora sobre cards reais)
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

  document.querySelector(".search-btn").addEventListener("click", () => {
    searchForm.dispatchEvent(new Event("submit"));
  });

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = searchInput.value.trim().toLowerCase();

      const cards = topGrid
        ? topGrid.querySelectorAll(".collection-card")
        : document.querySelectorAll(".collection-card");

      if (!cards.length) return;

      if (query === "") {
        cards.forEach((card) => (card.style.display = "flex"));
        return;
      }

      let found = false;
      cards.forEach((card) => {
        const title = (card.querySelector("h2")?.textContent || "")
          .trim()
          .toLowerCase();
        const match = title.includes(query);
        card.style.display = match ? "flex" : "none";
        if (match) found = true;
      });

      if (!found) alert("No collections found with that name 😔");
    });

    searchInput.addEventListener("input", function () {
      if (this.value.trim() === "") {
        const cards = topGrid
          ? topGrid.querySelectorAll(".collection-card")
          : document.querySelectorAll(".collection-card");
        cards.forEach((card) => (card.style.display = "flex"));
      }
    });
  }

  // Modal criar coleção (UI ainda local)
  const openBtn   = document.getElementById("openModal");
  const modal     = document.getElementById("createCollectionModal");
  const cancelBtn = document.getElementById("cancelCollection");
  const saveBtn   = document.getElementById("saveCollection");
  const dropZone  = document.getElementById("dropZoneCollection");
  const fileInput = document.getElementById("collectionImage");
  const preview   = document.getElementById("collectionPreview");
  const nameInput = document.getElementById("collectionName");
  const descInput = document.getElementById("collectionDescription");

  const openModal = (e) => {
    e?.preventDefault?.();
    modal?.classList.add("show");
  };
  const closeModal = () => {
    modal?.classList.remove("show");
  };

  openBtn?.addEventListener("click", openModal);
  cancelBtn?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  dropZone?.addEventListener("click", () => fileInput?.click());
  dropZone?.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });
  dropZone?.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
  });
  dropZone?.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    if (e.dataTransfer?.files?.length && fileInput) {
      fileInput.files = e.dataTransfer.files;
      fileInput.dispatchEvent(new Event("change"));
    }
  });

  fileInput?.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) {
      if (preview && dropZone) {
        preview.style.display = "none";
        dropZone.style.display = "flex";
      }
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (preview && dropZone) {
        preview.src = ev.target.result;
        preview.style.display = "block";
        dropZone.style.display = "none";
      }
    };
    reader.readAsDataURL(file);
  });

  saveBtn?.addEventListener("click", () => {
  const name = nameInput?.value.trim();
  const categorySelect = document.getElementById("collectionCategory");
  const categoryName = categorySelect ? categorySelect.value : "";

  if (!name) {
    alert("Please enter a collection name!");
    nameInput?.focus();
    return;
  }

  // Tens de mapear o nome da categoria da UI para o ID da BD.
  // Faz um map simples (ajusta aos teus nomes reais):
  const categoryMap = {
    "Miniatures": 1,
    "Card Games": 2,
    "Coins": 3,
    "Books": 4
  };

  const payload = {
    name: name,
    id_collection_category: categoryMap[categoryName] || 1,
    creation_date: new Date().toISOString().slice(0,10)
  };

  fetch("controllers/collections.php", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(payload)
  })
  .then(r => r.json())
  .then(resp => {
    if (!resp.ok) {
      alert("You must be logged in to create collections.");
      return;
    }
    closeModal();
    renderTopCollections("featured"); // recarrega a Home
  });
});
});
