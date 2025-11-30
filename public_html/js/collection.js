document.addEventListener("DOMContentLoaded", () => {
    console.log("collection.js carregado!");

    const collectionId = new URLSearchParams(window.location.search).get("id");
    const categoryFilter = document.getElementById("categoryFilter");

    // =====================================================
    // 1) CARREGAR ITENS
    // =====================================================
    async function loadCollectionItems() {
        const r = await fetch(`controllers/items.php?collection=${collectionId}`);
        const items = await r.json();

        const cont = document.getElementById("itemsContainer");
        cont.innerHTML = "";

        if (!items.length) {
            cont.innerHTML = "<p>No items in this collection yet.</p>";
            return;
        }

        // APLICAR FILTRO
        let selectedCat = categoryFilter.value;
        let filteredItems = items;

        // Se filtro não for "all", filtrar
        if (selectedCat !== "all") {
            filteredItems = items.filter(it => it.id_item_category == selectedCat);
        }

        if (!filteredItems.length) {
            cont.innerHTML = "<p>No items match this category.</p>";
            return;
        }

        filteredItems.forEach(it => {
            cont.innerHTML += `
                <div class="item-card"
                    data-rating="${it.importance}"
                    data-price="${it.price}"
                    data-weight="${it.weight}">

                    <img src="${it.img || 'img/item-placeholder.jpg'}" alt="${it.name}">

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
                        <a href="item.php?id=${it.id_item}" class="btn-details">View Details</a>
                    </div>
                </div>
            `;
        });

    }

    loadCollectionItems();
    categoryFilter.addEventListener("change", loadCollectionItems);


    // =====================================================
    // 2) MODAL ADD ITEM
    // =====================================================
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
        loadCollectionItems();
    });

});
