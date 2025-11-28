<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Item Details | MyCollections</title>

  <link rel="stylesheet" href="css/style.css" />


  <link rel="stylesheet" href="css/item.css" />


  <script defer src="js/item.js"></script>
</head>
<body>

  <!-- barra de navegaçao -->
  <header class="navbar">
    <div class="navbar-left">
      <div class="navbar-logo"><a href="home.php">MyCollections</a></div>
    </div>

    <nav class="navbar-center" aria-label="Primary">
      <a href="events.php">Events</a>
      <a href="user.php#myCollectionsSection" class="active">My Collections</a>
      <a href="team.php" class="active">Team</a>
    </nav>
      

    <div class="navbar-right">
      
      <div class="navbar-avatar-wrapper">
  <img class="navbar-avatar" src="img/user.jpg" alt="User" id="profileBtn">
  
  <div class="profile-dropdown" id="profileDropdown">
    <a href="user.php">👤 Ver Perfil</a>
    <a href="home_withoutlogin.html">🚪 Log Out</a>
  </div>
</div>

      <button id="themeToggle" class="theme-toggle">🌙</button>
    </div>
  </header>

  <!-- item -->
  <main class="item-page-container">
    <div class="item-header">
      <img src="img/luke.jpg" alt="Luke Skywalker" />
      <div class="item-info">
        <h1 class="item-title" id="itemName">Luke Skywalker</h1>
        
<div class="like-container">
    <button class="like-btn" id="likeBtn" aria-label="Like">♡</button>
    <span class="like-count" id="likeCount">0</span>
</div>

        <p class="item-category">Category: Star Wars Miniature</p>

        <section class="tech-sheet">
          <h2>Technical Sheet</h2>
          <ul class="spec-grid">
            <li><span class="k">Item</span><span class="v">Luke Skywalker</span></li>
            <li><span class="k">Importance</span><span class="v">★★★★☆</span></li>
            <li><span class="k">Weight</span><span class="v">120 g</span></li>
            <li><span class="k">Price</span><span class="v">25€</span></li>
            <li><span class="k">Date of acquisition</span><span class="v">12/04/2023</span></li>
            <li><span class="k">Rarity</span><span class="v">★★★★☆</span></li>
            <li><span class="k">Dimensions</span><span class="v">12 cm height</span></li>
            <li><span class="k">Year of release</span><span class="v">2022</span></li>
            <li><span class="k">Edition number</span><span class="v">#543</span></li>
            <li><span class="k">Material</span><span class="v">Resin/PVC</span></li>
            <li><span class="k">Serial no.</span><span class="v">SW-LK-0543</span></li>
          </ul>
        </section>
      </div>
    </div>

    <section class="description">
      <h2>Description</h2>
      <p>Luke Skywalker is one of the most iconic characters from the Star Wars universe. This miniature captures his heroic spirit, featuring his blue lightsaber and signature Rebel attire — a must-have for collectors and fans of the saga.</p>
    </section>

    <div class="footer-actions">
      <button id="btn-edit" class="btn">Edit</button>
      <button id="btn-delete" class="btn">Delete</button>
    </div>

    <a href="collection.php" class="back-btn">← Back to Collection</a>
  </main>

  <!-- editar item -->
  <div id="editModal" class="modal" aria-hidden="true">
    <div class="modal-content">
      <span id="edit-close" class="close" aria-label="Close">×</span>
      <h2>Edit Item</h2>

      <label>Item Name
        <input id="inputName" type="text" value="Luke Skywalker" />
      </label>

      <label>Importance
        <select id="inputImportance">
          <option>0</option><option>1</option><option>2</option><option>3</option><option selected>4</option><option>5</option>
        </select>
      </label>

      <label>Weight <input id="inputWeight" type="text" value="120 g" /></label>
      <label>Price <input id="inputPrice" type="text" value="25€" /></label>
      <label>Date of acquisition <input id="inputDate" type="text" value="12/04/2023" /></label>
      <label>Rarity
        <select id="inputRarity">
          <option>0</option><option>1</option><option>2</option><option>3</option><option selected>4</option><option>5</option>
        </select>
      </label>
      <label>Dimensions <input id="inputDimensions" type="text" value="12 cm height" /></label>
      <label>Year of release <input id="inputYear" type="number" value="2022" /></label>
      <label>Edition number <input id="inputEdition" type="text" value="#543" /></label>
      <label>Material <input id="inputMaterial" type="text" value="Resin/PVC" /></label>
      <label>Serial no. <input id="inputSerial" type="text" value="SW-LK-0543" /></label>
      <label>Category <input id="inputCategory" type="text" value="Star Wars Miniature" /></label>
      <label>Description <textarea id="inputDescription">Luke Skywalker is one of the most iconic characters...</textarea></label>

      <div class="modal-buttons">
        <button id="edit-cancel" class="btn secondary">Cancel</button>
        <button id="edit-save" class="btn">Save</button>
      </div>
    </div>
  </div>

  <!-- eliminar item  -->
  <div id="deleteModal" class="modal" aria-hidden="true">
    <div class="modal-content">
      <span id="delete-close" class="close" aria-label="Close">×</span>
      <h2>Delete Item</h2>
      <p>Are you sure you want to delete this item?</p>
      <div class="modal-buttons">
        <button id="delete-cancel" class="btn secondary">Cancel</button>
        <button id="delete-confirm" class="btn">Delete</button>
      </div>
    </div>
  </div>

  <footer class="footer">
    <p>© 2025 MyCollections | All rights reserved.</p>
  </footer>
</body>
</html>
