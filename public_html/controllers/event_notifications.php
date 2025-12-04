<?php
require_once __DIR__ . "/../partials/bootstrap.php";
header("Content-Type: application/json");

// precisa de login
if (!isset($_SESSION["id_user"])) {
    http_response_code(401);
    echo json_encode(["ok" => false, "error" => "not_logged"]);
    exit;
}

$id_user = (int) $_SESSION["id_user"];

// quantos dias antes queremos avisar? (default 7)
$days = isset($_GET["days"]) ? (int) $_GET["days"] : 7;
if ($days < 1)  $days = 1;
if ($days > 30) $days = 30;

// ligação à BD
$db = DB::conn();

// eventos em que o user vai PARTICIPAR nos próximos X dias
$sql = "
    SELECT 
        e.id_event,
        e.name,
        e.event_date,
        e.location,
        DATEDIFF(e.event_date, CURDATE()) AS days_left
    FROM user_event_participation uep
    JOIN events e
      ON e.id_event = uep.id_event
    WHERE uep.id_user = ?
      AND e.event_date >= NOW()
      AND e.event_date <= DATE_ADD(NOW(), INTERVAL ? DAY)
    ORDER BY e.event_date ASC
";

if (!$stmt = $db->prepare($sql)) {
    http_response_code(500);
    echo json_encode(["ok" => false, "error" => "db_error_prepare"]);
    exit;
}

$stmt->bind_param("ii", $id_user, $days);
$stmt->execute();
$res = $stmt->get_result();
$rows = $res ? $res->fetch_all(MYSQLI_ASSOC) : [];

echo json_encode($rows);
