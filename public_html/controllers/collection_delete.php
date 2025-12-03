<?php
require_once __DIR__ . "/../partials/bootstrap.php";
require_once __DIR__ . "/../dal/CollectionDAL.php";

header("Content-Type: application/json; charset=utf-8");

// 1. Só aceita POST e user logado
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

// 2. Receber o ID (vem como JSON no body)
$input = json_decode(file_get_contents("php://input"), true);
$collectionId = $input["id_collection"] ?? null;

if (!$collectionId) {
    http_response_code(400);
    echo json_encode(["error" => "Missing collection ID"]);
    exit;
}

// 3. Verificar se a coleção pertence ao user (Segurança!)
$userId = currentUserId();
$collection = CollectionDAL::getById($collectionId); // Tens de ter este método no DAL

if (!$collection) {
    http_response_code(404);
    echo json_encode(["error" => "Collection not found"]);
    exit;
}

// Se a coleção não for do user atual, proibir!
// Nota: Ajusta 'id_user' se a coluna na tua BD tiver outro nome (ex: user_id)
if ($collection['id_user'] != $userId) {
    http_response_code(403);
    echo json_encode(["error" => "You don't own this collection"]);
    exit;
}

// 4. Apagar (Vais precisar de criar este método no DAL se não existir)
try {
    // Apaga a imagem de capa se existir (opcional, mas boa prática)
    if (!empty($collection['cover_img']) && file_exists(__DIR__ . "/../" . $collection['cover_img'])) {
        unlink(__DIR__ . "/../" . $collection['cover_img']);
    }

    // Apaga da BD
    // (Vou assumir que tens um método delete() no CollectionDAL. Se não tiveres, diz-me!)
    // Exemplo de query direta se não tiveres DAL method: 
    // $pdo->prepare("DELETE FROM collections WHERE id_collection = ?")->execute([$collectionId]);
    
    // O ideal é usar o DAL:
    $deleted = CollectionDAL::delete($collectionId); 

    if ($deleted) {
        echo json_encode(["ok" => true]);
    } else {
        throw new Exception("Failed to delete from DB");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>