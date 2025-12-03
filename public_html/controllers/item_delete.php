<?php
require_once __DIR__ . "/../partials/bootstrap.php";
require_once __DIR__ . "/../dal/ItemDAL.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST" || !isLoggedIn()) {
    echo json_encode(["error" => "Unauthorized"]); exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id_item'] ?? null;

$item = ItemDAL::getById($id);
if (!$item || $item['owner_id'] != currentUserId()) {
    echo json_encode(["error" => "Not allowed"]); exit;
}

if (ItemDAL::delete($id)) {
    echo json_encode(["ok" => true]);
} else {
    echo json_encode(["error" => "Failed to delete"]);
}
?>