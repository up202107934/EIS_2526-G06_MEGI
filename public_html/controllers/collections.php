<?php
require_once __DIR__ . "/../partials/bootstrap.php";
require_once __DIR__ . "/../dal/CollectionDAL.php";

header("Content-Type: application/json; charset=utf-8");

// -------- GET (Ler coleções) --------
if ($_SERVER["REQUEST_METHOD"] === "GET") {

    // MODO MINHAS COLEÇÕES
    if (isset($_GET["mine"]) && $_GET["mine"] == "1") {
        if (!isLoggedIn()) {
            http_response_code(401);
            echo json_encode(["ok" => false, "error" => "not logged in"]);
            exit;
        }
        echo json_encode(CollectionDAL::getByUser(currentUserId()));
        exit;
    }

    // MODO GLOBAL
    echo json_encode(CollectionDAL::getAll());
    exit;
}

// -------- POST (Criar coleção) --------
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // 1. Verificar Login
    if (!isLoggedIn()) {
        http_response_code(401);
        echo json_encode(["ok" => false, "error" => "not logged in"]);
        exit;
    }

    // 2. Receber dados via FormData ($_POST e $_FILES)
    // Se usasses JSON, isto estaria vazio. Com FormData, o PHP preenche o $_POST.
    $name = $_POST["name"] ?? null;
    $categoryId = $_POST["id_collection_category"] ?? null;
    $date = $_POST["creation_date"] ?? null;
    $description = $_POST["description"] ?? ""; // <--- AQUI ESTÁ A DESCRIÇÃO

    if (!$name || !$categoryId || !$date) {
        http_response_code(400);
        echo json_encode(["ok" => false, "error" => "missing fields"]);
        exit;
    }

    $id_user = currentUserId();
    $imagePath = null; // Começa vazio

    // 3. Upload da Imagem
    if (isset($_FILES['cover_img']) && $_FILES['cover_img']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/../img/covers/';
        
        // Se a pasta não existir, cria-a
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $ext = pathinfo($_FILES['cover_img']['name'], PATHINFO_EXTENSION);
        $filename = 'col_' . uniqid() . '.' . $ext;
        
        if (move_uploaded_file($_FILES['cover_img']['tmp_name'], $uploadDir . $filename)) {
            $imagePath = 'img/covers/' . $filename; // <--- AQUI ESTÁ O CAMINHO DA IMAGEM
        }
    }

    // 4. Gravar na BD (Agora enviamos as 6 coisas!)
    // Antes estavas a enviar só 4, por isso dava erro.
    $newId = CollectionDAL::create(
        $id_user,
        (int)$categoryId,
        $name,
        $description, // Novo
        $imagePath,   // Novo
        $date
    );

    if ($newId) {
        echo json_encode(["ok" => true, "id_collection" => $newId]);
    } else {
        http_response_code(500);
        echo json_encode(["ok" => false, "error" => "Database error"]);
    }
    exit;
}

// Se não for GET nem POST
http_response_code(405);
echo json_encode(["error" => "method not allowed"]);