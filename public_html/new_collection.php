<?php
require_once __DIR__ . "/partials/bootstrap.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Star Wars Miniatures Collection</title>
  <link rel="stylesheet" href="css/collection.css">

  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600&display=swap" rel="stylesheet">

 
</head>
<body>

<header class="navbar">
  <div class="navbar-logo">
    <a href="home.php">MyCollections</a>
  </div>

  <nav class="navbar-links">
    <a href="events.php">Events</a>
    <a href="user.php#myCollectionsSection">My Collections</a>
    <a href="team.php">Team</a>
  </nav>

  <div class="navbar-actions">
    <div class="navbar-search">
      <input id="q" type="search" placeholder="Search items..." />
      <button id="btn-search" class="search-btn" aria-label="Search">
        🔎
      </button>
    </div>

    <a href="user.php" title="Profile">
      <img class="navbar-avatar" src="img/user.jpg" alt="User" />
    </a>

    <button id="themeToggle" class="theme-toggle">🌙</button>
  </div>
</header>

    
  <!-- Banner -->
  <header class="collection-header">
    <div class="search-bar">
    </div>
  </header>
  
  <!-- Título da coleção -->
  <h1 class="collection-title">Star Wars Miniatures</h1>
  <!-- Toolbar: alternar vista -->
  
<div class="collection-toolbar pro">
  <!-- LADO ESQUERDO: GRID / LIST -->
  <div class="toolbar-left">
    <div class="view-toggle" role="group" aria-label="View toggle">
      <button class="btn-view chip" data-view="grid" aria-pressed="true" title="Grid view">
        <span class="icon-grid"></span>
        <span>Grid</span>
      </button>

      <button class="btn-view chip" data-view="list" aria-pressed="false" title="List view">
        <span class="icon-list"></span>
        <span>List</span>
      </button>
    </div>
  </div>


  <!-- LADO DIREITO: SORT E CATEGORY -->
  <div class="toolbar-right">
    <label class="field">
      <span>Sort</span>
      <select id="sortSelect">
        <option value="default">Default</option>
        <option value="ratingDesc">Rating (High → Low)</option>
        <option value="priceAsc">Price (Low → High)</option>
        <option value="priceDesc">Price (High → Low)</option>
        <option value="weightAsc">Weight (Low → High)</option>
        <option value="weightDesc">Weight (High → Low)</option>
      </select>
    </label>



    <label class="field">
      <span>Category</span>
      <select id="categoryFilter">
        <option value="all">All Categories</option>
        <option value="Figures">Figures</option>
        <option value="Vehicles">Vehicles</option>
        <option value="Droids">Droids</option>
      </select>
    </label>
  </div>
</div>
  
<section class="collection-items grid-view">
    
</section>

<div id="addItemModal" class="modal">
  <div class="modal-content">
    <h2>Add New Item</h2>

    <form id="addItemForm">
      <label>Name:</label>
      <input type="text" id="itemName" placeholder="Enter item name">

      <label>Description:</label>
      <input type="text" id="itemDesc" placeholder="Short description">

      <label>Importance (1–10):</label>
      <input type="number" id="itemRating" min="1" max="10" value="1">

      <label>Price (€):</label>
      <input type="number" id="itemPrice" min="0" step="0.01" value="0">

      <label>Weight (g):</label>
      <input type="number" id="itemWeight" min="1" step="1" value="1">
      
      <label>Category:</label>
    <select id="itemCategory" class="categorySelect">
        <option value="">-- Select category --</option>
        <option value="Figures">Figures</option>
        <option value="Vehicles">Vehicles</option>
        <option value="Droids">Droids</option>
    </select>

      <label>Date of acquisition:</label>
      <input type="date" id="itemDate">

      <label for="itemImage">Image:</label>
      <div id="dropZone" class="drop-zone">
        <p>Drag & drop an image here, or click to select</p>
        <input type="file" id="itemImage" accept="image/*" hidden>
      </div>

      <div class="modal-buttons">
        <button type="submit" id="saveItem">💾 Save</button>
        <button type="button" id="cancelItem">❌ Cancel</button>
      </div>
    </form>
  </div>
</div>


  <button class="add-item-btn">➕ Add Item</button>


<script>
  // Ler o parâmetro "name" da URL
  const params = new URLSearchParams(window.location.search);
  const collectionName = params.get("name");

  // Se existir, atualizar o título
  if (collectionName) {
    document.querySelector(".collection-title").textContent = collectionName;
  }
 </script>
 
  <script src="js/new_collection.js"></script>

</body>
</html>
