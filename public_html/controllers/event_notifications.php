<?php
require_once __DIR__ . "/../partials/bootstrap.php";
header("Content-Type: application/json; charset=utf-8");

// precisa de login
if (!isset($_SESSION["id_user"])) {
    http_response_code(401);
    echo json_encode(["ok" => false, "error" => "not_logged"]);
    exit;
}

$id_user = (int) $_SESSION["id_user"];

// ligação à BD
$db = DB::conn();
if (!$db) {
    http_response_code(500);
    echo json_encode(["ok" => false, "error" => "no_db_connection"]);
    exit;
}

/*
 * NOTIFICAÇÕES:
 * Procura todos os eventos FUTUROS (data >= hoje) em que este user participa.
 * Usa a tabela user_event_participation.
 */
$sql = "
    SELECT 
        e.id_event,
        e.name,
        e.event_date,
        e.location,
        DATEDIFF(DATE(e.event_date), CURDATE()) AS days_left
    FROM user_event_participation uep
    INNER JOIN events e
        ON e.id_event = uep.id_event
    WHERE uep.id_user = ?
      AND DATE(e.event_date) >= CURDATE()
    ORDER BY e.event_date ASC
";

$stmt = $db->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        "ok"    => false,
        "error" => "db_prepare_error",
        "detail"=> $db->error
    ]);
    exit;
}

$stmt->bind_param("i", $id_user);
$stmt->execute();
$res = $stmt->get_result();

$rows = $res ? $res->fetch_all(MYSQLI_ASSOC) : [];

// devolve só o array de eventos
echo json_encode($rows);
