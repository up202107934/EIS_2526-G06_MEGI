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
                body: JSON.stringify({ id_item: id })
            })
            .then(r => r.json())
            .then(resp => {
                if (resp.ok) {
                    alert("Item deleted successfully! 🗑️");
                    // Redireciona de volta para a coleção
                    window.location.href = "collection.php?id=" + colId;
                } else {
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
    const likeBtn = document.getElementById("likeBtn");
    const likeCount = document.getElementById("likeCount");
    
    // Tenta encontrar o nome do item para usar como ID único no localStorage
    // (Se tiveres um elemento com ID específico para o ID do item, seria melhor)
    const itemTitle = document.querySelector(".item-title"); 

    if (likeBtn && likeCount && itemTitle) {
        const itemId = itemTitle.textContent.trim(); // Usa o nome como chave
        const savedState = localStorage.getItem("liked_" + itemId);

        // Recuperar estado ao carregar a página
        if (savedState === "true") {
            likeBtn.classList.add("liked");
            likeBtn.textContent = "❤";
            // Incrementa visualmente se já estava com like (simulação)
            let current = parseInt(likeCount.textContent);
            likeCount.textContent = current + 1; 
        }

        likeBtn.addEventListener("click", () => {
            let count = parseInt(likeCount.textContent);

            if (likeBtn.classList.contains("liked")) {
                // remover like
                count = Math.max(0, count - 1);
                likeBtn.classList.remove("liked");
                likeBtn.textContent = "♡";
                localStorage.setItem("liked_" + itemId, "false");
            } else {
                // dar like
                count++;
                likeBtn.classList.add("liked");
                likeBtn.textContent = "❤";
                localStorage.setItem("liked_" + itemId, "true");
            }
            
            likeCount.textContent = count;
        });
    }
});