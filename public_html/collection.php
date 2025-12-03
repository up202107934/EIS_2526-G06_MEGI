<?php
require_once __DIR__ . "/partials/bootstrap.php";
require_once __DIR__ . "/dal/ItemCategoryDAL.php";
require_once __DIR__ . "/dal/CollectionDAL.php"; 

$categories = ItemCategoryDAL::getAll();

// --- LÓGICA DE VERIFICAÇÃO DE DONO ---
$isOwner = false; 

if (isset($_GET['id'])) {
    $collectionId = (int)$_GET['id'];
    $collection = CollectionDAL::getById($collectionId);

    if ($collection && isset($_SESSION['id_user']) && $collection['id_user'] == $_SESSION['id_user']) {
        $isOwner = true;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Collection | MyCollections</title>
  <link rel="stylesheet" href="css/style.css"> 
  <link rel="stylesheet" href="css/collection.css">
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600&display=swap" rel="stylesheet">
  
  <script src="js/navbar.js"></script> 
</head>

<body>

<?php require_once __DIR__ . "/partials/navbar.php"; ?>

<header class="collection-header">
  <div class="search-bar"></div>
</header>

<h1 class="collection-title" id="collectionName">Collection</h1>

<div class="collection-toolbar pro">
  <div class="toolbar-left">
    <div class="view-toggle" role="group" aria-label="View toggle">
      <button class="btn-view chip" data-view="grid" aria-pressed="true" title="Grid view">
        <span class="icon-grid" aria-hidden="true"></span>
        <span>Grid</span>
      </button>
      <button class="btn-view chip" data-view="list" aria-pressed="false" title="List view">
        <span class="icon-list" aria-hidden="true"></span>
        <span>List</span>
      </button>
    </div>
  </div>

  <div class="toolbar-right">
    <label class="field">
      <span>Sort</span>
      <select id="sortSelect">
        <option value="default">Default</option>
        <option value="ratingDesc">Importance (High → Low)</option>
        <option value="ratingAsc">Importance (Low → High)</option>
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
            <?php foreach ($categories as $cat): ?>
                <option value="<?= $cat['id_item_category'] ?>">
                    <?= htmlspecialchars($cat['name']) ?>
                </option>
            <?php endforeach; ?>
        </select>
    </label>
  </div>
</div>

<section class="collection-items grid-view" id="itemsContainer"></section>

<?php if ($isOwner): ?>
    <button class="add-item-btn">➕ Add Item</button>
<?php endif; ?>

<?php if ($isOwner): ?>
<div id="addItemModal" class="modal">
  <div class="modal-content">
    <h2>Add New Item</h2>

    <form id="addItemForm">
      <label>Name:</label>
      <input type="text" id="itemName" placeholder="Item Name" required>

      <label>Description:</label>
      <input type="text" id="itemDesc" placeholder="Short description" required>

      <div style="display:flex; gap:10px;">
          <div style="flex:1;">
              <label>Importance (1–10):</label>
              <input type="number" id="itemRating" min="1" max="10" value="5" required>
          </div>
          <div style="flex:1;">
              <label>Price (€):</label>
              <input type="number" id="itemPrice" min="0" step="0.01" value="0" required>
          </div>
      </div>

      <div style="display:flex; gap:10px;">
          <div style="flex:1;">
              <label>Weight (g):</label>
              <input type="number" id="itemWeight" min="0" step="1" value="0" required>
          </div>
          <div style="flex:1;">
              <label>Date of acquisition:</label>
              <input type="date" id="itemDate" required>
          </div>
      </div>
      
      <label>Category:</label>
        <select id="itemCategory" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ccc; margin-bottom:10px;">
            <option value="">-- Select category --</option>
            <?php foreach ($categories as $cat): ?>
                <option value="<?= $cat['id_item_category'] ?>">
                    <?= htmlspecialchars($cat['name']) ?>
                </option>
            <?php endforeach; ?>
        </select>

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
<?php endif; ?>


<section class="collection-events">
  <h2>Events with this collection</h2>
  <div class="collection-events-columns">
    <div>
      <h3>Upcoming</h3>
      <div class="events-list" id="upcomingEventsList"></div>
    </div>
    <div>
      <h3>Past</h3>
      <div class="events-list" id="pastEventsList"></div>
    </div>
  </div>
</section>

<script src="js/collection.js"></script>

<script>
// Carregar título da coleção
const idCollection = new URLSearchParams(window.location.search).get("id");

if(idCollection) {
    fetch(`controllers/collections.php?id=${idCollection}`)
      .then(r => r.json())
      .then(c => {
        const title = document.getElementById("collectionName");
        if(title && c.name) title.textContent = c.name;
      })
      .catch(e => console.error("Erro loading title", e));

    // Carregar Eventos
    fetch(`controllers/events.php?collection=${idCollection}`)
      .then(r => r.json())
      .then(events => {
        const upcomingList = document.getElementById("upcomingEventsList");
        const pastList = document.getElementById("pastEventsList");
        const today = new Date();

        if(events && events.length > 0) {
            events.forEach(e => {
              const isFuture = new Date(e.event_date) >= today;
              const list = isFuture ? upcomingList : pastList;

              list.innerHTML += `
                <article class="event-card">
                  <h4>${e.name}</h4>
                  <p class="event-meta">
                    <span>📅 ${e.event_date}</span>
                    <span>📍 ${e.location ?? ""}</span>
                  </p>
                  <a href="events.php?id=${e.id_event}" class="event-link">View event</a>
                </article>
              `;
            });
        } else {
            if(upcomingList) upcomingList.innerHTML = "<p>No upcoming events.</p>";
            if(pastList) pastList.innerHTML = "<p>No past events.</p>";
        }
      })
      .catch(e => console.error("Erro loading events", e));
}
</script>

<footer class="footer">
  <p>© 2025 MyCollections | All rights reserved.</p>
</footer>

</body>
</html>