<?php
require_once __DIR__ . "/../partials/bootstrap.php";
require_once __DIR__ . "/../dal/CollectionDAL.php";

header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}


if (!isLoggedIn()) {
    http_response_code(401);
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$collectionId = $_POST["id_collection"] ?? null;

if (!$collectionId) {
    http_response_code(400);
    echo json_encode(["error" => "Missing collection ID"]);
    exit;
}

$collection = CollectionDAL::getById($collectionId);
$userId = currentUserId();

if (!$collection) {
    http_response_code(404);
    echo json_encode(["error" => "Collection not found"]);
    exit;
}

if ($collection["id_user"] != $userId) {
    http_response_code(403);
    echo json_encode(["error" => "You don't own this collection"]);
    exit;
}

if (!isset($_FILES["cover_img"]) || $_FILES["cover_img"]["error"] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(["error" => "No image uploaded"]);
    exit;
}

$uploadDir = __DIR__ . '/../img/covers/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$ext = pathinfo($_FILES['cover_img']['name'], PATHINFO_EXTENSION);
$filename = 'col_' . uniqid() . '.' . $ext;
$targetPath = $uploadDir . $filename;

if (!move_uploaded_file($_FILES['cover_img']['tmp_name'], $targetPath)) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to save image"]);
    exit;
}

$newPath = 'img/covers/' . $filename;

if (!empty($collection['cover_img']) && file_exists(__DIR__ . "/../" . $collection['cover_img'])) {
    unlink(__DIR__ . "/../" . $collection['cover_img']);
}

$updated = CollectionDAL::updateCover((int)$collectionId, $userId, $newPath);

if ($updated) {
    echo json_encode(["ok" => true, "cover_img" => $newPath]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Database update failed"]);
}