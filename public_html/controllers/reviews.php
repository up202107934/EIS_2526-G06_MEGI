<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . "/../dal/ReviewDAL.php";
require_once __DIR__ . "/../partials/bootstrap.php";

header("Content-Type: application/json; charset=utf-8");

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET" && isset($_GET["event"]) && isset($_GET["collection"])) {
    echo json_encode(
        ReviewDAL::getByCollectionEvent((int)$_GET["event"], (int)$_GET["collection"])
    );
    exit;
}

if ($method === "POST") {
    if (!$isLoggedIn) {
        http_response_code(401);
        echo json_encode(["error"=>"not logged in"]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $ok = ReviewDAL::create($currentUserId, $data);

    if (!$ok) {
        http_response_code(403);
        echo json_encode(["ok"=>false, "error"=>"not allowed to review"]);
        exit;
    }

    echo json_encode(["ok"=>true]);
    exit;
}

http_response_code(400);
echo json_encode(["error"=>"bad request"]);
