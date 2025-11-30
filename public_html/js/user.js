document.addEventListener("DOMContentLoaded", () => {
    console.log("INICIOU JS - User Page");

    // ==========================================
    // 0. CARREGAR CATEGORIAS
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
            console.log("Categorias carregadas com sucesso!");

        } catch (err) {
            console.error("Erro categorias:", err);
            select.innerHTML = '<option value="">Error loading categories</option>';
        }
    }

    loadCategories();

    // ==========================================
    // 1. DADOS DE TEXTO DO PERFIL (Visual)
    // ==========================================
    const form          = document.getElementById('userForm');
    const statusMsg     = document.getElementById('statusMsg');
    const displayName   = document.getElementById('displayName');

    /* Guardar dados de texto */
    form?.addEventListener('submit', e => {
        e.preventDefault();
        const first = document.getElementById('firstName')?.value.trim();
        const last  = document.getElementById('lastName')?.value.trim();

        if(first && last) {
            if(displayName) displayName.textContent = `${first} ${last}`;
        }

        if(statusMsg) {
            statusMsg.style.display = "inline";
            setTimeout(() => statusMsg.style.display = "none", 2000);
        }
    });

    // ==========================================
    // 2. FOTO DE PERFIL (BACKEND UPLOAD)
    // ==========================================
    const photoModal        = document.getElementById('photoModal');
    const editPhotoBtn      = document.getElementById('editPhotoBtn'); 
    const cancelPhotoBtn    = document.getElementById('cancelPhotoBtn');
    const savePhotoBtn      = document.getElementById('savePhotoBtn');
    const photoInput        = document.getElementById('photoInput');
    const newPhotoPreview   = document.getElementById('newPhotoPreview');
    const newPhotoPlaceholder = document.getElementById('newPhotoPlaceholder');
    
    // Abrir Modal Foto
    editPhotoBtn?.addEventListener('click', () => {
        if(photoModal) {
            photoModal.classList.add('show');
            photoModal.style.display = 'flex';
        }
    });

    // Fechar Modal Foto
    const closePhotoModal = () => {
        if(photoModal) {
            photoModal.classList.remove('show');
            photoModal.style.display = 'none';
        }
        if(photoInput) photoInput.value = "";
        if(newPhotoPreview) newPhotoPreview.style.display = 'none';
        if(newPhotoPlaceholder) newPhotoPlaceholder.style.display = 'block';
    };
    
    cancelPhotoBtn?.addEventListener('click', closePhotoModal);
    window.addEventListener('click', e => { if (e.target === photoModal) closePhotoModal(); });

    // Preview
    photoInput?.addEventListener('change', () => {
        const file = photoInput.files?.[0];
        if (file) {
           const reader = new FileReader();
           reader.onload = (ev) => {
              if(newPhotoPreview) {
                 newPhotoPreview.src = ev.target.result;
                 newPhotoPreview.style.display = 'block';
              }
              if(newPhotoPlaceholder) newPhotoPlaceholder.style.display = 'none';
           };
           reader.readAsDataURL(file);
        }
    });

    // Gravar Foto
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
    // 3. CRIAR NOVA COLEÇÃO (BACKEND)
    // ==========================================
    const openColBtn    = document.getElementById("openModal");
    const colModal      = document.getElementById("createCollectionModal");
    const cancelColBtn  = document.getElementById("cancelCollection");
    const saveColBtn    = document.getElementById("saveCollection");
    
    // Inputs
    const nameInput     = document.getElementById("collectionName");
    const descInput     = document.getElementById("collectionDescription");
    const catInput      = document.getElementById("collectionCategory"); 
    const colFileInput  = document.getElementById("collectionImage");
    const colDropZone   = document.getElementById("dropZoneCollection");
    const colPreview    = document.getElementById("collectionPreview");

    // Abrir/Fechar Modal de Coleção
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
    
    // Preview Imagem da Coleção
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

    // Gravar Nova Coleção
    saveColBtn?.addEventListener("click", () => {
        const name = nameInput?.value.trim();
        const description = descInput?.value.trim() || "";
        const file = colFileInput?.files?.[0];
        const categoryId = catInput?.value;

        if (!name) {
            alert("Please enter a collection name!");
            return;
        }
        if (!categoryId) {
            alert("Please select a category!");
            return;
        }

        const formData = new FormData();
        formData.append("id_collection_category", categoryId);
        formData.append("name", name);
        formData.append("description", description);
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

});