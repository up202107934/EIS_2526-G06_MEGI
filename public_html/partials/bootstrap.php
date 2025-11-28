<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function isLoggedIn(): bool {
    return isset($_SESSION["id_user"]);
}

function currentUserId(): ?int {
    return $_SESSION["id_user"] ?? null;
}
