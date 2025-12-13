<?php
require_once __DIR__ . "/../partials/bootstrap.php";
require_once __DIR__ . "/../dal/EventDAL.php";

header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["ok" => false, "error" => "method not allowed"]);
    exit;
}

if (!isLoggedIn()) {
    http_response_code(401);
    echo json_encode(["ok" => false, "error" => "not logged in"]);
    exit;
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$id_event = isset($data["id_event"]) ? (int)$data["id_event"] : 0;

if ($id_event <= 0) {
    http_response_code(400);
    echo json_encode(["ok" => false, "error" => "missing id_event"]);
    exit;
}

$id_user = (int)$_SESSION["id_user"];
$result  = EventDAL::deleteEvent($id_event, $id_user);

if ($result["ok"] ?? false) {
    echo json_encode(["ok" => true]);
    exit;
}

http_response_code(403);
echo json_encode(["ok" => false, "error" => $result["error"] ?? "delete_failed"]);