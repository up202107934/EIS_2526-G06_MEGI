<?php

require_once __DIR__ . "/partials/bootstrap.php";

if (!isset($_SESSION["id_user"])) {
    header("Location: login.php");
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $id_user = $_SESSION["id_user"];
    $nome = trim($_POST["nome"]);
    $descricao = trim($_POST["descricao"]);

    if (empty($nome)) {
        die("Collection name is required.");
    }

    $db = DB::conn();
    $stmt = $db->prepare("
        INSERT INTO collections (user_id, nome, descricao)
        VALUES (?, ?, ?)
    ");
    $stmt->bind_param("iss", $id_user, $nome, $descricao);
    $stmt->execute();

    header("Location: user.php");
    exit;
}
