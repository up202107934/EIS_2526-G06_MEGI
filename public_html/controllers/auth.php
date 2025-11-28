<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . "/../dal/UserDAL.php";
require_once __DIR__ . "/../partials/bootstrap.php";

header("Content-Type: application/json; charset=utf-8");

$method = $_SERVER["REQUEST_METHOD"];

// ---------- LOGIN ----------
if ($method === "POST" && isset($_GET["login"])) {
    $data = json_decode(file_get_contents("php://input"), true);

    $username = trim($data["username"] ?? "");
    $password = $data["password"] ?? "";

    $user = UserDAL::getByUsername($username);
    if (!$user || !password_verify($password, $user["password"])) {
        http_response_code(401);
        echo json_encode(["ok"=>false, "error"=>"invalid credentials"]);
        exit;
    }

    $_SESSION["id_user"] = $user["id"];
    echo json_encode(["ok"=>true, "id_user"=>$user["id"], "username"=>$user["username"]]);
    exit;
}

// ---------- REGISTER ----------
if ($method === "POST" && isset($_GET["register"])) {
    $data = json_decode(file_get_contents("php://input"), true);

    // valida duplicados
    if (UserDAL::getByUsername($data["username"] ?? "")) {
        http_response_code(409);
        echo json_encode(["ok"=>false, "error"=>"username exists"]);
        exit;
    }
    if (UserDAL::getByEmail($data["email"] ?? "")) {
        http_response_code(409);
        echo json_encode(["ok"=>false, "error"=>"email exists"]);
        exit;
    }

    $ok = UserDAL::create($data);
    echo json_encode(["ok"=>$ok]);
    exit;
}

// ---------- LOGOUT ----------
if ($method === "POST" && isset($_GET["logout"])) {
    session_destroy();
    echo json_encode(["ok"=>true]);
    exit;
}

http_response_code(400);
echo json_encode(["error"=>"bad request"]);
