<?php
require_once __DIR__ . "/../partials/bootstrap.php";

if (!isset($_SESSION["id_user"])) {
    echo json_encode(["success" => false, "error" => "not_logged"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$id_user = $_SESSION["id_user"];
$id_event = intval($input["id_event"] ?? 0);

if ($id_event <= 0) {
    echo json_encode(["success" => false, "error" => "invalid_event"]);
    exit;
}

$db = DB::conn();

// APAGAR PARTICIPAÇÃO
$stmt = $db->prepare("
    DELETE FROM user_event_participation
    WHERE id_user = ? AND id_event = ?
");
$stmt->bind_param("ii", $id_user, $id_event);
$stmt->execute();

echo json_encode(["success" => true]);
