<?php
require_once __DIR__ . "/../partials/bootstrap.php";
require_once __DIR__ . "/../dal/UserDAL.php";

header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST" || !isLoggedIn()) {
    echo json_encode(["ok" => false, "error" => "Unauthorized"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$current  = $data["current"] ?? "";
$newPass  = $data["newPass"] ?? "";
$confirm  = $data["confirm"] ?? "";

// 1️⃣ campos obrigatórios
if (!$current || !$newPass || !$confirm) {
    echo json_encode(["ok" => false, "error" => "Missing fields"]);
    exit;
}

// 2️⃣ user
$id = currentUserId();
$user = UserDAL::getById($id);

if (!$user) {
    echo json_encode(["ok" => false, "error" => "User not found"]);
    exit;
}

// 3️⃣ PRIORIDADE ABSOLUTA → current password
if (!password_verify($current, $user["password_hash"])) {
    echo json_encode(["ok" => false, "error" => "Current password incorrect"]);
    exit;
}

// 4️⃣ novas passwords iguais
if ($newPass !== $confirm) {
    echo json_encode(["ok" => false, "error" => "New passwords do not match"]);
    exit;
}

// 5️⃣ regras da password
if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/', $newPass)) {
    echo json_encode([
        "ok" => false,
        "error" => "Password must have at least 8 characters, including uppercase, lowercase, number and symbol"
    ]);
    exit;
}

// 6️⃣ atualizar
$hash = password_hash($newPass, PASSWORD_DEFAULT);

if (UserDAL::updatePassword($id, $hash)) {
    echo json_encode(["ok" => true]);
} else {
    echo json_encode(["ok" => false, "error" => "Database error"]);
}
