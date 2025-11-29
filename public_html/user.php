<?php
require_once __DIR__ . "/partials/bootstrap.php";
require_once __DIR__ . "/dal/CollectionDAL.php";
require_once __DIR__ . "/dal/UserDAL.php";


// 1. Segurança
if (!isset($_SESSION["id_user"])) {
    header("Location: login.php");
    exit;
}

// 2. Buscar dados
$userId = $_SESSION["id_user"];
$collections = CollectionDAL::getByUser($userId);
$user = UserDAL::getById($userId);
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>User Profile | My Collections</title>
  <link rel="stylesheet" href="css/style.css" />
  <link rel="stylesheet" href="css/user.css" />
</head>
<body>

  <nav class="navbar">
    
    <div class="navbar-logo">
      <a href="home.php">MyCollections</a>
    </div>

    <div class="navbar-links">
      <a href="home.php" class="nav-link">Home</a>
      <a href="events.php" class="nav-link">Events</a>
      <a href="user.php" class="nav-link nav-link-active">My Collections</a>
    </div>

    <div class="navbar-actions">
        
        <a href="controllers/auth.php?logout=1" class="nav-link" style="font-size: 14px; color: #ff6b6b;">Logout</a>

        <div class="navbar-avatar-wrapper">
            <div class="navbar-avatar" style="background-color: #B22222; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                <?= strtoupper(substr($user['username'], 0, 1)) ?>
            </div>
        </div>

    </div>
  </nav>
  <div class="page-container">
    <main class="main-content">
      
      <div class="profile-header">
        
        <div class="profile-photo">
            <?php if (!empty($user['profile_img'])): ?>
                <img src="<?= htmlspecialchars($user['profile_img']) ?>" alt="User Profile" 
                     style="width:100%; height:100%; object-fit:cover; border-radius:50%;">
            <?php else: ?>
                <?= strtoupper(substr($user['username'], 0, 1)) ?>
            <?php endif; ?>

            <div class="edit-icon" id="editPhotoBtn">📷</div>
        </div>
        
        <div class="profile-info">
            <h1 id="displayName"><?= htmlspecialchars($user["username"]) ?></h1>
            <p id="displayEmail"><?= htmlspecialchars($user["email"]) ?></p>
            
            <div style="margin-top:10px; color: #555;">
                <strong><?= count($collections) ?></strong> Collections Created
            </div>
        </div>
      </div>

      <section class="collections-section" id="minhas-colecoes">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h2>My Collections</h2>
            <button class="btn-add" id="openModal">+ Create New</button>
        </div>

        <?php if (empty($collections)): ?>
            <p style="text-align:center; color:#777; margin-top: 40px;">You haven't created any collections yet.</p>
        <?php else: ?>
            
            <div class="collections-grid">
                <?php foreach ($collections as $c): ?>
                    <?php 
                        $img = !empty($c['cover_img']) ? $c['cover_img'] : "img/collection-placeholder.jpg";
                        $rate = $c['rate'] ?? 0;
                        $catName = $c['category_name'] ?? 'General';
                    ?>
                    
                    <div class="collection-card">
                        <div style="position:relative;">
                            <img src="<?= htmlspecialchars($img) ?>" alt="Cover">
                            <span class="rate-badge">⭐ <?= $rate ?></span>
                        </div>

                        <h3><?= htmlspecialchars($c["name"]) ?></h3>
                        <span class="category-badge"><?= htmlspecialchars($catName) ?></span>
                        
                        <?php if (!empty($c['description'])): ?>
                            <p><?= htmlspecialchars(substr($c['description'], 0, 50)) ?>...</p>
                        <?php endif; ?>
                        
                        <p style="font-size:0.8rem; margin-top: auto;">
                            Created: <?= htmlspecialchars(substr($c["creation_date"], 0, 10)) ?>
                        </p>

                        <a href="collection.php?id=<?= $c['id_collection'] ?>" class="btn" style="display:block; text-align:center; background:#3498db; color:white; padding:8px; text-decoration:none; border-radius:4px; margin-top:10px;">Manage</a>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
      </section>

    </main>
  </div>

  
   <div id="photoModal" class="modal">
    <div class="modal-content" style="max-width: 350px; text-align: center;">
      <h3>Change Profile Photo</h3>
      
      <div style="width: 150px; height: 150px; margin: 10px auto; border-radius: 50%; overflow: hidden; background: #eee; border: 3px solid #B22222;">
         <img id="newPhotoPreview" src="" alt="" style="width: 100%; height: 100%; object-fit: cover; display: none;">
         <span id="newPhotoPlaceholder" style="line-height: 150px; color: #999;">Preview</span>
      </div>

      <input type="file" id="photoInput" accept="image/*" style="margin-top: 15px;">

      <div class="modal-buttons" style="justify-content: center; gap: 10px; margin-top: 20px;">
        <button id="savePhotoBtn" class="btn" style="background:#2ecc71; color:white;">💾 Save Photo</button>
        <button id="cancelPhotoBtn" class="btn" style="background:#e74c3c; color:white;">❌ Cancel</button>
      </div>
    </div>
  </div>
    
  <script src="js/user.js"></script>

  <footer class="footer">
    <p>© 2025 MyCollections | All rights reserved.</p>
  </footer>

</body>
</html>