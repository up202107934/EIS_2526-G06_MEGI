// home.js

// === helpers de storage (home.js) ===
const STORAGE_KEY = "collections";
const getCollections = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
};
const saveCollections = (arr) => localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
const uid = () => (crypto?.randomUUID?.() || String(Date.now() + Math.random()));
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // 1) DARK MODE
  // =========================
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

  // =========================
  // 2) DROPDOWN DE PERFIL
  // =========================
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

  // =========================
  // 3) HERO - SCROLL SUAVE
  // =========================
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

  // =========================
  // 4) MINI-CAROUSEL (clona itens p/ loop)
  // =========================
  function initMiniCarousels(root = document) {
    $$(".mini-track", root).forEach((track) => {
      if (!track.dataset.cloned) {
        track.insertAdjacentHTML("beforeend", track.innerHTML);
        track.dataset.cloned = "1";
      }
    });
  }
  initMiniCarousels(document);

  // =========================
  // 5) PESQUISA LOCAL
  // =========================
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const collectionCards = document.querySelectorAll(".collection-card");

  if (searchForm && searchInput && collectionCards.length) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = searchInput.value.trim().toLowerCase();

      if (query === "") {
        collectionCards.forEach((card) => (card.style.display = "flex"));
        return;
      }

      let found = false;
      collectionCards.forEach((card) => {
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
        collectionCards.forEach((card) => (card.style.display = "flex"));
      }
    });
  }

  // =========================
  // 6) MODAL "CREATE COLLECTION" (igual ao user)
  // =========================
  const openBtn       = document.getElementById("openModal");
  const modal         = document.getElementById("createCollectionModal");
  const cancelBtn     = document.getElementById("cancelCollection");
  const saveBtn       = document.getElementById("saveCollection");
  const dropZone      = document.getElementById("dropZoneCollection");
  const fileInput     = document.getElementById("collectionImage");
  const preview       = document.getElementById("collectionPreview");
  const nameInput     = document.getElementById("collectionName");
  const descInput     = document.getElementById("collectionDescription");

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

  // Dropzone
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

  // ===== Guardar coleção (home: guarda e redireciona p/ user)
  saveBtn?.addEventListener("click", () => {
    if (!nameInput) return;

    const name = nameInput.value.trim();
    const desc = (descInput?.value || "").trim();

    if (!name) {
      alert("Please enter a collection name!");
      nameInput.focus();
      return;
    }

    const imgSrc =
      preview && preview.style.display !== "none" && preview.src
        ? preview.src
        : "img/collection-placeholder.jpg";

    const all = getCollections();
    all.push({ id: uid(), name, desc, img: imgSrc, items: [] });
    saveCollections(all);

    // limpar modal
    nameInput.value = "";
    if (descInput) descInput.value = "";
    if (fileInput) fileInput.value = "";
    if (preview) preview.style.display = "none";
    if (dropZone) dropZone.style.display = "flex";
    closeModal();

    // vai ver a coleção na página do utilizador
    window.location.href = "user.html#minhas-colecoes";
  });
});
