// home.js (Limpo para funcionar com navbar.js)

const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ======================================================
// 1. CARREGAR CATEGORIAS DA BD
// ======================================================
async function loadCategories() {
  const select = document.getElementById("collectionCategory");
  
  if (!select) {
      console.log("Menu de categorias não encontrado. (Utilizador não logado?)");
      return; 
  }

  try {
    const res = await fetch("controllers/categories.php");
    if (!res.ok) throw new Error("Erro na resposta do servidor");

    const categories = await res.json();

    select.innerHTML = '<option value="">-- Select Category --</option>';

    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id_collection_category; 
      option.textContent = cat.name;              
      select.appendChild(option);
    });
    
    console.log("Categorias carregadas com sucesso!");

  } catch (err) {
    console.error("Erro ao carregar categorias:", err);
    if(select) select.innerHTML = '<option value="">Error loading categories</option>';
  }
}

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

  // === CHAMAR A FUNÇÃO PARA PREENCHER O SELECT ===
  loadCategories(); 

  // Top collections vars
  const topGrid       = document.getElementById("topCollectionsGrid");
  const topChips      = document.querySelectorAll(".chip-top");
  const topSubtitle   = document.getElementById("topSubtitle");

  // --- REMOVIDO: DARK MODE (Agora está no navbar.js) ---
  // --- REMOVIDO: PERFIL DROPDOWN (Agora está no navbar.js) ---

  // Scroll smooth
  const heroBtn = document.querySelector(".hero-btn");
  if (heroBtn) {
    heroBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector("#collections");
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Mini-carousels
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
    const url = mode === "recent"
        ? "controllers/collections.php?mine=1"
        : "controllers/collections.php";

    const res = await fetch(url);
    return await res.json();
  }

  function collectionCardHTML(c) {
    const img = c.cover_img ? c.cover_img : "img/collection-placeholder.jpg";
    const rate = c.rate !== null ? c.rate : 0; 

    return `
      <div class="collection-card">
        <div style="position:relative;">
            <img src="${img}" alt="${c.name}" style="object-fit: cover; height: 200px; width: 100%; border-radius: 15px 15px 0 0;">
            <span style="position:absolute; top:10px; right:10px; background:rgba(0,0,0,0.7); color:#ffd700; padding:4px 8px; border-radius:4px; font-weight:bold;">
              ⭐ ${rate}
            </span>
        </div>
        
        <h2>${c.name}</h2>
        <span class="category-badge" style="background:#eee; padding:2px 8px; border-radius:10px; font-size:12px;">
            ${c.category_name || "General"}
        </span>

        <p style="margin:5px 0;"><b>Owner:</b> ${c.owner_name || "Unknown"}</p>
        
        ${c.description ? `<p style="font-size:0.9em; color:#666;">${c.description.substring(0, 50)}...</p>` : ''}

        <div class="mini-carousel">
          <div class="mini-track">
            <div class="mini-item"><p style="font-size:10px;">Items loading...</p></div>
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
        topSubtitle.textContent = mode === "featured"
            ? "Global featured collections from the whole site."
            : "Your last 5 created collections.";
      }

      if (!cols || !cols.length) {
        topGrid.innerHTML = `<p style="text-align:center; color:#777; padding:20px;">No collections found.</p>`;
        return;
      }

      topGrid.innerHTML = cols.slice(0, 5).map(collectionCardHTML).join("");
      initMiniCarousels(topGrid);
      applyCategoryFilter();

    } catch (err) {
      console.error(err);
      topGrid.innerHTML = `<p style="text-align:center; color:#c00; padding:20px;">Error loading collections.</p>`;
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

  renderTopCollections("featured");

  const catFilter = document.getElementById("categoryFilter");
  catFilter?.addEventListener("change", applyCategoryFilter);

  // Search Bar
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.querySelector(".search-btn");

  if(searchBtn) {
      searchBtn.addEventListener("click", () => searchForm.dispatchEvent(new Event("submit")));
  }

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = searchInput.value.trim().toLowerCase();
      const cards = topGrid ? topGrid.querySelectorAll(".collection-card") : [];

      if (!cards.length) return;

      if (query === "") {
        cards.forEach((card) => (card.style.display = "flex"));
        return;
      }

      let found = false;
      cards.forEach((card) => {
        const title = (card.querySelector("h2")?.textContent || "").toLowerCase();
        const match = title.includes(query);
        card.style.display = match ? "flex" : "none";
        if (match) found = true;
      });

      if (!found) alert("No collections found with that name 😔");
    });

    searchInput.addEventListener("input", function () {
      if (this.value.trim() === "") {
        const cards = topGrid ? topGrid.querySelectorAll(".collection-card") : [];
        cards.forEach((card) => (card.style.display = "flex"));
      }
    });
  }

  // ==========================================================
  // MODAL CRIAR COLEÇÃO
  // ==========================================================
  const openBtn   = document.getElementById("openModal");
  const openBtn2  = document.getElementById("openModalHome");
  const modal     = document.getElementById("createCollectionModal");
  const cancelBtn = document.getElementById("cancelCollection");
  const saveBtn   = document.getElementById("saveCollection");
  
  // Elementos do Formulário
  const dropZone  = document.getElementById("dropZoneCollection");
  const fileInput = document.getElementById("collectionImage");
  const preview   = document.getElementById("collectionPreview");
  const nameInput = document.getElementById("collectionName");
  const descInput = document.getElementById("collectionDescription");

  const openModal = (e) => {
    e?.preventDefault?.();
    if(modal) modal.classList.add("show");
  };
  const closeModal = () => {
    if(modal) modal.classList.remove("show");
  };

  openBtn?.addEventListener("click", openModal);
  openBtn2?.addEventListener("click", openModal);
  
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

  // ===============================================
  // LÓGICA DE SALVAR
  // ===============================================
  saveBtn?.addEventListener("click", () => {
    const name = nameInput?.value.trim();
    const description = descInput?.value.trim() || "";
    
    // Obter Select
    const categorySelect = document.getElementById("collectionCategory");
    
    // Se não existir select (ex: user não logado a tentar hackear), sai
    if (!categorySelect) return;

    const categoryId = categorySelect.value;
    const file = fileInput?.files?.[0];

    // Validações
    if (!name) {
      alert("Please enter a collection name!");
      nameInput?.focus();
      return;
    }
    
    if (!categoryId) {
        alert("Please select a category!");
        categorySelect?.focus();
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("id_collection_category", categoryId); 
    formData.append("creation_date", new Date().toISOString().slice(0,10));
    
    if (file) {
      formData.append("cover_img", file);
    }

    fetch("controllers/collections.php", {
      method: "POST",
      body: formData 
    })
    .then(r => r.json())
    .then(resp => {
      if (!resp.ok) {
        alert("Error: " + (resp.error || "Failed to create collection"));
        return;
      }
      closeModal();
      
      // Reset form
      nameInput.value = "";
      descInput.value = "";
      fileInput.value = "";
      if (categorySelect) categorySelect.value = ""; 
      
      if(preview) preview.style.display = 'none';
      if(dropZone) dropZone.style.display = 'flex';
      
      renderTopCollections("recent"); 
      alert("Collection created successfully! 📸");
    })
    .catch(err => {
        console.error(err);
        alert("Server error.");
    });
  });

});