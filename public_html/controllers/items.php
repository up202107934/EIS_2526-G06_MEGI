<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . "/../dal/ItemDAL.php";
header("Content-Type: application/json; charset=utf-8");

if (isset($_GET["collection"])) {
    $id = (int)$_GET["collection"];
    echo json_encode(ItemDAL::getByCollection($id));
    exit;
}

if (isset($_GET["id"])) {
    $id = (int)$_GET["id"];
    echo json_encode(ItemDAL::getById($id));
    exit;
}

http_response_code(400);
echo json_encode(["error" => "missing parameter"]);
