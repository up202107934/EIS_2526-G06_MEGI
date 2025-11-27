<?php require_once __DIR__ . "/partials/bootstrap.php"; ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Home | My Collections</title>
  <link rel="stylesheet" href="css/style.css" />
</head>

<body>


<header class="navbar">
  <!-- LADO ESQUERDO: LOGO -->
  <div class="navbar-logo">
    <a href="home.php">MyCollections</a>
  </div>

  <nav class="navbar-center">
    <a href="events.php">Events</a>
    <a href="user.php#myCollectionsSection">My Collections</a>
    <a href="team.php">Team</a>
  </nav>

  
  
  
  <div class="navbar-right">
    <form class="navbar-search" id="searchForm" action="#" method="GET">
      <input
        type="text"
        id="searchInput"
        name="q"
        placeholder="Search collections..."
        required
      />
      <button type="button" class="search-btn">🔎</button>

    </form>

    <div class="navbar-user">
      <img
        src="img/user.jpg"
        alt="User"
        class="navbar-avatar"
        id="avatarButton"
      />

      <div class="profile-dropdown" id="profileDropdown">
        <a href="user.php">👤 Ver Perfil</a>
        <a href="home_withoutlogin.html">🚪 Log Out</a>
      </div>
    </div>

    <button id="themeToggle" class="theme-toggle">🌙</button>
  </div>
</header>



  <section class="hero">
    <img src="img/hero-bg.jpg" alt="Hero Background" class="hero-bg">
    <div class="hero-content">
      <h1>Welcome to <span>MyCollections</span></h1>
      <p>Discover and showcase your favorite collections</p>
      <a href="#collections" class="hero-btn">Explore Collections</a>
    </div>
  </section>

 
  <section class="home-section" id="collections">
    <div class="home-top-header">
      <h2 class="home-title">Top 5 Collections</h2>
      <p class="home-subtitle" id="topSubtitle">
      Global featured collections from the whole site.
      </p>
      
      <div class="home-top-filters" aria-label="Top filters">
        <button class="chip-top active" data-mode="featured">Featured (global)</button>
        <button class="chip-top" data-mode="recent">My recent</button>

        <select id="categoryFilter" class="category-filter">
          <option value="all">All categories</option>
          <option value="Miniatures">Miniatures</option>
          <option value="Card Games">Card Games</option>
          <option value="Coins">Coins</option>
          <option value="Books">Books</option>
        </select>
      </div>

    </div>

    
    <div id="topCollectionsGrid" class="collections-container">

    </div>

    <a href="user.php#minhas-colecoes" class="btn my-collections-btn">My Collections</a>
    <button class="btn-add" id="openModal">+ Create New Collection</button>
  </section>

  <!-- Modal para criar colecao-->
  <div id="createCollectionModal" class="modal">
    <div class="modal-content">
      <h2>Create New Collection</h2>

      <label for="collectionName">Name:</label>
      <input type="text" id="collectionName" placeholder="Enter collection name" required>

      <label for="collectionDescription">Description:</label>
      <input type="text" id="collectionDescription" placeholder="Enter collection description">

      <label for="collectionCategory">Category:</label>
        <select id="collectionCategory" required>
          <option value="">-- Select Category --</option>
          <option value="Miniatures">Miniatures</option>
          <option value="Card Games">Card Games</option>
          <option value="Coins">Coins</option>
          <option value="Books">Books</option>
        </select>

      <label for="collectionImage">Image:</label>
      <div id="dropZoneCollection" class="drop-zone">
        <p>Drag & drop an image here, or click to select</p>
        <input type="file" id="collectionImage" accept="image/*" hidden>
      </div>
      <img id="collectionPreview"
           src=""
           alt="Preview"
           style="display:none; max-width:100%; margin-top:10px; border-radius:8px;">

      <div class="modal-buttons">
        <button id="saveCollection">💾 Save</button>
        <button id="cancelCollection">❌ Cancel</button>
      </div>
    </div>
  </div>

  <!-- footer -->
  <footer class="footer">
    <p>© 2025 MyCollections | All rights reserved.</p>
  </footer>

 
  <script src="js/home.js"></script>
</body>
</html>
