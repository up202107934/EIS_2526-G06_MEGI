<?php
require_once __DIR__ . "/../partials/bootstrap.php";

if (!isset($_SESSION["id_user"])) {
    echo json_encode(["ok"=>false, "err"=>"not_logged"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$id_user = $_SESSION["id_user"];
$id_event = intval($data["id_event"]);
$id_collection = intval($data["id_collection"]);
$items = $data["items"] ?? [];

$db = DB::conn();

// Inserir participação
$stmt = $db->prepare("
    INSERT INTO user_event_participation (id_user, id_event, id_collection)
    VALUES (?, ?, ?)
");
$stmt->bind_param("iii", $id_user, $id_event, $id_collection);
$stmt->execute();

$id_participation = $db->insert_id;

// Inserir itens selecionados
$stmt2 = $db->prepare("
    INSERT INTO user_event_items (id_participation, id_item)
    VALUES (?, ?)
");

foreach ($items as $item) {
    $iid = intval($item);
    $stmt2->bind_param("ii", $id_participation, $iid);
    $stmt2->execute();
}

echo json_encode(["ok"=>true]);
