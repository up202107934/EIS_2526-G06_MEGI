document.addEventListener("DOMContentLoaded", () => {
    console.log("user.js carregado com sucesso!");

    // ==========================================
    // 0. CARREGAR CATEGORIAS (Para o modal de criar coleção)
    // ==========================================
    async function loadCategories() {
        const select = document.getElementById("collectionCategory");
        if (!select) return; 

        try {
            const res = await fetch("controllers/categories.php"); 
            if (!res.ok) throw new Error("Erro ao comunicar com o servidor");
            
            const categories = await res.json();
            
            select.innerHTML = '<option value="">-- Select Category --</option>';

            categories.forEach(cat => {
                const option = document.createElement("option");
                option.value = cat.id_collection_category; 
                option.textContent = cat.name;              
                select.appendChild(option);
            });
        } catch (err) {
            console.error("Erro categorias:", err);
            select.innerHTML = '<option value="">Error loading categories</option>';
        }
    }

    loadCategories();

    // ==========================================
    // 1. EDITAR PERFIL (Texto: Nome, Email, etc.)
    // ==========================================
    const profileModal   = document.getElementById("editProfileModal");
    const openProfileBtn = document.getElementById("openEditProfile");
    const cancelProfile  = document.getElementById("cancelProfileBtn");
    const profileForm    = document.getElementById("editProfileForm");

    // Debug: Verificar se os elementos foram encontrados
    if (!openProfileBtn) console.error("ERRO: Botão 'openEditProfile' não encontrado no HTML!");
    if (!profileModal)   console.error("ERRO: Modal 'editProfileModal' não encontrado no HTML!");

    // Abrir Modal
    openProfileBtn?.addEventListener("click", () => {
        console.log("Abrir modal perfil...");
        profileModal.classList.add("show");
        profileModal.style.display = "flex";
    });

    // Fechar Modal
    const closeProfileModal = () => {
        if(profileModal) {
            profileModal.classList.remove("show");
            profileModal.style.display = "none";
        }
    };

    cancelProfile?.addEventListener("click", closeProfileModal);
    
    // Fechar ao clicar fora
    window.addEventListener("click", (e) => {
        if (e.target === profileModal) closeProfileModal();
    });

    // Submeter Formulário de Perfil
    profileForm?.addEventListener("submit", (e) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append("name", document.getElementById("editFullName").value.trim());
        fd.append("username", document.getElementById("editUsername").value.trim());
        fd.append("email", document.getElementById("editEmail").value.trim());
        fd.append("date_of_birth", document.getElementById("editDob").value);

        fetch("controllers/user_update_info.php", {
            method: "POST",
            body: fd
        })
        .then(r => r.json())
        .then(resp => {
            if (resp.ok) {
                alert("Profile updated successfully! ✅");
                window.location.reload(); 
            } else {
                alert("Error: " + (resp.error || "Failed to update"));
            }
        })
        .catch(err => {
            console.error(err);
            alert("Server error");
        });
    });

    // ==========================================
    // 2. FOTO DE PERFIL (Upload)
    // ==========================================
    const photoModal      = document.getElementById('photoModal');
    const editPhotoBtn    = document.getElementById('editPhotoBtn'); 
    const cancelPhotoBtn  = document.getElementById('cancelPhotoBtn');
    const savePhotoBtn    = document.getElementById('savePhotoBtn');
    const photoInput      = document.getElementById('photoInput');
    const newPhotoPreview = document.getElementById('newPhotoPreview');
    const newPhotoPlace   = document.getElementById('newPhotoPlaceholder');
    
    editPhotoBtn?.addEventListener('click', () => {
        if(photoModal) {
            photoModal.classList.add('show');
            photoModal.style.display = 'flex';
        }
    });

    const closePhotoModal = () => {
        if(photoModal) {
            photoModal.classList.remove('show');
            photoModal.style.display = 'none';
        }
        if(photoInput) photoInput.value = "";
        if(newPhotoPreview) newPhotoPreview.style.display = 'none';
        if(newPhotoPlace) newPhotoPlace.style.display = 'block';
    };
    
    cancelPhotoBtn?.addEventListener('click', closePhotoModal);
    window.addEventListener('click', e => { if (e.target === photoModal) closePhotoModal(); });

    photoInput?.addEventListener('change', () => {
        const file = photoInput.files?.[0];
        if (file) {
           const reader = new FileReader();
           reader.onload = (ev) => {
              if(newPhotoPreview) {
                 newPhotoPreview.src = ev.target.result;
                 newPhotoPreview.style.display = 'block';
              }
              if(newPhotoPlace) newPhotoPlace.style.display = 'none';
           };
           reader.readAsDataURL(file);
        }
    });

    savePhotoBtn?.addEventListener('click', () => {
        const file = photoInput?.files?.[0];
        if (!file) {
            alert("Please select a photo first.");
            return;
        }

        const formData = new FormData();
        formData.append("new_photo", file);

        fetch("controllers/user_update.php", {
            method: "POST",
            body: formData
        })
        .then(r => r.json())
        .then(resp => {
            if (resp.ok) {
                alert("Profile photo updated! 😎");
                window.location.reload(); 
            } else {
                alert("Error: " + (resp.error || "Failed to upload"));
            }
        })
        .catch(err => {
            console.error(err);
            alert("Server error");
        });
    });

    // ==========================================
    // 3. CRIAR NOVA COLEÇÃO
    // ==========================================
    const openColBtn    = document.getElementById("openModal");
    const colModal      = document.getElementById("createCollectionModal");
    const cancelColBtn  = document.getElementById("cancelCollection");
    const saveColBtn    = document.getElementById("saveCollection");
    
    const nameInput     = document.getElementById("collectionName");
    const descInput     = document.getElementById("collectionDescription");
    const catInput      = document.getElementById("collectionCategory"); 
    const colFileInput  = document.getElementById("collectionImage");
    const colDropZone   = document.getElementById("dropZoneCollection");
    const colPreview    = document.getElementById("collectionPreview");

    const openColModal = (e) => { 
        e?.preventDefault(); 
        if (colModal) {
            colModal.classList.add("show");
            colModal.style.display = "flex"; 
        }
    };

    const closeColModal = () => { 
        if (colModal) {
            colModal.classList.remove("show");
            colModal.style.display = "none";
        }
    };

    openColBtn?.addEventListener("click", openColModal);
    cancelColBtn?.addEventListener("click", closeColModal);
    
    colDropZone?.addEventListener("click", () => colFileInput?.click());
    colFileInput?.addEventListener("change", () => {
        const file = colFileInput.files?.[0];
        if (file && colPreview) {
           const reader = new FileReader();
           reader.onload = (ev) => {
              colPreview.src = ev.target.result;
              colPreview.style.display = "block";
              if(colDropZone) colDropZone.style.display = "none";
           };
           reader.readAsDataURL(file);
        }
    });

    saveColBtn?.addEventListener("click", () => {
        const name = nameInput?.value.trim();
        const description = descInput?.value.trim() || "";
        const file = colFileInput?.files?.[0];
        const categoryId = catInput?.value;

        if (!name) { alert("Please enter a collection name!"); return; }
        if (!categoryId) { alert("Please select a category!"); return; }

        const formData = new FormData();
        formData.append("id_collection_category", categoryId);
        formData.append("name", name);
        formData.append("description", description);
        formData.append("creation_date", new Date().toISOString().slice(0,10));
        
        if (file) formData.append("cover_img", file);

        fetch("controllers/collections.php", {
            method: "POST",
            body: formData 
        })
        .then(r => r.json())
        .then(resp => {
            if (!resp.ok) {
                alert("Error: " + (resp.error || "Failed"));
                return;
            }
            alert("Collection created! 📸");
            window.location.reload(); 
        })
        .catch(err => {
            console.error(err);
            alert("Server error.");
        });
    });
    
    // ==========================================
    // 4. APAGAR COLEÇÃO
    // ==========================================
    document.querySelector('.collections-grid')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.delete-collection-btn');
        
        if (btn) {
            const id = btn.dataset.id;
            
            if (confirm("Are you sure you want to delete this collection? This cannot be undone! ⚠️")) {
                
                fetch("controllers/collection_delete.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id_collection: id })
                })
                .then(r => r.json())
                .then(resp => {
                    if (resp.ok) {
                        const card = btn.closest('.collection-card');
                        card.style.opacity = "0";
                        setTimeout(() => card.remove(), 300);
                    } else {
                        alert("Error: " + (resp.error || "Failed to delete"));
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert("Server error");
                });
            }
        }
    });
    
    // ==========================================
    // 5. WISHLIST (servidor)
    // ==========================================
    const wishlistContainer = document.getElementById("wishlistContainer");
    const wishlistEmpty = document.getElementById("wishlistEmpty");

    const renderWishlist = (items = []) => {
        if (!wishlistContainer || !wishlistEmpty) return;

        wishlistContainer.innerHTML = "";

        if (!items.length) {
            wishlistEmpty.style.display = "block";
            return;
        }

        wishlistEmpty.style.display = "none";

        items.forEach((item) => {
            const card = document.createElement("div");
            card.className = "wishlist-item";

            const img = document.createElement("img");
            img.src = item.img || "img/collection-placeholder.jpg";
            img.alt = item.name || "Wishlist item";

            const title = document.createElement("h3");
            title.textContent = item.name || "Unnamed item";

            card.appendChild(img);
            card.appendChild(title);

            if (item.collection_names) {
                const collectionTag = document.createElement("p");
                collectionTag.style.color = "#555";
                collectionTag.style.fontSize = "0.9rem";
                collectionTag.textContent = `Collection: ${item.collection_names}`;
                card.appendChild(collectionTag);
            }

            if (item.description) {
                const desc = document.createElement("p");
                desc.style.fontSize = "0.9rem";
                desc.textContent = item.description;
                card.appendChild(desc);
            }

            const metaValues = [];
            if (item.price) metaValues.push(`Price: ${item.price}`);
            if (item.weight) metaValues.push(`Weight: ${item.weight}`);

            if (metaValues.length) {
                const meta = document.createElement("p");
                meta.style.fontSize = "0.85rem";
                meta.style.color = "#666";
                meta.textContent = metaValues.join(" • ");
                card.appendChild(meta);
            }
            
            const actions = document.createElement("div");
            actions.className = "wishlist-actions";

            const viewBtn = document.createElement("a");
            viewBtn.className = "view-btn";
            const collectionQuery = item.collection_id ? `&col=${item.collection_id}` : "";
            viewBtn.href = `item.php?id=${item.id_item}${collectionQuery}`;
            viewBtn.textContent = "View";

            const removeBtn = document.createElement("button");
            removeBtn.className = "remove-btn wishlist-remove-btn";
            removeBtn.dataset.id = item.id_item;
            removeBtn.textContent = "Remove";

            actions.appendChild(viewBtn);
            actions.appendChild(removeBtn);

            card.appendChild(actions);

            wishlistContainer.appendChild(card);
        });
    };

    const loadWishlist = async () => {
        if (!wishlistContainer || !wishlistEmpty) return;

        try {
            const res = await fetch("controllers/wishlist.php");
            const data = await res.json();

            if (!data.ok) throw new Error(data.error || "wishlist_fetch_error");

            renderWishlist(data.items || []);
        } catch (err) {
            console.error("Erro ao carregar wishlist:", err);
            wishlistContainer.innerHTML = "";
            wishlistEmpty.textContent = "Unable to load wishlist items.";
            wishlistEmpty.style.display = "block";
        }
    };

    const removeWishlistItem = async (idItem) => {
        try {
            const res = await fetch("controllers/wishlist.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_item: idItem })
            });

            const data = await res.json();
            if (!data.ok) throw new Error(data.error || "wishlist_remove_error");

            await loadWishlist();
        } catch (err) {
            console.error("Erro ao remover da wishlist:", err);
            alert("Couldn't remove this item from your wishlist.");
        }
    };

    document.addEventListener("click", async (e) => {
        const btn = e.target.closest(".wishlist-remove-btn");
        if (!btn) return;

        const idItem = parseInt(btn.dataset.id, 10);
        if (!idItem) return;

        const confirmed = confirm("Remove this item from your wishlist?");
        if (!confirmed) return;

        await removeWishlistItem(idItem);
    });

    loadWishlist();
// REMOVER EVENTO INTERESTED
document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".remove-interest-btn");
    if (!btn) return;

    const id_event = btn.dataset.id;
    if (!confirm("Remove this event from your Interested list?")) return;

    try {
        const res = await fetch("controllers/event_remove_interest.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_event })
        });

        const data = await res.json();
        if (data.success) {
            btn.closest(".event-card").remove();
        } else {
            alert("Error removing interest!");
        }
    } catch (err) {
        console.error(err);
        alert("Server error");
    }
});


// REMOVER PARTICIPAÇÃO EM EVENTO
document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".remove-participation-btn");
    if (!btn) return;

    const id_event = btn.dataset.id;
    if (!confirm("Cancel participation in this event?")) return;

    try {
        const res = await fetch("controllers/event_remove_participation.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_event })
        });

        const data = await res.json();
        if (data.success) {
            btn.closest(".event-card").remove();
        } else {
            alert("Error removing participation!");
        }
    } catch (err) {
        console.error(err);
        alert("Server error");
    }
    });



});