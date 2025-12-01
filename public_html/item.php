<?php
// item.php

// 1. Mostrar erros para debugging (remove isto quando estiver tudo a funcionar)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// 2. Incluir o Bootstrap e a DAL (Tal como fazes no controller)
require_once __DIR__ . "/partials/bootstrap.php"; 
require_once __DIR__ . "/dal/ItemDAL.php";

// 3. Validar se temos um ID na URL (ex: item.php?id=5)
if (!isset($_GET['id']) || empty($_GET['id'])) {
    die("Erro: Nenhum item selecionado. <a href='index.php'>Voltar</a>");
}

$id_item = (int)$_GET['id'];

// 4. Buscar o item usando a TUA DAL (Mantendo a consistência do projeto)
$item = ItemDAL::getById($id_item);

// Se a DAL devolver false ou null quando não encontra
if (!$item) {
    die("Erro: Item não encontrado. <a href='collection.php'>Voltar</a>");
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title><?php echo htmlspecialchars($item['name']); ?> | Details</title>
  <link rel="stylesheet" href="css/style.css" />
  <link rel="stylesheet" href="css/item.css" />
  <script src="js/navbar.js"></script>
</head>
<body>

  <?php require_once __DIR__ . "/partials/navbar.php"; ?>

  <main class="item-page-container">
    <div class="item-header">
      
      <img src="<?php echo htmlspecialchars($item['img']); ?>" 
           alt="<?php echo htmlspecialchars($item['name']); ?>" 
           style="max-width: 400px; object-fit: cover;"
           onerror="this.src='img/placeholder.png'" />

      <div class="item-info">
        <h1 class="item-title"><?php echo htmlspecialchars($item['name']); ?></h1>
        
        <p class="item-category">
            Importance: <?php echo htmlspecialchars($item['importance']); ?>/10
        </p>

        <section class="tech-sheet">
          <h2>Technical Sheet</h2>
          <ul class="spec-grid">
            <li><span class="k">Name</span><span class="v"><?php echo htmlspecialchars($item['name']); ?></span></li>
            
            <li><span class="k">Franchise</span><span class="v"><?php echo htmlspecialchars($item['franchise'] ?? '-'); ?></span></li>
            
            <li><span class="k">Weight</span><span class="v"><?php echo htmlspecialchars($item['weight']); ?> g</span></li>
            <li><span class="k">Price</span><span class="v"><?php echo htmlspecialchars($item['price']); ?> €</span></li>
            <li><span class="k">Acquired</span><span class="v"><?php echo htmlspecialchars($item['acquisition_date']); ?></span></li>
            
            <li><span class="k">Condition</span><span class="v"><?php echo htmlspecialchars($item['condition'] ?? '-'); ?></span></li>
            <li><span class="k">Material</span><span class="v"><?php echo htmlspecialchars($item['material'] ?? '-'); ?></span></li>
          </ul>
        </section>
      </div>
    </div>

    <section class="description">
      <h2>Description</h2>
      <p><?php echo nl2br(htmlspecialchars($item['description'] ?? 'No description available.')); ?></p>
    </section>

    <div class="footer-actions">
      <button id="btn-edit" class="btn" onclick="openEdit(<?php echo $item['id_item']; ?>)">Edit</button>
      <button id="btn-delete" class="btn" onclick="openDelete(<?php echo $item['id_item']; ?>)">Delete</button>
    </div>

    <a href="javascript:history.back()" class="back-btn">← Back to Collection</a>
  </main>

  <footer class="footer">
    <p>© 2025 MyCollections | All rights reserved.</p>
  </footer>
</body>
</html>