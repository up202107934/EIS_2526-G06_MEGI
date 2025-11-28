<?php
header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . "/../dal/EventDAL.php";

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
    echo json_encode(EventDAL::getAll());
    exit;
}

if ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    $name        = $data["name"] ?? "";
    $event_date  = $data["event_date"] ?? "";
    $description = $data["description"] ?? null;
    $location    = $data["location"] ?? null;

    $collections = $data["collections"] ?? [];
    $items       = $data["items"] ?? [];

    if (!$name || !$event_date) {
        echo json_encode(["ok"=>false, "error"=>"missing name/event_date"]);
        exit;
    }

    $resp = EventDAL::create($name, $event_date, $description, $location);

    if (!$resp["ok"]) {
        echo json_encode($resp);
        exit;
    }

    $id_event = $resp["id_event"];

    EventDAL::addCollectionsToEvent($id_event, $collections);
    EventDAL::addItemsToEvent($id_event, $items);

    echo json_encode(["ok"=>true, "id_event"=>$id_event]);
    exit;
}

http_response_code(405);
echo json_encode(["ok"=>false, "error"=>"method not allowed"]);
