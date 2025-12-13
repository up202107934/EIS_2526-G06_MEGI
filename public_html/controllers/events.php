<?php
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../partials/bootstrap.php";
require_once __DIR__ . "/../dal/EventDAL.php";

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {

    // Se vier coleção, filtra pelos relacionamentos
    if (isset($_GET["collection"])) {
        $idCollection = (int) $_GET["collection"];
        $events = EventDAL::getByCollection($idCollection);
    } else {
        //Caso geral (ex: página de eventos)
        $events = EventDAL::getAll();
    }

    echo json_encode($events);
    exit;
}


/**
 * A partir daqui (POST/PUT/DELETE) é preciso login
 */
if (!isLoggedIn()) {
    http_response_code(401);
    echo json_encode(["ok" => false, "error" => "login required"]);
    exit;
}

$id_user = (int)$_SESSION["id_user"];

/**
 * Lê o JSON enviado no body
 */
$raw  = file_get_contents("php://input");
$data = json_decode($raw, true) ?? [];

/**
 * POST → criar evento
 */
if ($method === "POST") {

    $name        = trim($data["name"]        ?? "");
    $event_date  = trim($data["event_date"]  ?? "");
    $description = trim($data["description"] ?? "") ?: null;
    $location    = trim($data["location"]    ?? "") ?: null;

    $collections = $data["collections"] ?? [];
    $items       = $data["items"]       ?? [];
  
    
    if (!$name || !$event_date) {
        echo json_encode(["ok" => false, "error" => "missing name/event_date"]);
        exit;
    }
    
     if (empty($collections) || empty($items)) {
        http_response_code(400);
        echo json_encode(["ok" => false, "error" => "missing collections/items"]);
        exit;
    }


    // cria já com created_by
    $resp = EventDAL::create($name, $event_date, $description, $location, $id_user);


    if (!$resp["ok"]) {
        http_response_code(500);
        echo json_encode($resp);
        exit;
    }

    $id_event = (int)$resp["id_event"];

    EventDAL::addCollectionsToEvent($id_event, $collections);
    EventDAL::addItemsToEvent($id_event, $items);

    echo json_encode(["ok" => true, "id_event" => $id_event]);
    exit;
}

/**
 * PUT → editar (apenas se created_by = user)
 */
if ($method === "PUT") {
    $id_event    = (int)($data["id_event"] ?? 0);
    $name        = trim($data["name"]        ?? "");
    $event_date  = trim($data["event_date"]  ?? "");
    $description = trim($data["description"] ?? "") ?: null;
    $location    = trim($data["location"]    ?? "") ?: null;

    if (!$id_event || !$name || !$event_date) {
        echo json_encode(["ok" => false, "error" => "missing id/name/date"]);
        exit;
    }

    $resp = EventDAL::updateEvent($id_event, $name, $event_date, $description, $location, $id_user);

    echo json_encode($resp);
    exit;
}

/**
 * DELETE → apagar (apenas se created_by = user)
 */
if ($method === "DELETE") {
    $id_event = (int)($data["id_event"] ?? 0);

    if (!$id_event) {
        echo json_encode(["ok" => false, "error" => "missing id_event"]);
        exit;
    }

    $resp = EventDAL::deleteEvent($id_event, $id_user);
    echo json_encode($resp);
    exit;
}

http_response_code(405);
echo json_encode(["ok" => false, "error" => "method not allowed"]);
