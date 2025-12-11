document.addEventListener("DOMContentLoaded", () => {
    console.log("collection.js carregado!");

    const collectionId = new URLSearchParams(window.location.search).get("id");
    const categoryFilter = document.getElementById("categoryFilter");
    
    const sortSelect = document.getElementById("sortSelect");
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("q") || document.getElementById("searchInput");
    const searchBtn = document.querySelector(".navbar-search .search-btn");
    let cachedItems = null;

    // =====================================================
    // 1) CARREGAR ITENS
    // =====================================================
    //async function loadCollectionItems() {
    //    const r = await fetch(`controllers/items.php?collection=${collectionId}`);
    //    const items = await r.json();
    async function loadCollectionItems(forceReload = false) {
        if (forceReload || !Array.isArray(cachedItems)) {
            const r = await fetch(`controllers/items.php?collection=${collectionId}`);
            cachedItems = await r.json();
        }

        const items = Array.isArray(cachedItems) ? [...cachedItems] : [];

        const cont = document.getElementById("itemsContainer");
        cont.innerHTML = "";

        if (!items.length) {
            cont.innerHTML = "<p>No items in this collection yet.</p>";
            return;
        }

        // APLICAR FILTRO
        //let selectedCat = categoryFilter.value;
        let selectedCat = categoryFilter?.value ?? "all";
        const query = (searchInput?.value || "").trim().toLowerCase();
        let filteredItems = items;

        // Se filtro não for "all", filtrar
        if (selectedCat !== "all") {
            filteredItems = filteredItems.filter(it => it.id_item_category == selectedCat);
        }

        // Se houver pesquisa, filtrar por nome/descrição
        if (query) {
            filteredItems = filteredItems.filter(it => {
                const name = (it.name || "").toLowerCase();
                const desc = (it.description || "").toLowerCase();
                return name.includes(query) || desc.includes(query);
            });
        }

        // Ordenar conforme o seletor
        switch (sortSelect?.value) {
            case "ratingDesc":
                filteredItems.sort((a, b) => (b.importance || 0) - (a.importance || 0));
                break;
            case "ratingAsc":
                filteredItems.sort((a, b) => (a.importance || 0) - (b.importance || 0));
                break;
            case "priceAsc":
                filteredItems.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case "priceDesc":
                filteredItems.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case "weightAsc":
                filteredItems.sort((a, b) => (a.weight || 0) - (b.weight || 0));
                break;
            case "weightDesc":
                filteredItems.sort((a, b) => (b.weight || 0) - (a.weight || 0));
                break;
            default:
                break; // mantém ordem original do servidor
            
            //filteredItems = items.filter(it => it.id_item_category == selectedCat);
        }

        if (!filteredItems.length) {
            cont.innerHTML = "<p>No items match this category.</p>";
            return;
        }

        filteredItems.forEach(it => {
            
            cont.innerHTML += `
            <div class="item-card"
                data-id="${it.id_item}"
                data-rating="${it.importance}"
                data-price="${it.price}"
                data-weight="${it.weight}">
                
                <img src="${it.img ? it.img : 'img/item-placeholder.jpg'}" alt="${it.name}">

                <div class="item-details">
                    <h3>${it.name}</h3>
                    <p>${it.description ?? ''}</p>

                    <div class="item-info">
                        <span>⭐ ${it.importance}/10</span>
                        <span>💰 ${it.price}€</span>
                        <span>⚖️ ${it.weight}g</span>
                    </div>
                </div>

                <div class="item-actions">
                    <a href="item.php?id=${it.id_item}&col=${ID_COLLECTION}" class="btn-details">View</a>

                    ${IS_OWNER ? `
                    <button class="btn-delete-item" data-id="${it.id_item}">🗑️</button>
                    ` : ""}
                </div>
            </div>
        `;
        });

    }

    loadCollectionItems();
    //categoryFilter.addEventListener("change", loadCollectionItems);
    categoryFilter?.addEventListener("change", () => loadCollectionItems());
    sortSelect?.addEventListener("change", () => loadCollectionItems());

    // Pesquisa via navbar (Enter ou botão)
    searchForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        loadCollectionItems();
    });

    searchBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        loadCollectionItems();
    });

    searchInput?.addEventListener("input", () => loadCollectionItems());


    // 2) MODAL ADD ITEM
    const addItemBtn = document.querySelector(".add-item-btn");
    const modal = document.getElementById("addItemModal");
    const cancelBtn = document.getElementById("cancelItem");
    const form = document.getElementById("addItemForm");
    const dropZone = document.getElementById("dropZone");
    const fileInput = document.getElementById("itemImage");

    let uploadedImageFile = null;

    addItemBtn?.addEventListener("click", () => {
        console.log("→ Botão Add Item clicado");
        modal.classList.add("show");
    });

    cancelBtn?.addEventListener("click", () => {
    modal.classList.remove("show");
    });


    dropZone?.addEventListener("click", () => fileInput.click());

    fileInput?.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (!file) return;
        uploadedImageFile = file;

        const reader = new FileReader();
        reader.onload = e => {
            dropZone.innerHTML = `<img src="${e.target.result}" style="max-width:100%; border-radius:8px;">`;
        };
        reader.readAsDataURL(file);
    });

    // ENVIAR ITEM
    form?.addEventListener("submit", async e => {
        e.preventDefault();

        const name = itemName.value.trim();
        const desc = itemDesc.value.trim();
        const rating = itemRating.value;
        const price = itemPrice.value;
        const weight = itemWeight.value;
        const date = itemDate.value;
        const category = document.getElementById("itemCategory").value || null;


        if (!uploadedImageFile) {
            alert("Please upload an image.");
            return;
        }

        const fd = new FormData();
        fd.append("name", name);
        fd.append("description", desc);
        fd.append("importance", rating);
        fd.append("price", price);
        fd.append("weight", weight);
        fd.append("acquisition_date", date);
        fd.append("id_collection", collectionId);
        fd.append("image", uploadedImageFile);
        fd.append("category", category);

        const resp = await fetch("controllers/items.php", {
            method: "POST",
            body: fd
        });

        const data = await resp.json();

        if (!data.success) {
            alert("Error adding item!");
            return;
        }

        alert("Item added!");
        modal.style.display = "none";
        form.reset();
        dropZone.innerHTML = `<p>Drag & drop an image here, or click to select</p>`;
        //loadCollectionItems();
        loadCollectionItems(true);
    });
    
// 3) GRID / LIST VIEW
const viewButtons = document.querySelectorAll(".btn-view");
const itemsContainer = document.getElementById("itemsContainer");


viewButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const view = btn.dataset.view;

        viewButtons.forEach(b => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");

        if (view === "grid") {
            itemsContainer.classList.add("grid-view");
            itemsContainer.classList.remove("list-view");
        } else {
            itemsContainer.classList.add("list-view");
            itemsContainer.classList.remove("grid-view");
        }

    });
});

// DELETE ITEM FROM COLLECTION
document.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("btn-delete-item")) return;

    const idItem = e.target.dataset.id;

    if (!confirm("Tem a certeza que quer eliminar este item desta coleção?")) {
        return;
    }

    const response = await fetch("controllers/item_delete.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id_item: idItem,
            id_collection: ID_COLLECTION
        })
    });

    const data = await response.json();

    if (data.ok) {
        alert("Item removido!");
        loadCollectionItems(true); // atualizar sem reload
    } else {
        alert("Erro ao eliminar: " + (data.error || ""));
    }
});

});
