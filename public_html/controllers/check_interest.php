<?php
require_once __DIR__ . "/../partials/bootstrap.php";

header("Content-Type: application/json");

if (!isset($_SESSION["id_user"])) {
    echo json_encode(["interested" => false]);
    exit;
}

$id_user = $_SESSION["id_user"];
$id_event = intval($_GET["event"] ?? 0);

$db = DB::conn();

$stmt = $db->prepare("
    SELECT liked FROM user_events_interest
    WHERE id_user = ? AND id_event = ?
");
$stmt->bind_param("ii", $id_user, $id_event);
$stmt->execute();
$res = $stmt->get_result();
$row = $res->fetch_assoc();

echo json_encode([
    "interested" => $row ? intval($row["liked"]) === 1 : false
]);
