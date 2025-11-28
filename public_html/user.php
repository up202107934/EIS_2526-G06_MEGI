<?php

require_once __DIR__ . "/partials/bootstrap.php";

if (!isset($_SESSION["id_user"])) {
    header("Location: login.php");
    exit;
}

$collections = CollectionDAL::getByUser($_SESSION["id_user"]);
$user = UserDAL::getById($_SESSION["id_user"]);

?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>User Profile | My Collections</title>
    <link rel="stylesheet" href="css/user.css" />
</head>
<body>

  <!-- ===== barra de navegacao ===== -->
  <header class="navbar">
    <div class="navbar-logo">
      <a href="home.php">MyCollections</a>
    </div>

    <nav class="navbar-links">
      <a href="events.php" class="nav-link">Events</a>
      <a href="user.php#myCollectionsSection" class="nav-link">My Collections</a>
      <a href="team.php" class="nav-link">Team</a>
    </nav>

    <div class="navbar-actions">
      

      <div class="navbar-avatar-wrapper">
  <img class="navbar-avatar" src="img/user.jpg" alt="User" id="profileBtn">
  
  <div class="profile-dropdown" id="profileDropdown">
    <a href="user.php">👤 Ver Perfil</a>
    <a href="api/logout.php">🚪 Log Out</a>
  </div>
</div>


      <button id="themeToggle" class="theme-toggle" type="button">🌙</button>
    </div>
  </header>

  <!-- criar nova coleção -->
  <!-- criar nova coleção -->
<div id="createCollectionModal" class="modal">
  <div class="modal-content">

  <form action="create_collection.php" method="POST">

      <h2>Create New Collection</h2>

      <label>Name:</label>
      <input type="text" name="nome" required>

      <label>Description:</label>
      <input type="text" name="descricao">

      <div class="modal-buttons">
        <button type="submit">💾 Save</button>
        <button type="button" id="cancelCollection">❌ Cancel</button>
      </div>

  </form>

</div>
</div>

  <div class="page-container">
 

    <!--  -->
    <main class="main-content">
      <div class="profile-header">
        <div class="profile-photo">
          <img src="img/user.jpg" alt="User Photo" id="profileImage">
          <div class="edit-icon" id="editPhotoBtn">✎</div>
        </div>
        <div>
          <h1 id="displayName"><?= htmlspecialchars($user["username"]) ?></h1>
          <p id="displayEmail"><?= htmlspecialchars($user["email"]) ?></p>

        </div>
      </div>

      <form id="userForm" class="form-container">
        <div class="form-row">
          
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" value="<?= htmlspecialchars($user['email']) ?>">
          </div>
          
        </div>

        <button type="submit" class="btn-save">Save Changes</button>
        <span class="status" id="statusMsg">✔ Changes saved!</span>
      </form>

      <!-- Wishlist  -->
      <section class="wishlist-section">
        <h2>My Wishlist ❤️</h2>
        <div id="wishlist-container" class="wishlist-grid"></div>
      </section>

      <!-- My Collections -->
      <section class="collections-section" id="minhas-colecoes">
        <h2 id="myCollectionsSection">My Collections</h2>
        <div class="collections-grid" id="userCollections">
            <?php foreach ($collections as $c): ?>
            <div class="collection-card">
                <h3><?= htmlspecialchars($c["nome"]) ?></h3>
                <p><?= htmlspecialchars($c["descricao"]) ?></p>
                <small>Created: <?= $c["created_at"] ?></small>
            </div>
            <?php endforeach; ?>
        </div>
        <button class="btn-add" id="openModal">+ Create New Collection</button>
      </section>
    </main>
  </div>

  <!-- Change Photo -->
  <div id="photoModal" class="modal">
    <div class="modal-content">
      <span class="close" id="closeModal">&times;</span>
      <h3>Change Profile Picture</h3>
      <input type="file" id="photoInput" accept="image/*">
    </div>
  </div>

  <script src="js/user.js"></script>

  <footer class="footer">
    <p>© 2025 MyCollections | All rights reserved.</p>
  </footer>

</body>

</html>
