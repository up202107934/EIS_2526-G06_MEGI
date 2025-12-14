<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

require_once __DIR__ . "/../dal/ItemDAL.php";

// 1. PRIMEIRO: Incluir as dependências
require_once __DIR__ . "/../dal/ItemDAL.php";
require_once __DIR__ . "/../dal/CollectionItemDAL.php";

header("Content-Type: application/json; charset=utf-8");

// 2. Definir o utilizador atual (usar 0 se não houver sessão para não dar erro no SQL)
$currentUserId = $_SESSION['id_user'] ?? 0; 

// =========================
// GET ITEMS BY COLLECTION
// =========================
if (isset($_GET["collection"])) {
    $id = (int)$_GET["collection"];
    echo json_encode(ItemDAL::getByCollection($id, $currentUserId));
    exit;
}

// =========================
// GET SINGLE ITEM
// =========================
if (isset($_GET["id"])) {
    $id = (int)$_GET["id"];
    echo json_encode(ItemDAL::getById($id, $currentUserId));
    exit;
}

// =========================
// CREATE NEW ITEM (POST)
// =========================
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Check mandatory fields
    $required = ["name", "importance", "price", "weight", "acquisition_date", "id_collection"];
    foreach ($required as $field) {
        if (!isset($_POST[$field]) || $_POST[$field] === "") {
            http_response_code(400);
            echo json_encode(["error" => "Missing field: $field"]);
            exit;
        }
    }

    // ---- IMAGE UPLOAD ----
    $imagePath = null;
    if (isset($_FILES["image"]) && $_FILES["image"]["error"] === 0) {
        $ext = pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION);
        $fileName = uniqid("item_") . "." . $ext;

        $folder = __DIR__ . "/../uploads/items/";
        if (!file_exists($folder)) {
            mkdir($folder, 0777, true);
        }

        move_uploaded_file($_FILES["image"]["tmp_name"], $folder . $fileName);
        $imagePath = "/EIS_2526-G06_MEGI/public_html/uploads/items/" . $fileName;
    }

    // ---- INSERT INTO ITEMS ----
    $idItem = ItemDAL::create([
        "id_item_category" => !empty($_POST["category"]) ? $_POST["category"] : null,
        "name"             => $_POST["name"],
        "description"      => $_POST["description"] ?? "", // ADICIONA ESTA LINHA
        "img"              => $imagePath,
        "importance"       => $_POST["importance"],
        "weight"           => $_POST["weight"],
        "price"            => $_POST["price"],
        "acquisition_date" => $_POST["acquisition_date"],
        "franchise"        => $_POST["franchise"] ?? null
    ]);

    if (!$idItem) {
        http_response_code(500);
        echo json_encode(["error" => "Item not created"]);
        exit;
    }

    // ---- INSERT INTO COLLECTION_ITEMS ----
    $ok = CollectionItemDAL::add($idItem, $_POST["id_collection"]);

    echo json_encode([
        "success" => true,
        "id_item" => $idItem,
        "added_to_collection" => $ok
    ]);

    exit;
}

http_response_code(400);
echo json_encode(["error" => "missing parameter"]);
