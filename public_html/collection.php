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
      <input id="q" type="search" placeholder="Search item..." />
      <button id="btn-search" class="search-btn" aria-label="Search">🔎</button>
    </div>

    <div class="navbar-user">
  <img id="avatarButton" class="navbar-avatar" src="img/user.jpg" alt="User" />
  
  <div class="profile-dropdown" id="profileDropdown">
    <a href="user.php">👤 Ver Perfil</a>
    <a href="home_withoutlogin.html">🚪 Log Out</a>
  </div>
</div>

      
    <div class="profile-dropdown" id="profileDropdown">
        <a href="user.php">👤 Ver Perfil</a>
        <a href="home_withoutlogin.html">🚪 Log Out</a>
      </div>

    <button id="themeToggle" class="theme-toggle">🌙</button>
  </div>
</header>

<header class="collection-header">
  <div class="search-bar"></div>
</header>

<h1 class="collection-title" id="collectionName">Collection</h1>


<div class="collection-toolbar pro">
  <!-- lado esquerdo: Grid / List -->
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
        <option value="Figures">Figures</option>
        <option value="Vehicles">Vehicles</option>
        <option value="Droids">Droids</option>
      </select>
    </label>
  </div>
</div>


<!-- itens da colecao -->
<section class="collection-items grid-view" id="itemsContainer">
  
</section>


<!-- modal adicionar item -->
<div id="addItemModal" class="modal">
  <div class="modal-content">
    <h2>Add New Item</h2>
    <form id="addItemForm">
      <label>Name:</label>
      <input type="text" id="itemName" placeholder="Enter item name" required>

      <label>Description:</label>
      <input type="text" id="itemDesc" placeholder="Short description" required>

      <label>Importance (1–10):</label>
      <input type="number" id="itemRating" min="1" max="10" value="1" required>

      <label>Price (€):</label>
      <input type="number" id="itemPrice" min="0" step="0.01" value="0" required>

      <label>Weight (g):</label>
      <input type="number" id="itemWeight" min="0" step="1" value="0" required>

      <label>Date of acquisition:</label>
      <input type="date" id="itemDate" required>

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

<!-- ==================== EVENTS SECTION ==================== -->
<section class="collection-events">
  <h2>Events with this collection</h2>

  <div class="collection-events-columns">
    <div>
      <h3>Upcoming</h3>
      <div class="events-list"id="upcomingEventsList"></div>
    </div>

    <div>
      <h3>Past</h3>
      <div class="events-list"id="pastEventsList"></div>
    </div>
  </div>
</section>



<script src="js/data.js"></script>
<script src="js/collection.js"></script>

<script>
const params = new URLSearchParams(window.location.search);
const idCollection = params.get("id");

// 1) carregar dados da coleção
fetch(`controllers/collections.php?id=${idCollection}`)
  .then(r => r.json())
  .then(c => {
    document.getElementById("collectionName").textContent = c.name;
  })
  .catch(err => console.error(err));

// 2) carregar itens da coleção
fetch(`controllers/items.php?collection=${idCollection}`)
  .then(r => r.json())
  .then(items => {
    const cont = document.getElementById("itemsContainer");
    cont.innerHTML = "";

    if (!items.length) {
      cont.innerHTML = "<p>No items in this collection yet.</p>";
      return;
    }

    items.forEach(it => {
      cont.innerHTML += `
        <div class="item-card"
             data-rating="${it.importance ?? 0}"
             data-price="${it.price ?? 0}"
             data-weight="${it.weight ?? 0}"
             data-category="${it.category_name ?? ''}">
          
          <img src="img/item-placeholder.jpg" alt="${it.name}">
          
          <div class="item-details">
            <div class="item-text">
              <h3>${it.name}</h3>
              <p>${it.franchise ?? ""}</p>
            </div>

            <div class="item-info">
              <span>⭐ ${it.importance ?? "-"}/10</span>
              <span>💰 ${it.price ?? "-"}€</span>
              <span>⚖️ ${it.weight ?? "-"}g</span>
              <span>🏷️ ${it.category_name ?? ""}</span>

              <span class="like-container">
                <button class="like-btn" type="button" aria-label="Like item">♡</button>
                <span class="like-count">0</span>
              </span>
            </div>
          </div>

          <div class="item-actions">
            <a href="item.php?id=${it.id_item}" class="btn-details">View Details</a>
          </div>
        </div>
      `;
    });
  })
  .catch(err => console.error(err));
</script>
<script>
const params = new URLSearchParams(window.location.search);
const idCollection = params.get("id");

fetch(`controllers/events.php?collection=${idCollection}`)
  .then(r => r.json())
  .then(events => {
    const upcomingList = document.getElementById("upcomingEventsList");
    const pastList = document.getElementById("pastEventsList");

    upcomingList.innerHTML = "";
    pastList.innerHTML = "";

    const today = new Date();

    if (!events.length) {
      upcomingList.innerHTML = "<p>No events for this collection yet.</p>";
      return;
    }

    events.forEach(e => {
      const d = new Date(e.event_date);

      const card = `
        <article class="event-card">
          <h4>${e.name}</h4>
          <p class="event-meta">
            <span>📅 ${e.event_date}</span>
            <span>📍 ${e.location ?? ""}</span>
          </p>
          <a href="events.php?id=${e.id_event}" class="event-link">View event</a>
        </article>
      `;

      if (d >= today) upcomingList.innerHTML += card;
      else pastList.innerHTML += card;
    });

    if (!upcomingList.innerHTML.trim()) {
      upcomingList.innerHTML = "<p>No upcoming events.</p>";
    }
    if (!pastList.innerHTML.trim()) {
      pastList.innerHTML = "<p>No past events.</p>";
    }
  });
</script>



<footer class="footer">
  <p>© 2025 MyCollections | All rights reserved.</p>
</footer>

</body>
</html>
