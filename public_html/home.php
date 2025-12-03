<?php
require_once __DIR__ . "/partials/bootstrap.php";
require_once __DIR__ . "/dal/CollectionCategoryDAL.php";

// Tenta buscar as categorias
$collCategories = CollectionCategoryDAL::getAll(); 

$isLoggedIn = isLoggedIn();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Home | My Collections</title>
  <link rel="stylesheet" href="css/style.css" />
</head>

<body>

<?php require_once __DIR__ . "/partials/navbar.php"; ?>

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

      <?php if ($isLoggedIn): ?>
        <button class="chip-top" data-mode="recent">My recent</button>
      <?php endif; ?>

      <select id="categoryFilter" class="category-filter">
        <option value="all">All categories</option>

        <?php foreach ($collCategories as $cat): ?>
            <option value="<?= $cat['id_collection_category'] ?>">
                <?= htmlspecialchars($cat['name']) ?>
            </option>
        <?php endforeach; ?>
       </select>
    </div>
  </div>

  <div id="topCollectionsGrid" class="collections-container"></div>

  <?php if ($isLoggedIn): ?>
    <a href="user.php#minhas-colecoes" class="btn my-collections-btn">My Collections</a>
    <button class="btn-add" id="openModal">+ Create New Collection</button>
  <?php else: ?>
    <p style="margin-top:12px;">
      Sign in to create and manage your own collections.
    </p>
  <?php endif; ?>
</section>


<?php if ($isLoggedIn): ?>
<div id="createCollectionModal" class="modal">
  <div class="modal-content">
    <h2>Create New Collection</h2>

    <label for="collectionName">Name:</label>
    <input type="text" id="collectionName" placeholder="Enter collection name" required>

    <label for="collectionDescription">Description:</label>
    <input type="text" id="collectionDescription" placeholder="Enter collection description">

    <label for="collectionCategory">Category:</label>

        <select id="collectionCategory" required>
            <option value="">Select a category...</option>

            <?php foreach ($collCategories as $cat): ?>
                <option value="<?= $cat['id_collection_category'] ?>">
                    <?= htmlspecialchars($cat['name']) ?>
                </option>
            <?php endforeach; ?>
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
<?php endif; ?>


<footer class="footer">
  <p>© 2025 MyCollections | All rights reserved.</p>
</footer>
<script src="js/navbar.js"></script> 

<script>
  window.IS_LOGGED_IN = <?= $isLoggedIn ? "true" : "false" ?>;
</script>
<script src="js/home.js"></script>

</body>
</html>