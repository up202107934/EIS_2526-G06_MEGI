<?php
// partials/navbar.php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once __DIR__ . "/../dal/UserDAL.php";

$isLoggedIn = isset($_SESSION['id_user']);
$navbarUser = null;
$showNavbarSearch = $showNavbarSearch ?? true;

if ($isLoggedIn) {
    $navbarUser = UserDAL::getById($_SESSION['id_user']);
}
?>

<header class="navbar">
  <div class="navbar-logo">
    <a href="home.php">MyCollections</a>
  </div>

  <nav class="navbar-center">
    <a href="events.php">Events</a>
    <?php if ($isLoggedIn): ?>
      <a href="user.php#myCollectionsSection">My Collections</a>
    <?php endif; ?>
    <a href="team.php">Team</a>
  </nav>

  <div class="navbar-right">
    <?php if ($showNavbarSearch): ?>
      <form class="navbar-search" id="searchForm" action="#" method="GET">
        <input type="text" id="searchInput" name="q" placeholder="Search..." required />
        <button type="submit" class="search-btn">🔎</button>
      </form>
    <?php endif; ?>

    <?php if ($isLoggedIn && $navbarUser): ?>
      <div class="navbar-user">
        
        <?php if (!empty($navbarUser['profile_img'])): ?>
            <img src="<?= htmlspecialchars($navbarUser['profile_img']) ?>" alt="User" class="navbar-avatar" id="avatarButton">
        <?php else: ?>
            <div class="navbar-avatar-letter" id="avatarButton">
                <?= strtoupper(substr($navbarUser['username'], 0, 1)) ?>
            </div>
        <?php endif; ?>

        <div class="profile-dropdown" id="profileDropdown">
            <div style="padding: 10px 15px; border-bottom:1px solid #eee; font-size:0.9em; color:#666;">
                Signed in as <strong><?= htmlspecialchars($navbarUser['username']) ?></strong>
            </div>
            <a href="user.php">👤 Ver Perfil</a>
            <a href="controllers/auth.php?logout=1">🚪 Log Out</a>
        </div>
      </div>
    <?php else: ?>
      <a href="login.php" class="signin-chip">Sign in</a>
    <?php endif; ?>

    <button id="themeToggle" class="theme-toggle">🌙</button>
  </div>
</header>