<head>
  <meta charset="UTF-8" />
  <title>Item Details | MyCollections</title>
  <link rel="stylesheet" href="css/style.css" />
  <link rel="stylesheet" href="css/item.css" />

  <script src="js/navbar.js"></script>
  
  <script defer src="js/item.js"></script>
</head>
<body>

  <?php require_once __DIR__ . "/partials/navbar.php"; ?>

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
          </ul>
        </section>
      </div>
    </div>

    <section class="description">
      <h2>Description</h2>
      <p>Luke Skywalker is one of the most iconic characters from the Star Wars universe.</p>
    </section>

    <div class="footer-actions">
      <button id="btn-edit" class="btn">Edit</button>
      <button id="btn-delete" class="btn">Delete</button>
    </div>

    <a href="collection.php" class="back-btn">← Back to Collection</a>
  </main>

  <div id="editModal" class="modal" aria-hidden="true">
    <div class="modal-content">
      <span id="edit-close" class="close">×</span>
      <h2>Edit Item</h2>
      <label>Name <input id="inputName" type="text" value="Luke Skywalker" /></label>
      <div class="modal-buttons">
        <button id="edit-cancel" class="btn secondary">Cancel</button>
        <button id="edit-save" class="btn">Save</button>
      </div>
    </div>
  </div>

  <div id="deleteModal" class="modal" aria-hidden="true">
    <div class="modal-content">
      <span id="delete-close" class="close">×</span>
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