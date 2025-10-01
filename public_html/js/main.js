// Função genérica para mostrar alertas de erro
function showError(msg) {
    alert(msg);
}

// Função para criar coleção
function createCollection(nome, desc) {
    fetch('api/collections.php', {
        method: 'POST',
        body: JSON.stringify({nome: nome, desc: desc})
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            alert('Coleção criada com sucesso!');
            loadCollections(); // atualiza a lista de coleções
        } else {
            showError(data.msg);
        }
    });
}

// Função para carregar coleções do utilizador
function loadCollections() {
    fetch('api/collections.php')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('collections-container');
        container.innerHTML = '';
        if(data.length === 0){
            container.innerHTML = '<p>Sem coleções ainda.</p>';
        } else {
            data.forEach(col => {
                const div = document.createElement('div');
                div.className = 'collection';
                div.innerHTML = `<h3>${col.nome}</h3><p>${col.desc}</p>`;
                container.appendChild(div);
            });
        }
    });
}

