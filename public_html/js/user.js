document.addEventListener("DOMContentLoaded", () => {
    console.log("INICIOU JS - User Page");

    // ==========================================
    // 0. CARREGAR CATEGORIAS (Faltava isto!)
    // ==========================================
    // Esta função vai ao controllers/categories.php buscar a lista
    async function loadCategories() {
        const select = document.getElementById("collectionCategory");
        
        // Se o modal não existir na página, não faz nada
        if (!select) return; 

        try {
            // Faz o pedido ao ficheiro PHP que criaste
            const res = await fetch("controllers/categories.php"); 
            
            if (!res.ok) throw new Error("Erro ao comunicar com o servidor");
            
            // Converte a resposta (JSON) em objetos JavaScript
            const categories = await res.json();
            
            // Limpa o texto "Loading..." e mete a opção padrão
            select.innerHTML = '<option value="">-- Select Category --</option>';

            // Cria uma opção <option> para cada categoria vinda da BD
            categories.forEach(cat => {
                const option = document.createElement("option");
                option.value = cat.id_collection_category; // O ID que vai para a BD
                option.textContent = cat.name;             // O Nome que aparece ao utilizador
                select.appendChild(option);
            });
            console.log("Categorias carregadas com sucesso!");

        } catch (err) {
            console.error("Erro categorias:", err);
            select.innerHTML = '<option value="">Error loading categories</option>';
        }
    }

    // !!! IMPORTANTE: Chamar a função assim que a página carrega !!!
    loadCategories();


    // ==========================================
    // 1. DADOS DE TEXTO DO PERFIL (Visual)
    // ==========================================
    const form          = document.getElementById('userForm');
    const statusMsg     = document.getElementById('statusMsg');
    const displayName   = document.getElementById('displayName');
    const displayEmail  = document.getElementById('displayEmail');

    /* Guardar dados de texto (Por agora é apenas visual/simulação) */
    form?.addEventListener('submit', e => {
        e.preventDefault();
        const first = document.getElementById('firstName')?.value.trim();
        const last  = document.getElementById('lastName')?.value.trim();
        // const email = document.getElementById('email')?.value.trim(); // Não usado no display por enquanto

        if(first && last) {
            // Atualiza o nome na página
            if(displayName) displayName.textContent = `${first} ${last}`;
        }

        // Simulação visual de sucesso
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

    // Preview da imagem selecionada
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

    // GRAVAR FOTO NO SERVIDOR
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
    // 3. DARK MODE
    // ==========================================
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


    // ==========================================
    // 4. CRIAR NOVA COLEÇÃO (BACKEND)
    // ==========================================
    const openColBtn    = document.getElementById("openModal");
    const colModal      = document.getElementById("createCollectionModal");
    const cancelColBtn  = document.getElementById("cancelCollection");
    const saveColBtn    = document.getElementById("saveCollection");
    
    // Inputs
    const nameInput     = document.getElementById("collectionName");
    const descInput     = document.getElementById("collectionDescription");
    const catInput      = document.getElementById("collectionCategory"); // <--- Este agora será preenchido pelo loadCategories()
    const colFileInput  = document.getElementById("collectionImage");
    const colDropZone   = document.getElementById("dropZoneCollection");
    const colPreview    = document.getElementById("collectionPreview");

    // Abrir/Fechar Modal de Coleção
    const openColModal = (e) => { 
        e?.preventDefault(); 
        if (colModal) {
            colModal.classList.add("show");
            // Se usares display flex no css para .show, nao precisas disto, mas mal não faz
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

    // GRAVAR NOVA COLEÇÃO
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
            window.location.reload(); // Recarrega para mostrar a nova coleção
        })
        .catch(err => {
            console.error(err);
            alert("Server error.");
        });
    });

});