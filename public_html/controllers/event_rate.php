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

// ligação à BD (MESMO padrão que event_participate.php)
$db = DB::conn();

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $eventId = isset($_GET["event"]) ? (int) $_GET["event"] : 0;

    if (!$eventId) {
        http_response_code(400);
        echo json_encode(["ok" => false, "error" => "missing_event"]);
        exit;
    }

    // coleções associadas ao EVENTO (event_collections), não só as do user
    $sql = "
        SELECT ec.id_collection, c.name
        FROM event_collections ec
        JOIN collections c
          ON c.id_collection = ec.id_collection
        WHERE ec.id_event = ?
    ";

    if (!$stmt = $db->prepare($sql)) {
        http_response_code(500);
        echo json_encode(["ok" => false, "error" => "db_error_prepare"]);
        exit;
    }

    $stmt->bind_param("i", $eventId);
    $stmt->execute();
    $res  = $stmt->get_result();
    $cols = $res ? $res->fetch_all(MYSQLI_ASSOC) : [];

    echo json_encode($cols);
    exit;
}


// ------------------------------------------------------
// POST  /controllers/event_rate.php
// body: { id_event, id_collection, rate, comment }
// ------------------------------------------------------
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true) ?? [];

    $id_event      = isset($data["id_event"])      ? (int) $data["id_event"]      : 0;
    $id_collection = isset($data["id_collection"]) ? (int) $data["id_collection"] : 0;
    $rate          = isset($data["rate"])          ? (int) $data["rate"]          : 0;
    $comment       = trim($data["comment"] ?? "");

    if (!$id_event || !$id_collection || $rate < 1 || $rate > 5) {
        http_response_code(400);
        echo json_encode(["ok" => false, "error" => "invalid_data"]);
        exit;
    }

    // 1) obter data do evento
    $stmt = $db->prepare("SELECT event_date FROM events WHERE id_event = ?");
    $stmt->bind_param("i", $id_event);
    $stmt->execute();
    $res  = $stmt->get_result();
    $event = $res ? $res->fetch_assoc() : null;

    if (!$event) {
        http_response_code(404);
        echo json_encode(["ok" => false, "error" => "event_not_found"]);
        exit;
    }

    // 2) só permitir rating em eventos PASSADOS
    $eventDate = new DateTime($event["event_date"]);
    $today     = new DateTime("today");

    if ($eventDate >= $today) {
        http_response_code(400);
        echo json_encode(["ok" => false, "error" => "event_not_past"]);
        exit;
    }

    // 3) garantir que o user participou nesse evento com essa coleção
    $stmt = $db->prepare("
        SELECT 1
        FROM user_event_participation
        WHERE id_user = ? AND id_event = ? AND id_collection = ?
        LIMIT 1
    ");
    $stmt->bind_param("iii", $id_user, $id_event, $id_collection);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 0) {
        http_response_code(403);
        echo json_encode(["ok" => false, "error" => "not_participating_with_collection"]);
        exit;
    }

    // 4) ver se já existe review (um rating por user+evento+coleção)
    $stmt = $db->prepare("
        SELECT id_review
        FROM collection_event_reviews
        WHERE id_user = ? AND id_event = ? AND id_collection = ?
        LIMIT 1
    ");
    $stmt->bind_param("iii", $id_user, $id_event, $id_collection);
    $stmt->execute();
    $res  = $stmt->get_result();
    $existing = $res ? $res->fetch_assoc() : null;

    if ($existing) {
        // UPDATE
        $stmt = $db->prepare("
            UPDATE collection_event_reviews
            SET rate = ?, comment = ?, review_date = NOW()
            WHERE id_review = ?
        ");
        $id_review = (int) $existing["id_review"];
        $stmt->bind_param("isi", $rate, $comment, $id_review);
        $stmt->execute();
    } else {
        // INSERT
        $stmt = $db->prepare("
            INSERT INTO collection_event_reviews
                (id_user, id_event, id_collection, rate, comment, review_date)
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
        $stmt->bind_param("iiiis", $id_user, $id_event, $id_collection, $rate, $comment);
        $stmt->execute();
    }

    echo json_encode(["ok" => true]);
    exit;
}

// método inválido
http_response_code(405);
echo json_encode(["ok" => false, "error" => "invalid_method"]);
