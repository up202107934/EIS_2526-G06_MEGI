document.addEventListener("DOMContentLoaded", () => {
  const eventsContainer = document.getElementById("events");
// PARTICIPATE / JOIN modal — ajustar para os ids que existem no HTML
const joinBtn        = document.getElementById("d-join");        // botão Interested
const participateBtn = document.getElementById("d-participate"); // botão Participate

const participateModal = document.getElementById("participateModal");
const pCollections     = document.getElementById("p-collections");
const pItems           = document.getElementById("p-items");
const pCancel          = document.getElementById("p-cancel");
const pConfirm         = document.getElementById("p-confirm");

console.log("pConfirm =", pConfirm);

   
  const btnGrid = document.getElementById("btn-grid");
  const btnList = document.getElementById("btn-list");
  const btnNew = document.getElementById("btn-new");
  const eventForm = document.getElementById("eventForm");
console.log("btnNew:", btnNew);
console.log("eventForm:", eventForm);
  const sortSelect = document.getElementById("sort");
  const statusSelect = document.getElementById("status");
  //const searchInput = document.getElementById("q");
  //const searchBtn = document.getElementById("btn-search");
  // Support both dedicated page search bar (id="q") and navbar search (id="searchInput")
  const searchInput = document.getElementById("q") || document.getElementById("searchInput");
  const searchBtn = document.getElementById("btn-search") || document.querySelector(".navbar-search .search-btn");
  const searchForm = document.getElementById("searchForm");

  // modal detail
  const detailModal = document.getElementById("eventDetail");
  const evCloseBtn = document.getElementById("ev-close");
  const evName = document.getElementById("ev-name");
  const evDate = document.getElementById("ev-date");
  const evDesc = document.getElementById("ev-desc");
  const evColList = document.getElementById("ev-col-list");
  const evColCount = document.getElementById("ev-col-count");

  let allEvents = [];
  let currentView = "grid"; // "grid" ou "list"

  // -----------------------
  // GRID / LIST TOGGLE (usa list-view no container)
  // -----------------------
  function setView(view) {
    currentView = view;
    eventsContainer.classList.toggle("list-view", view === "list");
    btnGrid?.setAttribute("aria-pressed", view === "grid");
    btnList?.setAttribute("aria-pressed", view === "list");
  }

  btnGrid?.addEventListener("click", () => {
    setView("grid");
    renderEvents();
  });

  btnList?.addEventListener("click", () => {
    setView("list");
    renderEvents();
  });

  setView("grid"); // default

  // -----------------------
  // 1) Carregar eventos da BD
  // -----------------------
 // --- FETCH com debug e fallback ---
fetch("controllers/events.php")
  .then(async r => {
    if (!r.ok) {
      console.error("FETCH ERROR events.php:", r.status, r.statusText);
      const txt = await r.text().catch(()=>"[no body]");
      console.error("Resposta (raw):", txt);
      throw new Error("Erro ao pedir events.php");
    }
    // tentar parse seguro
    const text = await r.text();
    try {
      const data = JSON.parse(text);
      console.log("EVENTS LOADED:", data);
      allEvents = Array.isArray(data) ? data : [];
      renderEvents();
    } catch (e) {
      console.error("JSON PARSE ERROR from controllers/events.php:", e, "RAW:", text);
      allEvents = [];
      renderEvents();
    }
  })
  .catch(err => {
    console.error("Erro no fetch events:", err);
    eventsContainer.innerHTML = "<p>Erro a carregar eventos.</p>";
  });

/* DEBOUNCE helper */
function debounce(fn, wait = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

/* highlight helper (opcional) */
function highlight(text = "", q = "") {
  if (!q) return text;
  const safeQ = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${safeQ})`, "ig"), "<mark>$1</mark>");
}

/* RENDER melhorado e robusto */
function renderEvents() {
  let events = Array.isArray(allEvents) ? [...allEvents] : [];

  const now = new Date();
  const status = statusSelect?.value || "";

  if (status === "upcoming") {
    events = events.filter(e => {
      const d = new Date(e.event_date || e.date || e.datetime || "");
      return !isNaN(d) && d >= now;
    });
  } else if (status === "past") {
    events = events.filter(e => {
      const d = new Date(e.event_date || e.date || e.datetime || "");
      return !isNaN(d) && d < now;
    });
  }

  const qRaw = (searchInput?.value || "").trim();
  const q = qRaw.toLowerCase();

  if (q) {
    events = events.filter(e => {
      const name = (e.name ?? e.event_name ?? e.title ?? "").toString().toLowerCase();
      const desc = (e.description ?? e.desc ?? "").toString().toLowerCase();
      const loc  = (e.location ?? e.city ?? "").toString().toLowerCase();
      return name.includes(q) || desc.includes(q) || loc.includes(q);
    });
  }

  const sort = sortSelect?.value || "date_asc";
  events.sort((a, b) => {
    const da = new Date(a.event_date ?? a.date ?? "");
    const db = new Date(b.event_date ?? b.date ?? "");
    const an = (a.name ?? a.event_name ?? a.title ?? "").toString();
    const bn = (b.name ?? b.event_name ?? b.title ?? "").toString();
    if (sort === "date_asc") return (isNaN(da) ? 0 : da) - (isNaN(db) ? 0 : db);
    if (sort === "date_desc") return (isNaN(db) ? 0 : db) - (isNaN(da) ? 0 : da);
    if (sort === "name_asc") return an.localeCompare(bn);
    if (sort === "name_desc") return bn.localeCompare(an);
    return 0;
  });

  eventsContainer.innerHTML = "";
  if (!events.length) {
    eventsContainer.innerHTML = "<p>Sem eventos para mostrar.</p>";
    return;
  }

  events.forEach(e => {
    const titleRaw = e.name ?? e.event_name ?? e.title ?? "Sem nome";
    const titleHtml = q ? highlight(titleRaw, qRaw) : titleRaw;
    const d = new Date(e.event_date ?? e.date ?? "");
    const isUpcoming = !isNaN(d) ? d >= new Date() : true;

    const imgMain = "img/event-placeholder.jpg";
    const thumb1 = "img/event-thumb1.jpg";
    const thumb2 = "img/event-thumb2.jpg";
    const thumb3 = "img/event-thumb3.jpg";

    // usa id_event ou id
    const idEv = e.id_event ?? e.id ?? e.eventId ?? "";

    eventsContainer.innerHTML += `
      <article class="collection-card event-card ${isUpcoming ? "upcoming" : "past"}"
               data-id="${idEv}">
        <div class="ev-gallery">
          <img class="ev-main" src="${imgMain}" alt="${titleRaw}">
          <div class="ev-strip">
            <img class="ev-thumb" src="${thumb1}" alt="">
            <img class="ev-thumb" src="${thumb2}" alt="">
            <img class="ev-thumb" src="${thumb3}" alt="">
          </div>
        </div>
        <div class="ev-meta">
          <h2 class="ev-title">${titleHtml}</h2>
          <p class="ev-date">📅 ${e.event_date ?? e.date ?? ""}</p>
          <p class="muted">📍 ${e.location ?? ""}</p>
        </div>
        <div class="ev-actions">
          <a href="#" class="btn outline details-btn">Details</a>
        </div>
      </article>
    `;
  });

  // ligar clique para abrir detalhe - usa event delegation para evitar problemas
  eventsContainer.querySelectorAll(".event-card").forEach(card => {
    card.addEventListener("click", (ev) => {
      // se clicou na action button (Details) queremos também abrir detalhe,
      // mas prevenimos propagation se for outro elemento
      openDetail(card.dataset.id);
    });
  });
}

/* listeners de pesquisa  */
const debouncedRender = debounce(renderEvents, 160);

// Form submit (e.g., navbar enter key) should filter without reload
searchForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  renderEvents();
});


// botão de pesquisa: prevenir submit e chamar render
searchBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  renderEvents();
});

// pesquisa em tempo real: usa input (mais fiável que keyup) com debounce
searchInput?.addEventListener("input", () => {
  debouncedRender();
});

// teclas específicas: Enter confirma, Escape limpa
searchInput?.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    renderEvents();
  } else if (e.key === "Escape") {
    searchInput.value = "";
    renderEvents();
  }
});


  // HTML do card compatível com o TEU CSS (grid e list)
  function eventCardHTML(e) {
    const d = new Date(e.event_date);
    const isUpcoming = d >= new Date();

    const imgMain = "img/event-placeholder.jpg"; // podes trocar depois
    const thumb1 = "img/event-thumb1.jpg";
    const thumb2 = "img/event-thumb2.jpg";
    const thumb3 = "img/event-thumb3.jpg";

    return `
      <article class="collection-card event-card ${isUpcoming ? "upcoming" : "past"}"
               data-id="${e.id_event}">

        <div class="ev-gallery">
          <img class="ev-main" src="${imgMain}" alt="${e.name}">
          <div class="ev-strip">
            <img class="ev-thumb" src="${thumb1}" alt="">
            <img class="ev-thumb" src="${thumb2}" alt="">
            <img class="ev-thumb" src="${thumb3}" alt="">
          </div>
        </div>

        <div class="ev-meta">
          <h2 class="ev-title">${e.name}</h2>
          <p class="ev-date">📅 ${e.event_date}</p>
          <p class="muted">📍 ${e.location ?? ""}</p>
        </div>

        <div class="ev-actions">
          <a href="#" class="btn outline">Details</a>
        </div>

      </article>
    `;
  }

  // -----------------------
  // 3) Abrir detalhe do evento
  // -----------------------
  // -----------------------
// 3) Abrir detalhe do evento
// -----------------------
function openDetail(idEvent) {
    const ev = allEvents.find(x => String(x.id_event) === String(idEvent));
    if (!ev) return;

    evName.textContent = ev.name;
    evDate.textContent = ev.event_date;
    evDesc.textContent = ev.description ?? "";

    // guardar IDs
    if (joinBtn) joinBtn.dataset.id = idEvent;
    if (participateBtn) participateBtn.dataset.id = idEvent;

    // evento passou?
    const isPast = new Date(ev.event_date) < new Date();

    // bloqueios
    participateBtn.disabled = isPast;

    if (isPast) {
        joinBtn.disabled = true;
        joinBtn.textContent = "Event ended";
    } else {
        joinBtn.disabled = false;
        joinBtn.textContent = "Interested";
    }

    // verificar interesse
    fetch(`controllers/check_interest.php?event=${idEvent}`)
        .then(r => r.json())
        .then(res => {
            if (res.interested) {
                joinBtn.classList.add("active");
                joinBtn.textContent = "Interested ✓";
            } else {
                joinBtn.classList.remove("active");
                joinBtn.textContent = "Interested";
            }
        });

    // coleções
    fetch(`controllers/event_collections.php?event=${idEvent}`)
        .then(r => r.json())
        .then(cols => {
            evColList.innerHTML = "";
            evColCount.textContent = cols.length;

            if (!cols.length) {
                evColList.innerHTML = "<p>Sem coleções neste evento.</p>";
                return;
            }

            cols.forEach(c => {
                evColList.innerHTML += `
                    <div class="ev-col-item">
                        <span class="ev-col-name">${c.name}</span>
                        <a href="collection.php?id=${c.id_collection}" class="btn outline">View</a>
                    </div>
                `;
            });
        })
        .catch(() => {
            evColList.innerHTML = "<p>Erro ao carregar coleções do evento.</p>";
        });

    detailModal.classList.add("show");
    detailModal.setAttribute("aria-hidden", "false");
}


// Fechar modal
function closeDetail() {
    detailModal.classList.remove("show");
    detailModal.setAttribute("aria-hidden", "true");
}

evCloseBtn?.addEventListener("click", closeDetail);
detailModal?.addEventListener("click", (e) => {
    if (e.target === detailModal) closeDetail();
});

// -------------------------
// PARTICIPATE – abrir modal
// -------------------------
participateBtn?.addEventListener("click", () => {
    participateModal.classList.add("show");
    participateModal.setAttribute("aria-hidden", "false");

    // limpar anteriores
    pCollections.innerHTML = "<p class='muted'>Loading...</p>";
    pItems.innerHTML = "";

    // carregar coleções do user
    loadUserCollectionsForParticipate();
});
// fechar modal
pCancel?.addEventListener("click", () => {
    participateModal.classList.remove("show");
    participateModal.setAttribute("aria-hidden", "true");
});

participateModal?.addEventListener("click", (e) => {
    if (e.target === participateModal) {
        participateModal.classList.remove("show");
        participateModal.setAttribute("aria-hidden", "true");
    }
});

pConfirm?.addEventListener("click", async () => {
  console.log("CLICK NO CONFIRM!");

  const idEvent = participateBtn?.dataset.id; // foi guardado em openDetail()

  if (!idEvent) {
    alert("Erro: nenhum evento selecionado.");
    return;
  }

  // coleção escolhida
  const selectedRadio = pCollections.querySelector(
    '.pick-card input[type="radio"]:checked'
  );
  if (!selectedRadio) {
    alert("Escolhe uma coleção primeiro.");
    return;
  }
  const idCollection = selectedRadio.closest(".pick-card").dataset.col;

  // itens escolhidos
  const items = Array.from(
    pItems.querySelectorAll('input[type="checkbox"]:checked')
  ).map(cb => cb.value);

  const payload = {
    id_event: idEvent,
    id_collection: idCollection,
    items: items
  };

  try {
    const r = await fetch("controllers/event_participate.php", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload)
    });

    const text = await r.text();
    console.log("RAW PARTICIPATE RESPONSE:", text);

    let resp;
    try {
      resp = JSON.parse(text);
    } catch (e) {
      console.error("JSON PARSE ERROR (participate):", e);
      alert("Erro ao processar resposta do servidor.");
      return;
    }

    if (resp.ok) {
      alert("Participação guardada com sucesso!");
      participateModal.classList.remove("show");
      participateModal.setAttribute("aria-hidden", "true");
    } else {
      alert("Erro ao guardar participação: " + (resp.err || "desconhecido"));
    }
  } catch (err) {
    console.error(err);
    alert("Erro de rede ao guardar participação.");
  }
});






// Interessado (toggle)
joinBtn?.addEventListener("click", async () => {
    const idEvent = joinBtn.dataset.id;

        const r = await fetch("controllers/event_Interested.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_event: idEvent })
    });

    const resp = await r.json();

    if (resp.success) {
        if (resp.interested) {
            joinBtn.classList.add("active");
            joinBtn.textContent = "Interested ✓";
        } else {
            joinBtn.classList.remove("active");
            joinBtn.textContent = "Interested";
        }
    }
});


  // -----------------------
  // 4) listeners filtros
  // -----------------------
  sortSelect?.addEventListener("change", renderEvents);
  statusSelect?.addEventListener("change", renderEvents);

  // botão de pesquisa: prevenir submit e chamar render
searchBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  renderEvents();
});

// pesquisa em tempo real com debounce; Enter confirma, Esc limpa
searchInput?.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    renderEvents();
  } else if (e.key === "Escape") {
    searchInput.value = "";
    renderEvents();
  } else {
    // usa o debounce já definido: debouncedRender
    debouncedRender();
  }
});
    
  
// -----------------------
// 5) NEW EVENT - abrir/fechar modal
// -----------------------
const fClose  = document.getElementById("form-close");
const fCancel = document.getElementById("f-cancel");

btnNew?.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Abrir modal New Event");
  eventForm.classList.add("show");
  eventForm.setAttribute("aria-hidden", "false");
  
  // reset + load
  fItemsWrap.innerHTML = "";
  selectedCollections.clear();
  selectedItems.clear();
  loadCollectionsForForm();
});

// fechar no X
fClose?.addEventListener("click", () => {
  eventForm.classList.remove("show");
  eventForm.setAttribute("aria-hidden", "true");
});

// fechar no Cancel
fCancel?.addEventListener("click", () => {
  eventForm.classList.remove("show");
  eventForm.setAttribute("aria-hidden", "true");
});

// fechar ao clicar fora da caixa
eventForm?.addEventListener("click", (ev) => {
  if (ev.target === eventForm) {
    eventForm.classList.remove("show");
    eventForm.setAttribute("aria-hidden", "true");
  }
});


// -----------------------
// 5.1) NEW EVENT - carregar coleções + selecionar itens
// -----------------------
async function loadUserCollectionsForEventForm() {
  const list = document.getElementById("f-col-list");
  if (!list) return;

  list.innerHTML = "<p class='muted'>A carregar coleções...</p>";

  const res = await fetch("controllers/collections.php?mine=1");
  if (res.status === 401) {
    list.innerHTML = "<p class='muted'>Precisas de login para escolher coleções.</p>";
    return;
  }

  const cols = await res.json();

  if (!cols.length) {
    list.innerHTML = "<p class='muted'>Não tens coleções.</p>";
    return;
  }

  list.innerHTML = cols.map(c => `
    <label class="pick-card">
      <input type="checkbox" value="${c.id_collection}">
      <span>${c.name}</span>
      <small class="muted">${c.category_name}</small>
    </label>
  `).join("");
}

// Sets globais (usados no SAVE)
const selectedCollections = new Set();
const selectedItems = new Set();

const fColList   = document.getElementById("f-col-list");
const fItemsWrap = document.getElementById("f-items-wrap");

// ----------------------------------------
// Carregar coleções do user no modal Participate
// ----------------------------------------
async function loadUserCollectionsForParticipate() {

    const res = await fetch("controllers/collections.php?mine=1");
    const cols = await res.json();

    if (!cols.length) {
        pCollections.innerHTML = "<p class='muted'>Não tens coleções.</p>";
        return;
    }

    pCollections.innerHTML = cols.map(c => `
        <label class="pick-card" data-col="${c.id_collection}">
            <input type="radio" name="pickCollection">
            <span>${c.name}</span>
        </label>
    `).join("");

    // listener para carregar itens quando escolhe coleção
    pCollections.querySelectorAll(".pick-card").forEach(card => {
        card.addEventListener("click", () => {
            const idCol = card.dataset.col;
            loadItemsForParticipate(idCol);
        });
    });
}
// ----------------------------------------
// Carregar itens pertencentes à coleção escolhida
// ----------------------------------------
async function loadItemsForParticipate(idCol) {
    pItems.innerHTML = "<p class='muted'>Loading...</p>";

    const res = await fetch(`controllers/items.php?collection=${idCol}`);
    const items = await res.json();

    if (!items.length) {
        pItems.innerHTML = "<p class='muted'>Esta coleção não tem itens.</p>";
        return;
    }

    pItems.innerHTML = items.map(i => `
        <label class="mini-card">
            <input type="checkbox" value="${i.id_item}">
            <span>${i.name}</span>
        </label>
    `).join("");
}






// carregar coleções do utilizador (ou todas, dependendo do teu endpoint)
async function loadCollectionsForForm() {
  if (!fColList) return;

  fColList.innerHTML = "<p class='muted'>A carregar coleções…</p>";

  try {
    const cols = await fetch("controllers/collections.php?mine=1")
      .then(r => r.json());

    if (!cols.length) {
      fColList.innerHTML = "<p class='muted'>Não tens coleções.</p>";
      return;
    }

    fColList.innerHTML = cols.map(c => `
      <label class="pick-card" data-id="${c.id_collection}">
        <input type="checkbox" />
        <img src="img/collection-placeholder.jpg" alt="">
        <span>${c.name}</span>
      </label>
    `).join("");

    // listeners de seleção
    fColList.querySelectorAll(".pick-card").forEach(card => {
      card.addEventListener("click", async (e) => {
        // se o clique foi diretamente no input, não faz nada aqui
        if (e.target.tagName === "INPUT") return;

        e.preventDefault();

        const idCol = card.dataset.id;
        const checkbox = card.querySelector("input");

        checkbox.checked = !checkbox.checked;

        if (checkbox.checked) {
          selectedCollections.add(idCol);
          await loadItemsForCollection(idCol);
        } else {
          selectedCollections.delete(idCol);
          removeItemsBlock(idCol);
          // remove itens dessa coleção do set global
          selectedItems.forEach(it => {
            if (String(it).startsWith(idCol + ":")) selectedItems.delete(it);
          });
        }
      });
    });

  } catch (err) {
    console.error(err);
    fColList.innerHTML = "<p class='muted'>Erro a carregar coleções.</p>";
  }
}

// carregar itens de 1 coleção e criar bloco
async function loadItemsForCollection(idCol) {
  if (!fItemsWrap) return;

  try {
    const items = await fetch(`controllers/items.php?collection=${idCol}`)
      .then(r => r.json());

    // se já existir bloco desta coleção, remove para recriar
    const existing = fItemsWrap.querySelector(`.items-block[data-col="${idCol}"]`);
    if (existing) existing.remove();

    const block = document.createElement("div");
    block.className = "items-block";
    block.dataset.col = idCol;

    if (!items.length) {
      block.innerHTML = `
        <div class="items-head">
          <strong>Coleção ${idCol}</strong>
          <button class="remove-col" data-col="${idCol}"
                  style="float:right; background:none; border:none; font-size:18px; cursor:pointer;">
            ❌
          </button>
        </div>
        <p class="muted">Esta coleção não tem itens.</p>
      `;
      fItemsWrap.appendChild(block);
    } else {
      block.innerHTML = `
        <div class="items-head">
          <strong>Itens da coleção ${idCol}</strong>
          <button class="remove-col" data-col="${idCol}" 
                  style="float:right; background:none; border:none; font-size:18px; cursor:pointer;">
            ❌
          </button>
        </div>
        <div class="mini-grid">
          ${items.map(i => `
            <label class="mini-card">
              <input type="checkbox" data-item="${i.id_item}" />
              <img src="img/item-placeholder.jpg" alt="">
              <span>${i.name}</span>
            </label>
          `).join("")}
        </div>
      `;
      fItemsWrap.appendChild(block);

      // listeners nos itens
      block.querySelectorAll("input[type=checkbox]").forEach(cb => {
        cb.addEventListener("change", () => {
          const idItem = cb.dataset.item;
          const key = `${idCol}:${idItem}`; // chave única por coleção

          if (cb.checked) selectedItems.add(key);
          else selectedItems.delete(key);
        });
      });
    }

    // evento da cruz (remover coleção)
    const removeBtn = block.querySelector(".remove-col");
    removeBtn.addEventListener("click", () => {
      // 1. remover a seleção da coleção
      selectedCollections.delete(idCol);

      // 2. remover os itens desta coleção
      selectedItems.forEach(it => {
        if (String(it).startsWith(idCol + ":")) selectedItems.delete(it);
      });

      // 3. remover bloco
      block.remove();

      // 4. desmarcar checkbox
      const chk = document.querySelector(`.pick-card[data-id="${idCol}"] input`);
      if (chk) chk.checked = false;
    });

  } catch (err) {
    console.error(err);
  }
}

// remover bloco de itens quando coleção é desmarcada
function removeItemsBlock(idCol) {
  const block = fItemsWrap?.querySelector(`.items-block[data-col="${idCol}"]`);
  block?.remove();
}

// -----------------------
// 6) SAVE NEW EVENT (POST)
// -----------------------
const fSave = document.getElementById("f-save");

fSave?.addEventListener("click", async (e) => {
  e.preventDefault();

  const name = document.getElementById("f-name")?.value.trim();
  const date = document.getElementById("f-date")?.value;
  const desc = document.getElementById("f-desc")?.value.trim();
  const loc  = document.getElementById("f-loc")?.value.trim();

  if (!name || !date) {
    alert("Preenche nome e data!");
    return;
  }

  const payload = {
    name,
    event_date: date,
    description: desc || null,
    location: loc || null,
    collections: Array.from(selectedCollections),
    items: Array.from(selectedItems).map(k => k.split(":")[1])
  };

  try {
    const r = await fetch("controllers/events.php", {
  method: "POST",
  headers: {"Content-Type":"application/json"},
  body: JSON.stringify(payload)
});

const text = await r.text();
console.log("RAW RESPONSE:", text);

let resp;
try {
    resp = JSON.parse(text);
} catch (e) {
    console.error("JSON PARSE ERROR:", e);
    return;
}


    alert("Evento criado com sucesso!");
    eventForm.classList.remove("show");

    // recarrega eventos
    const events = await fetch("controllers/events.php").then(x => x.json());
    allEvents = events || [];
    renderEvents();

  } catch (err) {
    console.error(err);
    alert("Erro de rede ao criar evento.");
  }
});

}); 
