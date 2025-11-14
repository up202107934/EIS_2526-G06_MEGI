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


/* === CATEGORY FILTER === */
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
    const isScura = document.body.classList.contains("dark-mode");
    themeToggle.textContent = isScura ? "☀️" : "🌙";
    localStorage.setItem("theme", isScura ? "dark" : "light");
  });
});

const avatarButton = document.getElementById('avatarButton');
  const profileDropdown = document.getElementById('profileDropdown');

  if (avatarButton && profileDropdown) {
    // 1. Ao clicar no avatar, mostra/esconde o menu
    avatarButton.addEventListener('click', (e) => {
      // Impede que o clique "borbulhe" para a janela e feche o menu
      e.stopPropagation(); 
      profileDropdown.classList.toggle('show');
    });

    // 2. Ouve por cliques em qualquer lado na página
    window.addEventListener('click', (e) => {
      // Se o menu estiver aberto E o clique foi FORA do menu...
      if (profileDropdown.classList.contains('show')) {
        profileDropdown.classList.remove('show');
      }
    });
  }

// --- Mostrar autor da coleção (versão sem login) ---
window.addEventListener("load", () => {
  // espera até TUDO (incluindo data.js) estar carregado
  const params = new URLSearchParams(window.location.search);
  const collectionId = Number(params.get("id"));

  if (!collectionId) {
    console.warn("Nenhum ID recebido no URL.");
    return;
  }

  // confirma se as variáveis globais existem
  if (typeof collections === "undefined" || typeof users === "undefined") {
    console.error("data.js ainda não carregado ou com erro.");
    return;
  }

  const collection = collections.find((c) => c.id === collectionId);
  if (!collection) {
    console.error("Coleção não encontrada para ID:", collectionId);
    return;
  }

  const user = users.find((u) => u.id === collection.userId);

  // cria o card com as MESMAS classes de CSS da versão com login
  const infoContainer = document.createElement("div");
  infoContainer.className = "collection-info";
  infoContainer.innerHTML = `
    <div class="collection-author-box">
      <div class="collection-author-avatar">
        <img src="${user?.avatar || "img/user.jpg"}" alt="${
    user ? user.name : "User"
  }">
      </div>
      <div class="collection-author-text">
        <span class="collection-author-label">Created by</span>
        ${
          user
            ? `<a href="user_withoutlogin.html?id=${user.id}&public=1" class="collection-author-name">${user.name}</a>`
            : `<span class="collection-author-name">Unknown</span>`
        }
      </div>
    </div>
  `;

  // tenta inserir o card mesmo antes do título da coleção
  const title = document.querySelector(".collection-title");
  if (title && title.parentElement) {
    title.parentElement.insertBefore(infoContainer, title);
  } else {
    const header = document.querySelector(".collection-header");
    if (header) header.after(infoContainer);
    else document.body.prepend(infoContainer);
  }
});






