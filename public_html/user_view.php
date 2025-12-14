<?php
require_once __DIR__ . "/partials/bootstrap.php";

$userId = isset($_GET["id"]) ? (int) $_GET["id"] : null;
$isLoggedIn = isLoggedIn();

// --- DEFINIR SE É O DONO DO PERFIL ---
$currentUserId = $_SESSION['id_user'] ?? 0;
$isOwner = ($isLoggedIn && $userId !== null && $userId === (int)$currentUserId);

$showNavbarSearch = false;
$isPublic = !$isLoggedIn && isset($_GET["public"]) && $_GET["public"] === "1";

$user = $userId ? UserDAL::getById($userId) : null;
$collections = $user ? CollectionDAL::getByUserFull($userId) : [];
// ... resto do seu código

if (!$user) {
    http_response_code(404);
}

$collectionsCount = $collections ? count($collections) : 0;
$itemsCount = 0;
foreach ($collections as $c) {
    $itemsCount += (int) ($c["item_count"] ?? 0);
}

$memberSince = (!empty($user["date_of_joining"]))
    ? date("F Y", strtotime($user["date_of_joining"]))
    : null;
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>User Profile | My Collections</title>
  <link rel="stylesheet" href="css/style.css" />
  <link rel="stylesheet" href="css/user_view.css" />
</head>



<body>

  
  <?php require_once __DIR__ . "/partials/navbar.php"; ?>

  <!-- ===== CONTEÚDO DA PÁGINA ===== -->
  <div class="page-container">
    <main class="main-content">
      <div class="profile-header">
        <div class="profile-photo">
          <?php if (!empty($user["profile_img"])): ?>
            <img src="<?= htmlspecialchars($user["profile_img"]) ?>" alt="User Photo">
          <?php else: ?>
            <div class="profile-photo-placeholder">
              <?= $user ? strtoupper(substr($user["username"], 0, 1)) : "?" ?>
            </div>
          <?php endif; ?>
        </div>

        <div class="profile-meta">
          <h1 id="userName"><?= htmlspecialchars($user["name"] ?? $user["username"] ?? "User") ?></h1>
          <?php if (!empty($user["email"])): ?>
            <p id="userEmail"><?= htmlspecialchars($user["email"]) ?></p>
          <?php endif; ?>
          <p class="user-extra-line">
            Collector <?= $memberSince ? "· Member since " . htmlspecialchars($memberSince) : "" ?>
          </p>

          <div class="user-stats">
            <div class="user-stat">
              <span id="statCollections" class="user-stat-number"><?= $collectionsCount ?></span>
              <span class="user-stat-label">Collections</span>
            </div>
            <div class="user-stat">
              <span id="statItems" class="user-stat-number"><?= $itemsCount ?></span>
              <span class="user-stat-label">Items</span>
            </div>
          </div>
        </div>
      </div>

      <!-- My Collections -->
      <section class="collections-section">
        <div class="collections-header">
          <h2><?= $isOwner ? "My Collections" : htmlspecialchars($user["name"] ?? $user["username"]) . "'s Collections" ?></h2>

          <form id="collectionsSearchForm" class="collections-search" action="#" method="get">
            <input
              type="search"
              id="collectionsSearchInput"
              name="q"
              placeholder="Search collections..."
              aria-label="Search collections"
            />
            <button type="submit" aria-label="Run collection search">🔎</button>
          </form>
        </div>
        <?php if (!$user): ?>
          <p style="color:#b22222;">User not found.</p>
        <?php elseif (empty($collections)): ?>
          <p style="color:#777;">This user has not created any collections yet.</p>
        <?php else: ?>
          <div class="collections-grid">
            <?php foreach ($collections as $collection): ?>
              <?php
                $cover = !empty($collection["cover_img"]) ? $collection["cover_img"] : "img/collection-placeholder.jpg";
                $catName = $collection["category_name"] ?? "General";
                $items = (int) ($collection["item_count"] ?? 0);
                $rateValue = (float) ($collection["rate"] ?? 0);
                $rate = rtrim(rtrim(number_format($rateValue, 1, '.', ''), '0'), '.');
                $creationDate = !empty($collection["creation_date"]) ? substr($collection["creation_date"], 0, 10) : "";
                $collectionLink = "collection.php?id=" . $collection["id_collection"];
                $searchData = trim((string) ($collection["name"] ?? "") . " " . $catName . " " . ($collection["description"] ?? ""));
              ?>
              <div class="collection-card" data-searchable="<?= htmlspecialchars($searchData) ?>">
                <div class="collection-cover">
                  <img src="<?= htmlspecialchars($cover) ?>" alt="<?= htmlspecialchars($collection["name"]) ?>">
                  <span class="rate-badge">⭐ <?= htmlspecialchars($rate) ?></span>
                </div>

                <h3><?= htmlspecialchars($collection["name"]) ?></h3>
                <span class="category-badge"><?= htmlspecialchars($catName) ?></span>

                <?php if (!empty($collection["description"])): ?>
                  <p><?= htmlspecialchars(substr($collection["description"], 0, 80)) ?><?= strlen($collection["description"]) > 80 ? "..." : "" ?></p>
                <?php endif; ?>

                <p class="user-extra-line" style="margin-top:auto;">Created: <?= htmlspecialchars($creationDate) ?></p>
                <p class="user-extra-line">Items: <?= $items ?></p>

                <a href="<?= htmlspecialchars($collectionLink) ?>" class="btn-view">View Collection</a>
              </div>
            <?php endforeach; ?>
          </div>
        <p id="collectionsEmptyState" class="empty-state" style="display:none;">No collections match your search.</p>  
        <?php endif; ?>
      </section>
    </main>
  </div>
  
  <footer class="footer">
    <p>© 2025 MyCollections | All rights reserved.</p>
  </footer>

  <script src="js/navbar.js"></script>
  <script src="js/user_view.js"></script>


  

</body>
</html>
