<?php
require_once __DIR__ . "/../partials/bootstrap.php";
require_once __DIR__ . "/../dal/UserDAL.php";

header("Content-Type: application/json; charset=utf-8");

// 1. Só aceita POST e utilizadores logados
if ($_SERVER["REQUEST_METHOD"] !== "POST" || !isLoggedIn()) {
    http_response_code(401);
    echo json_encode(["ok" => false, "error" => "Unauthorized"]);
    exit;
}

// 2. Verifica se veio ficheiro
if (!isset($_FILES['new_photo']) || $_FILES['new_photo']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(["ok" => false, "error" => "No file uploaded"]);
    exit;
}

try {
    // 3. Preparar pasta
    $uploadDir = __DIR__ . '/../img/users/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // 4. Gerar nome único e Mover
    $ext = pathinfo($_FILES['new_photo']['name'], PATHINFO_EXTENSION);
    $filename = 'user_' . currentUserId() . '_' . uniqid() . '.' . $ext;
    $destination = $uploadDir . $filename;

    if (move_uploaded_file($_FILES['new_photo']['tmp_name'], $destination)) {
        
        // 5. Atualizar na Base de Dados
        $dbPath = 'img/users/' . $filename;
        UserDAL::updateProfileImage(currentUserId(), $dbPath);

        echo json_encode(["ok" => true, "path" => $dbPath]);
    } else {
        throw new Exception("Failed to save file");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["ok" => false, "error" => $e->getMessage()]);
}