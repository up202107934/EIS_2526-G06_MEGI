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

    if (!$user || !password_verify($password, $user["password_hash"])) {
        http_response_code(401);
        echo json_encode(["ok"=>false, "error"=>"invalid credentials"]);
        exit;
    }

    $_SESSION["id_user"] = $user["id_user"];
    
    // (Opcional) Também aqui no JSON de resposta, se usares no JS:
    echo json_encode([
        "ok"=>true, 
        "id_user"=>$user["id_user"], 
        "username"=>$user["username"]
    ]);
    exit;
}

// ---------- REGISTER ----------
if ($method === "POST" && isset($_GET["register"])) {
    ini_set('display_errors', 0);

    try {
        // Agora recebemos via POST/FILES (FormData), não JSON raw
        $username = $_POST['username'] ?? '';
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';

        if (!$username || !$email || !$password) {
            throw new Exception("Please fill all fields");
        }

        // Validações
        if (UserDAL::getByUsername($username)) {
            http_response_code(409);
            echo json_encode(["ok"=>false, "error"=>"Username exists"]);
            exit;
        }
        if (UserDAL::getByEmail($email)) {
            http_response_code(409);
            echo json_encode(["ok"=>false, "error"=>"Email exists"]);
            exit;
        }

        // --- UPLOAD DA FOTO DE PERFIL ---
        $imagePath = null;
        if (isset($_FILES['profile_img']) && $_FILES['profile_img']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../img/users/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

            $ext = pathinfo($_FILES['profile_img']['name'], PATHINFO_EXTENSION);
            $filename = 'user_' . uniqid() . '.' . $ext;
            
            if (move_uploaded_file($_FILES['profile_img']['tmp_name'], $uploadDir . $filename)) {
                $imagePath = 'img/users/' . $filename;
            }
        }

        // Criar utilizador com a foto
        $data = ["username" => $username, "email" => $email, "password" => $password];
        $ok = UserDAL::create($data, $imagePath); // Passamos a imagem aqui

        echo json_encode(["ok" => $ok]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["ok" => false, "error" => $e->getMessage()]);
    }
    exit;
}

// ---------- LOGOUT ----------
// Removemos a restrição de ser apenas "POST"
if (isset($_GET["logout"])) {
    
    // 1. Destruir a sessão (Logout efetivo)
    session_destroy();

    // 2. Verificar quem chamou: foi o Link (GET) ou o Javascript (POST)?
    
    if ($method === "GET") {
        // Se foi clicado no link, redireciona o utilizador para o Login
        header("Location: ../home.php");
        exit;
    }

    // Se foi via Javascript (POST), devolve JSON
    echo json_encode(["ok"=>true]);
    exit;
}

http_response_code(400);
echo json_encode(["error"=>"bad request"]);
