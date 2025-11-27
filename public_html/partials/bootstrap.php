<?php
if (session_status() === PHP_SESSION_NONE) session_start();
$isLoggedIn = isset($_SESSION["id_user"]);
$currentUserId = $_SESSION["id_user"] ?? null;
