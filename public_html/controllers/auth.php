<?php
// Configurações de erro (podes comentar em produção)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Imports necessários
require_once __DIR__ . "/../dal/UserDAL.php";
require_once __DIR__ . "/../partials/bootstrap.php";

// Definir que a resposta é JSON
header("Content-Type: application/json; charset=utf-8");

$method = $_SERVER["REQUEST_METHOD"];

// =========================================================
// 1. LOGIN
// =========================================================
if ($method === "POST" && isset($_GET["login"])) {
    // Recebe JSON raw
    $data = json_decode(file_get_contents("php://input"), true);

    $username = trim($data["username"] ?? "");
    $password = $data["password"] ?? "";

    $user = UserDAL::getByUsername($username);

    if (!$user || !password_verify($password, $user["password_hash"])) {
        http_response_code(401);
        echo json_encode(["ok"=>false, "error"=>"invalid credentials"]);
        exit;
    }

    // Login sucesso: criar sessão
    $_SESSION["id_user"] = $user["id_user"];
    
    echo json_encode([
        "ok"=>true, 
        "id_user"=>$user["id_user"], 
        "username"=>$user["username"]
    ]);
    exit;
}

// =========================================================
// 2. REGISTER (CORRIGIDO E COMPLETO)
// =========================================================
if ($method === "POST" && isset($_GET["register"])) {
    // Desligar erros visuais para não estragar o JSON
    ini_set('display_errors', 0);

    try {
        // Receber os campos via POST (FormData do JS)
        $name     = $_POST['name'] ?? '';          
        $dob      = $_POST['date_of_birth'] ?? ''; 
        $username = $_POST['username'] ?? '';
        $email    = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';

        // Validar se está tudo preenchido
        if (!$name || !$dob || !$username || !$email || !$password) {
            throw new Exception("Please fill all fields");
        }

        // Validações de duplicados
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
            // Criar pasta se não existir
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

            $ext = pathinfo($_FILES['profile_img']['name'], PATHINFO_EXTENSION);
            $filename = 'user_' . uniqid() . '.' . $ext;
            
            if (move_uploaded_file($_FILES['profile_img']['tmp_name'], $uploadDir . $filename)) {
                $imagePath = 'img/users/' . $filename;
            }
        }

        // Preparar array para o DAL
        $data = [
            "name"          => $name,
            "date_of_birth" => $dob,
            "username"      => $username, 
            "email"         => $email, 
            "password"      => $password
        ];

        // Passamos os dados e a imagem para o UserDAL
        $ok = UserDAL::create($data, $imagePath);

        if ($ok) {
            echo json_encode(["ok" => true]);
        } else {
            throw new Exception("Database error inserting user");
        }

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["ok" => false, "error" => $e->getMessage()]);
    }
    exit;
}

// =========================================================
// 3. LOGOUT
// =========================================================
if (isset($_GET["logout"])) {
    session_destroy();

    if ($method === "GET") {
        header("Location: ../home.php");
        exit;
    }

    echo json_encode(["ok"=>true]);
    exit;
}

// Se não entrar em nenhum if
http_response_code(400);
echo json_encode(["error"=>"bad request"]);