/* ===== ADD TO WISHLIST (USANDO collectionId PARA UID) ===== */
document.addEventListener("DOMContentLoaded", () => {
  // tenta obter collectionId do URL (ex: collection.html?id=5)
  const params = new URLSearchParams(window.location.search);
  const collectionIdRaw = params.get("id"); // pode ser null
  const collectionId = collectionIdRaw ? collectionIdRaw.toString() : null;

  const collectionTitleEl = document.querySelector(".collection-title");
  const collectionName = collectionTitleEl ? collectionTitleEl.textContent.trim() : "default";

  // key local por coleção (usa id se existir)
  const keySuffix = collectionId ? `${collectionId}` : collectionName.replace(/\s+/g, "_");
  const wishlistKey = `wishlist_col_${keySuffix}`;

  // helpers
  function uidFor(collectionIdOrName, name, img) {
    // usa collectionId quando disponível para garantir unicidade
    return encodeURIComponent(`${collectionIdOrName}||${name}||${img}`);
  }
  function load(key){ return JSON.parse(localStorage.getItem(key) || "[]"); }
  function save(key, arr){ localStorage.setItem(key, JSON.stringify(arr)); }

  let wishlist = load(wishlistKey);
  let globalList = load("wishlist");

  // Remove event handlers duplicates: ensure no other 'like-btn' listeners
  // (não pode remover listeners que não foram guardados, mas evitamos dupes usando só UM listener abaixo)
  // Pinta corações/contadores conforme wishlist local (usa UID com collectionId)
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

  // único listener delegador (um só, evita 'pisões')
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
      // remover
      wishlist.splice(idxLocal, 1);
      if (idxGlobal >= 0) globalList.splice(idxGlobal, 1);
      button.textContent = "♡";
      button.style.color = "";
      countSpan.textContent = "0";
      console.log("Removed local & global:", itemObj.uid);
    } else {
      // adicionar
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



/* ======= Collection — sync likes / wishlist ======= */
// helper UID (mesma versão que vamos usar no user.js)
function uidFor(collectionIdOrName, name, img) {
  return encodeURIComponent(`${collectionIdOrName}||${name}||${img}`);
}

// tenta obter collectionId do URL
const colParams = new URLSearchParams(window.location.search);
const COL_ID_RAW = colParams.get("id");
const COLLECTION_ID = COL_ID_RAW ? COL_ID_RAW.toString() : null;
const COLLECTION_NAME_FOR_KEY = document.querySelector(".collection-title")
  ? document.querySelector(".collection-title").textContent.trim()
  : "default";
const collectionKeySuffix = COLLECTION_ID ? `${COLLECTION_ID}` : COLLECTION_NAME_FOR_KEY.replace(/\s+/g, "_");
const COLLECTION_WISHLIST_KEY = `wishlist_col_${collectionKeySuffix}`;

// função que actualiza botões & contadores na página de coleção com base no localStorage
function updateLikesFromStorage() {
  const localWishlist = JSON.parse(localStorage.getItem(COLLECTION_WISHLIST_KEY) || "[]");
  // itera todos os cards na página
  document.querySelectorAll(".item-card").forEach(card => {
    const name = card.querySelector("h3") ? card.querySelector("h3").textContent : "";
    const img = card.querySelector("img") ? card.querySelector("img").src : "";
    const btn = card.querySelector(".like-btn");
    const countSpan = card.querySelector(".like-count");

    const colIdent = COLLECTION_ID ? `id:${COLLECTION_ID}` : `name:${COLLECTION_NAME_FOR_KEY}`;
    const uid = uidFor(colIdent, name, img);

    const found = localWishlist.find(i => i.uid === uid);
    if (found) {
      // marcado
      if (btn) {
        btn.classList.add("liked");
        btn.textContent = "♥";
        btn.style.color = "red";
      }
      if (countSpan) countSpan.textContent = String(found.likes || 1);
    } else {
      // desmarcado
      if (btn) {
        btn.classList.remove("liked");
        btn.textContent = "♡";
        btn.style.color = "";
      }
      if (countSpan) countSpan.textContent = "0";
    }
  });
}

// chama ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  updateLikesFromStorage();
});

// ouve mudanças no localStorage (outras tabs) e actualiza
window.addEventListener("storage", (e) => {
  if (!e.key) return;
  if (e.key === "wishlist" || e.key === "wishlist_update") {
    updateLikesFromStorage();
  }
});


// também pode ser útil quando outra parte do código grava e não dispara storage (mesma tab) -> fornece função para chamar
function notifyWishlistChanged() {
  // grava timestamp apenas para disparar storage em outras tabs e também actualiza aqui
  try {
    localStorage.setItem("wishlist_update", String(Date.now()));
  } catch (err) { /* ignore */ }
  updateLikesFromStorage();
}

// ====== Events where this collection appears ======
(function () {
  if (typeof events === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const collectionId = Number(params.get("id"));
  if (!collectionId) return;

  const related = events.filter(ev =>
    Array.isArray(ev.collectionIds) &&
    ev.collectionIds.includes(collectionId)
  );

  const upcomingContainer = document.getElementById("eventsUpcoming");
  const pastContainer     = document.getElementById("eventsPast");
  if (!upcomingContainer || !pastContainer) return;

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
        <span>📅 ${ev.date || "TBA"}</span>
        <span>📍 ${ev.location || "Location TBA"}</span>
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
})();



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
