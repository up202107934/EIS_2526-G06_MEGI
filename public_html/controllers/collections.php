<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . "/../dal/CollectionDAL.php";
require_once __DIR__ . "/../partials/bootstrap.php";

header("Content-Type: application/json; charset=utf-8");

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {

    // Ex.: GET /controllers/collections.php?id=3
    if (isset($_GET["id"])) {
        $id = (int)$_GET["id"];
        echo json_encode(CollectionDAL::getById($id));
        exit;
    }

    // Ex.: GET /controllers/collections.php?mine=1
    if (isset($_GET["mine"]) && $isLoggedIn) {
        echo json_encode(CollectionDAL::getByUser($currentUserId));
        exit;
    }

    // Ex.: GET /controllers/collections.php
    echo json_encode(CollectionDAL::getAll());
    exit;
}

if ($method === "POST") {

    if (!$isLoggedIn) {
        http_response_code(401);
        echo json_encode(["error" => "not logged in"]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    $ok = CollectionDAL::create($data, $currentUserId);

    echo json_encode(["ok" => $ok]);
    exit;
}

http_response_code(405);
echo json_encode(["error" => "method not allowed"]);
