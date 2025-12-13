<?php
require_once __DIR__ . "/../config/db.php";

class UserDAL {

    // Buscar por Username
    public static function getByUsername($username) {
        $db = DB::conn();
        $stmt = $db->prepare("SELECT * FROM users WHERE username=?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // Buscar por Email
    public static function getByEmail($email) {
        $db = DB::conn();
        $stmt = $db->prepare("SELECT * FROM users WHERE email=?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // Buscar por ID
    public static function getById($id_user) {
        $db = DB::conn();
        $stmt = $db->prepare("SELECT * FROM users WHERE id_user=?");
        $stmt->bind_param("i", $id_user);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // ---------------------------------------------------------
    // CRIAR UTILIZADOR (ATUALIZADO PARA A TUA BD)
    // ---------------------------------------------------------
    public static function create($data, $profile_img = null) {
        $db = DB::conn();

        // 1. Receber os dados do array
        $username = $data["username"];
        $email    = $data["email"];
        $pass     = $data["password"];
        $name     = $data["name"];           // <--- Novo: Obrigatório na BD
        $dob      = $data["date_of_birth"];  // <--- Novo: Obrigatório na BD

        // 2. Criar Hash da password
        $hash = password_hash($pass, PASSWORD_DEFAULT);

        // 3. Preparar SQL (Uma única vez!)
        // Adicionei também 'date_of_joining' com a data atual (NOW())
        $sql = "INSERT INTO users (username, email, password_hash, name, date_of_birth, profile_img, date_of_joining) 
                VALUES (?, ?, ?, ?, ?, ?, NOW())";

        $stmt = $db->prepare($sql);

        if (!$stmt) {
            // Se der erro no SQL, mostra para debug (podes remover depois)
            die("Erro SQL: " . $db->error);
        }

        // "ssssss" = 6 strings (username, email, hash, name, dob, img)
        $stmt->bind_param("ssssss", $username, $email, $hash, $name, $dob, $profile_img);
        
        return $stmt->execute();
    }

    // ---------------------------------------------------------
    // ATUALIZAR DADOS
    // ---------------------------------------------------------
    public static function update($id_user, $username, $email, $profile_img) {
        $db = DB::conn();
        
        // Se houver nova imagem, atualiza tudo
        if ($profile_img) {
            $sql = "UPDATE users SET username=?, email=?, profile_img=? WHERE id_user=?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("sssi", $username, $email, $profile_img, $id_user);
        } else {
            // Se não houver imagem, atualiza só texto
            $sql = "UPDATE users SET username=?, email=? WHERE id_user=?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("ssi", $username, $email, $id_user);
        }
        
        return $stmt->execute();
    }
    
    // Atualizar Informações Pessoais
    public static function updateInfo($id_user, $name, $username, $email, $dob) {
        $db = DB::conn();
        
        $sql = "UPDATE users SET name=?, username=?, email=?, date_of_birth=? WHERE id_user=?";
        $stmt = $db->prepare($sql);
        
        if (!$stmt) return false;

        // ssssi = string, string, string, string, int
        $stmt->bind_param("ssssi", $name, $username, $email, $dob, $id_user);
        
        return $stmt->execute();
    }
    
    // Atualizar apenas a foto de perfil (Usado no User Page)
    public static function updateProfileImage($id_user, $path) {
        $db = DB::conn();
        $stmt = $db->prepare("UPDATE users SET profile_img = ? WHERE id_user = ?");
        $stmt->bind_param("si", $path, $id_user);
        return $stmt->execute();
    }  
    public static function updatePassword($id_user, $hash) {
    $db = DB::conn();
    $stmt = $db->prepare("UPDATE users SET password_hash = ? WHERE id_user = ?");
    $stmt->bind_param("si", $hash, $id_user);
    return $stmt->execute();
    }

}
