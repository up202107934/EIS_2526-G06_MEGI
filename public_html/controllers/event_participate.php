<?php
require_once __DIR__ . "/../partials/bootstrap.php";

header("Content-Type: application/json; charset=utf-8");

if (!isset($_SESSION["id_user"])) {
    echo json_encode(["ok" => false, "err" => "not_logged"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true) ?? [];

$id_user     = (int)$_SESSION["id_user"];
$id_event    = isset($data["id_event"]) ? (int)$data["id_event"] : 0;
$collections = $data["collections"] ?? [];
$items       = $data["items"] ?? [];

if (!$id_event || !is_array($collections) || !count($collections)) {
    echo json_encode(["ok" => false, "err" => "missing_data"]);
    exit;
}

$db = DB::conn();
$db->set_charset("utf8mb4");

$participations = [];

/* ==============================
   1) PREPARE STATEMENTS
   ============================== */

// user_event_participation
$stmt = $db->prepare("
    INSERT INTO user_event_participation (id_user, id_event, id_collection)
    VALUES (?, ?, ?)
");
if (!$stmt) {
    echo json_encode(["ok" => false, "err" => "stmt1: " . $db->error]);
    exit;
}

// event_collections – garante que a coleção aparece na info do evento
$stmtEC = $db->prepare("
    INSERT IGNORE INTO event_collections (id_event, id_collection)
    VALUES (?, ?)
");
if (!$stmtEC) {
    echo json_encode(["ok" => false, "err" => "stmtEC: " . $db->error]);
    exit;
}

/* ==============================
   2) CRIAR PARTICIPAÇÕES + LIGAR COLEÇÕES AO EVENTO
   ============================== */

foreach ($collections as $cid) {
    $cid = (int)$cid;
    if (!$cid) continue;

    if (isset($participations[$cid])) continue;

    // 2.1) garantir que a coleção aparece em event_collections
    $stmtEC->bind_param("ii", $id_event, $cid);
    if (!$stmtEC->execute()) {
        echo json_encode(["ok" => false, "err" => "execEC: " . $stmtEC->error]);
        exit;
    }

    // 2.2) registar participação do user com essa coleção
    $stmt->bind_param("iii", $id_user, $id_event, $cid);
    if (!$stmt->execute()) {
        echo json_encode(["ok" => false, "err" => "exec1: " . $stmt->error]);
        exit;
    }

    $participations[$cid] = $db->insert_id;
}

$stmt->close();
$stmtEC->close();

/* ==============================
   3) ITENS ESCOLHIDOS
   ============================== */

if (!empty($items)) {
    $stmt2 = $db->prepare("
        INSERT INTO user_event_items (id_participation, id_item)
        VALUES (?, ?)
    ");

    if (!$stmt2) {
        echo json_encode(["ok" => false, "err" => "stmt2: " . $db->error]);
        exit;
    }

    foreach ($items as $it) {
        $iid = isset($it["id_item"]) ? (int)$it["id_item"] : 0;
        $cid = isset($it["id_collection"]) ? (int)$it["id_collection"] : 0;

        if (!$iid || !$cid) continue;
        if (!isset($participations[$cid])) continue;

        $id_participation = $participations[$cid];
        $stmt2->bind_param("ii", $id_participation, $iid);
        if (!$stmt2->execute()) {
            echo json_encode(["ok" => false, "err" => "exec2: " . $stmt2->error]);
            exit;
        }
    }

    $stmt2->close();
}

echo json_encode(["ok" => true]);
