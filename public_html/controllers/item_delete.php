<?php
require_once __DIR__ . "/../partials/bootstrap.php";
require_once __DIR__ . "/../dal/CollectionDAL.php";
require_once __DIR__ . "/../dal/CollectionItemDAL.php";

header("Content-Type: application/json");

// apenas POST + user logado
if ($_SERVER["REQUEST_METHOD"] !== "POST" || !isLoggedIn()) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$id_item = $data["id_item"] ?? null;
$id_collection = $data["id_collection"] ?? null;

if (!$id_item) {
    echo json_encode(["error" => "Missing item ID"]);
    exit;
}

// 🔹 CASO 1 — remover da coleção
if ($id_collection) {

    // verificar se coleção pertence ao user
    $collection = CollectionDAL::getById($id_collection);

    if (!$collection || $collection["id_user"] != currentUserId()) {
        echo json_encode(["error" => "Not allowed"]);
        exit;
    }

    $ok = CollectionItemDAL::remove($id_collection, $id_item);
    echo json_encode(["ok" => $ok, "mode" => "collection"]);
    exit;
}

// 🔹 CASO 2 — veio da página item.php
// NÃO removemos o item da base de dados (como pediste!)
// apenas sinalizamos sucesso para o JS fazer redirect

echo json_encode([
    "ok" => true,
    "mode" => "item_page"
]);
exit;
