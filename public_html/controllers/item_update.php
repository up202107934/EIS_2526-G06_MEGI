<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once __DIR__ . "/../partials/bootstrap.php";
require_once __DIR__ . "/../dal/ItemDAL.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST" || !isLoggedIn()) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$id = $_POST['id_item'];
$name = $_POST['name'];
$desc = $_POST['description']; 
$rating = $_POST['importance'];
$price = $_POST['price'];
$weight = $_POST['weight'];
$date = $_POST['acquisition_date'];
$franchise = $_POST['franchise']; // Mantido (visto na imagem)

// Verificar dono
$item = ItemDAL::getById($id);
if (!$item || $item['owner_id'] != currentUserId()) {
    echo json_encode(["error" => "Not your item"]);
    exit;
}

$imgPath = null;
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . '/../img/items/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
    
    $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
    $filename = 'item_' . uniqid() . '.' . $ext;
    if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $filename)) {
        $imgPath = 'img/items/' . $filename;
    }
}


$res = ItemDAL::update(
    $id, 
    $name, 
    $desc,
    $rating, 
    $price, 
    $weight, 
    $date,
    $franchise,
    $imgPath
);

if ($res) echo json_encode(["ok" => true]);
else echo json_encode(["error" => "Update failed"]);
?>