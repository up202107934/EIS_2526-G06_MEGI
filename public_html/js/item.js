document.addEventListener("DOMContentLoaded", () => {
    console.log("item.js carregado com sucesso!");

    // ==========================================
    // 1. LÓGICA DE APAGAR (DELETE)
    // ==========================================
    const btnDelete = document.getElementById("btn-delete");
    
    if (btnDelete) {
        btnDelete.addEventListener("click", () => {
            if (!confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
                return;
            }

            const id = btnDelete.dataset.id;
            const colId = btnDelete.dataset.colId; // ID da coleção para onde voltar

            // Enviar pedido ao PHP
            fetch("controllers/item_delete.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    id_item: id,
                    id_collection: colId    
                })
            })
            .then(r => r.json())
            .then(resp => {
                if (resp.ok) {
                    alert("Item removed from this collection! 🗑️");

                    // Volta automaticamente para a coleção
                    if (colId) {
                        window.location.href = "collection.php?id=" + colId;
                    } else {
                        // fallback, caso falhe
                        window.location.href = "home.php";
                    }
                }
                else {
                    alert("Error deleting item: " + resp.error);
                }
            })
            .catch(err => {
                console.error(err);
                alert("Server connection error.");
            });
        });
    }

    // ==========================================
    // 2. LÓGICA DE EDITAR (EDIT)
    // ==========================================
    const modal     = document.getElementById("editItemModal");
    const btnEdit   = document.getElementById("btn-edit");
    const btnCancel = document.getElementById("cancelEditBtn");
    const form      = document.getElementById("editItemForm");

    // Abrir Modal e Preencher Dados
    if (btnEdit && modal) {
        btnEdit.addEventListener("click", () => {
            const d = btnEdit.dataset; // Dados que pusemos no HTML (data-name, data-price...)

            // Preencher os inputs do modal com os dados atuais
            document.getElementById("editIdItem").value   = d.id;
            document.getElementById("editName").value     = d.name;
            document.getElementById("editDesc").value     = d.desc;
            document.getElementById("editRating").value   = d.rating;
            document.getElementById("editPrice").value    = d.price;
            document.getElementById("editWeight").value   = d.weight;
            document.getElementById("editDate").value     = d.date;
            
            // Verifica se o campo Franchise existe no teu HTML antes de preencher
            const franchiseInput = document.getElementById("editFranchise");
            if(franchiseInput) franchiseInput.value = d.franchise || "";

            // Mostrar modal
            modal.classList.add("show");
            modal.style.display = "flex";
        });

        // Fechar Modal
        const closeModal = () => {
            modal.classList.remove("show");
            modal.style.display = "none";
        };

        btnCancel.addEventListener("click", closeModal);
        window.addEventListener("click", (e) => { 
            if (e.target === modal) closeModal(); 
        });

        // Enviar Formulário de Edição
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const fd = new FormData();
            fd.append("id_item", document.getElementById("editIdItem").value);
            fd.append("name", document.getElementById("editName").value);
            fd.append("description", document.getElementById("editDesc").value);
            fd.append("importance", document.getElementById("editRating").value);
            fd.append("price", document.getElementById("editPrice").value);
            fd.append("weight", document.getElementById("editWeight").value);
            fd.append("acquisition_date", document.getElementById("editDate").value);
            
            const franchiseInput = document.getElementById("editFranchise");
            if(franchiseInput) fd.append("franchise", franchiseInput.value);

            // Imagem (opcional)
            const file = document.getElementById("editImage").files[0];
            if (file) {
                fd.append("image", file);
            }

            // Enviar para o PHP
            fetch("controllers/item_update.php", {
                method: "POST",
                body: fd
            })
            .then(r => r.json())
            .then(resp => {
                if (resp.ok) {
                    alert("Item updated successfully! ✨");
                    window.location.reload(); // Recarrega a página para ver as mudanças
                } else {
                    alert("Error updating item: " + resp.error);
                }
            })
            .catch(err => {
                console.error(err);
                alert("Server connection error.");
            });
        });
    }

    // ==========================================
    // 3. LIKE BUTTON LOGIC (Mantido do teu antigo)
    // ==========================================
    // Nota: Isto guarda o like apenas no navegador da pessoa (LocalStorage).
    // Se mudares de PC, o like desaparece. Para ser permanente, precisarias de BD.
    // Guarda o estado no localStorage do navegador (não persiste em servidor).
    const likeBtn = document.getElementById("likeBtn");
    const likeCount = document.getElementById("likeCount");
    
    const itemTitle = document.querySelector(".item-title");

    if (likeBtn) {
        const uniqueId = likeBtn.dataset.itemId || (itemTitle ? itemTitle.textContent.trim() : "");
        if (!uniqueId) {
            console.warn("Like button encontrado mas sem identificador de item.");
            return;
        }

        const storageKey = "liked_" + uniqueId;
        const savedState = localStorage.getItem(storageKey) === "true";
        let liked = savedState;

        const baseCount = likeCount ? parseInt(likeCount.dataset.baseCount || likeCount.textContent) || 0 : 0;

        const updateLikeUI = () => {
            likeBtn.classList.toggle("liked", liked);
            likeBtn.setAttribute("aria-pressed", liked ? "true" : "false");
            likeBtn.textContent = liked ? "❤" : "♡";

            if (likeCount) {
                likeCount.textContent = liked ? baseCount + 1 : baseCount;
            }
            
        };

        updateLikeUI();

        likeBtn.addEventListener("click", () => {
            liked = !liked;
            localStorage.setItem(storageKey, liked ? "true" : "false");
            updateLikeUI();
            
            
        });
    }
});