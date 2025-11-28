<?php
require_once __DIR__ . "/../config/db.php";

class UserDAL {

    public static function getByUsername($username) {
        $db = DB::conn();
        $stmt = $db->prepare("SELECT * FROM users WHERE username=?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    
    
    public static function getByEmail($email) {
        $db = DB::conn();
        $stmt = $db->prepare("SELECT * FROM users WHERE email=?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public static function create($data) {
        $db = DB::conn();

        $username = $data["username"];
        $email = $data["email"]; // tens que adicionar a coluna email primeiro
        $pass = $data["password"];

        $hash = password_hash($pass, PASSWORD_DEFAULT);

        $stmt = $db->prepare("INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $username,$hash,$email);
        
        // Inserir com a imagem
        $stmt = $db->prepare("INSERT INTO users (username, password_hash, email, profile_img) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $username, $hash, $email, $profile_img);

        return $stmt->execute();
    }
public static function update($id_user, $username, $email, $profile_img) {
        $db = DB::conn();
        
        // Se a imagem for null, não a atualizamos (mantemos a antiga)
        if ($profile_img) {
            $sql = "UPDATE users SET username=?, email=?, profile_img=? WHERE id_user=?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("sssi", $username, $email, $profile_img, $id_user);
        } else {
            $sql = "UPDATE users SET username=?, email=? WHERE id_user=?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param("ssi", $username, $email, $id_user);
        }
        
        return $stmt->execute();
    }
    
// Atualizar apenas a foto de perfil
    public static function updateProfileImage($id_user, $path) {
        $db = DB::conn();
        $stmt = $db->prepare("UPDATE users SET profile_img = ? WHERE id_user = ?");
        $stmt->bind_param("si", $path, $id_user);
        return $stmt->execute();
    }    
    
public static function getById($id_user) {
        $db = DB::conn();
        // Correção: Mudei de 'WHERE id=?' para 'WHERE id_user=?'
        $stmt = $db->prepare("SELECT * FROM users WHERE id_user=?");
        $stmt->bind_param("i", $id_user);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }


}
