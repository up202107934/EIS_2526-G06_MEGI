<?php

session_start();
echo json_encode($_SESSION);
exit;

require_once __DIR__ . "/../dal/CollectionDAL.php";
header("Content-Type: application/json; charset=utf-8");

// -------- GET --------
if ($_SERVER["REQUEST_METHOD"] === "GET") {

    // MODO MINHAS COLEÇÕES (para events, user page, etc.)
    if (isset($_GET["mine"]) && $_GET["mine"] == "1") {

        if (!isset($_SESSION["id_user"])) {
            http_response_code(401);
            echo json_encode(["error" => "not logged in"]);
            exit;
        }

        $id_user = (int)$_SESSION["id_user"];
        echo json_encode(CollectionDAL::getByUser($id_user));
        exit;
    }

    // MODO GLOBAL (para HOME)
    echo json_encode(CollectionDAL::getAll());
    exit;
}

// -------- POST (criar coleção) --------
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    if (!isset($_SESSION["id_user"])) {
        http_response_code(401);
        echo json_encode(["ok"=>false, "error"=>"not logged in"]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data["name"], $data["id_collection_category"], $data["creation_date"])) {
        http_response_code(400);
        echo json_encode(["ok"=>false, "error"=>"missing fields"]);
        exit;
    }

    $id_user = (int)$_SESSION["id_user"];

    $newId = CollectionDAL::create(
        $id_user,
        (int)$data["id_collection_category"],
        $data["name"],
        $data["creation_date"]
    );

    echo json_encode(["ok"=>true, "id_collection"=>$newId]);
    exit;
}

http_response_code(405);
echo json_encode(["error"=>"method not allowed"]);
