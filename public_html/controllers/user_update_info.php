<?php
require_once __DIR__ . "/../partials/bootstrap.php";
require_once __DIR__ . "/../dal/UserDAL.php";

header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST" || !isLoggedIn()) {
    echo json_encode(["error" => "Unauthorized"]); exit;
}

// Receber dados de texto
$name     = $_POST['name'] ?? '';
$username = $_POST['username'] ?? '';
$email    = $_POST['email'] ?? '';
$dob      = $_POST['date_of_birth'] ?? null;

if (empty($dob)) $dob = null;

if (!$name || !$username || !$email) {
    echo json_encode(["error" => "Name, Username and Email are required"]);
    exit;
}

$id_user = currentUserId();

// Chama a função updateInfo (que criámos no DAL)
if (UserDAL::updateInfo($id_user, $name, $username, $email, $dob)) {
    $_SESSION['username'] = $username; // Atualiza a sessão
    echo json_encode(["ok" => true]);
} else {
    echo json_encode(["error" => "Database update failed"]);
}
?>