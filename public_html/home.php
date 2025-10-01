<?php
session_start();
if(!isset($_SESSION['user_id'])){
    header("Location: login page.html");
    exit;
}
$username = $_SESSION['username'];
?>
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Home - Coleções</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

<h1>Bem-vindo, <?= htmlspecialchars($username) ?></h1>
<button id="logout">Logout</button>

<div class="view-options">
  <label for="view-mode">Mostrar coleções:</label>
  <select id="view-mode">
    <option value="latest">Últimas adicionadas</option>
    <option value="choose">Escolher coleções favoritas</option>
  </select>
</div>

<div id="collections-container"></div>

<div class="new-collection">
  <h2>Criar Nova Coleção</h2>
  <label for="nome">Nome da Coleção:</label><br>
  <input type="text" id="nome" required><br><br>
  <label for="desc">Descrição:</label><br>
  <textarea id="desc" required></textarea><br><br>
  <button id="createCollectionBtn" type="button">Criar Coleção</button>
</div>

<script src="js/main.js"></script>
<script>
  // Logout
  document.getElementById('logout').addEventListener('click', ()=>{
    window.location.href = 'api/logout.php';
  });

  // Função para mostrar coleções
  function showCollections(list){
    const container = document.getElementById('collections-container');
    container.innerHTML = '';
    if(!list || list.length === 0){
      container.innerHTML = '<p>Sem coleções ainda.</p>';
      return;
    }

    const mode = document.getElementById('view-mode').value;
    if(mode === 'latest'){
      list.slice(-5).reverse().forEach(col=>{
        const div = document.createElement('div');
        div.className = 'collection';
        div.innerHTML = `<h3>${col.nome}</h3><p>${col.desc}</p>`;
        container.appendChild(div);
      });
    } else {
      const formCheckbox = document.createElement('form');
      list.forEach((col, index)=>{
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" value="${index}"> ${col.nome}<br>`;
        formCheckbox.appendChild(label);
      });
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = 'Mostrar selecionadas';
      btn.onclick = function(){
        const selected = [];
        formCheckbox.querySelectorAll('input[type="checkbox"]').forEach(cb=>{
          if(cb.checked) selected.push(list[cb.value]);
        });
        showCollections(selected.slice(0,5));
      };
      formCheckbox.appendChild(btn);
      container.appendChild(formCheckbox);
    }
  }

  // Buscar coleções do servidor
  function fetchCollections(){
    fetch('api/collections.php')
      .then(res => res.json())
      .then(data=>{
        if(data.success === false){
          alert(data.msg || 'Erro ao carregar coleções');
        } else {
          window.allCollections = data;
          showCollections(data);
        }
      })
      .catch(()=>alert('Erro ao comunicar com o servidor.'));
  }

  fetchCollections();

  // Criar nova coleção
  document.getElementById('createCollectionBtn').addEventListener('click', ()=>{
    const nome = document.getElementById('nome').value.trim();
    const desc = document.getElementById('desc').value.trim();
    if(!nome){ alert('Escreve um nome para a coleção.'); return; }

    fetch('api/collections.php', {
      method:'POST',
      body: JSON.stringify({ nome, desc })
    })
    .then(res=>res.json())
    .then(data=>{
      if(data.success){
        document.getElementById('nome').value = '';
        document.getElementById('desc').value = '';
        fetchCollections();
      } else {
        alert(data.msg || 'Erro ao criar coleção');
      }
    })
    .catch(()=>alert('Erro ao comunicar com o servidor.'));
  });

  // Mudar modo de visualização
  document.getElementById('view-mode').addEventListener('change', ()=>{
    showCollections(window.allCollections);
  });
</script>

</body>
</html>


